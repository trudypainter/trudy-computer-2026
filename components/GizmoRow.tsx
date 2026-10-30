type Gizmo = {
  _id: string;
  title: string;
  url: string;
  videoUrl: string;
};

export default function GizmoRow({ gizmos }: { gizmos: Gizmo[] }) {
  if (!gizmos.length) return null;

  return (
    <section className="gizmo-section">
      <div className="photo-scroller-header">
        <h2>
          <a href="https://www.madewithpocket.com/trudy" target="_blank" rel="noopener noreferrer">
            Gizmos on Pocket ↗
          </a>
        </h2>
      </div>
      <div className="gizmo-row">
        {gizmos.map((gizmo) => (
          <a
            key={gizmo._id}
            href={gizmo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gizmo-card"
            title={gizmo.title}
          >
            <video src={gizmo.videoUrl} autoPlay loop muted playsInline preload="metadata" aria-label={gizmo.title} />
          </a>
        ))}
      </div>
    </section>
  );
}
