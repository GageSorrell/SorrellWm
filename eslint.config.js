/**
 * Root re-export of the monorepo ESLint configuration.
 *
 * ESLint discovers this file by walking up from the working directory, so the
 * config resolves regardless of which directory a tool (or the VS Code ESLint
 * extension) runs from.  The actual configuration lives in
 * `./Configuration/eslint.config.js`.
 *
 * @file      eslint.config.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export { default } from "./Configuration/eslint.config.js";
