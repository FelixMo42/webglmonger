const { createFilter } = require("@rollup/pluginutils")
const getUniforms = require("./parser.js")

// constants representing the type of the shaders
const VERT_SHADER = 35633
const FRAG_SHADER = 35632

module.exports = () => {
    const isVectShader = createFilter("**/*.vs")
    const isFragShader = createFilter("**/*.fs")
    const isProgram    = createFilter("**/*.glm")

    return {
        name: "webglmonger",

        transform(code, id) {
            if ( isVectShader(id) ) {
                return {
                    code: `
                        import { createShader } from 'webglmonger/src/boilerplate'

                        export default createShader(${JSON.stringify(code)}, ${VERT_SHADER})
                    `,
                    map: { mappings: "" }
                }
            }

            if ( isFragShader(id) ) {
                return {
                    code: `
                        import { createShader } from 'webglmonger/src/boilerplate'

                        export default createShader(${JSON.stringify(code)}, ${FRAG_SHADER})
                    `,
                    map: { mappings: "" }
                }
            }

            if ( isProgram(id) ) {
                let elements = Object.fromEntries(code.split("\n").map(attr => attr.split(" ")))

                let vert = elements["#vert"]
                let frag = elements["#frag"]

                return {
                    code: `
                        import { createProgram } from 'webglmonger/src/boilerplate'
                        import gl from 'webglmonger/src/instance'

                        import vert from '${vert}'
                        import frag from '${frag}'

                        export {default as vert} from '${vert}'
                        export {default as frag} from '${frag}'

                        const program = createProgram(vert, frag)

                        ${ getUniforms(id, vert).map(name => `export const ${name} = gl.getUniformLocation(program, '${name}')`).join("\n") }
                        ${ getUniforms(id, frag).map(name => `export const ${name} = gl.getUniformLocation(program, '${name}')`).join("\n") }

                        export default program
                    `,
                    map: { mappings: "" }
                }
            }
        }
    }
}