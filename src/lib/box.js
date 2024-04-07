export class Box {
  /**
   * 
   * @param {Boolean} diry 
   */
  constructor(diry = true) {
    /** @type WeakRef<Box> */
    this._weakThis = new WeakRef(this);
    /** @type Boolean */
    this.dirty = diry;
    /** @type Array<{ref: WeakRef, func: Function}> */
    this._updateHandlers = [];
    /** @type Set<WeakRef<Box>> */
    this._dependents = new Set();
    /** @type Set<Box> */
    this._dependencies = new Set();
  }
  _callUpdateHandler(valueOld, valueNew) {
    for (const id in this._updateHandlers) {
      const handler = this._updateHandlers[id];
      const ref = handler.ref.deref();
      if (!ref) {
        this.removeWeakBind(id);
      } else {
        handler.func(ref, valueOld, valueNew);
      }
    }
  }
  _broadcastDirty() {
    for (const ref of this._dependents) {
      if (ref.deref()) {
        ref.deref()._markDirty();
      } else {
        this._dependents.delete(ref);
      }
    }
  }
  _markDirty() {
    if (!this.dirty) {
      this.dirty = true;
      window.requestAnimationFrame(this.recalculate.bind(this));
      this._broadcastDirty();
    }
  }
  /**
   * @param {Function} func
   */
  addWeakBind(ref, func) {
    const weakRef = new WeakRef(ref);
    this._updateHandlers.push({ ref: weakRef, func });
    return this._updateHandlers.length - 1;
  }
  /**
   * 
   * @param {Number} id 
   */
  removeWeakBind(id) {
    delete (this._updateHandlers[id]);
  }
}

export class BoxValue extends Box {
  /**
   * 
   * @param {Any} value 
   */
  constructor(value) {
    super(false)
    this._valueOld = value;
    this._value = value;
  }
  recalculate() {
    if (this.dirty) {
      this._callUpdateHandler(this._valueOld, this._value);
      this._valueOld = this._value;
      this.dirty = false;
    }
  }
  get valueOld() {
    return this._valueOld;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this._markDirty();
  }
}

export class BoxComputed extends Box {
  /**
   * 
   * @param {Function} func 
   */
  constructor(func) {
    if (!func instanceof Function) {
      throw new Error("computed only accept a function");
    }
    super()
    this._value = undefined;
    this._valueFunc = func;
  }
  recalculate() {
    this.dirty = false;
    for (const ref of this._dependencies) {
      ref._dependents.delete(this._weakThis);
    }
    let valueNew = this._valueFunc((box) => {
      this._dependencies.add(box);
      return box.value;
    });
    for (const ref of this._dependencies) {
      ref._dependents.add(this._weakThis);
    }
    this._callUpdateHandler(this._value, valueNew);
    this._value = valueNew;
  }
  get valueOld() {
    return this._value;
  }
  get value() {
    if (this.dirty) {
      this.recalculate()
    }
    return this._value;
  }
  set value(_) {
    throw new Error("cannot assigned to computed box")
  }
}