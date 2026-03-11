/* File:      CompoundSettingSegment.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CCompoundSettingSegment, PCompoundSettingSegment } from "./CompoundSettingSegment.Types";
import {
    type CSSProperties,
    type Context,
    type ReactNode,
    createContext,
    useContext,
    useState } from "react";

const EmptyContext: CCompoundSettingSegment =
{
    IsExpanded: false,
    OnChangeExpanded: (): void =>
    {

    }
};

const CompoundSettingSegmentContext: Context<CCompoundSettingSegment> =
    createContext<CCompoundSettingSegment>(EmptyContext);

export const UseCompoundContext = (): CCompoundSettingSegment =>
{
    return useContext<CCompoundSettingSegment>(CompoundSettingSegmentContext);
};

export const CompoundSettingSegment = ({ children }: PCompoundSettingSegment): ReactNode =>
{
    const RootStyle: CSSProperties =
    {

    };

    const [ IsExpanded, SetIsExpanded ] = useState<boolean>(false);

    const OnChangeExpanded = (): void =>
    {
        SetIsExpanded((Old: boolean): boolean =>
        {
            return !Old;
        });
    };

    const value: CCompoundSettingSegment =
    {
        IsExpanded,
        OnChangeExpanded
    };

    return (
        <CompoundSettingSegmentContext.Provider { ...{ value } }>
            <div style={ RootStyle }>
                { children }
            </div>
        </CompoundSettingSegmentContext.Provider>
    );
};
