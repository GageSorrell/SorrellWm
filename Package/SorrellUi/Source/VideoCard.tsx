/**
 * A video with a poster image and centered play button that hides once playback starts and
 * reappears on pause/end, at which point native controls take over.
 *
 * @module @sorrell/ui/VideoCard
 *
 * @file      VideoCard.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useRef, useState } from "react";
import type * as React from "react";

import { Cn } from "./ClassName.js";

/** Props for {@link VideoCard}. */
export interface VideoCardProps
{
    readonly className?: string;
    readonly poster: string;
    readonly src: string;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const VideoCard = ({ className: ClassName, poster: Poster, src: Src }: VideoCardProps): React.JSX.Element =>
{
    const VideoRef = useRef<HTMLVideoElement>(null);
    const [ ShowOverlay, SetShowOverlay ] = useState(true);

    const OnPlay = (): void =>
    {
        SetShowOverlay(false);
    };

    const OnPauseOrEnd = (): void =>
    {
        if (VideoRef.current !== null)
        {
            VideoRef.current.currentTime = 0;
        }

        SetShowOverlay(true);
    };

    const StartPlayback = (): void =>
    {
        SetShowOverlay(false);
        void VideoRef.current?.play();
    };

    return (
        <div className={ Cn("relative block aspect-video w-full overflow-hidden rounded-lg border border-zinc-800 bg-black", ClassName) }>
            <video className="h-full w-full object-contain"
                controls={ !ShowOverlay }
                onEnded={ OnPauseOrEnd }
                onPause={ OnPauseOrEnd }
                onPlay={ OnPlay }
                playsInline={ true }
                poster={ Poster }
                preload="metadata"
                ref={ VideoRef }
                src={ Src }>
                <track kind="captions" />
            </video>

            <img alt=""
                aria-hidden="true"
                className={ Cn("pointer-events-none absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-300 ease-out", ShowOverlay ? "opacity-100" : "opacity-0") }
                src={ Poster } />

            <button aria-hidden={ !ShowOverlay }
                aria-label="Play video"
                className={ Cn("group absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ease-out hover:bg-black/40", ShowOverlay ? "opacity-100" : "pointer-events-none opacity-0") }
                onClick={ StartPlayback }
                tabIndex={ ShowOverlay ? 0 : -1 }
                type="button">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-zinc-900 backdrop-blur-sm transition-transform group-hover:scale-105">
                    <svg aria-hidden="true"
                        className="ml-0.5 size-8"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                </span>
            </button>
        </div>
    );
};
