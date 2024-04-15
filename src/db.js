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
  constructor() {
    this.config = localStorageWrapper({
      gaToken: undefined,
      pdfRender: "browser",
      org: "xinji31",
      repo: "book",
      branch: "master",
      siteInfoURL: "https://xinji31.github.io/book/site-info.json",
    })

    const baseURL = new URL(
      `https://raw.githubusercontent.com/${this.config.org}/${this.config.repo}/`)
    this.siteInfo = cacheGetter(
      async () => {
        const url = this.config.siteInfoURL
        return await (await fetch(url, {
          cache: "no-store",
        })).json()
      }
    )
    this.blob = cacheGetter(
      async (path) => {
        const url = new URL(path, baseURL)
        return await (await fetch(url)).blob()
      }
    )
    this.blobURL = (path) => new URL(path, baseURL)
  }
}