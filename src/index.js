import { common, empty, join, showCommon, top100 } from "./common.js"
import { getAuthors, getBooks, pageContents } from "./load.js"

(async () => {
    const authors = await getAuthors('a')

    const books = await getBooks(authors[0])

    let contents = await pageContents(books[0])
    let c = empty

    do {
        c = join(c, contents.text.map(common).reduce(join, empty))

        contents = await pageContents(contents.next)
    } while (contents.next)

    console.log(top100(c))
})()
