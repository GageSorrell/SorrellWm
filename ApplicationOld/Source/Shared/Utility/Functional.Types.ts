/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type FSimpleCallback = () => void;
export type FSimpleCallbackAsync = () => Promise<void>;
export type FSimpleCallbackMaybeAsync = FSimpleCallback | FSimpleCallbackAsync;

export type TSimpleFunction<ParameterType, ReturnType = void> = (In: ParameterType) => ReturnType;

export type TResolveFunction<Type> = (Value: Type | PromiseLike<Type>) => void;
export type FRejectFunction = (Reason?: unknown) => void;
