/**
 *
 *
 * @module @sorrell/site/Cloud
 *
 * @file      Cloud.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import {
    ChangeResourceRecordSetsCommand,
    GetChangeCommand,
    ListHostedZonesByNameCommand,
    ListResourceRecordSetsCommand,
    Route53Client,
    type ResourceRecordSet
} from "@aws-sdk/client-route-53";
import { Vercel } from "@vercel/sdk";
import type { DeploymentFile, DomainRequirements, PublishingAdapter, RequiredDnsRecord } from "./Publish.js";

export const CloudTypeId = Symbol.for("@sorrell/site/Cloud");
export type CloudTypeId = typeof CloudTypeId;

/** Load and SHA-1 hash every file in a static build directory. @category Publishing @since 1.0.0 */
export const ReadDeploymentFiles = async (Root: string): Promise<ReadonlyArray<DeploymentFile>> =>
{
    const Files: Array<DeploymentFile> = [];
    const Visit = async (Directory: string): Promise<void> =>
    {
        for (const Entry of await readdir(Directory, { withFileTypes: true }))
        {
            const Path = join(Directory, Entry.name);
            if (Entry.isDirectory()) await Visit(Path);
            else if (Entry.isFile())
            {
                const Content = await readFile(Path);
                Files.push({ Content, Path: relative(Root, Path).replaceAll("\\", "/"), Sha1: createHash("sha1").update(Content).digest("hex") });
            }
        }
    };
    await Visit(Root);
    return Files;
};

