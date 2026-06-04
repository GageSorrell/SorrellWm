/**
 * @file      Consumer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { GenerateCommand } from "./Generate/index.js";
import { InitCommand } from "./Init/index.js";
import { ListCommand } from "./List/List.Command.js";
import { ValidateCommand } from "./Validate/index.js";
/* eslint-disable @typescript-eslint/typedef */
export /**
       * The commands available to consumers.
       */ const ConsumerCommands = [
    GenerateCommand,
    ValidateCommand,
    InitCommand,
    ListCommand
    // RefreshCommand
];
//# sourceMappingURL=Consumer.js.map