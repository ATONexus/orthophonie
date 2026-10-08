
import { useEffect, useRef, useState } from "react";
import "./engistrement.css";

interface EnregistrementProps {
    onRecordingComplete: (blob: Blob, url: string) => void;
}

function Enregistrement({ onRecordingComplete }: EnregistrementProps) {

    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // Player
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    // =========================
    // ENREGISTREMENT
    // =========================

    const startRecording = async () => {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {

                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }

            };

            mediaRecorder.onstop = () => {

                const blob = new Blob(chunksRef.current, {
                    type: "audio/webm"
                });

                const url = URL.createObjectURL(blob);

                setAudioUrl(url);

                onRecordingComplete(blob, url);

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();

            setIsRecording(true);

        } catch (error) {

            console.error(error);

            alert("Impossible d'accéder au microphone.");

        }
    };


    const stopRecording = () => {

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        setIsRecording(false);
    };


    // =========================
    // PLAYER
    // =========================

    const togglePlay = () => {

        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };


    const handleTimeUpdate = () => {

        if (!audioRef.current) return;

        setCurrentTime(audioRef.current.currentTime);
    };


    const handleLoadedMetadata = () => {

        if (!audioRef.current) return;

        setDuration(audioRef.current.duration);
    };


    const handleEnded = () => {

        setIsPlaying(false);
        setCurrentTime(0);
    };


    const handleProgressChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!audioRef.current) return;

        const time = Number(event.target.value);

        audioRef.current.currentTime = time;

        setCurrentTime(time);
    };


    // =========================
    // SUPPRESSION
    // =========================

    const deleteRecording = () => {

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        onRecordingComplete(
            new Blob(),
            ""
        );
    };


    // =========================
    // FORMAT TEMPS
    // =========================

    const formatTime = (time: number) => {

        if (!isFinite(time)) {
            return "0:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };


    // Nettoyage de l'URL
    useEffect(() => {

        return () => {

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }

        };

    }, [audioUrl]);


    return (
        <div className="enregistrement">



            {/* ========================= */}
            {/* BOUTON ENREGISTREMENT */}
            {/* ========================= */}

            {!isRecording && !audioUrl && (

                <button
                    className="record-button"
                    onClick={startRecording}
                >

                    <span className="record-icon">
                        🎙
                    </span>

                    <span>
                        Commencer l'enregistrement
                    </span>

                </button>

            )}


            {/* ========================= */}
            {/* ENREGISTREMENT EN COURS */}
            {/* ========================= */}

            {isRecording && (

                <div className="recording-container">

                    <div className="recording-status">

                        <span className="recording-dot"></span>

                        <div>
                            <strong>Enregistrement en cours</strong>
                            <span>Parlez normalement...</span>
                        </div>

                    </div>


                    <button
                        className="stop-button"
                        onClick={stopRecording}
                    >

                        <span className="stop-icon"></span>

                        Arrêter

                    </button>

                </div>

            )}


            {/* ========================= */}
            {/* PLAYER */}
            {/* ========================= */}

            {audioUrl && !isRecording && (

                <div className="audio-player">

                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleEnded}
                    />


                    <button
                        className="play-button"
                        onClick={togglePlay}
                    >

                        {isPlaying ? "❚❚" : "▶"}

                    </button>


                    <div className="player-content">

                        <div className="player-top">

                            <span>
                                Enregistrement
                            </span>

                            <span>
                                {formatTime(currentTime)}
                                {" / "}
                                {formatTime(duration)}
                            </span>

                        </div>


                        <input
                            className="progress-bar"
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                        />

                    </div>


                    <button
                        className="delete-button"
                        onClick={deleteRecording}
                        title="Supprimer l'enregistrement"
                    >
                        🗑
                    </button>

                </div>

            )}

        </div>
    );
}

export default Enregistrement;

