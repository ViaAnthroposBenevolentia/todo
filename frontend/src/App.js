// src/App.js
import React, { useState, useEffect} from "react";
import axios from "axios";

function App() {
  const API_URL = process.env.REACT_APP_API_URL;

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
    const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
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
    <div className="App" style={styles.container}>
      <h1>ToDo App</h1>

      {/* Form to add or edit a todo */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {editTodo ? "Update ToDo" : "Add ToDo"}
        </button>
        {editTodo && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </form>

      {/* List of todos */}
      <ul style={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} style={styles.listItem}>
            <div>
              <h2
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                onClick={() => toggleCompletion(todo)}
              >
                {todo.title}
              </h2>
              <p>{todo.description}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(todo)}
                style={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => toggleCompletion(todo)}
                style={todo.completed ? styles.ToDoCompleted : styles.ToDoNotCompleted}
              >
                {todo.completed ? "Not Done" : "✔ "}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Updated styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    margin: "5px 0",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    backgroundColor: "#ccc",
    border: "none",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginLeft: "5px",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#4d79ff",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  ToDoCompleted: {
    padding: "5px 10px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginLeft: "5px",
  },
  ToDoNotCompleted: {
    padding: "5px 10px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginLeft: "5px",
  },
};

export default App;
