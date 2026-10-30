import { client } from "@/sanity/client";
import { allProjectsQuery, gizmosQuery } from "@/sanity/queries";
import ProjectArchive from "@/components/ProjectArchive";
import GizmoRow from "@/components/GizmoRow";

// Re-fetch from Sanity at most once a minute so content edits go live without a redeploy.
export const revalidate = 60;

type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  projectLocation?: string;
  projectYear?: string;
  projectMonth?: string;
  projectTags?: { _id: string; name: string; slug: string }[];
};

export default async function Home() {
  const [projects, gizmos] = await Promise.all([
    client.fetch<Project[]>(allProjectsQuery),
    client.fetch(gizmosQuery),
  ]);

  // Derive month from date
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const enriched = projects.map((p) => {
    let month = "";
    if (p.date) {
      const d = new Date(p.date);
      if (!isNaN(d.getTime())) month = MONTHS[d.getMonth()];
    }
    return { ...p, projectMonth: month };
  });

  // Group projects by year
  const byYear: Record<string, Project[]> = {};
  for (const project of enriched) {
    const year = project.projectYear || "Other";
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(project);
  }

  const sortedYears = Object.keys(byYear).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return parseInt(b) - parseInt(a);
  });

  return (
    <>
      {/* Hidden first image to override iMessage/crawler auto-selection */}
      <img src="/og-blank.png" alt="" width={1} height={1} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />

      <p className="home-tagline">Trudy is working on <a href="https://apps.apple.com/app/id6761221765" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Pocket</a>, a new creative platform for making gizmos.</p>

      <GizmoRow gizmos={gizmos} />

      <ProjectArchive
        yearGroups={sortedYears.map((year) => ({
          year,
          projects: byYear[year],
        }))}
        totalCount={projects.length}
      />
    </>
  );
}
