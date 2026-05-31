import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

const ROLE_LABELS = { student: 'Học sinh', teacher: 'Giáo viên', principal: 'Ban Giám Hiệu', admin: 'Quản trị viên' };
const ROLE_COLORS = { student: '#3B82F6', teacher: '#8B5CF6', principal: '#10B981', admin: '#F59E0B' };

function UserModal({ user, onSave, onClose }) {
  const [form, setForm] = useState(user || { name: '', email: '', role: 'student', class: '', password: '123456' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>{user ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'var(--surface2)', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
          </div>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="label">Họ và tên *</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label className="label">Email *</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@school.edu.vn" />
          </div>
          <div className="form-group">
            <label className="label">Vai trò *</label>
            <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {form.role === 'student' && (
            <div className="form-group">
              <label className="label">Lớp</label>
              <input className="input" value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))} placeholder="10A1" />
            </div>
          )}
          <div className="form-group">
            <label className="label">Mật khẩu</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={() => { if (form.name && form.email) onSave(form); }}
            disabled={!form.name || !form.email}>
            {user ? 'Lưu thay đổi' : 'Thêm tài khoản'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'add' | user object
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSave = (data) => {
    if (modal === 'add') addUser(data);
    else updateUser(modal.id, data);
    setModal(null);
  };

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Quản lý tài khoản</h1>
          <p style={{ color: 'var(--text2)' }}>{users.length} tài khoản trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Plus size={15} /> Thêm tài khoản
        </button>
      </div>

      {/* Role summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all', 'Tất cả', users.length], ...Object.entries(ROLE_LABELS).map(([k, v]) => [k, v, users.filter(u => u.role === k).length])].map(([k, l, count]) => (
          <button key={k} onClick={() => setRoleFilter(k)}
            style={{
              padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 99,
              cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500, fontFamily: 'var(--font)',
              background: roleFilter === k ? (ROLE_COLORS[k] || 'var(--primary)') : 'var(--surface)',
              color: roleFilter === k ? 'white' : 'var(--text2)',
              borderColor: roleFilter === k ? (ROLE_COLORS[k] || 'var(--primary)') : 'var(--border)',
              transition: 'all 0.15s',
            }}>
            {l} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 16, maxWidth: 320 }}>
        <Search size={15} className="search-icon" />
        <input className="input" placeholder="Tìm theo tên, email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><h3>Không tìm thấy tài khoản</h3></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Thông tin</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 36, height: 36, background: ROLE_COLORS[user.role], fontSize: '0.78rem' }}>
                          {user.avatar}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{user.email}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: 99, background: `${ROLE_COLORS[user.role]}18`, color: ROLE_COLORS[user.role], fontWeight: 600 }}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                      {user.role === 'student' ? `Lớp ${user.class}` : user.role === 'teacher' ? `Quản lý ${user.managedClubs?.length || 0} CLB` : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setModal(user)}>
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(user)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && <UserModal user={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-body" style={{ paddingTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Xóa tài khoản?</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Bạn có chắc muốn xóa tài khoản <strong>{deleteConfirm.name}</strong>? Thao tác này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={() => { deleteUser(deleteConfirm.id); setDeleteConfirm(null); }}>
                <Trash2 size={14} /> Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
