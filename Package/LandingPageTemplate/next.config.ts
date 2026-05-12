/**
 * @file      next.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { NextConfig } from "next";

const NextConfiguration: NextConfig =
    {
        reactCompiler: true,
        transpilePackages: [
            "@sorrell/landing-page"
        ],
    };

export default NextConfiguration;
