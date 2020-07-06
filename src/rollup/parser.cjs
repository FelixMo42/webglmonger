const fs   = require("fs")
const path = require('path')

const emptySpace = [" ", ";", "\n", "\t"].map(char => char.charCodeAt(0))
const isNotEmptySpace = char => !emptySpace.includes(char)

function readWhile(index, buffer, condition) {
    let word = ""

    while ( condition(buffer[index]) && buffer[index] != undefined ) {
        word += String.fromCharCode(buffer[index])
        index++

        if (index > 500) return ["max out"]
    }

    return word
}

function skipUntil(index, buffer, condition) {
    while ( !condition(buffer[index]) && buffer[index] != undefined ) {
        index++

        if (index > 500) return ["max out"]
    }

    return index
}

const readWord = (index, buffer) => readWhile(skipUntil(index, buffer, isNotEmptySpace), buffer, isNotEmptySpace)
const skipWord = (index, buffer) => index + readWord(index, buffer).length + 1

module.exports = function getUniforms(root, file) {
    // load the file we want to get the uniforms from
    let code = fs.readFileSync( path.resolve(root, "..", file) )

    let index = 0

    let uniforms = []

    while (true) {
        index = code.indexOf("uniform", index)

        if ( index == -1 ) break

        // skip over "uniform <type>"
        index = skipWord(index, code)
        index = skipWord(index, code)

        let uniform = readWord(index, code)

        index += uniform.length

        uniforms.push(uniform)
    }

    return uniforms
}