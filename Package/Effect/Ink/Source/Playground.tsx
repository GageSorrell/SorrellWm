/**
 * @file      Playground.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// import { type AppProps, Box, Text, useApp } from "ink";
// import { Effect, pipe } from "effect";
// import { layerLive, run } from "./Ink/Ink.ts";
// import { useEffect, useState } from "react";
// import { Input } from "./Component/Input/Input.tsx";
// import { NodeRuntime } from "@effect/platform-node";

// function HelloView()
// {
//     const App: AppProps = useApp();

//     useEffect(() =>
//     {
//         const Timeout: NodeJS.Timeout = setTimeout(App.exit, 100_000_000);

//         return () => clearTimeout(Timeout);
//     }, [ App ]);

//     const [ InputText, SetInputText ] = useState<string>("");

//     return (
//         <Box flexDirection="column">
//             <Text
//                 bold
//                 color="cyan">
//                 @sorrell/effect-ink
//             </Text>
//             <Text>
//                 Hello from Ink, rendered through Effect.
//             </Text>
//             <Input
//                 onChange={ SetInputText }
//                 value={ InputText }
//             />
//         </Box>
//     );
// }

// NodeRuntime.runMain(
//     pipe(
//         run(
//             <HelloView />,
//             {
//                 exitOnCtrlC: true,
//                 interactive: true,
//                 patchConsole: false
//             }
//         ),
//         Effect.provide(layerLive)
//     )
// );

import {
    All,
    ConfirmPrompt,
    Run,
    SelectPrompt,
    TextPrompt
} from "./Prompt.tsx";
import { Array, Console, Effect, pipe } from "effect";
// import { Console, Effect, pipe } from "effect";
import { NodeRuntime, NodeTerminal } from "@effect/platform-node";

/* eslint-disable-next-line @typescript-eslint/typedef */
const Program = All({
    Name: TextPrompt({
        Message: "Name?",
        Placeholder: "Gage",
        Validate: (Value: string) =>
        {
            return Value.trim().length > 0
                ? true
                : "String must be non-empty.";
        }
    }),

    PackageManager: SelectPrompt({
        Choices: [
            {
                Hint: "NodeJS Package Manager",
                Label: "npm",
                Value: "npm"
            },
            {
                Label: "pnpm",
                Value: "pnpm"
            },
            {
                Label: "yarn",
                Value: "yarn"
            },
            ...Array.range(0, 49)
                .map((Value: number) => `Entry #${ Value }`)
                .map((Value: string) => ({ Label: Value, Value }))
        ] as const,
        Message: "Package manager?"
    }),

    Confirmed: ConfirmPrompt({
        InitialValue: true,
        Message: "Continue?"
    })
});

/* eslint-disable-next-line @typescript-eslint/typedef */
const Main = pipe(
    Run(Program),
    Effect.map(Console.log)
);

// eslint-disable-next-line @typescript-eslint/typedef
NodeRuntime.runMain(
    Effect.provide(Main, NodeTerminal.layer)
);
