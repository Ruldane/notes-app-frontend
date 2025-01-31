import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import NotesIcon from "@mui/icons-material/Notes";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import SecurityIcon from "@mui/icons-material/Security";
import TaskIcon from "@mui/icons-material/Task";
import { authAPI } from "../features/auth/authAPI";
import { logoutSuccess } from "../features/auth/authSlice";

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 2),
  textAlign: "center",
  borderRadius: theme.spacing(0, 0, 4, 4),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.delete("/auth/logout");
      dispatch(logoutSuccess());
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateProject = () => {
    // TODO: Implement project creation navigation
    navigate("/create-project");
  };

  const features = [
    {
      icon: <NotesIcon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />,
      title: "Organize Your Notes",
      description:
        "Create and organize notes within projects. Keep your thoughts structured and accessible.",
    },
    {
      icon: <TaskIcon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />,
      title: "Organize Your tasks",
      description:
        "Create and organize tasks within projects. Keep your tasks structured and accessible.",
    },
    {
      icon: (
        <GroupWorkIcon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
      ),
      title: "Project Management",
      description:
        "Create multiple projects to separate different areas of your work or life.",
    },
    {
      icon: (
        <SecurityIcon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
      ),
      title: "Secure Storage",
      description:
        "Your notes are securely stored and protected. Access them from anywhere, anytime.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "80%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Welcome to NotesApp
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4, opacity: 0.9 }}>
            Organize your thoughts, manage your projects, and boost your
            productivity
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            Create New Project
          </Button>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  {feature.icon}
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
