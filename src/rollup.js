const { createFilter } = require("@rollup/pluginutils")

module.exports = ({include=["*.sv", "*.fs"], exclude}={}) => {
    const filter = createFilter(include, exclude)

    return {
        name: "string",

        transform(code, id) {
            if ( filter(id) ) {
                console.log(id)

                return {
                    code: `export default ${JSON.stringify(code)}`,
                    map: { mappings: "" }
                }
            }
        }
    }
}