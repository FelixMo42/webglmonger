import webgl from './src/rollup'

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
	]
}