/**
 * The interaction logic behind {@link QuoteMarquee}: an infinite, auto-scrolling rail with
 * pointer-drag, pause-on-hover/focus, `prefers-reduced-motion` handling, and prev/next
 * controls.
 *
 * @module @sorrell/ui/UseQuoteMarquee
 *
 * @file      UseQuoteMarquee.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";

const AutoScrollSpeedPxPerMs = 0.6 / 24;
const ResumeDelayMs = 1800;
const ObserverThreshold = 0.3;
const ProgrammaticScrollSuppressionMs = 80;

interface MarqueeInstance
{
    readonly scrollByCard: (direction: -1 | 1) => void;
}

/** Return value of {@link UseQuoteMarquee}. */
export interface UseQuoteMarqueeResult
{
    /** Attach to the section/wrapper element used to detect on/off-screen visibility. */
    readonly containerRef: RefObject<HTMLDivElement | null>;

    /**
     * Attach to the scrollable rail. Its direct card children must carry
     * `data-role="card"` and `data-copy={copyIndex}` (0, 1, 2, …) — the hook measures the
     * gap between the first cards of copy `0` and `1` to know how far one full loop is.
     */
    readonly railRef: RefObject<HTMLDivElement | null>;
    /** Wire to a "next" button's `onClick`. */
    readonly scrollNext: () => void;
    /** Wire to a "previous" button's `onClick`. */
    readonly scrollPrevious: () => void;
}

/**
 * @category Hook
 * @since 1.0.0
 */
