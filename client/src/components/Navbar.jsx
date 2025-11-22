import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axiosconfig.js";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for manual dropdown control
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsDropdownOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path ? "text-primary" : "";

  return (
    // Added 'fixed-top' and 'navbar-glass' for the theme effect
    <nav className="navbar navbar-expand-lg navbar-glass border-bottom">
      <div className="container">
        {/* Logo: Text only, no emojis */}
        <Link 
            className="navbar-brand fw-bolder text-dark" 
            to="/" 
            style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}
        >
          Taktus
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left Side Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            {user && (
              <li className="nav-item">
                <Link 
                    className={`nav-link fw-medium ${isActive("/dashboard")}`} 
                    to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Right Side (Auth Buttons or User Profile) */}
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium px-3 text-dark" to="/login">
                    Log in
                  </Link>
                </li>
                <li className="nav-item">
                  {/* Using the brand theme button */}
                  <Link className="btn btn-primary-brand" to="/signup">
                    Sign up free
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-decoration-none"
                  id="userMenu"
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  {/* User Avatar Circle */}
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{width: '35px', height: '35px', fontSize: '0.9rem'}}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="d-none d-lg-block text-dark fw-medium">{user.name}</span>
                </button>

                <ul
                  className={`dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4 mt-2 ${
                    isDropdownOpen ? "show" : ""
                  }`}
                  aria-labelledby="userMenu"
                  style={{ minWidth: '200px' }}
                >
                  {/* Optional User Info Header inside dropdown */}
                  <li>
                     <div className="px-3 py-2 border-bottom mb-2">
                        <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Signed in as</small>
                        <div className="fw-bold text-truncate" style={{maxWidth: '180px'}}>
                            {user.email || user.name}
                        </div>
                     </div>
                  </li>
                  
                  <li>
                    <button 
                        className="dropdown-item rounded-2 text-danger fw-medium" 
                        onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}