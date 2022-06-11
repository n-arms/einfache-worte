import {} from "./common.js"
import { getAuthors, getBooks, pageContents } from "./load.js"

(async () => {
    const authors = await getAuthors('a')

    const books = await getBooks(authors[0])

    const contents = await pageContents(books[0])

    console.log(contents)
})()
