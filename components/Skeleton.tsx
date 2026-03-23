export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`bg-gradient-to-r from-sand/50 via-cream-dark/70 to-sand/50 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
        />
    );
}

export function AlbumCardSkeleton() {
    return (
        <div className="border-subtle rounded-2xl overflow-hidden">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    );
}

export function PhotoSkeleton() {
    return <Skeleton className="aspect-square rounded-xl" />;
}

export function HeroSkeleton() {
    return (
        <div className="relative w-full h-[60vh]">
            <Skeleton className="w-full h-full rounded-none" />
            <div className="absolute bottom-10 left-10 space-y-3">
                <Skeleton className="h-10 w-80" />
                <Skeleton className="h-5 w-48" />
            </div>
        </div>
    );
}
