import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { postQuery, postSlugsQuery } from "@/sanity/queries";
import CustomPortableText from "@/components/PortableText";

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
        <dl className="project-meta">
          {post.projectYear && (
            <div className="meta-row">
              <dt>Year</dt>
              <dd>{post.projectYear}</dd>
            </div>
          )}
          {post.projectLocation && (
            <div className="meta-row">
              <dt>Location</dt>
              <dd>{post.projectLocation}</dd>
            </div>
          )}
          {post.projectTags && post.projectTags.length > 0 && (
            <div className="meta-row">
              <dt>Tags</dt>
              <dd>{post.projectTags.map((tag: any) => tag.name).join(", ")}</dd>
            </div>
          )}
          {post.links && post.links.length > 0 && (
            <div className="meta-row">
              <dt>Links</dt>
              <dd>
                {post.links.map((link: any, i: number) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.displayText}
                    </a>
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <hr />

      {post.content && <CustomPortableText value={post.content} />}

      <Link href="/" className="back-link">
        &larr; Back
      </Link>
    </>
  );
}
