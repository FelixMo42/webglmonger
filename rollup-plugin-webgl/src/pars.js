const is = chars => {
    let codes = chars.map(char => char.charCodeAt(0))

    return (buffer, index) => codes.includes(buffer[index])
}

let index = 0

const whiteSpace = [ " ", "\t", "\n" ]

const isWhiteSpace  = is(whiteSpace)

const isPunctuation = is([ "(", ")", "[", "]", ...whiteSpace ])

function readWhile(index, buffer, condition) {
    let word = ""

    while ( condition(buffer[index]) && buffer[index] != undefined ) {
        word += String.fromCharCode(buffer[index])
        index++

        if (index > 500) return ["max out"]
    }

    return word
}

const skipChar = () => index++
const nextChar = (buffer) => String.fromCharCode(buffer[index++])

const readWord = (buffer) => {
    while ( isWhiteSpace(buffer, index) && !!buffer[index] ) skipChar()

    if ( isPunctuation(buffer, index) ) return nextChar(buffer)

    word = ""

    while ( !isPunctuation(buffer, index) && !!buffer[index] ) word += nextChar(buffer)

    return word
}

const readValue = (buffer) => {
    let word = readWord(buffer)

    if ( word == "(" ) return 

    if ( word == "[" ) {
        let arr = []

        let word = readValue(buffer)

        while ( word != "]" && word != "" ) {
            arr.push( word )

            word = readValue(buffer)
        }

        return arr
    }

    return word
}

let a = `
    [ 123 456 ]
`

console.log( readValue(Buffer.from(a, 'utf8')) )

// export default (buffer) => {

// }