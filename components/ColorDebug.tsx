"use client";

import { useState, useEffect } from "react";

type Palette = Record<string, string>;
type TypeSettings = Record<string, number>;

// ── Color presets ──

const COLOR_PRESETS: { name: string; colors: Palette }[] = [
  {
    name: "navy",
    colors: {
      "--color-text": "#1a1a3e",
      "--color-link": "#2d2d5e",
      "--color-muted": "#6e6e8a",
      "--color-border": "#d0d0d8",
      "--color-border-heavy": "#1a1a3e",
      "--color-bg": "#ffffff",
    },
  },
  {
    name: "graphite",
    colors: {
      "--color-text": "#222222",
      "--color-link": "#444444",
      "--color-muted": "#888888",
      "--color-border": "#d4d4d4",
      "--color-border-heavy": "#222222",
      "--color-bg": "#ffffff",
    },
  },
  {
    name: "ink",
    colors: {
      "--color-text": "#000000",
      "--color-link": "#1a1a1a",
      "--color-muted": "#777777",
      "--color-border": "#cccccc",
      "--color-border-heavy": "#000000",
      "--color-bg": "#ffffff",
    },
  },
  {
    name: "concrete",
    colors: {
      "--color-text": "#1a1a1a",
      "--color-link": "#333333",
      "--color-muted": "#808080",
      "--color-border": "#c8c8c8",
      "--color-border-heavy": "#1a1a1a",
      "--color-bg": "#f0f0f0",
    },
  },
  {
    name: "slab",
    colors: {
      "--color-text": "#1c1c24",
      "--color-link": "#3a3a48",
      "--color-muted": "#7a7a88",
      "--color-border": "#c0c0c8",
      "--color-border-heavy": "#1c1c24",
      "--color-bg": "#e4e4ea",
    },
  },
  {
    name: "pearl",
    colors: {
      "--color-text": "#2a2a3a",
      "--color-link": "#40405a",
      "--color-muted": "#8a8a9a",
      "--color-border": "#dddde4",
      "--color-border-heavy": "#2a2a3a",
      "--color-bg": "#fafafc",
    },
  },
  {
    name: "slate",
    colors: {
      "--color-text": "#1e2a32",
      "--color-link": "#344450",
      "--color-muted": "#708090",
      "--color-border": "#c4ccd2",
      "--color-border-heavy": "#1e2a32",
      "--color-bg": "#f4f6f8",
    },
  },
  {
    name: "steel",
    colors: {
      "--color-text": "#20202e",
      "--color-link": "#38384a",
      "--color-muted": "#78788a",
      "--color-border": "#c8c8d4",
      "--color-border-heavy": "#20202e",
      "--color-bg": "#eeeef4",
    },
  },
];

// ── Typography presets ──

const TYPE_PRESETS: { name: string; values: TypeSettings }[] = [
  {
    name: "default",
    values: { size: 14, weight: 400, lineHeight: 1.35, letterSpacing: -0.01, stretch: 0.98 },
  },
  {
    name: "tight",
    values: { size: 14, weight: 400, lineHeight: 1.35, letterSpacing: -0.01, stretch: 1 },
  },
  {
    name: "airy",
    values: { size: 15, weight: 300, lineHeight: 1.75, letterSpacing: 0.02, stretch: 1 },
  },
  {
    name: "dense",
    values: { size: 13, weight: 450, lineHeight: 1.4, letterSpacing: -0.005, stretch: 1 },
  },
  {
    name: "wide",
    values: { size: 15, weight: 400, lineHeight: 1.55, letterSpacing: 0.04, stretch: 1.1 },
  },
  {
    name: "narrow",
    values: { size: 15, weight: 400, lineHeight: 1.5, letterSpacing: -0.01, stretch: 0.87 },
  },
  {
    name: "heavy",
    values: { size: 14, weight: 600, lineHeight: 1.45, letterSpacing: 0.005, stretch: 1 },
  },
  {
    name: "thin",
    values: { size: 16, weight: 300, lineHeight: 1.6, letterSpacing: 0.01, stretch: 1 },
  },
];

const TYPE_DEFAULTS = TYPE_PRESETS[0].values;

// ── Slider config ──

const SLIDERS: { key: string; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: "size", label: "size", min: 10, max: 24, step: 0.5, unit: "px" },
  { key: "weight", label: "weight", min: 100, max: 900, step: 10, unit: "" },
  { key: "lineHeight", label: "leading", min: 1, max: 2.2, step: 0.05, unit: "" },
  { key: "letterSpacing", label: "tracking", min: -0.05, max: 0.1, step: 0.001, unit: "em" },
  { key: "stretch", label: "stretch", min: 0.7, max: 1.3, step: 0.01, unit: "" },
];

const COLOR_LABELS: Record<string, string> = {
  "--color-text": "text",
  "--color-link": "link",
  "--color-muted": "muted",
  "--color-border": "border",
  "--color-border-heavy": "border-heavy",
  "--color-bg": "bg",
};

const COLOR_STORAGE_KEY = "color-debug";
const TYPE_STORAGE_KEY = "type-debug";

