// @ts-check
import withSerwistInit from "@serwist/next";

const revision = crypto.randomUUID();
const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "./public/sw.js",
  register: true,
  // exclude: [/public/],
  exclude: [
    /\.map$/,
    /^.*manifest.*\.js(?:on)?$/,
    /\/_next\/data\/.*\.json$/,
    /web-app-manifest-.*\.png$/,
  ],
  additionalPrecacheEntries: [
    { url: "/~offline", revision },
    { url: "/", revision },
  ],
});

export default withSerwist({
  // Your Next.js config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.apple.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
});
