// src/components/useAudioRecorder.js

import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.addEventListener("dataavailable", event => {
                audioChunksRef.current.push(event.data);
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            });

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setAudioBlob(null);
        } catch (err) {
            console.error("Erreur d'accès au microphone:", err);
            alert("L'accès au microphone est nécessaire pour enregistrer un message vocal.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    // ✅ CORRIGÉ : On s'assure que la fonction s'appelle bien "resetAudio" partout
    const resetAudio = () => {
        setAudioBlob(null);
        audioChunksRef.current = [];
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
        }
        setIsRecording(false);
    };

    return { isRecording, startRecording, stopRecording, audioBlob, resetAudio };
};