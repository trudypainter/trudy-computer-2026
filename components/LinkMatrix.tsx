"use client";

const links = [
  { name: "Are.na", url: "https://www.are.na/trudy-painter", position: { top: "18%", left: "18%" } },
  { name: "Spotify", url: "https://open.spotify.com/user/trudypaintet?si=ZlW6diDKSl61x9oKhit5BA", position: { bottom: "22%", left: "22%" } },
  { name: "Github", url: "https://github.com/trudypainter", position: { top: "16%", right: "18%" } },
  { name: "HF", url: "https://huggingface.co/Trudy", position: { top: "38%", right: "22%" } },
  { name: "X/Twitter", url: "https://x.com/trudypainter", position: { top: "27%", right: "14%" } },
  { name: "Instagram", url: "https://www.instagram.com/bionicpinkytoe", position: { top: "32%", left: "16%" } },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/trudy-painter/", position: { bottom: "26%", right: "16%" } },
];

export default function LinkMatrix() {
  const linkStyle: React.CSSProperties = {
    color: "var(--color-link)",
    textDecoration: "none",
    cursor: "pointer",
    position: "absolute",
    fontSize: "var(--type-size)",
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    padding: "0 4px",
    backgroundColor: "var(--color-bg)",
    fontFamily: "var(--font-mono), ui-monospace, 'SF Mono', Monaco, 'Cascadia Mono', monospace",
    fontSize: "0.7em",
    color: "var(--color-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  return (
    <div className="link-matrix-container">
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        viewBox="0 0 250 250"
        fill="none"
      >
        <line x1="125" y1="0" x2="125" y2="250" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="0" y1="125" x2="250" y2="125" stroke="var(--color-border)" strokeWidth="1" />
      </svg>

      {links.map((link, i) => (
        <a
          key={i}
          style={{ ...linkStyle, ...link.position }}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseOver={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
          onMouseOut={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
        >
          {link.name}
        </a>
      ))}

      <div style={{ ...labelStyle, left: "2%", top: "48%" }}>Personal</div>
      <div style={{ ...labelStyle, right: "2%", top: "48%" }}>Professional</div>
      <div style={{ ...labelStyle, width: "100%", left: 0, textAlign: "center", top: "1%" }}>Essential</div>
      <div style={{ ...labelStyle, width: "100%", left: 0, textAlign: "center", bottom: "1%" }}>Peripheral</div>
    </div>
  );
}
