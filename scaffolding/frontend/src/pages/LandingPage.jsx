import React from 'react'
import '../styles/LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <h1 className="hero-title">IT Support Agent</h1>
          <p className="hero-subtitle">
            Intelligent System Management Platform
          </p>
          <p className="hero-description">
            Diagnose issues, query logs, and execute fixes with AI-powered agents
          </p>
        </div>
      </header>

      {/* Agents Section */}
      <section className="agents-section">
        <div className="container">
          <h2 className="section-title">AI-Powered Agents</h2>
          <div className="agents-grid">
            <div className="agent-card">
              <div className="agent-icon">📊</div>
              <h3 className="agent-title">Log Analysis Agent</h3>
              <p className="agent-description">
                Automatically analyze system logs, identify patterns, and detect anomalies
                to quickly pinpoint issues and their root causes.
              </p>
            </div>

            <div className="agent-card">
              <div className="agent-icon">🔍</div>
              <h3 className="agent-title">System Diagnostics Agent</h3>
              <p className="agent-description">
                Perform comprehensive system health checks, monitor performance metrics,
                and diagnose hardware and software issues in real-time.
              </p>
            </div>

            <div className="agent-card">
              <div className="agent-icon">⚡</div>
              <h3 className="agent-title">Auto-Fix Agent</h3>
              <p className="agent-description">
                Automatically execute fixes for common issues, apply patches, and restore
                system configurations to optimal states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">RAG Technology</h3>
              <p className="feature-description">
                Retrieval-Augmented Generation for accessing troubleshooting guides,
                error logs, and configuration documents instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔌</div>
              <h3 className="feature-title">MCP Integration</h3>
              <p className="feature-description">
                Model Context Protocol with system monitoring APIs and device
                management commands for seamless operations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3 className="feature-title">Memory System</h3>
              <p className="feature-description">
                Persistent memory of incident history and user device patterns
                for faster resolution and personalized support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your IT Support?</h2>
          <p className="cta-description">
            Experience intelligent system management with AI-powered agents
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 IT Support Agent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


