import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voice, speed } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Text parameter is required." },
        { status: 400 }
      );
    }

    const elevenApiKey = process.env.ELEVENLABS_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // 1. ElevenLabs Premium Neural Narration
    if (elevenApiKey && elevenApiKey !== "mock-elevenlabs-key") {
      console.log(`[TTS Route] Using ElevenLabs engine. Voice input: ${voice}`);
      
      // Map voices to ElevenLabs premium IDs
      let elevenVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel (Warm Female) default
      if (voice === "alloy") {
        elevenVoiceId = "pNInz6obpgqjVW4Xtk7T"; // Adam (Calm Male)
      } else if (voice === "echo") {
        elevenVoiceId = "2EiwWnXF2V4j26kTaIy5"; // Clyde (Natural Narrator)
      }

      console.log(`[TTS Route] ElevenLabs voice selected: ${elevenVoiceId}`);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenVoiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": elevenApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2", // Multilingual v2 supports EN, HI, and Sanskrit beautifully
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("ElevenLabs TTS API error response:", errText);
        // Fall back to OpenAI if key is present, otherwise return error
        if (openaiApiKey && openaiApiKey !== "mock-openai-key") {
          console.warn("[TTS Route] ElevenLabs API failed. Falling back to OpenAI TTS.");
        } else {
          return NextResponse.json(
            { error: "ELEVENLABS_ERROR", message: "Failed to generate ElevenLabs speech." },
            { status: response.status }
          );
        }
      } else {
        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.byteLength.toString(),
          },
        });
      }
    }

    // 2. OpenAI Neural Narration Fallback
    if (openaiApiKey && openaiApiKey !== "mock-openai-key") {
      console.log(`[TTS Route] Using OpenAI engine. Voice input: ${voice}`);
      
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: voice || "alloy",
          speed: speed || 1.0,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI TTS API error response:", errText);
        return NextResponse.json(
          { error: "OPENAI_ERROR", message: "Failed to generate OpenAI speech." },
          { status: response.status }
        );
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBuffer.byteLength.toString(),
        },
      });
    }

    // 3. Missing API Keys
    return NextResponse.json(
      { 
        error: "MISSING_API_KEYS", 
        message: "Please configure ELEVENLABS_API_KEY or OPENAI_API_KEY in your .env file." 
      },
      { status: 400 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error in TTS route handler:", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const elevenApiKey = process.env.ELEVENLABS_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  const isElevenAvailable = !!elevenApiKey && elevenApiKey !== "" && elevenApiKey !== "mock-elevenlabs-key";
  const isOpenaiAvailable = !!openaiApiKey && openaiApiKey !== "" && openaiApiKey !== "mock-openai-key";

  return NextResponse.json({
    available: isElevenAvailable || isOpenaiAvailable,
  });
}
