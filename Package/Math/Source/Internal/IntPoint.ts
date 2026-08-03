/**
 * Integer point types and operations.
 *
 * @module @sorrell/math/Internal/IntPoint
 * @internal
 *
 * @file      IntPoint.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Proto as Vector2dProto } from "./Vector2D.ts";

type ProtoShape = Omit<typeof Vector2dProto, typeof Symbol.toStringTag | "toJSON"> &
    {
        readonly [ Symbol.toStringTag ]: "IntPoint";
        readonly toJSON: () => {
            readonly X: number;
            readonly Y: number;
            readonly _tag: "IntPoint";
        };
    };

const TypeIdKey = "~sorrell/math/IntPoint" as const;
export/** The symbol installed on the shared integer-point prototype. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the internal integer-point symbol. */
export type TypeId = typeof TypeId;

export/** Shared vector behavior specialized with integer-point inspection. */
const Proto: ProtoShape =
    {
        ...Vector2dProto,

        [ Symbol.toStringTag ]: "IntPoint" as const,

        toJSON()
        {
            return {
                _tag: "IntPoint",

                X: this.X,
                Y: this.Y
            } as const;
        },
        toString()
        {
            return `IntPoint(${ this.X }, ${ this.Y })`;
        }
    } as const;
