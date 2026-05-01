/**
 * @file      Hook.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { RefObject, useState } from "react";
import type { THandler, TSetState } from "../React.Types.js";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { UseEffectAsync, UseIndex, UseIndexedValue, UseState, UseWindowEffect } from "./Hook.js";
import type { TFunction } from "@sorrell/utilities/functional";

/**
 * A managed {@link Index} value, as well as functions to update
 * the managed index value.
 */
export type FUseIndexReturnValue = readonly [
    /** The index that is managed by the {@link UseIndex} call that returns this. */
    Index: number,

    /**
     * The callback that increments the index managed by the {@link UseIndex} call
     * that returns this.
     */
    Increment: TFunction,

    /**
     * The callback that decrements the index managed by the {@link UseIndex} call
     * that returns this.
     */
    Decrement: TFunction,

    /** The callback that allows the managed index value to be set to any `number` value. */
    SetIndex: TSetState<number>
];

/**
 * The callback passed to {@link UseEffectAsync}.
 */
export type FUseEffectAsyncCallback =
    /**
     * The overload passed to {@link UseEffectAsync} that accepts
     * an {@link AbortSignal} to "back out" of execution.
     *
     * @param AbortSignal - The {@link AbortSignal} that signals
     * that {@link useEffect} is now cleaning up.
     */
    | ((AbortSignal: AbortSignal) => Promise<void>)

    /**
     * The simple overload passed to {@link UseEffectAsync} that
     * does *not* accept an {@link AbortSignal}.
     */
    | (() => Promise<void>);

/**
 * A function that accepts a given {@link Route}, and returns a
 * simple callback that, when called, causes the application
 * to navigate to the given {@link Route}.
 *
 * @param Route - The route to which the application will navigate
 * when the callback returned by this is called.
 *
 * @returns {TFunction} A simple callback that causes the application
 * to navigate to the given {@link Route} when called.
 */
export type FMakeNavigateFunction = (Route: string) => TFunction;

/**
 * The {@link Rect} and {@link Ref} returned by {@link UseWindowEffect}.
 */
export type TUseDomRectReturnValue<Type extends HTMLElement> =
    readonly [
        /** The {@link DOMRect} measured by {@link UseWindowEffect}. */
        Rect: DOMRect,

        /**
         * The {@link RefObject} used to measure the returned {@link Rect}.
         * If a {@link RefObject} is given to {@link UseWindowEffect}, then
         * this will be that {@link RefObject}, otherwise, this will be a new
         * {@link RefObject}, which must be passed to the {@link HTMLElement}
         * to be measured.
         */
        Ref: RefObject<Type | null>
    ];

/* eslint-disable @typescript-eslint/no-empty-object-type */

/** The initial argument passed to {@link UseIndexedValue}. */
export type TUseIndexedArgument<ElementType> =
    /**
     * If no initial argument is passed to {@link UseIndexedValue},
     * then the initial index will be zero.
     */
    | { }

    /**
     * If an {@link Index} is provided, then the initial index will be this
     * value, and the initial indexed value will be the value corresponding
     * to this {@link Index}.
     */
    | {
        Index: number;
    }

    /**
     * If a {@link Value} is provided, then the initial indexed value will
     * be this, and the initial index will be the index of this {@link Value}
     * in the given {@link Array}.
     */
    | {
        Value: ElementType;
    }

    /**
     * It is possible to provide an initial index and value such that these
     * do not correspond under the given {@link Array}.
     */
    | {
        Index: number;
        Value: ElementType;
    };

/* eslint-enable @typescript-eslint/no-empty-object-type */

/**
 * The indexed `Value`, index, and setters.
 *
 * @template ElementType - The type of the indexed `Value.`
 */
export type TUseIndexedReturnType<ElementType> =
    readonly [
        /** The {@link Value} in the indexed {@link Array} at the current index. */
        Value: ElementType,
        ...FUseIndexReturnValue
    ];

/**
 * The {@link ReadonlyArray} returned by {@link UseState}.
 *
 * @template Type - The type of the value that is managed by {@link UseState}.
 */
export type TUseStateReturnType<Type> = readonly [
    /** The value that is managed by {@link UseState}. */
    Value: Type,

    /** A simple setter, to give to other components that will update this value. */
    OnChangeValue: THandler<Type>,

    /** The usual setter returned by {@link useState}. */
    SetValue: TSetState<Type>
];
