"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Album, Media } from "@/types";
import Navbar from "@/components/Navbar";
import { AlbumCardSkeleton } from "@/components/Skeleton";
import { useGuest } from "@/components/GuestContext";
import { DEMO_ALBUMS, ALL_DEMO_MEDIA } from "@/lib/demo-data";

export default function HomePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [recentMedia, setRecentMedia] = useState<Media[]>([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { isGuest } = useGuest();

  useEffect(() => {
    if (isGuest) {
      setAlbums(DEMO_ALBUMS);
      setRecentMedia(ALL_DEMO_MEDIA.slice(0, 10));
      setTotalPhotos(ALL_DEMO_MEDIA.length);
      setLoading(false);
      return;
    }
    fetchData();
  }, [isGuest]);

  async function fetchData() {
    try {
      // Fetch albums with media count
      const { data: albumsData } = await supabase
        .from("albums")
        .select("*")
        .order("created_at", { ascending: false });

      if (albumsData) {
        // Get media counts for each album
        const albumsWithCounts = await Promise.all(
          albumsData.map(async (album) => {
            const { count } = await supabase
              .from("media")
              .select("*", { count: "exact", head: true })
              .eq("album_id", album.id);
            return { ...album, media_count: count || 0 };
          })
        );
        setAlbums(albumsWithCounts);
      }

      // Fetch recent media
      const { data: mediaData } = await supabase
        .from("media")
        .select("*")
        .order("uploaded_at", { ascending: false })
        .limit(10);

      if (mediaData) setRecentMedia(mediaData);

      // Get total media count
      const { count } = await supabase
        .from("media")
        .select("*", { count: "exact", head: true });
      setTotalPhotos(count || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #1A1710 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative text-center px-6 animate-fade-in-up">
          <span className="text-gold text-2xl mb-6 block">✦</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide mb-6">
            Every road
            <br />
            <span className="italic text-gold/80">we walked</span>
          </h1>
          <p className="text-espresso/40 text-sm tracking-[0.3em] uppercase mb-12">
            A collection of our adventures together
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 md:gap-16">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-gold">
                {loading ? "—" : albums.length}
              </p>
              <p className="text-xs tracking-wider uppercase text-espresso/40 mt-1">
                Trips
              </p>
            </div>
            <div className="w-px h-10 bg-espresso/10" />
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-gold">
                {loading ? "—" : totalPhotos}
              </p>
              <p className="text-xs tracking-wider uppercase text-espresso/40 mt-1">
                Memories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">
              Our Adventures
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">Trip Albums</h2>
          </div>
          <Link
            href="/albums"
            className="text-sm text-espresso/40 hover:text-espresso tracking-wider uppercase transition-colors"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <AlbumCardSkeleton key={i} />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl italic text-espresso/30 mb-4">
              No trips yet
            </p>
            <p className="text-sm text-espresso/40 mb-8">
              Start documenting your journey together
            </p>
            {!isGuest && (
              <Link
                href="/albums/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-espresso text-cream text-sm tracking-wider uppercase hover:bg-espresso/90 transition-colors"
              >
                <span>+</span> Create First Trip
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {albums.slice(0, 6).map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="group border-subtle rounded-2xl overflow-hidden hover-lift bg-white/30"
              >
                <div className="aspect-[4/3] overflow-hidden bg-sand/30">
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-espresso/10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={0.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl group-hover:text-gold transition-colors duration-300">
                    {album.name}
                  </h3>
                  {album.destination && (
                    <p className="text-sm text-espresso/50 mt-1 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {album.destination}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-espresso/30">
                    <span>{formatDate(album.date_from)}</span>
                    {album.media_count !== undefined && (
                      <>
                        <span>·</span>
                        <span>
                          {album.media_count} memor
                          {album.media_count === 1 ? "y" : "ies"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Memories Strip */}
      {recentMedia.length > 0 && (
        <section className="py-16 border-t border-espresso/5">
          <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">
              Latest uploads
            </p>
            <h2 className="font-serif text-3xl">Recent Memories</h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-6 md:px-10 pb-4 min-w-max">
              {recentMedia.map((item) => (
                <div
                  key={item.id}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden flex-shrink-0 border-subtle hover-lift"
                >
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.filename || "Memory"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating New Trip Button — hidden for guests */}
      {!isGuest && (
        <Link
          href="/albums/new"
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-espresso text-cream shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
          title="New Trip"
        >
          <svg
            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      )}
    </>
  );
}
