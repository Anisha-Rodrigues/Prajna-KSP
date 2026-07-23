import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, Sparkles, Volume2, HelpCircle } from 'lucide-react';

export default function VoiceInput({ onQuerySubmit, selectedLang = 'en-IN', onLangChange }) {
  const [isListening, setIsListening] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isSecureContext) {
      setErrorMsg('Voice input requires a secure context. Please use HTTPS or localhost.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Voice input is not available in this browser. Please use Chrome or Edge.');
      return;
    }

    let recognition;
    try {
      recognition = new SpeechRecognition();
    } catch (error) {
      console.warn('SpeechRecognition init failed:', error);
      setErrorMsg('Voice input could not be initialized. Please refresh the page and allow microphone access.');
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = true;
    const preferredLang = selectedLang === 'en-IN' ? 'en-US' : selectedLang;
    recognition.lang = preferredLang;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg('');
      setIsNetworkError(false);
      setIsRequestingMic(false);
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      if (event.results[event.results.length - 1].isFinal) {
        if (currentTranscript.trim()) {
          onQuerySubmit(currentTranscript.trim());
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsRequestingMic(false);
      if (event.error === 'no-speech') {
        setErrorMsg('No speech detected. Please speak into microphone.');
      } else if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access was denied. Please allow microphone access in your browser bar.');
      } else if (event.error === 'network') {
        setIsNetworkError(true);
        setErrorMsg('Google Speech cloud service unreachable (network/firewall issue). Use Chrome with internet or click "Voice Demo" below.');
      } else {
        setErrorMsg(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsRequestingMic(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedLang, onQuerySubmit]);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setErrorMsg('Voice input is not available in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setIsListening(false);
      return;
    }

    setTranscript('');
    setErrorMsg('');
    setIsNetworkError(false);
    setIsRequestingMic(true);

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      recognitionRef.current.lang = selectedLang === 'en-IN' ? 'en-US' : selectedLang;
      recognitionRef.current.start();
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      setIsRequestingMic(false);
      setErrorMsg('Microphone access was blocked. Please allow mic access in your browser address bar.');
    }
  };

  // Demo voice simulator when cloud Speech API is blocked/offline
  const triggerVoiceDemo = (sampleQuery) => {
    const demoText = sampleQuery || (selectedLang === 'kn-IN' ? 'ರಾಜು ಕುಮಾರ್ ನೆಟ್‌ವರ್ಕ್' : 'Show Raju Kumar network');
    setIsSimulating(true);
    setTranscript('');
    setErrorMsg('');

    let current = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < demoText.length) {
        current += demoText[i];
        setTranscript(current);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          onQuerySubmit(demoText);
        }, 500);
      }
    }, 60);
  };

  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between gap-2">
        {/* Language selector toggle */}
        <div class="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
          <Globe class="w-3.5 h-3.5 text-sky-400 ml-1 mr-1" />
          <button
            type="button"
            onClick={() => onLangChange('en-IN')}
            class={`px-2 py-1 rounded font-medium transition-all ${
              selectedLang === 'en-IN'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English (en-IN)
          </button>
          <button
            type="button"
            onClick={() => onLangChange('kn-IN')}
            class={`px-2 py-1 rounded font-medium transition-all ${
              selectedLang === 'kn-IN'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ಕನ್ನಡ (kn-IN)
          </button>
        </div>

        {/* Mic Toggle Button */}
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            disabled={isRequestingMic || isSimulating}
            class={`relative flex items-center justify-center p-2.5 rounded-lg font-medium text-xs transition-all shadow-md ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            } ${isRequestingMic || isSimulating ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isRequestingMic ? (
              <>
                <Sparkles class="w-4 h-4 mr-1.5 animate-spin" />
                <span>Connecting mic...</span>
              </>
            ) : isListening ? (
              <>
                <MicOff class="w-4 h-4 mr-1.5" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic class="w-4 h-4 mr-1.5" />
                <span>Voice Query</span>
              </>
            )}
          </button>

          {/* Voice Demo Simulator Pill */}
          <button
            type="button"
            onClick={() => triggerVoiceDemo()}
            title="Simulate Voice Input (useful if Web Speech API cloud is blocked)"
            class="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1 transition"
          >
            <Volume2 class="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Demo</span>
          </button>
        </div>
      </div>

      {/* Interim Speech / Simulated Transcript Display */}
      {(isListening || isSimulating) && transcript && (
        <div class="text-xs bg-slate-900/90 border border-sky-500/40 rounded px-2.5 py-1.5 text-sky-300 flex items-center gap-1.5 animate-fade-in">
          <Sparkles class="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span class="italic">"{transcript}"</span>
        </div>
      )}

      {/* Error notification & fallback options */}
      {errorMsg && (
        <div class="text-[11px] text-red-300 bg-red-950/60 border border-red-800/60 rounded px-2.5 py-2 space-y-1.5">
          <div class="flex items-start gap-1.5">
            <HelpCircle class="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>

          {isNetworkError && (
            <div class="pt-1 border-t border-red-900/40 flex items-center justify-between">
              <span class="text-[10px] text-red-400 font-semibold">Try Voice Simulation:</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => triggerVoiceDemo('Show Raju Kumar network')}
                  class="px-2 py-0.5 bg-red-900 hover:bg-red-800 text-white rounded text-[10px] font-medium"
                >
                  "Raju Kumar"
                </button>
                <button
                  type="button"
                  onClick={() => triggerVoiceDemo('Crime in Whitefield')}
                  class="px-2 py-0.5 bg-red-900 hover:bg-red-800 text-white rounded text-[10px] font-medium"
                >
                  "Whitefield"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

