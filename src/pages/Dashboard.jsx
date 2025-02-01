import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  CardContent,
  Typography,
  Card,
  Box,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "rgba(45, 45, 60, 0.95)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)",
  color: "#fff",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: 40,
    marginRight: theme.spacing(2),
    opacity: 0.8,
  },
}));

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    todo: 0,
    working: 0,
    done: 0,
    total: 0,
  });

  const fetchTaskStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tasks/stats`,
        { withCredentials: true }
      );
      const stats = {
        todo: parseInt(response.data.todo) || 0,
        working: parseInt(response.data.working) || 0,
        done: parseInt(response.data.done) || 0,
        total: parseInt(response.data.total) || 0,
      };
      setTaskStats(stats);
    } catch (error) {
      console.error("Failed to fetch task statistics:", error);
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fff", mb: 4 }}>
          Task Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StyledCard>
              <CardContent>
                <IconWrapper>
                  <AssignmentIcon color="primary" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      To Do Tasks
                    </Typography>
                    <Typography variant="h3" sx={{ color: "primary.main" }}>
                      {taskStats.todo}
                    </Typography>
                  </Box>
                </IconWrapper>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Tasks waiting to be started
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StyledCard>
              <CardContent>
                <IconWrapper>
                  <PlayArrowIcon color="info" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      In Progress
                    </Typography>
                    <Typography variant="h3" sx={{ color: "info.main" }}>
                      {taskStats.working}
                    </Typography>
                  </Box>
                </IconWrapper>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Tasks currently in progress
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StyledCard>
              <CardContent>
                <IconWrapper>
                  <CheckCircleIcon color="success" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Completed Tasks
                    </Typography>
                    <Typography variant="h3" sx={{ color: "success.main" }}>
                      {taskStats.done}
                    </Typography>
                  </Box>
                </IconWrapper>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Tasks successfully completed
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StyledCard>
              <CardContent>
                <IconWrapper>
                  <FormatListBulletedIcon color="secondary" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Total Tasks
                    </Typography>
                    <Typography variant="h3" sx={{ color: "secondary.main" }}>
                      {taskStats.total}
                    </Typography>
                  </Box>
                </IconWrapper>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Total tasks across all projects
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
