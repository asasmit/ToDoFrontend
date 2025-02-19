import React, { useContext, useMemo } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Box, Typography, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AuthContext from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Get user from context

  const menuItems = useMemo(() => [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { text: "Add Task", icon: <AddCircleOutlineIcon />, to: "/add-task" },
  ], []);

  const menuItemsWhenLogout = useMemo(() => [
    { text: "Login", icon: <LoginIcon />, to: "/login" },
    { text: "Signup", icon: <AppRegistrationIcon />, to: "/signup" },
  ], []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ width: "100%", height: "100%", padding: 0 }}>

      {user && (
        <>
          <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
            {user.username}
          </Typography>
          <Divider sx={{ marginBottom: 1 }} />
        </>
      )}

      <List>
        {(user ? menuItems : menuItemsWhenLogout).map(({ text, icon, to }) => (
          <ListItem button key={text} component={Link} to={to}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}

        {user && (
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              "&:hover": { backgroundColor: "#f5f5f5" },
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="LogOut" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;