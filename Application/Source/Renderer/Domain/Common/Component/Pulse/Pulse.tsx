/* File:      Pulse.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type MotionImperativeRef, createPresenceComponent, motionTokens } from "@fluentui/react-components";
import { type MutableRefObject, type ReactElement, useEffect, useRef, useState } from "react";
import type { PPulse } from "./Pulse.Types";
import { createFadePresence } from "@fluentui/react-motion-components-preview";

/* eslint-disable-next-line @typescript-eslint/typedef */
const CustomFadeVariant = createPresenceComponent(
    createFadePresence({
        enterDuration: motionTokens.durationUltraSlow,
        enterEasing: motionTokens.curveEasyEase,
        exitDuration: motionTokens.durationUltraSlow
    })
);

export const Pulse = ({ children }: PPulse): ReactElement =>
{
    const [ visible, SetVisible ] = useState<boolean>(true);
    const onMotionFinish = (): void =>
    {
        SetVisible((Old: boolean): boolean =>
        {
            return !Old;
        });
    };

    return (
        <CustomFadeVariant
            appear
            { ...{ onMotionFinish, visible } }>
            { children }
        </CustomFadeVariant>
    );
};
