import React from "react";
import { useState, useEffect } from "react";
import { usePopup } from "../context/popUpContext";

const PopupForm = () => {
  const { isOpen, setIsOpen } = usePopup();
  const [newTask, setNewTask] = useState("");

  // Get the token from localStorage (assuming it was saved during login)
  const token = localStorage.getItem('token');

  const createNewTask = async (e) => {
    e.preventDefault();
    const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/task', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ task: newTask }) // Wrap the task in an object
    })
    setIsOpen(false);

    if(response.ok){
      window.location.reload();
    }
  };

  if (!isOpen) return null; // Hide when not open

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsOpen(false)} // Close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold mb-4">New Task</h2>

        {/* Form */}
        <form className="flex flex-col space-y-3">
          <input type="text" onChange={(e)=>{setNewTask(e.target.value)}} placeholder="Enter Task: " name="task" className="border-2 p-2 rounded taskInput" />

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-red-400 text-white px-3 py-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" onClick={createNewTask} className="bg-blue-500 text-white px-3 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
