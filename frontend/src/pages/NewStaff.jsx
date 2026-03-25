import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const INITIAL = {
  firstName: '', lastName: '', email: '',
  contact: '', address: '',
  username: '', password: '',
  role: 'Staff'
}

export default function NewStaff() {
  const [form,    setForm]    = useState(INITIAL)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.username || !form.password) {
      setError('First name, username and password are required.')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/staff', form)
      setSuccess('Staff member added successfully!')
      setTimeout(() => navigate('/staff'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setForm(INITIAL)
    setError('')
    setSuccess('')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New Staff</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/staff')}>
          ← Back to List
        </button>
      </div>

      <div className="card" style={{ padding: 28 }}>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSave}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>

            {/* Personal Information */}
            <div>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:20 }}>
                Personal Information
              </h3>

              <div className="form-group">
                <label>First Name <span style={{ color:'var(--red)' }}>*</span></label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label>Contact No.</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows={4}
                />
              </div>
            </div>

            {/* System Credentials */}
            <div>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:20 }}>
                System Credentials
              </h3>

              <div className="form-group">
                <label>Username <span style={{ color:'var(--red)' }}>*</span></label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Password <span style={{ color:'var(--red)' }}>*</span></label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div style={{
                marginTop: 16, padding: 14,
                background: 'var(--teal-light)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(26,171,135,0.2)',
                fontSize: 12.5, color: '#0f6e56', lineHeight: 1.7
              }}>
                <strong>Role info:</strong><br/>
                <strong>Admin</strong> — Full access to all features<br/>
                <strong>Staff</strong> — Tickets, Tasks, Customers<br/>
                <strong>Viewer</strong> — Read-only access
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:28, paddingTop:20, borderTop:'1px solid var(--border)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: 100 }}
            >
              {loading ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              style={{ minWidth: 100 }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
