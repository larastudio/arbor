import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    if (mode === 'production') {
        // No need to define `server` for production; skip HMR and host configuration
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
        };
    }

    // Development server configuration
    const isValet = env.APP_ENV === 'valet';
    const serverConfig = isValet ? {
        host: 'arbor.test',
        port: 5173,
        https: {
            key: fs.readFileSync(path.resolve(env.HOME, '.config/valet/Certificates/arbor.test.key')),
            cert: fs.readFileSync(path.resolve(env.HOME, '.config/valet/Certificates/arbor.test.crt')),
        },
        hmr: {
            protocol: 'wss',
            host: 'arbor.test',
            port: 5173,
        },
    } : {
        host: 'arbor.test',
        port: 5173,
        https: env.APP_ENV !== 'lima', // HTTPS for non-Lima environments
        hmr: {
            protocol: env.APP_ENV === 'lima' ? 'ws' : 'wss',
            host: 'arbor.test',
            port: 5173,
        },
    };

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
        server: serverConfig,
    };
});
