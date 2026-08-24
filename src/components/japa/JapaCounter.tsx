"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakText, stopSpeaking } from "@/lib/tts/speak";

interface JapaCounterProps {
  mantraText: string;
  initialCount?: number;
  initialPreset?: number;
  triggerToast?: (msg: string) => void;
}

export default function JapaCounter({
  mantraText,
  initialCount = 0,
  initialPreset = 108,
  triggerToast = () => {},
}: JapaCounterProps) {
  const [japaCount, setJapaCount] = useState(initialCount);
  const [japaPreset, setJapaPreset] = useState<number | null>(initialPreset);
  const [isChanting, setIsChanting] = useState(false);

  const countRef = useRef<number>(initialCount);
  const isChantingRef = useRef<boolean>(false);
  const sessionIdRef = useRef<string | null>(null);
  const presetRef = useRef<number>(initialPreset);

  
  useEffect(() => {
    countRef.current = japaCount;
  }, [japaCount]);

  useEffect(() => {
    isChantingRef.current = isChanting;
  }, [isChanting]);

  useEffect(() => {
    presetRef.current = japaPreset ?? 108;
  }, [japaPreset]);

  useEffect(() => {
    return () => {
      sessionIdRef.current = null;
      isChantingRef.current = false;
      stopSpeaking();
    };
  }, []);

  const runChantLoop = (sessionToken: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    const target = presetRef.current;
    if (sessionIdRef.current !== sessionToken) return;
    if (!isChantingRef.current) return;
    if (countRef.current >= target) {
      setIsChanting(false);
      return;
    }

    if (!mantraText) {
      setIsChanting(false);
      return;
    }

    speakText(mantraText, {
      onEnd: () => {
        if (sessionIdRef.current !== sessionToken) return;
        if (!isChantingRef.current) return;

        countRef.current += 1;
        setJapaCount(countRef.current);

        if (countRef.current >= target) {
          setIsChanting(false);
        } else {
          runChantLoop(sessionToken);
        }
      },
      onError: () => {
        if (sessionIdRef.current !== sessionToken) return;
        if (!isChantingRef.current) return;

        countRef.current += 1;
        setJapaCount(countRef.current);

        if (countRef.current >= target) {
          setIsChanting(false);
        } else {
          runChantLoop(sessionToken);
        }
      }
    });
  };

  const handlePlayPause = () => {
    const target = presetRef.current;
    if (countRef.current >= target) {
      triggerToast("Target already reached! Reset to play again.");
      return;
    }

    if (isChanting) {
      sessionIdRef.current = null;
      setIsChanting(false);
      stopSpeaking();
      triggerToast("Chanting paused");
    } else {
      setIsChanting(true);
      isChantingRef.current = true;
      const newSessionToken = Math.random().toString(36).substring(7);
      sessionIdRef.current = newSessionToken;
      runChantLoop(newSessionToken);
    }
  };

  const handlePreset = (preset: number) => {
    setJapaPreset(preset);
    presetRef.current = preset;
    
    if (countRef.current > preset) {
      sessionIdRef.current = null;
      setIsChanting(false);
      stopSpeaking();
      countRef.current = 0;
      setJapaCount(0);
      triggerToast(`Target changed to ${preset}. Counter reset.`);
    } else {
      triggerToast(`Japa target set to ${preset}`);
    }
  };

  const handleIncrement = () => {
    const target = presetRef.current;
    if (countRef.current >= target) return;

    countRef.current += 1;
    setJapaCount(countRef.current);
  };

  const handleDecrement = () => {
    if (countRef.current <= 0) return;

    countRef.current -= 1;
    setJapaCount(countRef.current);
  };

  const handleReset = () => {
    sessionIdRef.current = null;
    setIsChanting(false);
    stopSpeaking();
    countRef.current = 0;
    setJapaCount(0);
    setJapaPreset(null);
    presetRef.current = 108;
    triggerToast("Counter reset!");
  };

  return (
    <div className="japa select-none">
      <span className="jp-l">JAPA COUNTER</span>
      <div className="jp-ctr">
        <button onClick={handleDecrement} className="jp-b hover:bg-white/10">-</button>
        <div>
          <div className="jp-n">{japaCount}</div>
          <div className="jp-t">Target: {japaPreset ?? 108}</div>
        </div>
        <button onClick={handleIncrement} className="jp-b hover:bg-white/10">+</button>
      </div>
      
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "6px", marginBottom: "6px" }}>
        <button 
          onClick={handlePlayPause} 
          className={`jp-p ${isChanting ? "on" : ""}`}
          style={{ maxWidth: "200px", padding: "8px 24px" }}
        >
          {isChanting ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>

      <div className="jp-presets">
        <button onClick={() => handlePreset(11)} className={`jp-p ${japaPreset === 11 ? "on" : ""}`}>11</button>
        <button onClick={() => handlePreset(21)} className={`jp-p ${japaPreset === 21 ? "on" : ""}`}>21</button>
        <button onClick={() => handlePreset(108)} className={`jp-p ${japaPreset === 108 ? "on" : ""}`}>108</button>
        <button onClick={handleReset} className="jp-p">Reset</button>
      </div>
    </div>
  );
}
