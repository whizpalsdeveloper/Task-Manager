import { useState } from "react";
import { login, register } from "../api/auth";

export default function Login({ setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.token) {
        alert("Login successful!");
        window.location.reload();
      } else {
        alert("Login failed. No token received.");
      }
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
          
          {/* Quick Login Options */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>Quick Access</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setEmail("admin@example.com");
                  setPassword("password");
                }}
                className="btn btn-secondary"
                style={{ textAlign: 'left' }}
              >
                <strong>Admin:</strong> admin@example.com
              </button>
              <button
                onClick={() => {
                  setEmail("company.admin@example.com");
                  setPassword("password");
                }}
                className="btn btn-secondary"
                style={{ textAlign: 'left' }}
              >
                <strong>Company:</strong> company.admin@example.com
              </button>
              <button
                onClick={() => {
                  setEmail("john@example.com");
                  setPassword("password");
                }}
                className="btn btn-secondary"
                style={{ textAlign: 'left' }}
              >
                <strong>User:</strong> john@example.com
              </button>
            </div>
          </div>

          <hr style={{ margin: '20px 0' }} />

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '15px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode("register")}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Create one here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}