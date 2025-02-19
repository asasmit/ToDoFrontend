import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const AddTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to add a task.");
      return;
    }

    setLoading(true);

    try {
      const formattedDeadline = new Date(task.deadline).toISOString();

      await axiosInstance.post("/api/task", {
        title: task.title,
        description: task.description,
        deadline: formattedDeadline,
      });
      

      setSuccess("Task added successfully!");
      setError("");
      setTask({
        title: "",
        description: "",
        deadline: "",
      });

    } catch (err) {
      setError("Failed to add task. Please try again.");
      setSuccess("");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Task
      </Typography>

      {error && <Typography variant="body1" color="error">{error}</Typography>}
      {success && <Typography variant="body1" color="primary">{success}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Task Title"
          name="title"
          value={task.title}
          onChange={handleChange}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Deadline"
          name="deadline"
          type="datetime-local"
          value={task.deadline}
          onChange={handleChange}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default AddTask;