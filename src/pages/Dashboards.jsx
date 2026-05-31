import { useApp } from '../context/AppContext';
import { ClipboardList, CheckCircle, Clock, XCircle, BookOpen, BarChart3, Users } from 'lucide-react';

export function TeacherDashboard({ onNavigate }) {
  const { currentUser, registrations, clubs, users } = useApp();
  const myClubIds = currentUser.managedClubs || [];

  const myRegs = registrations.filter(r => myClubIds.includes(r.clubId));
  const pending = myRegs.filter(r => r.status === 'pending');
  const approved = myRegs.filter(r => r.status === 'approved');
  const myClubs = clubs.filter(c => myClubIds.includes(c.id));

  const stats = [
    { label: 'CLB phụ trách', value: myClubs.length, icon: BookOpen, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Đơn chờ duyệt', value: pending.length, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Đã duyệt', value: approved.length, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Tổng đơn', value: myRegs.length, icon: ClipboardList, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Xin chào, {currentUser.name.split(' ').pop()} 👋
        </h1>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Giáo viên phụ trách CLB</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Pending registrations */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Đơn chờ duyệt</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('registrations')}>Xem tất cả</button>
          </div>
          {pending.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-icon">✅</div>
              <h3>Không có đơn chờ duyệt</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.slice(0, 5).map(reg => {
                const student = users.find(u => u.id === reg.studentId);
                const club = clubs.find(c => c.id === reg.clubId);
                return (
                  <div key={reg.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--warning-bg)', borderRadius: 10, border: '1px solid rgba(217,119,6,0.2)' }}>
                    <div className="avatar" style={{ width: 32, height: 32, background: '#3B82F6', fontSize: '0.72rem' }}>{student?.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{student?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{club?.icon} {club?.name}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>{reg.appliedAt}</span>
                  </div>
                );
              })}
              {pending.length > 5 && <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text3)' }}>+{pending.length - 5} đơn khác</div>}
            </div>
          )}
        </div>

        {/* My clubs */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>CLB đang phụ trách</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myClubs.map(club => {
              const fillPct = Math.round((club.currentMembers / club.maxMembers) * 100);
              return (
                <div key={club.id} style={{ padding: '12px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.4rem' }}>{club.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{club.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{club.schedule}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${fillPct}%`, background: club.color }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{club.currentMembers}/{club.maxMembers}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrincipalDashboard({ onNavigate }) {
  const { clubs, registrations, users } = useApp();

  const students = users.filter(u => u.role === 'student');
  const totalRegs = registrations.length;
  const approved = registrations.filter(r => r.status === 'approved').length;
  const pending = registrations.filter(r => r.status === 'pending').length;

  const stats = [
    { label: 'Tổng số CLB', value: clubs.length, icon: BookOpen, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Học sinh', value: students.length, icon: Users, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Đơn đã duyệt', value: approved, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Đơn chờ duyệt', value: pending, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Ban Giám Hiệu 📊</h1>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Tổng quan hoạt động CLB ngoại khóa toàn trường</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Tình hình các CLB</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('reports')}><BarChart3 size={14} /> Chi tiết</button>
          </div>
          {clubs.map(c => {
            const fillPct = Math.round((c.currentMembers / c.maxMembers) * 100);
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '1.1rem', width: 28, flexShrink: 0 }}>{c.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.83rem', fontWeight: 600, marginBottom: 3 }}>{c.name}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${fillPct}%`, background: c.color }} />
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)', minWidth: 50, textAlign: 'right' }}>
                  {c.currentMembers}/{c.maxMembers}
                </span>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Thống kê đơn đăng ký</h2>
          {[
            { label: 'Tổng đơn', value: totalRegs, color: 'var(--primary)' },
            { label: 'Đã duyệt', value: approved, color: 'var(--success)' },
            { label: 'Chờ duyệt', value: pending, color: 'var(--warning)' },
            { label: 'Từ chối', value: registrations.filter(r => r.status === 'rejected').length, color: 'var(--danger)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>{s.label}</span>
              <span style={{ fontWeight: 700, color: s.color, fontSize: '1rem' }}>{s.value}</span>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={() => onNavigate('reports')}>
            <BarChart3 size={14} /> Xem báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard({ onNavigate }) {
  const { clubs, registrations, users } = useApp();

  const stats = [
    { label: 'Tổng CLB', value: clubs.length, icon: BookOpen, color: '#3B82F6', bg: '#EFF6FF', page: 'clubs' },
    { label: 'Tổng tài khoản', value: users.length, icon: Users, color: '#8B5CF6', bg: '#F5F3FF', page: 'users' },
    { label: 'Tổng đơn đăng ký', value: registrations.length, icon: ClipboardList, color: '#F59E0B', bg: '#FFFBEB', page: 'registrations' },
    { label: 'Đang hoạt động', value: clubs.filter(c => c.status === 'active').length, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', page: 'clubs' },
  ];

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Quản trị hệ thống ⚙️</h1>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Tổng quan và quản lý toàn bộ hệ thống</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate(s.page)}>
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Quản lý CLB', desc: 'Thêm, sửa, xóa câu lạc bộ', icon: '📚', color: '#3B82F6', page: 'clubs' },
          { label: 'Quản lý tài khoản', desc: 'Phân quyền và quản lý người dùng', icon: '👥', color: '#8B5CF6', page: 'users' },
          { label: 'Xem báo cáo', desc: 'Thống kê và phân tích dữ liệu', icon: '📊', color: '#10B981', page: 'reports' },
        ].map(item => (
          <button key={item.label} onClick={() => onNavigate(item.page)}
            style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = item.color; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, color: item.color }}>{item.label}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
