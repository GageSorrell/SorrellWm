/* File:      CommandList.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// import type { CSSProperties, ReactNode } from "react";
// import {
//     Command,
//     type FCommand,
//     type FCompoundCommand,
//     type FSimpleCommand,
//     type FSubCommand,
//     SwitchOnCommandType } from "../Command";
// import type { FKeybindId } from "!/Settings";
// import { Key } from "../Keyboard";
// import type { PCommandList } from "./CommandList.Types";
// import { UseCommands } from "@/Command";

export const CommandList: string = "Foo";

// export const CommandList = ({ Commands }: PCommandList): ReactNode =>
// {
//     const RootStyle: CSSProperties =
//     {
//         alignItems: "flex-start",
//         display: "flex",
//         flexDirection: "row",
//         justifyContent: "flex-start"
//     };

//     const ColumnStyleBase: CSSProperties =
//     {
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "flex-start"
//     };

//     const KeybindColumnStyle: CSSProperties =
//     {
//         ...ColumnStyleBase,
//         alignItems: "flex-end"
//     };

//     const NameColumnStyle: CSSProperties =
//     {
//         ...ColumnStyleBase,
//         alignItems: "flex-start"
//     };

//     UseCommands(Commands);

//     const GetKeyComponentsFromCommand = (InCommand: FCommand): ReactNode =>
//     {
//         const GetComponentFromKeybind = (Keybind: FKeybindId): ReactNode =>
//         {
//             return (
//                 <Key
//                     Value={ Keybind[0] }
//                     key={ InCommand.Name + Keybind[0] }
//                 />
//             );
//         };

//         return SwitchOnCommandType(
//             InCommand,
//             ({ Keybinds }: FSimpleCommand): ReactNode =>
//             {
//                 return GetComponentFromKeybind(Keybinds[0]);
//             },
//             ({ SubCommands }: FCompoundCommand): ReactNode =>
//             {
//                 return SubCommands.map(({ Keybinds }: FSubCommand): ReactNode =>
//                 {
//                     return GetComponentFromKeybind(Keybinds[0]);
//                 });
//             }
//         );
//     };

//     return (
//         <div style={ RootStyle }>
//             <div style={ KeybindColumnStyle }>
//                 {
//                     Commands.map(GetKeyComponentsFromCommand)
//                 }
//             </div>
//             <div style={ NameColumnStyle }>
//                 {
//                     Commands.map((InCommand: FCommand): ReactNode => (
//                         <Command
//                             key={ InCommand.Name }
//                             { ...InCommand }
//                         />
//                     ))
//                 }
//             </div>
//         </div>
//     );
// };
