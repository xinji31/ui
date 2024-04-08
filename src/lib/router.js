import { BoxValue, BoxComputed } from "./box";
import { element } from "./element";

const hash = new BoxValue(location.hash)

window.addEventListener("hashchange", () => {
  hash.value = location.hash
})

/**
 * 
 * @param  {...[Function, Function]} matchList 
 * @returns  {any}
 */
export function router(...matchList) {
  return new BoxComputed($ => {
    let url = $(hash).slice(1)
    if (url == "") {
      url = "/"
    }

    for (const [kf, v] of matchList) {
      if (kf(url)) {
        if (v instanceof Function) {
          return v()
        } else {
          return v
        }
      }
    }
  })
}