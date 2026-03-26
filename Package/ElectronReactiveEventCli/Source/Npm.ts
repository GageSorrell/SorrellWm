/* File:      Npm.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import { join } from "path";
import { readFile } from "fs/promises";
import { spawn, type ChildProcess } from "child_process";
