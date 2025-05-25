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
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
});
