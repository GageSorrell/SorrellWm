/**
 * CSS `-webkit-app-region` declarations for the frameless settings window's drag regions.
 *
 * @module @sorrell/wm/Renderer/AppRegion
 *
 * @file      AppRegion.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** Make an element (and its non-opted-out descendants) drag the window. */
const DragRegion: Record<string, string> = { WebkitAppRegion: "drag" };

export/** Opt an interactive element out of an ancestor's drag region. */
const NoDragRegion: Record<string, string> = { WebkitAppRegion: "no-drag" };
