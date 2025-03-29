import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dev from 'rollup-plugin-dev'
import commonjs from '@rollup/plugin-commonjs'

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
    dev() // Dev server support
  ]
})
