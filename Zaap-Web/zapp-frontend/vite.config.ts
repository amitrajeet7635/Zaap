import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      // Include all necessary polyfills for Web3Auth
      include: [
        'buffer', 
        'process', 
        'crypto', 
        'stream', 
        'util', 
        'events',
        'string_decoder',
        'querystring',
        'url',
        'http',
        'https',
        'os',
        'path',
        'fs'
      ],
      // Enable global polyfills
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
    })
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
    // Ensure Buffer is available globally
    Buffer: ['buffer', 'Buffer'],
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
})
