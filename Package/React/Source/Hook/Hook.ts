/**
 * @file      Hook.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable react-hooks/exhaustive-deps */

import {
    type DependencyList,
    type EffectCallback,
    type RefObject,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import type {
    FMakeNavigateFunction,
    FUseEffectAsyncCallback,
    FUseIndexReturnValue,
    TUseDomRectReturnValue,
    TUseIndexedArgument as TUseIndexedInitialArgument,
    TUseIndexedReturnType,
    TUseStateReturnType
} from "./Hook.Types.js";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import type { TFunction } from "@sorrell/utilities/functional";
import type { THandler } from "../React.Types.js";
import type { TNonemptyArray } from "@sorrell/utilities/array";

/**
 * Define an index (`number`), a range of values which the index can attain,
 * and receive a managed index value, and convenient setters for the index.
 *
 * @param InitialValue - The initial value of the returned index.
 * @param Minimum - The minimum value that the returned index can attain.
 * @param Maximum - The maximum value that the returned index can attain.
 *
 * @returns {FUseIndexReturnValue} A `ReadonlyArray` containing the current index,
 * and functions to change the current index.
 */
export function UseIndex(
    InitialValue: number = 0,
    Minimum: number = 0,
    Maximum?: number
): FUseIndexReturnValue
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

/**
 * Like {@link UseIndex}, but a given {@link InArray | Array} is indexed by the current
 * index returned by this hook.
 *
 * @param InArray - The {@link Array} of values to index by this hook.
 * @param InitialArgument - Optionally, specify which value (and therefore index) should
 * be current upon first calling this hook.
 *
 * @throws {Error} Throws when the initial index is invalid.
 *
 * @returns {TUseIndexedReturnType<ElementType>} A {@link ReadonlyArray} containing
 * all of {@link FUseIndexReturnValue}, as well as the value in {@link InArray} corresponding
 * to the current index.
 */
export function UseIndexedValue<ElementType>(
    InArray: TNonemptyArray<ElementType>,
    InitialArgument?: TUseIndexedInitialArgument<ElementType>
): TUseIndexedReturnType<ElementType>
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
            };
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
        throw new Error(
            `UseIndexedValue could not get a value from its Index == ${ Index } ` +
            `(InArray.length == ${ InArray.length }).`
        );
    }

    return [ Value, Index, OutIncrement, OutDecrement, OutSetIndex ] as const;
};

/**
 * Wrap {@link useEffect} to handle `async` callbacks.  The callback can be defined to
 * accept an {@link AbortSignal}, which is called whenever the dependency array updates.
 *
 * @param {FUseEffectAsyncCallback} Function - The `async` function that will be called
 * by {@link useEffect}.
 * @param {FUseEffectAsyncCallback | undefined} CleanupFunction - The function
 * that will be returned in the callback to {@link useEffect}.
 * @param {Array<unknown>} DependencyArray - Any dependencies to memoize.
 */
export function UseEffectAsync(
    Function: FUseEffectAsyncCallback,
    CleanupFunction: FUseEffectAsyncCallback | undefined = undefined,
    DependencyArray: Array<unknown> = [ ]
): void
{
    const [ Controller ] = useState<AbortController>(new AbortController());

    const OutDependencyArray: Array<unknown> = [ ...DependencyArray, Function, CleanupFunction, Controller ];

    useEffect((): void | TFunction =>
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
 * @example
 * That is, with this hook's return value `Navigate`, you can write
 * ```typescript
 *     Callback={ Navigate("/My/Route")
 * ```
 * instead of
 * ```typescript
 *     Callback={ (): void => Navigate("/My/Route") }
 * ```
 *
 * @returns {Readonly<[ Navigate: FMakeNavigateFunction ]>} A function `Navigate`, which when
 * passed a given route (`string`), returns a simple callback that will cause the router to
 * navigate to that route.
 */
export function UseNavigator(): Readonly<[ Navigate: FMakeNavigateFunction ]>
{
    const Navigator: NavigateFunction = useNavigate();

    const MakeNavigateFunction: FMakeNavigateFunction = useCallback((Route: string): TFunction =>
    {
        return (): void =>
        {
            Navigator(Route);
        };
    }, [ Navigator ]);

    return [ MakeNavigateFunction ] as const;
};

/**
 * Get the bounding box of a given {@link ElementType}, using either (1) a given
 * {@link RefObject}, or (2) the {@link RefObject} returned by this hook.
 *
 * @template ElementType - The subtype of {@link HTMLElement} for which this function
 * returns a {@link FBox}.
 *
 * @param ElementRef - A {@link RefObject} to the element whose bounds will be measured.
 * If one is not given, then you may take the {@link RefObject} returned by this, and pass
 * that to the {@link ElementType} that you wish to measure.
 *
 * @returns {TUseDomRectReturnValue<ElementType>} A {@link FBox} measuring the given {@link ElementRef},
 * and the {@link RefObject} that was used.
 */
export function UseDomRect<ElementType extends HTMLElement = HTMLElement>(
    ElementRef?: RefObject<ElementType | null>
): TUseDomRectReturnValue<ElementType>
{
    const DefaultElementReference: RefObject<ElementType | null> = useRef<ElementType | null>(null);

    const ElementReference: RefObject<ElementType | null> = (ElementRef !== undefined)
        ? ElementRef
        : DefaultElementReference;

    const [ Box, SetBox ] = useState<DOMRect>(new DOMRect());

    useLayoutEffect((): ReturnType<EffectCallback> =>
    {
        const Element: ElementType | null = ElementReference.current;

        if (Element === null)
        {
            return;
        }

        const SetBoxFromElement = (): void =>
        {
            SetBox((_Old: DOMRect | undefined): DOMRect =>
            {
                return Element.getBoundingClientRect();
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

/**
 * A simple wrapper of {@link useEffect}, which ensures that {@link useEffect}
 * is only called once.
 *
 * @param Callback - The callback passed to {@link useEffect}.
 * @param DependencyArray - The dependency array to memoize with this hook.
 */
export function UseEffectOnce(
    Callback: TFunction,
    DependencyArray?: DependencyList
): void
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

/**
 * Call a given {@link Callback} once.
 *
 * @param Callback - The callback to call once.
 */
export function UseOnce(Callback: TFunction): void
{
    const Ref: RefObject<boolean> = useRef<boolean>(false);
    if (!Ref.current)
    {
        Ref.current = true;
        Callback();
    }
};

/**
 * Subscribe a given {@link Callback} to a given {@link window} event {@link Channel}.
 *
 * @param Channel - The {@link window} channel to which the given {@link Callback}
 * will be subscribed.
 * @param Callback - The given callback to subscribe to the given {@link Channel}.
 */
export function UseWindowEffect(
    Channel: keyof WindowEventMap,
    Callback: TFunction
): void
{
    useEffect((): TFunction =>
    {
        window.addEventListener(Channel, Callback);

        return (): void =>
        {
            window.removeEventListener(Channel, Callback);
        };
    }, [ Channel, Callback ]);
};

/**
 * A simple wrapper of {@link useState} that provides an additional {@link TFunction}
 * for simple updating by components that do not own the value returned by this.
 *
 * @template Type - The type of the value managed by this hook.
 *
 * @param InitialValue - The initial value (or a function returning an initial value).
 *
 * @returns {TUseStateReturnType<Type>} A `ReadonlyArray` containing the usual
 * returned values of {@link useState}, as well as a simple callback to pass to
 * components that set controlled values.
 */
export function UseState<Type>(
    InitialValue: Type | TFunction<never, Type>
): TUseStateReturnType<Type>
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
