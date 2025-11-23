import React, { useState } from "react";
import api from "../api/axiosconfig.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="col-md-5 col-lg-5">
        {/* Card Wrapper with Shadow and Rounded Corners */}
        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-4 p-sm-5">
            
            {/* Header Section */}
            <div className="text-center mb-4">
              <h3 className="fw-bolder mb-2">Get started free</h3>
              <p className="text-muted small">No credit card required.</p>
            </div>

            <form onSubmit={submit}>
              {/* Name Input */}
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Full Name</label>
                <input 
                    className="form-control form-control-lg bg-light fs-6" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe"
                    required 
                />
              </div>

              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Email Address</label>
                <input 
                    className="form-control form-control-lg bg-light fs-6" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="name@company.com"
                    required 
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Password</label>
                <input 
                    type="password" 
                    className="form-control form-control-lg bg-light fs-6" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Create a password"
                    required 
                />
              </div>

              {/* Submit Button - Full Width */}
              <div className="d-grid mb-4">
                <button className="btn btn-primary-brand btn-lg fw-bold py-2">
                  Create account
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-decoration-none fw-bold text-primary">
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}