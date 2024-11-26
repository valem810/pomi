import React from 'react';
import Navbar from '../components/HNavbar';

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;