import React, { useState, useEffect } from 'react'
import { PlusCircle, X, Upload } from 'lucide-react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebaseConfig' // Asumiendo que la configuración de Firebase está en este archivo

const storage = getStorage()

const Tasks = () => {
  const [todoTasks, setTodoTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ name: '', description: '', image: null })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const todoSnapshot = await getDocs(collection(db, 'todoTasks'))
    const doneSnapshot = await getDocs(collection(db, 'doneTasks'))

    setTodoTasks(todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    setDoneTasks(doneSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  const addTask = async () => {
    if (newTask.name.trim() !== '') {
      let imageUrl = null
      if (newTask.image) {
        const storageRef = ref(storage, `taskImages/${Date.now()}_${newTask.image.name}`)
        await uploadBytes(storageRef, newTask.image)
        imageUrl = await getDownloadURL(storageRef)
      }

      const task = {
        name: newTask.name,
        description: newTask.description,
        createdAt: new Date().toLocaleString(),
        imageUrl: imageUrl
      }

      await addDoc(collection(db, 'todoTasks'), task)
      setNewTask({ name: '', description: '', image: null })
      setImagePreview(null)
      setIsModalOpen(false)
      fetchTasks()
    }
  }

  const moveTask = async (task, fromList, toList) => {
    const fromCollection = fromList === todoTasks ? 'todoTasks' : 'doneTasks'
    const toCollection = toList === todoTasks ? 'todoTasks' : 'doneTasks'

    await updateDoc(doc(db, fromCollection, task.id), { status: toCollection === 'doneTasks' ? 'done' : 'todo' })
    await addDoc(collection(db, toCollection), task)
    fetchTasks()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewTask({ ...newTask, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Gestor de Tareas</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <PlusCircle className="mr-2" />
            Crear Tarea
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <TaskList
            title="Tareas por Hacer"
            tasks={todoTasks}
            onMoveTask={(task) => moveTask(task, todoTasks, doneTasks)}
            buttonText="Marcar como Hecha"
          />
          <TaskList
            title="Tareas Terminadas"
            tasks={doneTasks}
            onMoveTask={(task) => moveTask(task, doneTasks, todoTasks)}
            buttonText="Mover a Por Hacer"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Crear Nueva Tarea</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>
            <input
              type="text"
              placeholder="Nombre de la tarea"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              placeholder="Descripción de la tarea"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-2 mb-4 border rounded h-32"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de la tarea
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
              )}
            </div>
            <button onClick={addTask} className="w-full bg-blue-500 text-white px-4 py-2 rounded">
              Crear Tarea
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const TaskList = ({ title, tasks, onMoveTask, buttonText }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {tasks.map((task) => (
      <div key={task.id} className="mb-4 p-4 border rounded">
        <h3 className="font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <p className="text-xs text-gray-500 mb-2">Creada el: {task.createdAt}</p>
        {task.imageUrl && (
          <img src={task.imageUrl} alt={task.name} className="w-full h-32 object-cover rounded mb-2" />
        )}
        <button
          onClick={() => onMoveTask(task)}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
        >
          {buttonText}
        </button>
      </div>
    ))}
  </div>
)

export default Tasks