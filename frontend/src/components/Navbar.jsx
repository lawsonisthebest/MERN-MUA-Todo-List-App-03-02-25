import React from "react";
import { usePopup } from "../context/popUpContext";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { setIsOpen } = usePopup(); // Get function to open the popup

  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const navigate = useNavigate(); // useNavigate hook

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username'); // Assuming username is stored

        if (token && user) {
            setIsAuthenticated(true);
            setUsername(user);
        } else {
            setIsAuthenticated(false);
        }

        setLoading(false);
    }, []);

    const logout = () => {
        // Clear token and user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        // Update authentication state
        setIsAuthenticated(false);
        setUsername('');

        // Redirect the user to login page
        navigate('/'); // useNavigate to redirect to login page

        window.location.reload();
    };

  return (
    <div className="bg-blue-500 text-white flex justify-between items-center px-10 py-7">
      <button className="text-5xl font-extrabold">Todo List</button>
      <div className="flex space-x-8">
        {isAuthenticated&&<button onClick={() => setIsOpen(true)} className="text-3xl font-semibold">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>}
        {!isAuthenticated&&<Link to={"/signUp"} className="text-3xl font-semibold">
          <i class="fa-regular fa-user"></i>
        </Link>}
        {isAuthenticated&&<button onClick={logout} className="text-2xl font-semibold">Logout</button>}
      </div>
    </div>
  );
};

export default Navbar;
