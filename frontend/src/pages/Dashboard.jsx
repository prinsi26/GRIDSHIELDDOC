import { useAuth } from '../context/AuthContext'

const stats = [
  { label: 'Total Staff',    value: '12', color: '#1aab87', bg: '#e1f5ee' },
  { label: 'Active Tickets', value: '34', color: '#2b6cb0', bg: '#ebf8ff' },
  { label: 'Open Tasks',     value: '8',  color: '#d69e2e', bg: '#fffff0' },
  { label: 'Customers',      value: '56', color: '#9f7aea', bg: '#faf5ff' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Welcome back, <strong>{user?.firstName}</strong>
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{
              marginTop: 10, height: 4, borderRadius: 2,
              background: s.bg
            }}>
              <div style={{ width: '60%', height: '100%', background: s.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/staff/new" className="btn btn-primary">+ Add New Staff</a>
          <a href="/staff" className="btn btn-secondary">View All Staff</a>
        </div>
      </div>
    </div>
  )
}
