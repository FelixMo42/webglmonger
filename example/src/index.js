import program, {
    setScreenResolution,
    setSpriteShape,
    setVertexPosition
} from "./prog/main.glm"

import { resizeGlCanvas } from "webglmonger/src/canvas"
import { loadTexture } from "webglmonger/src/texture"
import gl from "webglmonger"

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// set up the attributes that are passed to the vertex shader
setVertexPosition(new Float32Array([
    1,1 , 1,0 , 0,0 ,
    1,1 , 0,1 , 0,0 ,
]))

const scene = []

function render() {
    resizeGlCanvas(gl)

    // clear the canvas
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // tell it to use our program (pair of shaders)
    gl.useProgram(program)

    // bind the attributes/buffer set we want
    gl.bindVertexArray(vao)

    // pass in the canvas resolution so we can convert from pixels to clipspace in the shader
    setScreenResolution(new Float32Array([gl.canvas.width / 2, gl.canvas.height / 2]))

    for (let sprite of scene) {
        // use the texture we want
        gl.bindTexture(gl.TEXTURE_2D, sprite.texture)

        // pass in the shape of the sprite
        setSpriteShape(sprite.shape)

        // draw the shape
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    //redraw
    requestAnimationFrame(render)
}

const texture1 = loadTexture("assets/texture1.png")
const texture2 = loadTexture("assets/texture2.png")

const Sprite = (tex, x, y, w, h) => ({
    texture: tex,
    shape: new Float32Array([ x, y, w, h ]),
})

scene.push( Sprite(texture1, -50, -50, 100, 100) )
scene.push( Sprite(texture2, 100, 100, 100, 100) )

render()