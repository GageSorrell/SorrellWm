/**
 * Two-dimensional vector types and operations.
 *
 * @module @sorrell/math/Internal/Vector2D
 * @internal
 *
 * @file      Vector2D.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Equal, Hash, Inspectable, Pipeable } from "effect";
import type { Vector2D } from "../Vector2D.ts";

const TypeIdKey = "~sorrell/math/Vector2D" as const;
export/** The symbol installed on every vector value. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the internal vector symbol. */
export type TypeId = typeof TypeId;

export/** Shared equality, hashing, inspection, iteration, and piping behavior. */
const Proto =
    {
        [ TypeId ]: TypeId,

        [ Equal.symbol ](That: Vector2D): boolean
        {
            return this.X === That.X && this.Y === That.Y;
        },

        [ Hash.symbol ](): number
        {
            return Hash.array([ this.X, this.Y ]);
        },

        [ Symbol.toStringTag ]: "Vector2D" as const,

        *[ Symbol.iterator ](): Iterator<number>
        {
            yield* [ this.X, this.Y ] as const;
        },

        [ Inspectable.NodeInspectSymbol ](this: Vector2D)
        {
            return this.toJSON();
        },

        X: 0,
        Y: 0,

        pipe()
        {
            /* eslint-disable-next-line prefer-rest-params */
            return Pipeable.pipeArguments(this, arguments);
        },

        toJSON()
        {
            return {
                X: this.X,
                Y: this.Y,
                _tag: "Vector2D"
            } as const;
        },
        toString()
        {
            return `Point(${ this.X }, ${ this.Y })`;
        }
    } as const;
