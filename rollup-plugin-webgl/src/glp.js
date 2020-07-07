const is = chars => buffer => chars.includes(buffer[index])

let index = 0

const whiteSpace = [ " ", "\t", "\n" ]

const isWhiteSpace  = is(whiteSpace)

const isPunctuation = is([ "{", "}", "[", "]", "(", ")", "@", ...whiteSpace ])

const skipChar = () => index++
const nextChar = buffer => buffer[index++]

const readWord = buffer => {
    while ( isWhiteSpace(buffer) && !!buffer[index] ) skipChar()

    if ( isPunctuation(buffer) ) return nextChar(buffer)

    word = ""

    while ( !isPunctuation(buffer) && !!buffer[index] ) word += nextChar(buffer)

    return word
}

const readKey = buffer => {
    return [ readWord(buffer), readValue(buffer) ]
}

const readObj = buffer => {
    let obj = {}

    let value = readValue(buffer) 

    while ( value != "}" && value != "" ) {
        obj[value[0]] = value[1]

        value = readValue(buffer)
    }

    return obj
}

const readArr = buffer => {
    let arr = []

    let value = readValue(buffer)

    while ( value != "]" && value != "" ) {
        arr.push( value )

        value = readValue(buffer)
    }

    return arr
}

const readValue = buffer => {
    let word = readWord(buffer)

    if ( word == "@" ) return readKey(buffer)
    if ( word == "{" ) return readObj(buffer)
    if ( word == "[" ) return readArr(buffer)

    return word
}

module.exports = buffer => {
    index = 0

    return readObj(buffer)
}