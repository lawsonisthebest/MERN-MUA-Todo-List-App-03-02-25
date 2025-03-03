import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for redirection

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Call your API to sign up the user
    const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (data.message === 'User created successfully') {
      // Store token and username in localStorage on successful sign-up
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username);

      // Redirect to the login page or home page after successful signup
      navigate('/login'); // Redirect to login page after successful sign-up
    } else {
      setErrorMessage(data.message || 'Something went wrong!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border-2 p-2 rounded"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border-2 p-2 rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-2 p-2 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border-2 p-2 rounded"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Sign Up
          </button>
          <p className="text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500">
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
