import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { Clock, Coffee } from 'lucide-react'

const Home = () => {
  const [completedTasks, setCompletedTasks] = useState([])

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const q = query(collection(db, 'doneTasks'), where('status', '==', 'done'))
      const querySnapshot = await getDocs(q)
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCompletedTasks(tasks)
    }

    fetchCompletedTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Tareas Completadas</h1>
        <div className="grid gap-6">
          {completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        {task.imageUrl && (
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={task.imageUrl} alt={task.name} />
          </div>
        )}
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{task.name}</div>
          <p className="mt-2 text-gray-500">{task.description}</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            Creada el: {task.createdAt}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            Pomodoros: {task.pomodoros || 0}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Coffee className="mr-2 h-4 w-4" />
            Descansos: {task.breaks || 0}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home