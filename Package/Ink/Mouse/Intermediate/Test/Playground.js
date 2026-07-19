import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @file      Playground.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
// import * as Animation from "./Animation.tsx";
import * as Ink from "ink";
import * as Mouse from "../index.js";
import * as React from "react";
import { Array, Number, Struct } from "effect";
import CliBoxes, {} from "cli-boxes";
/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-jsdoc */
// export type MouseDiagramPart =
//     | "Left"
//     | "Right"
//     | "Middle"
//     | "WheelUp"
//     | "WheelDown"
//     | "WheelLeft"
//     | "WheelRight"
//     | "Button8"
//     | "Button9"
//     | "Button10"
//     | "Button11";
// export interface MouseDiagramPartStyle extends Pick<Ink.TextProps, "backgroundColor" | "color"> { }
// export type MouseDiagramStyles = Partial<Record<MouseDiagramPart, MouseDiagramPartStyle>>;
// export interface MouseDiagramProps
// {
//     readonly Styles?: MouseDiagramStyles;
// }
// interface StyledPartProps
// {
//     readonly Part: MouseDiagramPart;
//     readonly TextContent: string;
//     readonly Styles?: MouseDiagramStyles;
// }
// function StyledPart({
//     Part,
//     TextContent,
//     Styles
// }: StyledPartProps): React.ReactElement
// {
//     const Style: MouseDiagramPartStyle = Styles?.[Part] ?? { };
//     return (
//         <Ink.Text { ...Style }>
//             { TextContent }
//         </Ink.Text>
//     );
// }
const MouseDiagram = () => {
    const Part = (Props) => {
        return _jsx(Ink.Box, { height: 9, ...Props });
    };
    const Lmb = () => {
        const borderStyle = {
            ...CliBoxes.singleDouble,
            ...Struct.pick(CliBoxes.single, ["bottomRight", "right", "topRight"])
        };
        return _jsx(Part, { borderRight: false, width: 10, borderStyle });
    };
    const Rmb = () => {
        const borderStyle = {
            ...CliBoxes.singleDouble,
            ...Struct.pick(CliBoxes.single, ["bottomLeft", "left", "topLeft"])
        };
        return _jsx(Part, { borderLeft: false, width: 11, borderStyle });
    };
    return (_jsxs(Ink.Box, { height: 21, position: "relative", width: 21, children: [_jsxs(Ink.Box, { flexDirection: "column", children: [_jsxs(Ink.Box, { flexDirection: "row", flexGrow: 1, children: [_jsx(Lmb, {}), _jsx(Rmb, {})] }), _jsx(Ink.Box, { borderStyle: "round", borderTop: false, height: 12 })] }), _jsx(Ink.Box, { alignItems: "flex-end", flexDirection: "column", justifyContent: "flex-start", left: "0%", position: "absolute", right: "0%", top: 11, children: _jsxs(Ink.Box, { flexDirection: "column", children: [_jsx(Ink.Box, { borderStyle: "round", marginRight: 1, minHeight: 3, minWidth: 2 }), _jsx(Ink.Box, { borderStyle: "round", marginRight: 1, minHeight: 3, minWidth: 2 })] }) }), _jsxs(Ink.Box, { alignItems: "center", flexDirection: "column", left: "0%", position: "absolute", right: "0%", top: 0, children: [_jsx(Ink.Text, { children: "\u252C" }), _jsx(Ink.Text, { children: "\u2502" }), _jsx(Ink.Text, { children: "\u2502" }), _jsx(Ink.Text, { children: "\u2502" })] }), _jsx(Ink.Box, { justifyContent: "center", left: "0%", position: "absolute", right: "0%", top: 0, children: _jsx(Ink.Box, { borderStyle: "round", marginTop: 3, minHeight: 4, minWidth: 3 }) }), _jsxs(Ink.Box, { alignItems: "center", flexDirection: "column", left: "0%", position: "absolute", right: "0%", top: 7, children: [_jsx(Ink.Text, { children: "\u2502" }), _jsx(Ink.Text, { children: "\u2534" })] })] }));
    // return (
    //     <Ink.Box flexDirection="column">
    //         <Ink.Text>{"        ╭───────────────╮        "}</Ink.Text>
    //         <Ink.Text>
    //             {"     ╭──"}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent="──────"
    //                 { ...{ Styles } }
    //             />
    //             {"┬"}
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="──────"
    //                 { ...{ Styles } }
    //             />
    //             {"──╮     "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {"   ╭─╯  "}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent=" LEFT "
    //                 { ...{ Styles } }
    //             />
    //             {"│"}
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="RIGHT "
    //                 { ...{ Styles } }
    //             />
    //             {"  ╰─╮   "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {"  ╭╯    "}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent="      "
    //                 { ...{ Styles } }
    //             />
    //             {"│"}
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="      "
    //                 { ...{ Styles } }
    //             />
    //             {"    ╰╮  "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {" ╭╯     "}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent="   "
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="WheelLeft"
    //                 TextContent="◀"
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="WheelUp"
    //                 TextContent="▲"
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="WheelRight"
    //                 TextContent="▶"
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="   "
    //                 { ...{ Styles } }
    //             />
    //             {"     ╰╮ "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {" │ "}
    //             <StyledPart
    //                 Part="Button8"
    //                 TextContent=" B8 "
    //                 { ...{ Styles } }
    //             />
    //             {"   "}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent="  "
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="Middle"
    //                 TextContent=" │ "
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="  "
    //                 { ...{ Styles } }
    //             />
    //             {"   "}
    //             <StyledPart
    //                 Part="Button10"
    //                 TextContent=" B10 "
    //                 { ...{ Styles } }
    //             />
    //             {"│ "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {" │ "}
    //             <StyledPart
    //                 Part="Button9"
    //                 TextContent=" B9 "
    //                 { ...{ Styles } }
    //             />
    //             {"   "}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent="  "
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="Middle"
    //                 TextContent=" │ "
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="  "
    //                 { ...{ Styles } }
    //             />
    //             {"   "}
    //             <StyledPart
    //                 Part="Button11"
    //                 TextContent=" B11 "
    //                 { ...{ Styles } }
    //             />
    //             {"│ "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {" ╰╮     "}
    //             <StyledPart
    //                 Part="Left"
    //                 TextContent="   "
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="WheelLeft"
    //                 TextContent="◀"
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="WheelDown"
    //                 TextContent="▼"
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="WheelRight"
    //                 TextContent="▶"
    //                 { ...{ Styles } }
    //             />
    //             <StyledPart
    //                 Part="Right"
    //                 TextContent="   "
    //                 { ...{ Styles } }
    //             />
    //             {"     ╭╯ "}
    //         </Ink.Text>
    //         <Ink.Text>
    //             {"  ╰╮      "}
    //             <StyledPart
    //                 Part="Middle"
    //                 TextContent="MIDDLE"
    //                 { ...{ Styles } }
    //             />
    //             {"      ╭╯  "}
    //         </Ink.Text>
    //         <Ink.Text>{"   ╰─╮             ╭─╯   "}</Ink.Text>
    //         <Ink.Text>{"     ╰──╮       ╭──╯     "}</Ink.Text>
    //         <Ink.Text>{"        ╰───────╯        "}</Ink.Text>
    //     </Ink.Box>
    // );
};
export const RootComponent = () => {
    const { rows: height, columns: width } = Ink.useWindowSize();
    const [MousePosition, SetMousePosition] = React.useState(undefined);
    Mouse.useTerminalMouseTracking({
        OnEvent: (Event) => {
            if (Event._tag === "Move"
                || Event._tag === "Drag"
                || Event._tag === "Press"
                || Event._tag === "Release"
                || Event._tag === "Wheel") {
                SetMousePosition({
                    X: Event.Position.Column,
                    Y: Event.Position.Row
                });
            }
        }
    });
    /* eslint-disable @stylistic/max-len */
    // const AtSorrellDisplay: string = Array.join(
    //     [
    //         " [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▄[0m                                   [38;2;255;255;255m▀[0m[38;2;255;255;255m█[0m  [38;2;255;255;255m▀[0m[38;2;255;255;255m█[0m    [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m",
    //         "[38;2;255;255;255m█[0m [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▄[0m [38;2;255;255;255m█[0m  [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m  [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▄[0m  [38;2;255;255;255m█[0m[38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m  [38;2;255;255;255m█[0m[38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m  [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▄[0m   [38;2;255;255;255m█[0m   [38;2;255;255;255m█[0m   [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m ",
    //         "[38;2;255;255;255m█[0m  [38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m    [38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▄[0m  [38;2;255;255;255m█[0m   [38;2;255;255;255m█[0m  [38;2;255;255;255m█[0m     [38;2;255;255;255m█[0m     [38;2;255;255;255m█[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m   [38;2;255;255;255m█[0m   [38;2;255;255;255m█[0m  [38;2;255;255;255m▄[0m[38;2;255;255;255m▀[0m  ",
    //         " [38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m  [38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m    [38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m   [38;2;255;255;255m▀[0m     [38;2;255;255;255m▀[0m      [38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m[38;2;255;255;255m▀[0m   [38;2;255;255;255m▀[0m   [38;2;255;255;255m▀[0m  [38;2;255;255;255m▀[0m   "
    //     ],
    //     "\n"
    // );
    const InkMouseDisplay = Array.join([
        " [38;2;150;253;153m▄[0m           [38;2;126;238;163m▄[0m[38;2;124;236;163m▄[0m[38;2;122;235;164m█[0m                                                    ",
        "[38;2;153;255;153m█[0m[38;2;150;253;153m▀[0m            [38;2;124;236;163m█[0m[38;2;122;235;164m█[0m  [38;2;116;231;166m▄[0m                                                 ",
        "[38;2;153;255;153m▄[0m[38;2;150;253;153m█[0m   [38;2;142;248;156m▄[0m[38;2;140;247;157m█[0m[38;2;138;245;158m▄[0m[38;2;136;244;159m▀[0m[38;2;134;243;159m█[0m[38;2;132;242;160m▄[0m   [38;2;124;236;163m█[0m[38;2;122;235;164m█[0m[38;2;120;234;165m▄[0m[38;2;118;232;166m█[0m[38;2;116;231;166m▀[0m    [38;2;106;225;170m▄[0m[38;2;104;223;171m▄[0m[38;2;102;222;172m▄[0m[38;2;100;221;173m▄[0m  [38;2;94;217;175m█[0m[38;2;92;216;176m▄[0m[38;2;90;214;177m▀[0m[38;2;88;213;177m█[0m[38;2;86;212;178m▄[0m[38;2;83;210;179m▀[0m[38;2;81;209;180m█[0m[38;2;79;208;180m▄[0m   [38;2;71;203;184m▄[0m[38;2;69;201;184m▀[0m[38;2;67;200;185m▀[0m[38;2;65;199;186m█[0m[38;2;63;197;187m▄[0m  [38;2;57;193;189m▄[0m[38;2;55;192;190m█[0m  [38;2;49;188;192m▄[0m[38;2;47;187;193m█[0m   [38;2;39;182;196m▄[0m[38;2;37;180;197m█[0m[38;2;35;179;198m▀[0m[38;2;33;178;198m█[0m    [38;2;23;171;202m▄[0m[38;2;21;170;203m▀[0m[38;2;19;169;204m█[0m[38;2;17;168;205m█[0m",
        "[38;2;153;255;153m█[0m[38;2;150;253;153m█[0m   [38;2;142;248;156m█[0m[38;2;140;247;157m█[0m  [38;2;134;243;159m█[0m[38;2;132;242;160m█[0m   [38;2;124;236;163m█[0m[38;2;122;235;164m█[0m [38;2;118;232;166m█[0m[38;2;116;231;166m█[0m   [38;2;108;226;170m▀[0m[38;2;106;225;170m▀[0m[38;2;104;223;171m▀[0m[38;2;102;222;172m▀[0m   [38;2;94;217;175m█[0m[38;2;92;216;176m█[0m [38;2;88;213;177m█[0m[38;2;86;212;178m█[0m [38;2;81;209;180m█[0m[38;2;79;208;180m█[0m  [38;2;73;204;183m█[0m[38;2;71;203;184m█[0m  [38;2;65;199;186m█[0m[38;2;63;197;187m█[0m  [38;2;57;193;189m█[0m[38;2;55;192;190m█[0m  [38;2;49;188;192m█[0m[38;2;47;187;193m█[0m    [38;2;37;180;197m▀[0m[38;2;35;179;198m█[0m[38;2;33;178;198m▄[0m[38;2;31;177;199m▄[0m  [38;2;25;173;201m█[0m[38;2;23;171;202m█[0m[38;2;21;170;203m▄[0m[38;2;19;169;204m▀[0m ",
        "[38;2;153;255;153m▀[0m[38;2;150;253;153m█[0m[38;2;148;252;154m▄[0m  [38;2;142;248;156m█[0m[38;2;140;247;157m▀[0m  [38;2;134;243;159m█[0m[38;2;132;242;160m▀[0m   [38;2;124;236;163m█[0m[38;2;122;235;164m▀[0m [38;2;118;232;166m▀[0m[38;2;116;231;166m█[0m[38;2;114;230;167m▄[0m         [38;2;94;217;175m█[0m[38;2;92;216;176m▀[0m [38;2;88;213;177m█[0m[38;2;86;212;178m▀[0m [38;2;81;209;180m█[0m[38;2;79;208;180m▀[0m  [38;2;73;204;183m▀[0m[38;2;71;203;184m█[0m[38;2;69;201;184m▄[0m[38;2;67;200;185m▄[0m[38;2;65;199;186m▀[0m   [38;2;57;193;189m▀[0m[38;2;55;192;190m█[0m[38;2;53;191;191m▄[0m[38;2;51;190;191m▄[0m[38;2;49;188;192m▀[0m[38;2;47;187;193m█[0m[38;2;45;186;194m▄[0m  [38;2;39;182;196m▀[0m[38;2;37;180;197m▄[0m[38;2;35;179;198m▄[0m[38;2;33;178;198m█[0m[38;2;31;177;199m▀[0m  [38;2;25;173;201m▀[0m[38;2;23;171;202m█[0m[38;2;21;170;203m▄[0m[38;2;19;169;204m▄[0m[38;2;17;168;205m▀[0m",
        "        [38;2;136;244;159m▀[0m                                                           "
    ], "\n");
    /* eslint-enable @stylistic/max-len */
    return (_jsxs(Ink.Box, { alignItems: "center", flexDirection: "column", justifyContent: "center", position: "relative", height, width, children: [_jsx(Ink.Text, { children: InkMouseDisplay }), _jsx(MouseDiagram, {}), MousePosition !== undefined &&
                _jsx(Ink.Box, { left: MousePosition.X - 1, position: "absolute", top: MousePosition.Y - 1, children: _jsx(Ink.Text, { color: "#FFFFFF", children: "\u2022" }) })] }));
};
export const RootComponentOld = () => {
    // const [ LastEvent, SetLastEvent ] = React.useState<Mouse.TerminalMouseEvent | null>(null);
    const [, SetLastEvent] = React.useState(null);
    // const [ ImpulseKey, SetImpulseKey ] = React.useState(0);
    const [, SetImpulseKey] = React.useState(0);
    Mouse.useTerminalMouseTracking({
        HorizontalScrollDirectionByButton: {
            6: "Left",
            7: "Right"
        },
        OnEvent: (Event) => {
            SetLastEvent((_Old) => Event);
            if (Event._tag === "Press" && Event.Button === "Left") {
                SetImpulseKey(Number.increment);
            }
        }
    });
    return _jsx(MouseDiagram, {});
    // return (
    //     <Ink.Box flexDirection="column">
    //         <Ink.Text>Move, click, drag, scroll, or focus/unfocus the terminal.</Ink.Text>
    //         <Ink.Text>
    //             {LastEvent === null
    //                 ? "No terminal mouse event yet."
    //                 : JSON.stringify(LastEvent)}
    //         </Ink.Text>
    //         <Animation.ImpulseBackgroundBox { ...{ ImpulseKey } }>
    //             <Ink.Text>Click Meeee (Impulse Key is { ImpulseKey })</Ink.Text>
    //         </Animation.ImpulseBackgroundBox>
    //     </Ink.Box>
    // );
};
export const Run = () => Ink.render(_jsx(RootComponent, {}));
//# sourceMappingURL=Playground.js.map