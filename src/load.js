import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const getRaw = async url => {
    const response = await fetch(url)
    return response.text()
}

const getAuthors = async initial => {
    const authorPage = await getRaw(`https://www.projekt-gutenberg.org/autoren/info/autor-${initial}.html`)

    const authorPageHtml = cheerio.load(authorPage)
    const authorsTable = authorPageHtml("tbody")[4].children.filter(row => row.name == "tr")

    const authors = authorsTable.map(row => {
        const aTag = row.children[1].children[1]

        return {
            name: aTag.children[0].data,
            href: aTag.attribs.href
        }
    })

    console.log(authors)
}

export { getAuthors }
