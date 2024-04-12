import { flatCss } from "../lib/util"
import { element as e } from "../lib/element"
import { BoxComputed, BoxValue } from "../lib/box"

const linkTo = href => (() => location.hash = "#" + href)
const icon = name => e("i").attr({
  class: name + " icon",
})

export function sidetools() {
  const button = (click) => e("button").attr({
    click,
    class: "circular ui icon button",
    style: flatCss({
      fontSize: "1.5em",
      margin: "0.5em",
      color: "#008a83",
    }),
  })

  const expand = new BoxValue(window.innerWidth >= 500)
  const toggleDisplay = () => expand.value = !expand.value

  return (
    e("div").attr({
      class: "sidetools",
      style: flatCss({
        position: "fixed",
        bottom: "2.5vh",
        right: "2.5vw",
        display: "flex",
        flexDirection: "column",
      })
    }).sub(
      e("div").attr({
        style: flatCss({
          display: "flex",
          flexDirection: "column",
          height: new BoxComputed($ => $(expand) ? "21.428571428571427em" : "0"),
          overflow: "hidden",
          transitionDuration: "0.2s",
        })
      }).sub(
        button(linkTo("/")).sub(icon("home")),
        button(linkTo("/publish/discuss")).sub(icon("comments")),
        button(linkTo("/publish/article")).sub(icon("pencil alternate")),
        button(linkTo("/settings")).sub(icon("cog")),
      ),
      e("div").attr({
        style: flatCss({
          margin: "0",
          rotate: new BoxComputed($ => $(expand) ? "90deg" : "0deg"),
          transitionDuration: "0.2s",
        })
      }).sub(
        button(toggleDisplay).sub(icon("ellipsis horizontal"))
      ),
    )
  )
}