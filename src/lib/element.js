import { Box } from "./box"

/**
 * 
 * @param {HTMLElement} element 
 * @param {String} key 
 * @param {Any} value 
 */
function addAttribute(element, key, value) {
  if (value === null || value === undefined) {
    return
  } else if (typeof value === "function") {
    element.addEventListener(key, value)
  } else {
    element.setAttribute(key, value)
  }
}

/**
 * 
 * @param {HTMLElement} element 
 */
function removeAttribute(element, key, value) {
  if (value === null || value === undefined) {
    return
  } else if (typeof value === "function") {
    element.removeEventListener(value)
  } else {
    element.removeAttribute(key)
  }
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {Object} attr 
 */
function bindAttributes(element, attr) {
  element._cumc.attributes = attr
  for (const key in attr) {
    const value = attr[key]
    if (value instanceof Box) {
      addAttribute(element, key, value.value)
      const bindingId = value.addWeakBind(element, (ref, valueOld, valueNew) => {
        removeAttribute(ref, key, valueOld)
        addAttribute(ref, key, valueNew)
      })
      element._cumc.attributeBindings[key] = bindingId
    } else {
      addAttribute(element, key, value)
    }
  }
}

function unbindAttributes(element, attr) {
  element._cumc.attributes = undefined
  for (const key in attr) {
    const value = attr[key]
    if (value instanceof Box) {
      removeAttribute(element, key, value.valueOld)
      value.removeWeakBind(element._cumc.attributeBindings[key])
      delete (element._cumc.attributeBindings[key])
    } else {
      removeAttribute(element, key, value)
    }
  }
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {Number} id 
 * @param {Any} child 
 */
function setChild(element, id, child) {
  while (element.childNodes.length <= id) {
    element.appendChild(new Text(""))
  }
  if (child instanceof HTMLElement) {
    element.replaceChild(child, element.childNodes[id])
  } else {
    element.replaceChild(new Text(child), element.childNodes[id])
  }
}

/**
 * 
 * @param {HTMLElement|String} element 
 * @param {Any} children 
 */
function bindChildren(element, children) {
  element._cumc.children = children
  for (const id in children) {
    const value = children[id]
    if (value instanceof Box) {
      setChild(element, id, value.value)
      const bindingId = value.addWeakBind(element, (ref, valueOld, valueNew) => {
        setChild(ref, id, valueNew)
      })
      element._cumc.childrenBindings[id] = bindingId
    } else {
      setChild(element, id, value)
    }
  }
}

/**
 * create a dynamic dom node
 * @param {String} tagName 
 */
export function element(tagName) {
  const element = document.createElement(tagName)
  element._cumc = {
    attributeBindings: {},
    childrenBindings: [],
  }
  return element
}

HTMLElement.prototype.attr = function (attributes) {
  if (this._cumc === undefined) {
    this._cumc = {
      attributeBindings: {},
      childrenBindings: [],
    }
  }

  if (attributes instanceof Box) {
    bindAttributes(this, attributes.value)
    attributes.addWeakBind(this, (ref, valueOld, valueNew) => {
      unbindAttributes(ref, valueOld)
      bindAttributes(ref, valueNew)
    })
  } else {
    bindAttributes(this, attributes)
  }
  return this
}

HTMLElement.prototype.sub = function (...children) {
  if (this._cumc === undefined) {
    this._cumc = {
      attributeBindings: {},
      childrenBindings: [],
    }
  }

  bindChildren(this, children)
  return this
}