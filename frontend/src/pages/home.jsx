import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ListItem from '../components/ListItem';
import { PopupProvider } from '../context/popUpContext';
import PopupForm from '../components/PopupForm';

const Home = () => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/tasks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const d = await response.json();
            setData(d); // Update the task list
        } catch (error) {
            console.log(error);
        }
    };

    // Call fetchTasks initially when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Function to add new task to the list without re-fetching
    const addTaskToList = (newTask) => {
        setData((prevData) => [...prevData, newTask]); // Append the new task to the current task list
    };

    return (
        <div className="App">
            <PopupProvider>
                <Navbar />
                <div className="flex justify-center items-center flex-col space-y-8 p-8 max-w-3xl mx-auto">
                    {data.map((task) => (
                        <ListItem key={task._id} task={task} />
                    ))}
                </div>
                <PopupForm addTaskToList={addTaskToList} />
            </PopupProvider>
        </div>
    );
};

export default Home;
