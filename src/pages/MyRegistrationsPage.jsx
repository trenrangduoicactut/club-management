import { useApp } from '../context/AppContext';
import { Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const STATUS_MAP = {
  pending: { label: 'Chờ duyệt', icon: Clock, badgeClass: 'badge-pending' },
  approved: { label: 'Đã duyệt', icon: CheckCircle, badgeClass: 'badge-approved' },
  rejected: { label: 'Từ chối', icon: XCircle, badgeClass: 'badge-rejected' },
};

export default function MyRegistrationsPage({ onNavigate }) {
  const { currentUser, registrations, clubs } = useApp();

  const myRegs = registrations
    .filter(r => r.studentId === currentUser.id)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  const summary = {
    total: myRegs.length,
    approved: myRegs.filter(r => r.status === 'approved').length,
    pending: myRegs.filter(r => r.status === 'pending').length,
    rejected: myRegs.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Đăng ký của tôi</h1>
        <p style={{ color: 'var(--text2)' }}>Theo dõi trạng thái tất cả đơn đăng ký CLB</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Tổng đơn', value: summary.total, color: 'var(--primary)' },
          { label: 'Đã duyệt', value: summary.approved, color: 'var(--success)' },
          { label: 'Chờ duyệt', value: summary.pending, color: 'var(--warning)' },
          { label: 'Từ chối', value: summary.rejected, color: 'var(--danger)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {myRegs.length === 0 ? (
        <div className="card empty-state" style={{ padding: '48px' }}>
          <div className="empty-icon">📋</div>
          <h3>Chưa có đơn đăng ký nào</h3>
          <p>Hãy khám phá và đăng ký tham gia các CLB!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onNavigate('clubs')}>
            <BookOpen size={15} /> Xem danh sách CLB
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myRegs.map(reg => {
            const club = clubs.find(c => c.id === reg.clubId);
            const status = STATUS_MAP[reg.status];
            const Icon = status.icon;
            if (!club) return null;
            return (
              <div key={reg.id} className="card" style={{ padding: '18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{club.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{club.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{club.category} · {club.schedule}</div>
                    </div>
                    <span className={`badge ${status.badgeClass}`}><Icon size={11} /> {status.label}</span>
                  </div>
                  {reg.note && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--danger-bg)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--danger)' }}>
                      <strong>Lý do từ chối:</strong> {reg.note}
                    </div>
                  )}
                  <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text3)' }}>
                    <span>Ngày đăng ký: {reg.appliedAt}</span>
                    {reg.processedAt && <span>Ngày xử lý: {reg.processedAt}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
