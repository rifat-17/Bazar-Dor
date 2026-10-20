"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const noopSubscribe = () => () => {};

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface VoiceSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function VoiceSearch({
  value,
  onChange,
  placeholder = "পণ্য খুঁজুন...",
}: VoiceSearchProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // ব্রাউজার সাপোর্ট ক্লায়েন্টে নির্ধারণ হয় — SSR-এ false, হাইড্রেশনের পর আসল মান।
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(getRecognitionConstructor()),
    () => false
  );

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition || listening) return;

    const recognition = new Recognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i]?.[0]?.transcript ?? "";
      }
      if (transcript.trim()) onChange(transcript.trim());
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, onChange]);

  return (
    <div className="flex items-center gap-2">
      <label className="input input-bordered flex flex-1 items-center gap-2">
        <span aria-hidden="true" className="text-gray-400">
          🔍
        </span>
        <input
          type="search"
          className="grow"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-label="পণ্য খুঁজুন"
        />
        {value && (
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => onChange("")}
            aria-label="খোঁজা মুছুন"
          >
            ✕
          </button>
        )}
      </label>

      {supported && (
        <button
          type="button"
          onClick={listening ? stop : start}
          className={`btn btn-square ${
            listening
              ? "animate-pulse border-red-200 bg-red-50 text-red-600"
              : "border-green-200 bg-white text-green-800 hover:bg-green-50"
          }`}
          aria-label={listening ? "ভয়েস বন্ধ করুন" : "ভয়েস দিয়ে খুঁজুন"}
          title="ভয়েস দিয়ে খুঁজুন (বাংলা)"
        >
          🎤
        </button>
      )}
    </div>
  );
}
