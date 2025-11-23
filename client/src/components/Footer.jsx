import React from 'react'

const Footer = () => {
  return (
    <div>
        {/* Footer */}
<footer className="py-5 bg-white">
    <div className="container">
        <div className="row gy-4 justify-content-between align-items-center">
            <div className="col-md-6">
                <div className="footer-brand mb-2">
                    <span className="text-primary">⚡</span> Taktus
                </div>
                <div className="text-muted small">
                    Built for speed with React, Express & MongoDB.
                    <br />© {new Date().getFullYear()} Taktus Labs.
                </div>
            </div>
            <div className="col-md-6">
                <div className="d-flex gap-4 justify-content-md-end">
                    <a href="#" className="footer-link text-decoration-none fw-medium small">Features</a>
                    <a href="#" className="footer-link text-decoration-none fw-medium small">Pricing</a>
                    <a href="#" className="footer-link text-decoration-none fw-medium small">Privacy</a>
                    <a href="#" className="footer-link text-decoration-none fw-medium small">Terms</a>
                </div>
            </div>
        </div>
    </div>
</footer>
    </div>
  )
}

export default Footer