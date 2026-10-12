"use client"

import React, { useState } from "react"
import { MediaStage } from "@/components/media-stage"
import { MediaSearchHub } from "@/components/media-search-hub"

export function WatchRoom() {
  const [currentMedia, setCurrentMedia] = useState<{
    type: 'youtube' | 'web' | 'video';
    url: string;
    title: string;
  }>({
    type: 'web',
    url: '',
    title: 'No Media'
  });

  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#05060a] flex flex-col relative overflow-hidden">
      {/* Main Rave Stage & Chat */}
      <div className="flex-1 w-full h-full">
        <MediaStage
          mediaUrl={currentMedia.url}
          mediaType={currentMedia.type}
          title={currentMedia.title}
          onOpenSearch={() => setIsSearching(true)}
        />
      </div>

      {/* Web OS Search Hub Modal Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl relative">
            <button
              onClick={() => setIsSearching(false)}
              className="absolute -top-12 right-0 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
            >
              Close [X]
            </button>
            <MediaSearchHub
              onSelectMedia={(media) => {
                setCurrentMedia(media);
                setIsSearching(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
