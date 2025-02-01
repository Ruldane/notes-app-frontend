import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import axios from "axios";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(45, 45, 60, 0.95)",
  color: "#fff",
}));

const editorStyles = {
  ".ql-editor": {
    color: "#fff",
    minHeight: "200px",
  },
  ".ql-toolbar": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    "& .ql-stroke": {
      stroke: "#fff",
    },
    "& .ql-fill": {
      fill: "#fff",
    },
    "& .ql-picker": {
      color: "#fff",
    },
  },
  ".ql-container": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
};

const TaskDetails = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestAccess, setGuestAccess] = useState("read");

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    information: "",
    priority: "normal",
    status: "todo",
    deadline: null,
  });

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        { withCredentials: true }
      );
      setTask(response.data);
      setEditFormData({
        title: response.data.title,
        description: response.data.description,
        information: response.data.information,
        priority: response.data.priority,
        status: response.data.status,
        deadline: response.data.deadline ? dayjs(response.data.deadline) : null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchTask();
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const formattedData = {
        ...editFormData,
        deadline: editFormData.deadline
          ? dayjs(editFormData.deadline).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        formattedData,
        { withCredentials: true }
      );
      setEditMode(false);
      fetchTask();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
          withCredentials: true,
        });
        navigate(`/projects/${projectId}`);
      } catch (err) {
        setError("Failed to delete task");
      }
    }
  };

  const handleAddGuest = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/guests`,
        {
          email: guestEmail,
          access: guestAccess,
        },
        { withCredentials: true }
      );
      setGuestDialogOpen(false);
      fetchTask();
    } catch (err) {
      setError("Failed to add guest");
    }
  };

  // ... render JSX ...

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ mb: 2 }}
        >
          Back to Project
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4">
            {editMode ? "Edit Task" : task?.title}
          </Typography>
          <Box>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setEditMode(!editMode)}
              sx={{ mr: 1 }}
            >
              {editMode ? "Cancel Edit" : "Edit"}
            </Button>
            <Button
              startIcon={<PersonAddIcon />}
              onClick={() => setGuestDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Add Guest
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

        {/* Task Content */}
        <StyledPaper>
          {editMode ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                fullWidth
                label="Task Title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                required
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Short Description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                multiline
                rows={2}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={editFormData.priority}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      priority: e.target.value,
                    })
                  }
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Deadline"
                  value={editFormData.deadline}
                  onChange={(date) =>
                    setEditFormData({ ...editFormData, deadline: date })
                  }
                  sx={{ width: "100%", mb: 3 }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              <Typography variant="h6" gutterBottom>
                Detailed Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <ReactQuill
                  value={editFormData.information}
                  onChange={(content) =>
                    setEditFormData({ ...editFormData, information: content })
                  }
                  modules={modules}
                  style={{ height: "300px", marginBottom: "50px" }}
                  sx={editorStyles}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
                fullWidth
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </form>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 120, mr: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={task?.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="working">In Progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                </FormControl>

                <Chip
                  label={`Priority: ${task?.priority}`}
                  color={
                    task?.priority === "high"
                      ? "error"
                      : task?.priority === "normal"
                      ? "primary"
                      : "default"
                  }
                  sx={{ mr: 1 }}
                />

                {task?.deadline && (
                  <Chip
                    label={`Deadline: ${dayjs(task.deadline).format(
                      "MMM D, YYYY"
                    )}`}
                    color={
                      dayjs().add(1, "week").isAfter(task.deadline)
                        ? "warning"
                        : "default"
                    }
                  />
                )}
              </Box>

              <Typography variant="body1" paragraph>
                {task?.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Detailed Information
              </Typography>
              <div
                dangerouslySetInnerHTML={{ __html: task?.information }}
                style={{ marginTop: "1rem" }}
              />
            </>
          )}
        </StyledPaper>
      </Box>

      {/* Guest Dialog */}
      <Dialog
        open={guestDialogOpen}
        onClose={() => setGuestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Guest User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Guest Email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Access Level</InputLabel>
            <Select
              value={guestAccess}
              onChange={(e) => setGuestAccess(e.target.value)}
              label="Access Level"
            >
              <MenuItem value="read">Read Only</MenuItem>
              <MenuItem value="edit">Can Edit</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGuestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddGuest} variant="contained">
            Add Guest
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskDetails;
