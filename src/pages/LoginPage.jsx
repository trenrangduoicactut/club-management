import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, Eye, EyeOff, GraduationCap } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { label: 'Học sinh', email: 'an.nguyen@school.edu.vn', role: 'student', color: '#3B82F6' },
  { label: 'Giáo viên', email: 'dung.pham@school.edu.vn', role: 'teacher', color: '#8B5CF6' },
  { label: 'Ban Giám Hiệu', email: 'bgh@school.edu.vn', role: 'principal', color: '#10B981' },
  { label: 'Quản trị viên', email: 'admin@school.edu.vn', role: 'admin', color: '#F59E0B' },
];

export default function LoginPage({ onLogin }) {
  const { login } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) { onLogin(result.user); }
    else { setError('Email hoặc mật khẩu không đúng.'); }
  };

  const quickLogin = (email) => setForm({ email, password: '123456' });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E40AF 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG decoration */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            background: 'rgba(59,130,246,0.08)',
            width: `${200 + i * 100}px`, height: `${200 + i * 100}px`,
            top: `${-50 + i * 15}%`, left: `${-10 + i * 20}%`,
            animation: `spin ${20 + i * 5}s linear infinite`,
          }} />
        ))}
      </div>

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px', color: 'white', position: 'relative',
      }} className="hide-mobile">
        <div style={{ maxWidth: 440 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, background: '#3B82F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={28} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>VTCo School</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Hệ thống quản lý học sinh</div>
            </div>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.03em' }}>
            Quản lý<br />
            <span style={{ color: '#60A5FA' }}>CLB Ngoại khóa</span>
          </h1>
          <p style={{ opacity: 0.7, lineHeight: 1.7, marginBottom: 32, fontSize: '1rem' }}>
            Nền tảng số hóa quy trình đăng ký, xét duyệt và quản lý câu lạc bộ ngoại khóa cho học sinh THPT.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['✅ Đăng ký CLB trực tuyến dễ dàng', '✅ Duyệt đơn nhanh chóng, minh bạch', '✅ Báo cáo tổng hợp theo thời gian thực'].map(item => (
              <div key={item} style={{ opacity: 0.8, fontSize: '0.9rem' }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div style={{
        width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="fade-in">
          <div style={{ textAlign: 'center', marginBottom: 32, color: 'white' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Đăng nhập</div>
            <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>Vào hệ thống quản lý CLB</div>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="email@school.edu.vn"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="label">Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••"
                  style={{ paddingRight: 40 }}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: '0.95rem' }}>
              <LogIn size={16} />
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Quick login */}
          <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', textAlign: 'center', marginBottom: 10 }}>
            Demo nhanh — chọn vai trò:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => quickLogin(acc.email)}
                style={{
                  border: 'none', borderRadius: 10, padding: '9px 12px', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', fontWeight: 600,
                  transition: 'all 0.15s', fontFamily: 'var(--font)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: acc.color, flexShrink: 0 }} />
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
