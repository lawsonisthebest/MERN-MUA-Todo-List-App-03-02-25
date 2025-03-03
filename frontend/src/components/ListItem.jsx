import React from 'react'

const ListItem = ({task}) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

  const deleteTask = async (id) => {
    const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/task/'+id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ id })
    })

    if(response.ok){
      window.location.reload();
    }
  }

  const toggleCompletion = async (id) => {
    const response = await fetch('https://mern-mua-todo-list-app-backend.onrender.com/api/task/'+id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ id })
    })

    if(response.ok){
      window.location.reload();
    }
  }

  return (
      <div>
          {task.completed&&<div className={`flex p-6 bg-blue-500 text-white rounded-lg shadow-md justify-between items-center px-8 w-full opacity-50`}>
          <div className='flex items-center space-x-4'>
            <button onClick={()=>{toggleCompletion(task._id)}}>{!task.completed && <i class="fa-regular fa-circle text-2xl"></i>}{task.completed && <i class="fa-regular fa-circle-check text-2xl"></i>}</button>
            <h1 className='text-3xl font-bold break-all w-full pr-4'>{task.task}</h1>
          </div>
          <div>
            <button onClick={()=>{deleteTask(task._id)}} className='text-2xl'><i class="fa-regular fa-trash-can"></i></button>
          </div>
         </div>}
    
        {!task.completed&&<div className={`flex p-6 bg-blue-500 text-white rounded-lg shadow-md justify-between items-center px-8 w-full opacity-100`}>
          <div className='flex items-center space-x-4'>
            <button onClick={()=>{toggleCompletion(task._id)}}>{!task.completed && <i class="fa-regular fa-circle text-2xl"></i>}{task.completed && <i class="fa-regular fa-circle-check text-2xl"></i>}</button>
            <h1 className='text-3xl font-bold break-all w-full pr-4'>{task.task}</h1>
          </div>
          <div>
            <button onClick={()=>{deleteTask(task._id)}} className='text-2xl'><i class="fa-regular fa-trash-can"></i></button>
          </div>
         </div>}
     </div>
  )
}

export default ListItem
