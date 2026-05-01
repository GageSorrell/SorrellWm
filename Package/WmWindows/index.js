/**
 * @file      index.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable */

import { createRequire } from "node:module";

const Require = createRequire(import.meta.url);
const SorrellWm = Require("./Build/Release/SorrellWmWindows.node");

export default SorrellWm;
