export function speakText(
  text: string,
  options?: { lang?: string; rate?: number; onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Web Speech API not supported in this browser");
    return { supported: false };
  }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set locale options
  utterance.lang = options?.lang ?? "hi-IN"; 
  utterance.rate = options?.rate ?? 0.92; // slightly slower than default for clarity on devotional and mantra content

  if (options?.onStart) {
    utterance.onstart = options.onStart;
  }
  
  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }
  
  utterance.onerror = (e) => {
    console.warn("Speech synthesis error:", e);
    options?.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
  return { supported: true, utterance };
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
