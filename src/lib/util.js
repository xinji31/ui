import { Box, BoxComputed } from "./box";

/**
 *
 * @param {Object} list
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
