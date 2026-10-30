"use client";

import { useEffect, useRef } from "react";

type Gizmo = {
  _id: string;
  title: string;
  url: string;
  videoUrl: string;
  posterUrl?: string;
  hasBorder?: boolean;
};

// Touch events count as a user gesture on iOS, so a play() started inside one is
// allowed even when autoplay is blocked (e.g. Low Power Mode).
const GESTURE_EVENTS = ["touchstart", "touchend", "pointerdown", "click"] as const;

export default function GizmoRow({ gizmos }: { gizmos: Gizmo[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const videos = Array.from(row.querySelectorAll("video"));
    const visible = new Set<HTMLVideoElement>();
    const unlocked = new Set<HTMLVideoElement>();
    let blocked = false;

    // Play only while on screen. If autoplay is blocked, play() rejects and the
    // poster stays up as a still thumbnail until the first touch on the row.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            visible.add(video);
            video.play().catch(() => {
              blocked = true;
            });
          } else {
            visible.delete(video);
            video.pause();
          }
        }
      },
      { threshold: 0.25 }
    );

    // On the first touch, play every video inside the gesture. iOS then lets the
    // page control each one freely, so off-screen ones are paused right away and
    // the observer above can start them as they scroll into view.
    const unlock = () => {
      if (!blocked) return;
      for (const video of videos) {
        if (unlocked.has(video)) continue;
        video
          .play()
          .then(() => {
            unlocked.add(video);
            if (!visible.has(video)) video.pause();
            if (unlocked.size === videos.length) removeListeners();
          })
          .catch(() => {});
      }
    };
    const removeListeners = () => {
      for (const type of GESTURE_EVENTS) row.removeEventListener(type, unlock);
    };

    for (const video of videos) {
      video.muted = true; // React doesn't always reflect the muted prop; iOS requires it for play()
      observer.observe(video);
    }
    for (const type of GESTURE_EVENTS) row.addEventListener(type, unlock, { passive: true });

    return () => {
      observer.disconnect();
      removeListeners();
    };
  }, [gizmos]);

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
      <div className="gizmo-row" ref={rowRef}>
        {gizmos.map((gizmo) => (
          <a
            key={gizmo._id}
            href={gizmo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={gizmo.hasBorder ? "gizmo-card gizmo-card-bordered" : "gizmo-card"}
            title={gizmo.title}
          >
            <video
              src={gizmo.videoUrl}
              poster={gizmo.posterUrl}
              loop
              muted
              playsInline
              preload="none"
              aria-label={gizmo.title}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
