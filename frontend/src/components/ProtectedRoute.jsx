import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
        <span className="spinner" />
      </div>
    )
  }

  if (!token || !user) return <Navigate to="/" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:12 }}>
        <h2 style={{ color: '#e53e3e' }}>Access Denied</h2>
        <p style={{ color:'#718096' }}>You don't have permission to view this page.</p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
      </div>
    )
  }

  return <Outlet />
}
