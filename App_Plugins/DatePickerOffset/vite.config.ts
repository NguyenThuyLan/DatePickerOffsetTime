import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/date-picker-offset-property-editor-ui.element.ts", // your web component source file
            formats: ["es"],
        },
        outDir: "dist", // all compiled files will be placed here
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/], // ignore the Umbraco Backoffice package in the build
        }
    }
   // base: "/App_Plugins/Client/", // the base path of the app in the browser (used for assets)
});