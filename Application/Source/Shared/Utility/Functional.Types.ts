/* File:      Functional.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FSimpleCallback = () => void;
export type FSimpleCallbackAsync = () => Promise<void>;
export type FSimpleCallbackMaybeAsync = FSimpleCallback | FSimpleCallbackAsync;

export type TSimpleFunction<ParameterType, ReturnType = void> = (In: ParameterType) => ReturnType;

export type TResolveFunction<T> = (Value: T | PromiseLike<T>) => void;
export type FRejectFunction = (Reason?: unknown) => void;
