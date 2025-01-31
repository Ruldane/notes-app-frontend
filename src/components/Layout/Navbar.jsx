import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircle,
  Notes as NotesIcon,
  Login,
  HowToReg,
} from "@mui/icons-material";
import { logoutSuccess } from "../../features/auth/authSlice";
import { authAPI } from "../../features/auth/authAPI";

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
    navigate("/login");
    handleClose();
  };

  // Active route styles
  const getButtonStyle = (path) => ({
    color: "inherit",
    borderBottom: location.pathname === path ? "2px solid #9c27b0" : "none",
    backgroundColor:
      location.pathname === path ? "rgba(156, 39, 176, 0.1)" : "transparent",
    "&:hover": {
      backgroundColor:
        location.pathname === path
          ? "rgba(156, 39, 176, 0.2)"
          : "rgba(255, 255, 255, 0.1)",
    },
    mx: 1,
    borderRadius: 1,
  });

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Projects", path: "/my-projects" },
  ];

  const menuItems = [
    { label: "Home", path: "/", icon: <NotesIcon /> },
    { label: "Profile", path: "/profile", icon: <AccountCircle /> },
  ];

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleClose}
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.label}
          component={Link}
          to={item.path}
          onClick={handleClose}
          sx={getButtonStyle(item.path)}
        >
          {item.icon}
          <Typography sx={{ ml: 1 }}>{item.label}</Typography>
        </MenuItem>
      ))}
      <Divider />
      <MenuItem>
        <Button color="error" variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="fixed"
      sx={{ width: "100%", zIndex: theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to={isAuthenticated ? "/" : "/login"}
        >
          <NotesIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to={isAuthenticated ? "/" : "/login"}
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          SecureNotes
        </Typography>

        {!isAuthenticated ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              startIcon={<Login />}
              sx={getButtonStyle("/login")}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              startIcon={<HowToReg />}
              sx={getButtonStyle("/register")}
            >
              Register
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              component={Link}
              to="/dashboard"
              sx={getButtonStyle("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              to="/my-projects"
              sx={getButtonStyle("/my-projects")}
            >
              My Projects
            </Button>

            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.avatar ? (
                <Avatar src={user.avatar} alt={user.username} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            <Button
              color="error"
              variant="contained"
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
