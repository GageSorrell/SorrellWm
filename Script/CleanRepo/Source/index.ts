/**
 * Command-line entry point for removing generated repository artifacts.
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-console */

import { Main } from "./CleanRepo.js";

Main().catch((Error: unknown) =>
{
    console.error(Error);
    process.exitCode = 1;
});
