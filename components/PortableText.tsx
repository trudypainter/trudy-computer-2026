"use client";

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { urlForImage } from "@/sanity/image";

function extractVideoUrl(asset: any): string {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!projectId || !asset?._ref) return "";

  const filename = asset._ref
    .replace("file-", "")
    .replace("-mp4", ".mp4")
    .replace("-mov", ".mov")
    .replace("-webm", ".webm");

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${filename}`;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).url();
      if (!url) return null;
      return (
        <img
          src={url}
          alt={value.alt || ""}
          loading="lazy"
        />
      );
    },
    video: ({ value }) => {
      const videoUrl = extractVideoUrl(value.asset);
      if (!videoUrl) return null;
      return (
        <div>
          <video
            autoPlay
            loop
            muted
            playsInline
            src={videoUrl}
            style={{ width: "100%", borderRadius: "4px" }}
          />
          {value.caption && (
            <p className="video-caption">{value.caption}</p>
          )}
        </div>
      );
    },
    twitterEmbed: ({ value }) => {
      const tweetMatch = value.url?.match(
        /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
      );
      const tweetId = tweetMatch ? tweetMatch[1] : null;
      if (!tweetId) return null;
      return (
        <div className="embed-wrapper">
          <div className="embed-header">
            <span className="embed-label">X / Twitter</span>
            <a href={value.url} target="_blank" rel="noopener noreferrer">
              Open tweet ↗
            </a>
          </div>
          <div className="tweet-container">
            <iframe
              src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`}
              style={{ width: "100%", minHeight: "300px", border: "none" }}
              title="Tweet"
            />
          </div>
        </div>
      );
    },
    youtubeEmbed: ({ value }) => {
      const id = extractYouTubeId(value.url);
      if (!id) return null;
      return (
        <div className="embed-wrapper">
          <div className="embed-header">
            <span className="embed-label">YouTube</span>
            <a href={value.url} target="_blank" rel="noopener noreferrer">
              Open in YouTube ↗
            </a>
          </div>
          <div className="embed-container">
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            />
          </div>
        </div>
      );
    },
    vimeoEmbed: ({ value }) => {
      const id = extractVimeoId(value.url);
      if (!id) return null;
      return (
        <div className="embed-wrapper">
          <div className="embed-header">
            <span className="embed-label">Vimeo</span>
            <a href={value.url} target="_blank" rel="noopener noreferrer">
              Open in Vimeo ↗
            </a>
          </div>
          <div className="embed-container">
            <iframe
              src={`https://player.vimeo.com/video/${id}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo video"
            />
          </div>
        </div>
      );
    },
    loomEmbed: ({ value }) => {
      const loomMatch = value.url?.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
      const loomId = loomMatch ? loomMatch[1] : null;
      if (!loomId) return null;
      return (
        <div className="embed-wrapper">
          <div className="embed-header">
            <span className="embed-label">Loom</span>
            <a href={value.url} target="_blank" rel="noopener noreferrer">
              Open in Loom ↗
            </a>
          </div>
          <div className="embed-container">
            <iframe
              src={`https://www.loom.com/embed/${loomId}`}
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Loom video"
            />
          </div>
          {value.caption && (
            <p className="video-caption">{value.caption}</p>
          )}
        </div>
      );
    },
    iframeEmbed: ({ value }) => {
      let hostname = "";
      try {
        hostname = new URL(value.url).hostname.replace("www.", "");
      } catch {}
      return (
        <div className="embed-wrapper">
          <div className="embed-header">
            <span className="embed-label">{hostname || "Website"}</span>
            <a href={value.url} target="_blank" rel="noopener noreferrer">
              Open {hostname || "site"} ↗
            </a>
          </div>
          <div className="embed-container">
            <iframe
              src={value.url}
              allowFullScreen
              title={`Embedded content from ${hostname}`}
            />
          </div>
        </div>
      );
    },
    divider: () => <hr />,
    callout: ({ value }) => (
      <blockquote>
        <PortableText value={value.content || value.text} />
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      // Handle internal links
      if (value?.linkType === "post" && value?.post) {
        return <a href={`/posts/${value.post}`}>{children}</a>;
      }
      if (value?.linkType === "page" && value?.page) {
        return <a href={`/${value.page}`}>{children}</a>;
      }
      // External links
      const href = value?.href || value?.url || "#";
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

export default function CustomPortableText({
  value,
}: {
  value: PortableTextBlock[];
}) {
  return <PortableText components={components} value={value} />;
}
