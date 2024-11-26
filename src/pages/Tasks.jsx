import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Edit, Trash, Globe, Lock, XCircle } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', isPublic: false, status: 'todo' });
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedCompletedTask, setSelectedCompletedTask] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () =>
{
    const userId = auth.currentUser.uid;
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
    const tasksSnapshot = await getDocs(tasksQuery);
    setTasks(tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addTask = async () => {
    if (newTask.name.trim() !== '') {
      const task = {
        name: newTask.name,
        description: newTask.description,
        createdAt: new Date().toISOString(),
        isPublic: newTask.isPublic,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Usuario Anónimo',
        status: newTask.status,
      };

      await addDoc(collection(db, 'tasks'), task);
      setNewTask({ name: '', description: '', isPublic: false, status: 'todo' });
      setIsModalOpen(false);
      fetchTasks();
    }
  };

  const togglePublicStatus = async (task) => {
    const taskRef = doc(db, 'tasks', task.id);
    await updateDoc(taskRef, { isPublic: !task.isPublic });
    fetchTasks();
  };

  const moveTask = async (task) => {
    const updatedStatus = task.status === 'todo' ? 'done' : 'todo';
    const taskRef = doc(db, 'tasks', task.id);
  
    const updates = {
      status: updatedStatus,
    };
  
    if (updatedStatus === 'done') {
      updates.finishedAt = new Date().toISOString();
    } else {
      updates.finishedAt = null;
    }
  
    await updateDoc(taskRef, updates);
    fetchTasks();
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({ name: task.name, description: task.description, isPublic: task.isPublic, status: task.status });
    setIsModalOpen(true);
  };

  const updateTask = async () => {
    if (newTask.name.trim() !== '') {
      const taskRef = doc(db, 'tasks', editingTask.id);
      await updateDoc(taskRef, { name: newTask.name, description: newTask.description, isPublic: newTask.isPublic, status: newTask.status });
      setNewTask({ name: '', description: '', isPublic: false, status: 'todo' });
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const deleteTask = async () => {
    if (taskToDelete) {
      await deleteDoc(doc(db, 'tasks', taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    }
  };

  const handleCompletedTaskClick = (task) => {
    setSelectedCompletedTask(task);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Gestor de Tareas</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditingTask(null);
              setNewTask({ name: '', description: '', isPublic: false, status: 'todo' });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <PlusCircle className="mr-2" />
            Crear Tarea
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <TaskList
            title="Tareas por Hacer"
            tasks={tasks.filter((task) => task.status === 'todo')}
            onMoveTask={moveTask}
            onEditTask={editTask}
            onDeleteTask={confirmDeleteTask}
            onTogglePublic={togglePublicStatus}
            buttonText="Marcar como Hecha"
          />
          <TaskList
            title="Tareas Terminadas"
            tasks={tasks.filter((task) => task.status === 'done')}
            onMoveTask={moveTask}
            onEditTask={editTask}
            onDeleteTask={confirmDeleteTask}
            onTogglePublic={togglePublicStatus}
            buttonText="Mover a Por Hacer"
            onTaskClick={handleCompletedTaskClick}
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal
          editingTask={editingTask}
          newTask={newTask}
          setNewTask={setNewTask}
          closeModal={() => setIsModalOpen(false)}
          saveTask={editingTask ? updateTask : addTask}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          closeModal={() => setIsDeleteModalOpen(false)}
          deleteTask={deleteTask}
        />
      )}

      {selectedCompletedTask && (
        <TaskSummary
          task={selectedCompletedTask}
          onClose={() => setSelectedCompletedTask(null)}
        />
      )}
    </div>
  );
};

const TaskList = ({ title, tasks, onMoveTask, onEditTask, onDeleteTask, onTogglePublic, buttonText, onTaskClick }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {tasks.map((task) => (
      <div key={task.id} className="mb-4 p-4 border rounded">
        <h3 className="font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <p className="text-xs text-gray-500 mb-2">Creada el: {new Date(task.createdAt).toLocaleString()}</p>
        {task.finishedAt && (
          <p className="text-xs text-green-500 mb-2">Terminada el: {new Date(task.finishedAt).toLocaleString()}</p>
        )}
        <div className="flex justify-between items-center">
          <button
            onClick={() => onMoveTask(task)}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
          >
            {buttonText}
          </button>
          <div className="flex items-center">
            <button
              onClick={() => onTogglePublic(task)}
              className={`mr-2 ${task.isPublic ? 'text-green-500' : 'text-gray-500'}`}
            >
              {task.isPublic ? <Globe size={18} /> : <Lock size={18} />}
            </button>
            <button
              onClick={() => onEditTask(task)}
              className="text-blue-500 mr-2"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDeleteTask(task)}
              className="text-red-500"
            >
              <Trash size={18} />
            </button>
            {task.status === 'done' && (
              <button
                onClick={() => onTaskClick(task)}
                className="text-purple-500 ml-2"
              >
                Ver resumen
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Modal = ({ editingTask, newTask, setNewTask, closeModal, saveTask }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
          <X />
        </button>
      </div>
      <input
        type="text"
        placeholder="Nombre de la tarea"
        value={newTask.name}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      <textarea
        placeholder="Descripción"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={newTask.isPublic}
          onChange={(e) => setNewTask({ ...newTask, isPublic: e.target.checked })}
          className="mr-2"
        />
        <span className="text-sm">Hacer pública</span>
      </div>
      <div className="flex items-center mb-4">
        <label className="mr-2">Estado</label>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="px-4 py-2 border rounded"
        >
          <option value="todo">Por Hacer</option>
          <option value="done">Hecha</option>
        </select>
      </div>
      <button
        onClick={saveTask}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        {editingTask ? 'Actualizar Tarea' : 'Crear Tarea'}
      </button>
    </div>
  </div>
);

const DeleteModal = ({ closeModal, deleteTask }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">¿Estás seguro de que deseas eliminar esta tarea?</h2>
      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
        >
          Cancelar
        </button>
        <button
          onClick={deleteTask}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

const TaskSummary = ({ task, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <XCircle size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4">{task.name}</h2>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-semibold">Fecha de creación:</p>
          <p className="text-xs text-gray-500 mb-2">Creada el: {new Date(task.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold">Fecha de finalización:</p>
          <p>{new Date(task.finishedAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Pomodoros completados: {task.pomodoroCount}</p>
        <p className="font-semibold">Descansos completados: {task.breakCount}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Historial de Pomodoros</h3>
        <ul className="list-disc pl-5">
          {task.pomodoroHistory && task.pomodoroHistory.map((pomodoro, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{pomodoro.type === 'pomodoro' ? 'Pomodoro' : 'Descanso'}:</span> {pomodoro.duration} minutos
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Tasks;

