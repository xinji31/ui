import { BoxValue, BoxComputed } from "./box";
import { element } from "./element";

/**
 * Location with props (like ?key=value)
 * @typedef {Object} Loc
 * @property {string} url
 * @property {Object} props
 */

/**
 * get loc from hash 
 * @returns {Loc}
 */
function getLocFromHash() {
  const ls = location.hash.split("#")
  return {
    url: (() => {
      if (ls[1] && ls[1] !== "") {
        return ls[1]
      } else {
        return "/"
      }
    })(),
    props: (() => {
      try {
        return JSON.parse(decodeURIComponent(ls[2]))
      } catch (err) {
        return undefined
      }
    })(),
  }
}


/**
 * @type {Loc}
 */
export const loc = new BoxValue(getLocFromHash())
window.addEventListener("hashchange", () => {
  loc.value = getLocFromHash()
})

/**
 * 
 * @param {String} url 
 * @param {Object} props 
 */
export function linkTo(url, props) {
  return () => {
    location.hash = "#" + url + (props ? "#" + encodeURIComponent(JSON.stringify(props)) : "")
  }
}

/**
 * 
 * @param  {...[Function, Function]} matchList 
 * @returns  {any}
 */
export function router(...matchList) {
  return new BoxComputed($ => {
    let { url, props } = $(loc)
    for (const [kf, v] of matchList) {
      if (kf(url)) {
        if (v instanceof Function) {
          return v(url, props)
        } else {
          return v
        }
      }
    }
  })
}