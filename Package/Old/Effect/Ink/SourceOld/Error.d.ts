/**
 * Errors that `ink` effects can have.
 *
 * @module @sorrell/effect-ink/Error
 */
declare const InkRenderError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkRenderError";
} & Readonly<A>;
export declare class InkRenderError extends InkRenderError_base<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {
}
declare const InkExitError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkExitError";
} & Readonly<A>;
export declare class InkExitError extends InkExitError_base<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {
}
declare const InkAlreadyUnmountedError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkAlreadyUnmountedError";
} & Readonly<A>;
export declare class InkAlreadyUnmountedError extends InkAlreadyUnmountedError_base<{
    readonly Message: string;
}> {
}
declare const InkNonInteractiveTerminalError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkNonInteractiveTerminalError";
} & Readonly<A>;
export declare class InkNonInteractiveTerminalError extends InkNonInteractiveTerminalError_base<{
    readonly Message: string;
}> {
}
declare const InkTerminalCapabilityError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkTerminalCapabilityError";
} & Readonly<A>;
export declare class InkTerminalCapabilityError extends InkTerminalCapabilityError_base<{
    readonly Message: string;
    readonly Capability?: string;
}> {
}
declare const InkRuntimeProviderMissingError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkRuntimeProviderMissingError";
} & Readonly<A>;
export declare class InkRuntimeProviderMissingError extends InkRuntimeProviderMissingError_base<{
    readonly Message: string;
}> {
}
declare const InkComponentEffectError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkComponentEffectError";
} & Readonly<A>;
export declare class InkComponentEffectError extends InkComponentEffectError_base<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {
}
declare const InkCliRenderError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkCliRenderError";
} & Readonly<A>;
export declare class InkCliRenderError extends InkCliRenderError_base<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {
}
declare const InkCliUnsupportedOutputError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "InkCliUnsupportedOutputError";
} & Readonly<A>;
export declare class InkCliUnsupportedOutputError extends InkCliUnsupportedOutputError_base<{
    readonly Message: string;
}> {
}
declare const PromptCancelledError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptCancelledError";
} & Readonly<A>;
export declare class PromptCancelledError extends PromptCancelledError_base<{
    readonly Message: string;
}> {
}
declare const PromptInterruptedError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptInterruptedError";
} & Readonly<A>;
export declare class PromptInterruptedError extends PromptInterruptedError_base<{
    readonly Message: string;
    readonly Cause?: unknown;
}> {
}
declare const PromptValidationError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptValidationError";
} & Readonly<A>;
export declare class PromptValidationError extends PromptValidationError_base<{
    readonly Message: string;
    readonly Value?: unknown;
    readonly Cause?: unknown;
}> {
}
declare const PromptRenderError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptRenderError";
} & Readonly<A>;
export declare class PromptRenderError extends PromptRenderError_base<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {
}
declare const PromptInvalidStateError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptInvalidStateError";
} & Readonly<A>;
export declare class PromptInvalidStateError extends PromptInvalidStateError_base<{
    readonly Message: string;
    readonly State?: unknown;
}> {
}
declare const PromptInvalidChoiceError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptInvalidChoiceError";
} & Readonly<A>;
export declare class PromptInvalidChoiceError extends PromptInvalidChoiceError_base<{
    readonly Message: string;
    readonly Choice?: unknown;
}> {
}
declare const PromptEditorError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "PromptEditorError";
} & Readonly<A>;
export declare class PromptEditorError extends PromptEditorError_base<{
    readonly Cause: unknown;
    readonly Message?: string;
    readonly EditorCommand?: string;
}> {
}
export type InkRendererError = InkRenderError | InkExitError | InkAlreadyUnmountedError | InkNonInteractiveTerminalError | InkTerminalCapabilityError;
export type InkReactError = InkRuntimeProviderMissingError | InkComponentEffectError;
export type InkCliError = InkCliRenderError | InkCliUnsupportedOutputError | InkRenderError | InkExitError | InkAlreadyUnmountedError | InkNonInteractiveTerminalError | InkTerminalCapabilityError;
export type PromptError = PromptCancelledError | PromptInterruptedError | PromptValidationError | PromptRenderError | PromptInvalidStateError | PromptInvalidChoiceError | PromptEditorError | InkRenderError | InkExitError | InkAlreadyUnmountedError | InkNonInteractiveTerminalError | InkTerminalCapabilityError | InkRuntimeProviderMissingError | InkComponentEffectError;
export type EffectInkError = InkRendererError | InkReactError | InkCliError | PromptError;
export declare const promptCancelled: (Message?: string) => PromptCancelledError;
export declare const promptInterrupted: (Cause?: unknown, Message?: string) => PromptInterruptedError;
export declare const promptValidationFailed: (Message: string, Value?: unknown, Cause?: unknown) => PromptValidationError;
export declare const inkRuntimeProviderMissing: () => InkRuntimeProviderMissingError;
export declare const inkAlreadyUnmounted: () => InkAlreadyUnmountedError;
export declare const inkNonInteractiveTerminal: () => InkNonInteractiveTerminalError;
export {};
//# sourceMappingURL=Error.d.ts.map