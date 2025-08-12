import React, { useState, useEffect } from "react";
import { PlayCircle, PauseCircle, RotateCcw, Coffee, BookOpen, XCircle, CheckCircle } from 'lucide-react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Clock = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskSelectionLocked, setIsTaskSelectionLocked] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [pomodoroHistory, setPomodoroHistory] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const userId = auth.currentUser.uid;
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        where('status', '==', 'todo')
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      setTasks(tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };


  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            if (mode === "pomodoro") {
              setPomodoroCount((prevCount) => prevCount + 1);
              setPomodoroHistory((prevHistory) => [...prevHistory, { duration: 25, type: 'pomodoro' }]);
              setMode("break");
              setMinutes(5);
            } else {
              setBreakCount((prevCount) => prevCount + 1);
              setPomodoroHistory((prevHistory) => [...prevHistory, { duration: 5, type: 'break' }]);
              setMode("pomodoro");
              setMinutes(25);
            }
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    if (!isActive && !selectedTask) {
      alert("Por favor, selecciona una tarea antes de comenzar el temporizador.");
      return;
    }
    setIsActive(!isActive);
    if (!isTaskSelectionLocked) {
      setIsTaskSelectionLocked(true);
    }
    if (!isActive) {
      setSessionStartTime(Date.now()); 
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsTaskSelectionLocked(false);
    if (mode === "pomodoro") {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === "pomodoro") {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const handleTaskSelect = (task) => {
    if (!isTaskSelectionLocked) {
      try {
        setSelectedTask(task);
      } catch (error) {
        console.error('Error selecting task:', error);
      
      }
    }
  };

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancel = () => {
    resetTimer();
    setSelectedTask(null);
    setShowCancelConfirmation(false);
    setPomodoroCount(0);
    setBreakCount(0);
    setPomodoroHistory([]);
    setIsTaskSelectionLocked(false);
  };

  const handleFinish = () => {
    setShowFinishConfirmation(true);
  };

  const finalizeSession = () => {
    let elapsedTime;
    if (mode === "pomodoro") {
      elapsedTime = 25 - (minutes + seconds / 60);
    } else {
      elapsedTime = 5 - (minutes + seconds / 60);
    }
    elapsedTime = Math.round(elapsedTime * 10) / 10; 
    setPomodoroHistory((prevHistory) => [
      ...prevHistory,
      { type: mode, duration: elapsedTime }
    ]);
    if (mode === "pomodoro") {
      setPomodoroCount((prevCount) => prevCount + 1);
    } else {
      setBreakCount((prevCount) => prevCount + 1);
    }
    resetTimer();
    setSessionStartTime(null);
  };

  const confirmFinish = async () => {
    if (isActive) {
      finalizeSession();
    }
    const currentTime = new Date().toISOString();
    if (selectedTask) {
      const taskRef = doc(db, 'tasks', selectedTask.id);
      await updateDoc(taskRef, {
        status: 'done',
        pomodoroCount,
        breakCount,
        pomodoroHistory,
        finishedAt: currentTime,
      });
    }
    if (mode === 'break') {
      const elapsedMinutes = 5 - minutes;
      setPomodoroHistory((prevHistory) => [...prevHistory, { duration: elapsedMinutes, type: 'break' }]);
    }
    resetTimer();
    setSelectedTask(null);
    setShowFinishConfirmation(false);
    setPomodoroCount(0);
    setBreakCount(0);
    setPomodoroHistory([]);
    setIsTaskSelectionLocked(false);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Task list */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <h2 className="text-xl font-semibold mb-4">Lista de Tareas</h2>
          <div className="grid grid-cols-1 gap-4">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors ${
                    isTaskSelectionLocked ? 'opacity-50 pointer-events-none' : ''
                  } ${selectedTask && selectedTask.id === task.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleTaskSelect(task)}
                >
                  <h3 className="font-semibold">{task.name}</h3>
                  <p className="text-sm text-gray-600">{task.description || 'No description'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay tareas disponibles</p>
            )}
          </div>
        </div>

        {/* Task selection and Pomodoro timer */}
        <div className="md:col-span-2 flex flex-col">
          {/* Task selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Tarea Seleccionada</h2>
            {selectedTask ? (
              <div className="p-4 border rounded bg-gray-100">
                <h3 className="font-semibold">{selectedTask.name}</h3>
                <p className="text-sm">{selectedTask.description || 'No description'}</p>
              </div>
            ) : (
              <p className="text-gray-500">Ninguna tarea seleccionada</p>
            )}
          </div>

          {/* Pomodoro timer */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <div className="absolute top-2 right-2 flex space-x-2">
              {isActive && (
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Cancelar"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              )}
              {selectedTask && (
                <button
                  onClick={handleFinish}
                  className="text-blue-500 hover:text-blue-600"
                  aria-label="Terminar"
                >
                  <CheckCircle className="h-6 w-6" />
                </button>
              )}
            </div>

            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
              Técnica Pomodoro
            </h1>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => changeMode("pomodoro")}
                className={`px-4 py-2 rounded-full ${mode === "pomodoro" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} flex items-center`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Pomodoro
              </button>
              <button
                onClick={() => changeMode("break")}
                className={`px-4 py-2 rounded-full ${mode === "break" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} flex items-center`}
              >
                <Coffee className="mr-2 h-4 w-4" />
                Descanso
              </button>
            </div>

            <div className="text-6xl font-bold text-center mb-8 text-gray-800">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`px-6 py-2 rounded-lg ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white flex items-center`}
              >
                {isActive ? (
                  <PauseCircle className="mr-2 h-6 w-6" />
                ) : (
                  <PlayCircle className="mr-2 h-6 w-6" />
                )}
                {isActive ? "Pausar" : "Iniciar"}
              </button>
              {isActive && ( 
                <button
                  onClick={finalizeSession}
                  className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center"
                >
                  <CheckCircle className="mr-2 h-6 w-6" />
                  Finalizar
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 flex items-center"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Reiniciar
              </button>
            </div>

            <div className="text-center text-gray-600">
              Pomodoros completados: {pomodoroCount}
            </div>
            <div className="text-center text-gray-600">
              Descansos completados: {breakCount}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro History */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6"> {/* Added Pomodoro History section */}
        <h2 className="text-xl font-semibold mb-4">Historial de Pomodoros</h2>
        <ul className="list-disc pl-5">
          {pomodoroHistory.map((session, index) => (
            <li key={index} className="mb-2">
              - {session.type === 'pomodoro' ? 'Pomodoro' : 'Descanso'} {session.duration} minutos
            </li>
          ))}
        </ul>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">¿Seguro de cancelar?</h3>
            <p className="mb-6">Se perderá el registro del pomodoro.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                No, continuar
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish confirmation modal */}
      {showFinishConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">¿Terminar sesión de Pomodoro?</h3>
            <p className="mb-6">La tarea se marcará como completada y se guardará el registro de Pomodoros.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowFinishConfirmation(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                No, continuar
              </button>
              <button
                onClick={confirmFinish}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Sí, terminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clock;

