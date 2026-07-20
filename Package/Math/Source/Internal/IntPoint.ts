/**
 *
 *
 * @module @sorrell/math/Internal/IntPoint
 * @internal
 *
 * @file      IntPoint.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Proto as Point2Proto } from "./Vector2D.ts";
// @ts-ignore Weird symbol import/module loading error.
import { Inspectable } from "effect";

const TypeIdKey = "~sorrell/math/Point/IntPoint" as const;
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export const Proto =
    {
        ...Point2Proto,

        [ Symbol.toStringTag ]: "Point2" as const,

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
