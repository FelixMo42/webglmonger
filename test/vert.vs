#version 300 es

// the size of the screen
uniform vec2 u_resolution;
uniform vec4 u_shape;

// an attribute is an input (in) to a vertex shader
in vec2 a_position;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

void main() {
    // set the location of the vertex in 3d space
    gl_Position = vec4(
        (u_shape.x + u_shape.z * a_position.x) / u_resolution.x,
        (u_shape.y - u_shape.w * a_position.y) / u_resolution.y
    , 0, 1);

    // pass the texcoord to the fragment shader.
    v_texcoord = a_position;
}