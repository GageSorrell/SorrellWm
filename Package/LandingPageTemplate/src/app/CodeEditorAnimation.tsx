/**
 * @file      CodeEditorAnimation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

/* eslint-disable jsdoc/require-jsdoc */

import { CodeCard, UseBuildCodeSnapshots } from "./CodeEditorAnimation.Internal";
import type { FCodeSnapshot, FIntellisenseContent } from "./CodeEditorAnimation.Internal.Types";
import { type ReactNode, useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { LoadOperatorMonoFont } from "./Font";
import type { PCodeEditorAnimation } from "./CodeEditorAnimation.Types";

// export function CodeEditorAnimation({
//     Code,
//     CursorPosition
// }: PCodeEditorAnimation): ReactNode
// {
//     const [ Lines, SetLines ] = useState<Array<FCodeLine>>([ ]);
//     const [ RenderHandle ] = useState<number>(() =>
//     {
//         return delayRender("Loading highlighted code.");
//     });

//     const [ BuildCodeLines ] = UseBuildCodeLines();

//     useEffect(LoadOperatorMonoFont, [ ]);

//     useEffect((): () => void =>
//     {
//         let IsActive: boolean = true;

//         BuildCodeLines(Code, {
//             BaseKey: "code",
//             Language: "tsx"
//         }).then((NextLines: Array<FCodeLine>): void =>
//         {
//             if (IsActive === true)
//             {
//                 SetLines(NextLines);
//             }

//             continueRender(RenderHandle);
//         }).catch((Error: unknown): void =>
//         {
//             cancelRender(Error);
//         });

//         return (): void =>
//         {
//             IsActive = false;
//         };
//     }, [ BuildCodeLines, Code, RenderHandle ]);

//     return (
//         <CodeCard
//             Code={ Code }
//             CursorPosition={ CursorPosition }
//             Lines={ Lines }
//         />
//     );
// }

// export function CodeEditorAnimation({
//     Changes = [ ],
//     CursorPosition,
//     InitialCode
// }: PCodeEditorAnimation): ReactNode
// {
//     const [ Snapshots, SetSnapshots ] = useState<Array<FCodeSnapshot>>([ ]);
//     const [ BuildCodeSnapshots ] = UseBuildCodeSnapshots();

//     const [ RenderHandle ] = useState<number>(() =>
//     {
//         return delayRender("Loading highlighted code snapshots.");
//     });

//     useEffect(LoadOperatorMonoFont, [ ]);

//     useEffect((): () => void =>
//     {
//         let IsActive: boolean = true;

//         BuildCodeSnapshots(
//             InitialCode,
//             Changes,
//             {
//                 BaseKey: "code",
//                 InitialCursorPosition: CursorPosition,
//                 Language: "tsx"
//             }
//         ).then((NextSnapshots: Array<FCodeSnapshot>): void =>
//         {
//             if (IsActive === true)
//             {
//                 SetSnapshots(NextSnapshots);
//             }

//             continueRender(RenderHandle);
//         }).catch((Error: unknown): void =>
//         {
//             cancelRender(Error);
//         });

//         return (): void =>
//         {
//             IsActive = false;
//         };
//     }, [
//         BuildCodeSnapshots,
//         Changes,
//         CursorPosition,
//         InitialCode,
//         RenderHandle
//     ]);

//     return (
//         <CodeCard { ...{ Changes, CursorPosition, InitialCode, Snapshots } } />
//     );
// }

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
