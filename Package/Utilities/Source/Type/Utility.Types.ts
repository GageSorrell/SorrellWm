/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A utility type that hints to the compiler that it should, in some cases, infer more narrowly. */
export type Any =
    | string
    | number
    | boolean
    | object
    | undefined
    | null;

export type InstanceOf<Type> = Type extends new (...ArgumentVector: any) => infer R ? R : never;
