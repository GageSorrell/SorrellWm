/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { $SchemaKey } from "./Config.ts";
/**
 * The config type of a given {@link SchemaType}, with the {@link $SchemaKey | "$schema"} omitted.
 *
 * @template SchemaType - The `typeof` the `.Type` property of the schema from which the resulting
 * config type is produced.
 */
export type ConfigSchema<SchemaType> = Omit<SchemaType, $SchemaKey>;
//# sourceMappingURL=Config.Types.d.ts.map