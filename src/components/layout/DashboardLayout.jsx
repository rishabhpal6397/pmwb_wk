import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Loader from '../common/Loader';
import { useAppStore } from '../../store/useAppstore';

const DashboardLayout = () => {
  const { sidebarCollapsed, isExporting  } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-hidden">
      <Navbar />
      <main className="pt-16 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
    {isExporting && <Loader fullPage />}
  </div>
  );
};

export default DashboardLayout;