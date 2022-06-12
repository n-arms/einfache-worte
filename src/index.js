import { commonWords, analyzeParagraph } from "./common.js"
import { asTable, asCSV } from "./pretty.js"
import { getAuthors, getBooks, pageContents } from "./load.js"
import { appendFileSync, rmSync } from 'node:fs'


(async () => {
    const authors = await getAuthors('a')

    let c = commonWords.empty

    for (const author of authors) {
        console.log("processing author", author)
        const books = await getBooks(author)

        for (const book of books) {
            let contents = await pageContents(book)
            let bookText = contents.text

            while (contents.next) {
                const page = commonWords.concat(contents.text.map(t => t ? analyzeParagraph(t) : empty))
                c = commonWords.append(c, page)

                contents = await pageContents(contents.next)
                bookText = bookText.concat(contents.text)
            }

            rmSync("log.csv", {force: true})
            appendFileSync("log.csv", asCSV(c))
            
            rmSync("book.txt", {force: true})
            appendFileSync("book.txt", bookText.join("\n\n"))

            console.log(asTable(100, c))
            return
        }
    }
})()
