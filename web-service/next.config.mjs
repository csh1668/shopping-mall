/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	turbopack: {
		resolveExtensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
	},
	serverExternalPackages: ["@prisma/client"],
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
};

export default nextConfig;
