import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '', type: 'Admin' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime]     = useState(new Date())
  const [ip, setIp]         = useState('---.---.---.---')
  const { login, token }    = useAuth()
  const navigate            = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token, navigate])

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Fetch public IP
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => setIp(d.ip))
      .catch(() => {})
  }, [])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please enter username and password')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', form)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const dd   = String(d.getDate()).padStart(2,'0')
    const mon  = months[d.getMonth()]
    const yyyy = d.getFullYear()
    const hh   = String(d.getHours()).padStart(2,'0')
    const mm   = String(d.getMinutes()).padStart(2,'0')
    const ss   = String(d.getSeconds()).padStart(2,'0')
    return `${dd}, ${mon} ${yyyy}, ${hh}:${mm}:${ss}`
  }

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:"'DM Sans', sans-serif" }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1,
        background: '#f0f4f8',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Decorative blobs */}
        {[
          { w:320, h:280, x:80,  y:60,  r:28 },
          { w:200, h:200, x:340, y:100, r:50 },
          { w:260, h:220, x:480, y:50,  r:24 },
          { w:300, h:260, x:160, y:300, r:24 },
          { w:180, h:180, x:520, y:320, r:20 },
          { w:240, h:200, x:60,  y:460, r:28 },
          { w:200, h:200, x:360, y:460, r:50 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: b.x, top: b.y,
            width: b.w, height: b.h,
            borderRadius: b.r,
            background: 'rgba(180,210,230,0.25)',
            border: '1px solid rgba(180,210,230,0.4)',
            transform: i % 2 === 0 ? 'rotate(-5deg)' : 'rotate(3deg)'
          }} />
        ))}

        {/* Chat bubbles */}
        <div style={{
          position: 'absolute', left: 130, top: 310,
          background: 'white', borderRadius: 16, padding: '16px 22px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          fontSize: 15, color: '#4a5568', fontWeight: 500,
          maxWidth: 220
        }}>
          Hi! I have a problem!
          <div style={{
            position:'absolute', bottom:-10, left:20,
            width:0, height:0,
            borderLeft:'10px solid transparent',
            borderRight:'10px solid transparent',
            borderTop:'10px solid white'
          }}/>
        </div>

        <div style={{
          position: 'absolute', right: 120, bottom: 200,
          background: 'white', borderRadius: 16, padding: '16px 22px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          fontSize: 15, color: '#718096',
          maxWidth: 240
        }}>
          Don't worry, we will solve it!
          <div style={{
            position:'absolute', bottom:-10, right:20,
            width:0, height:0,
            borderLeft:'10px solid transparent',
            borderRight:'10px solid transparent',
            borderTop:'10px solid white'
          }}/>
        </div>

        {/* Decorative UI card */}
        <div style={{
          position:'absolute', top:110, left:280,
          width:200, height:60,
          background:'rgba(255,255,255,0.7)',
          borderRadius:16, display:'flex', alignItems:'center', gap:12, padding:'0 16px',
          border:'1px solid rgba(200,220,235,0.6)'
        }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'#d0e8f0' }} />
          <div style={{ flex:1, height:10, background:'#d0e8f0', borderRadius:5 }} />
        </div>
      </div>

      {/* Right login panel */}
      <div style={{
        width: 380,
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 40px',
        borderLeft: '1px solid #e2e8f0',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.06)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-block',
            background: '#1aab87',
            color: 'white',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 2,
            padding: '10px 28px',
            borderRadius: 30,
            textTransform: 'uppercase'
          }}>
            Gridshield
          </div>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••••••"
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14, marginTop: 4 }}
          >
            {loading ? <span className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> : 'Click here to login'}
          </button>
        </form>

        {/* IP + Time */}
        <div style={{ marginTop: 28, fontSize: 12, color: '#a0aec0', lineHeight: 1.9 }}>
          <div>Your IP Address is <strong style={{ color:'#4a5568' }}>{ip}</strong></div>
          <div>Date and time is <strong style={{ color:'#4a5568' }}>{formatDate(time)}</strong></div>
        </div>
      </div>
    </div>
  )
}
