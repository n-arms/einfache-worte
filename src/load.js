import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

const getRaw = async url => {
    const response = await fetch(url)
    return response.text()
}

const getAuthors = async initial => {
    const authorPage = await getRaw(`https://www.projekt-gutenberg.org/autoren/info/autor-${initial}.html`)
    const root = parse(authorPage)
    const authors = root.querySelectorAll('html > table > tr > td > a')

    return authors.map(row => {
        const attrs = row.rawAttrs
        const href = attrs.split('href="')[1].split('"')[0]
        const end = href.split('/')[2]
        return `https://www.projekt-gutenberg.org/autoren/namen/${end}`
    })
}

const getBooks = async url => {
    const booksPage = await getRaw(url)
    const root = parse(booksPage)
    const links = root.querySelectorAll('li > a')

    let take = false

    const bookLinks = links.filter(book => {
        take = !take
        return take
    })

    return bookLinks.map(row => {
        const attrs = row.rawAttrs
        const href = attrs.split('href="')[1].split('"')[0]
        const [_, __, a, b, c] = href.split('/')
        return `https://www.projekt-gutenberg.org/${a}/${b}/${c}`
    })
}

const pageContents = async url => {
    const page = await getRaw(url)
    const root = parse(page)
    const paras = root.querySelectorAll('html > p')
    const text = paras.filter(para => para.rawAttrs == "" && para.childNodes.length == 1).map(para => para.childNodes[0]._rawText)

    const links = root.querySelectorAll('html > a')
    const next = links.filter(link => link.childNodes[0] && link.childNodes[0]._rawText.includes('weiter'))

    if (next.length) {
        const end = next[0].rawAttrs.split('href="')[1].split('"')[0]
        let newUrl = url.split('/')
        newUrl.pop()
        newUrl.push(end)
        return {
            next: newUrl.join('/'),
            text
        }
    } else {
        return {
            text
        }
    }
}

export { getAuthors, getBooks, pageContents }
