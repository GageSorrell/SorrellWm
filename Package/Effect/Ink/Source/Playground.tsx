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
