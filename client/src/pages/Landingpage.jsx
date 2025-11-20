import React from "react";
import "./landing.css"; // optional: you can copy the CSS section below into src/components/landing.css
import { Link } from "react-router-dom";


// Local images (uploaded in this session)
const HERO_IMG = "https://images.unsplash.com/photo-1503387762-592deb58ef4e";
const ILLU_IMG = "https://images.unsplash.com/photo-1517816428104-797678c7cf0c";


export default function LandingPage() {
    return (
        <div>
            {/* Hero */}
            <header className="landing-hero bg-white">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 order-2 order-lg-1">
                            <small className="badge bg-primary bg-gradient text-white mb-3">Team Task Manager</small>
                            <h1 className="display-5 fw-bold mb-3">Work together. Ship faster.</h1>
                            <p className="lead text-muted mb-4">
                                A lightweight team task manager to organize work, assign tasks, and track progress — built with
                                React, Express and MongoDB. Clean UI, real-time ready, and Bootstrap-powered for responsiveness.
                            </p>


                            <div className="d-flex gap-2">
                                <Link className="btn btn-primary" to="/signup">
                                    Get started 
                                </Link>
                                <a className="btn btn-outline-secondary btn-lg" href="#features">
                                    Learn more
                                </a>
                            </div>


                            <div className="mt-4 text-muted small">
                                <span className="me-3">Trusted by small teams</span>
                                <span className="me-2">•</span>
                                <span>Open-source friendly</span>
                            </div>
                        </div>


                        <div className="col-lg-6 text-center order-1 order-lg-2 mb-4 mb-lg-0">
                            <div className="hero-card shadow-sm rounded p-3 bg-light d-inline-block">
                                <img src={HERO_IMG} alt="App screenshot" className="img-fluid rounded" style={{ maxWidth: '480px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            {/* Features */}
            <section id="features" className="py-5">
                <div className="container">
                    <div className="row text-center gy-4">
                        <div className="col-md-4">
                            <div className="p-4 border rounded h-100">
                                <div className="mb-3 display-6 text-primary">🚀</div>
                                <h5>Kanban boards</h5>
                                <p className="text-muted">Organize tasks visually and move work through stages with ease.</p>
                            </div>
                            <div>
                                <Link className="btn btn-primary" to="/signup">
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Testimonials / Illustration */}
            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h4 className="mb-3">What users love</h4>
                            <blockquote className="blockquote">
                                <p className="mb-0">
                                    "Clean, simple, and reliable — our team started using it the same day. Visibility and assignment
                                    features are exactly what we needed."
                                </p>
                                <footer className="blockquote-footer mt-2">A happy product manager</footer>
                            </blockquote>


                            <div className="mt-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={ILLU_IMG} alt="user" width="64" height="64" className="rounded-circle shadow-sm" />
                                    <div>
                                        <div className="fw-bold">Small Team Inc.</div>
                                        <div className="text-muted small">Productivity improved 32% in one month.</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-6 text-center">
                            <img src={ILLU_IMG} alt="illustration" className="img-fluid" style={{ maxWidth: '320px' }} />
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="py-4 bg-white border-top">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="text-muted">© {new Date().getFullYear()} Taktus</div>
                    <div>
                        <a href="#" className="text-muted me-3">Privacy</a>
                        <a href="#" className="text-muted">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}