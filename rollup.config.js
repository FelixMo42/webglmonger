import webgl from 'webglmonger/rollup'
import alias from '@rollup/plugin-alias'

export default {
	input: 'test/index.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'app',
		file: 'tmp/bundle.js'
	},
	watch: { clearScreen: false },
	plugins: [
		webgl(),

		// so that we can include it as if we were a real module
		alias({
			entries: {
				"webglmonger" : "../../webglmonger/src"
			}
		}),
	]
}