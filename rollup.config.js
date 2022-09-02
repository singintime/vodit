import { terser } from "rollup-plugin-terser";
import ts from "rollup-plugin-ts";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [ts(), terser()],
  },
];
