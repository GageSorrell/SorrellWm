#!/usr/bin/env node
/* File:      Register.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This module defines the `register` command.
 */

import { Command } from "commander";
import { RunCommand } from "./index.js";

async function Register(this: Command): Promise<void>
{

}

async function Main(): Promise<void>
{
    const RegisterCommand: Command = new Command("register")
        .description("@TODO")
        .action(Register);

    await RunCommand(RegisterCommand);
}

Main();
