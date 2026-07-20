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
export class InkRenderError extends Data.TaggedError("InkRenderError") {
}
export class InkExitError extends Data.TaggedError("InkExitError") {
}
export class InkAlreadyUnmountedError extends Data.TaggedError("InkAlreadyUnmountedError") {
}
export class InkNonInteractiveTerminalError extends Data.TaggedError("InkNonInteractiveTerminalError") {
}
export class InkTerminalCapabilityError extends Data.TaggedError("InkTerminalCapabilityError") {
}
export class InkRuntimeProviderMissingError extends Data.TaggedError("InkRuntimeProviderMissingError") {
}
export class InkComponentEffectError extends Data.TaggedError("InkComponentEffectError") {
}
export class InkCliRenderError extends Data.TaggedError("InkCliRenderError") {
}
export class InkCliUnsupportedOutputError extends Data.TaggedError("InkCliUnsupportedOutputError") {
}
export class PromptCancelledError extends Data.TaggedError("PromptCancelledError") {
}
export class PromptInterruptedError extends Data.TaggedError("PromptInterruptedError") {
}
export class PromptValidationError extends Data.TaggedError("PromptValidationError") {
}
export class PromptRenderError extends Data.TaggedError("PromptRenderError") {
}
export class PromptInvalidStateError extends Data.TaggedError("PromptInvalidStateError") {
}
export class PromptInvalidChoiceError extends Data.TaggedError("PromptInvalidChoiceError") {
}
export class PromptEditorError extends Data.TaggedError("PromptEditorError") {
}
export const promptCancelled = (Message = "The prompt was cancelled.") => new PromptCancelledError({ Message });
export const promptInterrupted = (Cause, Message = "The prompt was interrupted.") => new PromptInterruptedError({ Cause, Message });
export const promptValidationFailed = (Message, Value, Cause) => new PromptValidationError({ Cause, Message, Value });
export const inkRuntimeProviderMissing = () => new InkRuntimeProviderMissingError({
    Message: "No Effect runtime provider was found in the Ink React tree."
});
export const inkAlreadyUnmounted = () => new InkAlreadyUnmountedError({
    Message: "The Ink instance has already been unmounted."
});
export const inkNonInteractiveTerminal = () => new InkNonInteractiveTerminalError({
    Message: "This operation requires an interactive terminal."
});
//# sourceMappingURL=Error.js.map