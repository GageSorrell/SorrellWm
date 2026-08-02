/**
 *
 *
 * @module @sorrell/site/Test/Generator.test
 *
 * @file      Generator.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { PlanWebsite, ValidateOutputPath } from "../Source/Generator.js";
import type { DocusaurusWebsiteDefinition } from "@sorrell/site-core/Schema";

const Definition: DocusaurusWebsiteDefinition = {
    Kind: "Docusaurus", Landing: { Actions: [], Description: "Docs", Features: [] }, Locales: [ "en-US", "es-US" ],
    OutputDirectory: "build", PackageName: "@sorrell/example-docs", Subdomain: "example", Theme: "Fluent", Title: "Example", VercelProjectName: "example-docs", Versioning: true
};

describe("generator", () =>
{
    it("rejects paths outside Website", () => expect(() => ValidateOutputPath("C:/repo", "Package/nope")).toThrow());
    it("plans a Docusaurus site without writes", () =>
    {
        const Result = PlanWebsite({ Definition, Destination: "Website/Example", DryRun: true, RepositoryRoot: "C:/repo" });
        expect(Result.Operations.some((Operation) => Operation.Path.endsWith("website.config.json"))).toBe(true);
        expect(Result.Operations.some((Operation) => Operation.Path.endsWith("docs\\intro.mdx"))).toBe(true);
    });
});
