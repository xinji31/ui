import { element as e } from "../lib/element";
import { flatCss } from "../lib/util";

export function loading() {
  return e("div").attr({
    style: flatCss({
      padding: "20px"
    })
  }).sub(
    e("div").attr({ class: "ui active centered inline loader" })
  )
}