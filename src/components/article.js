import { Database } from "../db"
import { boxPromise } from "../lib/box"
import { element as e } from "../lib/element"
import { flatCss } from "../lib/util"
import { giscuss } from "./giscuss"
import { loading } from "./loading"
import { parse } from "marked"
import dompurify from "dompurify"

import "github-markdown-css/github-markdown-light.css"

/**
 * 
 * @param {Database} db 
 * @param {String} id 
 * @returns {HTMLElement}
 */
export function getArticleBody(db, id) {
  return e("div").sub(
    boxPromise(
      loading(),
      (async () => {
        const art = (await db.siteInfo()).articles[id]
        const artPath = `${art.hash}/src/article`

        if (art.type === "md") {
          const res = e("div").attr({
            class: "markdown-body"
          })
          res.innerHTML = dompurify.sanitize(parse(await (await db.blob(artPath)).text()))
          return res
        }
        else if (art.type === "pdf") {
          return e("embed").attr({
            src: await (async () => {
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
    e("p"),
    giscuss(`article-${id}`),
  )
}
