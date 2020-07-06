import program, {screenResolution, spriteShape} from "./main.vf"
import gl from "webglmonger/instance.js"
import { initAttribute } from "webglmonger/boilerplate"

const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// set up the attributes that are passed to the vertex shader
initAttribute(gl, gl.getAttribLocation(program, "a_position"), new Float32Array([
    1,1 , 1,0 , 0,0 ,
    1,1 , 0,1 , 0,0 ,
]))

const scene = []

function render() {
    resizeGlCanvas(gl)
}