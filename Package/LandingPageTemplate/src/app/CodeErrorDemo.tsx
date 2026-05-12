/**
 * @file      CodeErrorDemo.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

/* eslint-disable jsdoc/require-jsdoc */

import { BuildCodeLines, CodeCard } from "./CodeErrorDemo.Internal";
import { type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { UseSwitchOnTheme, UseTheme } from "@sorrell/react/client";
import { AbsoluteFill } from "remotion";
import type { FCodeLine } from "./CodeErrorDemo.Internal.Types";
import { LoadOperatorMonoFont } from "./Font";
import { useTheme } from "next-themes";

export function CodeErrorDemo(): ReactNode
{
    useEffect(LoadOperatorMonoFont, [ ]);

    //     const OldCode: string = `const program: Effect<void, Error, UsersRepo>

    // program.pipe(
    //     Effect.provide(UsersRepoLive),
    //     Effect.runPromise
    // )`;

    const OldCode: string = "ipcMain.handle(";

    const NewCode: string = "ipcMain.handle(\"GetSettings\"";

    // `const program: Effect<void, never, UsersRepo>

    // program.pipe(
    //     Effect.provide(UsersRepoLive),
    //     Effect.runPromise
    // )`;

    const ErrorStartColumn: number = OldCode
        .split("\n")[0]
        .indexOf("Error");

    const [ OldLines, SetOldLines ] = useState<Array<FCodeLine>>([ ]);
    const [ NewLines, SetNewLines ] = useState<Array<FCodeLine>>([ ]);

    const { Theme } = UseTheme();

    useEffect((): void =>
    {
        BuildCodeLines(OldCode, {
            // Annotations:
            // [
            //     {
            //         ClassName: "Error",
            //         EndColumn: ErrorStartColumn + "Error".length,
            //         HasSquiggle: true,
            //         LineIndex: 0,
            //         StartColumn: ErrorStartColumn
            //     }
            // ],
            BaseKey: "old",
            Language: "tsx",
            Theme
        }).then(SetOldLines);

        BuildCodeLines(
            NewCode,
            {
                BaseKey: "new",
                Language: "tsx",
                Theme
            }).then(SetNewLines);
    }, [ ErrorStartColumn, NewCode, OldCode, Theme ]);

    return (
        <CodeCard
            New={ NewLines }
            Old={ OldLines }
        />
    );
};
