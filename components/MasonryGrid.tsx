"use client";

import { Media } from "@/types";
import { useState } from "react";

interface MasonryGridProps {
    media: Media[];
    onMediaClick: (index: number) => void;
    onSetCover?: (url: string) => void;
    onDelete?: (id: string) => void;
}

export default function MasonryGrid({
    media,
    onMediaClick,
    onSetCover,
    onDelete,
}: MasonryGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (media.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-espresso/40">
                <svg
                    className="w-16 h-16 mb-4"
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
                <p className="font-serif text-xl italic">No memories yet</p>
                <p className="text-sm mt-1">Upload your first photos to this album</p>
            </div>
        );
    }

    return (
        <div className="masonry animate-stagger">
            {media.map((item, index) => (
                <div
                    key={item.id}
                    className="relative group cursor-pointer rounded-xl overflow-hidden border-subtle hover-lift"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onMediaClick(index)}
                >
                    {item.type === "video" ? (
                        <div className="relative">
                            <video
                                src={item.url}
                                className="w-full object-cover rounded-xl"
                                muted
                                preload="metadata"
                            />
                            {/* Play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                    <svg
                                        className="w-6 h-6 text-espresso ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={item.url}
                            alt={item.filename || "Photo"}
                            className="w-full object-cover rounded-xl"
                            loading="lazy"
                        />
                    )}

                    {/* Hover overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent transition-opacity duration-300 ${hoveredId === item.id ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {/* Action buttons */}
                        {(onSetCover || onDelete) && (
                            <div className="absolute top-3 right-3 flex gap-2">
                                {onSetCover && item.type === "image" && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSetCover(item.url);
                                        }}
                                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
                                        title="Set as cover"
                                    >
                                        <svg
                                            className="w-4 h-4 text-espresso"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Remove this memory?")) {
                                                onDelete(item.id);
                                            }
                                        }}
                                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                                        title="Delete"
                                    >
                                        <svg
                                            className="w-4 h-4 text-espresso hover:text-red-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
