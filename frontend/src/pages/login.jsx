import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for redirection

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your API to log in the user
    const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (data.token) {
      // Store the JWT token and username in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username);

      // Redirect to the home page or dashboard after successful login
      navigate('/'); // Navigate to home or dashboard page
    } else {
      setErrorMessage(data.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Log In</h2>
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
            type="password"
            name="password"
            placeholder="Password"
            className="border-2 p-2 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Log In
          </button>
          <p className="text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
