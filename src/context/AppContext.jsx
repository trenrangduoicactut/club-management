import { createContext, useContext, useState } from 'react';
import { USERS, CLUBS, REGISTRATIONS, NOTIFICATIONS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [clubs, setClubs] = useState(CLUBS);
  const [registrations, setRegistrations] = useState(REGISTRATIONS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [users, setUsers] = useState(USERS);

  const login = (email, password) => {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); return { success: true, user }; }
    return { success: false };
  };

  const logout = () => setCurrentUser(null);

  const submitRegistration = (clubId) => {
    const existing = registrations.find(r => r.studentId === currentUser.id && r.clubId === clubId);
    if (existing) return { success: false, message: 'Bạn đã đăng ký CLB này rồi' };
    const newReg = {
      id: registrations.length + 1, studentId: currentUser.id, clubId,
      status: 'pending', appliedAt: new Date().toISOString().split('T')[0], processedAt: null, note: ''
    };
    setRegistrations(prev => [...prev, newReg]);
    const notif = {
      id: notifications.length + 1, userId: currentUser.id,
      message: `Đơn đăng ký ${clubs.find(c => c.id === clubId)?.name} đang chờ xét duyệt.`,
      type: 'info', read: false, date: new Date().toISOString().split('T')[0]
    };
    setNotifications(prev => [...prev, notif]);
    return { success: true };
  };

  const processRegistration = (regId, action, note = '') => {
    setRegistrations(prev => prev.map(r => r.id === regId
      ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', processedAt: new Date().toISOString().split('T')[0], note }
      : r
    ));
    const reg = registrations.find(r => r.id === regId);
    if (reg) {
      const club = clubs.find(c => c.id === reg.clubId);
      const notif = {
        id: notifications.length + 1, userId: reg.studentId,
        message: action === 'approve'
          ? `Đơn đăng ký ${club?.name} của bạn đã được duyệt!`
          : `Đơn đăng ký ${club?.name} bị từ chối.${note ? ' Lý do: ' + note : ''}`,
        type: action === 'approve' ? 'success' : 'error',
        read: false, date: new Date().toISOString().split('T')[0]
      };
      setNotifications(prev => [...prev, notif]);
      if (action === 'approve') {
        setClubs(prev => prev.map(c => c.id === reg.clubId ? { ...c, currentMembers: c.currentMembers + 1 } : c));
      }
    }
  };

  const addClub = (clubData) => {
    const newClub = { ...clubData, id: clubs.length + 1, currentMembers: 0, status: 'active' };
    setClubs(prev => [...prev, newClub]);
  };

  const updateClub = (id, data) => setClubs(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteClub = (id) => setClubs(prev => prev.filter(c => c.id !== id));

  const addUser = (userData) => {
    const newUser = { ...userData, id: users.length + 1, avatar: userData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() };
    setUsers(prev => [...prev, newUser]);
  };
  const updateUser = (id, data) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const markNotificationRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      clubs, addClub, updateClub, deleteClub,
      registrations, submitRegistration, processRegistration,
      notifications, markNotificationRead,
      users, addUser, updateUser, deleteUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
