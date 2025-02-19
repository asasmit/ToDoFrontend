import React, { useState, useEffect } from "react";
import Task from "../components/taskbox";
import { Box, Typography, Grid, TextField } from "@mui/material";
import axios from "axios";
import debounce from "lodash.debounce";
import axiosInstance from "../utils/axiosInstance";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // Search state

  useEffect(() => {
    fetchTasks(search);
  }, [search]); // Refetch when search changes

  const fetchTasks = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await axiosInstance.get(`/api/task?search=${query}`);

      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tasks");
      setLoading(false);
      console.error(err);
    }
  };

  // Debounced Search Handler
  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 300);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Task List</Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search tasks..."
        variant="outlined"
        onChange={handleSearch}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <Typography variant="body1">Loading tasks...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error">{error}</Typography>
      ) : tasks.length > 0 ? (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
              <Task 
                taskId={task._id}  
                title={task.title} 
                description={task.description} 
                deadline={task.deadline} 
                initialStatus={task.status} 
                refreshTasks={fetchTasks}  // ✅ Pass function to refresh tasks
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">No tasks available</Typography>
      )}
    </Box>
  );
};

export default TaskList;