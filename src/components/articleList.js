import { Database } from "../db"
import { boxPromise } from "../lib/box"
import { element as e } from "../lib/element"

function articleElement(art) {
  const URL = `#/view/article/${art.hash}`
  return e("a").attr({ href: URL }).sub(`${art.title} - ${art.author}`)
}

/**
 * 
 * @param {Database} db 
 * @returns 
 */
export function articleList(db) {
  return e("div").sub(boxPromise(
    "loading...",
    (async () => {
      await new Promise(r => setTimeout(r, 1000))
      const si = await db.siteInfo()
      return e("ul").sub(...si.previewList.map(
        id => e("li").sub(articleElement(si.articles[id]))
      ))
    })()
  ))
}