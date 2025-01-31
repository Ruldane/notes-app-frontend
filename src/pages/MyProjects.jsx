import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProjectImage = styled("img")({
  width: "100%",
  height: 140,
  objectFit: "cover",
});

const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/projects`,
          {
            withCredentials: true,
          }
        );
        setProjects(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Projects
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <StyledCard>
              <CardActionArea onClick={() => handleProjectClick(project.id)}>
                {project.image_url && (
                  <ProjectImage src={project.image_url} alt={project.name} />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description}
                  </Typography>
                  {project.deadline && (
                    <Chip
                      label={`Deadline: ${dayjs(project.deadline).format(
                        "MMM D, YYYY"
                      )}`}
                      size="small"
                      color={
                        dayjs().isAfter(project.deadline) ? "error" : "primary"
                      }
                    />
                  )}
                </CardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyProjects;
