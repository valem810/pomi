import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Edit, Trash, Globe, Lock } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', isPublic: false });
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    const userId = auth.currentUser.uid;

    const todoQuery = query(collection(db, 'todoTasks'), where('userId', '==', userId));
    const doneQuery = query(collection(db, 'doneTasks'), where('userId', '==', userId));

    const todoSnapshot = await getDocs(todoQuery);
    const doneSnapshot = await getDocs(doneQuery);

    setTodoTasks(todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setDoneTasks(doneSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addTask = async () => {
    if (newTask.name.trim() !== '') {
      const task = {
        name: newTask.name,
        description: newTask.description,
        createdAt: new Date().toLocaleString(),
        isPublic: newTask.isPublic,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Usuario Anónimo',
      };

      await addDoc(collection(db, 'todoTasks'), task);
      setNewTask({ name: '', description: '', isPublic: false });
      setIsModalOpen(false);
      fetchTasks();
    }
  };

  const togglePublicStatus = async (task) => {
    const taskRef = doc(db, task.id.startsWith('todo') ? 'todoTasks' : 'doneTasks', task.id);
    await updateDoc(taskRef, { isPublic: !task.isPublic });
    fetchTasks();
  };

  const moveTask = async (task, fromList, toList) => {
    const fromCollection = fromList === todoTasks ? 'todoTasks' : 'doneTasks';
    const toCollection = toList === todoTasks ? 'todoTasks' : 'doneTasks';

    await addDoc(collection(db, toCollection), { ...task });
    await deleteDoc(doc(db, fromCollection, task.id));
    fetchTasks();
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({ name: task.name, description: task.description, isPublic: task.isPublic });
    setIsModalOpen(true);
  };

  const updateTask = async () => {
    if (newTask.name.trim() !== '') {
      const taskRef = doc(db, editingTask.id.startsWith('todo') ? 'todoTasks' : 'doneTasks', editingTask.id);
      await updateDoc(taskRef, { name: newTask.name, description: newTask.description, isPublic: newTask.isPublic });
      setNewTask({ name: '', description: '', isPublic: false });
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
      const collectionName = todoTasks.find(t => t.id === taskToDelete.id) ? 'todoTasks' : 'doneTasks';
      await deleteDoc(doc(db, collectionName, taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Gestor de Tareas</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditingTask(null);
              setNewTask({ name: '', description: '', isPublic: false });
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
            tasks={todoTasks}
            onMoveTask={(task) => moveTask(task, todoTasks, doneTasks)}
            onEditTask={editTask}
            onDeleteTask={confirmDeleteTask}
            onTogglePublic={togglePublicStatus}
            buttonText="Marcar como Hecha"
          />
          <TaskList
            title="Tareas Terminadas"
            tasks={doneTasks}
            onMoveTask={(task) => moveTask(task, doneTasks, todoTasks)}
            onEditTask={editTask}
            onDeleteTask={confirmDeleteTask}
            onTogglePublic={togglePublicStatus}
            buttonText="Mover a Por Hacer"
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
    </div>
  );
};

const TaskList = ({ title, tasks, onMoveTask, onEditTask, onDeleteTask, onTogglePublic, buttonText }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {tasks.map((task) => (
      <div key={task.id} className="mb-4 p-4 border rounded">
        <h3 className="font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <p className="text-xs text-gray-500 mb-2">Creada el: {task.createdAt}</p>
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
      ></textarea>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={newTask.isPublic}
          onChange={(e) => setNewTask({ ...newTask, isPublic: e.target.checked })}
          id="isPublic"
          className="mr-2"
        />
        <label htmlFor="isPublic" className="text-sm text-gray-600">
          ¿Hacer esta tarea pública?
        </label>
      </div>
      <button
        onClick={saveTask}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        {editingTask ? 'Guardar Cambios' : 'Agregar Tarea'}
      </button>
    </div>
  </div>
);

const DeleteModal = ({ closeModal, deleteTask }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">¿Estás seguro?</h2>
      <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
      <div className="flex justify-between">
        <button
          onClick={closeModal}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
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

export default Tasks;
