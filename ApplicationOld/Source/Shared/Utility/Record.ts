/**
 * @file      Record.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// import type { FRecord, TRecord } from "@sorrell/wm-windows";
// import type { SRecord, TStructuredMap, TStructuredMapCallback } from "./Record.Types";
// import type { TMapRecordTransformer, TObjectPath, TTypeFromPath } from "./Utility.Types";
// import type { TGetFromPathReturnType } from "./Record.Internal.Types";

// const Password: "__DO_NOT_USE_INSTANTIATE_SRECORD_DIRECTLY__" =
//     "__DO_NOT_USE_INSTANTIATE_SRECORD_DIRECTLY__" as const;

// export class SRecordInternal<KeyType extends string | symbol = string | symbol, PropertyType = unknown>
// {
//     public constructor(
//         _Password: "__DO_NOT_USE_INSTANTIATE_SRECORD_DIRECTLY__",
//         In?: TRecord<KeyType, PropertyType>
//     )
//     {
//         type SThisRecord = SRecordInternal<KeyType, PropertyType>;

//         if (In !== undefined)
//         {
//             if (In !== undefined)
//             {
//                 this.__Record__ = { ...In };
//             }
//         }

//         return new Proxy(this, {
//             get: (Target: SThisRecord, Property: KeyType, Receiver: unknown) =>
//             {
//                 if (typeof Property === "string" && !(Property in Target))
//                 {
//                     // if ()
//                     return this.__Record__[Property];
//                 }

//                 return Reflect.get(Target, Property, Receiver);
//             },
//             has: <PathType extends TObjectPath<TRecord<KeyType, PropertyType>>>(
//                 Target: SThisRecord,
//                 Path: PathType | KeyType
//             ): boolean =>
//             {
//                 if (this.HasPath<PathType>(Path as PathType))
//                 {
//                     return  true;
//                 }

//                 return Reflect.has(Target, Path);
//             },
//             set: (
//                 Target: SThisRecord,
//                 Property: KeyType,
//                 Value: PropertyType,
//                 Receiver: unknown
//             ) =>
//             {
//                 if (typeof Property === "string" && !(Property in Target))
//                 {
//                     this.__Record__[Property] = Value;
//                     return true;
//                 }

//                 return Reflect.set(Target, Property, Value, Receiver);
//             }
//         });
//     }

//     /** Iterate over the keys in this record. */
//     public Map<ReturnElementType>(
//         Callback: TMapRecordTransformer<KeyType, PropertyType, ReturnElementType>
//     ): Array<ReturnElementType>
//     {
//         return Object.keys(this.__Record__).map((InKey: unknown, Index: number): ReturnElementType =>
//         {
//             const Key: KeyType = InKey as KeyType;
//             return Callback(Key, this.__Record__[Key] as PropertyType, Index);
//         });
//     }

//     private IsRecord<TestKeyType extends PropertyKey, TestPropertyType>(
//         In: unknown
//     ): In is TRecord<TestKeyType, TestPropertyType>
//     {
//         if (typeof In !== "object" || In === null)
//         {
//             return false;
//         }

//         if (Array.isArray(In))
//         {
//             return false;
//         }

//         const Prototype: unknown = Object.getPrototypeOf(In);

//         return Prototype === Object.prototype || Prototype === null;
//     }

//     public StructuredMap<NestedKeyType extends PropertyKey, CallbackReturnType, MappedRecordPropertyType>(
//         Callback: TStructuredMapCallback<
//             Record<KeyType | NestedKeyType, PropertyType>,
//             PropertyType,
//             CallbackReturnType>
//     ): TStructuredMap<Record<KeyType, PropertyType>, MappedRecordPropertyType>
//     {
//         const Recurrence = (In: unknown): unknown =>
//         {
//             if (this.IsRecord(In))
//             {

//             }
//             else if (Array.isArray(In))
//             {

//             }
//             else
//             {

//             }
//         };
//             // as TStructuredMap<Record<KeyType, PropertyType>, MappedRecordPropertyType>;
//         // return Object.keys(this.__Record__).map((InKey: unknown, Index: number): ReturnElementType =>
//         // {
//         //     const Key: KeyType = InKey as KeyType;
//         //     return Callback(Key, this.__Record__[Key] as PropertyType, Index);
//         // });
//     }

//     public HasPath<PathType extends TObjectPath<TRecord<KeyType, PropertyType>>>(
//         Path: PathType
//     ): boolean
//     {
//         let Found: boolean = true;

//         const PathSplit: Array<string> = Path.split(".");

//         const Recurrence = (In: unknown, Index: number = 0): unknown =>
//         {
//             const Key: string | undefined = PathSplit[Index];

//             if (Key !== undefined)
//             {
//                 if (Key in (In as TRecord<string, unknown>))
//                 {
//                     const Next: unknown = (In as TRecord<string, unknown>)[Key];
//                     if (Index !== PathSplit.length - 1)
//                     {
//                         Recurrence(Next, Index + 1);
//                     }
//                 }
//                 else
//                 {
//                     Found = false;
//                 }
//             }
//             else
//             {
//                 return undefined;
//             }
//         };

//         Recurrence(this.__Record__) as TGetFromPathReturnType<KeyType, PropertyType, PathType>;
//         return Found;
//     }

//     public GetFromPath<PathType extends TObjectPath<SRecord<KeyType, PropertyType>>>(
//         Path: PathType
//     ): TGetFromPathReturnType<KeyType, PropertyType, PathType>
//     {
//         const PathSplit: Array<string> = Path.split(".");

//         const Recurrence = (In: unknown, Index: number = 0): unknown =>
//         {
//             const Key: string | undefined = PathSplit[Index];

//             if (Key !== undefined)
//             {
//                 if (Key in (In as TRecord<string, unknown>))
//                 {
//                     const Next: unknown = (In as TRecord<string, unknown>)[Key];
//                     if (Index !== PathSplit.length - 1)
//                     {
//                         return Recurrence(Next, Index + 1);
//                     }
//                     else
//                     {
//                         return Next;
//                     }
//                 }
//                 else
//                 {
//                     return undefined;
//                 }
//             }
//             else
//             {
//                 return undefined;
//             }
//         };

//         type FReturnType = TTypeFromPath<PathType, SRecord<KeyType, PropertyType>> | FGetFromPathFailed;
//         return Recurrence(this.__Record__) as FReturnType;
//     };

//     private readonly __Record__: FRecord = { };
// };

// export const NewRecord = <
//     KeyType extends string | symbol = string | symbol,
//     PropertyType = unknown
// >(In?: TRecord<KeyType, PropertyType>): SRecord<KeyType, PropertyType> =>
// {
//     return new SRecordInternal(Password, In) as SRecord<KeyType, PropertyType>;
// };
