/**
 * @file      Providers.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { CodeAuger } from "../Shared/index.js";
import { Command } from "effect/unstable/cli";
import { InitCommand } from "./Init/Init.Command.js";
import { SchemaCommand } from "./Schema/Schema.Command.js";
// import { ValidateCommand } from "./Validate/index.js";
import { pipe } from "effect";
export /** The default file name stub for the `code-auger` provider config file. */ const ProviderConfigFileName = `${CodeAuger}.provider`;
/* eslint-disable @typescript-eslint/typedef */
export /**
       * The commands available to provider packages.
       */ const ProvidersCommand = pipe(Command.make("provider"), Command.withSubcommands([InitCommand, SchemaCommand])
// Command.withSubcommands([ InitCommand, ValidateCommand, SchemaCommand ])
);
//# sourceMappingURL=Providers.Command.js.map