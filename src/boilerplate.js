/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
export function compileShader(gl, shaderType, shaderSource) {
    // Create the shader object
    var shader = gl.createShader(shaderType)
   
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource)
   
    // Compile the shader
    gl.compileShader(shader)
   
    // Check if it compiled
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        // remove the shader from the context
        gl.deleteShader(shader)

        // Something went wrong during compilation get the error
        throw "could not compile shader:" + gl.getShaderInfoLog(shader) + "\n" + shaderSource
    }
   
    return shader
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 * @param {!string} vertexShader A vertex shader.
 * @param {!string} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
export function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // create a program.
    var program = gl.createProgram()

    // attach the shaders.
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource))
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource))

    // link the program.
    gl.linkProgram(program)

    // check if it linked
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        // something went wrong with the link
        throw ("program filed to link:" + gl.getProgramInfoLog (program))
    }

    return program
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} attribute 
 * @param {number} size how many components per iteration
 * @param {*} type the type of data
 * @param {boolean} normalize shoule we normalize the data
 * @param {number} stride 0 = move forward size * sizeof(type) each iteration to get the next position
 * @param {number} offset where to start in the buffer
 */
export function initAttribute(gl, attribute, array, {size=2, type=gl.FLOAT, normalize=false, stride=0, offset=0}={}) {
    // turn on the attribute
    gl.enableVertexAttribArray(attribute)

    // create a new buffer for the values of the attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

    // set those values
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW)

    // Tell the attribute how to get data out of the buffer
    gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset)
}