"use stricta";

module.exports = class TableTreeNode {
  /**
   * TableTreeNode constructor
   *
   * @param {object} table The table data passed to this node. Default to an empty object
   * @param {TableTreeNode} parent The parent of this node. Default to null
   */
  constructor(table, parent) {
    this._table = table || {};
    this.parent = parent || null;
  }

  /**
   * Check if a key is a string
   *
   * @param {string} key The key to check
   * @return True if the key is not undefined and is a string
   */
  _checkKey(key) {
    return key && typeof key === "string";
  }

  /**
   * Insert a key-value pair into the table
   *
   * @param {string} key The key to insert
   * @param {any} val The value to insert
   */
  insert(key, val) {
    if (!this._checkKey(key) || !val) return;

    if (!this._table.hasOwnProperty(key)) {
      this._table[key] = {
        val: val,
        next: new TableTreeNode({}, this)
      };
    }
  }

  /**
   * Check if a key exists in any node above(including the current node)
   *
   * @param {string} key The key to check
   * @return True if the key exists
   */
  existsAbove(key) {
    if (!this._checkKey(key)) return false;

    var par = this;
    while (par !== null) {
      if (par.exists(key)) return true;
      par = par.parent;
    }

    return false;
  }

  /**
   * Check if a key exists in this node
   *
   * @param {string} key The key to check
   * @return True if the key exists
   */
  exists(key) {
    if (!this._checkKey(key)) return false;

    return !!this._table[key];
  }

  /**
   * Get the child of this key
   *
   * @param {string} key The key to get the child
   * @return {TableTreeNode} The child of this key
   */
  next(key) {
    if (!this._checkKey(key) || !this._table.hasOwnProperty(key)) return null;

    return this._table[key].next;
  }

  /**
   * Remove a key-value pair and all children below
   *
   * @param {string} key The key to remove
   */
  remove(key) {
    if (!this._checkKey(key)) return;

    delete this._table[key];
  }
};