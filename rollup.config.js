import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'

const cfg = require('./cfg.json');
const appConfiguration = process.env.NODE_ENV === 'production' ?
  cfg.appConfiguration.production :
  cfg.appConfiguration.dev;

export default {
  input: "src/app.js",
  name: "myapp",
  plugins: [
    commonjs({ include: './node_modules/**' }),
    resolve({ extensions: ['.js', '.jsx'] }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'INITIAL.STATE': JSON.stringify(appConfiguration)
    }),
    babel({ exclude: './node_modules/**' })
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
