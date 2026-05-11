import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBuild } from "../../contexts/BuildContext";
import { checkCompatibility } from "../../utilities/rules";
import "./Compatibility.css";

/* Siguraduhin na ang Link ay may display properties */
const saveSlotBtnStyle = {
  display: "block",
  width: "100%",
  marginTop: "8px",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  border: "none",
  padding: "10px 16px",
  borderRadius: "var(--r-sm)",
  borderRadius: "var(--r-sm)",
  fontFamily: "var(--font-display)",
  fontSize: "19px",
  fontWeight: "700",
  letterSpacing: "0.06em",
  cursor: "pointer",
  transition: "background 0.18s, color 0.18s",
};

export default function Compatibility() {
  const {
    currentBuild,
    getSelectedComponents,
    savedBuilds,
    selectedSaveSlot,
    setSelectedSaveSlot,
    getSavedBuild: originalGetSavedBuild,
    saveBuildSnapshot,
    resetBuild,
  } = useBuild();

  const getSavedBuild = (slot) => {
    const b = savedBuilds[slot];
    if (!b) return null;
    return b;
  };

  const calculateBuildPrice = (build) => {
    if (!build) return 0;
    return Object.values(build).reduce((s, c) => {
      if (!c || !c.price) return s;
      return s + parsePrice(c.price);
    }, 0);
  };

  const selectedComponents = getSelectedComponents().sort((a, b) => {
    const order = ["cpu", "motherboard", "ram", "storage", "gpu", "psu", "case"];
    return order.indexOf(a.category.toLowerCase()) - order.indexOf(b.category.toLowerCase());
  });
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
  const estimateWattage = (build = currentBuild) => {
    const cpu = build?.cpu;
    const gpu = build?.gpu;
    const cpuW = cpu?.tdp || 65;
    const gpuW = gpu?.power_required || 0;
    return cpuW + gpuW + 60; // +60 for rest of system
  };

  const compatibilityIssues = checkAllCompatibility();
  const totalPrice = selectedComponents.reduce(
    (s, c) => s + parsePrice(c.price),
    0
  );

  const slot1Build = getSavedBuild(0);
  const slot2Build = getSavedBuild(1);
  const slot1Price = calculateBuildPrice(slot1Build);
  const slot2Price = calculateBuildPrice(slot2Build);

  const currentScore = getBuildScore(currentBuild);
  const savedScore = getBuildScore(savedBuild);
  const radarLabels = getRadarLabels();
  const currentPoints = getRadarPoints(currentBuild);
  const savedPoints = hasSavedBuild ? getRadarPoints(savedBuild) : "";
  const estWattage = estimateWattage(currentBuild);
  const savedWattage = estimateWattage(savedBuild);

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
                    BOTTLENECK ANALYSIS
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
                    </div>
                  </div>
                ))}
                <div className="bottleneck-actions">
                  <Link to="/build" className="fix-btn">
                    Fix Compatibility Issues
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
                  title: "Socket Matching",
                  desc: "Verifies that the CPU socket type matches the motherboard socket.",
                },
                {
                  title: "RAM Compatibility",
                  desc: "Checks that RAM type and speed match the motherboard specification.",
                },
                {
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
              <div className="sidebar-title" style={{ textAlign: "center" }}>Current vs Saved</div>

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
                  const isSelected = selectedSaveSlot === slot;
                  const price = slot === 0 ? slot1Price : slot2Price;

                  return (
                    <div
                      key={slot}
                      className={`slot-card ${isSelected ? "slot-selected" : ""
                        } ${sb ? "slot-filled" : ""}`}
                    >
                      <div className="slot-top-row">
                        <span className="slot-name">BUILD {slot + 1}</span>
                        {sb ? (
                          <span className="slot-parts">{count} parts</span>
                        ) : (
                          <span className="slot-empty">Empty</span>
                        )}
                      </div>
                      {sb && (
                        <div className="slot-price">
                          Total: ₱{price.toLocaleString()}
                        </div>
                      )}
                      <div className="slot-btn-row">
                        {!sb ? (
                          <Link
                            to="/build"
                            className="save-slot-btn save-slot-btn--save"
                            style={{
                              ...saveSlotBtnStyle,
                              margin: 0,
                              textAlign: "center",
                            }}
                            onClick={() => {
                              setSelectedSaveSlot(slot);
                              resetBuild();
                            }}
                          >
                            + Build Another PC
                          </Link>
                        ) : (
                          <>
                            <button
                              className="save-slot-btn save-slot-btn--save"
                              style={saveSlotBtnStyle}
                              onClick={() => handleSave(slot)}
                            >
                              Save Current
                            </button>
                            <Link
                              to="/build"
                              className="save-slot-btn save-slot-btn--compare"
                              style={{
                                ...saveSlotBtnStyle,
                                display: "block",
                                textAlign: "center",
                                boxSizing: "border-box",
                              }}
                              onClick={() => {
                                setSelectedSaveSlot(slot);
                                resetBuild();
                              }}
                            >
                              BUILD NEW PC
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Section */}
              {getSavedBuild(0) && getSavedBuild(1) && (
                <div className="compare-diff">
                  <div className="diff-title">
                    Builds Comparison
                  </div>
                  <div className="diff-grid">
                    <div className="diff-col">
                      <div className="diff-head">Build 1</div>
                      {Object.entries(getSavedBuild(0))
                        .filter(([, v]) => v)
                        .map(([cat, comp], i) => (
                          <div key={i} className="diff-item">
                            {comp.name}
                          </div>
                        ))}
                    </div>
                    <div className="diff-col">
                      <div className="diff-head">Build 2</div>
                      {Object.entries(getSavedBuild(1))
                        .filter(([, v]) => v)
                        .map(([cat, comp], i) => (
                          <div key={i} className="diff-item">
                            {comp.name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {saveMessage && <div className="save-toast">{saveMessage}</div>}
            </div>

            {/* Price & Power Summary */}
            <div className="sidebar-card summary-card">
              <div className="sidebar-label">
                REAL-TIME PRICE & POWER SUMMARY
              </div>
              <div className="summary-grid">
                <div className="summary-col">
                  <div className="summary-row">
                    <span className="summary-lbl">CURRENT BUILD COST</span>
                    <span className="summary-val summary-price">
                      ₱{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-lbl">CURRENT WATTAGE</span>
                    <span className="summary-val summary-watt">
                      EST. {estWattage}W
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-lbl">CURRENT SCORE</span>
                    <div className="score-badge-wrap">
                      <span className="system-score">{currentScore}.0</span>
                      <span className="score-max">/ 100</span>
                    </div>
                  </div>
                </div>

                {hasSavedBuild && (
                  <>
                    <div className="summary-divider" />
                    <div className="summary-col">
                      <div className="summary-row">
                        <span className="summary-lbl">BUILD {selectedSaveSlot + 1} COST</span>
                        <span className="summary-val summary-price" style={{ color: "var(--amber)" }}>
                          ₱{(selectedSaveSlot === 0 ? slot1Price : slot2Price).toLocaleString()}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-lbl">BUILD {selectedSaveSlot + 1} WATTAGE</span>
                        <span className="summary-val summary-watt" style={{ color: "var(--amber)" }}>
                          EST. {savedWattage}W
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-lbl">BUILD {selectedSaveSlot + 1} SCORE</span>
                        <div className="score-badge-wrap">
                          <span className="system-score" style={{ color: "var(--amber)" }}>{savedScore}.0</span>
                          <span className="score-max">/ 100</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}