import { Effect, pipe, Schema } from "effect";

export const SchemaTypeId = Symbol.for("@sorrell/site-core/Schema");
export type SchemaTypeId = typeof SchemaTypeId;

const NonEmptyString = Schema.String.check(Schema.isMinLength(1));
const PackageName = Schema.String.check(Schema.isPattern(/^@sorrell\/[a-z0-9][a-z0-9-]*$/u));
const Subdomain = Schema.String.check(Schema.isPattern(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u));
const Theme = Schema.Literals([ "Effect", "Fluent" ]);

/** A link displayed on a generated landing page. @category Schema @since 1.0.0 */
export const LandingActionSchema = Schema.Struct({ Href: NonEmptyString, Label: NonEmptyString });

/** A landing-page feature. @category Schema @since 1.0.0 */
export const LandingFeatureSchema = Schema.Struct({
    Description: NonEmptyString,
    Points: Schema.optional(Schema.Array(NonEmptyString)),
    Title: NonEmptyString
});

/** Secret-free landing content stored in `website.config.json`. @category Schema @since 1.0.0 */
export const LandingContentSchema = Schema.Struct({
    Actions: pipe(Schema.Array(LandingActionSchema), Schema.optional,
        Schema.withDecodingDefault(Effect.succeed([]))),
    Description: NonEmptyString,
    Features: pipe(Schema.Array(LandingFeatureSchema), Schema.optional,
        Schema.withDecodingDefault(Effect.succeed([]))),
    InstallationPackage: Schema.optional(NonEmptyString),
    Links: pipe(Schema.Array(LandingActionSchema), Schema.optional,
        Schema.withDecodingDefault(Effect.succeed([])))
});

const CommonFields = {
    Landing: LandingContentSchema,
    OutputDirectory: pipe(NonEmptyString, Schema.optional,
        Schema.withDecodingDefault(Effect.succeed("build"))),
    PackageName,
    Subdomain,
    Theme,
    Title: NonEmptyString,
    VercelProjectName: NonEmptyString
} as const;

/** A Docusaurus website definition with localization and versioning defaults. @category Schema @since 1.0.0 */
export const DocusaurusWebsiteSchema = Schema.Struct({
    ...CommonFields,
    DefaultLocale: pipe(NonEmptyString, Schema.optional,
        Schema.withDecodingDefault(Effect.succeed("en-US"))),
    Kind: Schema.Literal("Docusaurus"),
    Locales: pipe(Schema.Array(NonEmptyString), Schema.optional,
        Schema.withDecodingDefault(Effect.succeed([ "en-US", "es-US" ]))),
    Versioning: pipe(Schema.Boolean, Schema.optional,
        Schema.withDecodingDefault(Effect.succeed(true)))
});

/** A Storybook website definition. @category Schema @since 1.0.0 */
export const StorybookWebsiteSchema = Schema.Struct({
    ...CommonFields,
    Kind: Schema.Literal("Storybook"),
    LandingEnabled: pipe(Schema.Boolean, Schema.optional,
        Schema.withDecodingDefault(Effect.succeed(false))),
    SourceWorkspace: NonEmptyString,
    Stories: Schema.Array(NonEmptyString)
});

/** Every website definition understood by `sorrell-site`. @category Schema @since 1.0.0 */
export const WebsiteDefinitionSchema = Schema.Union([ DocusaurusWebsiteSchema, StorybookWebsiteSchema ]);

/** @category Model @since 1.0.0 */
export type DocusaurusWebsiteDefinition = typeof DocusaurusWebsiteSchema.Type;
/** @category Model @since 1.0.0 */
export type StorybookWebsiteDefinition = typeof StorybookWebsiteSchema.Type;
/** @category Model @since 1.0.0 */
export type WebsiteDefinition = typeof WebsiteDefinitionSchema.Type;

/** Decode unknown JSON and apply safe defaults. @category Decoding @since 1.0.0 */
export const DecodeWebsiteDefinition = Schema.decodeUnknownSync(WebsiteDefinitionSchema);
