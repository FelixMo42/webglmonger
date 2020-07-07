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
    name: "webglmonger",

    transform(code, id) {
        if ( isVectShader(id) ) return `
            import { createShader } from 'webglmonger/src/boilerplate'

            export default createShader(${JSON.stringify(code)}, ${VERT_SHADER})
        `

        if ( isFragShader(id) ) return `
            import { createShader } from 'webglmonger/src/boilerplate'

            export default createShader(${JSON.stringify(code)}, ${FRAG_SHADER})
        `

        if ( isProgram(id) ) {
            let elements = Object.fromEntries(code.split("\n").map(attr => attr.split(" ")))

            let vert = elements["#vert"]
            let frag = elements["#frag"]

            return `
                import { createProgram } from 'webglmonger/src/boilerplate'
                import gl from 'webglmonger/src/instance'

                import vert from '${vert}'
                import frag from '${frag}'

                const program = createProgram(vert, frag)

                ${ getAttributes(id, vert).map(makeAttrabute).join("\n") }
                ${ getUniforms(id, vert).map(makeUniform).join("\n") }
                ${ getUniforms(id, frag).map(makeUniform).join("\n") }

                export const useProgram = () => gl.useProgram(program)

                // tell gl to use our program by default
                useProgram()

                export default program
            `
        }
    }
})