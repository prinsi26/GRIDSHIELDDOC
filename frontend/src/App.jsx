import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import StaffList from './pages/StaffList'
import NewStaff from './pages/NewStaff'
import EditStaff from './pages/EditStaff'
import Permissions from './pages/Permissions'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />

          {/* Protected: Admin only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/staff"     element={<StaffList />} />
              <Route path="/staff/new" element={<NewStaff />} />
              <Route path="/staff/:id/edit"        element={<EditStaff />} />
              <Route path="/staff/:id/permissions" element={<Permissions />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
