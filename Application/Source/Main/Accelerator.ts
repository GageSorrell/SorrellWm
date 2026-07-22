/**
 *
 *
 * @module @sorrell/wm/Main/Accelerator
 *
 * @file      Accelerator.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// import { Key } from "@sorrell/windows";
// import { Function, Option, Predicate } from "effect";

// const TypeIdKey = "~sorrell/wm/Main/Accelerator" as const;
// export const TypeId: unique symbol = Symbol.for(TypeIdKey);
// export type TypeId = typeof TypeId;

// export interface ModifierSet
// {
//     readonly [ Key.Ctrl ]: boolean;
//     readonly [ Key.Shift ]: boolean;
//     readonly [ Key.Alt ]: boolean;
//     // readonly [ Key.Super ]: boolean;
// }

// export interface Accelerator
// {
//     readonly [ TypeId ]: TypeId;

//     readonly Modifiers: ModifierSet;
//     readonly Key: Key.Key;
// }

// const Proto =
//     {
//         [ TypeId ]: TypeId
//     } as const;

// export const Accelerator = (Modifiers: ModifierSet, Key: Key.Key): Accelerator =>
// {
//     const Out = Object.create(Proto);
//     Out.Modifiers = Modifiers;
//     Out.Key = Key;

//     return Object.freeze(Out);
// };

// export const HasKey: {
//     (Key: Key.Any): (Self: Accelerator) => boolean;
//     (Self: Accelerator, Key: Key.Any): boolean;
// } = Function.dual(2, (Self: Accelerator, InKey: Key.Any): boolean =>
// {
//     if (
//         (InKey === Key.Ctrl && Self.Modifiers[Key.Ctrl]) ||
//         (InKey === Key.Alt && Self.Modifiers[Key.Alt]) ||
//         // (InKey === Key.Super && Self.Modifiers[Key.Super]) ||
//         (InKey === Key.Shift && Self.Modifiers[Key.Shift])
//     )
//     {
//         return true;
//     }

//     return InKey === Self.Key;
// });

// export const ToString = (Accelerator: Accelerator): string =>
// {
//     const ModifiersPart: Array<string> = [ ];
//     // if (Accelerator.Modifiers[Key.Super])
//     // {
//     //     ModifiersPart.push(Key.Super);
//     // }
//     if (Accelerator.Modifiers[Key.Ctrl])
//     {
//         ModifiersPart.push(Key.Ctrl);
//     }
//     if (Accelerator.Modifiers[Key.Shift])
//     {
//         ModifiersPart.push(Key.Shift);
//     }
//     if (Accelerator.Modifiers[Key.Alt])
//     {
//         ModifiersPart.push(Key.Alt);
//     }

//     return [ ...ModifiersPart, Accelerator.Key ].join("+");
// };

// export const FromString = (Value: string): Option.Option<Accelerator> =>
// {
//     if (!Value.includes("+"))
//     {
//         return Option.none();
//     }

//     const Parts: ReadonlyArray<string> = Value.split("+");

//     if (!Parts.every((Key.Keys as ReadonlyArray<string>).includes))
//     {
//         return Option.none();
//     }

//     return Option.some(Accelerator(
//         {
//             "Alt": Parts.includes("Alt"),
//             "Shift": Parts.includes("Shift"),
//             // "Super": Parts.includes("Super"),
//             "Ctrl": Parts.includes("Ctrl")
//         },
//         Parts[Parts.length - 1] as Key.Key
//     ));
// };

// export const IsAccelerator: { (Value: unknown): Value is Accelerator; } =
//     Predicate.hasProperty(TypeId) as any;
