module.exports = () => `
    import { resizeCanvas as rc } from 'rollup-plugin-webgl/lib/canvas'

    export const resizeCanvas = (callback) => {
        rc(gl, callback)

        return gl
    }
`