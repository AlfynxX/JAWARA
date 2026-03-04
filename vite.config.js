import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
        allowedHosts: [
            'localhost',
            '.ngrok-free.app',
            '.ngrok-free.dev',
            '.ngrok.io',
        ],
        cors: true,
        hmr: {
            host: process.env.VITE_DEV_SERVER_HOST || 'localhost',
        },
    },
});


