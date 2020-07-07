const { createFilter } = require("@rollup/pluginutils")
const { getUniforms, getAttributes } = require("./parser")
const { makeUniform, makeAttribute } = require("./uniforms")

// constants representing the type of the shaders
const VERT_SHADER = 35633
const FRAG_SHADER = 35632

const isVectShader = createFilter("**/*.vert")
const isFragShader = createFilter("**/*.frag")
const isProgram    = createFilter("**/*.glp")

module.exports = () => ({
    name: "webgl",

    async transform(code, id) {
        if ( isVectShader(id) ) return `
            import { createShader } from 'rollup-plugin-webgl/lib/boilerplate'

            export default createShader(${JSON.stringify(code)}, ${VERT_SHADER})
        `

        if ( isFragShader(id) ) return `
            import { createShader } from 'rollup-plugin-webgl/lib/boilerplate'

            export default createShader(${JSON.stringify(code)}, ${FRAG_SHADER})
        `

        if ( isProgram(id) ) {
            let parameters = require("./glp")(code)

            console.log(parameters)

            let data = {
                parameters,
                attributes : getAttributes(id, parameters["vert"]),
                unifroms : [
                    ...getUniforms(id, parameters["vert"]),
                    ...getUniforms(id, parameters["frag"])
                ]
            }

            modules = [
                ({ parameters: { canvas } }) => `export const gl = document.querySelector('${canvas}').getContext("webgl2")`,

                ({ parameters: { vert, frag } }) => `
                    import { createProgram } from 'rollup-plugin-webgl/lib/boilerplate'

                    import vertSource from '${vert}'
                    import fragSource from '${frag}'

                    export const program = createProgram(gl, vertSource(gl), fragSource(gl))

                    export default program
                `,

                ({}) => `
                    export const useProgram = () => gl.useProgram(program)

                    useProgram()
                `,

                ({ attributes }) => attributes.map(makeAttribute).join("\n"),
                ({ unifroms }) => unifroms.map(makeUniform).join("\n"),

                require("./modules/texture"),
                require("./modules/canvas"),
            ]

            return modules.map(func => func(data)).join("\n")
        }
    }
})