/**
 * @template T
 * @param {T} getter 
 * @returns {T}
 */
function cacheGetter(getter) {
  let value
  let requested = false
  let valid = false
  let pendingK = []

  async function sendRequest(...param) {
    requested = true
    value = await getter(...param)
    valid = true
    pendingK.forEach(k => k(value))
    pendingK = null
  }

  return (...param) => new Promise(k => {
    if (!valid) {
      pendingK.push(k)
      if (!requested) {
        sendRequest(...param)
      }
    }
    else {
      k(value)
    }
  })
}

export class Database {
  /**
   * 
   * @param {String} baseURL 
   */
  constructor(baseURL, sourceURL) {
    this.siteInfo = cacheGetter(
      async () => {
        console.log("load site-info")
        const url = new URL("site-info.json", baseURL)
        return await (await fetch(url)).json()
      }
    )
    this.rawText = cacheGetter(
      /**
       * 
       * @param {String} path 
       * @returns {Promise<String>}
       */
      async (path) => {
        const url = new URL(path, sourceURL)
        return await (await fetch(url)).text()
      }
    )
  }
}