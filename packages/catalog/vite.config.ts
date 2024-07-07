import atomico from "@atomico/vite";
import {defineConfig} from "vite";

export default defineConfig({
    build: {
        cssCodeSplit: true,
        reportCompressedSize: true,
        emptyOutDir: true
    },
    
    plugins: atomico({cssLiterals: {minify: true, postcss: true}}),
});