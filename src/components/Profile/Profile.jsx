import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../features/auth/authSlice';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
    setAvatarUrl(user?.avatar || '');
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleUpdateAvatar = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        { avatarUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      dispatch(setUser(response.data));
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating avatar');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 8,
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {user?.email}
        </Typography>

        <Box sx={{ position: 'relative', mb: 3 }}>
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <IconButton
            onClick={handleClickOpen}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>

        <Typography variant="h5" gutterBottom>
          {user?.username}
        </Typography>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Image URL"
              type="url"
              fullWidth
              variant="outlined"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleUpdateAvatar} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Profile;
