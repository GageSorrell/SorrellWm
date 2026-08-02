# Publishing Websites

`sorrell-site publish` builds one generated workspace, uploads its static files to a dedicated Vercel project, attaches its independent `<subdomain>.sorrell.sh` domain, and reconciles the required records in the exact `sorrell.sh` Route 53 hosted zone.

Publishing never stores credentials and never shares a Vercel project or subdomain between websites.

## Prerequisites

- The generated workspace is installed and builds successfully into its configured `OutputDirectory` (`build` by default).
- A Vercel token can manage the configured project and domain.
- AWS credentials can list and update the `sorrell.sh` hosted zone and inspect Route 53 changes.
- The requested subdomain is not the apex and does not depend on a wildcard record.

Set credentials in the process environment:

| Environment input | Required | Purpose |
| --- | --- | --- |
| `VERCEL_TOKEN` | Yes | Authenticates `@vercel/sdk`. |
| `VERCEL_TEAM_ID` | No | Scopes project, deployment, and domain operations to a Vercel team. |
| Standard AWS credential chain | Yes | Authenticates `@aws-sdk/client-route-53`; profiles, environment credentials, and supported AWS providers work normally. |
| `SORRELL_ROUTE53_ZONE_ID` | No | Bypasses hosted-zone discovery with an explicit zone ID. |

Example for a local PowerShell session:

```powershell
$env:VERCEL_TOKEN = "..."
$env:VERCEL_TEAM_ID = "team_..."
$env:AWS_PROFILE = "sorrell-production"

npx --no-install sorrell-site publish Website/WindowAPI --dry-run
npx --no-install sorrell-site publish Website/WindowAPI
```

Do not put these values in `website.config.json`, generated source, npm scripts, or committed `.env` files.

## Dry Run

Always begin with:

```powershell
npx --no-install sorrell-site publish Website/WindowAPI --dry-run
```

The command reads and schema-validates `website.config.json` and reports the workspace, Vercel project, and production hostname it would use. It returns before checking `VERCEL_TOKEN`, building, initializing SDK clients, uploading, or changing DNS.

A publication dry run is an intent check, not a complete cloud preflight. Run the website's build separately when validating its output:

```powershell
npm run build -w @sorrell/window-api-docs
```

## Publication Sequence

A real publication performs these operations:

1. Read and decode `website.config.json`.
2. Require `VERCEL_TOKEN` and initialize Vercel and Route 53 SDK clients.
3. Run `npm run build` in the website workspace with inherited terminal output.
4. Require the configured output directory to exist.
5. Recursively read every static file, normalize its relative path to forward slashes, and calculate its SHA-1 digest.
6. Find an exact-name Vercel project or create one configured for `build` output.
7. Upload content-addressed files and create a production deployment.
8. Poll the deployment every five seconds for up to ten minutes until it is `READY`; fail immediately on `ERROR` or `CANCELED`.
9. Find or attach `<Subdomain>.sorrell.sh` to the project.
10. Read Vercel's highest-priority recommended CNAME and any TXT verification challenges.
11. Reconcile those records in Route 53.
12. Wait for the Route 53 change to report `INSYNC`, polling every five seconds for up to ten minutes.
13. Ask Vercel to verify the domain every ten seconds for up to ten minutes.
14. Print both the production URL and the immutable deployment URL.

If `SORRELL_ROUTE53_ZONE_ID` is absent, the publisher lists hosted zones beginning at `sorrell.sh` and accepts only a normalized exact match. It does not mutate a similarly prefixed zone.

## DNS Reconciliation

Reconciliation is designed to be repeatable:

- If an exact record value already exists, it succeeds without a Route 53 change.
- If no record exists at the name, it creates the required CNAME or TXT record with a 300-second TTL.
- If a different record exists at the required name, publication fails without DNS mutation.
- `--replace-dns` explicitly authorizes deleting conflicting records at those names and creating Vercel's required records.

Review conflicts before using replacement:

```powershell
npx --no-install sorrell-site publish Website/WindowAPI --replace-dns
```

Replacement can remove records of another type at the same name, not only a stale CNAME value. It should be used only when the generated website is intended to take ownership of that hostname or verification name.

## Partial Failure and Recovery

Once Vercel returns a successful deployment, later DNS or verification failures do not delete it. The publisher raises a `DnsPublicationError` containing:

- the immutable deployment URL;
- the DNS or verification failure message; and
- a safe `sorrell-site publish <workspace>` retry command, preserving `--replace-dns` when it was used.

Correct the credential, zone, or record problem and rerun the reported command. File uploads and project/domain lookup are idempotent, so a retry can reuse matching cloud state even though it creates a new production deployment.

Common failures include:

| Message or symptom | Response |
| --- | --- |
| `VERCEL_TOKEN is required` | Export a valid token in the publishing process. |
| Exact hosted zone cannot be discovered | Set the correct AWS account/profile or `SORRELL_ROUTE53_ZONE_ID`. |
| DNS conflict | Inspect Route 53. Remove the stale record manually or rerun with deliberate `--replace-dns`. |
| Build output was not found | Keep `OutputDirectory` and the framework build script aligned. |
| Vercel deployment timeout/error | Inspect the immutable deployment/project in Vercel, fix the build or account issue, and retry. |
| Route 53 never reports `INSYNC` | Inspect the Route 53 change ID in AWS and retry after resolving the account/service problem. |
| Vercel does not verify within ten minutes | Confirm the CNAME/TXT values publicly, allow propagation time, then retry. |

## CI Use

The CLI is noninteractive when all create options are supplied and publication itself requires no prompts. A CI job can install, build, and publish using injected secrets:

```powershell
npm ci
npm run typecheck -w @sorrell/window-api-docs
npx --no-install sorrell-site publish Website/WindowAPI
```

The initial platform does not generate CI workflow files. Configure secret scopes and deployment concurrency in the repository's chosen CI system.

## Security Boundary

The manifest is untrusted JSON until decoded. Static build files are the only site content uploaded. The publisher does not execute cloud-provided commands, persist tokens, create apex/wildcard records, or roll back a successful deployment in response to DNS failure.
