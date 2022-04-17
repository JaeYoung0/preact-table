import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
const path = require("path");

const root = `${process.cwd()}`;

export default defineConfig({
  plugins: [
    preact({
      babel: {
        presets: [],
        // Your plugins run before any built-in transform (eg: Fast Refresh)
        plugins: [],
        // Use .babelrc files
        babelrc: true,
        // Use babel.config.js files
        configFile: true,
      },
    }),
  ],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "@/": `${path.resolve(root, "src")}/`,
    },
  },
});
