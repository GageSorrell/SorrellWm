/**
 * The background-color pulse motion shared by {@link Setting} and {@link SettingGroup}.
 *
 * @module @sorrell/settings-ui/Internal/PulseMotion
 *
 * @file      PulseMotion.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createMotionComponent, motionTokens } from "@fluentui/react-motion";
import { tokens } from "@fluentui/react-components";

/** Props specific to {@link PulseMotion}, beyond the standard motion component props. */
export type PulseMotionParams = { readonly RestingColor: string };

/**
 * Wraps a single child element and pulses its background color, twice, between
 * {@link PulseMotionParams.RestingColor} and the "hovered" neutral background. The motion
 * plays once on mount (immediately suppressed - see `UseSettingControlRegistration`) and is
 * replayed on demand by resuming its `imperativeRef` handle.
 */
export const PulseMotion = createMotionComponent<PulseMotionParams>(({ RestingColor }) => ({
    duration: motionTokens.durationSlower,
    easing: motionTokens.curveEasyEase,
    iterations: 2,
    keyframes: [
        { backgroundColor: RestingColor },
        { backgroundColor: tokens.colorNeutralBackground1Hover },
        { backgroundColor: RestingColor }
    ]
}));
