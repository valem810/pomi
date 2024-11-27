import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Asegúrate de importar Firebase Auth
import { db } from '../firebaseConfig';

const Home = () => {
  const [publicTasks, setPublicTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    fetchPublicTasks();
  }, []);

  const fetchPublicTasks = async () => {
    try {
      const publicQuery = query(collection(db, 'tasks'), where('isPublic', '==', true));
      const publicSnapshot = await getDocs(publicQuery);

      const tasks = publicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPublicTasks(tasks);
    } catch (err) {
      console.error('Error fetching public tasks:', err);
      setError('Hubo un error al cargar las tareas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Tareas Públicas</h1>

        {loading && <p className="text-center text-gray-600">Cargando tareas...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && publicTasks.length === 0 && (
          <p className="text-center text-gray-600">No hay tareas públicas disponibles.</p>
        )}

        {publicTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
            <div className="flex items-center p-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-3">
                {task.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{task.userName}</p>

              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{task.name}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
              <p className="text-xs text-gray-500 mb-2">Creada el: {task.createdAt}</p>
              {task.finishedAt && (
                <p className="text-xs text-green-500 mb-2">Terminada el: {task.finishedAt}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

