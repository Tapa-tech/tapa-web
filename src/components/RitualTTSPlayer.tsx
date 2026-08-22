"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, X, RefreshCw } from "lucide-react";

interface AudioSection {
  id: string;
  title: string;
  text: string;
}

interface RitualTTSPlayerProps {
  queue: AudioSection[];
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  playbackState: "IDLE" | "PLAYING" | "PAUSED" | "FINISHED";
  setPlaybackState: (state: "IDLE" | "PLAYING" | "PAUSED" | "FINISHED") => void;
  lang: "EN" | "HI";
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/([.।?!])/)
    .reduce((acc: string[], val: string, idx: number) => {
      if (idx % 2 === 0) {
        if (val.trim()) {
          acc.push(val.trim());
        }
      } else {
        if (acc.length > 0) {
          acc[acc.length - 1] += val;
        }
      }
      return acc;
    }, []);
}

function makeSpeechFriendly(text: string, lang: "EN" | "HI"): string {
  if (!text) return "";
  let cleaned = text
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\bvs\b/gi, "versus")
    .replace(/\bapprox\b/gi, "approximately")
    .replace(/\bmin\b/gi, "minutes")
    .replace(/\bhr\b/gi, "hours")
    .replace(/\bhrs\b/gi, "hours")
    .replace(/\bmuhurta\b/gi, "moo-hoo-rat")
    .replace(/\bpuja\b/gi, "poo-jah")
    .replace(/\bpujan\b/gi, "poo-jahn")
    .replace(/\bvrat\b/gi, "vruht")
    .replace(/\bsatvik\b/gi, "saht-vik")
    .replace(/\babhijit\b/gi, "ubh-ee-jit")
    .replace(/\brahukalam\b/gi, "rah-hoo kaht-lum")
    .replace(/[◆◆·•\-\/\\]/g, " ");

  if (lang === "EN") {
    // Remove Devnagari characters for English voice engines
    cleaned = cleaned.replace(/[\u0900-\u097F]/g, "");
  }
  return cleaned.replace(/\s+/g, " ").trim();
}

function getTransitionSentence(sectionId: string, title: string, index: number, lang: "EN" | "HI"): string {
  if (index === 0 || sectionId === "intro-section") return "";

  if (lang === "HI") {
    if (sectionId === "story-section") {
      return `अब, इस अनुष्ठान की पौराणिक कथा सुनते हैं: ${title}।`;
    }
    if (sectionId === "sankalpa-section") {
      return "अगला, आइए संकल्प लेते हैं।";
    }
    if (sectionId.startsWith("step-section-")) {
      const stepNum = sectionId.replace("step-section-", "");
      if (stepNum === "0") {
        return "अब, मैं आपको पूजा की चरण-दर-चरण विधि बताऊंगा।";
      }
      return "";
    }
    if (sectionId.startsWith("mantra-section-")) {
      const mantraNum = sectionId.replace("mantra-section-", "");
      if (mantraNum === "0") {
        return "आइए अब मुख्य पूजा मंत्रों का जाप करें।";
      }
      return "";
    }
    if (sectionId === "samagri-section") {
      return "अगला, पूजा के लिए आवश्यक सामग्री की सूची देखते हैं।";
    }
    if (sectionId === "fasting-section") {
      return "आइए उपवास और व्रत रखने के नियमों को समझते हैं।";
    }
    if (sectionId.startsWith("myth-section-")) {
      const mythNum = sectionId.replace("myth-section-", "");
      if (mythNum === "0") {
        return "आइए अब कुछ भ्रांतियों और उनके निवारण को देखते हैं।";
      }
      return "";
    }
    if (sectionId === "aarti-section") {
      return "अंत में, आइए पूजा की आरती करते हैं।";
    }
    return `अगला खंड, ${title}।`;
  }

  // English transitions
  if (sectionId === "story-section") {
    return `Now, let's listen to the scriptural story of this ritual: ${title}.`;
  }
  if (sectionId === "sankalpa-section") {
    return "Next, let's state our intent with the Sankalpa vow.";
  }
  if (sectionId.startsWith("step-section-")) {
    const stepNum = sectionId.replace("step-section-", "");
    if (stepNum === "0") {
      return "Next, I'll guide you through the step-by-step procedures of the puja.";
    }
    return "";
  }
  if (sectionId.startsWith("mantra-section-")) {
    const mantraNum = sectionId.replace("mantra-section-", "");
    if (mantraNum === "0") {
      return "Now, let's recite the primary puja mantras.";
    }
    return "";
  }
  if (sectionId === "samagri-section") {
    return "Next, let's verify the required samagri items you will need.";
  }
  if (sectionId === "fasting-section") {
    return "Let's review the guidelines and scriptural rules for keeping the fasting vow.";
  }
  if (sectionId.startsWith("myth-section-")) {
    const mythNum = sectionId.replace("myth-section-", "");
    if (mythNum === "0") {
      return "Now, let's clear some common myths and scriptural corrections.";
    }
    return "";
  }
  if (sectionId === "aarti-section") {
    return "Finally, let's complete the ritual devotions with the Puja Aarti.";
  }

  return `Next, let's move to the section on ${title}.`;
}