/** Create the production adapter backed by the Vercel and Route 53 SDKs. @category Publishing @since 1.0.0 */
export const MakeCloudPublishingAdapter = async (
    Token: string,
    TeamId?: string,
    ZoneIdOverride?: string
): Promise<PublishingAdapter> =>
{
    const VercelClient = new Vercel({ bearerToken: Token });
    const Route53 = new Route53Client({});
    const Team = TeamId === undefined ? {} : { teamId: TeamId };
    let ChangeId: string | undefined;
    const ZoneId = ZoneIdOverride ?? await DiscoverZoneId(Route53);

    return {
        EnsureProject: async (Name) =>
        {
            const Existing = await VercelClient.projects.getProjects({ ...Team, limit: "100", search: Name });
            if (Array.isArray(Existing))
            {
                const Match = Existing.find((Project) => Project.name === Name);
                if (Match !== undefined) return Match.id;
            }
            const Created = await VercelClient.projects.createProject({ ...Team, requestBody: { name: Name, outputDirectory: "build" } });
            return Created.id;
        },
        Deploy: async (ProjectId, ProjectName, Files) =>
        {
            await Promise.all(Files.map((File) => VercelClient.deployments.uploadFile({
                ...Team, contentLength: File.Content.byteLength, requestBody: File.Content, xVercelDigest: File.Sha1
            })));
            const Deployment = await VercelClient.deployments.createDeployment({
                ...Team,
                requestBody: {
                    files: Files.map((File) => ({ file: File.Path, sha: File.Sha1, size: File.Content.byteLength })),
                    name: ProjectName,
                    project: ProjectId,
                    target: "production"
                }
            });
            let Expanded = "url" in Deployment ? Deployment :
                await VercelClient.deployments.getDeployment({ ...Team, idOrUrl: Deployment.id });
            for (let Attempt = 0; Attempt < 120 && Expanded.readyState !== "READY"; Attempt += 1)
            {
                if (Expanded.readyState === "ERROR" || Expanded.readyState === "CANCELED")
                {
                    throw new Error(`Vercel deployment ended in state ${ Expanded.readyState }.`);
                }
                await new Promise((Resolve) => setTimeout(Resolve, 5_000));
                Expanded = await VercelClient.deployments.getDeployment({ ...Team, idOrUrl: Deployment.id });
            }
            if (Expanded.readyState !== "READY") throw new Error("Vercel deployment did not become ready within ten minutes.");
            if (!("url" in Expanded) || typeof Expanded.url !== "string")
            {
                throw new Error("Vercel did not return an immutable deployment URL.");
            }
            const DeploymentUrl = Expanded.url;
            return { DeploymentUrl: `https://${ DeploymentUrl }` };
        },
        AttachDomain: async (ProjectId, Domain): Promise<DomainRequirements> =>
        {
            const Domains = await VercelClient.projects.getProjectDomains({ ...Team, idOrName: ProjectId, limit: 100 });
            const Existing = Domains.domains.find((Candidate) => Candidate.name === Domain);
            const Attached = Existing ?? await VercelClient.projects.addProjectDomain({ ...Team, idOrName: ProjectId, requestBody: { name: Domain } });
            const Configuration = await VercelClient.domains.getDomainConfig({ ...Team, domain: Domain, projectIdOrName: ProjectId });
            const Cname = [ ...Configuration.recommendedCNAME ].sort((Left, Right) => Left.rank - Right.rank).at(0)?.value;
            if (Cname === undefined && !Attached.verified) throw new Error(`Vercel did not return a CNAME target for ${ Domain }.`);
            const Records: Array<RequiredDnsRecord> = Cname === undefined ? [] : [ { Name: Domain, Type: "CNAME", Value: Cname } ];
            for (const Verification of Attached.verification ?? [])
            {
                if (Verification.type === "TXT") Records.push({ Name: Verification.domain, Type: "TXT", Value: Verification.value });
            }
            return { Records, Verified: Attached.verified };
        },
        ApplyDns: async (Records, Replace) =>
        {
            const Changes = [];
            for (const Record of Records)
            {
                const Existing = await Route53.send(new ListResourceRecordSetsCommand({ HostedZoneId: ZoneId, StartRecordName: Record.Name, MaxItems: 20 }));
                const Conflicts = (Existing.ResourceRecordSets ?? []).filter((Candidate) => NormalizeName(Candidate.Name) === NormalizeName(Record.Name));
                const Match = Conflicts.some((Candidate) => Candidate.Type === Record.Type && Values(Candidate).includes(Record.Value));
                if (Match) continue;
                if (Conflicts.length > 0 && !Replace) throw new Error(`DNS conflict at ${ Record.Name }; retry with --replace-dns to replace it.`);
                if (Conflicts.length > 0)
                {
                    for (const Conflict of Conflicts) Changes.push({ Action: "DELETE" as const, ResourceRecordSet: Conflict });
                }
                Changes.push({
                    Action: "CREATE" as const,
                    ResourceRecordSet: { Name: Record.Name, ResourceRecords: [ { Value: Record.Type === "TXT" ? `"${ Record.Value.replaceAll('"', '\\"') }"` : Record.Value } ], TTL: 300, Type: Record.Type }
                });
            }
            if (Changes.length === 0) return;
            const Response = await Route53.send(new ChangeResourceRecordSetsCommand({ ChangeBatch: { Changes }, HostedZoneId: ZoneId }));
            ChangeId = Response.ChangeInfo?.Id;
        },
        WaitForDns: async () =>
        {
            if (ChangeId === undefined) return;
            for (let Attempt = 0; Attempt < 120; Attempt += 1)
            {
                const Change = await Route53.send(new GetChangeCommand({ Id: ChangeId }));
                if (Change.ChangeInfo?.Status === "INSYNC") return;
                await new Promise((Resolve) => setTimeout(Resolve, 5_000));
            }
            throw new Error("Route 53 did not report INSYNC within ten minutes.");
        },
        VerifyDomain: async (ProjectId, Domain) =>
        {
            try
            {
                const Result = await VercelClient.projects.verifyProjectDomain({ ...Team, domain: Domain, idOrName: ProjectId });
                return Result.verified;
            }
            catch { return false; }
        }
    };
};

const NormalizeName = (Name?: string): string => (Name ?? "").replace(/\.$/u, "").toLowerCase();
const Values = (Record: ResourceRecordSet): ReadonlyArray<string> => (Record.ResourceRecords ?? []).map(({ Value = "" }) => Value.replace(/^"|"$/gu, ""));
const DiscoverZoneId = async (Client: Route53Client): Promise<string> =>
{
    const Result = await Client.send(new ListHostedZonesByNameCommand({ DNSName: "sorrell.sh", MaxItems: 10 }));
    const Match = Result.HostedZones?.find((Zone) => NormalizeName(Zone.Name) === "sorrell.sh");
    if (Match?.Id === undefined) throw new Error("Could not discover the exact sorrell.sh Route 53 hosted zone.");
    return Match.Id;
};
