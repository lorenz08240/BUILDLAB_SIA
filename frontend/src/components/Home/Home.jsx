import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Home.css"; // Import the CSS file for styling

let hasSeenBannerThisSession = false;

function Hero() {
  const [isBannerVisible, setIsBannerVisible] = useState(!hasSeenBannerThisSession);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStartBuild = () => {
    setIsFadingOut(true);
    hasSeenBannerThisSession = true;
    setTimeout(() => {
      setIsBannerVisible(false);
    }, 500); // Wait for the 0.5s fade-out animation to complete
  };

  return (
    <div className="home-page">
      <div className="bg-grid"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      {isBannerVisible && (
        <div className={`welcome-banner ${isFadingOut ? "fade-out" : ""}`}>
          <div className="welcome-banner-content">
            <h1 className="welcome-title">
              Welcome to <span className="yellow">BuildLab</span>
            </h1>
            <p className="welcome-text">Your ultimate PC building simulator.</p>
            <button className="btn-primary banner-btn" onClick={handleStartBuild}>
              START BUILD NOW
            </button>
          </div>
        </div>
      )}
      <section id="welcome" className="hero">
        <div className="hero-badge"></div>

        <h1 className="hero-title">
          Build Your Dream PC
          <br />
          <span className="yellow">with Expert Guidance</span>
        </h1>

        <p className="hero-sub">
          Transform your ideas into reality with BuildLab the ultimate PC
          building simulator. Whether you're a complete beginner or looking to
          upgrade, our interactive platform guides you through every step. Save
          money, learn valuable skills, and create a custom rig that matches
          your needs perfectly. No guesswork, just confident building!
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


        <div className="hero-features">
          <div className="feat-card">
            <div className="feat-icon"></div>
            <h4>Component Picker</h4>
            <p>Choose from 1000+ real PC parts with live pricing</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon"></div>
            <h4>Compatibility Check</h4>
            <p>AI-powered verification prevents costly mistakes</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon"></div>
            <h4>Learn As You Build</h4>
            <p>Step-by-step tutorials and expert tips included</p>
          </div>

          <div className="feat-card">
            <div className="feat-icon"></div>
            <h4>Build Summary</h4>
            <p>Detailed report with performance benchmarks</p>
          </div>
        </div>
      </section>

      <section id="why-build" className="why-build">
        <div className="container">
          <h2>Why Build Your Own PC?</h2>
          <p className="section-desc">
            Building your own PC isn't just about saving money it's about
            gaining control, learning new skills, and creating something truly
            yours. Here's why thousands choose BuildLab.
          </p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <img
                src="https://www.deltarentals.com.au/wp-content/uploads/2022/01/Custom-Builder-scaled.webp"
                alt="Custom PC Build"
                className="benefit-image"
              />
              <h3>Complete Customization</h3>
              <p>
                Choose every component to match your exact needs gaming, work,
                or creative projects. No compromises on performance or
                aesthetics.
              </p>
            </div>

            <div className="benefit-card">
              <img
                src="https://www.learning.com/wp-content/uploads/2023/11/GettyImages-1425235236.jpg"
                alt="Learning Experience"
                className="benefit-image"
              />
              <h3>Educational Journey</h3>
              <p>
                Master PC hardware knowledge while building. Understand how
                components work together for better troubleshooting and
                upgrades.
              </p>
            </div>

            <div className="benefit-card">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
                alt="Cost Savings"
                className="benefit-image"
              />
              <h3>Significant Savings</h3>
              <p>
                Avoid retailer markups. Build a high-end PC for the price of a
                mid-range pre-built, with better quality and warranty options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How BuildLab Works</h2>
          <p className="section-desc">Three simple steps to your perfect custom PC.</p>
          <div className="steps-container">
            <div className="step-box">
              <div className="step-number">1</div>
              <h3>Select Parts</h3>
              <p>Browse our database of components with real-time prices and specs.</p>
            </div>
            <div className="step-box">
              <div className="step-number">2</div>
              <h3>Check Compatibility</h3>
              <p>Our system ensures all your chosen parts will work together flawlessly.</p>
            </div>
            <div className="step-box">
              <div className="step-number">3</div>
              <h3>Build & Enjoy</h3>
              <p>Follow our guides to assemble your PC and start gaming or working!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is it hard to build a PC?</h4>
              <p>Not at all! With our compatibility checker and online tutorials, it's like putting together high-tech LEGOs.</p>
            </div>
            <div className="faq-item">
              <h4>What if I pick parts that don't fit?</h4>
              <p>Our platform automatically flags incompatibilities, like wrong socket types or inadequate power supplies.</p>
            </div>
            <div className="faq-item">
              <h4>Does BuildLab sell parts?</h4>
              <p>We are a planning tool. We aggregate prices from top retailers to help you find the best deals.</p>
            </div>
            <div className="faq-item">
              <h4>How do I know what parts I need?</h4>
              <p>Start with our "Explore Resources" section to learn the basics, or check out our Featured Builds for templates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Build Your Dream PC?</h2>
          <p>Join thousands of users who have successfully planned their builds with BuildLab.</p>
          <div className="final-cta-btns">
            <Link to="/build" className="btn-primary hero-main-btn">Start Your Build</Link>
            <Link to="/learn" className="btn-secondary hero-main-btn">Explore Resources</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;