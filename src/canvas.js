/**
 * Makes sure that the canvas has the right pixel density
 * 
 * @param {HTMLCanvasElement} canvas 
 */
export function resizeCanvas(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth
    var displayHeight = canvas.clientHeight

    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth || canvas.height !== displayHeight) {
        // Make the canvas the same size
        canvas.width  = displayWidth
        canvas.height = displayHeight
    }
}

/**
 * makes sure the gl canvas is the right scale and set the viewport
 *
 * @param {!WebGLRenderingContext} gl The WebGL context.
 */
export function resizeGlCanvas(gl) {
    resizeCanvas(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
}