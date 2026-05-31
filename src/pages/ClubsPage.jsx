import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Users, Clock, MapPin, Tag, CheckCircle, Plus, X } from 'lucide-react';

const CATEGORIES = ['Tất cả', 'Công nghệ', 'Nghệ thuật', 'Thể thao', 'Học thuật'];

function ClubCard({ club, registration, onRegister, currentUser }) {
  const [showDetail, setShowDetail] = useState(false);
  const fillPct = Math.round((club.currentMembers / club.maxMembers) * 100);
  const isFull = club.currentMembers >= club.maxMembers;

  const statusBadge = () => {
    if (!registration) return null;
    if (registration.status === 'approved') return <span className="badge badge-approved"><CheckCircle size={11} /> Đã tham gia</span>;
    if (registration.status === 'pending') return <span className="badge badge-pending"><Clock size={11} /> Chờ duyệt</span>;
    if (registration.status === 'rejected') return <span className="badge badge-rejected">Bị từ chối</span>;
  };

  return (
    <>
      <div className="card" style={{ overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}
        onClick={() => setShowDetail(true)}
      >
        {/* Color bar */}
        <div style={{ height: 5, background: club.color }} />
        <div style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.8rem' }}>{club.icon}</span>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{club.name}</h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 99, background: `${club.color}18`, color: club.color, fontWeight: 600 }}>
                  {club.category}
                </span>
              </div>
            </div>
            {statusBadge()}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {club.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text3)' }}>
              <Clock size={13} /> {club.schedule}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text3)' }}>
              <MapPin size={13} /> {club.room}
            </div>
          </div>

          {/* Members progress */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 5 }}>
              <span style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} /> {club.currentMembers}/{club.maxMembers} thành viên
              </span>
              <span style={{ color: isFull ? 'var(--danger)' : 'var(--text3)' }}>{fillPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${fillPct}%`, background: isFull ? 'var(--danger)' : club.color }} />
            </div>
          </div>

          {currentUser?.role === 'student' && (
            <button
              className={`btn ${registration ? 'btn-secondary' : isFull ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={!!registration || isFull}
              onClick={e => { e.stopPropagation(); onRegister(club.id); }}
            >
              {registration ? (
                registration.status === 'approved' ? '✓ Đang tham gia' : registration.status === 'pending' ? '⏳ Chờ xét duyệt' : '✗ Đã bị từ chối'
              ) : isFull ? 'CLB đã đầy' : (
                <><Plus size={14} /> Đăng ký tham gia</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ height: 6, background: club.color, borderRadius: '16px 16px 0 0' }} />
            <div className="modal-header" style={{ paddingTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: '2.2rem' }}>{club.icon}</span>
                  <div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{club.name}</h2>
                    <span style={{ fontSize: '0.78rem', padding: '2px 10px', borderRadius: 99, background: `${club.color}18`, color: club.color, fontWeight: 600 }}>{club.category}</span>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)} style={{ border: 'none', background: 'var(--surface2)', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 18 }}>{club.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px', background: 'var(--surface2)', borderRadius: 10, marginBottom: 18 }}>
                {[
                  { icon: Clock, label: 'Lịch sinh hoạt', value: club.schedule },
                  { icon: MapPin, label: 'Phòng học', value: club.room },
                  { icon: Users, label: 'Thành viên', value: `${club.currentMembers}/${club.maxMembers}` },
                  { icon: Tag, label: 'Danh mục', value: club.category },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 10, fontSize: '0.875rem' }}>
                    <Icon size={15} color="var(--text3)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div><span style={{ color: 'var(--text3)' }}>{label}: </span><strong>{value}</strong></div>
                  </div>
                ))}
              </div>
              <div className="progress-bar" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: `${fillPct}%`, background: isFull ? 'var(--danger)' : club.color }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 4 }}>
                Còn {club.maxMembers - club.currentMembers} chỗ trống
              </div>
            </div>
            {currentUser?.role === 'student' && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetail(false)}>Đóng</button>
                <button
                  className="btn btn-primary" disabled={!!registration || isFull}
                  onClick={() => { onRegister(club.id); setShowDetail(false); }}
                >
                  {registration ? 'Đã đăng ký' : isFull ? 'CLB đã đầy' : <><Plus size={14} /> Đăng ký ngay</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function ClubsPage() {
  const { clubs, registrations, currentUser, submitRegistration } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [toast, setToast] = useState(null);

  const filtered = clubs.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Tất cả' || c.category === category;
    return matchSearch && matchCat;
  });

  const handleRegister = (clubId) => {
    const result = submitRegistration(clubId);
    setToast(result);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Danh sách CLB</h1>
        <p style={{ color: 'var(--text2)' }}>{clubs.length} câu lạc bộ đang hoạt động</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={15} className="search-icon" />
          <input className="input" placeholder="Tìm kiếm CLB..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{
                padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 99, cursor: 'pointer',
                fontSize: '0.83rem', fontWeight: 500, fontFamily: 'var(--font)',
                background: category === cat ? 'var(--primary)' : 'var(--surface)',
                color: category === cat ? 'white' : 'var(--text2)',
                borderColor: category === cat ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.15s',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Không tìm thấy CLB phù hợp</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(club => (
            <ClubCard key={club.id} club={club}
              registration={registrations.find(r => r.studentId === currentUser?.id && r.clubId === club.id)}
              onRegister={handleRegister}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: toast.success ? 'var(--success)' : 'var(--danger)',
          color: 'white', padding: '12px 20px', borderRadius: 12,
          fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast.success ? '✅ Đã gửi đơn đăng ký thành công!' : `❌ ${toast.message}`}
        </div>
      )}
    </div>
  );
}
