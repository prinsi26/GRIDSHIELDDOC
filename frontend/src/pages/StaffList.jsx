import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function StaffList() {
  const [staff,   setStaff]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [limit,   setLimit]   = useState(25)
  const [deleteId,setDeleteId] = useState(null)
  const navigate = useNavigate()

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit, ...(search && { search }) }
      const { data } = await axios.get('/api/staff', { params })
      setStaff(data.staff)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    const t = setTimeout(fetchStaff, 300)
    return () => clearTimeout(t)
  }, [fetchStaff])

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/staff/${deleteId}`)
      setDeleteId(null)
      fetchStaff()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggle = async (id) => {
    try {
      const { data } = await axios.put(`/api/staff/${id}/toggle`)
      setStaff(s => s.map(u => u._id === id ? { ...u, isActive: data.isActive } : u))
    } catch (err) {
      alert('Failed to toggle status')
    }
  }

  const formatDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
  }

  const roleBadge = (role) => {
    const cls = { Admin: 'badge-admin', Staff: 'badge-staff', Viewer: 'badge-viewer' }
    return <span className={`badge ${cls[role] || 'badge-staff'}`}>{role}</span>
  }

  const pages = Math.ceil(total / limit)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Staff List</h1>
        <button className="btn btn-primary" onClick={() => navigate('/staff/new')}>
          + Add Staff
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid var(--border)', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>Show</span>
            <select
              value={limit}
              onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}
              style={{ width:70 }}
            >
              {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>entries</span>

            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(staff)}>Excel</button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>PDF</button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>Print</button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>Search:</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Name, username, contact..."
              style={{ width:220 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding:40, textAlign:'center' }}>
              <span className="spinner" />
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width:50 }}>#</th>
                  <th>Created Date</th>
                  <th>Name</th>
                  <th>Contact #</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ width:120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>
                      No staff found
                    </td>
                  </tr>
                ) : staff.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color:'var(--text-muted)' }}>{(page - 1) * limit + i + 1}</td>
                    <td style={{ color:'var(--text-muted)', whiteSpace:'nowrap' }}>{formatDate(s.createdAt)}</td>
                    <td style={{ fontWeight:500 }}>
                      {s.firstName} {s.lastName}
                    </td>
                    <td>{s.contact || '—'}</td>
                    <td style={{ fontFamily:'monospace', fontSize:13 }}>{s.username}</td>
                    <td>{roleBadge(s.role)}</td>
                    <td>
                      <span
                        className={`badge ${s.isActive ? 'badge-active' : 'badge-inactive'}`}
                        style={{ cursor:'pointer' }}
                        onClick={() => handleToggle(s._id)}
                        title="Click to toggle"
                      >
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        {/* Permissions */}
                        <button
                          className="btn-icon teal"
                          title="Permissions"
                          onClick={() => navigate(`/staff/${s._id}/permissions`)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => navigate(`/staff/${s._id}/edit`)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          className="btn-icon danger"
                          title="Delete"
                          onClick={() => setDeleteId(s._id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderTop:'1px solid var(--border)', fontSize:13, color:'var(--text-muted)' }}>
            <span>
              Showing {Math.min((page-1)*limit+1, total)}–{Math.min(page*limit, total)} of {total} entries
            </span>
            <div style={{ display:'flex', gap:4 }}>
              <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={() => setPage(p => p-1)}>Previous</button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i+1).map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${p===page ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="btn btn-secondary btn-sm" disabled={page>=pages} onClick={() => setPage(p => p+1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Confirm Delete</div>
            <p style={{ color:'var(--text-muted)', fontSize:14 }}>
              Are you sure you want to delete this staff member? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function exportCSV(staff) {
  const rows = [['#','Name','Contact','Username','Role','Status','Created']]
  staff.forEach((s, i) => {
    rows.push([
      i+1,
      `${s.firstName} ${s.lastName}`,
      s.contact,
      s.username,
      s.role,
      s.isActive ? 'Active' : 'Inactive',
      new Date(s.createdAt).toLocaleDateString()
    ])
  })
  const csv = rows.map(r => r.join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv,' + encodeURIComponent(csv)
  a.download = 'staff.csv'
  a.click()
}
