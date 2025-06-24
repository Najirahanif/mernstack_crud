import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(user.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!user.password) {
      newErrors.password = 'Password is required';
    } else if (user.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitForm = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await axios.post('http://localhost:8000/api/user/login', {
      email: user.email,
      password: user.password
    });
    localStorage.setItem('token', res.data.token); 
    toast.success('Login successful!', { position: 'top-right' });
    navigate('/tasks'); 
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed', { position: 'top-right' });
    navigate('/login');
  }
};

  return (
    <div className='addUser'>
      <h4>Welcome Login System</h4>
      <p>Your gateway to seamless <br />transactions and easy payment</p>

      <form className='addUserForm' onSubmit={submitForm}>
        <div className='inputGroup'>
          <label htmlFor='email'>Email:</label>
          <input
            type='text'
            name='email'
            placeholder='Enter your email'
            onChange={inputHandler}
            autoComplete='off'
          />
          {errors.email && <p className='error'>{errors.email}</p>}
        </div>

        <div className='inputGroup'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            name='password'
            placeholder='Enter your password'
            onChange={inputHandler}
            autoComplete='off'
          />
          {errors.password && <p className='error'>{errors.password}</p>}
        </div>

        <div className='inputGroup rememberLine'>
          <label className='rememberMe'>
            <input type='checkbox' name='rememberMe' />
            <span>Remember me</span>
          </label>
          <span
            className='signInText'
            onClick={() => navigate('/')}
          >
            Sign up
          </span>
        </div>

        <div className='inputGroup'>
          <button type='submit' className='customBtn'>Sign In</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
