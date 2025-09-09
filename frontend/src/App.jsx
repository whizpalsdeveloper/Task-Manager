import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import AdminPanel from "./pages/AdminPanel";
import CompanyPanel from "./pages/CompanyPanel";

export default function App() {
  const token = localStorage.getItem("token");
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  async function fetchUser() {
    try {
      const response = await fetch("http://task-manager.ddev.site/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (token && user) {
    // Route based on user role
    switch (user.role) {
      case "admin":
        return <AdminPanel />;
      case "company":
        return <CompanyPanel />;
      case "user":
        return <Tasks />;
      default:
        return <Tasks />;
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="nav">
            <h1>Task Manager</h1>
            <div className="nav-buttons">
              <button
                onClick={() => setMode("login")}
                className={`btn ${mode === "login" ? "btn-primary" : "btn-secondary"}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`btn ${mode === "register" ? "btn-primary" : "btn-secondary"}`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {mode === "login" ? <Login setMode={setMode} /> : <Register setMode={setMode} />}
      </main>
    </div>
  );
}