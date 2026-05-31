import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Clock, Users, Eye, X } from 'lucide-react';

function RejectModal({ onConfirm, onClose }) {
  const [note, setNote] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Từ chối đơn đăng ký</h3>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="label">Lý do từ chối (tùy chọn)</label>
            <textarea className="input" rows={3} placeholder="Nhập lý do từ chối..."
              value={note} onChange={e => setNote(e.target.value)}
              style={{ resize: 'vertical' }} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-danger" onClick={() => onConfirm(note)}>
            <XCircle size={14} /> Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherRegistrationsPage() {
  const { currentUser, registrations, clubs, users, processRegistration } = useApp();
  const [filter, setFilter] = useState('pending');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailReg, setDetailReg] = useState(null);

  const myClubIds = currentUser.managedClubs || [];

  const filtered = registrations
    .filter(r => myClubIds.includes(r.clubId))
    .filter(r => filter === 'all' || r.status === filter)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  const stats = {
    pending: registrations.filter(r => myClubIds.includes(r.clubId) && r.status === 'pending').length,
    approved: registrations.filter(r => myClubIds.includes(r.clubId) && r.status === 'approved').length,
    rejected: registrations.filter(r => myClubIds.includes(r.clubId) && r.status === 'rejected').length,
  };

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Duyệt đơn đăng ký</h1>
        <p style={{ color: 'var(--text2)' }}>Quản lý đơn đăng ký tham gia CLB của học sinh</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Chờ duyệt', value: stats.pending, color: 'var(--warning)', bg: 'var(--warning-bg)', icon: Clock },
          { label: 'Đã duyệt', value: stats.approved, color: 'var(--success)', bg: 'var(--success-bg)', icon: CheckCircle },
          { label: 'Từ chối', value: stats.rejected, color: 'var(--danger)', bg: 'var(--danger-bg)', icon: XCircle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter(s.label === 'Chờ duyệt' ? 'pending' : s.label === 'Đã duyệt' ? 'approved' : 'rejected')}>
              <div className="stat-icon" style={{ background: s.bg }}><Icon size={22} color={s.color} /></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 20, maxWidth: 360 }}>
        {[['pending', 'Chờ duyệt'], ['approved', 'Đã duyệt'], ['rejected', 'Từ chối'], ['all', 'Tất cả']].map(([v, l]) => (
          <button key={v} className={`tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><h3>Không có đơn nào</h3></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Học sinh</th>
                  <th>CLB</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(reg => {
                  const student = users.find(u => u.id === reg.studentId);
                  const club = clubs.find(c => c.id === reg.clubId);
                  return (
                    <tr key={reg.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 34, height: 34, background: '#3B82F6', fontSize: '0.75rem' }}>{student?.avatar}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student?.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{student?.class}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '1.1rem' }}>{club?.icon}</span>
                          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{club?.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{reg.appliedAt}</td>
                      <td>
                        {reg.status === 'pending' && <span className="badge badge-pending"><Clock size={11} /> Chờ duyệt</span>}
                        {reg.status === 'approved' && <span className="badge badge-approved"><CheckCircle size={11} /> Đã duyệt</span>}
                        {reg.status === 'rejected' && <span className="badge badge-rejected"><XCircle size={11} /> Từ chối</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm tooltip" data-tip="Xem chi tiết"
                            onClick={() => setDetailReg({ reg, student, club })}>
                            <Eye size={13} />
                          </button>
                          {reg.status === 'pending' && (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => processRegistration(reg.id, 'approve')}>
                                <CheckCircle size={13} /> Duyệt
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => setRejectTarget(reg.id)}>
                                <XCircle size={13} /> Từ chối
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailReg && (
        <div className="modal-overlay" onClick={() => setDetailReg(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700 }}>Chi tiết đơn đăng ký</h3>
                <button onClick={() => setDetailReg(null)} style={{ border: 'none', background: 'var(--surface2)', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Học sinh', detailReg.student?.name],
                  ['Lớp', detailReg.student?.class],
                  ['Email', detailReg.student?.email],
                  ['CLB đăng ký', `${detailReg.club?.icon} ${detailReg.club?.name}`],
                  ['Ngày đăng ký', detailReg.reg.appliedAt],
                  ['Trạng thái', detailReg.reg.status === 'pending' ? '⏳ Chờ duyệt' : detailReg.reg.status === 'approved' ? '✅ Đã duyệt' : '❌ Từ chối'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ minWidth: 120, fontSize: '0.85rem', color: 'var(--text3)', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: '0.875rem' }}>{value}</span>
                  </div>
                ))}
                {detailReg.reg.note && (
                  <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--danger)' }}>
                    <strong>Ghi chú:</strong> {detailReg.reg.note}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailReg(null)}>Đóng</button>
              {detailReg.reg.status === 'pending' && (
                <>
                  <button className="btn btn-success" onClick={() => { processRegistration(detailReg.reg.id, 'approve'); setDetailReg(null); }}>
                    <CheckCircle size={14} /> Duyệt
                  </button>
                  <button className="btn btn-danger" onClick={() => { setRejectTarget(detailReg.reg.id); setDetailReg(null); }}>
                    <XCircle size={14} /> Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          onConfirm={(note) => { processRegistration(rejectTarget, 'reject', note); setRejectTarget(null); }}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
