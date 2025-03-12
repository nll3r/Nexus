// nexus/next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "100MB",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: 'cdn.pixabay.com',
            },{
                protocol: "https",
                hostname: 'cloud.appwrite.io',
            },{
                protocol: "https",
                hostname: 'cdn-icons-png.flaticon.com',
            }
        ]
    },
};

export default nextConfig;