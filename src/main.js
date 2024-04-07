import { element as e } from "./lib/element"

function getPreviewList() {
  return []
}

document.querySelector("#app").sub(
  e("div")
    .attr({ "class": "page-title" })
    .sub("小绿书"),
  e("hr"),
  ...getPreviewList(),
)