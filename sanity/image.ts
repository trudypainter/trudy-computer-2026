import createImageUrlBuilder from "@sanity/image-url";

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

export function urlForImage(source: any) {
  if (!source?.asset?._ref) {
    return undefined;
  }
  return imageBuilder.image(source).auto("format").fit("max");
}
