import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const isLocal = process.env.APP_ENV === 'local';  // Check if environment is local for Valet SSL

    return {
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
            host: 'arbor.test',
            port: 5173,
            https: isLocal ? {
                key: fs.readFileSync(path.resolve(process.env.HOME, '.config/Valet/Certificates/arbor.test.key')),
                cert: fs.readFileSync(path.resolve(process.env.HOME, '.config/Valet/Certificates/saas.arbor.crt')),
            } : false,  // Disable HTTPS if not in local environment
        },
    };
});
