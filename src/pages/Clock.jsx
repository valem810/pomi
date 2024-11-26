import React, { useState, useEffect } from "react";
import { PlayCircle, PauseCircle, RotateCcw, Coffee, BookOpen } from 'lucide-react';

const Clock = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [pomodoroCount, setPomodoroCount] = useState(0);

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
              setMode("break");
              setMinutes(5);
            } else {
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
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Técnica Pomodoro
          </h1>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => changeMode("pomodoro")}
              className={`px-4 py-2 rounded-full ${
                mode === "pomodoro"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } flex items-center`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Pomodoro
            </button>
            <button
              onClick={() => changeMode("break")}
              className={`px-4 py-2 rounded-full ${
                mode === "break"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } flex items-center`}
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
              className={`px-6 py-2 rounded-lg ${
                isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white flex items-center`}
            >
              {isActive ? (
                <PauseCircle className="mr-2 h-6 w-6" />
              ) : (
                <PlayCircle className="mr-2 h-6 w-6" />
              )}
              {isActive ? "Pausar" : "Iniciar"}
            </button>
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
        </div>
      </main>
    </div>
  );
};

export default Clock;