import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, Comment } from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js';
import FeedbackMarker from './FeedbackMarker';

const Waveform = ({ audioUrl, feedback = [], onAddFeedback }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer instance
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#8e9efc',
      progressColor: '#f50057',
      cursorColor: '#ffffff',
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      cursorWidth: 2,
      height: 80,
      responsive: true,
    });

    // Load audio file
    wavesurfer.current.load(audioUrl);

    // Set up event listeners
    wavesurfer.current.on('ready', () => {
      setDuration(wavesurfer.current.getDuration());
    });

    wavesurfer.current.on('audioprocess', () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    wavesurfer.current.on('play', () => {
      setIsPlaying(true);
    });

    wavesurfer.current.on('pause', () => {
      setIsPlaying(false);
    });

    wavesurfer.current.on('finish', () => {
      setIsPlaying(false);
    });

    // Clean up on unmount
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const handleWaveformClick = (e) => {
    if (onAddFeedback) {
      const waveformRect = waveformRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - waveformRect.left;
      const percent = clickPosition / waveformRect.width;
      const timePosition = percent * duration;
      onAddFeedback(timePosition);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={handlePlayPause} size="large">
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Typography variant="body2" sx={{ ml: 1 }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>
        <Tooltip title="Click on the waveform to add a comment">
          <IconButton sx={{ ml: 'auto' }} size="small">
            <Comment fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box 
        className="waveform-container"
        onClick={handleWaveformClick}
      >
        <div ref={waveformRef} />
        {feedback.map((item) => (
          <FeedbackMarker 
            key={item.id} 
            position={(item.timestamp / duration) * 100} 
            feedback={item} 
          />
        ))}
      </Box>
    </Box>
  );
};

export default Waveform;
