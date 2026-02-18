"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  // Track how many results we've already processed to avoid duplicates
  const processedIndexRef = useRef(0);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(supported);
  }, []);

  const createRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newFinalText = "";
      let interimText = "";

      for (let i = processedIndexRef.current; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newFinalText += result[0].transcript;
          // Mark this result as processed so we never re-add it
          processedIndexRef.current = i + 1;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (newFinalText) {
        setTranscript((prev) => prev + newFinalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        return;
      }
      console.error("Speech recognition error:", event.error);
      shouldRestartRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      setInterimTranscript("");
      if (shouldRestartRef.current) {
        // Reset the processed index since a new recognition session starts fresh
        processedIndexRef.current = 0;
        try {
          recognition.start();
        } catch {
          shouldRestartRef.current = false;
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, []);

  const start = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    shouldRestartRef.current = true;
    processedIndexRef.current = 0;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      shouldRestartRef.current = false;
      setIsListening(false);
    }
  }, [createRecognition]);

  const stop = useCallback(() => {
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const reset = useCallback(() => {
    stop();
    setTranscript("");
    setInterimTranscript("");
    processedIndexRef.current = 0;
  }, [stop]);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    start,
    stop,
    reset,
  };
}
