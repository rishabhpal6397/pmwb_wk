import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAppStore } from '../../store/useAppstore';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { projectInfo, toggleSidebar } = useAppStore();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setOpen(false);
    logout();
    navigate('/');
  }

  return (
    <nav className="fixed w-full top-0 left-0 bg-white z-50 shadow-md px-6 py-3 flex items-center justify-between">

      {/* LEFT — Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-900 focus:outline-none text-xl"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          PMWB - {projectInfo?.name || 'Project Dashboard'}
        </h1>
      </div>

      {/* RIGHT — Bell + User */}
      <div className="flex items-center gap-5">

        {/* Bell */}
        {isAuthenticated && (
          <div className="relative cursor-pointer group">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full leading-4">
              2
            </span>
            <div className="absolute top-7 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Notifications
            </div>
          </div>
        )}

        {/* User dropdown */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold uppercase">
                {user?.username?.[0] ?? 'U'}
              </span>
              <span className="text-slate-700">{user?.username ?? 'User'}</span>
              <span className="text-slate-400 text-xs">▽</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user?.username}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <ul className="text-sm py-1">
                  <li onClick={() => setOpen(false)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-slate-700">
                    Profile
                  </li>
                  <li onClick={() => setOpen(false)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-slate-700">
                    Settings
                  </li>
                  <li onClick={handleLogout}
                    className="px-4 py-2 hover:bg-rose-50 cursor-pointer text-rose-500 font-medium">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;