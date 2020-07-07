const { createFilter } = require("@rollup/pluginutils")
const { getUniforms, getAttributes } = require("./parser.js")

// constants representing the type of the shaders
const VERT_SHADER = 35633
const FRAG_SHADER = 35632

let uniformFunctions = {
    "mat4" : "uniform4fv",
    "mat3" : "uniform4fv",
    "mat2" : "uniform4fv",

    "vec4" : "uniform4fv",
    "vec3" : "uniform3fv",
    "vec2" : "uniform2fv",

    "ivec4" : "uniform4iv",
    "ivec3" : "uniform3iv",
    "ivec2" : "uniform2iv",

    "float" : "uniform1f",
    "int" : "uniform1i"
}

const isVectShader = createFilter("**/*.vs")
const isFragShader = createFilter("**/*.fs")
const isProgram    = createFilter("**/*.glm")

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

module.exports = () => ({
    name: "webglmonger",

    transform(code, id) {
        if ( isVectShader(id) ) {
            return `
                import { createShader } from 'webglmonger/src/boilerplate'

                export default createShader(${JSON.stringify(code)}, ${VERT_SHADER})
            `
        }

        if ( isFragShader(id) ) {
            return `
                import { createShader } from 'webglmonger/src/boilerplate'

                export default createShader(${JSON.stringify(code)}, ${FRAG_SHADER})
            `
        }

        if ( isProgram(id) ) {
            console.log(id)
            let elements = Object.fromEntries(code.split("\n").map(attr => attr.split(" ")))

            let vert = elements["#vert"]
            let frag = elements["#frag"]

            const makeUniform = ([type, name]) => `
                export const ${name} = gl.getUniformLocation(program, '${name}')

                export const set${capitalize(name)} = (value) => {
                    gl.${uniformFunctions[type]}(${name}, value)
                }
            `

            return `
                import { createProgram } from 'webglmonger/src/boilerplate'
                import gl from 'webglmonger/src/instance'

                import vert from '${vert}'
                import frag from '${frag}'

                const program = createProgram(vert, frag)

                ${ getAttributes(id, vert).map(([type, name]) => `
                    export const ${name} = gl.getAttribLocation(program, '${name}')
                `).join("\n") }
                
                ${ getUniforms(id, vert).map(makeUniform).join("\n") }
                ${ getUniforms(id, frag).map(makeUniform).join("\n") }

                export default program
            `
        }
    }
})