/**
 * @template T
 * @param {() => Promise<T>} getter 
 * @returns {Promise<T>}
 */
function cacheGetter(getter) {
  const value = {}

  /**
   * @param {String|undefined} id
   */
  return (id) => {
    if (value[id] === undefined) {
      value[id] = getter(id)
    }
    return value[id]
  }
}

/**
 * @template T
 * @param {T} attr 
 * @returns {T}
 */
function localStorageWrapper(attr) {
  const res = {}
  for (let [k, v] of Object.entries(attr)) {
    if (window.localStorage.getItem(k) === null && v !== undefined) {
      console.log("set local", k, v)
      window.localStorage.setItem(k, v)
    }
    Object.defineProperty(res, k, {
      get: () => window.localStorage.getItem(k),
      set: v => window.localStorage.setItem(k, v),
    })
  }
  return res
}

export class Database {
  /**
   * 
   * @param {String} baseURL 
   */
  constructor(baseURL, sourceURL) {
    this.siteInfo = cacheGetter(
      async () => {
        const url = new URL("site-info.json", baseURL)
        return await (await fetch(url)).json()
      }
    )
    this.blob = cacheGetter(
      async (path) => {
        const url = new URL(path, sourceURL)
        return await (await fetch(url)).blob()
      }
    )
    this.blobURL = (path) => new URL(path, sourceURL)
    this.config = localStorageWrapper({
      gaToken: undefined,
      pdfRender: "browser",
    })
  }
}