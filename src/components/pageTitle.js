import { element as e } from "../lib/element";
import { flatCss } from "../lib/util";

export function pageTitle(titleText) {
  return (
    e("div").attr({
      style: flatCss({
        textAlign: "center",
        fontFamily: "Segoe UI, 微软雅黑, Microsoft YaHei, sans-serif",
        fontSize: "2em",
        color: "#008a83",
        margin: "20px",
      })
    }).sub(titleText)
  )
}