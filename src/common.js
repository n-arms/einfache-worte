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

    return makeCommon(freq)
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

    return makeCommon(newWords)
}

const makeCommon = words => {
    return {
        words
    }
}

const empty = makeCommon({})

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

export { common, empty, join, showCommon }
