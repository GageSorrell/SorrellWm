/** @type {import("next").NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pbs.twimg.com"
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc"
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com"
            }
        ]
    },

    async rewrites()
    {
        const DocsOrigin = process.env.DOCS_ORIGIN ?? "http://localhost:3001";
        // const DocsOrigin = "http://localhost:3001";

        return [
            {
                source: "/docs",
                destination: `${ DocsOrigin }/docs/`
            },
            {
                source: "/docs/",
                destination: `${ DocsOrigin }/docs/`
            },
            {
                source: "/docs/:path*",
                destination: `${ DocsOrigin }/docs/:path*`
            }
        ];
    }
};

module.exports = nextConfig;
