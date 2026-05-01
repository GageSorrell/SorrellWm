/**
 * @file      CompoundSettingSegmentBodyContainer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Collapse } from "@fluentui/react-motion-components-preview";
import type { JSXElement } from "@fluentui/react-components";
import type { ReactNode } from "react";
import type { TPropsWithChildren } from "@sorrell/react";
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
