import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'

const cfg = require('./cfg.json');
const appConfiguration = process.env.NODE_ENV === 'production' ?
  cfg.appConfiguration.production :
  cfg.appConfiguration.dev;

export default {
  input: "src/app.js",
  name: "myapp",
  plugins: [
    replace({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_ENV': JSON.stringify('production'),
      'INITIAL.STATE': JSON.stringify(appConfiguration)
    }),
    commonjs({ include: './node_modules/**' }),
    resolve({ extensions: ['.js', '.jsx'] }),
    babel({ exclude: './node_modules/**' }),
    uglify({}, minify)
  ],
  output: {
    file: "_dev/app.js",
    format: "umd",
    sourcemap: 'inline'
  },
  watch: {
    exclude: 'node_modules/**'
  }
}
