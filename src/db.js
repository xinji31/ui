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
  }
}