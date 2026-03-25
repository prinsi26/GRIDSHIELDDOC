import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditStaff() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form,    setForm]    = useState(null)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    axios.get(`/api/staff/${id}`)
      .then(({ data }) => setForm({
        firstName: data.firstName || '',
        lastName:  data.lastName  || '',
        email:     data.email     || '',
        contact:   data.contact   || '',
        address:   data.address   || '',
        username:  data.username  || '',
        password:  '',
        role:      data.role      || 'Staff',
      }))
      .catch(() => setError('Failed to load staff'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.username) {
      setError('First name and username are required.')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      await axios.put(`/api/staff/${id}`, payload)
      setSuccess('Staff updated successfully!')
      setTimeout(() => navigate('/staff'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding:40, textAlign:'center' }}><span className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Staff</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/staff')}>← Back</button>
      </div>

      <div className="card" style={{ padding: 28 }}>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSave}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>
            <div>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:20 }}>Personal Information</h3>
              <div className="form-group">
                <label>First Name <span style={{ color:'var(--red)' }}>*</span></label>
                <input name="firstName" value={form.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact No.</label>
                <input name="contact" value={form.contact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={4} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:20 }}>System Credentials</h3>
              <div className="form-group">
                <label>Username <span style={{ color:'var(--red)' }}>*</span></label>
                <input name="username" value={form.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>New Password <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(leave blank to keep current)</span></label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter new password" autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:28, paddingTop:20, borderTop:'1px solid var(--border)' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth:100 }}>
              {saving ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> : 'Update'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/staff')} style={{ minWidth:100 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
