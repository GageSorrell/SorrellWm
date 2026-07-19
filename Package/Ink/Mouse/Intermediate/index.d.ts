/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Data, Effect } from "effect";
export type TerminalMouseButton = "Left" | "Middle" | "Right" | "Button8" | "Button9" | "Button10" | "Button11" | "None" | "Unknown";
export type TerminalScrollDirection = "Up" | "Down" | "Left" | "Right" | "Unknown";
export type TerminalScrollAxis = "Vertical" | "Horizontal" | "Unknown";
export type TerminalProtocolButtonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export declare class TerminalMouseModifiers extends Data.Class<{
    readonly Shift: boolean;
    readonly Alt: boolean;
    readonly Control: boolean;
}> {
}
export declare class TerminalMousePosition extends Data.Class<{
    readonly Column: number;
    readonly Row: number;
}> {
}
export type TerminalMouseEvent = Data.TaggedEnum<{
    FocusIn: {};
    FocusOut: {};
    Press: {
        readonly Button: TerminalMouseButton;
        readonly ButtonNumber: TerminalProtocolButtonNumber | null;
        readonly Position: TerminalMousePosition;
        readonly Modifiers: TerminalMouseModifiers;
        readonly RawButtonCode: number;
    };
    Release: {
        readonly Button: TerminalMouseButton;
        readonly ButtonNumber: TerminalProtocolButtonNumber | null;
        readonly Position: TerminalMousePosition;
        readonly Modifiers: TerminalMouseModifiers;
        readonly RawButtonCode: number;
    };
    Drag: {
        readonly Button: TerminalMouseButton;
        readonly ButtonNumber: TerminalProtocolButtonNumber | null;
        readonly Position: TerminalMousePosition;
        readonly Modifiers: TerminalMouseModifiers;
        readonly RawButtonCode: number;
    };
    Move: {
        readonly Position: TerminalMousePosition;
        readonly Modifiers: TerminalMouseModifiers;
        readonly RawButtonCode: number;
    };
    Wheel: {
        readonly ButtonNumber: 4 | 5 | 6 | 7;
        readonly ScrollDirection: TerminalScrollDirection;
        readonly ScrollAxis: TerminalScrollAxis;
        readonly Position: TerminalMousePosition;
        readonly Modifiers: TerminalMouseModifiers;
        readonly RawButtonCode: number;
    };
}>;
export declare const TerminalMouseEvent: Data.TaggedEnum.Constructor<TerminalMouseEvent>;
export interface TerminalMouseTrackingOptions {
    readonly OnEvent: (Event: TerminalMouseEvent) => void;
    readonly IsEnabled?: boolean;
    readonly HorizontalScrollDirectionByButton?: Readonly<{
        readonly 6?: "Left" | "Right";
        readonly 7?: "Left" | "Right";
    }>;
}
export declare class TerminalMouseParserState extends Data.Class<{
    readonly BufferedInput: string;
}> {
}
export declare class TerminalMouseParseResult extends Data.Class<{
    readonly Events: ReadonlyArray<TerminalMouseEvent>;
    readonly State: TerminalMouseParserState;
}> {
}
export declare const EnableTerminalMouseTracking: {
    (Write: (Data: string) => void): Effect.Effect<void>;
};
export declare const DisableTerminalMouseTracking: {
    (Write: (Data: string) => void): Effect.Effect<void>;
};
export declare const SetRawMode: {
    (SetRawModeImplementation: (IsRawMode: boolean) => void, IsRawMode: boolean): Effect.Effect<void>;
};
export declare const ResumeInput: {
    (StandardInput: NodeJS.ReadStream): Effect.Effect<void>;
};
export declare const AddInputListener: {
    (StandardInput: NodeJS.ReadStream, HandleData: (Data: Buffer | string) => void): Effect.Effect<void>;
};
export declare const RemoveInputListener: {
    (StandardInput: NodeJS.ReadStream, HandleData: (Data: Buffer | string) => void): Effect.Effect<void>;
};
export declare const InstallTerminalMouseTracking: (StandardInput: NodeJS.ReadStream, Write: (Data: string) => void, SetRawModeImplementation: (IsRawMode: boolean) => void, HandleData: (Data: Buffer | string) => void) => Effect.Effect<void, never, never>;
export declare const UninstallTerminalMouseTracking: (StandardInput: NodeJS.ReadStream, Write: (Data: string) => void, SetRawModeImplementation: (IsRawMode: boolean) => void, HandleData: (Data: Buffer | string) => void) => Effect.Effect<void, never, never>;
export declare const ParseTerminalMouseInput: {
    (State: TerminalMouseParserState, Data: string | Buffer<ArrayBufferLike>, Options: TerminalMouseTrackingOptions): Effect.Effect<TerminalMouseParseResult>;
};
export declare function useTerminalMouseTracking(Options: TerminalMouseTrackingOptions): void;
//# sourceMappingURL=index.d.ts.map