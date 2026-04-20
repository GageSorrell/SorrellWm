/**
 * @file      Hook.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import {
    type DependencyList,
    type Dispatch,
    type EffectCallback,
    type RefObject,
    type SetStateAction,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState } from "react";
import type { FIpcFrontendChannel, TRequest, TResponse } from "../../Shared/Event";
import type {
    FMakeNavigateFunction,
    FUseEffectAsyncCallback,
    FUseEffectAsyncCleanupFunction,
    FUseIndexReturnValue,
    TUseDomRectReturnValue,
    TUseIndexedArgument,
    TUseIndexedReturnType } from "./Hook.Types";
import {
    type FSimpleCallback,
    Identity,
    type TArrayNonempty,
    type TPromiseCatchFunction,
    type TPromiseThenFunction,
    ZeroBox } from "../../Shared/Utility";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import type { FBox } from "@sorrellwm/windows";
import { GetBoxFromDomRect } from "./Utility";
import type { THandler, TSetState } from "./Utility.Types";

export const UseIndex = (
    InitialValue: number = 0,
    Minimum: number = 0,
    Maximum?: number
): FUseIndexReturnValue =>
{
    const [ Index, SetIndex ] = useState<number>(InitialValue || 0);

    const Increment = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Maximum !== undefined && Old === Maximum
                ? Minimum
                : Old + 1;
        });
    };

    const Decrement = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Old === Minimum
                ? Maximum !== undefined
                    ? Maximum
                    : Minimum
                : Old - 1;
        });
    };

    return [ Index, Increment, Decrement, SetIndex ] as const;
};

export const UseIndexedValue = <ElementType>(
    InArray: TArrayNonempty<ElementType>,
    InitialArgument?: TUseIndexedArgument<ElementType>
): TUseIndexedReturnType<ElementType> =>
{
    InitialArgument = InitialArgument || { };

    type FInitialValue =
    {
        InitialIndex: number;
        InitialValue: ElementType;
    };

    const { InitialIndex, InitialValue } = ((): FInitialValue =>
    {
        if ("Index" in InitialArgument && "Value" in InitialArgument)
        {
            return {
                InitialIndex: InitialArgument.Index,
                InitialValue: InitialArgument.Value
            };
        }
        else if ("Index" in InitialArgument)
        {
            const InitialValue: ElementType | undefined = InArray[InitialArgument.Index];
            if (InitialValue !== undefined)
            {
                return {
                    InitialIndex: InitialArgument.Index,
                    InitialValue
                };
            }
            else
            {
                throw new Error("UseIndexedValue was given an invalid InitialIndex.");
            }
        }
        else if ("Value" in InitialArgument)
        {
            const IndexOfValue: number = InArray.indexOf(InitialArgument.Value);
            const InitialIndex: number = IndexOfValue !== -1
                ? IndexOfValue
                : 0;

            return {
                InitialIndex,
                InitialValue: InitialArgument.Value
            };
        }
        else
        {
            return {
                InitialIndex: 0,
                InitialValue: InArray[0]
            }
        }
    })();

    const [ Index, Increment, Decrement, SetIndex ] = UseIndex(InitialIndex, 0, InArray.length - 1);

    const HasMutated: RefObject<boolean> = useRef<boolean>(false);

    const OutIncrement = (): void =>
    {
        HasMutated.current = true;
        Increment();
    };

    const OutDecrement = (): void =>
    {
        HasMutated.current = true;
        Decrement();
    };

    const OutSetIndex = (In: number | ((Old: number) => number)): void =>
    {
        HasMutated.current = true;
        SetIndex(In);
    };

    const Value: ElementType | undefined = HasMutated.current
        ? InArray[Index]
        : InitialValue;

    if (Value === undefined)
    {
        throw new Error(`UseIndexedValue could not get a value from its Index == ${ Index } (InArray.length == ${ InArray.length }).`);
    }

    return [ Value, Index, OutIncrement, OutDecrement, OutSetIndex ] as const;
};

/** Send an event to the backend, and get a response. */
/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const UseIpc_DEPRECATED = <TChannel extends FIpcFrontendChannel>(
    Channel: TChannel,
    RequestData: TRequest<TChannel>
): Readonly<[
    TResponse<TChannel> | undefined,
    Dispatch<SetStateAction<TResponse<TChannel> | undefined>>
]> =>
{
    const [ Response, SetResponse ] = useState<TResponse<TChannel> | undefined>(undefined);
    const HasRunOnceRef: RefObject<boolean> = useRef<boolean>(false);
    useEffect((): void =>
    {
        if (HasRunOnceRef.current)
        {
            return;
        }

        HasRunOnceRef.current = true;
        window.electron.ipcRenderer.On(Channel, (InResponseData: TResponse<TChannel>): void =>
        {
            SetResponse((_Old: TResponse<TChannel> | undefined): TResponse<TChannel> | undefined =>
            {
                return InResponseData;
            });
        });
        window.electron.ipcRenderer.Send(Channel, RequestData);
    }, [ Channel, RequestData ]);
    return [ Response, SetResponse ] as const;
};

/**
 * `useEffect` but for async callbacks.  The callback can be defined to accept
 * an `AbortSignal`, which is called whenever the dependency array updates.
 *
 * If the callback returns a cleanup function, then
 */
