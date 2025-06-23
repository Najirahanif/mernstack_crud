import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddUser = () => {
  const users = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  const [user, setUser] = useState(users);
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

    if (!user.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (user.confirmPassword !== user.password) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    console.log('Sending user:', user);
    await axios
      .post('http://localhost:8000/api/user', user)
      
      .then((res) => {
        toast.success(res.data.message, { position: 'top-right' });
        console.log('User created successfully', res);
        // navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrors((prev) => ({ ...prev, email: 'Email already exists' }));
        } else {
          toast.error('Something went wrong', { position: 'top-right' });
        }
      });
  };

  return (
    <div className='addUser'>
      <h4>Welcome Sign Up System</h4>
      <p>Your gateway to seamless <br />transactions and easy payment</p>

      <form className='addUserForm' onSubmit={submitForm}>
        <div className='inputGroup'>
          <label htmlFor='email'>Email:</label>
          <input
            type='text'
            id='email'
            name='email'
            onChange={inputHandler}
            autoComplete='off'
            placeholder='Enter your email'
          />
          {errors.email && <p className='error'>{errors.email}</p>}
        </div>

        <div className='inputGroup'>
          <label htmlFor='password'>Password:</label>
          <input
            type='text'
            id='password'
            name='password'
            onChange={inputHandler}
            autoComplete='off'
            placeholder='Enter your password'
          />
          {errors.password && <p className='error'>{errors.password}</p>}
        </div>

        <div className='inputGroup'>
          <label htmlFor='confirmPassword'>Confirm Password:</label>
          <input
            type='text'
            id='confirmPassword'
            name='confirmPassword'
            onChange={inputHandler}
            autoComplete='off'
            placeholder='Re-enter your password'
          />
          {errors.confirmPassword && <p className='error'>{errors.confirmPassword}</p>}
        </div>

        <div className='inputGroup rememberLine'>
          <label className='rememberMe'>
            <input type='checkbox' name='rememberMe' />
            <span>Remember me</span>
          </label>
          <span className='signInText' onClick={() => navigate('/login')}>
            Sign in
            </span>
        </div>

        <div className='inputGroup'>
          <button type='submit' className='customBtn'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
