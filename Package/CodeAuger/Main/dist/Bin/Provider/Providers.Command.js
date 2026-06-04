/**
 * @file      Providers.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as Sorrell from "@sorrell/cli-utilities/cli";
import { Effect, pipe } from "effect";
import { Command } from "@sorrell/effect/unstable/cli";
import { InitCommand } from "./Init/Init.Command.js";
import { ValidateCommand } from "./Validate/index.js";
/* eslint-disable @typescript-eslint/typedef */
export /**
       * The commands available to provider packages.
       */ const ProvidersCommand = pipe(Command.make("provider", {}, (_) => Effect.succeed(undefined)), Command.withSubcommands([InitCommand, ValidateCommand]));
//# sourceMappingURL=Providers.Command.js.map