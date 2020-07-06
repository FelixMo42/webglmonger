#version 300 es

precision highp float;

// the texture
uniform sampler2D u_texture0;

// passed in from the vertex shader
in vec2 v_texcoord;

// the output color of this spot
out vec4 outColor;

void main() {
    outColor = texture(u_texture0, v_texcoord);
}