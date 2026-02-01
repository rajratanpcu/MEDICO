import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = sendAudio;
            mediaRecorder.current.start();
            setIsListening(true);
        } catch (err) {
            console.error("Mic Error:", err);
            alert("Microphone access denied. Please allow microphone access in your browser.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsListening(false);
            setIsProcessing(true);
        }
    };

    const sendAudio = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice_command.wav');

        try {
            // Assuming Vite proxy or Gateway routes /ai -> ai-service
            // If running locally without Gateway, might need http://localhost:8000/voice/command
            // We'll try the /ai prefix first typically used in this project structure
            const response = await fetch('/ai/voice/command', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();

                // Optional: Log transcript if header exists
                const transcript = response.headers.get('X-Transcription');
                if (transcript) console.log("Transcription:", transcript);

            } else {
                console.error("Voice command failed:", response.statusText);
                // Fallback alert for dev
                // alert("Voice command failed. Check console.");
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={isListening ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`p-4 rounded-full shadow-lg transition-all flex items-center justify-center w-16 h-16 ${isListening
                        ? 'bg-red-500 animate-pulse scale-110'
                        : isProcessing
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                    } text-white border-2 border-white`}
                title="AI Voice Assistant"
            >
                {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isListening ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a3 3 0 013 3v1.5a3 3 0 01-6 0v-1.5a3 3 0 013-3z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default VoiceRecorder;
