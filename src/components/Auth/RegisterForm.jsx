import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { authAPI } from "../../features/auth/authAPI";
import { setAuthStatus, setAuthError } from "../../features/auth/authSlice";

// Enhanced password validation schema
const passwordSchema = Yup.string()
  .required("Password is required")
  .min(12, "Password must be at least 12 characters")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .matches(/[0-9]/, "Must contain at least one number")
  .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
  .test(
    "no-common-passwords",
    "Password is too common",
    (value) => !["Password123!", "Aa3456789012"].includes(value)
  );

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
      password: passwordSchema,
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(setAuthStatus("loading"));
        await authAPI.register(values);
        // After successful registration, redirect to login
        navigate('/login');
      } catch (err) {
        dispatch(setAuthError(err.response?.data?.message || "Registration failed"));
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          Register
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
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 2 }}
          inputProps={{
            'aria-label': 'Email',
            'aria-required': 'true',
            autoComplete: 'email'
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
            autoComplete: 'new-password'
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            'aria-label': 'Confirm password',
            'aria-required': 'true',
            autoComplete: 'new-password'
          }}
          sx={{ mb: 3 }}
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
          aria-label="Create account"
        >
          {loading ? (
            <CircularProgress 
              size={24} 
              aria-label="Loading"
            />
          ) : (
            "Register"
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
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
