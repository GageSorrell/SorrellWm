# `@sorrell/site-core`

Shared schemas and configuration factories used by websites generated with `sorrell-site`.

The package exposes framework-specific entry points for Docusaurus and Storybook so a site
only loads the framework it uses. Website identity and deployment settings live in a validated,
secret-free `website.config.json` file.
