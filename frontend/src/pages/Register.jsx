import { useState } from "react";
import { register } from "../api/auth";

export default function Register({ setMode }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (form.password !== form.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    setLoading(true);
    try {
      const res = await register(form);
      if (res?.token) {
        alert("Registration successful! You can now login.");
        setMode("login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please check your information and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Register</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-control"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-control"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {form.password && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  <div style={{ color: form.password.length >= 8 ? 'green' : 'red' }}>
                    ✓ At least 8 characters: {form.password.length >= 8 ? 'Yes' : 'No'}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="form-control"
                  placeholder="Confirm your password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {form.password_confirmation && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: form.password === form.password_confirmation ? 'green' : 'red' }}>
                  {form.password === form.password_confirmation ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || form.password !== form.password_confirmation || form.password.length < 8}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '15px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode("login")}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign in here
              </button>
            </p>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
            <h6 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Account Types:</h6>
            <div style={{ marginBottom: '5px' }}>
              <strong>Admin:</strong> Manage companies and users
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>Company:</strong> Manage tasks and assign to users
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>User:</strong> View and update assigned tasks
            </div>
            <p style={{ color: '#666', margin: 0 }}>
              New accounts are created as "User" by default. Contact an admin to change your role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}