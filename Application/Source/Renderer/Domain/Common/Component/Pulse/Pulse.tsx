/* File:      Pulse.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type ReactElement, useState } from "react";
// import { createPresenceComponentVariant, motionTokens } from "@fluentui/react-components";
// import { Fade } from "@fluentui/react-motion-components-preview";
import type { PPulse } from "./Pulse.Types";

/* eslint-disable-next-line @typescript-eslint/typedef */
// const CustomFadeVariant = createPresenceComponentVariant(Fade, {
//     duration: motionTokens.durationUltraSlow,
//     easing: motionTokens.curveEasyEase,
//     exitDuration: motionTokens.durationUltraSlow
// });

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

    // @TODO Temporary.
    return <div></div>;
    // return (
    //     <CustomFadeVariant
    //         appear
    //         { ...{ onMotionFinish, visible } }>
    //         { children }
    //     </CustomFadeVariant>
    // );
};
