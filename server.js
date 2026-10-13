
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

app.get("/", (_req, res) => {
  res.json({ service: "mkemo-signaling", status: "ok" });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      hostId: null,
      members: new Set()
    });
  }
  return rooms.get(roomId);
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("room:join", ({ room } = {}) => {
    if (typeof room !== "string") {
      socket.emit("app:error", "Invalid room");
      return;
    }

    const roomId = room.trim().replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 64);

    if (!roomId) {
      socket.emit("app:error", "Enter a valid room name");
      return;
    }

    if (socket.data.room) {
      socket.emit("app:error", "Already joined a room");
      return;
    }

    const state = getRoom(roomId);

    socket.data.room = roomId;
    state.members.add(socket.id);
    socket.join(roomId);

    socket.emit("room:joined", {
      room: roomId,
      hostReady: Boolean(state.hostId)
    });

    socket.to(roomId).emit("member:joined", {
      memberId: socket.id
    });

    if (state.hostId && state.hostId !== socket.id) {
      socket.emit("host-ready");
      io.to(state.hostId).emit("viewer-joined", {
        viewerId: socket.id
      });
    }
  });

  socket.on("host:ready", () => {
    const roomId = socket.data.room;
    if (!roomId) return;

    const state = rooms.get(roomId);
    if (!state) return;

    if (state.hostId && state.hostId !== socket.id) {
      socket.emit("app:error", "This room already has a host");
      return;
    }

    state.hostId = socket.id;
    socket.emit("host:started");
    socket.to(roomId).emit("host-ready");

    for (const memberId of state.members) {
      if (memberId !== socket.id) {
        io.to(socket.id).emit("viewer-joined", {
          viewerId: memberId
        });
      }
    }
  });

  socket.on("signal", ({ to, data } = {}) => {
    const roomId = socket.data.room;
    if (!roomId || typeof to !== "string" || !data) return;

    const state = rooms.get(roomId);
    const target = io.sockets.sockets.get(to);

    // لا نسمح بتمرير الإشارات إلى جهاز خارج الغرفة.
    if (
      !state ||
      !state.members.has(to) ||
      !target ||
      target.data.room !== roomId
    ) {
      return;
    }

    target.emit("signal", {
      from: socket.id,
      data
    });
  });

  socket.on("host:stop", () => {
    const roomId = socket.data.room;
    const state = roomId && rooms.get(roomId);

    if (state && state.hostId === socket.id) {
      state.hostId = null;
      socket.to(roomId).emit("host-left");
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.room;
    if (!roomId) return;

    const state = rooms.get(roomId);
    if (!state) return;

    state.members.delete(socket.id);

    if (state.hostId === socket.id) {
      state.hostId = null;
      socket.to(roomId).emit("host-left");
    } else if (state.hostId) {
      io.to(state.hostId).emit("viewer-left", {
        viewerId: socket.id
      });
    }

    if (state.members.size === 0) {
      rooms.delete(roomId);
    }

    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mkemo signaling server listening on ${PORT}`);
});
