import { Box, BoxComputed } from "./box";

/**
 *
 * @param {{String:Boolean|Box}} list
 * @param {String} sep
 */
export function flatOptions(list, sep = " ") {
  return new BoxComputed($ => {
    let result = [];
    for (const [key, value] of Object.entries(list)) {
      if (value instanceof Box) {
        const ok = $(value);
        if (ok) {
          result.push(key);
        }
      } else {
        if (value) {
          result.push(key);
        }
      }
    }
    return result.join(sep);
  });
}

/**
 * 
 * @param {{String:String|Box}} list 
 * @returns {String}
 */
export function flatCss(list) {
  function transAttrName(name) {
    const isUpper = c => 65 <= c.charCodeAt(0) && c.charCodeAt(0) <= 90
    return name.split("").map(c => {
      if (isUpper(c)) {
        return "-" + c.toLowerCase()
      } else {
        return c
      }
    }).join("")
  }

  return new BoxComputed($ => {
    let result = [];
    for (const [key, value] of Object.entries(list)) {
      if (value instanceof Box) {
        result.push(transAttrName(key) + ":" + $(value))
      } else {
        result.push(transAttrName(key) + ":" + value)
      }
    }
    return result.join(";");
  });
}