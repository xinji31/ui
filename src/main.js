import { pageTitle } from "./components/pageTitle"
import { sidetools } from "./components/sidetools"
import { element as e } from "./lib/element"
import { router } from "./lib/router"

function getPreviewList() {
  return []
}

const navigator = {
  home: s => s === "/",
  publishArticle: s => s.startsWith("/publish/article"),
  publishDiscuss: s => s.startsWith("/publish/discuss"),
}

const titleText = router(
  [navigator.home, "小绿书"],
  [navigator.publishArticle, "小绿书 - 发布文章"],
  [navigator.publishDiscuss, "小绿书 - 发布讨论"],
)

document.querySelector("title").sub(titleText)

document.querySelector("#app").sub(
  e("div").attr({ class: "ui container" }).sub(
    pageTitle(titleText),
    e("hr").attr({ class: "ui divider" }),
    router(
      [navigator.home, ""],
      [navigator.publishArticle, "publish article"],
      [navigator.publishDiscuss, "publish discuss"],
    ),
    sidetools(),
  )
)