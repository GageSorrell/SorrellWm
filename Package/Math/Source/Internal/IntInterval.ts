/**
 * Integer interval types and operations.
 *
 * @module @sorrell/math/Internal/IntInterval
 * @internal
 *
 * @file      IntInterval.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore Weird symbol import/module loading error.
import { Equal, Hash, Inspectable, Pipeable } from "effect";
import type { IntInterval } from "../IntInterval.ts";

const TypeIdKey = "~sorrell/math/Point/IntInterval" as const;
export/** The symbol installed on the shared integer-interval prototype. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the internal integer-interval symbol. */
export type TypeId = typeof TypeId;

export/** Shared equality, hashing, inspection, iteration, and piping behavior. */
const Proto =
    {
        [ Symbol.toStringTag ]: "IntInterval" as const,

        [ Equal.symbol ](That: IntInterval): boolean
        {
            return this.Start === That.Start && this.End === That.End;
        },

        [ Hash.symbol ](): number
        {
            return Hash.array([ this.Start, this.End ]);
        },

        *[ Symbol.iterator ](): Iterator<number>
        {
            yield* [ this.Start, this.End ] as const;
        },

        [ Inspectable.NodeInspectSymbol ](this: IntInterval)
        {
            return this.toJSON();
        },

        End: 0,
        Start: 0,

        pipe()
        {
            /* eslint-disable-next-line prefer-rest-params */
            return Pipeable.pipeArguments(this, arguments);
        },

        toJSON()
        {
            return {
                _tag: "IntInterval",

                End: this.End,
                Start: this.Start
            } as const;
        },
        toString()
        {
            return `{${ this.Start }..${ this.End }}`;
        }
    } as const;
