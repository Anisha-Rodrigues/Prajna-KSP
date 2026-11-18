import { useState, useRef, useEffect } from "react";
import VoiceInput from "./VoiceInput";
import { sendQuery, saveMemory } from "../utils/api";
import { speak, stopSpeaking, isSpeechSynthesisSupported } from "../utils/tts";

export default function ChatPanel({ officerId, sessionId, onNodesReceived, onAiReply }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaskara, Officer. Ask me about a suspect, FIR, location, or crime pattern." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceOutputOn, setVoiceOutputOn] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Stop any in-progress speech if this panel unmounts (e.g. navigating away)
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleSend = async (text, language = "en-IN") => {
    if (!text.trim()) return;
    stopSpeaking(); // cut off any speech from a previous reply
    setMessages((prev) => [...prev, { role: "officer", text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendQuery(text, language, officerId, sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer, citedFirs: data.cited_firs },
      ]);
      onNodesReceived(data.nodes || [], data.edges || []);
      onAiReply?.(data.answer, data.cited_firs);
      if (voiceOutputOn) speak(data.answer, language);
      try {
        await saveMemory(officerId, text, data.answer, "logged");
      } catch (memErr) {
        console.warn("Memory log skipped:", memErr);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errText =
        "Service temporarily unavailable. Please retry in a few seconds.";
      setMessages((prev) => [...prev, { role: "ai", text: errText }]);
      if (voiceOutputOn) speak(errText, language);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      <div className="p-3 border-b border-gray-800 font-semibold text-blue-400 flex items-center justify-between">
        <span>AI Investigator Chat</span>
        {isSpeechSynthesisSupported() && (
          <button
            onClick={() => {
              if (voiceOutputOn) stopSpeaking();
              setVoiceOutputOn((v) => !v);
            }}
            title={
              voiceOutputOn
                ? "Voice output on — click to mute"
                : "Voice output muted — click to enable"
            }
            className="text-xs text-gray-400 hover:text-white font-normal p-1 rounded bg-gray-800"
          >
            {voiceOutputOn ? (
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "officer" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.role === "officer" ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              <p>{m.text}</p>
              {m.citedFirs?.length > 0 && (
                <p className="mt-1 text-xs text-gray-400">
                  Cited: {m.citedFirs.join(", ")}
                </p>
              )}
              {m.role === "ai" && i > 0 && (
                <div className="mt-2 pt-1.5 border-t border-gray-700/60 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Officer Assessment:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={async (e) => {
                        e.currentTarget.classList.add("text-emerald-400", "font-bold");
                        try {
                          await saveMemory(officerId, "Concurrence", m.text, "concurred");
                        } catch {}
                      }}
                      className="hover:text-emerald-400 transition"
                      title="Agree with this AI finding"
                    >
                      ✓ Agree
                    </button>
                    <button
                      onClick={async (e) => {
                        e.currentTarget.classList.add("text-rose-400", "font-bold");
                        try {
                          await saveMemory(officerId, "Officer Dissent", m.text, "dissent");
                        } catch {}
                      }}
                      className="hover:text-rose-400 transition"
                      title="Disagree with this AI finding (Dissent Flag)"
                    >
                      ✕ Disagree (Dissent)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-500">AI is thinking...</div>}
      </div>

      <div className="p-3 border-t border-gray-800 space-y-2">
        <VoiceInput onResult={(text, lang) => handleSend(text, lang)} />
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask about a suspect, FIR, or location..."
            className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend(input)}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
