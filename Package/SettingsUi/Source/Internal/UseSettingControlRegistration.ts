/**
 * Wires a {@link Setting} or {@link SettingGroup} into an ancestor
 * {@link SettingControlsProvider}, when one and an `Id` are both present.
 *
 * @module @sorrell/settings-ui/Internal/UseSettingControlRegistration
 *
 * @file      UseSettingControlRegistration.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import
{
    type ReactNode,
    type RefObject,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef
} from "react";
import type { MotionImperativeRef } from "@fluentui/react-motion";
import { SettingControlsContext } from "../SettingControlsContext.js";

/** Options for {@link UseSettingControlRegistration}. */
export interface UseSettingControlRegistrationOptions
{
    readonly Id?: string | undefined;
    readonly Subtitle?: ReactNode;
    readonly Title: ReactNode;
}

/** Return value of {@link UseSettingControlRegistration}. */
export interface UseSettingControlRegistrationResult<TargetElement extends HTMLElement>
{
    /** Attach to the component's root element. */
    readonly NodeRef: RefObject<TargetElement | null>;

    /** Pass to the wrapping `<PulseMotion imperativeRef={ PulseHandleRef } ...>`. */
    readonly PulseHandleRef: RefObject<MotionImperativeRef | undefined>;
}

/**
 * When both an ancestor {@link SettingControlsProvider} and `Id` are present, registers this
 * component's title/subtitle/element with it and arms the pulse motion so only an explicit
 * `ScrollToAndPulse` call - never the mount itself - plays it. A no-op otherwise.
 */
export function UseSettingControlRegistration<TargetElement extends HTMLElement>(
    { Id, Subtitle, Title }: UseSettingControlRegistrationOptions
): UseSettingControlRegistrationResult<TargetElement>
{
    const NodeRef = useRef<TargetElement>(null);
    const PulseHandleRef = useRef<MotionImperativeRef | undefined>(undefined);
    const Context = useContext(SettingControlsContext);

    useLayoutEffect(() =>
    {
        // Suppress the pulse motion's initial auto-play; only an explicit pulse request
        // (below) should ever run it.
        PulseHandleRef.current?.setPlayState("paused");
    }, [ ]);

    useEffect(() =>
    {
        if (Context === undefined || Id === undefined)
        {
            return undefined;
        }

        return Context.Register(Id, { Subtitle, Title }, NodeRef.current);
    }, [ Context, Id, Title, Subtitle ]);

    useEffect(() =>
    {
        if (Context === undefined || Id === undefined)
        {
            return undefined;
        }

        return Context.SubscribePulse(Id, () => PulseHandleRef.current?.setPlayState("running"));
    }, [ Context, Id ]);

    return { NodeRef, PulseHandleRef };
}
