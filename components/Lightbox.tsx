"use client";

import { useEffect, useCallback, useState } from "react";
import { Media } from "@/types";

interface LightboxProps {
    media: Media[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export default function Lightbox({
    media,
    currentIndex,
    isOpen,
    onClose,
    onNavigate,
}: LightboxProps) {
    const [isLoading, setIsLoading] = useState(true);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowLeft":
                    if (currentIndex > 0) onNavigate(currentIndex - 1);
                    break;
                case "ArrowRight":
                    if (currentIndex < media.length - 1) onNavigate(currentIndex + 1);
                    break;
            }
        },
        [isOpen, currentIndex, media.length, onClose, onNavigate]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setIsLoading(true);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, currentIndex]);

    if (!isOpen || !media[currentIndex]) return null;

    const current = media[currentIndex];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center animate-scale-in"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-espresso/95 backdrop-blur-sm" />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
                <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-10 text-white/60 text-sm font-sans tracking-wider">
                {currentIndex + 1} / {media.length}
            </div>

            {/* Previous Button */}
            {currentIndex > 0 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(currentIndex - 1);
                    }}
                    className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <svg
                        className="w-6 h-6 text-white"
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
                </button>
            )}

            {/* Next Button */}
            {currentIndex < media.length - 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(currentIndex + 1);
                    }}
                    className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            )}

            {/* Content */}
            <div
                className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {current.type === "video" ? (
                    <video
                        key={current.id}
                        src={current.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-[85vh] rounded-lg"
                    />
                ) : (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            key={current.id}
                            src={current.url}
                            alt={current.filename || "Photo"}
                            className={`max-w-full max-h-[85vh] object-contain rounded-lg transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"
                                }`}
                            onLoad={() => setIsLoading(false)}
                        />
                    </>
                )}
            </div>

            {/* Filename */}
            {current.filename && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-sans tracking-wider">
                    {current.filename}
                </div>
            )}
        </div>
    );
}
