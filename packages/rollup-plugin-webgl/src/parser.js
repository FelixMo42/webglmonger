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

const getAllOfType = (root, file, type) => {
    // load the file we want to get the uniforms from
    let code = fs.readFileSync( path.resolve(root, "..", file) )

    let index = 0

    let uniforms = []

    while (true) {
        index = code.indexOf(type, index)

        if ( index == -1 ) break

        index = skipWord(index, code)

        let t = readWord(index, code)
        index += t.length + 1

        let uniform = readWord(index, code)
        index += uniform.length + 1

        uniforms.push([t, uniform])
    }

    return uniforms
}

const getUniforms = (root, file) => getAllOfType(root, file, "\nuniform ")
const getAttributes = (root, file) => getAllOfType(root, file, "\nin ")

module.exports = { getUniforms, getAttributes }