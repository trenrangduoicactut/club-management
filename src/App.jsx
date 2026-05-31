import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import ClubsPage from './pages/ClubsPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import NotificationsPage from './pages/NotificationsPage';
import TeacherRegistrationsPage from './pages/TeacherRegistrationsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import AdminClubsPage from './pages/AdminClubsPage';
import { TeacherDashboard, PrincipalDashboard, AdminDashboard } from './pages/Dashboards';

function AppShell() {
  const { currentUser, logout } = useApp();
  const [page, setPage] = useState('dashboard');
  const [loginUser, setLoginUser] = useState(null);

  const handleLogin = (user) => {
    setLoginUser(user);
    setPage('dashboard');
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    const role = currentUser.role;

    if (page === 'dashboard') {
      if (role === 'student') return <StudentDashboard onNavigate={setPage} />;
      if (role === 'teacher') return <TeacherDashboard onNavigate={setPage} />;
      if (role === 'principal') return <PrincipalDashboard onNavigate={setPage} />;
      if (role === 'admin') return <AdminDashboard onNavigate={setPage} />;
    }

    if (page === 'clubs') {
      if (role === 'admin') return <AdminClubsPage />;
      return <ClubsPage />;
    }

    if (page === 'my-registrations') return <MyRegistrationsPage onNavigate={setPage} />;
    if (page === 'notifications') return <NotificationsPage />;
    if (page === 'registrations') return <TeacherRegistrationsPage />;
    if (page === 'reports') return <ReportsPage />;
    if (page === 'users') return <UsersPage />;

    return <div style={{ padding: 24 }}>Trang không tồn tại</div>;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
