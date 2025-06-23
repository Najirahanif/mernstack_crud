import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState({
    taskName: '',
    description: '',
    dueDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:8000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTask(res.data);
      } catch (err) {
        toast.error('Failed to load task');
      }
    };
    fetchTask();
  }, [id]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/update/task/${id}`, task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task updated', { position: "top-right" });
      navigate('/tasks');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="addUser">
      <h4>Edit Task</h4>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            name="taskName"
            value={task.taskName}
            onChange={inputHandler}
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={task.description}
            onChange={inputHandler}
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate?.split('T')[0]}
            onChange={inputHandler}
          />
        </div>

        <div className="inputGroup">
          <button type="submit" className="customBtn">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
