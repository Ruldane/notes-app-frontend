import { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    information: "",
    priority: "normal",
    deadline: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      information: content,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        project_id: parseInt(projectId),
        deadline: formData.deadline
          ? dayjs(formData.deadline).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        taskData,
        { withCredentials: true }
      );

      navigate(`/projects/${projectId}/tasks/${response.data.task.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

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

        <Typography variant="h4" gutterBottom>
          Create New Task
        </Typography>

        <StyledPaper>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Short Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
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
                value={formData.deadline}
                onChange={(date) =>
                  setFormData({ ...formData, deadline: date })
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
                value={formData.information}
                onChange={handleEditorChange}
                modules={modules}
                style={{ height: "300px", marginBottom: "50px" }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Create Task
            </Button>
          </form>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default CreateTask;
