import { BoxComputed, BoxValue, boxPromise } from "../lib/box"
import { element as e } from "../lib/element"

const siteinfo = {
  "previewList": [{ "title": "Markdown 语法测试", "tags": ["test", "markdown"], "hash": "dc855b37a7309874c735e65d5d8ba3a829d1e3c8", "path": "src/markdown-test.md", "date": "2024-04-08 16:02:25 +0800", "author": "asd-a" }, { "title": "测试文章", "tags": ["数学,数学分析"], "hash": "ac79123e5510333e76811814c5ae4695776217b0", "path": "src/Assignment%208.pdf", "date": "2024-04-07 20:28:04 +0800", "author": "CoderOJ" }, { "title": "FAQ", "tags": ["site"], "hash": "4cf26ff0746aef286ed80475ef23a18aa28a5fe9", "path": "src/FAQ.md", "date": "2024-04-07 20:20:22 +0800", "author": "CoderOJ" }]
} // await (await fetch("https://xinji31.github.io/book-test/site-info.json")).json()
function articleElement(art) {
  const URL = `#/view/article/${art.hash}`
  return e("a").attr({ href: URL }).sub(`${art.title} - ${art.author}`)
}

export function articleList() {
  var a = []
  for (const art of siteinfo.previewList)
    a.push(e("li").sub(articleElement(art)))
  return e("div").sub(e("ul").sub(...a))
}