import dynamic from "next/dynamic";
const PhotoScroller = dynamic(() => import("@/components/PhotoScroller"), { ssr: false });
const LinkMatrix = dynamic(() => import("@/components/LinkMatrix"), { ssr: false });

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

export default async function About() {
  const photos = await getArenaPhotos();

  return (
    <>
      {/* Hidden first image to override iMessage/crawler auto-selection */}
      <img src="/og-blank.png" alt="" width={1} height={1} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />

      <div className="about-content about-layout-g">
        <div className="about-image">
          <img src="/trudy-headshot.webp" alt="Trudy Painter" />
        </div>
        <div className="about-text">
          <p>
            Hi, I&rsquo;m Trudy. I&rsquo;m a creative engineer in Brooklyn, NY.
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
            published <a href="/posts/latent-lab">AI research</a> through the MIT Media Lab.
          </p>
        </div>
      </div>

      {photos.length > 0 && (
        <section className="photo-scroller-section about-photos">
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

      <section className="about-contact-section">
        <h2>CONTACT</h2>
        <p>I mean it when I say I love to chat... <a href="mailto:hello@trudy.computer">hello@trudy.computer</a></p>
        <LinkMatrix />
      </section>
    </>
  );
}
