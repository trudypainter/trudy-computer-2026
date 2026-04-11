"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Photo = {
  id: number;
  title: string | null;
  src: string;
};

const PHOTO_SIZE = 200; // each photo is 200x200 square
const PREFETCH_THRESHOLD = 10; // start fetching when 10 items from the end

export default function PhotoScroller({
  initialPhotos,
}: {
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [page, setPage] = useState(2); // page 1 is already loaded
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/arena?page=${page}`);
      const json = await res.json();

      if (json.photos.length > 0) {
        setPhotos((prev) => {
          // Dedupe by id
          const existingIds = new Set(prev.map((p) => p.id));
          const newPhotos = json.photos.filter(
            (p: Photo) => !existingIds.has(p.id)
          );
          return [...prev, ...newPhotos];
        });
        setPage((p) => p + 1);
      }

      setHasMore(json.hasMore);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      // Each photo is PHOTO_SIZE wide + 8px gap
      const itemWidth = PHOTO_SIZE + 8;
      const scrollRight =
        scroller.scrollWidth - scroller.scrollLeft - scroller.clientWidth;
      const itemsRemaining = scrollRight / itemWidth;

      if (itemsRemaining < PREFETCH_THRESHOLD) {
        fetchMore();
      }
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    // Also check on mount in case initial batch doesn't fill the screen
    handleScroll();

    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [fetchMore]);

  return (
    <div className="photo-scroller" ref={scrollerRef}>
      {photos.map((photo) => (
        <a
          key={photo.id}
          href="https://www.are.na/trudy-painter/photos-i-took-on-my-iphone"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={photo.src}
            alt=""
            loading="lazy"
          />
        </a>
      ))}
      {loading && <div className="photo-scroller-loading">...</div>}
    </div>
  );
}
