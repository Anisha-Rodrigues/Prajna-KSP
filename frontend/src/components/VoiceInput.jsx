import { useState, useRef } from "react";

export default function VoiceInput({ onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const startListening = () => {
    if (!isSupported) {
      setError("Voice input not supported in this browser. Use Chrome.");
      return;
    }
    setError("");
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      setError(`Voice error: ${e.error}`);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript, language);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
      >
        <option value="en-IN">English</option>
        <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
      </select>

      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
          isListening ? "bg-red-600 animate-pulse text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        {isListening ? "Listening…" : "Voice Query"}
      </button>

      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}