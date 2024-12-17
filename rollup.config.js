import { defineConfig } from 'rollup';
// A Rollup plugin which locates modules using the Node resolution algorithm
import { nodeResolve } from '@rollup/plugin-node-resolve';
// A Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import commonjs from '@rollup/plugin-commonjs';
// Use the latest JS features in your Rollup bundle
import babel from '@rollup/plugin-babel';
// Minifies the bundle
import terser from '@rollup/plugin-terser';

// CSS
// Enable the SCSS processing
import scss from 'rollup-plugin-scss';
// Enable the PostCSS preprocessor
import postcss from 'postcss';
// Use the latest CSS features in your Rollup bundle
import postcssPresetEnv from 'postcss-preset-env';

// Development: Enables a livereload server that watches for changes to CSS, JS, and Handlbars files
import { resolve } from 'path';
import livereload from 'rollup-plugin-livereload';

// Rollup configuration
export default defineConfig({
  input: 'assets/js/main.js',
  output: {
    dir: 'assets/built',
    sourcemap: true,
    format: 'iife',
    preserveModules: false,
    plugins: [terser()]
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
    scss({
      fileName: 'main.css',
      sourceMap: true,
      processor: () => postcss([postcssPresetEnv({})]),
      outputStyle: 'compressed',
      watch: 'assets/scss'
    }),
    process.env.BUILD !== 'production' &&
      livereload({
        watch: resolve('.'),
        extraExts: ['hbs'],
        exclusions: [resolve('node_modules')]
      })
  ]
});
