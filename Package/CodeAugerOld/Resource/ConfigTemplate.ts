/**
 * @file      ConfigTemplate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable */
// @ts-nocheck

import type { Config } from "code-auger";

__DEFINE_MANIFESTS_TYPE__

const CodeAugerConfig: Config<Manifests> =
    {
        Global:
        {

        },
        Provider
    } as const;

export default CodeAugerConfig;
