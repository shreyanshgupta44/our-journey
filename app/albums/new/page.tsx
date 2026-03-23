"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function CreateAlbumPage() {
    const [name, setName] = useState("");
    const [destination, setDestination] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [description, setDescription] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const supabase = createClient();

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Trip name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            let coverUrl = null;

            // Upload cover image if selected
            if (coverFile) {
                const fileExt = coverFile.name.split(".").pop();
                const fileName = `covers/${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("travel-media")
                    .upload(fileName, coverFile, { cacheControl: "3600" });

                if (uploadError) throw uploadError;

                const {
                    data: { publicUrl },
                } = supabase.storage.from("travel-media").getPublicUrl(fileName);

                coverUrl = publicUrl;
            }

            // Insert album
            const { data, error: dbError } = await supabase
                .from("albums")
                .insert({
                    name: name.trim(),
                    destination: destination.trim() || null,
                    date_from: dateFrom || null,
                    date_to: dateTo || null,
                    description: description.trim() || null,
                    cover_url: coverUrl,
                })
                .select()
                .single();

            if (dbError) throw dbError;

            router.push(`/albums/${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create album");
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="max-w-2xl mx-auto px-6 md:px-10 pt-28 pb-16">
                <div className="mb-10">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">
                        New Adventure
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl">Create Trip</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Cover Image Upload */}
                    <div>
                        <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-3">
                            Cover Image
                        </label>
                        <label className="block cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverSelect}
                            />
                            {coverPreview ? (
                                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border-subtle group">
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm tracking-wider uppercase">
                                            Change Cover
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-espresso/15 hover:border-gold/50 transition-colors flex flex-col items-center justify-center gap-3 bg-sand/20">
                                    <svg
                                        className="w-10 h-10 text-espresso/20"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-sm text-espresso/40">
                                        Click to add a cover photo
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Trip Name */}
                    <div>
                        <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                            Trip Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border-subtle text-espresso placeholder:text-espresso/25 focus:outline-none focus:border-gold/50 transition-colors font-sans"
                            placeholder="Summer in Santorini"
                            required
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                            Destination
                        </label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border-subtle text-espresso placeholder:text-espresso/25 focus:outline-none focus:border-gold/50 transition-colors font-sans"
                            placeholder="Santorini, Greece"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                                Date From
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/50 border-subtle text-espresso focus:outline-none focus:border-gold/50 transition-colors font-sans"
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                                Date To
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/50 border-subtle text-espresso focus:outline-none focus:border-gold/50 transition-colors font-sans"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border-subtle text-espresso placeholder:text-espresso/25 focus:outline-none focus:border-gold/50 transition-colors font-sans resize-none"
                            placeholder="The trip where we discovered the best sunset spot in the world..."
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="text-red-400 text-sm text-center py-2 px-4 rounded-lg bg-red-50/50">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-espresso text-cream font-sans text-sm tracking-wider uppercase hover:bg-espresso/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            "Create Trip"
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}
