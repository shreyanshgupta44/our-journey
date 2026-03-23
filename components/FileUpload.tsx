"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase";

interface FileUploadProps {
    albumId: string;
    onUploadComplete: () => void;
}

interface UploadFile {
    file: File;
    progress: number;
    status: "pending" | "uploading" | "done" | "error";
    error?: string;
}

const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "video/mp4",
    "video/quicktime",
];

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.heic,.mp4,.mov";

export default function FileUpload({
    albumId,
    onUploadComplete,
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFiles = useCallback((newFiles: FileList | File[]) => {
        const validFiles = Array.from(newFiles).filter((f) =>
            ACCEPTED_TYPES.includes(f.type)
        );

        if (validFiles.length === 0) return;

        setFiles((prev) => [
            ...prev,
            ...validFiles.map((file) => ({
                file,
                progress: 0,
                status: "pending" as const,
            })),
        ]);
    }, []);

    const uploadAllFiles = async () => {
        setIsUploading(true);

        for (let i = 0; i < files.length; i++) {
            if (files[i].status !== "pending") continue;

            setFiles((prev) =>
                prev.map((f, idx) =>
                    idx === i ? { ...f, status: "uploading" as const, progress: 10 } : f
                )
            );

            const file = files[i].file;
            const fileExt = file.name.split(".").pop();
            const fileName = `${albumId}/${Date.now()}-${Math.random()
                .toString(36)
                .substring(7)}.${fileExt}`;

            try {
                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from("travel-media")
                    .upload(fileName, file, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i ? { ...f, progress: 60 } : f
                    )
                );

                // Get public URL
                const {
                    data: { publicUrl },
                } = supabase.storage.from("travel-media").getPublicUrl(fileName);

                // Determine media type
                const mediaType = file.type.startsWith("video/") ? "video" : "image";

                // Insert into media table
                const { error: dbError } = await supabase.from("media").insert({
                    album_id: albumId,
                    url: publicUrl,
                    type: mediaType,
                    filename: file.name,
                });

                if (dbError) throw dbError;

                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? { ...f, progress: 100, status: "done" as const }
                            : f
                    )
                );
            } catch (err) {
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? {
                                ...f,
                                status: "error" as const,
                                error: err instanceof Error ? err.message : "Upload failed",
                            }
                            : f
                    )
                );
            }
        }

        setIsUploading(false);
        onUploadComplete();
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const clearCompleted = () => {
        setFiles((prev) => prev.filter((f) => f.status !== "done"));
    };

    return (
        <div className="space-y-6">
            {/* Drop Zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragOver
                        ? "border-gold bg-gold/5 scale-[1.01]"
                        : "border-espresso/15 hover:border-gold/50 hover:bg-sand/30"
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_EXTENSIONS}
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDragOver ? "bg-gold/20" : "bg-sand/50"
                            }`}
                    >
                        <svg
                            className={`w-8 h-8 transition-colors ${isDragOver ? "text-gold" : "text-espresso/30"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-serif text-lg text-espresso/80">
                            Drop your memories here
                        </p>
                        <p className="text-sm text-espresso/40 mt-1">
                            JPG, PNG, WEBP, HEIC, MP4, MOV
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-espresso/60">
                            {files.length} file{files.length !== 1 && "s"} selected
                        </p>
                        {files.some((f) => f.status === "done") && (
                            <button
                                onClick={clearCompleted}
                                className="text-xs text-espresso/40 hover:text-espresso transition-colors"
                            >
                                Clear completed
                            </button>
                        )}
                    </div>

                    {files.map((f, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-xl bg-sand/30 border-subtle"
                        >
                            {/* File icon */}
                            <div className="w-10 h-10 rounded-lg bg-sand flex items-center justify-center flex-shrink-0">
                                {f.file.type.startsWith("video/") ? (
                                    <svg
                                        className="w-5 h-5 text-espresso/40"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5 text-espresso/40"
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
                                )}
                            </div>

                            {/* File info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{f.file.name}</p>
                                <p className="text-xs text-espresso/40">
                                    {(f.file.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                                {/* Progress bar */}
                                {f.status === "uploading" && (
                                    <div className="mt-1 h-1 bg-sand rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gold rounded-full transition-all duration-500"
                                            style={{ width: `${f.progress}%` }}
                                        />
                                    </div>
                                )}
                                {f.status === "error" && (
                                    <p className="text-xs text-red-400 mt-1">{f.error}</p>
                                )}
                            </div>

                            {/* Status / Remove */}
                            <div className="flex-shrink-0">
                                {f.status === "done" ? (
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : f.status === "uploading" ? (
                                    <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                ) : (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-espresso/30 hover:text-espresso transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
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
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Upload button */}
                    {files.some((f) => f.status === "pending") && (
                        <button
                            onClick={uploadAllFiles}
                            disabled={isUploading}
                            className="w-full py-3 rounded-xl bg-espresso text-cream font-sans text-sm tracking-wider uppercase hover:bg-espresso/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? "Uploading..." : "Upload All"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
