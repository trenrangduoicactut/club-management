import { useApp } from '../context/AppContext';
import { Bell, CheckCircle, XCircle, Info, Check } from 'lucide-react';

const TYPE_MAP = {
  success: { icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
  error: { icon: XCircle, color: '#DC2626', bg: '#FEF2F2' },
  info: { icon: Info, color: '#3B82F6', bg: '#EFF6FF' },
};

export default function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead } = useApp();

  const myNotifs = notifications
    .filter(n => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const unread = myNotifs.filter(n => !n.read);

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Thông báo</h1>
          <p style={{ color: 'var(--text2)' }}>{unread.length > 0 ? `${unread.length} thông báo chưa đọc` : 'Tất cả đã đọc'}</p>
        </div>
        {unread.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={() => unread.forEach(n => markNotificationRead(n.id))}>
            <Check size={13} /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="card empty-state" style={{ padding: '48px' }}>
          <div className="empty-icon"><Bell size={40} color="var(--text3)" /></div>
          <h3>Chưa có thông báo nào</h3>
          <p>Thông báo về đơn đăng ký CLB sẽ xuất hiện ở đây</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myNotifs.map(notif => {
            const t = TYPE_MAP[notif.type] || TYPE_MAP.info;
            const Icon = t.icon;
            return (
              <div key={notif.id}
                className="card"
                style={{
                  padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start',
                  borderLeft: `4px solid ${t.color}`,
                  background: notif.read ? 'var(--surface)' : t.bg,
                  cursor: notif.read ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                }}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Icon size={18} color={t.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: notif.read ? 400 : 600, lineHeight: 1.5 }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 4 }}>{notif.date}</div>
                </div>
                {!notif.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
