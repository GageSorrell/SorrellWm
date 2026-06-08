/**
 * Handle user input between `ink` and `effect`.
 *
 * @module @sorrell/effect-ink/Input
 */
/**
 * @file      Input.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Context, Layer } from "effect";
import { type Key as InkKey } from "ink";
export type KeyEventType = "press" | "repeat" | "release";
export interface KeyEvent {
    readonly Input: string;
    readonly Up: boolean;
    readonly Down: boolean;
    readonly Left: boolean;
    readonly Right: boolean;
    readonly PageDown: boolean;
    readonly PageUp: boolean;
    readonly Home: boolean;
    readonly End: boolean;
    readonly Return: boolean;
    readonly Escape: boolean;
    readonly Tab: boolean;
    readonly Backspace: boolean;
    readonly Delete: boolean;
    readonly Control: boolean;
    readonly Shift: boolean;
    readonly Meta: boolean;
    readonly Super: boolean;
    readonly Hyper: boolean;
    readonly CapsLock: boolean;
    readonly NumLock: boolean;
    readonly EventType?: KeyEventType;
}
export type InputAction = "Submit" | "Cancel" | "MoveUp" | "MoveDown" | "MoveLeft" | "MoveRight" | "PageUp" | "PageDown" | "MoveHome" | "MoveEnd" | "DeleteBackward" | "DeleteForward" | "Toggle" | "Complete" | "OpenEditor" | "Clear" | "Search" | "AcceptSuggestion" | "InsertText" | "Noop";
export interface InputCommand {
    readonly Action: InputAction;
    readonly Event: KeyEvent;
    readonly Text?: string;
}
export interface KeyBinding {
    readonly Name: string;
    readonly Action: InputAction;
    readonly Matches: (Event: KeyEvent) => boolean;
}
export interface KeyMap {
    readonly Bindings: ReadonlyArray<KeyBinding>;
}
export interface UseInputCommandsOptions {
    readonly Active?: boolean;
    readonly KeyMap?: KeyMap;
    readonly AllowTextInput?: boolean;
    readonly IgnoreKeyRelease?: boolean;
}
export declare const DefaultKeyMap: KeyMap;
export declare const KeyMapReference: Context.Reference<KeyMap>;
export declare const LayerDefault: Layer.Layer<never, never, never>;
export declare const LayerFromKeyMap: (Value: KeyMap) => Layer.Layer<never, never, never>;
export declare const NormalizeInkInput: (Input: string, Key: InkKey) => KeyEvent;
export declare const ResolveInputCommand: (Event: KeyEvent, CurrentKeyMap?: KeyMap, AllowTextInput?: boolean) => InputCommand;
export declare const IsTextInput: (Event: KeyEvent) => boolean;
export declare const IsPrintableText: (Value: string) => boolean;
export declare const ContainsControlCharacter: (Value: string) => boolean;
export declare const InsertTextAtOffset: (Value: string, Text: string, Offset: number) => string;
export declare const DeleteBackwardAtOffset: (Value: string, Offset: number) => string;
export declare const DeleteForwardAtOffset: (Value: string, Offset: number) => string;
export declare const MoveOffsetLeft: (Offset: number) => number;
export declare const MoveOffsetRight: (Value: string, Offset: number) => number;
export declare const MoveOffsetHome: () => number;
export declare const MoveOffsetEnd: (Value: string) => number;
export declare const MoveIndexUp: (Index: number, Length: number, Wrap?: boolean) => number;
export declare const MoveIndexDown: (Index: number, Length: number, Wrap?: boolean) => number;
export declare const MoveIndexPageUp: (Index: number, Length: number, PageSize: number) => number;
export declare const MoveIndexPageDown: (Index: number, Length: number, PageSize: number) => number;
export declare const MakeKeyBinding: (Name: string, Action: InputAction, Matches: (Event: KeyEvent) => boolean) => KeyBinding;
export declare const AppendKeyBinding: (CurrentKeyMap: KeyMap, Binding: KeyBinding) => KeyMap;
export declare const PrependKeyBinding: (CurrentKeyMap: KeyMap, Binding: KeyBinding) => KeyMap;
export declare const RemoveKeyBinding: (CurrentKeyMap: KeyMap, Name: string) => KeyMap;
export declare const MergeKeyMaps: (BaseKeyMap: KeyMap, OverrideKeyMap: KeyMap) => KeyMap;
export declare const useInputCommands: (OnCommand: (Command: InputCommand) => void, Options?: UseInputCommandsOptions) => void;
//# sourceMappingURL=Input.d.ts.map