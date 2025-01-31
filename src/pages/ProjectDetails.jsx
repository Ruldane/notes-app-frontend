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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const ProjectImage = styled("img")({
  width: "100%",
  maxHeight: 400,
  objectFit: "cover",
  borderRadius: 8,
  marginBottom: 24,
});

const ProjectDetails = () => {
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

  useEffect(() => {
    fetchProject();
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
    <Container maxWidth="md">
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
                color={dayjs().isAfter(project.deadline) ? "error" : "primary"}
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
              setEditFormData({ ...editFormData, description: e.target.value })
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
  );
};

export default ProjectDetails;
