import { createClient } from "@sanity/client";

// Draft preview: fetch drafts instead of published content locally (dev + SANITY_TOKEN)
// and on staging.trudy.computer (SANITY_PREVIEW_DRAFTS=true, set only for the staging branch).
const previewDrafts =
  !!process.env.SANITY_TOKEN &&
  (process.env.NODE_ENV === "development" || process.env.SANITY_PREVIEW_DRAFTS === "true");

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
