// map from glsl type to corresponding function to set it

const FLOAT = 5126
const INT   = 5124

const TEXTURE_2D = 3553
const TEXTURE_3D = 32879

const WebGlNumberType = (base, size) => ({
    base, size, isSampler:false,

    uniformSetFunction(loc) {
        return `gl.uniform${size}${base == FLOAT ? "f" : "i"}v(${loc}, value)`
    }
})

// gl.bindTexture(gl.TEXTURE_2D, sprite.texture)

const WebGlSamplerType = (base) => ({
    base, isSampler:true,

    uniformSetFunction() {
        return `gl.bindTexture(${base}, value)`
    }
})

const types = {
    "mat4"  : WebGlNumberType(FLOAT , 16),
    "mat3"  : WebGlNumberType(FLOAT ,  9),
    "mat2"  : WebGlNumberType(FLOAT ,  4),

    "vec4"  : WebGlNumberType(FLOAT ,  4),
    "vec3"  : WebGlNumberType(FLOAT ,  3),
    "vec2"  : WebGlNumberType(FLOAT ,  2),

    "ivec4" : WebGlNumberType(INT   ,  4),
    "ivec3" : WebGlNumberType(INT   ,  3),
    "ivec2" : WebGlNumberType(INT   ,  2),

    "float" : WebGlNumberType(FLOAT ,  1),
    "int"   : WebGlNumberType(INT   ,  1),

    "sampler2D" : WebGlSamplerType(TEXTURE_2D),
    "sampler3D" : WebGlSamplerType(TEXTURE_3D)
}

const cleanName = (string) => string[1] == "_" ?  string.slice(2) : string
const capitalized = (string) => cleanName(string).charAt(0).toUpperCase() + cleanName(string).slice(1)

const makeUniform = ([type, name]) => `
    export const ${cleanName(name)} = gl.getUniformLocation(program, '${name}')

    export const set${capitalized(name)} = (value) => ${types[type].uniformSetFunction(cleanName(name))}
`

const makeAttrabute = ([type, name]) => {
    if ( types[type].isSampler ) return ``

    return `
        export const ${name} = gl.getAttribLocation(program, '${name}')

        export const set${capitalized(name)} = (value, {normalize=false, stride=0, offset=0, usage=gl.STATIC_DRAW}={}) => {
            gl.enableVertexAttribArray(${name})

            // create a new buffer for the values of the attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

            // set those values
            gl.bufferData(gl.ARRAY_BUFFER, value, usage)

            // Tell the attribute how to get data out of the buffer
            gl.vertexAttribPointer(
                ${cleanName(name)},
                ${types[type].size},
                ${types[type].base},
                normalize,
                stride,
                offset
            )
        }
    `
}

module.exports = { makeUniform, makeAttrabute }