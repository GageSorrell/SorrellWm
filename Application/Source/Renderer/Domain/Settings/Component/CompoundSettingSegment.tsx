/**
 * @file      CompoundSettingSegment.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CCompoundSettingSegment, PCompoundSettingSegment } from "./CompoundSettingSegment.Types";
import {
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
            <div>
                { children }
            </div>
        </CompoundSettingSegmentContext.Provider>
    );
};
