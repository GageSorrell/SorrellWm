/**
 * @file      prompt-error.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Internal error handling mechanism for Listr prompts to identify the failing cause is coming from a prompt.
 *
 * @see {@link https://listr2.kilic.dev/task/prompts.html}
 */
export class PromptError extends Error { }
