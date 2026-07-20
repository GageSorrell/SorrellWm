/**
 * Errors that `ink` effects can have.
 *
 * @module @sorrell/effect-ink/Error
 */

/**
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

export class InkRenderError extends Data.TaggedError("InkRenderError")<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {}

export class InkExitError extends Data.TaggedError("InkExitError")<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {}

export class InkAlreadyUnmountedError extends Data.TaggedError("InkAlreadyUnmountedError")<{
    readonly Message: string;
}> {}

export class InkNonInteractiveTerminalError extends Data.TaggedError("InkNonInteractiveTerminalError")<{
    readonly Message: string;
}> {}

export class InkTerminalCapabilityError extends Data.TaggedError("InkTerminalCapabilityError")<{
    readonly Message: string;
    readonly Capability?: string;
}> {}

export class InkRuntimeProviderMissingError extends Data.TaggedError("InkRuntimeProviderMissingError")<{
    readonly Message: string;
}> {}

export class InkComponentEffectError extends Data.TaggedError("InkComponentEffectError")<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {}

export class InkCliRenderError extends Data.TaggedError("InkCliRenderError")<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {}

export class InkCliUnsupportedOutputError extends Data.TaggedError("InkCliUnsupportedOutputError")<{
    readonly Message: string;
}> {}

export class PromptCancelledError extends Data.TaggedError("PromptCancelledError")<{
    readonly Message: string;
}> {}

export class PromptInterruptedError extends Data.TaggedError("PromptInterruptedError")<{
    readonly Message: string;
    readonly Cause?: unknown;
}> {}

export class PromptValidationError extends Data.TaggedError("PromptValidationError")<{
    readonly Message: string;
    readonly Value?: unknown;
    readonly Cause?: unknown;
}> {}

export class PromptRenderError extends Data.TaggedError("PromptRenderError")<{
    readonly Cause: unknown;
    readonly Message?: string;
}> {}

export class PromptInvalidStateError extends Data.TaggedError("PromptInvalidStateError")<{
    readonly Message: string;
    readonly State?: unknown;
}> {}

export class PromptInvalidChoiceError extends Data.TaggedError("PromptInvalidChoiceError")<{
    readonly Message: string;
    readonly Choice?: unknown;
}> {}

export class PromptEditorError extends Data.TaggedError("PromptEditorError")<{
    readonly Cause: unknown;
    readonly Message?: string;
    readonly EditorCommand?: string;
}> {}

export type InkRendererError =
    | InkRenderError
    | InkExitError
    | InkAlreadyUnmountedError
    | InkNonInteractiveTerminalError
    | InkTerminalCapabilityError;

export type InkReactError =
    | InkRuntimeProviderMissingError
    | InkComponentEffectError;

export type InkCliError =
    | InkCliRenderError
    | InkCliUnsupportedOutputError
    | InkRenderError
    | InkExitError
    | InkAlreadyUnmountedError
    | InkNonInteractiveTerminalError
    | InkTerminalCapabilityError;

export type PromptError =
    | PromptCancelledError
    | PromptInterruptedError
    | PromptValidationError
    | PromptRenderError
    | PromptInvalidStateError
    | PromptInvalidChoiceError
    | PromptEditorError
    | InkRenderError
    | InkExitError
    | InkAlreadyUnmountedError
    | InkNonInteractiveTerminalError
    | InkTerminalCapabilityError
    | InkRuntimeProviderMissingError
    | InkComponentEffectError;

export type EffectInkError =
    | InkRendererError
    | InkReactError
    | InkCliError
    | PromptError;

export const promptCancelled = (
    Message: string = "The prompt was cancelled."
): PromptCancelledError =>
    new PromptCancelledError({ Message });

export const promptInterrupted = (
    Cause?: unknown,
    Message: string = "The prompt was interrupted."
): PromptInterruptedError =>
    new PromptInterruptedError({ Cause, Message });

export const promptValidationFailed = (
    Message: string,
    Value?: unknown,
    Cause?: unknown
): PromptValidationError =>
    new PromptValidationError({ Cause, Message, Value });

export const inkRuntimeProviderMissing = (): InkRuntimeProviderMissingError =>
    new InkRuntimeProviderMissingError({
        Message: "No Effect runtime provider was found in the Ink React tree."
    });

export const inkAlreadyUnmounted = (): InkAlreadyUnmountedError =>
    new InkAlreadyUnmountedError({
        Message: "The Ink instance has already been unmounted."
    });

export const inkNonInteractiveTerminal = (): InkNonInteractiveTerminalError =>
    new InkNonInteractiveTerminalError({
        Message: "This operation requires an interactive terminal."
    });
