// src/components/AudioPlayer.jsx

import React from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const AudioPlayer = ({ src, isMe }) => {
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };
    
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time) || time === 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Le bouton de lecture est blanc si le message est de moi (fond sombre), bleu sinon (fond clair)
    const controlColor = isMe ? 'white' : 'primary.main';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '250px', bgcolor: 'transparent' }}>
            <audio 
                ref={audioRef} 
                src={src} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)} 
            />
            <IconButton onClick={togglePlayPause} sx={{ color: controlColor }}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <Slider
                size="small"
                value={currentTime}
                max={duration || 0}
                onChange={(_, value) => { audioRef.current.currentTime = value; }}
                sx={{ color: controlColor, mx: 1 }}
            />
            <Typography variant="caption" sx={{ color: controlColor, minWidth: '40px' }}>
                {formatTime(currentTime)}
            </Typography>
        </Box>
    );
};

export default AudioPlayer;