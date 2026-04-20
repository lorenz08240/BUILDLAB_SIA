import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Home.css'; // Import the CSS file for styling

function Hero() {
  return (
    <>
      <section id="welcome" className="hero">
        <div className="hero-badge">
          <span className="dot"></span> ICT Senior High School Training System
        </div>

        <h1 className="hero-title">
          Build Your Dream PC<br />
          <span className="yellow">with Expert Guidance</span>
        </h1>

        <p className="hero-sub">
          Transform your ideas into reality with BuildLab the ultimate PC building simulator. Whether you're a complete beginner or looking to upgrade, our interactive platform guides you through every step. Save money, learn valuable skills, and create a custom rig that matches your needs perfectly. No guesswork, just confident building!
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">PCs Built</span>
          </div>
          <div className="stat">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>

        <div className="hero-btns">
          <Link to="/build" className="btn-primary"> Start Building Now</Link>
          <Link to="/learn" className="btn-secondary"> Learn Section</Link>
          <a href="#why-build" className="btn-outline"> Why Build Your Own?</a>
        </div>

        <div className="hero-features">
          <div className="feat-card">
            <div className="feat-icon">⚙️</div>
            <h4>Component Picker</h4>
            <p>Choose from 1000+ real PC parts with live pricing</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon">🛡️</div>
            <h4>Compatibility Check</h4>
            <p>AI-powered verification prevents costly mistakes</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon">🎓</div>
            <h4>Learn As You Build</h4>
            <p>Step-by-step tutorials and expert tips included</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon">📊</div>
            <h4>Build Summary</h4>
            <p>Detailed report with performance benchmarks</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon">💰</div>
            <h4>Save Money</h4>
            <p>Build for 30-50% less than pre-built systems</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon">🚀</div>
            <h4>Future-Proof</h4>
            <p>Upgrade easily with modular component design</p>
          </div>
        </div>

      </section>

      <section id="why-build" className="why-build">
        <div className="container">
          <h2>Why Build Your Own PC?</h2>
          <p className="section-desc">
            Building your own PC isn't just about saving money – it's about gaining control, learning new skills, and creating something truly yours. Here's why thousands choose BuildLab.
          </p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <img src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&q=80" alt="Custom PC Build" className="benefit-image" />
              <h3>Complete Customization</h3>
              <p>Choose every component to match your exact needs – gaming, work, or creative projects. No compromises on performance or aesthetics.</p>
            </div>

            <div className="benefit-card">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" alt="Learning Experience" className="benefit-image" />
              <h3>Educational Journey</h3>
              <p>Master PC hardware knowledge while building. Understand how components work together for better troubleshooting and upgrades.</p>
            </div>

            <div className="benefit-card">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80" alt="Cost Savings" className="benefit-image" />
              <h3>Significant Savings</h3>
              <p>Avoid retailer markups. Build a high-end PC for the price of a mid-range pre-built, with better quality and warranty options.</p>
            </div>

            <div className="benefit-card">
              <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&q=80" alt="Performance" className="benefit-image" />
              <h3>Superior Performance</h3>
              <p>Optimized builds run cooler, quieter, and faster than off-the-shelf systems. Fine-tune for your specific use case.</p>
            </div>
          </div>

          <div className="testimonials">
            <h3>What Our Builders Say</h3>
            <div className="testimonial-grid">
              <div className="testimonial">
                <p>"BuildLab made my first PC build stress-free. The compatibility checks saved me from disaster!"</p>
                <cite>- Alex Chen, Gamer</cite>
              </div>
              <div className="testimonial">
                <p>"As a student, learning PC building here was invaluable. Now I can upgrade my own rig confidently."</p>
                <cite>- Maria Rodriguez, Student</cite>
              </div>
              <div className="testimonial">
                <p>"Saved $500 compared to buying pre-built. The tutorials are amazing for beginners."</p>
                <cite>- James Wilson, Content Creator</cite>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;