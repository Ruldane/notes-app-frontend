import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Fade,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import dayjs from "dayjs";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateX(4px)",
    },
  },
}));

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    deadline: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      deadline: date,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Project name is required");
      return false;
    }
    if (formData.name.length > 75) {
      setError("Project name must be less than 75 characters");
      return false;
    }
    if (formData.description && formData.description.length > 255) {
      setError("Description must be less than 255 characters");
      return false;
    }
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      setError("Please enter a valid image URL");
      return false;
    }
    return true;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const formattedData = {
        ...formData,
        deadline: formData.deadline
          ? dayjs(formData.deadline).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/projects`,
        formattedData,
        {
          withCredentials: true,
        }
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <Container maxWidth="md">
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ mb: 4, mt: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Project
            </Typography>
          </Box>

          <StyledPaper elevation={3}>
            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                helperText={`${formData.name.length}/75 characters`}
              />

              <StyledTextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                helperText={`${formData.description.length}/255 characters`}
              />

              <StyledTextField
                fullWidth
                label="Image URL"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <ImageIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDateChange}
                  sx={{ width: "100%", mb: 3 }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Project created successfully!
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  height: 56,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Create Project
              </Button>
            </form>
          </StyledPaper>
        </Box>
      </Fade>
    </Container>
  );
};

export default CreateProject;
