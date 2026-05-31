import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, Trash2, Users, X } from 'lucide-react';

const CATEGORY_OPTIONS = ['Công nghệ', 'Nghệ thuật', 'Thể thao', 'Học thuật', 'Khác'];
const ICON_OPTIONS = ['💻', '🎵', '⚽', '🎨', '🌍', '🔬', '📚', '🎭', '🏀', '🎯', '🌿', '🤝'];
const COLOR_OPTIONS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

function ClubModal({ club, teachers, onSave, onClose }) {
  const [form, setForm] = useState(club || {
    name: '', category: 'Công nghệ', description: '', teacherId: teachers[0]?.id || null,
    maxMembers: 30, schedule: '', room: '', color: '#3B82F6', icon: '📚', status: 'active'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>{club ? 'Chỉnh sửa CLB' : 'Thêm CLB mới'}</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'var(--surface2)', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
          </div>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Tên CLB *</label>
              <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="CLB Tin học" />
            </div>
            <div className="form-group">
              <label className="label">Danh mục</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Giáo viên phụ trách</label>
              <select className="input" value={form.teacherId} onChange={e => setForm(p => ({ ...p, teacherId: Number(e.target.value) }))}>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Mô tả</label>
              <textarea className="input" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả ngắn về CLB..." style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="label">Lịch sinh hoạt</label>
              <input className="input" value={form.schedule} onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))} placeholder="Thứ 3 & Thứ 5, 17:00-18:30" />
            </div>
            <div className="form-group">
              <label className="label">Phòng</label>
              <input className="input" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} placeholder="Phòng A101" />
            </div>
            <div className="form-group">
              <label className="label">Số thành viên tối đa</label>
              <input className="input" type="number" min={5} max={100} value={form.maxMembers} onChange={e => setForm(p => ({ ...p, maxMembers: Number(e.target.value) }))} />
            </div>
            <div className="form-group">
              <label className="label">Trạng thái</label>
              <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
          </div>

          {/* Icon picker */}
          <div className="form-group">
            <label className="label">Icon</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ICON_OPTIONS.map(icon => (
                <button key={icon} onClick={() => setForm(p => ({ ...p, icon }))}
                  style={{ width: 36, height: 36, border: form.icon === icon ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 8, fontSize: '1.1rem', cursor: 'pointer', background: form.icon === icon ? 'var(--primary-bg)' : 'var(--surface)', transition: 'all 0.1s' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="form-group">
            <label className="label">Màu sắc</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_OPTIONS.map(color => (
                <button key={color} onClick={() => setForm(p => ({ ...p, color }))}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: color, border: form.color === color ? '3px solid var(--text)' : '2px solid white', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'transform 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" disabled={!form.name} onClick={() => onSave(form)}>
            {club ? 'Lưu thay đổi' : 'Thêm CLB'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminClubsPage() {
  const { clubs, addClub, updateClub, deleteClub, users, registrations } = useApp();
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const teachers = users.filter(u => u.role === 'teacher');

  const handleSave = (data) => {
    if (modal === 'add') addClub(data);
    else updateClub(modal.id, data);
    setModal(null);
  };

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Quản lý CLB</h1>
          <p style={{ color: 'var(--text2)' }}>{clubs.length} câu lạc bộ</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Plus size={15} /> Thêm CLB mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {clubs.map(club => {
          const teacher = users.find(u => u.id === club.teacherId);
          const regs = registrations.filter(r => r.clubId === club.id);
          const fillPct = Math.round((club.currentMembers / club.maxMembers) * 100);
          return (
            <div key={club.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 5, background: club.color }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.6rem' }}>{club.icon}</span>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{club.name}</h3>
                      <span style={{ fontSize: '0.72rem', padding: '1px 8px', borderRadius: 99, background: `${club.color}18`, color: club.color, fontWeight: 600 }}>{club.category}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal(club)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(club)}><Trash2 size={13} /></button>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {club.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12, fontSize: '0.8rem', color: 'var(--text3)' }}>
                  <div>👨‍🏫 {teacher?.name || '—'}</div>
                  <div>🕐 {club.schedule}</div>
                  <div>📍 {club.room}</div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> {club.currentMembers}/{club.maxMembers}</span>
                    <span style={{ color: 'var(--text3)' }}>{fillPct}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${fillPct}%`, background: club.color }} /></div>
                </div>

                <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <span>📋 {regs.length} đơn</span>
                  <span>✅ {regs.filter(r => r.status === 'approved').length} duyệt</span>
                  <span>⏳ {regs.filter(r => r.status === 'pending').length} chờ</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && <ClubModal club={modal === 'add' ? null : modal} teachers={teachers} onSave={handleSave} onClose={() => setModal(null)} />}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-body" style={{ paddingTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Xóa CLB?</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Bạn có chắc muốn xóa <strong>{deleteConfirm.name}</strong>? Tất cả dữ liệu liên quan sẽ bị mất.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={() => { deleteClub(deleteConfirm.id); setDeleteConfirm(null); }}>
                <Trash2 size={14} /> Xóa CLB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
