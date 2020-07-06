const { createFilter } = require("@rollup/pluginutils")

const VERT_SHADER = 35633
const FRAG_SHADER = 35632

module.exports = () => {
    const isVectShader = createFilter("**/*.vs")
    const isFragShader = createFilter("**/*.fs")
    const isProgram = createFilter("**/*.vf")

    return {
        name: "webglmonger",

        transform(code, id) {
            if ( isVectShader(id) ) {
                return {
                    code: `
                        import { createShader } from 'webglmonger/boilerplate'



                        export default createShader(${JSON.stringify(code)}, ${VERT_SHADER})
                    `,
                    map: { mappings: "" }
                }
            }

            if ( isFragShader(id) ) {
                return {
                    code: `
                        import { createShader } from 'webglmonger/boilerplate'

                        

                        export default createShader(${JSON.stringify(code)}, ${FRAG_SHADER})
                    `,
                    map: { mappings: "" }
                }
            }

            if ( isProgram(id) ) {
                let elements = Object.fromEntries(code.split("\n").map(attr => attr.split(" ")))

                return {
                    code: `
                        import { createProgram } from 'webglmonger/boilerplate'

                        import vert from '${elements["#vert"]}'
                        import frag from '${elements["#frag"]}'

                        export {default as vert} from '${elements["#vert"]}'
                        export {default as frag} from '${elements["#frag"]}'

                        export * from '${elements["#vert"]}'
                        export * from '${elements["#frag"]}'

                        export default createProgram(vert, frag)
                    `,
                    map: { mappings: "" }
                }
            }
        }
    }
}