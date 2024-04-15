import { Database } from "../db";
import { element as e } from "../lib/element";

import "semantic-ui-css/components/dropdown"
import "semantic-ui-css/components/dropdown.css"
import "semantic-ui-css/components/transition"
import "semantic-ui-css/components/transition.css"

/**
 * 
 * @param {Database} db 
 * @returns 
 */
export function settings(db) {
  const field = (...p) => e("div").sub(...p).attr({
    class: "field",
  })
  const label = (...p) => e("label").sub(...p)
  const input = (attr) => {
    attr.type = "text"
    return e("input").attr(attr)
  }
  const dropdown = (attr) => (...sub) => {
    attr.class = "ui fluid dropdown"
    for (const s of sub) {
      if (s.getAttribute("value") === attr.value) {
        s.setAttribute("selected", "")
      }
    }
    return e("select").attr(attr).sub(...sub).jq("dropdown")()
  }
  const option = (value, text) => e("option").attr({ value }).sub(text)

  return e("div").attr({
    class: "ui form",
  }).sub(
    field(
      label("Github Access Token"),
      input({
        placeholder: "ghp_************************************",
        value: db.config.gaToken,
        change: event => db.config.gaToken = event.target.value
      })
    ),
    field(
      label("pdf render"),
      dropdown({
        value: db.config.pdfRender,
        change: event => db.config.pdfRender = event.target.value
      })(
        option("browser", "browser (default)"),
        option("pdfjs", "pdf.js"),
      )
    ),
  )
}