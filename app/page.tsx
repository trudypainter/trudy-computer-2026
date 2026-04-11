import { client } from "@/sanity/client";
import { allProjectsQuery } from "@/sanity/queries";
import PhotoScroller from "@/components/PhotoScroller";
import ProjectArchive from "@/components/ProjectArchive";

type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  projectLocation?: string;
  projectYear?: string;
  projectTags?: { _id: string; name: string; slug: string }[];
};

async function getArenaPhotos() {
  const token = process.env.ARENA_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      "https://api.are.na/v3/channels/photos-i-took-on-my-iphone/contents?per=20&sort=created_at_desc",
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || [])
      .filter((b: any) => b.type === "Image" && b.image)
      .map((b: any) => ({
        id: b.id,
        title: b.title,
        src: b.image.medium.src,
      }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const [projects, photos] = await Promise.all([
    client.fetch<Project[]>(allProjectsQuery),
    getArenaPhotos(),
  ]);

  // Group projects by year
  const byYear: Record<string, Project[]> = {};
  for (const project of projects) {
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
      <div className="about-content">
        <p>
          Hi, I&rsquo;m Trudy. I&rsquo;m a creative technologist in Brooklyn, NY.
          I care about making AI fun + approachable for everyone.
        </p>
        <p>
          I&rsquo;m currently working on <a href="https://gizmo.party" target="_blank" rel="noopener noreferrer">Gizmo</a>, a new iOS app + creative platform.
        </p>
        <p>
          Before that, I was at <a href="https://creativelab5.com/" target="_blank" rel="noopener noreferrer">Google Creative Lab</a>. I worked on everything from <a href="/posts/gemini-codraw">viral open source code</a> to <a href="/posts/mainstage-demos">mainstage research demos</a> to <a href="/posts/gemini-multimodal-launch">controversial launch videos</a> to <a href="/posts/google-short-form">TikToks with 10s of millions of views (lol)</a> to <a href="/posts/gentype">leading full product releases</a>.
        </p>
        <p>
          I studied <a href="https://www.eecs.mit.edu/research/computer-science/" target="_blank" rel="noopener noreferrer">computer science</a> and <a href="https://cmsw.mit.edu/about/" target="_blank" rel="noopener noreferrer">comparative media studies</a> at MIT. I also
          researched <a href="/posts/latent-lab">human/AI collaboration</a> at the MIT Media Lab.
        </p>

        <nav className="link-section">
          <div className="link-row">
            <a href="https://www.are.na/trudy-painter" target="_blank" rel="noopener noreferrer">Are.na</a>
            <a href="https://github.com/trudypainter" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://instagram.com/bionicpinkytoe" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="https://x.com/trudypainter" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://huggingface.co/Trudy" target="_blank" rel="noopener noreferrer">HF</a>
            <a href="https://www.linkedin.com/in/trudy-painter/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <a href="mailto:hello@trudy.computer">hello@trudy.computer</a>
        </nav>
      </div>

      {photos.length > 0 && (
        <section className="photo-scroller-section">
          <div className="photo-scroller-header">
            <h2>
              <a
                href="https://www.are.na/trudy-painter/photos-i-took-on-my-iphone"
                target="_blank"
                rel="noopener noreferrer"
              >
                PHOTOS I TOOK ON MY IPHONE
              </a>
            </h2>
          </div>
          <PhotoScroller initialPhotos={photos} />
        </section>
      )}

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
