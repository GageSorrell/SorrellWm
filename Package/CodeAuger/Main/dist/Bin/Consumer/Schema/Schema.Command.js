/**
 * @file      Schema.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Effect, JsonSchema, Schema, pipe } from "effect";
import { Command } from "effect/unstable/cli";
import { Schema as ConsumerSchema } from "../../../Consumer/Config/Config.js";
import { Terminal } from "effect/Terminal";
export /**
       * This command outputs the JSON schema of the `code-auger.config.json` file to the terminal.
       */ const SchemaCommand = pipe(Command.make("schema", {}, (_) => Effect.gen(function* () {
    const Term = yield* Terminal;
    const { dialect: _, ...OutBody } = JsonSchema.toDocumentDraft07(Schema.toJsonSchemaDocument(ConsumerSchema));
    /* eslint-disable-next-line @typescript-eslint/typedef */
    const Out = {
        $schema: "http://json-schema.org/draft-07/schema#",
        ...OutBody
    };
    return yield* Term.display(JSON.stringify(Out, null, 4) + "\n");
})), Command.withDescription("Output the JSON schema of the `code-auger.config.json` file to the terminal."), Command.withShortDescription("Get the the `code-auger.config.json` JSON schema."), Command.withHidden);
//# sourceMappingURL=Schema.Command.js.map