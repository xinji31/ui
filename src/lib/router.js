import { BoxValue, BoxComputed } from "./box";
import { element } from "./element";

function getLocFromHash() {
  let u = location.hash.split("#")[1]
  if (u === "" || u === undefined) {
    u = "/"
  }
  return u
}

export const loc = new BoxValue(getLocFromHash())
window.addEventListener("hashchange", () => {
  loc.value = getLocFromHash()
})
loc.addWeakBind(location, (ref, valueOld, valueNew) => {
  ref.hash = "#" + valueNew
})

/**
 * 
 * @param  {...[Function, Function]} matchList 
 * @returns  {any}
 */
export function router(...matchList) {
  return new BoxComputed($ => {
    let u = $(loc)
    for (const [kf, v] of matchList) {
      if (kf(u)) {
        if (v instanceof Function) {
          return v(u)
        } else {
          return v
        }
      }
    }
  })
}