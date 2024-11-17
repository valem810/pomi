// src/components/ui/button.jsx
import React from 'react';

const Button = ({ children, onClick, className, size }) => {
  const sizeClass = size === 'lg' ? 'py-2 px-4 text-lg' : 'py-1 px-3 text-sm';

  return (
    <button onClick={onClick} className={`btn ${sizeClass} ${className}`}>
      {children}
    </button>
  );
};

export { Button };
