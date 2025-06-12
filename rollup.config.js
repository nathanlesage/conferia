import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dev from 'rollup-plugin-dev'
import commonjs from '@rollup/plugin-commonjs'
import svg from 'rollup-plugin-svg'
import json from '@rollup/plugin-json'
import open from 'open'

const DEV_SERVER_HOST = '127.0.0.1'
const DEV_SERVER_PORT = '8080'

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'dist/conferia.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    typescript({
      noEmitOnError: false // Ensure rollup doesn't quit in watch mode
    }),
    nodeResolve(), // Resolves imports and requires
    commonjs(), // Necessary for the `hash-sum` package
    json(), // Support JSON file loading
    dev({
      host: DEV_SERVER_HOST,
      port: DEV_SERVER_PORT,
      onListen (server) {
        // Upon server start, load the main entry file
        open(`http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/index.htm`)
      }
    }), // Dev server support
    svg() // Import SVG files (icons) into the bundle
  ]
})