export default function RitualTTSPlayer({
  queue,
  setActiveSectionId,
  playbackState,
  setPlaybackState,
  lang,
}: RitualTTSPlayerProps) {
  const [speed, setSpeed] = useState<number>(1);
  const [voice, setVoice] = useState<string>("nova"); // Default to nova (Warm Female)
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [speechEngine, setSpeechEngine] = useState<"NEURAL" | "BROWSER">("NEURAL");
  const [audioLoading, setAudioLoading] = useState<boolean>(false);

  const sentencesRef = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isCleaningRef = useRef<boolean>(false); // Race condition protection flag

  // Sync active play state
  useEffect(() => {
    isPlayingRef.current = playbackState === "PLAYING";
  }, [playbackState]);

  // Keep browser voices warm and awake
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    const wakeVoices = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };
    
    wakeVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = wakeVoices;
    }
  }, []);

  // Check neural TTS availability on mount to prevent async user gesture expiration issues
  useEffect(() => {
    fetch("/api/tts")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.available) {
          console.log("[TTS] Premium Neural narration is active on server.");
          setSpeechEngine("NEURAL");
        } else {
          console.log("[TTS] Neural engine not available on server, defaulting to browser speech synthesis.");
          setSpeechEngine("BROWSER");
        }
      })
      .catch(() => {
        console.log("[TTS] Failed to verify API key, defaulting to browser fallback.");
        setSpeechEngine("BROWSER");
      });
  }, []);

  // Clean up all voice services on unmount
  useEffect(() => {
    return () => {
      console.log("[TTS] Player unmounting. Cleaning up resources.");
      cleanupAudio();
      cleanupBrowserSpeech();
    };
  }, []);

  const cleanupAudio = () => {
    isCleaningRef.current = true;
    if (audioRef.current) {
      console.log("[TTS] Cleaning up HTML5 Audio element.");
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
  };

  const cleanupBrowserSpeech = () => {
    isCleaningRef.current = true;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      console.log("[TTS] Cancelling active browser SpeechSynthesis.");
      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("SpeechSynthesis cancel failed:", e);
      }
    }
    currentUtteranceRef.current = null;
  };

  const speakCurrentSentence = async () => {
    console.log(`[TTS] speakCurrentSentence() -> section: ${currentSectionIndex}, sentence: ${currentSentenceIndex}, lang: ${lang}`);
    
    // Stop all active voice playback before starting a new sentence
    cleanupAudio();
    cleanupBrowserSpeech();

    if (playbackState === "IDLE" || playbackState === "FINISHED") {
      console.log("[TTS] Player is idle or finished. Aborting speech.");
      return;
    }

    const currentSection = queue[currentSectionIndex];
    if (!currentSection) {
      console.log("[TTS] Target section is undefined. Ending queue playback.");
      setPlaybackState("FINISHED");
      setActiveSectionId(null);
      return;
    }

    // Highlight the active section block in client UI
    console.log(`[TTS] Highlighting active section: ${currentSection.id}`);
    setActiveSectionId(currentSection.id);

    // Extract text into sentences if beginning a new section
    if (currentSentenceIndex === 0 || sentencesRef.current.length === 0) {
      console.log(`[TTS] Extracting sentences for Section: ${currentSection.title}`);
      const cleanText = makeSpeechFriendly(currentSection.text, lang);
      const sentences = splitIntoSentences(cleanText);

      // Prepend dynamic section transitions
      const transitionPrefix = getTransitionSentence(currentSection.id, currentSection.title, currentSectionIndex, lang);
      if (transitionPrefix && sentences.length > 0) {
        sentences[0] = `${transitionPrefix} ${sentences[0]}`;
      } else if (transitionPrefix && sentences.length === 0) {
        sentences.push(transitionPrefix);
      }
      sentencesRef.current = sentences;
      console.log(`[TTS] Text extracted successfully. Chunks:`, sentences);
    }

    const sentence = sentencesRef.current[currentSentenceIndex];

    // Check boundary to advance sections
    if (!sentence || currentSentenceIndex >= sentencesRef.current.length) {
      if (currentSectionIndex + 1 < queue.length) {
        console.log(`[TTS] Advancing to next section index: ${currentSectionIndex + 1}`);
        setCurrentSectionIndex((prev) => prev + 1);
        setCurrentSentenceIndex(0);
        sentencesRef.current = [];
      } else {
        console.log("[TTS] Narration queue empty. Completing guide.");
        setPlaybackState("FINISHED");
        setActiveSectionId(null);
      }
      return;
    }

    // Speak sentence via premium Neural Engine proxy
    if (speechEngine === "NEURAL") {
      setAudioLoading(true);
      console.log(`[TTS] Requesting neural narration. Text: "${sentence}"`);
      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: sentence,
            voice: voice,
            speed: speed,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.warn("[TTS] Premium Neural API failed, switching to browser engine fallback. Response:", errData);
          setSpeechEngine("BROWSER");
          setAudioLoading(false);
          return;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        console.log(`[TTS] Audio blob created, size: ${audioBlob.size} bytes. Loading audio stream.`);

        audio.onended = () => {
          console.log("[TTS] Neural audio chunk finished playing.");
          URL.revokeObjectURL(audioUrl);
          if (isPlayingRef.current && !isCleaningRef.current) {
            setCurrentSentenceIndex((prev) => prev + 1);
          }
        };

        audio.onerror = (e) => {
          console.error("[TTS] Audio playback engine failed:", e);
          URL.revokeObjectURL(audioUrl);
          if (isPlayingRef.current && !isCleaningRef.current) {
            setCurrentSentenceIndex((prev) => prev + 1);
          }
        };

        audioRef.current = audio;
        isCleaningRef.current = false; // Reset cleanup block flag before starting new stream
        setAudioLoading(false);
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log("[TTS] Audio playback started successfully."))
            .catch((playErr) => {
              console.error("[TTS] Browser blocked audio auto-play:", playErr);
              setSpeechEngine("BROWSER");
            });
        }
      } catch (err) {
        console.error("[TTS] Neural engine request failed:", err);
        setSpeechEngine("BROWSER");
        setAudioLoading(false);
      }
    } else {
      // Speak sentence via browser synthesis fallback
      speakBrowserSpeech(sentence);
    }
  };

  const speakBrowserSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("[TTS] SpeechSynthesis not supported on this browser.");
      if (isPlayingRef.current && !isCleaningRef.current) {
        setCurrentSentenceIndex((prev) => prev + 1);
      }
      return;
    }

    console.log(`[TTS] Speaking browser fallback. Text: "${text}", lang: ${lang}`);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice matches
    const allVoices = window.speechSynthesis.getVoices();
    let mappedVoice = null;

    if (lang === "HI") {
      mappedVoice = allVoices.find((v) => v.lang.startsWith("hi") || v.lang.startsWith("hi-IN"));
    } else {
      mappedVoice =
        voice === "nova"
          ? allVoices.find((v) => v.lang.startsWith("en") && v.localService && (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("karen") || v.name.toLowerCase().includes("hazel")))
          : allVoices.find((v) => v.lang.startsWith("en") && v.localService && (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("george")));
    }

    if (mappedVoice && mappedVoice.localService) {
      utterance.voice = mappedVoice;
      console.log(`[TTS] Selected local browser fallback voice: ${mappedVoice.name}`);
    } else {
      // Fallback: search for any english local service voice
      const localEnglishVoice = allVoices.find((v) => v.lang.startsWith("en") && v.localService);
      if (localEnglishVoice) {
        utterance.voice = localEnglishVoice;
        console.log(`[TTS] Selected default local English voice: ${localEnglishVoice.name}`);
      } else {
        console.log(`[TTS] Using default system voice (no local English voice found).`);
      }
    }
    
    // Set appropriate language tag
    utterance.lang = lang === "HI" ? "hi-IN" : "en-US";
    utterance.rate = speed;

    utterance.onend = () => {
      console.log("[TTS] Browser SpeechSynthesis utterance ended.");
      currentUtteranceRef.current = null;
      if (isPlayingRef.current && !isCleaningRef.current) {
        setCurrentSentenceIndex((prev) => prev + 1);
      }
    };

    utterance.onerror = (event) => {
      console.warn("[TTS] Browser SpeechSynthesis error event:", event);
      currentUtteranceRef.current = null;
      // Do not skip if error was caused by programmatic cleanup/pauses
      if (event.error !== "interrupted" && event.error !== "canceled" && isPlayingRef.current && !isCleaningRef.current) {
        setCurrentSentenceIndex((prev) => prev + 1);
      }
    };

    currentUtteranceRef.current = utterance;
    isCleaningRef.current = false;

    // Resume globally before speaking to recover from any stuck/paused engine states
    try {
      window.speechSynthesis.resume();
    } catch (e) {
      console.warn("[TTS] Global resume failed:", e);
    }

    window.speechSynthesis.speak(utterance);
  };

  // State coordination effect loop
  useEffect(() => {
    if (playbackState === "PLAYING") {
      // Resume playback instead of recreating stream if already paused
      if (speechEngine === "NEURAL" && audioRef.current && audioRef.current.paused) {
        console.log("[TTS] Resuming paused neural audio stream.");
        audioRef.current.play().catch(() => speakCurrentSentence());
        return;
      }
      if (speechEngine === "BROWSER" && window.speechSynthesis && window.speechSynthesis.paused) {
        console.log("[TTS] Resuming paused browser SpeechSynthesis.");
        window.speechSynthesis.resume();
        return;
      }

      speakCurrentSentence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSectionIndex, currentSentenceIndex, speed, voice, speechEngine, playbackState, lang]);

  // Handle Play/Pause actions
  const handlePlayPause = () => {
    if (playbackState === "PLAYING") {
      console.log("[TTS] Pause clicked.");
      setPlaybackState("PAUSED");
      if (speechEngine === "NEURAL" && audioRef.current) {
        audioRef.current.pause();
      } else if (speechEngine === "BROWSER" && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
    } else if (playbackState === "PAUSED") {
      console.log("[TTS] Play/Resume clicked.");
      setPlaybackState("PLAYING");
      if (speechEngine === "NEURAL" && audioRef.current) {
        audioRef.current.play().catch(() => {
          setPlaybackState("PLAYING");
        });
      } else if (speechEngine === "BROWSER" && window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
    } else {
      console.log("[TTS] Starting playback queue from beginning.");
      setCurrentSectionIndex(0);
      setCurrentSentenceIndex(0);
      sentencesRef.current = [];
      setPlaybackState("PLAYING");
    }
  };

  // Reset/Cancel playback
  const handleStop = () => {
    console.log("[TTS] Stop/Reset clicked.");
    setPlaybackState("IDLE");
    setActiveSectionId(null);
    setCurrentSectionIndex(0);
    setCurrentSentenceIndex(0);
    sentencesRef.current = [];
    cleanupAudio();
    cleanupBrowserSpeech();
  };

  const handleNextSection = () => {
    console.log("[TTS] Skip Forward clicked.");
    if (currentSectionIndex + 1 < queue.length) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentSentenceIndex(0);
      sentencesRef.current = [];
    } else {
      cleanupAudio();
      cleanupBrowserSpeech();
      setActiveSectionId(null);
      setPlaybackState("FINISHED");
    }
  };

  const handlePrevSection = () => {
    console.log("[TTS] Skip Backward clicked.");
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentSentenceIndex(0);
      sentencesRef.current = [];
    } else {
      setCurrentSentenceIndex(0);
      speakCurrentSentence();
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  if (playbackState === "FINISHED") {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg bg-[#F2FAF6] border border-[#D1F2E2] rounded-2xl p-4 shadow-xl flex items-center justify-between font-sans animate-slideUp">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#1D8A56] text-white flex items-center justify-center font-bold text-xs">✓</div>
          <div>
            <span className="font-bold text-sm text-[#1D8A56] block">
              {lang === "HI" ? "आपने इस मार्गदर्शिका को पूरा सुन लिया है।" : "You've finished listening to this guide."}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentSectionIndex(0);
              setCurrentSentenceIndex(0);
              sentencesRef.current = [];
              setPlaybackState("PLAYING");
            }}
            className="flex items-center gap-1.5 bg-[#1D8A56] hover:bg-[#156E43] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>{lang === "HI" ? "पुनः सुनें" : "Listen Again"}</span>
          </button>
          <button
            onClick={handleStop}
            className="p-1.5 hover:bg-[#D1F2E2] rounded-full text-[#1D8A56] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (playbackState === "IDLE") return null;

  const currentSection = queue[currentSectionIndex];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg bg-white border border-[#EADFC9] rounded-2xl p-4 shadow-xl flex flex-col gap-3 font-sans animate-slideUp">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#FAF6EC] pb-2">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className={`text-[#C82A54] ${playbackState === "PLAYING" && !audioLoading ? "animate-pulse" : ""}`} />
          <div>
            <span className="text-[10px] font-bold text-[#8A7A6E] uppercase tracking-wider block leading-none">
              {audioLoading ? "🔄 Loading Neural audio..." : playbackState === "PLAYING" ? (lang === "HI" ? "🔊 श्रवण जारी है" : "🔊 Listening to") : (lang === "HI" ? "⏸ रुका हुआ" : "⏸ Paused")}
            </span>
            <span className="font-serif font-bold text-sm text-[#3A332C] block mt-0.5 max-w-[240px] truncate">
              {currentSection?.title || "Completing guide..."}
            </span>
          </div>
        </div>
        <button
          onClick={handleStop}
          className="p-1 hover:bg-[#FAF6EC] rounded-full text-[#8A7A6E] hover:text-[#3A332C] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>



      {/* Controller Buttons */}
      <div className="flex items-center justify-between px-1 gap-2">
        {/* Voice Selector */}
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="text-xs font-bold text-[#6A5A4E] bg-[#FAF6EC] border border-[#EADFC9] rounded-xl px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C82A54] cursor-pointer"
        >
          <option value="alloy">👦 Calm Male</option>
          <option value="nova">👧 Warm Female</option>
          <option value="echo">🎙️ Natural Narrator</option>
        </select>

        {/* Core playback controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
            className="p-1.5 hover:bg-[#FAF6EC] disabled:opacity-30 rounded-lg text-[#6A5A4E] transition-colors cursor-pointer"
            title="Previous Section"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={handlePlayPause}
            disabled={audioLoading}
            className="p-2.5 bg-[#C82A54] hover:bg-[#B02047] text-white rounded-full shadow-md transition-transform active:scale-95 disabled:opacity-60 cursor-pointer"
            title={playbackState === "PLAYING" ? "Pause" : "Play"}
          >
            {playbackState === "PLAYING" ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
          </button>

          <button
            onClick={handleStop}
            className="p-1.5 hover:bg-[#FAF6EC] rounded-lg text-[#6A5A4E] transition-colors cursor-pointer"
            title="Stop Playback"
          >
            <Square size={16} fill="currentColor" />
          </button>

          <button
            onClick={handleNextSection}
            className="p-1.5 hover:bg-[#FAF6EC] rounded-lg text-[#6A5A4E] transition-colors cursor-pointer"
            title="Next Section"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed & Progress tracker */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCycleSpeed}
            className="text-[10px] font-bold text-[#6A5A4E] hover:text-[#C82A54] bg-[#FAF6EC] border border-[#EADFC9] rounded-xl px-2 py-1.5 transition-colors cursor-pointer"
          >
            {speed}x
          </button>
          <div className="text-[10px] font-bold text-[#8A7A6E] bg-[#FAF6EC] border border-[#EADFC9] px-2 py-1.5 rounded-xl">
            {currentSectionIndex + 1}/{queue.length}
          </div>
        </div>
      </div>
    </div>
  );
}