export const UseEffectAsync = (
    Function: FUseEffectAsyncCallback,
    CleanupFunction: FUseEffectAsyncCleanupFunction  | undefined = undefined,
    DependencyArray: TArray<unknown> = [ ]
): void =>
{
    const [ Controller ] = useState<AbortController>(new AbortController());

    const OutDependencyArray: TArray<unknown> = [ ...DependencyArray, Function, CleanupFunction, Controller ];

    useEffect((): void | FSimpleCallback =>
    {
        Function(Controller.signal);

        if (CleanupFunction !== undefined)
        {
            const CleanupFunctionWithSignal = (): void =>
            {
                if (CleanupFunction !== undefined)
                {
                    CleanupFunction(Controller.signal);
                }
            };

            return CleanupFunctionWithSignal;
        }
    }, OutDependencyArray);
};

/**
 * Returns a function that, when called with a given route, returns a function that
 * will navigate to that route when called.  This makes it easier to define callbacks
 * that are properties of TSX elements.
 *
 * That is, with this hook's return value `Navigate`, you can write
 * ```
 *     Callback={ Navigate("/My/Route")
 * ```
 * instead of
 * ```
 *     Callback={ (): void => Navigate("/My/Route") }
 * ```
 */
export const UseNavigator = (): Readonly<[ Navigate: FMakeNavigateFunction ]> =>
{
    const Navigator: NavigateFunction = useNavigate();

    const MakeNavigateFunction: FMakeNavigateFunction = useCallback((Route: string): FSimpleCallback =>
    {
        return (): void =>
        {
            Navigator(Route);
        };
    }, [ Navigator ]);

    return [ MakeNavigateFunction ] as const;
};

/**
 * Get the bounding box of an `HTMLElement`, using either (1) a given `RefObject`,
 * or (2) the `RefObject` returned by the hook.
 */
export const UseDomRect = <Type extends HTMLElement = HTMLElement>(
    ElementRef?: RefObject<Type | null>
): TUseDomRectReturnValue<Type> =>
{
    const DefaultElementReference: RefObject<Type | null> = useRef<Type | null>(null);

    const ElementReference: RefObject<Type | null> = (ElementRef !== undefined)
        ? ElementRef
        : DefaultElementReference;

    const [ Box, SetBox ] = useState<FBox>(ZeroBox);

    useLayoutEffect((): ReturnType<EffectCallback> =>
    {
        const Element: Type | null = ElementReference.current;

        if (Element === null)
        {
            return;
        }

        const SetBoxFromElement = (): void =>
        {
            SetBox((_Old: FBox | undefined): FBox =>
            {
                return GetBoxFromDomRect(Element.getBoundingClientRect());
            });
        };

        const Observer: ResizeObserver = new ResizeObserver(SetBoxFromElement);

        SetBoxFromElement();
        Observer.observe(Element);

        return (): void =>
        {
            Observer.disconnect();
        };
    }, [ ]);

    return [ Box, ElementReference ] as const;
};

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const UsePromise = <Type>(
    InPromise: Promise<Type>,
    InitialValue: Type,
    Then?: TPromiseThenFunction<Type>,
    Catch?: TPromiseCatchFunction
): Readonly<[ Type ]> =>
{
    const [ Value, SetValue ] = useState<Type>(InitialValue);

    const DefaultCatchFunction: TPromiseCatchFunction = Identity;
    const CatchFunction: TPromiseCatchFunction = Catch !== undefined
        ? Catch
        : DefaultCatchFunction;

    const UpdateValue = (NewValue: Type): Type =>
    {
        SetValue((_Old: Type): Type =>
        {
            return NewValue;
        });

        return NewValue;
    };

    const ThenFunction: TPromiseThenFunction<unknown> = (Value: unknown): void =>
    {
        if (Then !== undefined)
        {
            Then(Value as Type);
        }
    };

    InPromise
        .then(UpdateValue)
        .then(ThenFunction)
        .catch(CatchFunction);

    return [ Value ] as const;
};

export const UseEffectOnce = (Callback: FSimpleCallback, DependencyArray?: DependencyList): void =>
{
    const Ref: RefObject<boolean> = useRef<boolean>(false);
    useEffect((): ReturnType<EffectCallback> =>
    {
        if (!Ref.current)
        {
            Ref.current = true;
            return Callback();
        }
    }, DependencyArray);
};

export const UseOnce = (Callback: FSimpleCallback): void =>
{
    const Ref: RefObject<boolean> = useRef<boolean>(false);
    if (!Ref.current)
    {
        Ref.current = true;
        Callback();
    }
};

export const UseWindowEffect = (Channel: keyof WindowEventMap, Callback: FSimpleCallback): void =>
{
    useEffect((): FSimpleCallback =>
    {
        window.addEventListener(Channel, Callback);

        return (): void =>
        {
            window.removeEventListener(Channel, Callback);
        };
    }, [ Channel, Callback ]);
};

export const UseState = <Type>(InitialValue: Type): Readonly<[
    Value: Type,
    OnChangeValue: THandler<Type>,
    SetValue: TSetState<Type>
]> =>
{
    const [ Value, SetValue ] = useState<Type>(InitialValue);

    const OnChangeValue: THandler<Type> = useCallback((NewValue: Type): void =>
    {
        SetValue((_Old: Type): Type =>
        {
            return NewValue;
        });
    }, [ SetValue ]);

    return [ Value, OnChangeValue, SetValue ] as const;
};
