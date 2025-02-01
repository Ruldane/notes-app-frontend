import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider, useDispatch, useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, CircularProgress } from "@mui/material";
import theme from "../theme";
import { store } from "./store";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Navbar from "./components/Layout/Navbar";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard/Dashboard";
import { loadStoredAuth, logoutSuccess } from "./features/auth/authPersist";
import axios from "axios";
import CreateProject from "./pages/CreateProject";
import MyProjects from "./pages/MyProjects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";

const AppContent = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get CSRF token first
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/csrf-token`, {
          withCredentials: true,
        });

        // Small delay to ensure CSRF token is properly set
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Then initialize auth
        const authResult = await loadStoredAuth(store);

        if (!authResult) {
          dispatch(logoutSuccess());
        }
      } catch (error) {
        console.error("Initialization error:", error);
        localStorage.removeItem("token");
        dispatch(logoutSuccess());
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Navbar />
      <Box sx={{ paddingTop: "64px" }}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterForm />
              )
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route
              path="/projects/:projectId/new-task"
              element={<CreateTask />}
            />
            <Route
              path="/projects/:projectId/tasks/:taskId"
              element={<TaskDetails />}
            />
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
