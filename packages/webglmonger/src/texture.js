import gl from "./instance.js"

export function loadTexture(src, callback=() => {}) {
    // create a texture
    var texture = gl.createTexture()

    // use texture unit 0
    gl.activeTexture(gl.TEXTURE0 + 0)
    
    // fill the texture with a 1x1 blue pixel so we can use it immediately
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))

    // asynchronously load an image
    var image = new Image()
    image.src = src
    image.addEventListener('load', function() {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.generateMipmap(gl.TEXTURE_2D)

        callback(texture)
    })

    return texture
}