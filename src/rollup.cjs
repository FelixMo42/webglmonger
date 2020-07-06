const { createFilter } = require("@rollup/pluginutils")

module.exports = ({include=["**/*.vs", "**/*.fs"], exclude}={}) => {
    const filter = createFilter(include, exclude)

    return {
        name: "webgl",

        transform(code, id) {
            if ( filter(id) ) {
                return {
                    code: `
                        import { createShader } from 'webglmonger/boilerplate'

                        export default createShader(${JSON.stringify(code)})
                    `,
                    map: { mappings: "" }
                }
            }
        }
    }
}