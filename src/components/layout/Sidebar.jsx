import React from "react";
import { NavLink } from "react-router-dom";
import { useAppStore } from '../../store/useAppstore';
import menuItems from "../../data/sidebarMenu.js";

const Sidebar = () => {
  const { sidebarCollapsed, setActivePage } = useAppStore();

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 h-screen flex flex-col
      ${sidebarCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Spacer to push content below fixed navbar */}
      <div className="h-16 flex-shrink-0" />

      {/* PMO Menu title */}
      <div className="px-4 pb-2">
        <div className="text-center font-bold text-lg">
          {!sidebarCollapsed}
        </div>
      </div>

      {/* Scrollable menu area */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-hidden">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setActivePage(item.key)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200
                    ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-200"}`
                  }
                >
                  <Icon size={20} className={`${sidebarCollapsed ? "mx-auto" : "mr-3"}`} />
                  {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;