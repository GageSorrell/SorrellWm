/* File:      CompoundSettingSegmentBodyContainer.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Collapse } from "@fluentui/react-motion-components-preview";
import type { JSXElement } from "@fluentui/react-components";
import type { ReactNode } from "react";
import type { TPropsWithChildren } from "@/Utility";
import { UseCompoundContext } from "./CompoundSettingSegment";

export const CompoundSettingSegmentBodyContainer = (
    { children }: TPropsWithChildren<JSXElement>
): ReactNode =>
{
    const { IsExpanded } = UseCompoundContext();
    return (
        <Collapse
            unmountOnExit
            visible={ IsExpanded }>
            <div>
                { children }
            </div>
        </Collapse>
    );
};
