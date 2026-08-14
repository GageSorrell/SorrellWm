/**
 *
 *
 * @module @sorrell/react/ControlledValue
 *
 * @file      ControlledValue.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";

/**
 * The argument of a setter function of a controlled value.
 *
 * @category Hook
 * @since 1.1.0
 */
export type SetStateArg<A> =
    (InitialState: A | (() => A)) => readonly [ A, React.Dispatch<React.SetStateAction<A>> ];

export/**
       * Return a controlled `boolean` with callbacks to update the value.
       *
       * @category Hook
       * @since 1.0.0
       */
const UseControlledBoolean = (Default: boolean | (() => boolean)) =>
{
    const [ Self, SetSelf ] = React.useState<boolean>(Default);

    const Setters =
        {
            Set: SetSelf,
            SetFalse: () => SetSelf(false),
            SetTrue: () => SetSelf(true)
        } as const;

    return [ Self, Setters ] as const;
};
