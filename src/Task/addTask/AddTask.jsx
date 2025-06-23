import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AddTask.css';

const AddTask = () => {
  const [task, setTask] = useState({
    taskName: '',
    description: '',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!task.taskName) newErrors.taskName = 'Task name is required';
    if (!task.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    try {
      const res = await axios.post('http://localhost:8000/api/task', task, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(res.data.message, { position: 'top-right' });
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to save task', { position: 'top-right' });
    }
  };

  return (
    <div className="addUser">
      <h4>Add New Task</h4>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            name="taskName"
            onChange={inputHandler}
            placeholder="Enter task name"
          />
          {errors.taskName && <p className="error">{errors.taskName}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            onChange={inputHandler}
            placeholder="Enter task description"
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            onChange={inputHandler}
          />
          {errors.dueDate && <p className="error">{errors.dueDate}</p>}
        </div>

        <div className="inputGroup">
          <button type="submit" className="customBtn" >Save</button>
        </div>
        <div className="inputGroup">
          <button type="button" className="cancelBtn" onClick={() => navigate('/tasks')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
