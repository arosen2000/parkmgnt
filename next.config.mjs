/** @type {import('next').NextConfig} */
/* 
const nextConfig = {
  output: "export",
  app: {
    // ... other app configurations
    router: {
      basePath: "", // Adjust if necessary
      dataFetcher: "server",
      linkPath: "/api/auth/[...nextauth]",
      generateStaticParams: false,
    },
  },
};
*/
const nextConfig = {
  //output: "export",
  //distDir: "dist",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
//module.exports = nextConfig;
