import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const Task = ({ taskId, title, description, deadline, initialStatus, refreshTasks }) => {
  const [status, setStatus] = useState(initialStatus || "ACTIVE");
  const [openConfirm, setOpenConfirm] = useState(false); // State for confirmation modal

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    try {
      await axiosInstance.put(`/api/task/${taskId}`, { status: newStatus });
      refreshTasks();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating task status. Please try again.");
    }
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteTask = async () => {
    try {
      await axiosInstance.delete(`/api/task/${taskId}`);
      setOpenConfirm(false);
      refreshTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Error deleting task. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "#fff9ba"; // Yellow
      case "COMPLETE":
        return "#dcffd6"; // Greenish
      case "ACTIVE":
        return "#ccedff"; // Blue
      case "EXPIRED":
        return "#d3d3d3"; // Red
      default:
        return "#2196F3";
    }
  };

  return (
    <>
      <Card
        sx={{
          marginBottom: 2,
          maxWidth: 420,
          backgroundColor: getStatusColor(status),
          color: "#000",
          borderRadius: "12px",
          boxShadow: "2px 4px 10px rgba(0,0,0,0.2)",
          padding: "10px",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem", textTransform: "capitalize" }}>
            {title}
          </Typography>

          <Typography variant="body1" sx={{ fontSize: "1rem", marginBottom: "8px" }}>
            {description}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: "medium",
              color: "#000",
              backgroundColor: "rgba(255, 255, 255, 0.69)",
              padding: "4px 8px",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            Deadline:{" "}
            {new Date(deadline).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            {new Date(deadline).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </Typography>

          <Box sx={{ marginTop: 2 }}>
            <FormControl fullWidth sx={{ backgroundColor: "white", borderRadius: "8px", padding: "5px" }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={handleStatusChange} sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETE">Complete</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleOpenConfirm}
            sx={{ marginTop: 2, fontWeight: "bold" }}
          >
            Delete Task
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Task;