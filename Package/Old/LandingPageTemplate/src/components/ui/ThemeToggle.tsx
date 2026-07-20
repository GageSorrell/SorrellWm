/**
 * @file      animated-theme-toggler.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import { GetThemeTransitionClipPaths, ThemeIcon } from "./ThemeToggle.Internal";
import { type ReactNode, type RefObject, useCallback, useRef } from "react";
import type { FClipPath } from "./ThemeToggle.Internal.Types";
import type { PAnimatedThemeToggler } from "./ThemeToggle.Types";
import { cn } from "@/lib/utils";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

/**
 * A toggle-button that allows the user to cycle through light/dark/system themes
 * via {@link useTheme | next-themes (useTheme)}.
 *
 * @param Props - The props passed to the underlying button component.
 * @returns {ReactNode} A component that allows the user to cycle between light/dark/system themes.
 */
export function ThemeToggle(Props: PAnimatedThemeToggler): ReactNode
{
    const { className, ...Tail } = Props;

    const FromCenter: boolean = false;
    const Duration: number = 400;
    const ButtonRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement>(null);

    const {
        setTheme: SetTheme,
        theme: Theme,
        themes: Themes
    } = useTheme();

    const UpdateTheme: (() => void) = useCallback(() =>
    {
        const CurrentIndex: number = Themes.indexOf(Theme || "");
        const NextIndex: number = (CurrentIndex + 1) % Themes.length;
        SetTheme(Themes[NextIndex]);
    }, [ SetTheme, Theme, Themes ]);

    const ToggleTheme: () => void = useCallback(() =>
    {
        const Button: HTMLButtonElement | null = ButtonRef.current;

        if (!Button)
        {
            return;
        }

        const ViewportWidth: number = window.visualViewport?.width ?? window.innerWidth;
        const ViewportHeight: number = window.visualViewport?.height ?? window.innerHeight;

        let X: number;
        let Y: number;
        if (FromCenter)
        {
            X = ViewportWidth / 2;
            Y = ViewportHeight / 2;
        }
        else
        {
            const {
                height: Height,
                left: Left,
                top: Top,
                width: Width } = Button.getBoundingClientRect();

            X = Left + Width / 2;
            Y = Top + Height / 2;
        }

        const MaxRadius: number = Math.hypot(
            Math.max(X, ViewportWidth - X),
            Math.max(Y, ViewportHeight - Y)
        );

        if (typeof document.startViewTransition !== "function")
        {
            UpdateTheme();
            return;
        }

        const ClipPath: FClipPath =
            GetThemeTransitionClipPaths(
                X,
                Y,
                MaxRadius
            );

        const DocumentRoot: HTMLElement = document.documentElement;
        DocumentRoot.dataset.magicuiThemeVt = "active";
        DocumentRoot.style.setProperty(
            "--magicui-theme-toggle-vt-duration",
            `${ Duration }ms`
        );

        /* Pin the collapsed clip-path via CSS so Firefox does not paint the new *
         * theme un-clipped between snapshot and the ready.then() JS animation.   */
        DocumentRoot.style.setProperty("--magicui-theme-vt-clip-from", ClipPath[0]);

        const Cleanup = (): void =>
        {
            delete DocumentRoot.dataset.magicuiThemeVt;
            DocumentRoot.style.removeProperty("--magicui-theme-toggle-vt-duration");
            DocumentRoot.style.removeProperty("--magicui-theme-vt-clip-from");
        };

        const ViewTransition: ViewTransition = document.startViewTransition(() =>
        {
            flushSync(UpdateTheme);
        });

        if (typeof ViewTransition?.finished?.finally === "function")
        {
            ViewTransition.finished.finally(Cleanup);
        }
        else
        {
            Cleanup();
        }

        const IsReady: Promise<void> = ViewTransition?.ready;
        if (IsReady && typeof IsReady.then === "function")
        {
            IsReady.then(() =>
            {
                document.documentElement.animate(
                    {
                        clipPath: ClipPath
                    },
                    {
                        duration: Duration,
                        easing: "ease-in-out",
                        fill: "forwards",
                        pseudoElement: "::view-transition-new(root)"
                    }
                );
            });
        }
    }, [ FromCenter, UpdateTheme ]);

    return (
        <button
            className={ cn(className) }
            onClick={ ToggleTheme }
            ref={ ButtonRef }
            type="button"
            { ...Tail }>
            <ThemeIcon />
            <span className="sr-only">
                Toggle theme
            </span>
        </button>
    );
};
