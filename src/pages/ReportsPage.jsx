import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, BookOpen, ClipboardList } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function ReportsPage() {
  const { clubs, registrations, users } = useApp();

  const students = users.filter(u => u.role === 'student');
  const totalRegs = registrations.length;
  const approved = registrations.filter(r => r.status === 'approved').length;
  const pending = registrations.filter(r => r.status === 'pending').length;

  // Club stats
  const clubData = clubs.map((c, i) => ({
    name: c.name.replace('CLB ', ''),
    'Đã duyệt': registrations.filter(r => r.clubId === c.id && r.status === 'approved').length,
    'Chờ duyệt': registrations.filter(r => r.clubId === c.id && r.status === 'pending').length,
    'Từ chối': registrations.filter(r => r.clubId === c.id && r.status === 'rejected').length,
    fill: COLORS[i % COLORS.length],
  }));

  // Category stats
  const catMap = {};
  clubs.forEach(c => {
    const regs = registrations.filter(r => r.clubId === c.id && r.status === 'approved').length;
    catMap[c.category] = (catMap[c.category] || 0) + regs;
  });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  // Status pie
  const statusData = [
    { name: 'Đã duyệt', value: approved },
    { name: 'Chờ duyệt', value: pending },
    { name: 'Từ chối', value: registrations.filter(r => r.status === 'rejected').length },
  ];
  const pieColors = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="fade-in" style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Báo cáo tổng hợp</h1>
        <p style={{ color: 'var(--text2)' }}>Thống kê hoạt động câu lạc bộ ngoại khóa toàn trường</p>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Tổng số CLB', value: clubs.length, icon: BookOpen, color: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Học sinh', value: students.length, icon: Users, color: '#8B5CF6', bg: '#F5F3FF' },
          { label: 'Tổng đơn đăng ký', value: totalRegs, icon: ClipboardList, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Tỷ lệ duyệt', value: `${totalRegs ? Math.round((approved / totalRegs) * 100) : 0}%`, icon: TrendingUp, color: '#10B981', bg: '#ECFDF5' },
        ].map(s => {
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Registrations by club */}
        <div className="card" style={{ padding: 20, gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Đơn đăng ký theo CLB</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={clubData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text2)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text2)' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.85rem' }} />
              <Legend wrapperStyle={{ fontSize: '0.82rem' }} />
              <Bar dataKey="Đã duyệt" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chờ duyệt" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Từ chối" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Tỷ lệ trạng thái đơn</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" paddingAngle={3}>
                {statusData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.85rem' }} />
              <Legend wrapperStyle={{ fontSize: '0.82rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Thành viên theo danh mục</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" outerRadius={85} dataKey="value" paddingAngle={3}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.85rem' }} />
              <Legend wrapperStyle={{ fontSize: '0.82rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clubs detail table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Chi tiết từng CLB</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>CLB</th>
                <th>Danh mục</th>
                <th>Sĩ số</th>
                <th>Đã duyệt</th>
                <th>Chờ duyệt</th>
                <th>Từ chối</th>
                <th>Lấp đầy</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club, i) => {
                const d = clubData[i];
                const fillPct = Math.round((club.currentMembers / club.maxMembers) * 100);
                return (
                  <tr key={club.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.2rem' }}>{club.icon}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{club.name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: 99, background: `${COLORS[i % COLORS.length]}18`, color: COLORS[i % COLORS.length], fontWeight: 600 }}>{club.category}</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{club.currentMembers}/{club.maxMembers}</td>
                    <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>{d['Đã duyệt']}</span></td>
                    <td><span style={{ color: 'var(--warning)', fontWeight: 600 }}>{d['Chờ duyệt']}</span></td>
                    <td><span style={{ color: 'var(--danger)', fontWeight: 600 }}>{d['Từ chối']}</span></td>
                    <td style={{ minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${fillPct}%`, background: COLORS[i % COLORS.length] }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text3)', minWidth: 30 }}>{fillPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
