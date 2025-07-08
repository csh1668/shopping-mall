/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	experimental: {},
	serverExternalPackages: ["@prisma/client"],
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
};

export default nextConfig;
