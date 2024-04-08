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
  return new BoxComputed($ => {
    let result = [];
    for (const [key, value] of Object.entries(list)) {
      if (value instanceof Box) {
        result.push(key + ":" + $(value))
      } else {
        result.push(key + ":" + value)
      }
    }
    return result.join(";");
  });
}