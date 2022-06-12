const isLetter = code => {
    const ch = String.fromCharCode(code)
    return ch.toUpperCase() != ch.toLowerCase()
}

const filterWords = text => {
    const words = []
    let word = ""

    for (let idx = 0; idx < text.length; ++idx) {
        const code = text.charCodeAt(idx)
        if (isLetter(code)) {
            word = word.concat(String.fromCharCode(code))
        } else {
            if (word != "") {
                words.push(word.toLowerCase())
                word = ""
            }
        }
    }
    
    if (word != "") {
        words.push(word)
    }

    return words
}

const wordFrequency = words => {
    const freq = {}

    words.forEach(word => {
        if (!freq[word]) {
            freq[word] = 1
        } else {
            ++freq[word]
        }
    })

    return freq
}

const common = text => {
    const words = filterWords(text)
    const freq = wordFrequency(words)

    return makeCommon(freq, words.length)
}

const join = (c1, c2) => {
    const newWords = {... c1.words}

    Object.entries(c2.words).forEach(([word, freq]) => {
        if (newWords[word]) {
            newWords[word] += freq
        } else {
            newWords[word] = freq
        }
    })

    return makeCommon(newWords, c1.length + c2.length)
}

const makeCommon = (words, length) => {
    return {
        words,
        length
    }
}

const empty = makeCommon({}, 0)

const showCommon = c => {
    let str = ""
    let leftover = 0

    let arr = Object.entries(c.words)

    arr = arr.sort(([_, a_freq], [__, b_freq]) => a_freq - b_freq)

    arr.forEach(([word, freq]) => {
        if (freq <= 1) {
            ++ leftover
        } else {
            str += word
            str += ": "
            str += freq.toString()
            str += "\n"
        }
    })

    str += "and "
    str += leftover.toString()
    str += " rare words that occur only once"

    return str
}

const topN = (number, c) => {
    let arr = Object.entries(c.words)

    arr = arr.sort(([_, a_freq], [__, b_freq]) => b_freq - a_freq)
    arr.length = Math.min(number, arr.length)

    const header = "=".repeat(180)

    let str = ""
    let col = 0

    str += header
    str += "\nprocessed "
    str += c.length.toString()
    str += " total words\n"
    str += header
    str += "\n"
    arr.forEach(([word, _]) => {
        str += word
        if (col == 5) {
            col = 0
            str += "\n"
        } else {
            str += " ".repeat(30 - word.length)
            ++ col
        }
    })

    if (col) {
        str += "\n"
    }

    str += header
    str += "\n\n"

    return str
}

const toCSV = c => {
    let arr = Object.entries(c.words)

    arr = arr.sort(([_, a_freq], [__, b_freq]) => b_freq - a_freq)
    arr.length = Math.min(200, arr.length)

    const csv = arr.map(([word, freq]) => `${word},${freq.toString()}\n`).reduce((a, b) => a + b, "")

    return csv
}

export { common, empty, join, showCommon, topN, toCSV }
