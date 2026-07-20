/**
 *
 *
 * @module @sorrell/effect-ink/Handle
 *
 * @file      Handle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Array from "effect/Array";
import * as BigInt from "effect/BigInt";
import * as Boolean from "effect/Boolean";
import type * as Brand from "effect/Brand";
import * as Context from "effect/Context";
import * as Function from "effect/Function";
import * as HashSet from "effect/HashSet";
import * as MutableHashMap from "effect/MutableHashMap";
import * as Option from "effect/Option";
import * as Struct from "effect/Struct";
import * as UndefinedOr from "effect/UndefinedOr";

export const TypeIdKey: "~sorrell/effect-ink/Handle" = "~sorrell/effect-ink/Handle" as const;
export type TypeIdKey = typeof TypeIdKey;

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export type Handle<KeyType extends string> = Brand.Branded<symbol, KeyType>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Any = Handle<string>;

export type GetHandle<HandleType extends Any> = (Key: string) => Option.Option<HandleType>;

export type PutHandle<HandleType extends Any> =
    {
        (): HandleType;

        (Key: string): HandleType;
    };

export type Factory<HandleType extends Any> =
    {
        readonly Get: GetHandle<HandleType>;
        readonly Put: PutHandle<HandleType>;
    };

export interface Reference
{
    readonly GetFactory: <const TypeIdType extends string>(TypeId: TypeIdType) => Factory<Handle<TypeIdType>>;
}

export const Reference: Context.Reference<Reference> = Context.Reference<Reference>(
    TypeIdKey,
    {
        defaultValue: (): Reference =>
        {
            type CountPart =
                {
                    Count: bigint;
                    Ids: HashSet.HashSet<string>;
                };

            // const Counters: CountRecord = MutableHashMap.empty<string, CountPart>();
            // const Make: CountRecord = MutableHashMap.empty<string, CountPart>();
            type CountRecord = MutableHashMap.MutableHashMap<string, CountPart>;
            const Counters: CountRecord = MutableHashMap.empty<string, CountPart>();
            const CountPart = (): CountPart => ({ Count: 0n, Ids: HashSet.empty<string>() });

            function GetFactory<const KeyType extends string>(HandleKey: KeyType): Factory<Handle<KeyType>>
            {
                MutableHashMap.modifyAt(
                    Counters,
                    HandleKey,
                    Option.match({
                        onNone: Function.flow(CountPart, Option.some),
                        onSome: Option.some
                    })
                );

                // const Barr = Function.flow(
                //     MutableHashMap.get(Counters), );
                // const GetCountRecord = MutableHashMap.get(Counters, HandleKey);

                const GetSymbolKeyFromIdOrCount = (Value: string | bigint): string =>
                    Function.pipe(
                        Value,
                        toString,
                        Array.append(HandleKey),
                        Array.join("-")
                    );

                const GetSymbol: (Id: string | bigint) => Handle<KeyType> =
                    Function.flow(
                        GetSymbolKeyFromIdOrCount,
                        Symbol.for as Function.FunctionN<readonly [ string ], Handle<KeyType>>
                    );

                const Get: GetHandle<Handle<KeyType>> = (Id: string) =>
                    Function.pipe(
                        MutableHashMap.get(Counters, HandleKey),
                        Option.map(Struct.get("Ids")),
                        Option.exists(HashSet.has(Id)),
                        Boolean.match({
                            onFalse: Function.constUndefined,
                            onTrue: () => GetSymbol(Id)
                        }),
                        Option.fromUndefinedOr
                    );

                const Put: PutHandle<Handle<KeyType>> = (Argument?: string) => Function.pipe(
                    Argument,
                    UndefinedOr.match<Handle<KeyType>, string>({
                        onDefined: (Id: string): Handle<KeyType> =>
                        {
                            MutableHashMap.modify(
                                Counters,
                                HandleKey,
                                Struct.evolve({ Ids: HashSet.add(Id) })
                            );

                            return GetSymbol(Id);
                        },
                        onUndefined: () =>
                        {
                            MutableHashMap.modify(
                                Counters,
                                HandleKey,
                                Struct.evolve({ Count: BigInt.increment })
                            );

                            return Function.pipe(
                                MutableHashMap.get(Counters, HandleKey),
                                Option.getOrThrow,
                                Struct.get("Count"),
                                toString,
                                GetSymbol
                            );
                        }
                    })
                );

                return { Get, Put } as const;
            }

            return { GetFactory } as const;
        }
    }
);
