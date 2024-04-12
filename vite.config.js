import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import inject from "@rollup/plugin-inject";

export default defineConfig({
  plugins: [
    viteSingleFile(),
    inject({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
})