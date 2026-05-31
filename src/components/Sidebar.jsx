import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3,
  Settings, LogOut, Bell, Menu, X, GraduationCap, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = {
  student: [
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'clubs', label: 'Danh sách CLB', icon: BookOpen },
    { key: 'my-registrations', label: 'Đăng ký của tôi', icon: ClipboardList },
    { key: 'notifications', label: 'Thông báo', icon: Bell },
  ],
  teacher: [
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'registrations', label: 'Duyệt đơn đăng ký', icon: ClipboardList },
    { key: 'clubs', label: 'CLB quản lý', icon: BookOpen },
    { key: 'notifications', label: 'Thông báo', icon: Bell },
  ],
  principal: [
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'reports', label: 'Báo cáo tổng hợp', icon: BarChart3 },
    { key: 'clubs', label: 'Danh sách CLB', icon: BookOpen },
  ],
  admin: [
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'clubs', label: 'Quản lý CLB', icon: BookOpen },
    { key: 'users', label: 'Quản lý tài khoản', icon: Users },
    { key: 'registrations', label: 'Tất cả đơn', icon: ClipboardList },
    { key: 'reports', label: 'Báo cáo', icon: BarChart3 },
  ],
};

const ROLE_LABELS = { student: 'Học sinh', teacher: 'Giáo viên', principal: 'Ban Giám Hiệu', admin: 'Quản trị viên' };
const ROLE_COLORS = { student: '#3B82F6', teacher: '#8B5CF6', principal: '#10B981', admin: '#F59E0B' };

export default function Sidebar({ currentPage, onNavigate }) {
  const { currentUser, logout, notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV_ITEMS[currentUser?.role] || [];
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;
  const roleColor = ROLE_COLORS[currentUser?.role];

  const SidebarContent = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0F172A', color: 'white' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: '#3B82F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GraduationCap size={20} color="white" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>VTCo School</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>CLB Ngoại khóa</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
          className="hide-mobile">
          <ChevronRight size={16} style={{ transform: collapsed ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* User info */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar" style={{ width: 36, height: 36, background: roleColor, fontSize: '0.78rem', flexShrink: 0 }}>
          {currentUser?.avatar}
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.name}</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>{ROLE_LABELS[currentUser?.role]}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.key;
          const hasNotif = item.key === 'notifications' && unreadCount > 0;
          return (
            <button key={item.key} onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 0' : '9px 12px', justifyContent: collapsed ? 'center' : 'flex-start',
                border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font)',
                fontSize: '0.875rem', fontWeight: active ? 600 : 400, marginBottom: 2,
                background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: active ? '#60A5FA' : 'rgba(255,255,255,0.65)',
                transition: 'all 0.15s', position: 'relative',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
              {hasNotif && (
                <span style={{ marginLeft: 'auto', background: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 99, minWidth: 20, textAlign: 'center' }}>
                  {unreadCount}
                </span>
              )}
              {active && <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, background: '#3B82F6', borderRadius: 99 }} />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px 0' : '9px 12px', justifyContent: collapsed ? 'center' : 'flex-start',
            border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font)',
            fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', background: 'transparent', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#FCA5A5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
        >
          <LogOut size={18} />
          {!collapsed && 'Đăng xuất'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{
        width: collapsed ? 60 : 230, flexShrink: 0, transition: 'width 0.2s ease',
        height: '100vh', position: 'sticky', top: 0,
      }} className="hide-mobile">
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#0F172A', padding: '12px 16px', alignItems: 'center', gap: 12 }} className="show-mobile">
        <button onClick={() => setMobileOpen(true)} style={{ border: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 7, color: 'white', cursor: 'pointer', display: 'flex' }}>
          <Menu size={18} />
        </button>
        <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>VTCo School</span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="modal-overlay" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'flex-start' }}>
          <div style={{ width: 240, height: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
            <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 12, right: 12, border: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, color: 'white', cursor: 'pointer', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
