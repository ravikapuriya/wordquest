import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const platform = process.env.VITE_PLATFORM || 'local';

    console.log(`\n🚀 Building for platform: ${platform}\n`);

    return {
        base: "./",
        publicDir: 'public',
        build: {
            emptyOutDir: true,
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    entryFileNames: 'js/[name]-[hash].js',
                    chunkFileNames: 'js/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            if (id.includes('phaser')) return 'vendor-phaser';
                            return 'vendor-other';
                        }
                        if (id.includes('/src/')) return 'game-src';
                    },
                },
            },
            // Enable minification and tree-shaking
            minify: 'terser',
            terserOptions: {
                compress: {
                    dead_code: true,
                    drop_console: mode === 'production',
                    drop_debugger: mode === 'production',
                    pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : []
                }
            }
        },
        resolve: {
            alias: {
                '@game': path.resolve(__dirname, 'src/game'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@objects': path.resolve(__dirname, 'src/objects'),
                '@scenes': path.resolve(__dirname, 'src/scenes'),
                '@config': path.resolve(__dirname, 'src/config'),
            },
        },
        optimizeDeps: {
            include: ['phaser']
        },
        server: {
            host: true,
            hmr: false,
            port: 5170,
            open: true,
        },
        define: {
            'import.meta.env.VITE_PLATFORM': JSON.stringify(platform)
        }
    };
});
