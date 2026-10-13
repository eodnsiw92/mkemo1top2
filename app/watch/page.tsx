
"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SIGNAL_URL =
  process.env.NEXT_PUBLIC_SIGNALING_URL || "";

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

type SignalMessage = {
  type: "offer" | "answer" | "candidate";
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export default function WatchPage() {
  const [room, setRoom] = useState("mkemo-room");
  const [joined, setJoined] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState("غير متصل");
  const [error, setError] = useState("");
  const [hasAudio, setHasAudio] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peersRef = useRef(
    new Map<string, RTCPeerConnection>()
  );
  const pendingIceRef = useRef(
    new Map<string, RTCIceCandidateInit[]>()
  );
  const isHostRef = useRef(false);
  const joinedRoomRef = useRef("");

  function sendSignal(to: string, data: SignalMessage) {
    socketRef.current?.emit("signal", {
      to,
      data
    });
  }

  async function flushIce(
    peerId: string,
    pc: RTCPeerConnection
  ) {
    const queued = pendingIceRef.current.get(peerId) || [];
    pendingIceRef.current.delete(peerId);

    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (e) {
        console.warn("Could not add queued ICE:", e);
      }
    }
  }

  function closePeer(peerId: string) {
    const pc = peersRef.current.get(peerId);
    if (pc) {
      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.close();
      peersRef.current.delete(peerId);
    }
    pendingIceRef.current.delete(peerId);
  }

  function makePeer(
    peerId: string,
    initiator: boolean
  ): RTCPeerConnection {
    const old = peersRef.current.get(peerId);
    if (old) return old;

    const pc = new RTCPeerConnection(ICE_CONFIG);
    peersRef.current.set(peerId, pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(peerId, {
          type: "candidate",
          candidate: event.candidate.toJSON()
        });
      }
    };

    pc.onconnectionstatechange = () => {
      setStatus(
        `اتصال ${peerId.slice(0, 6)}: ${pc.connectionState}`
      );

      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        // لا نحذف اتصالًا لمجرد مروره بحالة disconnected،
        // فقد يعود الاتصال بعد انقطاع الشبكة.
        closePeer(peerId);
      }
    };

    pc.ontrack = (event) => {
      const stream =
        event.streams[0] ||
        new MediaStream([event.track]);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch(() => {
          setStatus("اضغط تشغيل الفيديو لسماع الصوت");
        });
      }

      setStatus("وصل بث المشاهد");
    };

    if (initiator) {
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }
    }

    return pc;
  }

  async function offerViewer(viewerId: string) {
    if (!isHostRef.current || !localStreamRef.current) {
      return;
    }

    try {
      const pc = makePeer(viewerId, true);
      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

      if (pc.localDescription) {
        sendSignal(viewerId, {
          type: "offer",
          description: pc.localDescription
        });
      }
    } catch (e) {
      console.error(e);
      setError("تعذر إنشاء عرض WebRTC لهذا المشاهد.");
    }
  }

  async function handleSignal(
    from: string,
    data: SignalMessage
  ) {
    try {
      if (data.type === "offer" && data.description) {
        // المشاهد يستقبل العرض من المضيف.
        const pc = makePeer(from, false);

        await pc.setRemoteDescription(
          new RTCSessionDescription(data.description)
        );

        await flushIce(from, pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (pc.localDescription) {
          sendSignal(from, {
            type: "answer",
            description: pc.localDescription
          });
        }

        return;
      }

      const pc = peersRef.current.get(from);

      if (data.type === "answer" && data.description) {
        if (!pc) return;

        await pc.setRemoteDescription(
          new RTCSessionDescription(data.description)
        );

        await flushIce(from, pc);
        return;
      }

      if (data.type === "candidate" && data.candidate) {
        if (!pc || !pc.remoteDescription) {
          const queue =
            pendingIceRef.current.get(from) || [];

          queue.push(data.candidate);
          pendingIceRef.current.set(from, queue);
          return;
        }

        await pc.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    } catch (e) {
      console.error("WebRTC signal error:", e);
      setError(
        "فشل إعداد اتصال الفيديو. افتح وحدة التحكم لمعرفة التفاصيل."
      );
    }
  }

  function connectRoom() {
    setError("");

    if (!SIGNAL_URL) {
      setError(
        "رابط خادم الاتصال غير مضبوط. أضف NEXT_PUBLIC_SIGNALING_URL."
      );
      return;
    }

    if (!room.trim()) {
      setError("اكتب اسم الغرفة أولًا.");
      return;
    }

    if (socketRef.current) return;

    const socket = io(SIGNAL_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 8,
      timeout: 15000
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("متصل بالخادم؛ جاري دخول الغرفة...");
      socket.emit("room:join", { room: room.trim() });
    });

    socket.on("connect_error", (e) => {
      setError(`تعذر الاتصال بالخادم: ${e.message}`);
      setStatus("فشل اتصال الخادم");
    });

    socket.on("room:joined", (data) => {
      joinedRoomRef.current = data.room;
      setJoined(true);
      setStatus(
        data.hostReady
          ? "دخلت الغرفة؛ المضيف جاهز"
          : "دخلت الغرفة؛ بانتظار المضيف"
      );
    });

    socket.on("host:started", () => {
      setStatus("بدأت مشاركة الشاشة");
    });

    socket.on("host-ready", () => {
      setStatus("المضيف جاهز؛ جاري الاتصال...");
    });

    socket.on("viewer-joined", ({ viewerId }) => {
      void offerViewer(viewerId);
    });

    socket.on("signal", ({ from, data }) => {
      void handleSignal(from, data);
    });

    socket.on("viewer-left", ({ viewerId }) => {
      closePeer(viewerId);
    });

    socket.on("host-left", () => {
      for (const id of peersRef.current.keys()) {
        closePeer(id);
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      setStatus("توقفت مشاركة المضيف");
    });

    socket.on("app:error", (message) => {
      setError(String(message));
    });

    socket.on("disconnect", () => {
      setJoined(false);
      setStatus("انقطع الاتصال بالخادم");
    });
  }

  async function startShare() {
    setError("");

    if (!joined || !socketRef.current?.connected) {
      setError("اتصل بالغرفة أولًا.");
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError(
        "هذا المتصفح لا يدعم مشاركة الشاشة. جرّب متصفحًا يدعم getDisplayMedia وموقعًا يعمل عبر HTTPS."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

      localStreamRef.current = stream;
      isHostRef.current = true;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const audioAvailable =
        stream.getAudioTracks().length > 0;

      setHasAudio(audioAvailable);
      setSharing(true);

      stream.getVideoTracks()[0]?.addEventListener(
        "ended",
        stopShare,
        { once: true }
      );

      socketRef.current.emit("host:ready");
      setStatus(
        audioAvailable
          ? "الشاشة والصوت متاحان للبث"
          : "الشاشة جاهزة، لكن المتصفح لم يوفّر صوت المشاركة"
      );
    } catch (e) {
      const err = e as DOMException;

      if (err.name === "NotAllowedError") {
        setError("ألغيت المشاركة أو رفض المتصفح الإذن.");
      } else if (err.name === "NotSupportedError") {
        setError("المتصفح لا يدعم طريقة مشاركة الشاشة المطلوبة.");
      } else {
        setError(
          `تعذرت مشاركة الشاشة: ${err.message || err.name}`
        );
      }
    }
  }

  function stopShare() {
    socketRef.current?.emit("host:stop");
    isHostRef.current = false;

    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    localStreamRef.current = null;

    for (const id of peersRef.current.keys()) {
      closePeer(id);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setSharing(false);
    setHasAudio(false);
    setStatus("توقفت المشاركة");
  }

  function disconnectRoom() {
    if (isHostRef.current) stopShare();

    socketRef.current?.disconnect();
    socketRef.current = null;

    for (const id of peersRef.current.keys()) {
      closePeer(id);
    }

    joinedRoomRef.current = "";
    setJoined(false);
    setStatus("غير متصل");
  }

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peersRef.current.forEach((pc) => pc.close());
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 text-white">
      <h1 className="text-2xl font-bold">Mkemo Watch</h1>

      <p className="text-sm text-gray-400">{status}</p>

      <label className="block space-y-2">
        <span>اسم الغرفة</span>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          disabled={joined}
          className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3"
          placeholder="mkemo-room"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {!joined ? (
          <button
            onClick={connectRoom}
            className="rounded-lg bg-blue-600 px-4 py-3"
          >
            دخول الغرفة
          </button>
        ) : (
          <button
            onClick={disconnectRoom}
            className="rounded-lg bg-gray-700 px-4 py-3"
          >
            قطع الاتصال
          </button>
        )}

        {joined && !sharing && (
          <button
            onClick={startShare}
            className="rounded-lg bg-green-600 px-4 py-3"
          >
            مشاركة الشاشة والصوت
          </button>
        )}

        {sharing && (
          <button
            onClick={stopShare}
            className="rounded-lg bg-red-600 px-4 py-3"
          >
            إيقاف المشاركة
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500 p-3 text-red-300">
          {error}
        </div>
      )}

      {sharing && (
        <p className="text-sm text-gray-300">
          {hasAudio
            ? "تم الحصول على مسار صوت؛ هذا لا يضمن أن صوت الموقع نفسه مشمول."
            : "المتصفح لم يوفّر مسار صوت للمشاركة."}
        </p>
      )}

      <section className="space-y-2">
        <h2 className="font-semibold">معاينة المضيف</h2>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl bg-black"
        />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">بث المضيف عند المشاهد</h2>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          controls
          className="w-full rounded-xl bg-black"
        />
        <button
          onClick={() =>
            remoteVideoRef.current?.play().catch(() => {
              setError("اضغط تشغيل الفيديو أو تحقق من إعدادات الصوت.");
            })
          }
          className="rounded-lg bg-gray-700 px-4 py-2"
        >
          تشغيل الفيديو والصوت
        </button>
      </section>
    </main>
  );
}
