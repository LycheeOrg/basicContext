import {defineConfig} from "vite";

export default defineConfig({
    build: {
        outDir: "dist/",
        rollupOptions: {
            input: [
                "src/scripts/basicContext.js",
                "src/styles/basicContext.scss",
                "src/styles/addons/fadein.scss",
                "src/styles/addons/popin.scss",
                "src/styles/themes/bright.scss",
                "src/styles/themes/dark.scss",
                "src/styles/themes/default.scss",
            ],
            output: {
                entryFileNames: "[name].min.js",
                assetFileNames: function (info) {
                    if (info.name.includes("addons")) {
                        return "addons/" + "[name].min.[ext]"
                    } else if (info.name.includes("themes")) {
                        return "themes/" + "[name].min.[ext]"
                    } else {
                        return "[name].min.[ext]"
                    }
                }
            },
        }
    }
})
