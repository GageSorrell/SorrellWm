/**
 *
 *
 * @module @sorrell/site-core/Test/Core.test
 *
 * @file      Core.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { CreateDocusaurusConfig } from "../Source/Docusaurus.js";
import { CreateStorybookConfig } from "../Source/Storybook.js";
import { DecodeWebsiteDefinition } from "../Source/Schema.js";

describe("site core", () =>
{
    it("applies Docusaurus locale and build defaults", () =>
    {
        const Website = DecodeWebsiteDefinition({
            Kind: "Docusaurus",
            Landing: {
                Description: "Documentation",
                Actions: [ { Href: "/docs", Label: "Read" } ]
            },
            PackageName: "@sorrell/example-docs",
            Subdomain: "example",
            Theme: "Fluent",
            Title: "Example",
            VercelProjectName: "example-docs"
        });

        expect(Website.Kind).toBe("Docusaurus");

        if (Website.Kind === "Docusaurus")
        {
            expect(Website.Locales).toEqual([ "en-US", "es-US" ]);
            const Config = CreateDocusaurusConfig(Website, { PackageName: "theme" });
            expect(Config.url).toBe("https://example.sorrell.sh");
            expect(Config.themes).toEqual([ "theme" ]);
        }
    });

    it("rejects invalid package names and nested subdomains", () =>
    {
        expect(() => DecodeWebsiteDefinition({
            Kind: "Storybook",
            Landing: { Description: "Example" },
            PackageName: "example",
            SourceWorkspace: "Package/Example",
            Stories: [ "../Stories/*.stories.tsx" ],
            Subdomain: "nested.example",
            Theme: "Effect",
            Title: "Example",
            VercelProjectName: "example"
        })).toThrow();
    });

    it("creates Storybook configuration with the selected preset", () =>
    {
        const Website = DecodeWebsiteDefinition({
            Kind: "Storybook",
            Landing: { Description: "Example" },
            PackageName: "@sorrell/example-storybook",
            SourceWorkspace: "Package/Example",
            Stories: [ "../Stories/*.stories.tsx" ],
            Subdomain: "example-ui",
            Theme: "Effect",
            Title: "Example UI",
            VercelProjectName: "example-storybook"
        });

        if (Website.Kind !== "Storybook")
        {
            throw new Error("Expected Storybook definition.");
        }

        const Config = CreateStorybookConfig(Website, { PackageName: "theme" });
        expect(Config.addons).toContain("theme");
    });
});
