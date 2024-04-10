import { flatCss } from "../lib/util"
import { element as e } from "../lib/element"

const buttonLink = href => e("button").attr({
  click: () => location.hash = "#" + href,
  class: "circular ui icon button",
  style: flatCss({
    fontSize: "1.5em",
    margin: "0.5em",
    color: "#008a83",
  }),
})

const icon = name => e("i").attr({
  class: name + " icon",
})

export function sidetools() {
  return (
    e("div").attr({
      class: "sidetools",
      style: flatCss({
        position: "fixed",
        bottom: "40px",
        right: "40px",
      })
    }).sub(
      buttonLink("/").sub(icon("home")), e("br"),
      buttonLink("/publish/discuss").sub(icon("comments")), e("br"),
      buttonLink("/publish/article").sub(icon("pencil alternate")), e("br"),
    )
  )
}