import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { postQuery, postSlugsQuery } from "@/sanity/queries";
import CustomPortableText from "@/components/PortableText";

// Re-fetch from Sanity at most once a minute so content edits go live without a redeploy.
export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugsQuery);
  return slugs;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await client.fetch(postQuery, { slug });
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Trudy Painter`,
    description: post.excerpt || undefined,
  };
}

export default async function PostPage(props: Props) {
  const { slug } = await props.params;
  const post = await client.fetch(postQuery, { slug });

  if (!post) return notFound();

  return (
    <>
      <div className="post-header">
        <div className="post-header-left">
          <h1>{post.title}</h1>
          {post.excerpt && (
            <p className="post-excerpt">{post.excerpt}</p>
          )}
        </div>
        {(() => {
          const simpleRows: { label: string; value: React.ReactNode }[] = [];
          if (post.projectYear) simpleRows.push({ label: "Year", value: post.projectYear });
          if (post.projectLocation) simpleRows.push({ label: "Location", value: post.projectLocation });
          if (post.projectTags?.length) simpleRows.push({ label: "Tags", value: post.projectTags.map((tag: any) => tag.name).join(", ") });
          const links: { displayText: string; href: string }[] = post.links || [];
          const totalRows = simpleRows.length + Math.max(links.length, 0);
          if (totalRows === 0) return null;
          const lastSimpleIndex = links.length > 0 ? -1 : simpleRows.length - 1;
          return (
            <table className="project-meta-table">
              <tbody>
                {simpleRows.map((row, i) => (
                  <tr key={row.label} className={`${i === lastSimpleIndex ? "meta-row-last" : ""}${i === simpleRows.length - 1 && links.length > 0 ? " meta-row-before-links" : ""}`}>
                    <td className="meta-label">{row.label}</td>
                    <td className="meta-value">{row.value}</td>
                  </tr>
                ))}
                {links.map((link, i) => (
                  <tr key={link.href} className={`${i === 0 ? "meta-row-links-start" : ""}${i === links.length - 1 ? " meta-row-last" : ""}`}>
                    {i === 0 && (
                      <td className="meta-label meta-label-merged" rowSpan={links.length}>Links</td>
                    )}
                    <td className="meta-value">
                      <a href={link.href} target="_blank" rel="noopener noreferrer">{link.displayText}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })()}
      </div>

      <hr />

      {post.content && <CustomPortableText value={post.content} />}

      <Link href="/" className="back-link">
        &larr; Back
      </Link>
    </>
  );
}
