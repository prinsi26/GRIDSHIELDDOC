import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  {
    group: 'Inquiry', icon: '📋',
    children: [
      { label: 'Dashboard', path: '/dashboard' },
    ]
  },
  {
    group: 'Ticket', icon: '🎫',
    children: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'List', path: '/dashboard' },
    ]
  },
  {
    group: 'Task', icon: '✅',
    children: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'List', path: '/dashboard' },
    ]
  },
  {
    group: 'Customer', icon: '👥',
    children: [
      { label: 'Add New', path: '/dashboard' },
      { label: 'List', path: '/dashboard' },
    ]
  },
  {
    group: 'Sales', icon: '💰',
    children: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'List', path: '/dashboard' },
      { label: 'Service Plan', path: '/dashboard' },
    ]
  },
  {
    group: 'Staff', icon: '👤',
    children: [
      { label: 'List', path: '/staff' },
    ]
  },
  {
    group: 'Stock', icon: '📦',
    children: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Supplier', path: '/dashboard' },
      { label: 'Item List', path: '/dashboard' },
    ]
  },
]

function NavGroup({ item, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false)

  return (
    <div className="nav-group">
      <div className="nav-group-header" onClick={() => setOpen(o => !o)}>
        <span className="nav-group-icon">{item.icon}</span>
        <span className="nav-group-label">{item.group}</span>
        <span className="nav-group-arrow" style={{ transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
      </div>
      {open && (
        <div className="nav-children">
          {item.children.map(child => (
            <NavLink
              key={child.label + child.path}
              to={child.path}
              className={({ isActive }) => `nav-child${isActive ? ' active' : ''}`}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.firstName?.[0] || 'A'}</div>
          <div className="user-info">
            <div className="user-name">{user?.firstName || 'Admin'}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="user-arrow" onClick={() => {}}>▾</button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavGroup
              key={item.group}
              item={item}
              defaultOpen={item.group === 'Staff'}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-area">
        {/* Top header */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="btn-icon" onClick={() => setSidebarOpen(o => !o)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="topbar-brand">Gridshield</span>
          </div>
          <div className="topbar-right">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/staff/new')}
            >
              + Add Staff
            </button>
            <button className="btn-icon" title="Fullscreen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
            <button className="btn-icon danger" onClick={handleLogout} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .app-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: 200px;
          min-width: 200px;
          background: var(--sidebar-bg);
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          transition: width 0.2s ease, min-width 0.2s ease;
        }
        .sidebar.collapsed { width: 0; min-width: 0; overflow: hidden; }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .user-avatar {
          width: 32px; height: 32px;
          background: var(--teal);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 600; font-size: 14px;
          flex-shrink: 0;
        }
        .user-info { flex: 1; min-width: 0; }
        .user-name { color: white; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { color: rgba(255,255,255,0.5); font-size: 11px; }
        .user-arrow { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 12px; }
        .sidebar-nav { padding: 8px 0; flex: 1; }
        .nav-group { }
        .nav-group-header {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          transition: background 0.15s;
        }
        .nav-group-header:hover { background: var(--sidebar-hover); color: white; }
        .nav-group-icon { font-size: 14px; }
        .nav-group-label { flex: 1; font-weight: 500; }
        .nav-group-arrow { font-size: 16px; transition: transform 0.2s; color: rgba(255,255,255,0.4); }
        .nav-children { padding-left: 0; }
        .nav-child {
          display: block;
          padding: 7px 14px 7px 36px;
          color: rgba(255,255,255,0.55);
          font-size: 12.5px;
          text-decoration: none;
          transition: all 0.15s;
          border-left: 3px solid transparent;
        }
        .nav-child:hover { color: white; background: var(--sidebar-hover); }
        .nav-child.active { color: white; background: rgba(26,171,135,0.2); border-left-color: var(--teal); }
        .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .topbar {
          height: 52px;
          background: var(--header-bg);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px;
          gap: 12px;
          flex-shrink: 0;
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .topbar-brand { color: white; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; }
        .topbar-right { display: flex; align-items: center; gap: 8px; }
        .topbar .btn-icon { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); }
        .topbar .btn-icon:hover { background: rgba(255,255,255,0.1); color: white; }
        .topbar .btn-icon.danger:hover { background: rgba(229,62,62,0.2); border-color: rgba(229,62,62,0.5); color: #fc8181; }
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: var(--bg);
        }
      `}</style>
    </div>
  )
}
