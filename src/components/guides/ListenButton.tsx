"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakText, stopSpeaking } from "@/lib/tts/speak";

interface ListenButtonProps {
  text: string;
  label: string;
  audioUrl?: string | null;
  lang?: string;
  rate?: number;
  className?: string;
  iconOnly?: boolean;
}

export default function ListenButton({
  text,
  label,
  audioUrl,
  lang = "hi-IN",
  rate = 0.92,
  className = "",
  iconOnly = false,
}: ListenButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    
    if (typeof window !== "undefined") {
      if (!audioUrl && !("speechSynthesis" in window)) {
        setSupported(false);
      }
    }
    
    
    return () => {
      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        stopSpeaking();
      }
    };
  }, [audioUrl]);

  
  useEffect(() => {
    if (audioUrl && typeof window !== "undefined") {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      const onEnded = () => setIsPlaying(false);
      const onPause = () => setIsPlaying(false);
      const onPlay = () => setIsPlaying(true);

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("play", onPlay);

      return () => {
        audio.pause();
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("pause", onPause);
        audio.removeEventListener("play", onPlay);
        audioRef.current = null;
      };
    }
  }, [audioUrl]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (audioUrl) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        
        stopSpeaking();
        
        window.dispatchEvent(new CustomEvent("tapa-tts-stop-all"));
        audioRef.current.play().catch(err => {
          console.warn("Failed to play audio file:", err);
        });
      }
      return;
    }

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      
      window.dispatchEvent(new CustomEvent("tapa-tts-stop-all"));

      const result = speakText(text, {
        lang,
        rate,
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });

      if (!result.supported) {
        setSupported(false);
      }
    }
  };

  
  useEffect(() => {
    const handleStopAll = () => {
      if (audioUrl) {
        if (audioRef.current && isPlaying) {
          audioRef.current.pause();
        }
      } else {
        setIsPlaying(false);
      }
    };

    window.addEventListener("tapa-tts-stop-all", handleStopAll);
    return () => {
      window.removeEventListener("tapa-tts-stop-all", handleStopAll);
    };
  }, [audioUrl, isPlaying]);

  if (!supported) {
    return (
      <button 
        className={`${className} opacity-50 cursor-not-allowed`} 
        disabled 
        title="Audio playback not supported in this browser"
      >
        🔇 {label}
      </button>
    );
  }

  return (
    <button
      onClick={handlePlayPause}
      className={`${className} transition-all`}
    >
      {iconOnly ? (isPlaying ? "⏸" : "▶") : (isPlaying ? "⏸ Stop" : `▶ ${label}`)}
    </button>
  );
}
