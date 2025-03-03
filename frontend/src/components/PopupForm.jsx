import React, { useState } from 'react';

const PopupForm = ({ addTaskToList }) => {
    const [task, setTask] = useState('');
    const token = localStorage.getItem('token');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!task) return;

        try {
            const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/task', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task }),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const newTask = await response.json();
            addTaskToList(newTask.task); // Update the parent component's state with the new task

            setTask(''); // Clear the input field after submitting
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="popup-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter task"
                />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default PopupForm;
