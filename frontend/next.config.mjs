/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted / Docker: copy `.next/static` → `standalone/.next/static` and `public` → `standalone/public`, then `node server.js` from `standalone`
  // output: "standalone",
  output: 'export',
};

export default nextConfig;
