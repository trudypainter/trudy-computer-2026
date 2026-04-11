import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const per = 20;
  const token = process.env.ARENA_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({ photos: [], hasMore: false });
  }

  try {
    const res = await fetch(
      `https://api.are.na/v3/channels/photos-i-took-on-my-iphone/contents?per=${per}&page=${page}&sort=created_at_desc`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      return NextResponse.json({ photos: [], hasMore: false });
    }

    const json = await res.json();
    const photos = (json.data || [])
      .filter((b: any) => b.type === "Image" && b.image)
      .map((b: any) => ({
        id: b.id,
        title: b.title,
        src: b.image.medium.src,
      }));

    // Are.na channel has 1573 blocks total
    const hasMore = photos.length === per;

    return NextResponse.json({ photos, hasMore });
  } catch {
    return NextResponse.json({ photos: [], hasMore: false });
  }
}
