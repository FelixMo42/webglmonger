#version 300 es

// the size of the screen
uniform vec2 screenResolution;
uniform vec4 spriteShape;

// an attribute is an input (in) to a vertex shader
in vec2 a_position;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

void main() {
    // set the location of the vertex in 3d space
    gl_Position = vec4(
        (spriteShape.x + spriteShape.z * a_position.x) / screenResolution.x,
        (spriteShape.y - spriteShape.w * a_position.y) / screenResolution.y,
    0, 1);

    // pass the texcoord to the fragment shader.
    v_texcoord = a_position;
}