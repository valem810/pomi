// src/components/ui/Input.jsx

import React from 'react';

const Input = ({ id, type, placeholder, className, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

export {Input}; // Asegúrate de que sea "default"
