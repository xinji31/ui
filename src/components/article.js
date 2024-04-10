import { Database } from "../db"
import { BoxComputed, BoxValue, boxPromise } from "../lib/box"
import { element as e } from "../lib/element"
import { parse } from "marked"
import "github-markdown-css"

/**
 * 
 * @param {Database} db 
 * @param {String} id 
 * @returns {HTMLElement}
 */
export function getArticleBody(db, id) {
  return e("div").sub(boxPromise(
    "loading...",
    (async () => {
      await new Promise(r => setTimeout(r, 1000))
      const art = (await db.siteInfo()).articles[id]
      const type = art.path.match(/\.(md|pdf)$/)[1]

      if (type === "md") {
        const res = e("div").attr({
          class: "markdown-body"
        })
        res.innerHTML = parse(await db.rawText(`${art.hash}/${art.path}`))
        return res
      }
      else if (type === "pdf") {
        return e("a").attr({ href: srcURL }).sub("link")
      }
      else {
        return "Not supported file type"
      }
    })()
  ))
}
