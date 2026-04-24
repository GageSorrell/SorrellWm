/**
 * @file      TaskResult.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const ExitSymbol: unique symbol = Symbol("Exit");
export const FailureSymbol: unique symbol = Symbol("Failure");
export const SubtasksSymbol: unique symbol = Symbol("Subtasks");
export const SuccessSymbol: unique symbol = Symbol("Success");
