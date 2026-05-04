"use client";
import { useState, type ReactNode } from "react";
import { Card } from "../layout/card";
import Image from "next/image";
import { Icon } from "../icons";
import { track } from "@vercel/analytics";

export function Video(): ReactNode
{
    const [ showVideo, setShowVideo ] = useState<boolean>(false);
    return (
        <div className="relative">
            <Card>
                {showVideo ? (
                    <div className="aspect-video">
                        <iframe
                            allow={
                                "accelerometer; autoplay; clipboard-write; encrypted-media; " +
                                "gyroscope; picture-in-picture;"
                            }
                            allowFullScreen
                            height="100%"
                            loading="lazy"
                            src={ `https://www.youtube-nocookie.com/embed/ViSiXfBKElQ?&autoplay=1` }
                            title="Effect: Next-Generation TypeScript"
                            width="100%"
                        />
                    </div>
                ) : (
                    <div className="relative aspect-video">
                        <Image
                            alt="Effect: Next-Generation TypeScript"
                            className="object-cover object-center"
                            fill
                            src="/images/video-thumbnail.jpg"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <button
                                className={
                                    "inline-flex h-10 rounded-xl p-px bg-gradient-to-br " +
                                    "from-[#84B2E5] to-[#2F6EB1] shadow-lg"
                                }
                                onClick={ () =>
                                {
                                    setShowVideo(true);
                                    track("show-video");
                                } }>
                                <div className="flex h-full items-center gap-2 px-6 font-medium rounded-[11px] bg-gradient-to-br from-[#4B91DE] to-[#276AB2] text-white button-hover">
                                    <Icon
                                        className="h-3.5"
                                        name="play"
                                    />
                                    <span>Watch Video</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </Card>
            <div
                className="absolute -inset-y-64 w-32 left-1/2 rotate-45 bg-white/10 blur-3xl pointer-events-none"
                style={ { borderRadius: "50% 50%" } }
            />
        </div>
    );
}
