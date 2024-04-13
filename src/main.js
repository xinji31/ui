import { element as e } from "./lib/element"
import { router } from "./lib/router"
import { Database } from "./db"
import { pageTitle } from "./components/pageTitle"
import { sidetools } from "./components/sidetools"
import { getArticleBody } from "./components/article"
import { articleList } from "./components/articleList"
import { settings } from "./components/settings"

const repo = "book-test"
const db = new Database(
  `https://xinji31.github.io/${repo}/`,
  `https://raw.githubusercontent.com/xinji31/${repo}/`,
)

const navigator = {
  home: s => s === "/",
  publishArticle: s => s.startsWith("/publish/article"),
  publishDiscuss: s => s.startsWith("/publish/discuss"),
  viewArticle: s => s.startsWith("/view/article"),
  settings: s => s.startsWith("/settings"),
}

const titleText = router(
  [navigator.home, "小绿书"],
  [navigator.publishArticle, "小绿书 - 发布文章"],
  [navigator.publishDiscuss, "小绿书 - 发布讨论"],
  // [navigator.viewArticle, (url => "小绿书 - " + getArticleTitle(db, url.split("/")[3]))],
  [navigator.viewArticle, (url => "小绿书 - 查看文章")],
  [navigator.settings, "小绿书 - 设置"],
)
document.querySelector("title").sub(titleText)

document.querySelector("#app").sub(
  e("div").attr({ class: "ui container" }).sub(
    pageTitle(titleText),
    e("hr").attr({ class: "ui divider" }),
    router(
      [navigator.home, () => articleList(db)],
      [navigator.publishArticle, "publish article"],
      [navigator.publishDiscuss, "publish discuss"],
      [navigator.viewArticle, (url => getArticleBody(db, url.split("/")[3]))],
      [navigator.settings, settings],
    ),
    sidetools(),
  )
)