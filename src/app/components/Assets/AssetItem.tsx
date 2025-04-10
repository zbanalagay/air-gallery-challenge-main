import { Clip } from "@/app/api/clips"
import Image from "next/image"
import { useState } from "react";

interface IAssetItemProps {
    asset: Clip
}


function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

  
export default function AssetItem({asset}: IAssetItemProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <div className="relative w-full h-full">
             {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            <Image
                src={asset.assets.image}
                alt={asset.title || "Untitled"}
                sizes="(max-width: 768px) 100vw, 300px"
                width={asset.width}
                height={asset.height}
                className={`object-cover w-full h-auto transition-opacity duration-300 rounded ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
                onLoad={() => setIsLoaded(true)}
            />
            {asset.type === "video" && asset.duration && (
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(asset.duration)}
                </div>
            )}
        </div>
    )
}

// TODO - Things Id test in this file
// - AssetItem
//// - renders
//// - if isLoaded is false, a gray box should appear
//// - show duration for video types
// -formatDuration