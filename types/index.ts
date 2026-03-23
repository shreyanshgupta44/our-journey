export interface Album {
    id: string;
    name: string;
    destination: string | null;
    date_from: string | null;
    date_to: string | null;
    description: string | null;
    cover_url: string | null;
    created_at: string;
    media_count?: number;
    photo_count?: number;
    video_count?: number;
}

export interface Media {
    id: string;
    album_id: string;
    url: string;
    type: "image" | "video";
    filename: string | null;
    uploaded_at: string;
}
