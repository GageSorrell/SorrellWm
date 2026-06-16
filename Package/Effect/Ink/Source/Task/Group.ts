/**
 * Groups define the scope in which tasks (and their {@link Output | Outputs}) exist.
 *
 * @module @sorrell/effect-ink/Task/Group
 */

/**
 * @file      Group.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Log from "./Log.js";
import type * as Output from "./Output.js";
import type * as Task from "./Task.js";
import * as Utility from "./Internal/Utility.js";
import { MakeTagged, type Untagged } from "../Utility.ts";
import type { Function, HashSet } from "effect";
import { MultiMap } from "@sorrell/multimap";

const TypeId: string = "@sorrell/effect-ink/Task/Group";

export interface Options
{
    readonly _tag: "TaskOptions";

    readonly Children?: ReadonlyArray<MemberHandle>;

    readonly Key?: Handle;
    readonly ShowOutput?: boolean;
    readonly OutputStyle?: Output.Style;
}

export type Handle = Utility.Handle<"TaskGroup">;
export const Handle: Utility.HandleConstructor<Handle> = Utility.MakeHandleConstructor(TypeId);

export const IsGroupHandle: Utility.HandleGuard<Handle> = Utility.MakeHandleGuard(TypeId);

export type MemberHandle =
    | Task.Handle
    | Log.Handle
    | Output.Handle;

export const Anonymous: Handle = Handle("AnonymousGroupId");

export type Anonymous = typeof Anonymous;

export interface Settings
{
    readonly _tag: "GroupSettings";

    readonly OutputDisplay: Output.Display;
    readonly OutputStyle: Output.Style;
}

export const Settings: {
    (In: Untagged<Settings>): Settings;
} = MakeTagged("GroupSettings");

export const Empty: Function.LazyArg<MultiMap.MultiMap<Handle, MemberHandle>> =
    () => MultiMap.make<Handle, MemberHandle>([ Anonymous ]);

export type Groups = MultiMap.MultiMap<Handle, MemberHandle>;

export type MemberSet = HashSet.HashSet<MemberHandle>;
