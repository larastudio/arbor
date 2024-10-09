import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    server: {
        host: 'saas.test',
        port: 5173,
        https: {
            key: fs.readFileSync(path.resolve(process.env.HOME, '.config/Valet/Certificates/saas.test.key')),
            cert: fs.readFileSync(path.resolve(process.env.HOME, '.config/Valet/Certificates/saas.test.crt')),
        },
    },
});
