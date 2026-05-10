import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBuild } from "../../contexts/BuildContext";
import "./Learn.css";

const componentGuide = [
  {
    id: "cpu",
    name: "CPU (Processor)",
    icon: "🎯",
    difficulty: "Critical",
    description:
      "The brain of your computer. Handles all calculations and instructions.",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
    specs: [
      {
        label: "Socket",
        value: "LGA1700, AM5, etc.",
        info: "Must match motherboard",
      },
      {
        label: "Cores/Threads",
        value: "6-24 cores typical",
        info: "More cores = better multitasking",
      },
      {
        label: "Clock Speed",
        value: "3.5-5.8 GHz",
        info: "Higher = faster single-task performance",
      },
      {
        label: "TDP",
        value: "65-250W",
        info: "Heat output - affects cooler choice",
      },
    ],
    whyMatters:
      "Your CPU choice determines which motherboard you'll need. It's the foundation of your build.",
    proTips: [
      "Match CPU socket to motherboard before purchasing",
      "Don't overspend on CPU for gaming - GPU matters more",
      "Higher core count helps with streaming and content creation",
      "Check TDP to plan your cooling solution",
    ],
    commonMistakes: [
      "Buying incompatible socket CPU",
      "Over-prioritizing single-core speed",
      "Forgetting TDP when choosing a cooler",
    ],
    bestFor: {
      gaming: "6-8 core CPU, focus on speed",
      streaming: "12+ cores for multitasking",
      work: "16+ cores for rendering",
    },
    brands: [
      {
        name: "Intel",
        logo: "🖥️",
        description: "Core i9/i7/i5. Market leader in single-core performance.",
        tier: "Premium",
      },
      {
        name: "AMD",
        logo: "🔧",
        description: "Ryzen 9/7/5. Great value, excellent multitasking.",
        tier: "Value",
      },
    ],
  },
];

export default function Learn() {
  const { getSelectedComponents } = useBuild();
  const [selectedComponent, setSelectedComponent] = useState(componentGuide[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = componentGuide.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="learn-page">
      {/* ── HERO ── */}
      <div className="learn-hero-new">
        <div className="hero-content">
          <span className="hero-eyebrow">🎓 Master PC Building</span>
          <h1>Learn Every Component</h1>
          <p>
            Understand what each part does, why it matters, and how to choose
            wisely for your build.
          </p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="learn-search-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="learn-search-input"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── COMPONENT GRID ── */}
      <div className="components-grid">
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            className={`component-card ${
              selectedComponent.id === component.id ? "active" : ""
            }`}
            onClick={() => setSelectedComponent(component)}
          >
            <div className="card-image-wrapper">
              <img
                src={component.image}
                alt={component.name}
                className="card-image"
              />
            </div>
            <div className="card-content">
              <div className="card-icon">{component.icon}</div>
              <h3>{component.name}</h3>
              <span
                className={`difficulty-badge ${component.difficulty.toLowerCase()}`}
              >
                {component.difficulty}
              </span>
              <p>{component.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── DETAIL PANEL ── */}
      <div className="detail-panel">
        <div className="detail-header">
          <div className="detail-title-section">
            <span className="detail-icon">{selectedComponent.icon}</span>
            <div>
              <h2>{selectedComponent.name}</h2>
              <p className="detail-description">
                {selectedComponent.description}
              </p>
            </div>
          </div>
        </div>

        {/* ── SPECS TABLE ── */}
        <h3 className="section-title">📊 Key Specifications</h3>
        <div className="specs-grid">
          {selectedComponent.specs.map((spec, idx) => (
            <div key={idx} className="spec-item">
              <div className="spec-label">{spec.label}</div>
              <div className="spec-value">{spec.value}</div>
              <div className="spec-info">{spec.info}</div>
            </div>
          ))}
        </div>
        {/* ── WHY IT MATTERS ── */}
        <h3 className="section-title" style={{ marginTop: "24px" }}>
          ⭐ Why It Matters
        </h3>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          {selectedComponent.whyMatters}
        </p>
        {/* ── PRO TIPS ── */}
        <h3 className="section-title">💡 Pro Tips</h3>
        <div className="tips-list">
          {selectedComponent.proTips.map((tip, idx) => (
            <div key={idx} className="tip-item">
              <span className="tip-dot">✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
        {/* ── COMMON MISTAKES ── */}
        <h3 className="section-title" style={{ marginTop: "24px" }}>
          ⚠️ Common Mistakes
        </h3>
        <div className="mistakes-list">
          {selectedComponent.commonMistakes.map((mistake, idx) => (
            <div key={idx} className="mistake-item">
              <span className="mistake-icon">✗</span>
              <span>{mistake}</span>
            </div>
          ))}
        </div>
        {/* ── BEST FOR ── */}
        <h3 className="section-title" style={{ marginTop: "24px" }}>
          🎯 Best For
        </h3>
        <div className="best-for-grid">
          {Object.entries(selectedComponent.bestFor).map(
            ([useCase, recommendation], idx) => (
              <div key={idx} className="best-for-item">
                <div className="use-case">{useCase}</div>
                <div className="recommendation">{recommendation}</div>
              </div>
            )
          )}
        </div>
        {/* ── BRANDS ── */}
        <h3 className="section-title" style={{ marginTop: "24px" }}>
          🏢 Popular Brands
        </h3>
        <div className="brands-grid">
          {selectedComponent.brands.map((brand, idx) => (
            <div key={idx} className="brand-item">
              <div className="brand-header">
                <span className="brand-logo">{brand.logo}</span>
                <div>
                  <div className="brand-name">{brand.name}</div>
                  <div className="brand-tier">{brand.tier}</div>
                </div>
              </div>
              <p className="brand-description">{brand.description}</p>
            </div>
          ))}
        </div>
        {/* ── CTA ── */}
        <div className="detail-cta">
          <Link to="/build" className="cta-button-neon">
            Go to Build →
          </Link>
        </div>
      </div>
    </div>
  );
}
