# `@sorrell/site`

`sorrell-site create docusaurus`, `sorrell-site create storybook`, and `sorrell-site publish <workspace>` create and publish independent sites under `Website/`.

Publishing reads `VERCEL_TOKEN`, optional `VERCEL_TEAM_ID`, the standard AWS credential chain, and optional `SORRELL_ROUTE53_ZONE_ID`. Credentials are never written to disk.
