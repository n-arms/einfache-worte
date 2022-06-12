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

const sentence_break = [
    '\n', '.', '?', '!', '/'
]

const filterSentences = text => {
    const sentences = []
    let sentence = ""

    Array.from(text).forEach(c => {
        if (sentence_break.includes(c)) {
            if (!sentence.includes(",")) {
                sentences.push(sentence)
            }
            sentence = ""
        } else {
            sentence += c
        }
    })

    if (sentence != "" && !sentence.includes(",")) {
        sentences.push(sentence)
    }

    return sentences
}

const findExamples = (sentences, word) => {
    let examples = []

    sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(word.toLowerCase())) {
            examples.push(sentence)
        }
    })

    return examples
}

const appendable = (make, append, empty) => {
    const self = {
        append,
        empty,
        make,
        concat: list => list.reduce(self.append, self.empty)
    }

    return self
}

const wordData = appendable(
    (frequency, examples) => ({frequency, examples}),
    ({ frequency: f1, examples: e1 }, { frequency: f2, examples: e2 }) => {
        const examples = e1.concat(e2)
        examples.sort((a, b) => 0.5 - Math.random())
        examples.length = Math.min(examples.length, 5)
        return wordData.make(f1 + f2, examples)
    },
    {frequency: 0, examples: []}
)

const commonWords = appendable(
    (words, length) => ({words, length}),
    ({ words: w1, length: l1}, { words: w2, length: l2 }) => {
        let newWords = { ... w1 }

        Object.entries(w2).forEach(([word, data]) => {
            if (newWords[word]) {
                newWords[word] = wordData.append(newWords[word], data)
            } else {
                newWords[word] = data
            }
        })

        return commonWords.make(newWords, l1 + l2)
    },
    {words: {}, length: 0}
)

const analyzeParagraph = text => {
    const words = filterWords(text)
    const freq = wordFrequency(words)
    const sentences = filterSentences(text)

    const data = Object.fromEntries(
        Object.entries(freq)
        .map(([word, freq]) => {
            const examples = findExamples(sentences, word)
            if (word == "sein") {
                console.log("examples of", word, "\n", examples, "\n")
            }
            return [
                word,
                wordData.make(freq, examples)
            ]
        })
    )

    return commonWords.make(data, words.length)
}

export { wordData, commonWords, analyzeParagraph }
