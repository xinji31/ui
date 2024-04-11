import { Database } from "../db"
import { boxPromise } from "../lib/box"
import { element as e } from "../lib/element"
import { flatCss } from "../lib/util"

function articleElement(art) {
  const URL = `#/view/article/${art.hash}`
  return e("li").attr({
    click: () => location.hash = URL,
    class: "ui button",
    style: flatCss({
      fontSize: "1em",
      margin: "0.5em",
      padding: "0.5em",
      color: "#008a83",
    }),
  }).sub(`${art.title} - ${art.author}`)
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
      return e("ul").attr({
        class: "ui list"
      }).sub(...si.previewList.map(
        id => articleElement(si.articles[id])
      ))
    })()
  ))
}