import { } from "../lib/element"
import { GiscusWidget } from "giscus"

/**
 * 
 * @param {string} giscusId 
 * @returns 
 */
export function giscuss(giscusId) {
  return new GiscusWidget().attr({
    repo: "xinji31/book-test",
    repoid: "R_kgDOLq9ULw",
    category: "Announcements",
    categoryid: "DIC_kwDOLq9UL84Cegr4",
    mapping: "specific",
    term: giscusId,
    strict: "1",
    reactionsenabled: "1",
    emitmetadata: "1",
    inputposition: "bottom",
    theme: "light",
    lang: "zh-CN",
    crossorigin: "anonymous",
  })
}