"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Album } from "@/types";
import Navbar from "@/components/Navbar";
import { AlbumCardSkeleton } from "@/components/Skeleton";

export default function AlbumsPage() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchAlbums();
    }, []);

    async function fetchAlbums() {
        try {
            const { data: albumsData } = await supabase
                .from("albums")
                .select("*")
                .order("date_from", { ascending: false });

            if (albumsData) {
                const albumsWithCounts = await Promise.all(
                    albumsData.map(async (album) => {
                        const { count: photoCount } = await supabase
                            .from("media")
                            .select("*", { count: "exact", head: true })
                            .eq("album_id", album.id)
                            .eq("type", "image");

                        const { count: videoCount } = await supabase
                            .from("media")
                            .select("*", { count: "exact", head: true })
                            .eq("album_id", album.id)
                            .eq("type", "video");

                        return {
                            ...album,
                            photo_count: photoCount || 0,
                            video_count: videoCount || 0,
                            media_count: (photoCount || 0) + (videoCount || 0),
                        };
                    })
                );
                setAlbums(albumsWithCounts);
            }
        } catch (err) {
            console.error("Error fetching albums:", err);
        } finally {
            setLoading(false);
        }
    }

    const formatDateRange = (from: string | null, to: string | null) => {
        if (!from) return "";
        const f = new Date(from).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        if (!to) return f;
        const t = new Date(to).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        return `${f} — ${t}`;
    };

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">
                            Collection
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl">All Albums</h1>
                    </div>
                    <Link
                        href="/albums/new"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-cream text-sm tracking-wider uppercase hover:bg-espresso/90 transition-colors"
                    >
                        <span>+</span> New Trip
                    </Link>
                </div>

                {/* Albums Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <AlbumCardSkeleton key={i} />
                        ))}
                    </div>
                ) : albums.length === 0 ? (
                    <div className="text-center py-32">
                        <svg
                            className="w-20 h-20 text-espresso/10 mx-auto mb-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={0.5}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                        <p className="font-serif text-2xl italic text-espresso/30 mb-2">
                            No albums yet
                        </p>
                        <p className="text-sm text-espresso/40 mb-8">
                            Your journey starts with the first trip
                        </p>
                        <Link
                            href="/albums/new"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-espresso text-cream text-sm tracking-wider uppercase hover:bg-espresso/90 transition-colors"
                        >
                            <span>+</span> Create First Trip
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger">
                        {albums.map((album) => (
                            <Link
                                key={album.id}
                                href={`/albums/${album.id}`}
                                className="group relative border-subtle rounded-2xl overflow-hidden hover-lift bg-white/30"
                            >
                                {/* Cover Image */}
                                <div className="aspect-[4/3] overflow-hidden bg-sand/30 relative">
                                    {album.cover_url ? (
                                        <img
                                            src={album.cover_url}
                                            alt={album.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sand/50 to-cream">
                                            <svg
                                                className="w-16 h-16 text-espresso/10"
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

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20 transition-colors duration-500 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-5 py-2 rounded-full bg-white/90 text-espresso text-sm tracking-wider uppercase font-medium">
                                            Open Album
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6">
                                    <h3 className="font-serif text-xl group-hover:text-gold transition-colors duration-300">
                                        {album.name}
                                    </h3>
                                    {album.destination && (
                                        <p className="text-sm text-espresso/50 mt-1 flex items-center gap-1.5">
                                            <svg
                                                className="w-3.5 h-3.5 flex-shrink-0"
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
                                            </svg>
                                            {album.destination}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-3 text-xs text-espresso/30">
                                        {album.date_from && (
                                            <span>
                                                {formatDateRange(album.date_from, album.date_to)}
                                            </span>
                                        )}
                                        {album.media_count !== undefined &&
                                            album.media_count > 0 && (
                                                <>
                                                    <span>·</span>
                                                    <span>
                                                        {album.photo_count} photo
                                                        {album.photo_count !== 1 && "s"}
                                                        {album.video_count! > 0 &&
                                                            ` · ${album.video_count} video${album.video_count !== 1 ? "s" : ""
                                                            }`}
                                                    </span>
                                                </>
                                            )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
