import React from "react";
import { useFormik } from "formik";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  loginSuccess,
  setAuthStatus,
  setAuthError,
} from "../../features/Auth/authSlice";
import { authAPI } from "../../features/auth/authAPI";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain uppercase, number, and special character"
    ),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setAuthStatus("loading"));
        const response = await authAPI.login(values);
        dispatch(loginSuccess(response.data));
        navigate('/dashboard');
      } catch (err) {
        dispatch(setAuthError(err.response?.data?.message || "Login failed"));
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        minWidth: "100vw",
        pt: { xs: 4, sm: 8, md: 12 },
        px: { xs: 2, sm: 3, md: 0 },
      }}
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 400 },
          p: { xs: 3, sm: 4 },
          borderRadius: { xs: 0, sm: 4 },
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          align="center" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mb: 3
          }}
        >
          Login
        </Typography>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            role="alert"
          >
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          sx={{ mb: 2 }}
          inputProps={{
            'aria-label': 'Username',
            'aria-required': 'true',
            autoComplete: 'username'
          }}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            'aria-label': 'Password',
            'aria-required': 'true',
            autoComplete: 'current-password'
          }}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            height: { xs: 44, sm: 48 },
            background: "rgba(255, 255, 255, 0.2)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
            },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mb: 2
          }}
          aria-label="Sign in"
        >
          {loading ? (
            <CircularProgress 
              size={24} 
              aria-label="Loading"
            />
          ) : (
            "Login"
          )}
        </Button>
        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            mt: 2,
            color: 'text.secondary'
          }}
        >
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
