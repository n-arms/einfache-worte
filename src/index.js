import { common, empty, join, showCommon, topN, toCSV } from "./common.js"
import { getAuthors, getBooks, pageContents } from "./load.js"
import { appendFileSync } from 'node:fs'

(async () => {
    const authors = await getAuthors('a')

    let c = empty

    for (const author of authors) {
        console.log("processing author", author)
        const books = await getBooks(author)

        for (const book of books) {
            let contents = await pageContents(book)

            while (contents.next) {
                c = join(c, contents.text.map(t => t ? common(t) : empty).reduce(join, empty))

                contents = await pageContents(contents.next)
            }

            appendFileSync("log.csv", toCSV(c))
            console.log(topN(100, c))
            return
        }
    }
})()
