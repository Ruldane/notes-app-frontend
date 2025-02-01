import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "rgba(45, 45, 60, 0.95)",
  color: "#fff",
}));

const ProjectImage = styled("img")({
  width: "100%",
  maxHeight: 400,
  objectFit: "cover",
  borderRadius: 8,
  marginBottom: 24,
});

const TaskColumn = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  minHeight: 400,
  background: "rgba(45, 45, 60, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "#fff",
}));

const TaskCard = styled(Paper)(({ theme, priority, status }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  borderRadius: theme.spacing(1.5),
  position: "relative",
  background:
    status !== "done"
      ? priority === "high"
        ? "rgba(211, 47, 47, 0.15)"
        : priority === "normal"
        ? "rgba(25, 118, 210, 0.15)"
        : "rgba(45, 45, 60, 0.95)"
      : "rgba(45, 45, 60, 0.95)",
  backdropFilter: "blur(5px)",
  color: "#fff",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
  ...(priority === "high" &&
    status !== "done" && {
      "&::after": {
        content: '""',
        position: "absolute",
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        borderRadius: "inherit",
        animation: "pulseRed 1.5s infinite",
      },
      "@keyframes pulseRed": {
        "0%": {
          transform: "scale(1)",
          boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.4)",
        },
        "70%": {
          transform: "scale(1.05)",
          boxShadow: "0 0 0 10px rgba(211, 47, 47, 0)",
        },
        "100%": {
          transform: "scale(1)",
          boxShadow: "0 0 0 0 rgba(211, 47, 47, 0)",
        },
      },
    }),
  ...(priority === "normal" &&
    status !== "done" && {
      "&::after": {
        content: '""',
        position: "absolute",
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        borderRadius: "inherit",
        animation: "pulseBlue 2s infinite",
      },
      "@keyframes pulseBlue": {
        "0%": {
          transform: "scale(1)",
          boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.4)",
        },
        "70%": {
          transform: "scale(1.05)",
          boxShadow: "0 0 0 10px rgba(25, 118, 210, 0)",
        },
        "100%": {
          transform: "scale(1)",
          boxShadow: "0 0 0 0 rgba(25, 118, 210, 0)",
        },
      },
    }),
}));

const ColumnHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  "& .MuiTypography-h6": {
    fontWeight: 600,
    color: "#fff",
  },
  "& .count": {
    marginLeft: theme.spacing(1),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: "0.875rem",
  },
}));

const ProjectDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    deadline: null,
    image_url: "",
    status: "active",
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/${id}`,
        {
          withCredentials: true,
        }
      );
      setProject(response.data);
      setEditFormData({
        name: response.data.name,
        description: response.data.description,
        deadline: response.data.deadline ? dayjs(response.data.deadline) : null,
        image_url: response.data.image_url,
        status: response.data.status || "active",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch project details"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tasks/project/${id}`,
        { withCredentials: true }
      );
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/projects/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchProject();
    } catch (err) {
      setError("Failed to update project status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
          withCredentials: true,
        });
        navigate("/my-projects");
      } catch (err) {
        setError("Failed to delete project");
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formattedData = {
        ...editFormData,
        deadline: editFormData.deadline
          ? dayjs(editFormData.deadline).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/${id}`,
        formattedData,
        { withCredentials: true }
      );
      setEditDialogOpen(false);
      fetchProject();
    } catch (err) {
      setError("Failed to update project");
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchTasks();
    } catch (err) {
      setError("Failed to update task status");
    }
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

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/my-projects")}
            >
              Back to Projects
            </Button>
            <Box>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>

          <StyledPaper>
            {project?.image_url && (
              <ProjectImage src={project.image_url} alt={project.name} />
            )}

            <Typography variant="h4" component="h1" gutterBottom>
              {project?.name}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={project?.status || "active"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              {project?.deadline && (
                <Chip
                  label={`Deadline: ${dayjs(project.deadline).format(
                    "MMMM D, YYYY HH:mm"
                  )}`}
                  color={
                    dayjs().isAfter(project.deadline) ? "error" : "primary"
                  }
                  sx={{ mr: 1 }}
                />
              )}
              <Chip
                label={`Created: ${dayjs(project.created_at).format(
                  "MMMM D, YYYY"
                )}`}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {project?.description}
            </Typography>
          </StyledPaper>

          <Box sx={{ mt: 4 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Tasks Board
              </Typography>
              <Tooltip
                title={
                  project?.status === "inactive"
                    ? "Cannot create tasks for inactive projects"
                    : ""
                }
              >
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/projects/${id}/new-task`)}
                    disabled={project?.status === "inactive"}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 3,
                    }}
                  >
                    Create Task
                  </Button>
                </span>
              </Tooltip>
            </Box>

            {project?.status === "inactive" && (
              <Alert
                severity="warning"
                sx={{ mb: 3 }}
                icon={<InfoIcon />}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => handleStatusChange("active")}
                  >
                    Activate Project
                  </Button>
                }
              >
                This project is currently inactive. Activate it to create new
                tasks.
              </Alert>
            )}

            {project?.deadline &&
              dayjs().add(1, "week").isAfter(project.deadline) && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1,
                    borderRadius: 4,
                    backgroundColor: "rgba(237, 108, 2, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.75rem",
                    color: theme.palette.warning.light,
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  {dayjs().isAfter(project.deadline)
                    ? `Project was due on ${dayjs(project.deadline).format(
                        "MMMM D, YYYY"
                      )}`
                    : `Project due on ${dayjs(project.deadline).format(
                        "MMMM D, YYYY"
                      )} (${dayjs(project.deadline).diff(
                        dayjs(),
                        "day"
                      )} days left)`}
                </Box>
              )}

            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(45, 45, 60, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TaskColumn>
                    <ColumnHeader>
                      <Typography variant="h6">To Do</Typography>
                      <span className="count">
                        {tasks.filter((task) => task.status === "todo").length}
                      </span>
                    </ColumnHeader>
                    {tasks
                      .filter((task) => task.status === "todo")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          onClick={(e) => {
                            const isSelectClick =
                              e.target.closest(".MuiSelect-root") ||
                              e.target.closest(".MuiMenu-paper") ||
                              e.target.closest(".MuiBackdrop-root");
                            if (!isSelectClick) {
                              task.status === "done"
                                ? null
                                : navigate(`/projects/${id}/tasks/${task.id}`);
                            }
                          }}
                          priority={task.priority}
                          status={task.status}
                          elevation={task.priority === "high" ? 4 : 1}
                          sx={{
                            cursor:
                              task.status === "done" ? "default" : "pointer",
                            position: "relative",
                            pb: 7,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <FormControl size="small">
                              <Select
                                value={task.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleTaskStatusChange(
                                    task.id,
                                    e.target.value
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                sx={{
                                  height: 32,
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  color: "#fff",
                                  "& .MuiSelect-icon": { color: "#fff" },
                                }}
                              >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="working">In Progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                              </Select>
                            </FormControl>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                fontStyle: "italic",
                              }}
                            >
                              {task.status === "done"
                                ? "Task completed"
                                : "Click on the task to see details"}
                            </Typography>
                          </Box>

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#fff",
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {task.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              size="small"
                              label={task.priority}
                              color={
                                task.priority === "high"
                                  ? "error"
                                  : task.priority === "normal"
                                  ? "primary"
                                  : "default"
                              }
                            />
                          </Box>

                          {task.deadline &&
                            dayjs().add(1, "week").isAfter(task.deadline) && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  py: 2,
                                  px: 3,
                                  backgroundColor: "rgba(237, 108, 2, 0.1)",
                                  borderBottomLeftRadius: "inherit",
                                  borderBottomRightRadius: "inherit",
                                  borderTop:
                                    "1px solid rgba(255, 255, 255, 0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  fontSize: "0.875rem",
                                  color: theme.palette.warning.light,
                                }}
                              >
                                <AccessTimeIcon fontSize="small" />
                                {dayjs().isAfter(task.deadline)
                                  ? `Task was due on ${dayjs(
                                      task.deadline
                                    ).format("MMMM D, YYYY")}`
                                  : `Due on ${dayjs(task.deadline).format(
                                      "MMMM D, YYYY"
                                    )}`}
                              </Box>
                            )}
                        </TaskCard>
                      ))}
                  </TaskColumn>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TaskColumn>
                    <ColumnHeader>
                      <Typography variant="h6">In Progress</Typography>
                      <span className="count">
                        {
                          tasks.filter((task) => task.status === "working")
                            .length
                        }
                      </span>
                    </ColumnHeader>
                    {tasks
                      .filter((task) => task.status === "working")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          onClick={(e) => {
                            const isSelectClick =
                              e.target.closest(".MuiSelect-root") ||
                              e.target.closest(".MuiMenu-paper") ||
                              e.target.closest(".MuiBackdrop-root");
                            if (!isSelectClick) {
                              task.status === "done"
                                ? null
                                : navigate(`/projects/${id}/tasks/${task.id}`);
                            }
                          }}
                          priority={task.priority}
                          status={task.status}
                          elevation={task.priority === "high" ? 4 : 1}
                          sx={{
                            cursor:
                              task.status === "done" ? "default" : "pointer",
                            position: "relative",
                            pb: 7,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <FormControl size="small">
                              <Select
                                value={task.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleTaskStatusChange(
                                    task.id,
                                    e.target.value
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                sx={{
                                  height: 32,
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  color: "#fff",
                                  "& .MuiSelect-icon": { color: "#fff" },
                                }}
                              >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="working">In Progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                              </Select>
                            </FormControl>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                fontStyle: "italic",
                              }}
                            >
                              {task.status === "done"
                                ? "Task completed"
                                : "Click on the task to see details"}
                            </Typography>
                          </Box>

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#fff",
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {task.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              size="small"
                              label={task.priority}
                              color={
                                task.priority === "high"
                                  ? "error"
                                  : task.priority === "normal"
                                  ? "primary"
                                  : "default"
                              }
                            />
                          </Box>

                          {task.deadline &&
                            dayjs().add(1, "week").isAfter(task.deadline) && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  py: 2,
                                  px: 3,
                                  backgroundColor: "rgba(237, 108, 2, 0.1)",
                                  borderBottomLeftRadius: "inherit",
                                  borderBottomRightRadius: "inherit",
                                  borderTop:
                                    "1px solid rgba(255, 255, 255, 0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  fontSize: "0.875rem",
                                  color: theme.palette.warning.light,
                                }}
                              >
                                <AccessTimeIcon fontSize="small" />
                                {dayjs().isAfter(task.deadline)
                                  ? `Task was due on ${dayjs(
                                      task.deadline
                                    ).format("MMMM D, YYYY")}`
                                  : `Due on ${dayjs(task.deadline).format(
                                      "MMMM D, YYYY"
                                    )}`}
                              </Box>
                            )}
                        </TaskCard>
                      ))}
                  </TaskColumn>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TaskColumn>
                    <ColumnHeader>
                      <Typography variant="h6">Done</Typography>
                      <span className="count">
                        {tasks.filter((task) => task.status === "done").length}
                      </span>
                    </ColumnHeader>
                    {tasks
                      .filter((task) => task.status === "done")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          onClick={(e) => {
                            const isSelectClick =
                              e.target.closest(".MuiSelect-root") ||
                              e.target.closest(".MuiMenu-paper") ||
                              e.target.closest(".MuiBackdrop-root");
                            if (!isSelectClick) {
                              task.status === "done"
                                ? null
                                : navigate(`/projects/${id}/tasks/${task.id}`);
                            }
                          }}
                          priority={task.priority}
                          status={task.status}
                          elevation={task.priority === "high" ? 4 : 1}
                          sx={{
                            cursor:
                              task.status === "done" ? "default" : "pointer",
                            position: "relative",
                            pb: 7,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <FormControl size="small">
                              <Select
                                value={task.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleTaskStatusChange(
                                    task.id,
                                    e.target.value
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                sx={{
                                  height: 32,
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  color: "#fff",
                                  "& .MuiSelect-icon": { color: "#fff" },
                                }}
                              >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="working">In Progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                              </Select>
                            </FormControl>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                fontStyle: "italic",
                              }}
                            >
                              {task.status === "done"
                                ? "Task completed"
                                : "Click on the task to see details"}
                            </Typography>
                          </Box>

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#fff",
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {task.description}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              size="small"
                              label={task.priority}
                              color={
                                task.priority === "high"
                                  ? "error"
                                  : task.priority === "normal"
                                  ? "primary"
                                  : "default"
                              }
                            />
                          </Box>

                          {task.deadline &&
                            dayjs().add(1, "week").isAfter(task.deadline) && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  py: 2,
                                  px: 3,
                                  backgroundColor: "rgba(237, 108, 2, 0.1)",
                                  borderBottomLeftRadius: "inherit",
                                  borderBottomRightRadius: "inherit",
                                  borderTop:
                                    "1px solid rgba(255, 255, 255, 0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  fontSize: "0.875rem",
                                  color: theme.palette.warning.light,
                                }}
                              >
                                <AccessTimeIcon fontSize="small" />
                                {dayjs().isAfter(task.deadline)
                                  ? `Task was due on ${dayjs(
                                      task.deadline
                                    ).format("MMMM D, YYYY")}`
                                  : `Due on ${dayjs(task.deadline).format(
                                      "MMMM D, YYYY"
                                    )}`}
                              </Box>
                            )}
                        </TaskCard>
                      ))}
                  </TaskColumn>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Project Name"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  description: e.target.value,
                })
              }
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image URL"
              value={editFormData.image_url}
              onChange={(e) =>
                setEditFormData({ ...editFormData, image_url: e.target.value })
              }
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Deadline"
                value={
                  editFormData.deadline ? dayjs(editFormData.deadline) : null
                }
                onChange={(newValue) =>
                  setEditFormData({
                    ...editFormData,
                    deadline: newValue,
                  })
                }
                sx={{ width: "100%", mt: 2 }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProjectDetails;
