import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBuild } from "../../contexts/BuildContext";
import { checkCompatibility } from "../../utilities/rules";
import "./Compatibility.css";

export default function Compatibility() {
  const {
    currentBuild,
    getSelectedComponents,
    savedBuilds,
    selectedSaveSlot,
    setSelectedSaveSlot,
    getSavedBuild,
    saveBuildSnapshot,
  } = useBuild();

  const selectedComponents = getSelectedComponents();
  const [compareMode, setCompareMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [bottleneckDismissed, setBottleneckDismissed] = useState(false);

  const parsePrice = (price = "") =>
    parseFloat(price.toString().replace(/[₱,]/g, "")) || 0;

  /* ── Saved build helpers ── */
  const savedComponents = useMemo(() => {
    const b = getSavedBuild(selectedSaveSlot);
    if (!b) return [];
    return Object.entries(b)
      .filter(([, v]) => v !== null)
      .map(([category, component]) => ({ category, ...component }));
  }, [selectedSaveSlot, getSavedBuild]);

  const savedBuild = getSavedBuild(selectedSaveSlot);
  const hasSavedBuild = Boolean(savedBuild && savedComponents.length > 0);
  const metrics = ["CPU", "GPU", "RAM", "SSD", "PSU"];

  /* ── Scoring ── */
  const getCpuScore = (cpu) => {
    if (!cpu || !Array.isArray(cpu.tags)) return 0; // Dagdagan ng check
    const tag = cpu.tags.find((t) => /\d+\s*cores?/i.test(t));
    const cores = tag ? parseInt(tag.match(/(\d+)/)[1], 10) : 4;
    if (cores >= 24) return 100;
    if (cores >= 16) return 92;
    if (cores >= 8) return 76;
    if (cores >= 6) return 58;
    return 40;
  };

  const getGpuScore = (gpu) => {
    if (!gpu) return 0;
    const w = gpu.power_required || 0;
    if (w >= 700) return 100;
    if (w >= 550) return 86;
    if (w >= 400) return 68;
    if (w > 0) return 50;
    return 30;
  };

  const getRamScore = (ram) => {
    if (!ram || !Array.isArray(ram.tags)) return 0; // Dagdagan ng check
    const cap = parseInt(
      ram.tags.find((t) => /\d+GB/i.test(t))?.match(/(\d+)/)?.[1] || "8",
      10
    );
    const spd = parseInt(
      ram.tags.find((t) => /\d+MHz/i.test(t))?.match(/(\d+)/)?.[1] || "2400",
      10
    );
    let s = cap >= 32 ? 50 : cap >= 16 ? 35 : 20;
    s += spd >= 5600 ? 50 : spd >= 3600 ? 38 : 24;
    return Math.min(100, s);
  };

  const getStorageScore = (storage) => {
    if (!storage) return 0;
    const type = (
      storage.type ||
      storage.tags?.find((t) => /(nvme|ssd|hdd)/i.test(t)) ||
      ""
    ).toLowerCase();
    if (type.includes("nvme")) return 100;
    if (type.includes("ssd")) return 80;
    if (type.includes("hdd")) return 40;
    return 60;
  };

  const getPsuScore = (psu) => {
    if (!psu) return 0;
    const w = psu.wattage || 0;
    if (w >= 850) return 100;
    if (w >= 650) return 80;
    if (w >= 550) return 60;
    return 40;
  };

  const metricScore = (build, metric) => {
    if (!build) return 0;
    switch (metric) {
      case "CPU":
        return getCpuScore(build.cpu);
      case "GPU":
        return getGpuScore(build.gpu);
      case "RAM":
        return getRamScore(build.ram);
      case "SSD":
        return getStorageScore(build.storage);
      case "PSU":
        return getPsuScore(build.psu);
      default:
        return 0;
    }
  };

  const getBuildScore = (build) => {
    if (!build) return 0;
    const vals = metrics.map((m) => metricScore(build, m));
    return Math.round(vals.reduce((a, b) => a + b, 0) / metrics.length);
  };

  /* ── Radar ── */
  const getRadarPoints = (build) => {
    const cx = 130,
      cy = 130,
      r = 100;
    const step = (Math.PI * 2) / metrics.length;
    return metrics
      .map((m, i) => {
        const score = build ? metricScore(build, m) : 0;
        const norm = (score / 100) * r;
        const angle = -Math.PI / 2 + step * i;
        return `${cx + Math.cos(angle) * norm},${cy + Math.sin(angle) * norm}`;
      })
      .join(" ");
  };

  const getRadarLabels = () => {
    const cx = 130,
      cy = 130,
      r = 122;
    const step = (Math.PI * 2) / metrics.length;
    return metrics.map((m, i) => {
      const angle = -Math.PI / 2 + step * i;
      return {
        metric: m,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      };
    });
  };

  /* ── Compatibility ── */
  const checkAllCompatibility = () => {
    const issues = [];
    if (currentBuild?.cpu && currentBuild?.motherboard) {
      const res = checkCompatibility(
        { cpu: currentBuild.cpu },
        { ...currentBuild.motherboard, category: "motherboard" }
      );
      if (!res.compatible)
        issues.push({
          components: ["CPU", "Motherboard"],
          issue: res.reason,
          tip: res.tip,
        });
    }
    return issues;
  };

  /* ── Power estimate ── */
  const estimateWattage = () => {
    const cpu = currentBuild?.cpu;
    const gpu = currentBuild?.gpu;
    const cpuW = cpu?.tdp || 65;
    const gpuW = gpu?.power_required || 0;
    return cpuW + gpuW + 60; // +60 for rest of system
  };

  const compatibilityIssues = checkAllCompatibility();
  const totalPrice = selectedComponents.reduce(
    (s, c) => s + parsePrice(c.price),
    0
  );
  const currentScore = getBuildScore(currentBuild);
  const savedScore = getBuildScore(savedBuild);
  const radarLabels = getRadarLabels();
  const currentPoints = getRadarPoints(currentBuild);
  const savedPoints = hasSavedBuild ? getRadarPoints(savedBuild) : "";
  const estWattage = estimateWattage();

  const handleSave = (slot) => {
    saveBuildSnapshot(slot);
    setSelectedSaveSlot(slot);
    setCompareMode(true);
    setSaveMessage(`Saved to Slot ${slot + 1}`);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  /* ── Status badge ── */
  const StatusBadge = ({ ok }) =>
    ok ? (
      <span className="status-badge status-ready">● READY</span>
    ) : (
      <span className="status-badge status-issue">● ISSUE</span>
    );

  return (
    <div className="compat-page">
      {/* Decorative bg elements */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow bg-glow-1" aria-hidden="true" />
      <div className="bg-glow bg-glow-2" aria-hidden="true" />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-icon-wrap" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1>
          Real-Time <span className="accent">Compatibility</span> Check
        </h1>
        <p>
          Every component is instantly verified against your existing choices.
        </p>
      </section>

      {/* ── Empty State ── */}
      {selectedComponents.length === 0 && (
        <div className="empty-wrap">
          <div className="empty-card">
            <div className="empty-icon">🛡️</div>
            <h3>No Components Selected Yet</h3>
            <p>Head to the Component Picker and start building your rig.</p>
            <Link to="/build" className="btn-primary">
              ⚙ Go to Component Picker
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      {selectedComponents.length > 0 && (
        <div className="main-layout">
          {/* ════ LEFT PANEL ════ */}
          <div className="left-panel">
            {/* Components List */}
            <div className="panel-card">
              <div className="panel-header">
                <h3 className="panel-title">
                  <span className="panel-title-icon">◈</span>
                  Your Selected Components
                </h3>
                <span className="parts-count">
                  {selectedComponents.length} parts
                </span>
              </div>

              <div className="components-list">
                {selectedComponents.map((comp, i) => {
                  const isOk = !compatibilityIssues.some((iss) =>
                    iss.components.some(
                      (c) => c.toLowerCase() === comp.category.toLowerCase()
                    )
                  );
                  return (
                    <div key={i} className="comp-item">
                      <div className="comp-header">
                        <span className="comp-cat">
                          {comp.category.toUpperCase()}
                        </span>
                        <StatusBadge ok={isOk} />
                        <span className="comp-price">{comp.price}</span>
                      </div>
                      <div className="comp-body">
                        <div className="comp-img-wrap">
                          <img
                            src={comp.img}
                            alt={comp.name}
                            className="comp-img"
                          />
                        </div>
                        <div className="comp-info">
                          <h4>
                            {comp.brand} {comp.name}
                          </h4>
                          <p>{comp.desc}</p>
                          <div className="comp-tags">
                            {Array.isArray(comp.tags) &&
                              comp.tags.map((tag, j) => (
                                <span key={j} className="tag">
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="total-row">
                <span>Total Estimated Cost</span>
                <strong>₱{totalPrice.toLocaleString()}</strong>
              </div>
            </div>

            {/* Bottleneck / Compatibility */}
            {compatibilityIssues.length > 0 && !bottleneckDismissed ? (
              <div className="bottleneck-card">
                <div className="bottleneck-header">
                  <span className="bottleneck-title">
                    ⚡ BOTTLENECK ANALYSIS
                  </span>
                  <button
                    className="dismiss-btn"
                    onClick={() => setBottleneckDismissed(true)}
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
                {compatibilityIssues.map((iss, i) => (
                  <div key={i} className="bottleneck-body">
                    <div className="bottleneck-alert">
                      <span className="alert-label">
                        {iss.components.join(" Bottleneck Detected")} —
                      </span>
                      <p className="alert-desc">{iss.issue}</p>
                      {iss.tip && <p className="alert-tip">💡 {iss.tip}</p>}
                    </div>
                  </div>
                ))}
                <div className="bottleneck-actions">
                  <Link to="/build" className="fix-btn">
                    🔧 Fix Compatibility Issues
                  </Link>
                </div>
              </div>
            ) : compatibilityIssues.length === 0 ? (
              <div className="success-card">
                <span className="success-check">✅</span>
                <div>
                  <h3>All Components Are Compatible!</h3>
                  <p>All your selected components work together perfectly.</p>
                </div>
                <Link to="/build" className="btn-outline">
                  ➕ Add More
                </Link>
              </div>
            ) : null}

            {/* Feature Cards */}
            <div className="features-row">
              {[
                {
                  icon: "⚙",
                  title: "Socket Matching",
                  desc: "Verifies that the CPU socket type matches the motherboard socket.",
                },
                {
                  icon: "💾",
                  title: "RAM Compatibility",
                  desc: "Checks that RAM type and speed match the motherboard specification.",
                },
                {
                  icon: "⚡",
                  title: "Power Requirements",
                  desc: "Calculates total system power draw and verifies PSU wattage.",
                },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div className="right-panel">
            {/* Radar */}
            <div className="sidebar-card">
              <div className="sidebar-label">PERFORMANCE LAB</div>
              <div className="sidebar-title">System Synergy</div>

              <div className="radar-wrap">
                <svg className="radar-svg" viewBox="-20 -20 300 300">
                  {[100, 75, 50, 25].map((r, i) => (
                    <circle
                      key={i}
                      cx="130"
                      cy="130"
                      r={r}
                      className="radar-ring"
                    />
                  ))}
                  {metrics.map((_, i) => {
                    const angle =
                      -Math.PI / 2 + ((Math.PI * 2) / metrics.length) * i;
                    return (
                      <line
                        key={i}
                        x1="130"
                        y1="130"
                        x2={130 + Math.cos(angle) * 100}
                        y2={130 + Math.sin(angle) * 100}
                        className="radar-axis"
                      />
                    );
                  })}
                  {savedPoints && (
                    <polygon
                      points={savedPoints}
                      className="radar-poly radar-saved"
                    />
                  )}
                  <polygon
                    points={currentPoints}
                    className="radar-poly radar-current"
                  />
                  {radarLabels.map(({ metric, x, y }) => (
                    <text
                      key={metric}
                      x={x}
                      y={y}
                      className="radar-label"
                      dominantBaseline="middle"
                    >
                      {metric}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="radar-legend">
                <div className="legend-pill">
                  <span className="legend-dot dot-current" />
                  Current <strong>{currentScore}</strong>
                </div>
                {hasSavedBuild && (
                  <div className="legend-pill">
                    <span className="legend-dot dot-saved" />
                    Saved <strong>{savedScore}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Active Comparisons */}
            <div className="sidebar-card">
              <div className="sidebar-label">ACTIVE COMPARISONS</div>
              <div className="sidebar-title">Current vs Saved</div>

              <div className="score-vs-row">
                <div className="score-box">
                  <div className="score-lbl">Current Build</div>
                  <div className="score-num">{currentScore}</div>
                  <div className="score-sub">Score</div>
                </div>
                <div className="score-vs">vs</div>
                <div className="score-box">
                  <div className="score-lbl">Saved Build</div>
                  <div className="score-num score-num-saved">
                    {hasSavedBuild ? savedScore : "—"}
                  </div>
                  <div className="score-sub">Score</div>
                </div>
              </div>

              {/* Save Slots */}
              <div className="slots-list">
                {[0, 1].map((slot) => {
                  const sb = getSavedBuild(slot);
                  const count = sb
                    ? Object.values(sb).filter(Boolean).length
                    : 0;
                  const price = sb
                    ? Object.values(sb)
                        .filter(Boolean)
                        .reduce((s, c) => s + parsePrice(c.price), 0)
                    : 0;
                  const isSelected = selectedSaveSlot === slot;
                  return (
                    <div
                      key={slot}
                      className={`slot-card ${
                        isSelected ? "slot-selected" : ""
                      } ${sb ? "slot-filled" : ""}`}
                      onClick={() =>
                        sb && (setSelectedSaveSlot(slot), setCompareMode(true))
                      }
                    >
                      <div className="slot-top-row">
                        <div className="slot-info">
                          <span className="slot-name">Slot {slot + 1}</span>
                          {sb && <span className="slot-check">✓</span>}
                        </div>
                        <div className="slot-meta">
                          {sb ? (
                            <>
                              <span className="slot-parts">{count} parts</span>
                              <span className="slot-price">
                                ₱{price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="slot-empty">Empty</span>
                          )}
                        </div>
                      </div>
                      <div className="slot-btn-row">
                        <button
                          className="save-slot-btn save-slot-btn--save"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(slot);
                          }}
                        >
                          Save to Slot {slot + 1}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {saveMessage && <div className="save-toast">{saveMessage}</div>}

              {hasSavedBuild && (
                <button
                  className="compare-toggle"
                  onClick={() => setCompareMode(!compareMode)}
                >
                  {compareMode ? "Hide Comparison" : "Compare Slot 1 vs Slot 2"}
                </button>
              )}

              {compareMode && hasSavedBuild && (
                <div className="compare-diff">
                  <div className="compare-diff-header">
                    <h4>Comparing Slot 1 vs Slot {selectedSaveSlot + 1}</h4>
                  </div>
                  <div className="diff-grid">
                    <div className="diff-col">
                      <div className="diff-head">Current</div>
                      {selectedComponents.map((c, i) => (
                        <div key={i} className="diff-item">
                          {c.name}
                        </div>
                      ))}
                    </div>
                    <div className="diff-col">
                      <div className="diff-head">
                        Slot {selectedSaveSlot + 1}
                      </div>
                      {savedComponents.map((c, i) => (
                        <div key={i} className="diff-item">
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Power Summary */}
            <div className="sidebar-card summary-card">
              <div className="sidebar-label">
                REAL-TIME PRICE & POWER SUMMARY
              </div>
              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-lbl">TOTAL COST</span>
                  <span className="summary-val summary-price">
                    ₱{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-lbl">EST. WATTAGE</span>
                  <span className="summary-val summary-watt">
                    EST. {estWattage}W
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-lbl">SYSTEM SCORE</span>
                  <div className="score-badge-wrap">
                    <span className="system-score">{currentScore}.0</span>
                    <span className="score-max">/ 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