function applyColors(colors: Palette) {
  Object.entries(colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

function applyType(values: TypeSettings) {
  const el = document.documentElement.style;
  el.setProperty("--type-size", values.size + "px");
  el.setProperty("--type-weight", String(values.weight));
  el.setProperty("--type-line-height", String(values.lineHeight));
  el.setProperty("--type-letter-spacing", values.letterSpacing + "em");
  el.setProperty("--type-stretch", String(values.stretch));
}

export default function ColorDebug() {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState(COLOR_PRESETS[1].colors);
  const [activeColorPreset, setActiveColorPreset] = useState<string | null>("graphite");
  const [typeValues, setTypeValues] = useState(TYPE_DEFAULTS);
  const [activeTypePreset, setActiveTypePreset] = useState<string | null>("default");

  useEffect(() => {
    const savedColors = localStorage.getItem(COLOR_STORAGE_KEY);
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setColors(parsed);
        applyColors(parsed);
        const match = COLOR_PRESETS.find(
          (p) => Object.entries(p.colors).every(([k, v]) => parsed[k] === v)
        );
        setActiveColorPreset(match ? match.name : null);
      } catch {}
    }

    const savedType = localStorage.getItem(TYPE_STORAGE_KEY);
    if (savedType) {
      try {
        const parsed = JSON.parse(savedType);
        setTypeValues(parsed);
        applyType(parsed);
        const match = TYPE_PRESETS.find(
          (p) => Object.entries(p.values).every(([k, v]) => parsed[k] === v)
        );
        setActiveTypePreset(match ? match.name : null);
      } catch {}
    }
  }, []);

  // ── Color handlers ──

  function updateColor(key: string, value: string) {
    const next = { ...colors, [key]: value };
    setColors(next);
    document.documentElement.style.setProperty(key, value);
    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(next));
    const match = COLOR_PRESETS.find(
      (p) => Object.entries(p.colors).every(([k, v]) => next[k] === v)
    );
    setActiveColorPreset(match ? match.name : null);
  }

  function selectColorPreset(preset: typeof COLOR_PRESETS[number]) {
    setColors(preset.colors);
    setActiveColorPreset(preset.name);
    applyColors(preset.colors);
    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(preset.colors));
  }

  // ── Type handlers ──

  function updateType(key: string, value: number) {
    const next = { ...typeValues, [key]: value };
    setTypeValues(next);
    applyType(next);
    localStorage.setItem(TYPE_STORAGE_KEY, JSON.stringify(next));
    const match = TYPE_PRESETS.find(
      (p) => Object.entries(p.values).every(([k, v]) => next[k] === v)
    );
    setActiveTypePreset(match ? match.name : null);
  }

  function selectTypePreset(preset: typeof TYPE_PRESETS[number]) {
    setTypeValues(preset.values);
    setActiveTypePreset(preset.name);
    applyType(preset.values);
    localStorage.setItem(TYPE_STORAGE_KEY, JSON.stringify(preset.values));
  }

  // ── Reset all ──

  function resetAll() {
    selectColorPreset(COLOR_PRESETS[1]);
    selectTypePreset(TYPE_PRESETS[0]);
  }

  const panelStyle: React.CSSProperties = {
    marginTop: 6,
    background: "#fff",
    border: "1px solid #d0d0d8",
    borderRadius: 6,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    width: 240,
    maxHeight: "calc(100vh - 60px)",
    overflowY: "auto",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 600,
    color: "#6e6e8a",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 4,
  };

  const presetBtn = (active: boolean): React.CSSProperties => ({
    background: active ? "#1a1a3e" : "none",
    color: active ? "#fff" : "#1a1a3e",
    border: "1px solid #1a1a3e",
    borderRadius: 3,
    padding: "2px 7px",
    cursor: "pointer",
    fontSize: 10,
    fontFamily: "inherit",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 9999,
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "block",
          marginLeft: "auto",
          background: open ? "#1a1a3e" : "#fff",
          color: open ? "#fff" : "#1a1a3e",
          border: "1px solid #1a1a3e",
          borderRadius: 4,
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: 11,
          fontFamily: "inherit",
        }}
      >
        debug
      </button>

      {open && (
        <div style={panelStyle}>
          {/* ── Colors ── */}
          <div style={sectionLabel}>colors</div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => selectColorPreset(preset)}
                style={{
                  ...presetBtn(activeColorPreset === preset.name),
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ display: "inline-flex", gap: 1 }}>
                  {[
                    preset.colors["--color-bg"],
                    preset.colors["--color-border"],
                    preset.colors["--color-muted"],
                    preset.colors["--color-text"],
                  ].map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: c,
                        border: "1px solid rgba(0,0,0,0.15)",
                      }}
                    />
                  ))}
                </span>
                {preset.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.keys(COLOR_PRESETS[0].colors).map((key) => (
              <label
                key={key}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  style={{
                    width: 20,
                    height: 20,
                    border: "1px solid #d0d0d8",
                    borderRadius: 3,
                    padding: 0,
                    cursor: "pointer",
                    background: "none",
                  }}
                />
                <span style={{ color: "#1a1a3e" }}>{COLOR_LABELS[key]}</span>
                <span style={{ color: "#6e6e8a", marginLeft: "auto", fontSize: 10 }}>
                  {colors[key]}
                </span>
              </label>
            ))}
          </div>

          {/* ── Typography ── */}
          <div style={{ ...sectionLabel, marginTop: 4 }}>type</div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {TYPE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => selectTypePreset(preset)}
                style={presetBtn(activeTypePreset === preset.name)}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SLIDERS.map((s) => (
              <div key={s.key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                    color: "#1a1a3e",
                  }}
                >
                  <span>{s.label}</span>
                  <span style={{ color: "#6e6e8a", fontSize: 10 }}>
                    {s.step < 1
                      ? typeValues[s.key].toFixed(s.step < 0.01 ? 3 : 2)
                      : typeValues[s.key]}
                    {s.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={typeValues[s.key]}
                  onChange={(e) => updateType(s.key, parseFloat(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>
            ))}
          </div>

          {/* ── Reset ── */}
          <button
            onClick={resetAll}
            style={{
              marginTop: 2,
              background: "none",
              border: "1px solid #d0d0d8",
              borderRadius: 4,
              padding: "3px 8px",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              color: "#6e6e8a",
            }}
          >
            reset all
          </button>
        </div>
      )}
    </div>
  );
}
