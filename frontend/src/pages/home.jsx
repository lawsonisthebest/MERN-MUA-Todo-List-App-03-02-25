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

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the component mounts
    }, []);


    return (
        <div className="App">
            <PopupProvider>
                <Navbar />
                <div className='flex justify-center items-center flex-col space-y-8 p-8 max-w-3xl mx-auto'> 
                    {data.map((task) => (
                        <ListItem key={task._id} task={task} />
                    ))}
                </div>
                <PopupForm />
            </PopupProvider>
        </div>
    );
};

export default Home;
