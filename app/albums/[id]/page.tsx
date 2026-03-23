"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Album, Media } from "@/types";
import Navbar from "@/components/Navbar";
import Lightbox from "@/components/Lightbox";
import MasonryGrid from "@/components/MasonryGrid";
import FileUpload from "@/components/FileUpload";
import { HeroSkeleton, PhotoSkeleton } from "@/components/Skeleton";
import { useGuest } from "@/components/GuestContext";
import { DEMO_ALBUMS, DEMO_MEDIA } from "@/lib/demo-data";

export default function AlbumDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [album, setAlbum] = useState<Album | null>(null);
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const supabase = createClient();
    const { isGuest } = useGuest();

    const fetchAlbum = useCallback(async () => {
        try {
            const { data: albumData } = await supabase
                .from("albums")
                .select("*")
                .eq("id", id)
                .single();

            if (!albumData) {
                router.push("/albums");
                return;
            }

            setAlbum(albumData);

            const { data: mediaData } = await supabase
                .from("media")
                .select("*")
                .eq("album_id", id)
                .order("uploaded_at", { ascending: false });

            if (mediaData) setMedia(mediaData);
        } catch (err) {
            console.error("Error fetching album:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (isGuest) {
            // Guest mode: load demo data
            const idStr = id as string;
            const demoAlbum = DEMO_ALBUMS.find((a) => a.id === idStr);
            if (demoAlbum) {
                setAlbum(demoAlbum);
                setMedia(DEMO_MEDIA[idStr] || []);
            } else {
                // Guest trying to access a real album — redirect
                router.push("/albums");
            }
            setLoading(false);
            return;
        }
        fetchAlbum();
    }, [isGuest, id, fetchAlbum, router]);

    const handleSetCover = async (url: string) => {
        const { error } = await supabase
            .from("albums")
            .update({ cover_url: url })
            .eq("id", id);

        if (!error) {
            setAlbum((prev) => (prev ? { ...prev, cover_url: url } : null));
        }
    };

    const handleDeleteMedia = async (mediaId: string) => {
        const mediaItem = media.find((m) => m.id === mediaId);
        if (!mediaItem) return;

        // Extract file path from URL
        const urlParts = mediaItem.url.split("/travel-media/");
        const filePath = urlParts[urlParts.length - 1];

        // Delete from storage
        await supabase.storage.from("travel-media").remove([filePath]);

        // Delete from database
        const { error } = await supabase.from("media").delete().eq("id", mediaId);

        if (!error) {
            setMedia((prev) => prev.filter((m) => m.id !== mediaId));
        }
    };

    const handleDeleteAlbum = async () => {
        const confirmed = window.confirm("Delete this entire album and all its photos? This cannot be undone.");
        if (!confirmed) return;

        setIsDeleting(true);

        try {
            // Delete all media files from storage
            for (const item of media) {
                const urlParts = item.url.split("/travel-media/");
                const filePath = urlParts[urlParts.length - 1];
                if (filePath) {
                    await supabase.storage.from("travel-media").remove([filePath]);
                }
            }

            // Delete album (cascades to media records)
            const { error } = await supabase.from("albums").delete().eq("id", id);

            if (error) {
                alert("Failed to delete album: " + error.message);
                setIsDeleting(false);
                return;
            }

            router.push("/albums");
        } catch (err) {
            alert("Error deleting album: " + String(err));
            setIsDeleting(false);
        }
    };

    const formatDateRange = (from: string | null, to: string | null) => {
        if (!from) return "";
        const f = new Date(from).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });
        if (!to) return f;
        const t = new Date(to).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        return `${f} — ${t}`;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <HeroSkeleton />
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
                    <div className="masonry">
                        {[...Array(8)].map((_, i) => (
                            <PhotoSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    if (!album) return null;

    return (
        <>
            <Navbar />

            {/* Hero Banner */}
            <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                {album.cover_url ? (
                    <img
                        src={album.cover_url}
                        alt={album.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sand to-cream flex items-center justify-center">
                        <svg
                            className="w-24 h-24 text-espresso/5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={0.3}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />

                {/* Album Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            href="/albums"
                            className="inline-flex items-center gap-1 text-white/60 text-sm hover:text-white transition-colors mb-4"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            All Albums
                        </Link>
                        <h1 className="font-serif text-4xl md:text-6xl text-white mb-2">
                            {album.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                            {album.destination && (
                                <span className="flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4"
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
                                </span>
                            )}
                            {album.date_from && (
                                <span>{formatDateRange(album.date_from, album.date_to)}</span>
                            )}
                            <span>{media.length} memories</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
                {/* Description + Actions */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                    {album.description && (
                        <p className="text-espresso/60 font-serif text-lg italic max-w-2xl leading-relaxed">
                            &ldquo;{album.description}&rdquo;
                        </p>
                    )}

                    {!isGuest && (
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => setShowUpload(!showUpload)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-cream text-sm tracking-wider uppercase hover:bg-espresso/90 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
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
                                Add Photos
                            </button>
                            <button
                                onClick={handleDeleteAlbum}
                                disabled={isDeleting}
                                className="px-4 py-2.5 rounded-xl text-sm text-espresso/40 hover:text-red-500 hover:bg-red-50/50 transition-colors border-subtle disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete Album"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Upload Section */}
                {showUpload && (
                    <div className="mb-12 animate-fade-in">
                        <div className="max-w-2xl mx-auto">
                            <FileUpload
                                albumId={id as string}
                                onUploadComplete={() => {
                                    setShowUpload(false);
                                    fetchAlbum();
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Media Grid */}
                <MasonryGrid
                    media={media}
                    onMediaClick={(index) => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                    }}
                    onSetCover={isGuest ? undefined : handleSetCover}
                    onDelete={isGuest ? undefined : handleDeleteMedia}
                />
            </div>

            {/* Lightbox */}
            <Lightbox
                media={media}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={setLightboxIndex}
            />
        </>
    );
}
