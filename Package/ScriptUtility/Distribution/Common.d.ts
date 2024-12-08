import type { FCommonPath, TRef, TTaskTuple } from "./Common.Types.js";
export declare const FormatCode: (Code: string) => string;
export declare const DoTasks: <T>(...Tasks: Array<TTaskTuple<T>>) => Promise<void>;
export declare const DoTask: <T>(Task: (() => Promise<T>), Description: string) => Promise<T>;
export declare const Run: (MainFunction: (() => Promise<void>), ScriptTitle: string, ScriptDescription: string) => void;
export declare const GetMonorepoPath: () => string;
export declare const GetRef: <T>(InitialValue?: T) => TRef<T>;
/**
 * Like `Array#map`, but if the predicate returns `undefined`,
 * then that item will not have a corresponding item in the
 * returned array.
 */
export declare const MapSome: <T, U>(InArray: Array<T> | Readonly<Array<T>>, Predicate: (Item: T) => (U | undefined)) => Array<U>;
export declare const GetPath: (CommonPath: FCommonPath) => string;
//# sourceMappingURL=Common.d.ts.map