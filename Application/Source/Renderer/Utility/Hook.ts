/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import {
    type Dispatch,
    type EffectCallback,
    type MutableRefObject,
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
    TUseDomRectReturnValue } from "./Hook.Types";
import {
    type FSimpleCallback,
    type TPromiseCatchFunction,
    type TPromiseThenFunction,
    ZeroBox } from "../../Shared/Utility";
import { GetBoxFromDomRect, Identity } from "./Utility";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import type { FBox } from "@sorrellwm/windows";

type FUseIndexReturnValue = Readonly<[
    Value: number,
    Increment: () => void,
    Decrement: () => void,
    SetIndex: Dispatch<SetStateAction<number>>
]>;

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
    const HasRunOnceRef: MutableRefObject<boolean> = useRef<boolean>(false);
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
    ElementRef?: RefObject<Type>
): TUseDomRectReturnValue<Type> =>
{
    const DefaultElementReference: RefObject<Type> = useRef<Type>(null);

    const ElementReference: RefObject<Type> = (ElementRef !== undefined)
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
