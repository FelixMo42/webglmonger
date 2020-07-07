/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
export const createShader = (shaderSource, shaderType) => (gl) => {
    // create the shader object
    var shader = gl.createShader(shaderType)
   
    // set the shader source code.
    gl.shaderSource(shader, shaderSource)
   
    // compile the shader
    gl.compileShader(shader)
   
    // check if it compiled
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        // remove the shader from the context
        gl.deleteShader(shader)

        // Something went wrong during compilation get the error
        throw "could not compile shader:" + gl.getShaderInfoLog(shader) + "\n" + shaderSource
    }
   
    return shader
}

/**
 * makes sure the gl canvas is the right scale and set the viewport
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 */
export function resizeCanvas(gl, callback=()=>{}) {
    let canvas = gl.canvas

    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth
    var displayHeight = canvas.clientHeight

    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
        // Make the canvas the same size
        canvas.width  = displayWidth
        canvas.height = displayHeight

        // set the viewport
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        callback({})
    }
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 * @param {!string} vertShader A vertex shader.
 * @param {!string} fragShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
export const createProgram = (gl, vertShader, fragShader) => {
    // create a program
    var program = gl.createProgram()

    // attach the shaders
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)

    // link the program
    gl.linkProgram(program)

    // check if it linked
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        // something went wrong with the link
        throw ("program filed to link:" + gl.getProgramInfoLog (program))
    }

    return program
}