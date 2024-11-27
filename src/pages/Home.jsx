'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { Globe, ThumbsUp, MessageCircle, Share2, Image } from 'lucide-react'

const Home = () => {
  const [publicTasks, setPublicTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPublicTasks()
  }, [])

  const fetchPublicTasks = async () => {
    try {
      const publicQuery = query(
        collection(db, 'tasks'),
        where('isPublic', '==', true),
        where('status', '==', "done")
      )
      
      const publicSnapshot = await getDocs(publicQuery)
      const tasks = publicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPublicTasks(tasks)
    } catch (err) {
      console.error('Error fetching public tasks:', err)
      setError('Hubo un error al cargar las tareas.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Tareas Públicas</h1>

        {loading && <p className="text-center text-gray-600">Cargando tareas...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && publicTasks.length === 0 && (
          <p className="text-center text-gray-600">No hay tareas públicas completadas disponibles.</p>
        )}

        {publicTasks.map((task) => (
          <div key={task.id} className="mb-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              {/* Header with user info */}
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{task.userName}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatDate(task.createdAt)}</span>
                    <Globe className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Task content */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">{task.name}</h3>
                <p className="mt-2 text-gray-600">{task.description}</p>
                {task.finishedAt && (
                  <p className="mt-4 text-sm text-gray-500">
                    Finalizada: {formatDate(task.finishedAt)}
                  </p>
                )}
              </div>

              {/* Interaction metrics */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0 me gusta</span>
                  <span>0 comentarios</span>
                </div>

                {/* Interaction buttons */}
                <div className="mt-4 grid grid-cols-3 border-t pt-4">
                  <button className="flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Me gusta</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <MessageCircle className="h-5 w-5" />
                    <span>Comentar</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50">
                    <Share2 className="h-5 w-5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

