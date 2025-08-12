// src/components/ui/Label.jsx

import React from 'react';

const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

export {Label}; 
