import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Home = () => {
  const [publicTasks, setPublicTasks] = useState([]);

  useEffect(() => {
    fetchPublicTasks();
  }, []);

  const fetchPublicTasks = async () => {
    const publicQuery = query(collection(db, 'todoTasks'), where('isPublic', '==', true));
    const publicSnapshot = await getDocs(publicQuery);

    setPublicTasks(publicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Tareas Públicas</h1>
        {publicTasks.map(task => (
          <div key={task.id} className="mb-4 p-4 bg-white shadow rounded">
            <h3 className="font-semibold text-lg">{task.name}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-xs text-gray-500">Creada por: {task.userName}</p>
            <p className="text-xs text-gray-500">Fecha: {task.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
