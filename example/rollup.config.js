import webgl from 'rollup-plugin-webgl'
import resolve from '@rollup/plugin-node-resolve'

export default {
	input: 'src/index.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'app',
		file: 'build/bundle.js'
	},
	watch: { clearScreen: false },
	plugins: [
		webgl(),
		resolve()
	]
}