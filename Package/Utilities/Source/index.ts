/**
 * General-purpose utility types and functions.  You may import modules
 * directly from here, or you may use the corresponding scoped export path.
 * For example, to import the {@link \@sorrell/utilities/dependency} module, you
 * may use either of,
 *
 * ```typescript
 * import { Dependency } from "@sorrell/utilities";
 * import * as Dependency from "@sorrell/utilities/dependency";
 * ```
 *
 * This module only exports the top-level modules of this package, however there
 * exists a scoped export path for *every* module in this package.  For example,
 * to import the {@link \@sorrell/utilities/generic/option} module, you must use
 * either of the scoped paths containing the module,
 *
 * ```typescript
 * import { Option } from "@sorrell/utilities/generic";
 * import * as Option from "@sorrell/utilities/generic/option";
 * ```
 *
 * @module @sorrell/utilities
 */

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Array from "./Array/index.ts";
export * as Async from "./Async/index.ts";
export * as Complex from "./Math/Complex.ts";
export * as Effect from "./Effect/index.ts";
export * as FileSystem from "./FileSystem/index.ts";
export * as Functional from "./Functional/index.ts";
export * as Math from "./Math/index.ts";
export * as Miscellaneous from "./Miscellaneous/index.ts";
export * as Npm from "./Npm/index.ts";
export * as Path from "./Path/index.ts";
export * as Record from "./Record/index.ts";
export * as String from "./String/index.ts";
export * as TsConfig from "./TsConfig/index.ts";
export * as Tuple from "./Tuple/index.ts";
export * as Type from "./Type/index.ts";
