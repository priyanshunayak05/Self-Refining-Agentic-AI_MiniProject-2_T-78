import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080b12' }}>
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="flex-1 min-h-0 overflow-auto"
          style={{ background: '#080b12' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
