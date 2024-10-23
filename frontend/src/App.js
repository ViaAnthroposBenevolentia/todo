// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editTodo, setEditTodo] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos/`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTodo) {
        // Update existing todo
        await axios.put(`${API_URL}/todos/${editTodo.id}/`, formData);
        setEditTodo(null);
      } else {
        // Create new todo
        await axios.post(`${API_URL}/todos/`, formData);
      }
      fetchTodos();
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error submitting todo:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_URL}/todos/${id}/`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
    });
  };

  const handleCancelEdit = () => {
    setEditTodo(null);
    setFormData({ title: "", description: "" });
  };

  const toggleCompletion = async (todo) => {
    try {
      await axios.patch(`${API_URL}/todos/${todo.id}/`, {
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <h1>Todo App</h1>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginRight: "10px" }}
        >
          {editTodo ? "Update Todo" : "Add Todo"}
        </Button>
        {editTodo && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
        )}
      </form>

      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(todo)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(todo.id)}
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <Checkbox
              edge="start"
              checked={todo.completed}
              tabIndex={-1}
              disableRipple
              onChange={() => toggleCompletion(todo)}
            />
            <ListItemText
              primary={todo.title}
              secondary={todo.description}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