export const UseQuoteMarquee = (): UseQuoteMarqueeResult =>
{
    const ContainerRef = useRef<HTMLDivElement>(null);
    const RailRef = useRef<HTMLDivElement>(null);
    const InstanceRef = useRef<MarqueeInstance | null>(null);

    useEffect(() =>
    {
        const Container = ContainerRef.current;
        const Rail = RailRef.current;

        if (Container === null || Rail === null)
        {
            return;
        }

        const MotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let ResumeTimeout: ReturnType<typeof setTimeout> | undefined;
        let RafHandle: number | undefined;
        let LastFrameTime = 0;
        let ScrollPosition = 0;
        let SingleSetWidth = 0;
        let IsInView = false;
        let IsPointerDragging = false;
        let IsPaused = false;
        let IgnoreScrollEventsUntil = 0;
        let PointerId: number | null = null;
        let DragStartX = 0;
        let DragStartScrollLeft = 0;

        const GetReducedMotion = (): boolean =>
        {
            return MotionQuery.matches;
        };

        const Measure = (): void =>
        {
            const FirstSetFirstCard = Rail.querySelector("[data-role='card'][data-copy='0']");
            const SecondSetFirstCard = Rail.querySelector("[data-role='card'][data-copy='1']");

            if (!(FirstSetFirstCard instanceof HTMLElement) || !(SecondSetFirstCard instanceof HTMLElement))
            {
                return;
            }

            SingleSetWidth = SecondSetFirstCard.offsetLeft - FirstSetFirstCard.offsetLeft;
        };

        const SetScrollLeft = (NextScrollLeft: number): void =>
        {
            ScrollPosition = NextScrollLeft;
            IgnoreScrollEventsUntil = performance.now() + ProgrammaticScrollSuppressionMs;
            Rail.scrollLeft = NextScrollLeft;
        };

        const NormalizeLoopPosition = (): void =>
        {
            if (SingleSetWidth <= 0)
            {
                return;
            }

            const Minimum = SingleSetWidth * 0.35;
            const Maximum = SingleSetWidth * 1.65;

            if (ScrollPosition < Minimum)
            {
                SetScrollLeft(ScrollPosition + SingleSetWidth);
                return;
            }

            if (ScrollPosition > Maximum)
            {
                SetScrollLeft(ScrollPosition - SingleSetWidth);
            }
        };

        const StopAutoScroll = (): void =>
        {
            if (RafHandle === undefined)
            {
                return;
            }

            cancelAnimationFrame(RafHandle);
            RafHandle = undefined;
        };

        const OnFrame = (Timestamp: number): void =>
        {
            RafHandle = undefined;

            if (!IsInView || IsPaused || GetReducedMotion())
            {
                return;
            }

            if (!IsPointerDragging)
            {
                const Delta = Math.min(Timestamp - LastFrameTime, 100);
                SetScrollLeft(ScrollPosition + Delta * AutoScrollSpeedPxPerMs);
                NormalizeLoopPosition();
            }

            LastFrameTime = Timestamp;
            RafHandle = requestAnimationFrame(OnFrame);
        };

        const StartAutoScroll = (): void =>
        {
            if (RafHandle !== undefined || GetReducedMotion())
            {
                return;
            }

            LastFrameTime = performance.now();
            RafHandle = requestAnimationFrame(OnFrame);
        };

        const UpdateAutoScrollState = (): void =>
        {
            if (!IsInView || IsPaused || GetReducedMotion())
            {
                StopAutoScroll();
                return;
            }

            StartAutoScroll();
        };

        const PauseAndScheduleResume = (): void =>
        {
            IsPaused = true;
            StopAutoScroll();

            if (ResumeTimeout !== undefined)
            {
                clearTimeout(ResumeTimeout);
            }

            ResumeTimeout = setTimeout(() =>
            {
                IsPaused = false;
                ResumeTimeout = undefined;
                UpdateAutoScrollState();
            }, ResumeDelayMs);
        };

        const ResumeImmediately = (): void =>
        {
            IsPaused = false;

            if (ResumeTimeout !== undefined)
            {
                clearTimeout(ResumeTimeout);
                ResumeTimeout = undefined;
            }

            UpdateAutoScrollState();
        };

        const ScrollByCard = (Direction: -1 | 1): void =>
        {
            const FirstCard = Rail.querySelector("[data-role='card']");

            if (!(FirstCard instanceof HTMLElement))
            {
                return;
            }

            const RailStyle = window.getComputedStyle(Rail);
            const GapValue = RailStyle.columnGap || RailStyle.gap || "0";
            const Gap = Number.parseFloat(GapValue);
            const ScrollAmount = FirstCard.offsetWidth + (Number.isNaN(Gap) ? 0 : Gap);

            PauseAndScheduleResume();

            Rail.scrollBy({
                behavior: GetReducedMotion() ? "auto" : "smooth",
                left: ScrollAmount * Direction
            });

            setTimeout(() =>
            {
                NormalizeLoopPosition();
            }, GetReducedMotion() ? 0 : 400);
        };

        const OnScroll = (): void =>
        {
            if (performance.now() < IgnoreScrollEventsUntil || IsPointerDragging)
            {
                return;
            }

            ScrollPosition = Rail.scrollLeft;
            PauseAndScheduleResume();
            NormalizeLoopPosition();
        };

        const OnPointerDown = (Event: PointerEvent): void =>
        {
            if (Event.button !== 0)
            {
                return;
            }

            IsPointerDragging = true;
            PointerId = Event.pointerId;
            DragStartX = Event.clientX;
            DragStartScrollLeft = Rail.scrollLeft;
            Rail.dataset.dragging = "true";
            PauseAndScheduleResume();
            Rail.setPointerCapture(Event.pointerId);
        };

        const OnPointerMove = (Event: PointerEvent): void =>
        {
            if (!IsPointerDragging || PointerId !== Event.pointerId)
            {
                return;
            }

            const Delta = Event.clientX - DragStartX;
            SetScrollLeft(DragStartScrollLeft - Delta * 1.4);
            NormalizeLoopPosition();
        };

        const OnPointerUp = (Event: PointerEvent): void =>
        {
            if (PointerId !== Event.pointerId)
            {
                return;
            }

            if (Rail.hasPointerCapture(Event.pointerId))
            {
                Rail.releasePointerCapture(Event.pointerId);
            }

            IsPointerDragging = false;
            PointerId = null;
            Rail.dataset.dragging = "false";
        };

        const OnPointerLeave = (): void =>
        {
            if (!IsPointerDragging)
            {
                Rail.dataset.dragging = "false";
            }
        };

        const OnMouseEnter = (): void =>
        {
            PauseAndScheduleResume();
        };

        const OnMouseLeave = (): void =>
        {
            if (!IsPointerDragging)
            {
                ResumeImmediately();
            }
        };

        const OnFocusIn = (): void =>
        {
            PauseAndScheduleResume();
        };

        const OnFocusOut = (): void =>
        {
            ResumeImmediately();
        };

        const OnMotionPreferenceChange = (): void =>
        {
            UpdateAutoScrollState();
        };

        Measure();

        if (SingleSetWidth > 0)
        {
            requestAnimationFrame(() =>
            {
                SetScrollLeft(SingleSetWidth);
            });
        }

        Rail.addEventListener("scroll", OnScroll, { passive: true });
        Rail.addEventListener("pointerdown", OnPointerDown);
        Rail.addEventListener("pointermove", OnPointerMove);
        Rail.addEventListener("pointerup", OnPointerUp);
        Rail.addEventListener("pointercancel", OnPointerUp);
        Rail.addEventListener("pointerleave", OnPointerLeave);
        Rail.addEventListener("mouseenter", OnMouseEnter);
        Rail.addEventListener("mouseleave", OnMouseLeave);
        Rail.addEventListener("focusin", OnFocusIn);
        Rail.addEventListener("focusout", OnFocusOut);
        MotionQuery.addEventListener("change", OnMotionPreferenceChange);

        const Observer = new IntersectionObserver((Entries) =>
        {
            const [ Entry ] = Entries;
            IsInView = Entry?.isIntersecting === true;
            UpdateAutoScrollState();
        }, { threshold: ObserverThreshold });

        Observer.observe(Container);

        const SizeObserver = new ResizeObserver(() =>
        {
            const PreviousWidth = SingleSetWidth;
            const PreviousProgress = PreviousWidth > 0 ? Rail.scrollLeft / PreviousWidth : 1;

            Measure();

            if (SingleSetWidth > 0)
            {
                SetScrollLeft(SingleSetWidth * PreviousProgress);
                NormalizeLoopPosition();
            }
        });

        SizeObserver.observe(Container);

        InstanceRef.current = { scrollByCard: ScrollByCard };
        UpdateAutoScrollState();

        return () =>
        {
            Observer.disconnect();
            SizeObserver.disconnect();
            StopAutoScroll();

            if (ResumeTimeout !== undefined)
            {
                clearTimeout(ResumeTimeout);
            }

            Rail.removeEventListener("scroll", OnScroll);
            Rail.removeEventListener("pointerdown", OnPointerDown);
            Rail.removeEventListener("pointermove", OnPointerMove);
            Rail.removeEventListener("pointerup", OnPointerUp);
            Rail.removeEventListener("pointercancel", OnPointerUp);
            Rail.removeEventListener("pointerleave", OnPointerLeave);
            Rail.removeEventListener("mouseenter", OnMouseEnter);
            Rail.removeEventListener("mouseleave", OnMouseLeave);
            Rail.removeEventListener("focusin", OnFocusIn);
            Rail.removeEventListener("focusout", OnFocusOut);
            MotionQuery.removeEventListener("change", OnMotionPreferenceChange);
            InstanceRef.current = null;
        };
    }, []);

    const ScrollPrevious = useCallback((): void =>
    {
        InstanceRef.current?.scrollByCard(-1);
    }, []);

    const ScrollNext = useCallback((): void =>
    {
        InstanceRef.current?.scrollByCard(1);
    }, []);

    return {
        containerRef: ContainerRef,
        railRef: RailRef,
        scrollNext: ScrollNext,
        scrollPrevious: ScrollPrevious
    };
};
