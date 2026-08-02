/**
 *
 *
 * @module @sorrell/site/Publish
 *
 * @file      Publish.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";
import type { WebsiteDefinition } from "@sorrell/site-core/Schema";

export const PublishTypeId = Symbol.for("@sorrell/site/Publish");
export type PublishTypeId = typeof PublishTypeId;

/** A content-addressed static file uploaded to Vercel. */
export interface DeploymentFile
{
    readonly Content: Uint8Array;
    readonly Path: string;
    readonly Sha1: string;
}

/** A DNS record requested by Vercel. */
export interface RequiredDnsRecord
{
    readonly Name: string;
    readonly Type: "CNAME" | "TXT";
    readonly Value: string;
}

/** Result of attaching a domain to a Vercel project. */
export interface DomainRequirements
{
    readonly Records: ReadonlyArray<RequiredDnsRecord>;
    readonly Verified: boolean;
}

/** Cloud boundary used by the publishing workflow and its fakes. */
export interface PublishingAdapter
{
    readonly ApplyDns: (Records: ReadonlyArray<RequiredDnsRecord>, Replace: boolean) => Promise<void>;
    readonly AttachDomain: (ProjectId: string, Domain: string) => Promise<DomainRequirements>;
    readonly Deploy: (ProjectId: string, ProjectName: string, Files: ReadonlyArray<DeploymentFile>) => Promise<{ readonly DeploymentUrl: string }>;
    readonly EnsureProject: (Name: string) => Promise<string>;
    readonly VerifyDomain: (ProjectId: string, Domain: string) => Promise<boolean>;
    readonly WaitForDns: () => Promise<void>;
}

/** Publishing inputs independent of filesystem and credentials. */
export interface PublishOptions
{
    readonly Adapter: PublishingAdapter;
    readonly Definition: WebsiteDefinition;
    readonly Files: ReadonlyArray<DeploymentFile>;
    readonly ReplaceDns?: boolean;
    readonly Retry?: { readonly Attempts: number; readonly Delay: () => Promise<void> };
    readonly RetryWorkspace?: string;
}

/** URLs produced by a successful production publication. */
export interface PublishResult
{
    readonly DeploymentUrl: string;
    readonly ProductionUrl: string;
}

/** A publication that deployed successfully but could not finish DNS. */
export class DnsPublicationError extends Data.TaggedError("DnsPublicationError")<{
    readonly DeploymentUrl: string;
    readonly Message: string;
    readonly RetryCommand: string;
}> { }

/** Publish built static files and reconcile the website's independent subdomain. @category Publishing @since 1.0.0 */
export const PublishWebsite = async (Options: PublishOptions): Promise<PublishResult> =>
{
    const Domain = `${ Options.Definition.Subdomain }.sorrell.sh`;
    const ProjectId = await Options.Adapter.EnsureProject(Options.Definition.VercelProjectName);
    const Deployment = await Options.Adapter.Deploy(ProjectId, Options.Definition.VercelProjectName, Options.Files);
    try
    {
        const Requirements = await Options.Adapter.AttachDomain(ProjectId, Domain);
        if (!Requirements.Verified)
        {
            await Options.Adapter.ApplyDns(Requirements.Records, Options.ReplaceDns ?? false);
            await Options.Adapter.WaitForDns();
            const Retry = Options.Retry ?? { Attempts: 60, Delay: () => new Promise((Resolve) => setTimeout(Resolve, 10_000)) };
            let Verified = false;
            for (let Attempt = 0; Attempt < Retry.Attempts && !Verified; Attempt += 1)
            {
                Verified = await Options.Adapter.VerifyDomain(ProjectId, Domain);
                if (!Verified && Attempt + 1 < Retry.Attempts) await Retry.Delay();
            }
            if (!Verified) throw new Error("Vercel did not verify the domain within ten minutes.");
        }
        return { DeploymentUrl: Deployment.DeploymentUrl, ProductionUrl: `https://${ Domain }` };
    }
    catch (Cause)
    {
        const Message = Cause instanceof Error ? Cause.message : String(Cause);
        throw new DnsPublicationError({
            DeploymentUrl: Deployment.DeploymentUrl,
            Message,
            RetryCommand: `sorrell-site publish ${ Options.RetryWorkspace ?? "." }${ Options.ReplaceDns === true ? " --replace-dns" : "" }`
        });
    }
};
