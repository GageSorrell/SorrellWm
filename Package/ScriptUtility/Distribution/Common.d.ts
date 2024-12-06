import type { TRef } from "./Common.Types.js";
export declare const Run: (MainFunction: (() => Promise<void>), ScriptTitle: string, ScriptDescription: string) => void;
export declare const GetMonorepoPath: () => string;
export declare const GetRef: <T>(InitialValue?: T) => TRef<T>;
//# sourceMappingURL=Common.d.ts.map