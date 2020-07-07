const { createFilter } = require("@rollup/pluginutils")
const { getUniforms, getAttributes } = require("./parser")
const { makeUniform, makeAttrabute } = require("./uniforms")

// constants representing the type of the shaders
const VERT_SHADER = 35633
const FRAG_SHADER = 35632

const isVectShader = createFilter("**/*.vs")
const isFragShader = createFilter("**/*.fs")
const isProgram    = createFilter("**/*.glm")

module.exports = () => ({
    name: "webgl",

    transform(code, id) {
        if ( isVectShader(id) ) return `
            import { createShader } from 'rollup-plugin-webgl/lib/boilerplate'

            export default createShader(${JSON.stringify(code)}, ${VERT_SHADER})
        `

        if ( isFragShader(id) ) return `
            import { createShader } from 'rollup-plugin-webgl/lib/boilerplate'

            export default createShader(${JSON.stringify(code)}, ${FRAG_SHADER})
        `

        if ( isProgram(id) ) {
            let elements = Object.fromEntries(code.split("\n").map(attr => attr.split(" ")))

            let vert = elements["vert"]
            let frag = elements["frag"]
            let canvas = elements["canvas"]

            return `
                import { createProgram, resizeCanvas } from 'rollup-plugin-webgl/lib/boilerplate'
                
                export const gl = document.querySelector('${canvas}').getContext("webgl2")

                import vertSource from '${vert}'
                import fragSource from '${frag}'

                export const program = createProgram(gl, vertSource(gl), fragSource(gl))

                export const useProgram = () => gl.useProgram(program)

                // tell gl to use our program by default
                useProgram()

                ${ getAttributes(id, vert).map(makeAttrabute).join("\n") }
                ${ getUniforms(id, vert).map(makeUniform).join("\n") }
                ${ getUniforms(id, frag).map(makeUniform).join("\n") }

                export function loadTexture(src, callback=() => {}) {
                    // create a texture
                    var texture = gl.createTexture()

                    // use texture unit 0
                    gl.activeTexture(gl.TEXTURE0 + 0)
                    
                    // fill the texture with a 1x1 blue pixel so we can use it immediately
                    gl.bindTexture(gl.TEXTURE_2D, texture)
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))

                    // asynchronously load an image
                    var image = new Image()
                    image.src = src
                    image.addEventListener('load', function() {
                        gl.bindTexture(gl.TEXTURE_2D, texture)
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
                        gl.generateMipmap(gl.TEXTURE_2D)

                        callback(texture)
                    })

                    return texture
                }

                export const prepare = (callback) => {
                    resizeCanvas(gl, callback)

                    return gl
                }

                export default program
            `
        }
    }
})