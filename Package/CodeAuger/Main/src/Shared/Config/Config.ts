/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** The key of the config schemas that holds the path to the JSON schema file describing that schema. */
const $SchemaKey: "$Schema" = "$Schema" as const;

/** The key of the config schemas that holds the path to the JSON schema file describing that schema. */
export type $SchemaKey = typeof $SchemaKey;
