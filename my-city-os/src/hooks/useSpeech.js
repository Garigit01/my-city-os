import { useState, useEffect, useRef } from 'react';

const MOCK_PHRASES = [
  "There is a huge pothole right in the middle of the main crossroad that is causing severe traffic.",
  "The street lights have been completely broken and flickering since yesterday evening, making it dark and unsafe.",
  "A public waste bin is overflowing onto the sidewalk, attracting pests and creating a very bad smell.",
  "Clean drinking water is leaking from a main pipe crack on the side of the road, wasting gallons.",
  "A large tree branch has broken off and is blocking the left lane of the street near the park entrance."
];

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Set to English (India) / general English

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setError(`Speech error: ${event.error}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const startListening = () => {
    setTranscript('');
    setError(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setError("Speech recognition failed to start.");
        runSimulation();
      }
    } else {
      console.warn("Web Speech API not supported in this browser, using simulation.");
      runSimulation();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const runSimulation = () => {
    setIsListening(true);
    // Simulate listening for 2.5 seconds, then pick a random civic issue phrase
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_PHRASES.length);
      setTranscript(MOCK_PHRASES[randomIndex]);
      setIsListening(false);
    }, 2500);
  };

  return { isListening, transcript, error, startListening, stopListening, setTranscript };
};
