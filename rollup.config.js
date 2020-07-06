import webgl from 'webglmonger/rollup'
import resolve from '@rollup/plugin-node-resolve'

export default {
	input: 'test/index.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'tmp/bundle.js'
	},
	watch: { clearScreen: false },
	plugins: [
		webgl(),
		resolve()
	]
}