"use client";

import { useEffect, useRef } from "react";

type Gizmo = {
  _id: string;
  title: string;
  url: string;
  videoUrl: string;
  posterUrl?: string;
};

function GizmoVideo({ gizmo }: { gizmo: Gizmo }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Play only while on screen. If the browser blocks autoplay (e.g. iOS Low
  // Power Mode), play() rejects and the poster stays up as a still thumbnail.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // React doesn't always reflect the muted prop; iOS requires it for play()
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={gizmo.videoUrl}
      poster={gizmo.posterUrl}
      loop
      muted
      playsInline
      preload="none"
      aria-label={gizmo.title}
    />
  );
}

export default function GizmoRow({ gizmos }: { gizmos: Gizmo[] }) {
  if (!gizmos.length) return null;

  return (
    <section className="gizmo-section">
      <div className="photo-scroller-header">
        <h2>
          <a href="https://www.madewithpocket.com/trudy" target="_blank" rel="noopener noreferrer">
            My gizmos on Pocket ↗
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
            <GizmoVideo gizmo={gizmo} />
          </a>
        ))}
      </div>
    </section>
  );
}
