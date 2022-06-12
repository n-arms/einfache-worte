const asTable = (number, c) => {
    let arr = Object.entries(c.words)

    arr = arr.sort(([_, a], [__, b]) => b.frequency - a.frequency)
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

const asCSV = c => {
    let arr = Object.entries(c.words)

    arr = arr.sort(([_, a], [__, b]) => b.frequency - a.frequency)
    arr.length = Math.min(200, arr.length)

    const csv = arr
        .map(([word, {frequency, examples}]) => {
            const exampleText = examples.join(',')
            return `${word},${frequency.toString()},${exampleText}\n`
        })
        .reduce((a, b) => a + b, "")

    return csv
}

export { asTable, asCSV }
