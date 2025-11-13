import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DashboardShell from './components/DashboardShell';
import type { User } from './types';
import { Role } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const handleLogin = useCallback((username: string, role: Role) => {
    // In a real app, you'd perform authentication here.
    // For this demo, we'll create a mock user.
    const mockUser: User = {
      name: username,
      roles: [Role.Admin, Role.MarketingManager],
      email: 'manager@precision.com',
    };
    setUser(mockUser);
    setActiveRole(role);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setActiveRole(null);
  }, []);

  if (!user || !activeRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardShell user={user} onLogout={handleLogout} activeRole={activeRole} />;
};

export default App;