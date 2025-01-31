import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import { logoutSuccess, updateUser } from "../../features/auth/authSlice";
import { authAPI } from "../../features/auth/authAPI";
import { styled } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "50%",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
    setAvatarUrl(user?.avatar || "");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateAvatar = async () => {
    try {
      const user = await authAPI.put("/users/update-avatar", { avatarUrl });
      // todo fix here dispatch
      dispatch(updateUser(user.data));
      handleClose();
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await authAPI.deleteAccount();
      localStorage.removeItem("token");
      dispatch(logoutSuccess());
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/projects`,
          {
            withCredentials: true,
          }
        );
        setProjectCount(response.data.length);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 6,
        mb: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <Grid container spacing={4} justifyContent="center" maxWidth="1200px">
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 6,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              minHeight: "80vh",
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Typography variant="h4" component="h1">
                Dashboard
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteAccount}
                  sx={{ mr: 2 }}
                >
                  Delete Account
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Box>

            <Card
              sx={{
                mb: 5,
                mx: "auto",
                width: "100%",
                maxWidth: "800px",
                boxShadow: 2,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Avatar
                    src={user?.avatar}
                    alt={user?.username}
                    sx={{ width: 120, height: 120, mr: 4 }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Welcome, {user?.username}!
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClickOpen}
                      size="small"
                    >
                      Update Avatar
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccountCircleIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>Username:</strong> {user?.username}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <StyledPaper elevation={3}>
                  <IconWrapper>
                    <AssignmentIcon fontSize="large" />
                  </IconWrapper>
                  <Typography variant="h4" component="div" gutterBottom>
                    {projectCount}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    align="center"
                    gutterBottom
                  >
                    Total Projects
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    {projectCount === 0
                      ? "No projects yet. Create your first project!"
                      : projectCount === 1
                      ? "You have 1 active project"
                      : `You have ${projectCount} active projects`}
                  </Typography>
                </StyledPaper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Avatar</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Avatar URL"
            type="url"
            fullWidth
            variant="outlined"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateAvatar} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
