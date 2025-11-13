import React, { useState } from 'react';
import type { User } from '../types';
import { Role } from '../constants';
import AdminDashboard from './AdminDashboard';
import MarketingDashboard from './MarketingDashboard';
import { UserCircleIcon, ChevronDownIcon, ChartBarIcon } from './icons/Icon';

interface DashboardShellProps {
  user: User;
  onLogout: () => void;
  activeRole: Role;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ user, onLogout, activeRole }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const renderDashboard = () => {
    switch (activeRole) {
      case Role.Admin:
        return <AdminDashboard />;
      case Role.MarketingManager:
        return <MarketingDashboard />;
      default:
        return <div className="p-8">Select a role to begin.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-white" />
                 </div>
                 <h1 className="text-xl font-bold text-gray-800">Precision RAG</h1>
               </div>
               <span className="hidden sm:inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {activeRole} View
               </span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-500" />
                <span className="hidden md:inline text-sm font-medium text-gray-700">{user.name}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </button>
              {isUserMenuOpen && (
                <div onBlur={() => setIsUserMenuOpen(false)} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">Signed in as</p>
                    <p className="truncate">{user.email}</p>
                  </div>
                  <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;