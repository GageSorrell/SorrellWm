/**
 * @file      CodeEditorAnimation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

/* eslint-disable jsdoc/require-jsdoc */

import { CodeCard, UseBuildCodeSnapshots } from "./CodeEditor.Internal";
import type { FCodeSnapshot, FIntellisenseContent } from "./CodeEditor.Internal.Types";
import { type ReactNode, useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { LoadOperatorMonoFont } from "../../app/Font";
import type { PCodeEditorAnimation } from "./CodeEditor.Types";

export function CodeEditorAnimation({
    Changes = [ ],
    CursorPosition,
    InitialCode,
    InitialIntellisense,
    Intellisense
}: PCodeEditorAnimation): ReactNode
{
    const [ Snapshots, SetSnapshots ] = useState<Array<FCodeSnapshot>>([ ]);
    const [ BuildCodeSnapshots ] = UseBuildCodeSnapshots();

    const StartingIntellisense: FIntellisenseContent | undefined =
        InitialIntellisense ?? Intellisense;

    const [ RenderHandle ] = useState<number>(() =>
    {
        return delayRender("Loading highlighted code snapshots.");
    });

    useEffect(LoadOperatorMonoFont, [ ]);

    useEffect((): () => void =>
    {
        let IsActive: boolean = true;

        BuildCodeSnapshots(
            InitialCode,
            Changes,
            {
                BaseKey: "code",
                InitialCursorPosition: CursorPosition,
                InitialIntellisense: StartingIntellisense,
                Language: "tsx"
            }
        ).then((NextSnapshots: Array<FCodeSnapshot>): void =>
        {
            if (IsActive === true)
            {
                SetSnapshots(NextSnapshots);
            }

            continueRender(RenderHandle);
        }).catch((Error: unknown): void =>
        {
            cancelRender(Error);
        });

        return (): void =>
        {
            IsActive = false;
        };
    }, [
        BuildCodeSnapshots,
        Changes,
        CursorPosition,
        InitialCode,
        RenderHandle,
        StartingIntellisense
    ]);

    return (
        <CodeCard
            Changes={ Changes }
            CursorPosition={ CursorPosition }
            InitialCode={ InitialCode }
            Snapshots={ Snapshots }
        />
    );
}
