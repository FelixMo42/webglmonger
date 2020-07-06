import { createFilter } from "@rollup/pluginutils"

export default ({include=["**/*.vs", "**/*.fs"], exclude}={}) => {
    const filter = createFilter(include, exclude)

    return {
        name: "webgl",

        transform(code, id) {
            if ( filter(id) ) {
                return {
                    code: `export default ${JSON.stringify(code)}`,
                    map: { mappings: "" }
                }
            }
        }
    }
}