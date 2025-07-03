import React, { useState } from 'react';
import { Box, Popover, Typography, Avatar } from '@mui/material';

const FeedbackMarker = ({ position, feedback }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMarkerClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `feedback-popover-${feedback.id}` : undefined;

  const formatTimestamp = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Box 
        className="feedback-marker"
        style={{ 
          left: `${position}%`,
          top: '50%',
        }}
        onClick={handleMarkerClick}
        aria-describedby={id}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              src={feedback.user.profileImage} 
              alt={feedback.user.username}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {feedback.user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2">
              {feedback.user.username}
            </Typography>
            <Typography variant="caption" sx={{ ml: 'auto' }}>
              {formatTimestamp(feedback.timestamp)}
            </Typography>
          </Box>
          <Typography variant="body2">{feedback.comment}</Typography>
        </Box>
      </Popover>
    </>
  );
};

export default FeedbackMarker;
