"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  slug: string;
  projectLocation?: string;
  projectYear?: string;
  projectMonth?: string;
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
  const [hovered, setHovered] = useState<number | null>(null);
  const { count, ref } = useCountUp(totalCount);

  // Flatten to get a global index for each project
  const allProjects = yearGroups.flatMap((yg) => yg.projects);

  // Build a map from project _id to flat index
  const idToIndex: Record<string, number> = {};
  allProjects.forEach((p, i) => {
    idToIndex[p._id] = i;
  });

  return (
    <section className="archive-section" ref={ref}>
      <div className="archive-dots">
        {allProjects.map((project, i) => (
          <span
            key={project._id}
            className={`archive-dot${hovered === i ? " archive-dot-active" : ""}`}
            style={{
              animationDelay: `${(i / totalCount) * 800}ms`,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
      <div className="archive-toggle">
        <span>MY {count} PROJECT ARCHIVE</span>
      </div>
      <div className="archive-content open">
        <div className="archive-inner open">
          <table className="archive-table archive-fade" style={{ transitionDelay: "60ms" }}>
            <tbody>
              {yearGroups.map(({ year, projects }, gi) =>
                projects.map((project, ri) => {
                  const isLast = ri === projects.length - 1;
                  const isYearStart = ri === 0 && gi > 0;
                  const flatIndex = idToIndex[project._id];
                  const isHighlighted = hovered === flatIndex;
                  return (
                    <tr
                      className={`archive-row${isLast ? " archive-row-year-end" : ""}${isYearStart ? " archive-row-year-start" : ""}${isHighlighted ? " archive-row-highlighted" : ""}`}
                      key={project._id}
                      onMouseEnter={() => setHovered(flatIndex)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {ri === 0 && (
                        <td className="archive-cell-year" rowSpan={projects.length}>
                          {year}
                        </td>
                      )}
                      <td className="archive-cell-title">
                        <Link href={`/posts/${project.slug}`}>{project.title}</Link>
                      </td>
                      <td className="archive-cell-location">
                        {project.projectLocation || ""}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
