import { useApp } from '../context/AppContext';
import { BookOpen, ClipboardList, CheckCircle, Clock, XCircle, Bell } from 'lucide-react';

export default function StudentDashboard({ onNavigate }) {
  const { currentUser, clubs, registrations, notifications } = useApp();

  const myRegs = registrations.filter(r => r.studentId === currentUser.id);
  const approved = myRegs.filter(r => r.status === 'approved');
  const pending = myRegs.filter(r => r.status === 'pending');
  const rejected = myRegs.filter(r => r.status === 'rejected');
  const unread = notifications.filter(n => n.userId === currentUser.id && !n.read);
  const recentNotifs = notifications.filter(n => n.userId === currentUser.id).slice(-4).reverse();

  const stats = [
    { label: 'CLB đang tham gia', value: approved.length, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Đơn chờ duyệt', value: pending.length, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Đơn bị từ chối', value: rejected.length, icon: XCircle, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Thông báo mới', value: unread.length, icon: Bell, color: '#3B82F6', bg: '#EFF6FF' },
  ];

  const availableClubs = clubs.filter(c => !registrations.find(r => r.studentId === currentUser.id && r.clubId === c.id));

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Xin chào, {currentUser.name.split(' ').pop()} 👋
        </h1>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Lớp {currentUser.class} · Đây là tổng quan hoạt động CLB của bạn</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card" style={{ cursor: 'default' }}>
              <div className="stat-icon" style={{ background: s.bg }}>
                <Icon size={22} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* My Clubs */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>CLB đang tham gia</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('my-registrations')}>Xem tất cả</button>
          </div>
          {approved.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-icon">🎯</div>
              <h3>Chưa tham gia CLB nào</h3>
              <p>Khám phá và đăng ký CLB ngay!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {approved.map(reg => {
                const club = clubs.find(c => c.id === reg.clubId);
                if (!club) return null;
                return (
                  <div key={reg.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.4rem' }}>{club.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{club.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{club.schedule}</div>
                    </div>
                    <span className="badge badge-approved">Đã duyệt</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent notifications */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Thông báo gần đây</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('notifications')}>Xem tất cả</button>
          </div>
          {recentNotifs.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-icon">🔔</div>
              <h3>Chưa có thông báo</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentNotifs.map(n => (
                <div key={n.id} style={{
                  padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)',
                  background: n.read ? 'var(--surface2)' : 'var(--primary-bg)',
                  borderColor: n.read ? 'var(--border)' : 'rgba(59,130,246,0.2)',
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 3 }}>{n.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available clubs */}
        <div className="card" style={{ padding: 20, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>CLB có thể đăng ký</h2>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('clubs')}>
              <BookOpen size={14} /> Xem tất cả CLB
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {availableClubs.slice(0, 4).map(club => (
              <div key={club.id} style={{ padding: '14px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}
                onClick={() => onNavigate('clubs')}
                onMouseEnter={e => { e.currentTarget.style.borderColor = club.color; e.currentTarget.style.background = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>{club.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{club.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{club.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                    {club.currentMembers}/{club.maxMembers} thành viên
                  </div>
                  <div className="progress-bar" style={{ width: 60 }}>
                    <div className="progress-fill" style={{ width: `${(club.currentMembers / club.maxMembers) * 100}%`, background: club.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
