/**
 *
 *
 * @module @sorrell/site/Test/Publish.test
 *
 * @file      Publish.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { DnsPublicationError, PublishWebsite, type PublishingAdapter } from "../Source/Publish.js";
import type { StorybookWebsiteDefinition } from "@sorrell/site-core/Schema";

const Definition: StorybookWebsiteDefinition = {
    Kind: "Storybook", Landing: { Actions: [], Description: "UI", Features: [], Links: [] }, LandingEnabled: false,
    OutputDirectory: "build", PackageName: "@sorrell/example-storybook", SourceWorkspace: "Package/Example", Stories: [ "../src/**/*.stories.tsx" ],
    Subdomain: "example-ui", Theme: "Effect", Title: "Example", VercelProjectName: "example-storybook"
};

const Adapter = (Verified: boolean): PublishingAdapter => ({
    ApplyDns: async () => undefined,
    AttachDomain: async () => ({ Records: [ { Name: "example-ui.sorrell.sh", Type: "CNAME", Value: "cname.vercel-dns.com" } ], Verified: false }),
    Deploy: async () => ({ DeploymentUrl: "https://immutable.vercel.app" }),
    EnsureProject: async () => "project",
    VerifyDomain: async () => Verified,
    WaitForDns: async () => undefined
});

describe("publishing", () =>
{
    it("publishes with injected cloud adapters", async () =>
    {
        const Result = await PublishWebsite({ Adapter: Adapter(true), Definition, Files: [], Retry: { Attempts: 1, Delay: async () => undefined } });
        expect(Result.ProductionUrl).toBe("https://example-ui.sorrell.sh");
    });
    it("preserves deployment details when DNS verification times out", async () =>
    {
        await expect(PublishWebsite({ Adapter: Adapter(false), Definition, Files: [], Retry: { Attempts: 1, Delay: async () => undefined } }))
            .rejects.toBeInstanceOf(DnsPublicationError);
    });
});
