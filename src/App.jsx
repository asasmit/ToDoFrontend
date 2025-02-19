import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, useMediaQuery, IconButton, Drawer, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/todo";
import Login from "./pages/login";
import Register from "./pages/registration";
import OtpVerification from "./pages/otpVerification";
import AuthContext from "./context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import AddTask from "./components/addtask";
import PrivateRoute from "./privateRoute";
import ProtectedRoute from './protectRoute';
import ResetPassword from "./pages/resetPassword";
import ResetPasswordRequest from "./pages/resetPasswordRequest";

// Create a theme
const theme = createTheme();

function App() {
  const { user } = useContext(AuthContext); // Ensure AuthProvider wraps this component
  const [sidebarWidth, setSidebarWidth] = useState(200); // Sidebar width
  const [isDragging, setIsDragging] = useState(false); // Dragging state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Sidebar state for mobile
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check mobile view

  // Handle mouse dragging for sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newWidth = e.clientX;
        if (newWidth > 150 && newWidth < 400) setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ display: "flex", height: "100vh" }}>
          {/* Hamburger Menu for Mobile */}
          {isMobile && (
            <IconButton
              color="primary"
              sx={{ position: "absolute", top: 20, left: 20, zIndex: 1200 }}
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Sidebar for Large Screens */}
          {!isMobile && (
            <Box
              sx={{
                width: sidebarWidth,
                backgroundColor: "#f4f4f4",
                height: "100vh",
                position: "fixed",
                zIndex: 1000,
              }}
            >
              <Sidebar />
            </Box>
          )}

          {/* Sidebar Drawer for Mobile */}
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            sx={{ display: isMobile ? "block" : "none", zIndex: 1300 }}
          >
            <Sidebar onClose={() => setIsDrawerOpen(false)} /> {/* Pass `onClose` prop */}
          </Drawer>

          {/* Draggable Sidebar Divider */}
          {!isMobile && (
            <Box
              sx={{
                position: "fixed",
                left: sidebarWidth,
                width: "5px",
                height: "100vh",
                cursor: "ew-resize",
                backgroundColor: isDragging ? "#ccc" : "#f4f4f4",
                zIndex: 1001,
              }}
              onMouseDown={() => setIsDragging(true)}
            />
          )}

          {/* Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflowY: "auto",
              marginLeft: isMobile ? "0px" : `${sidebarWidth}px`,
              transition: "margin-left 0.3s ease",
              height: "100vh",
            }}
          >
            <Routes>
              <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
              <Route path="/signup" element={<ProtectedRoute><Register /></ProtectedRoute>} />
              <Route path="/reset-request" element={<ProtectedRoute><ResetPasswordRequest /></ProtectedRoute>} />
              <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
              <Route path="/verification" element={<ProtectedRoute><OtpVerification /></ProtectedRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/add-task" element={<PrivateRoute><AddTask /></PrivateRoute>} />

              {/* Default Route */}
              <Route path="*" element={user ? <Dashboard /> : <Login />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;