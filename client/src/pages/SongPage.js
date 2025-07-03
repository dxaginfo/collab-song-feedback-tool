import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Upload, CompareArrows } from '@mui/icons-material';

import Waveform from '../components/Waveform/Waveform';
import FeedbackList from '../components/Feedback/FeedbackList';
import VersionSelector from '../components/Version/VersionSelector';
import { fetchSong, fetchVersions } from '../store/slices/songsSlice';
import { fetchFeedback, addFeedback } from '../store/slices/feedbackSlice';

const SongPage = () => {
  const { songId } = useParams();
  const dispatch = useDispatch();
  const { currentSong, versions, loading: songLoading } = useSelector((state) => state.songs);
  const { feedback, loading: feedbackLoading } = useSelector((state) => state.feedback);
  const { user } = useSelector((state) => state.auth);

  const [currentVersionId, setCurrentVersionId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTimestamp, setFeedbackTimestamp] = useState(null);

  useEffect(() => {
    if (songId) {
      dispatch(fetchSong(songId));
      dispatch(fetchVersions(songId));
    }
  }, [dispatch, songId]);

  useEffect(() => {
    if (versions && versions.length > 0 && !currentVersionId) {
      // Set the latest version as default
      const latestVersion = versions.reduce((latest, version) => {
        return latest.versionNumber > version.versionNumber ? latest : version;
      }, versions[0]);
      setCurrentVersionId(latestVersion.id);
    }
  }, [versions, currentVersionId]);

  useEffect(() => {
    if (currentVersionId) {
      dispatch(fetchFeedback(currentVersionId));
    }
  }, [dispatch, currentVersionId]);

  const handleVersionChange = (versionId) => {
    setCurrentVersionId(versionId);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddFeedback = (timestamp) => {
    setFeedbackTimestamp(timestamp);
    setFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim() && feedbackTimestamp !== null && currentVersionId) {
      dispatch(addFeedback({
        versionId: currentVersionId,
        timestamp: feedbackTimestamp,
        comment: feedbackText,
      }));
      setFeedbackDialogOpen(false);
      setFeedbackText('');
      setFeedbackTimestamp(null);
    }
  };

  const getCurrentVersion = () => {
    if (!versions || versions.length === 0 || !currentVersionId) return null;
    return versions.find(v => v.id === currentVersionId);
  };

  const currentVersion = getCurrentVersion();

  if (songLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentSong) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">Song not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentSong.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {currentSong.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {currentSong.genre && (
              <Typography variant="body2" color="text.secondary">
                Genre: {currentSong.genre}
              </Typography>
            )}
            {currentSong.bpm && (
              <Typography variant="body2" color="text.secondary">
                BPM: {currentSong.bpm}
              </Typography>
            )}
            {currentSong.key && (
              <Typography variant="body2" color="text.secondary">
                Key: {currentSong.key}
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<Upload />}
            sx={{ mr: 1 }}
          >
            Upload New Version
          </Button>
          {versions && versions.length > 1 && (
            <Button
              variant="outlined"
              startIcon={<CompareArrows />}
            >
              Compare Versions
            </Button>
          )}
        </Box>
      </Box>

      {versions && versions.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <VersionSelector
            versions={versions}
            currentVersionId={currentVersionId}
            onChange={handleVersionChange}
          />
        </Box>
      )}

      {currentVersion && (
        <Box sx={{ mb: 3 }}>
          <Waveform
            audioUrl={currentVersion.fileUrl}
            feedback={feedback}
            onAddFeedback={handleAddFeedback}
          />
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="song tabs"
          >
            <Tab label="Feedback" />
            <Tab label="Details" />
            <Tab label="Collaborators" />
          </Tabs>
        </Box>
        <Box sx={{ py: 3 }}>
          {tabValue === 0 && (
            <FeedbackList
              feedback={feedback}
              loading={feedbackLoading}
              onAddFeedback={() => handleAddFeedback(0)}
            />
          )}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Version Information
              </Typography>
              {currentVersion && (
                <Box>
                  <Typography variant="body2" paragraph>
                    Version: {currentVersion.versionNumber}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Created: {new Date(currentVersion.createdAt).toLocaleString()}
                  </Typography>
                  {currentVersion.notes && (
                    <Typography variant="body2" paragraph>
                      Notes: {currentVersion.notes}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Collaborators
              </Typography>
              <Typography variant="body2">
                No collaborators yet.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Time: {feedbackTimestamp ? `${Math.floor(feedbackTimestamp / 60)}:${Math.floor(feedbackTimestamp % 60).toString().padStart(2, '0')}` : ''}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your feedback"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitFeedback} 
            variant="contained"
            disabled={!feedbackText.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SongPage;
