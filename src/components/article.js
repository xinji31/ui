import { Database } from "../db"
import { BoxComputed, BoxValue, boxPromise } from "../lib/box"
import { element as e } from "../lib/element"
import { parse } from "marked"
import "github-markdown-css"
import { flatCss } from "../lib/util"
import { giscuss } from "./giscuss"

/**
 * 
 * @param {Database} db 
 * @param {String} id 
 * @returns {HTMLElement}
 */
export function getArticleBody(db, id) {
  return e("div").sub(
    boxPromise(
      "loading...",
      (async () => {
        await new Promise(r => setTimeout(r, 1000))
        const art = (await db.siteInfo()).articles[id]
        const type = art.path.match(/\.(md|pdf)$/)[1]

        if (type === "md") {
          const res = e("div").attr({
            class: "markdown-body"
          })
          res.innerHTML = parse(await (await db.blob(`${art.hash}/${art.path}`)).text())
          return res
        }
        else if (type === "pdf") {
          return e("embed").attr({
            src: await (async () => {
              const artPath = `${art.hash}/${art.path}`
              if (db.config.pdfRender === "browser") {
                const blob = await db.blob(artPath)
                const blobURL = URL.createObjectURL(blob.slice(0, blob.size, "application/pdf"))
                return blobURL + "#toolbar=0&zoom=page-width&view=fitH"
              }
              else {
                return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${db.blobURL(artPath)}`
              }
            })(),
            scrolling: "no",
            style: flatCss({
              width: "100%",
              height: "700px",
              border: "none",
            })
          })
        }
        else {
          return "Not supported file type"
        }
      })()
    ),
    giscuss(`article-${id}`),
  )
}
