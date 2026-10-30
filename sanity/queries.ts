export const allProjectsQuery = `
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "date": coalesce(date, _updatedAt),
    projectLocation,
    projectYear,
    "projectTags": projectTags[]->{ _id, name, slug },
  }
`;

export const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "date": coalesce(date, _updatedAt),
    projectLocation,
    projectYear,
    "projectTags": projectTags[]->{ _id, name, slug },
    "links": links[] {
      displayText,
      href
    },
    coverImage,
    content[]{
      ...,
      _type == "twitterEmbed" => { ..., url },
      _type == "vimeoEmbed" => { ..., url, caption },
      _type == "youtubeEmbed" => { ..., url, caption },
      _type == "loomEmbed" => { ..., url, caption },
      _type == "video" => { ..., asset, caption },
      markDefs[]{
        ...,
        _type == "link" => {
          "page": page->slug.current,
          "post": post->slug.current
        }
      }
    },
  }
`;

export const postSlugsQuery = `
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`;

export const aboutPageQuery = `
  *[_type == "about"][0]{
    profileImage {
      asset,
      alt,
    },
    fullBio,
    bioSections[] {
      title,
      content
    }
  }
`;

export const gizmosQuery = `
  *[_type == "gizmo" && defined(video.asset)] | order(order asc, _createdAt asc) {
    _id,
    title,
    url,
    "videoUrl": video.asset->url,
    "posterUrl": poster.asset->url,
  }
`;
