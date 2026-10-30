import { createClient } from "@sanity/client";

// Local draft preview: with SANITY_TOKEN set in dev, fetch drafts instead of published content.
const previewDrafts = process.env.NODE_ENV === "development" && !!process.env.SANITY_TOKEN;

const baseClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-28",
  useCdn: !previewDrafts,
  ...(previewDrafts && { token: process.env.SANITY_TOKEN, perspective: "previewDrafts" as const }),
});

// Skip Next's fetch cache while previewing so Studio edits show up on refresh.
export const client = previewDrafts
  ? (Object.assign(Object.create(baseClient), {
      fetch: (query: string, params: Record<string, unknown> = {}) =>
        baseClient.fetch(query, params, { cache: "no-store" }),
    }) as typeof baseClient)
  : baseClient;
