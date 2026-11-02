import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function expoModulesShimPlugin() {
  return {
    name: 'expo-modules-shim',
    load(id) {
      if (id.includes('ts-declarations') && id.endsWith('global.js')) {
        return `
          export class EventEmitter {}
          export class NativeModule {}
          export class SharedObject {}
          export class SharedRef {}
          export default { EventEmitter, NativeModule, SharedObject, SharedRef };
        `
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [expoModulesShimPlugin(), react()],
  resolve: {
    alias: [
      {
        find: '@react-native/assets-registry/registry',
        replacement: path.resolve(__dirname, 'src/shims/assets-registry.js'),
      },
      {
        find: /^react-native$/,
        replacement: path.resolve(__dirname, 'src/shims/react-native.js'),
      },
    ],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },
  define: {
    'process.env': {},
    global: 'window',
  },
})
