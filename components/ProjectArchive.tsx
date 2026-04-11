"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  slug: string;
  projectLocation?: string;
  projectYear?: string;
};

type YearGroup = {
  year: string;
  projects: Project[];
};

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasRun.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function ProjectArchive({
  yearGroups,
  totalCount,
}: {
  yearGroups: YearGroup[];
  totalCount: number;
}) {
  const [open, setOpen] = useState(false);
  const { count, ref } = useCountUp(totalCount);

  return (
    <section className="archive-section" ref={ref}>
      <div className="archive-dots">
        {Array.from({ length: totalCount }).map((_, i) => (
          <span
            key={i}
            className="archive-dot"
            style={{
              animationDelay: `${(i / totalCount) * 800}ms`,
            }}
          />
        ))}
      </div>
      <button
        className="archive-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className={`archive-chevron ${open ? "open" : ""}`}>&#x25B8;</span>
        <span>See my {count} project archive</span>
      </button>
      <div className={`archive-content ${open ? "open" : ""}`}>
        <div className={`archive-inner ${open ? "open" : ""}`}>
          {yearGroups.map(({ year, projects }, gi) => (
            <div
              key={year}
              className="year-group archive-fade"
              style={{ transitionDelay: open ? `${gi * 80}ms` : "0ms" }}
            >
              <h2>{year}</h2>
              <ul className="project-list">
                {projects.map((project) => (
                  <li key={project._id}>
                    <Link href={`/posts/${project.slug}`}>{project.title}</Link>
                    {project.projectLocation && (
                      <span className="year-label">{project.projectLocation}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
