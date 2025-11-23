import React from "react";
import "./landing.css"; // optional: you can copy the CSS section below into src/components/landing.css
import { Link } from "react-router-dom";


// Local images (uploaded in this session)
const HERO_IMG = "https://images.unsplash.com/photo-1503387762-592deb58ef4e";
const ILLU_IMG = "https://images.unsplash.com/photo-1517816428104-797678c7cf0c";


export default function LandingPage() {
    return (
       <div>
    {/* Hero Section */}
<header className="landing-hero">
    <div className="container">
        <div className="row align-items-center gy-5">
            {/* Text Content */}
            <div className="col-lg-6 order-2 order-lg-1 text-center text-lg-start">
                <div className="mb-4">
                    <span className="hero-badge rounded-pill">
                        🚀 New: Real-time collaboration launched
                    </span>
                </div>
                {/* Using fw-bolder and tighter spacing for modern look */}
                <h1 className="display-4 fw-bolder mb-4 ls-tight">
                    Organize chaos. <br />
                    <span className="text-gradient-brand">Ship projects faster.</span>
                </h1>
                <p className="lead text-muted mb-5 lh-lg" style={{ maxWidth: '540px' }}>
                    A lightweight task manager built for modern development teams.
                    Clean UI, real-time updates, and the features you actually need
                    without the bloat.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                    <Link className="btn btn-primary-brand" to="/signup">
                        Start for free
                    </Link>
                    <a className="btn btn-outline-brand" href="#features">
                        See how it works
                    </a>
                </div>

                <div className="mt-5 pt-4 border-top d-flex align-items-center justify-content-center justify-content-lg-start gap-4 text-muted small fw-medium">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        Secure and Reliable
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        Free to use
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="col-lg-6 order-1 order-lg-2">
    <div className="hero-image-container fade-in-up">
        {/* Reverted to your imported variable */}
        <img
            src={HERO_IMG}
            alt="Task board dashboard"
            className="img-fluid rounded-4 shadow-lg"
            style={{border: '1px solid rgba(0,0,0,0.05)'}}
        />
    </div>
</div>
        </div>
    </div>
</header>

{/* Features Section - Realistic for MERN App */}
<section id="features" className="py-5 py-lg-6 bg-white">
    <div className="container my-lg-5">
        <div className="row justify-content-center mb-5 text-center">
            <div className="col-lg-7">
                <small className="text-primary fw-bold text-uppercase ls-wider">Simple Workflow</small>
                <h2 className="fw-bolder mt-2">Manage tasks without the clutter</h2>
                <p className="text-muted fs-5">Focus on what matters: knowing who is doing what, and when it needs to be done.</p>
            </div>
        </div>

        <div className="row g-4">
            {/* Feature 1: Kanban / Boards */}
            <div className="col-md-6 col-lg-4">
                <div className="feature-card hover-lift-sm shadow-sm">
                    <div className="feature-icon-box">
                        📋
                    </div>
                    <h5 className="fw-bold mb-3">Kanban Boards</h5>
                    <p className="text-muted mb-0 lh-lg">
                        Organize tasks visually and move work through stages (To Do, In Progress, Done) with ease.
                    </p>
                </div>
            </div>

            {/* Feature 2: Team Assignments */}
            <div className="col-md-6 col-lg-4">
                <div className="feature-card hover-lift-sm shadow-sm">
                    <div className="feature-icon-box" style={{backgroundColor: '#f0fdf4', color: '#16a34a'}}>
                        👥
                    </div>
                    <h5 className="fw-bold mb-3">Team Assignments</h5>
                    <p className="text-muted mb-0 lh-lg">
                        Clear accountability. Assign specific tasks to team members so everyone knows their responsibilities.
                    </p>
                </div>
            </div>

            {/* Feature 3: Priorities & Dates */}
            <div className="col-md-6 col-lg-4 mx-auto">
                 <div className="feature-card hover-lift-sm shadow-sm">
                    <div className="feature-icon-box" style={{backgroundColor: '#fff7ed', color: '#ea580c'}}>
                         🚩
                    </div>
                    <h5 className="fw-bold mb-3">Priorities & Deadlines</h5>
                    <p className="text-muted mb-0 lh-lg">
                        Never miss a due date. Set priorities (High, Medium, Low) to keep the most important work at the top.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

{/* NEW CTA Banner Section (Replaces Testimonials) */}
<section className="cta-section py-5 py-lg-7">
    <div className="cta-overlay-pattern"></div> {/* Decorative pattern */}
    <div className="container position-relative z-1">
        <div className="row justify-content-center text-center">
            <div className="col-xl-8 col-lg-9">
                <h2 className="display-5 fw-bolder text-white mb-4">
                    Ready to streamline your workflow?
                </h2>
                
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                     <Link className="btn btn-primary-brand btn-lg px-5 py-3 text-white" to="/signup">
                        Create free account
                    </Link>
                </div>
                 
            </div>
        </div>
    </div>
</section>


</div>
    );
}