import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListTask.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ListTask = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchTasks = async (currentPage = 1) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/api/tasks?page=${currentPage}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleAddTask = () => {
    navigate('/addTask');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:8000/api/delete/task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Task deleted successfully", { position: "top-right" });
      fetchTasks(page); // refresh current page
    } catch (error) {
      toast.error("Failed to delete task", { position: "top-right" });
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="task-container">
      <div className="task-header">
        <h1 className="task-title">Task Management</h1>
        <button className="add-task-btn" onClick={handleAddTask}>+ Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h4>No Tasks found</h4>
          <p>Add more tasks</p>
        </div>
      ) : (
        <>
          <table className="task-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Date & Time</th>
                <th>Task</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{(page - 1) * 5 + index + 1}</td>
                  <td>{new Date(task.dueDate).toLocaleString()}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td>
                    <button className="action-btn" onClick={() => navigate(`/editTask/${task._id}`)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(task._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListTask;
