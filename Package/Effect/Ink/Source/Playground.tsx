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
    type PromptRunError,
    Run,
    SelectPrompt,
    TextPrompt
} from "./Prompt/Prompt.tsx";
import { Console, Effect, type PlatformError } from "effect";
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
            ...Array.from({ length: 50 }, (_: unknown, Index: number) => ({ Label: "Foo", Value: "Foo" + Index.toString() }))
        ] as const,
        Message: "Package manager?"
    }),

    Confirmed: ConfirmPrompt({
        InitialValue: true,
        Message: "Continue?"
    })
});

// /* eslint-disable-next-line @typescript-eslint/typedef */
// const Main = pipe(
//     Run(Program),
//     /* eslint-disable-next-line @typescript-eslint/typedef */
//     Effect.match({
//         onFailure: Console.log,
//         onSuccess: Console.log
//     })
//     // Effect.flatMap(Console.log)
// );

// eslint-disable-next-line @typescript-eslint/typedef
const Foo = Effect.gen(function* ()
{
    // eslint-disable-next-line @typescript-eslint/typedef
    const Out = Run(Program);

    // eslint-disable-next-line @typescript-eslint/typedef
    const Bar = Effect.matchEffect(Out, {
        onFailure: (Value: PromptRunError | PlatformError.PlatformError) =>
        {
            return Effect.gen(function* ()
            {
                yield* Console.log("Foo\n".repeat(10));
                yield* Console.dir(Value);
            });
        },
        onSuccess: (Value: unknown) =>
        {
            return Effect.gen(function* ()
            {
                yield* Console.log("Foo\n".repeat(10));
                yield* Console.dir(Value);
            });
        }
    });

    yield* Bar;
    // Effect.flatMap(Console.log)
});

// Effect.runPromise(Main);
// Effect.runPromise(Foo);
NodeRuntime.runMain(
    Effect.provide(Foo, NodeTerminal.layer)
);
