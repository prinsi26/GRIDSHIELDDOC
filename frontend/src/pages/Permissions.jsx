import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const PERMISSION_GROUPS = [
  {
    group: 'Inquiry',
    permissions: [
      { key: 'inquiry.view', label: 'View Inquiries' },
      { key: 'inquiry.edit', label: 'Add / Edit Inquiries' },
    ]
  },
  {
    group: 'Ticket',
    permissions: [
      { key: 'ticket.view', label: 'View Tickets' },
      { key: 'ticket.edit', label: 'Add / Edit Tickets' },
    ]
  },
  {
    group: 'Task',
    permissions: [
      { key: 'task.view', label: 'View Tasks' },
      { key: 'task.edit', label: 'Add / Edit Tasks' },
    ]
  },
  {
    group: 'Customer',
    permissions: [
      { key: 'customer.view', label: 'View Customers' },
      { key: 'customer.edit', label: 'Add / Edit Customers' },
    ]
  },
  {
    group: 'Sales',
    permissions: [
      { key: 'sales.view', label: 'View Sales' },
      { key: 'sales.edit', label: 'Add / Edit Sales' },
    ]
  },
  {
    group: 'Staff',
    permissions: [
      { key: 'staff.view', label: 'View Staff' },
      { key: 'staff.edit', label: 'Add / Edit Staff' },
    ]
  },
  {
    group: 'Stock',
    permissions: [
      { key: 'stock.view', label: 'View Stock' },
      { key: 'stock.edit', label: 'Add / Edit Stock' },
    ]
  },
]

const ALL_PERMS = PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.key))

export default function Permissions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [staff,   setStaff]   = useState(null)
  const [perms,   setPerms]   = useState([])
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    axios.get(`/api/staff/${id}`)
      .then(({ data }) => {
        setStaff(data)
        setPerms(data.permissions || [])
      })
      .catch(() => setError('Failed to load staff'))
      .finally(() => setLoading(false))
  }, [id])

  const togglePerm = (key) => {
    setPerms(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])
  }

  const toggleGroup = (group) => {
    const keys = PERMISSION_GROUPS.find(g => g.group === group).permissions.map(p => p.key)
    const allOn = keys.every(k => perms.includes(k))
    if (allOn) {
      setPerms(p => p.filter(k => !keys.includes(k)))
    } else {
      setPerms(p => [...new Set([...p, ...keys])])
    }
  }

  const selectAll = () => setPerms([...ALL_PERMS])
  const clearAll  = () => setPerms([])

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put(`/api/staff/${id}/permissions`, { permissions: perms })
      setSuccess('Permissions saved successfully!')
      setTimeout(() => navigate('/staff'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding:40, textAlign:'center' }}><span className="spinner" /></div>

  const isAdmin = staff?.role === 'Admin'

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Permissions</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/staff')}>← Back</button>
      </div>

      {/* Staff info strip */}
      {staff && (
        <div className="card" style={{ padding:'14px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:16 }}>
          <div style={{
            width:40, height:40, borderRadius:'50%', background:'var(--teal-light)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:600, fontSize:15, color:'var(--teal-dark)'
          }}>
            {staff.firstName?.[0]}{staff.lastName?.[0]}
          </div>
          <div>
            <div style={{ fontWeight:600, fontSize:15 }}>{staff.firstName} {staff.lastName}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>@{staff.username} · {staff.email}</div>
          </div>
          <span className={`badge ${staff.role === 'Admin' ? 'badge-admin' : staff.role === 'Staff' ? 'badge-staff' : 'badge-viewer'}`} style={{ marginLeft:'auto' }}>
            {staff.role}
          </span>
        </div>
      )}

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {isAdmin ? (
        <div className="card" style={{ padding:28, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔑</div>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>
            <strong>Admin</strong> users have full access to all features automatically.<br/>
            Individual permission settings are not needed.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding:24 }}>
          {/* Bulk actions */}
          <div style={{ display:'flex', gap:10, marginBottom:24, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
            <button className="btn btn-primary btn-sm" onClick={selectAll}>Select All</button>
            <button className="btn btn-secondary btn-sm" onClick={clearAll}>Clear All</button>
            <span style={{ marginLeft:'auto', fontSize:13, color:'var(--text-muted)', alignSelf:'center' }}>
              {perms.length} of {ALL_PERMS.length} permissions selected
            </span>
          </div>

          {/* Permission groups */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
            {PERMISSION_GROUPS.map(group => {
              const keys   = group.permissions.map(p => p.key)
              const allOn  = keys.every(k => perms.includes(k))
              const someOn = keys.some(k => perms.includes(k))

              return (
                <div key={group.group} style={{
                  border:'1px solid var(--border)', borderRadius:'var(--radius)',
                  overflow:'hidden'
                }}>
                  {/* Group header */}
                  <div style={{
                    background: allOn ? 'var(--teal-light)' : someOn ? '#fef3c7' : '#f7fafc',
                    padding:'10px 14px',
                    display:'flex', alignItems:'center', gap:10,
                    borderBottom:'1px solid var(--border)',
                    cursor:'pointer'
                  }} onClick={() => toggleGroup(group.group)}>
                    <input
                      type="checkbox"
                      checked={allOn}
                      ref={el => { if (el) el.indeterminate = someOn && !allOn }}
                      onChange={() => toggleGroup(group.group)}
                      onClick={e => e.stopPropagation()}
                      style={{ width:15, height:15 }}
                    />
                    <span style={{ fontWeight:600, fontSize:13, color: allOn ? 'var(--teal-dark)' : '#4a5568' }}>
                      {group.group}
                    </span>
                    <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-muted)' }}>
                      {keys.filter(k => perms.includes(k)).length}/{keys.length}
                    </span>
                  </div>

                  {/* Individual permissions */}
                  <div style={{ padding:'8px 0' }}>
                    {group.permissions.map(perm => (
                      <label key={perm.key} style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'7px 14px', cursor:'pointer',
                        transition:'background 0.1s',
                        background: perms.includes(perm.key) ? 'rgba(26,171,135,0.05)' : 'transparent'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f7fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = perms.includes(perm.key) ? 'rgba(26,171,135,0.05)' : 'transparent'}
                      >
                        <input
                          type="checkbox"
                          checked={perms.includes(perm.key)}
                          onChange={() => togglePerm(perm.key)}
                          style={{ width:14, height:14 }}
                        />
                        <span style={{ fontSize:13, color: perms.includes(perm.key) ? 'var(--teal-dark)' : '#4a5568' }}>
                          {perm.label}
                        </span>
                        <span style={{ marginLeft:'auto', fontFamily:'monospace', fontSize:11, color:'#a0aec0' }}>
                          {perm.key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Save */}
          <div style={{ marginTop:24, display:'flex', justifyContent:'center', gap:12 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth:120 }}>
              {saving ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> : 'Save Permissions'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/staff')}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
