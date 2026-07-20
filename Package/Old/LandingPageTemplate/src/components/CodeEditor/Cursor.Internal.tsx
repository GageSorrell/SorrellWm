/**
 * @file      Cursor.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { CCursorPosition, FCursorPositionContext } from "./Cursor.Internal.Types";
import {
    type Context,
    type PropsWithChildren,
    type ReactNode,
    createContext,
    useContext,
    useState } from "react";

const EmptyContext: CCursorPosition =
    {
        Positions: [ ] as const,
        SetPositions: undefined as unknown as CCursorPosition["SetPositions"]
    } as const;

const CursorProvider: Context<CCursorPosition> = createContext(EmptyContext);

export function UseCursor(): FCursorPositionContext
{
    const { Positions, SetPositions } = useContext<CCursorPosition>(CursorProvider);
    return [ Positions, SetPositions ] as const;
}

export function CursorPositionProvider({ children }: PropsWithChildren): ReactNode
{
    const [ Positions, SetPositions ] = useState<ReadonlyArray<number>>([ ]);

    const Value: CCursorPosition =
        {
            Positions,
            SetPositions
        } as const;

    return (
        <CursorProvider.Provider value={ Value }>
            { children }
        </CursorProvider.Provider>
    );
};
