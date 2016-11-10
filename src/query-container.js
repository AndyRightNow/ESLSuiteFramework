const ESLSuite = require("./eslsuite");

//-------------------------------------------------------------------------
//  Multi-key query container data structure
//
//  A container data structure supporting multi-key query.
//
//  The keys of the container are set on construction and CAN NOT be changed 
//  afterwards for the sake of efficiency. 
//
//  * The underlying hash tables are constructed based on the keys.
//  * The structure of the tables:
//          
//     _data
//         First level of keys
//              ...
//                 The last level of keys
//                     Data: [..., ...., ...](An array containing data)
//
//
//     E.g.
//           _data = 
//           {
//               First_level_1:
//               {
//                   The_last_level_1:
//                   {
//                       Data: [1, 2, 3, 4]
//                   }
//               },
//               First_level_2:
//               {
//                   The_last_level_2:
//                   {
//                       Data: [1, 2, 3, 4]
//                   }
//                }
//           }
//                          
//  * All tables are javascript objects(i.e. {}) in order to support direct access
//    with keys as well as being passed by reference among member functions.
//  * Supported operations so far:
//      * Insert an elements with keys
//      * Get an element with keys
//-------------------------------------------------------------------------
module.exports =
  (function () {

    //--------------------------------------------------------
    //  * Constructors
    //  * 1 overloaded constructors:
    //      * Constructor(keys)
    //        @param keyCount: The count of keys used to query the data
    //
    //---------------------------------------------------------
    ESLSuite.MultikeyQueryContainer = function () {
      //------------------------------------
      //  Initialize all member variables
      //------------------------------------
      this._keyCount = 0;
      this._data = {};
      this._size = 0;

      //---------------------------------------------------------
      //  Switch to use different overloaded constructors
      //---------------------------------------------------------
      switch (arguments.length) {
        case 0:
          {
            var msg = "MultiKeyQueryContainer constructor must have arguments!";
            throw new Error(msg);
          }
        case 1:
          {
            if (typeof arguments[0] === "number") {
              //------------------------
              //  Constructor(keyCount)
              //------------------------
              this._keyCount = arguments[0];
            }
            break;
          }
      }
    };
    //---------------------------------------------------------------------------------
    //  Get element from the container
    //
    //  Return: An array of elements that match the keys
    //
    //  @param keys: An array containing the exact number of keys that the
    //               user specifies when constructing the container. A key
    //               should be a string and if "All elements" is intended, the 
    //               key should be an empty string.
    //
    //---------------------------------------------------------------------------------
    ESLSuite.MultikeyQueryContainer.prototype.get = function (keys) {
      return this._getDataInTables(this._findTables(keys));
    };

    //---------------------------------------------------------------------------------
    //  Insert element into the container
    //
    //  Return: no
    //
    //  @param keys: An array containing the exact number of keys that the
    //               user specifies when constructing the container. A key
    //               should be a string and if "All elements" is intended, the 
    //               key should be an empty string.
    //  @param element: The element you want to insert into the container.
    //
    //---------------------------------------------------------------------------------
    ESLSuite.MultikeyQueryContainer.prototype.insert = function (keys, element) {
      var tables = this._findTables(keys);

      if (typeof tables === "undefined") {
        return;
      }

      //-------------------------------------
      //  If found, push element to the Data
      //-------------------------------------
      if (Array.isArray(tables)) {
        for (let i = 0; i < tables.length; i++) {
          tables[i].Data.push(element);
        }
      }
      //------------------------------------
      //  If not found, create the tables 
      //  for keys that are not found
      //------------------------------------
      else {
        //  Get the index of the key absent
        let index = tables.Index;
        //  Get the previous level of tables of the level in which the key is not found
        tables = tables.Result;

        for (let i = 0; i < tables.length; i++) {
          //  Create an empty table with the name absent
          tables[i][keys[index]] = {};

          //--------------------------------------------------
          //  Create tables for all following levels of keys
          //--------------------------------------------------
          let subTable = tables[i][keys[index]];
          for (let j = index + 1; j < this._keyCount; j++) {
            subTable[keys[j]] = {};
            subTable = subTable[keys[j]];
          }

          //  Create a Data member in the last level of tables
          subTable.Data = [element];
        }
      }

      return;
    };

    //-----------------------------------
    //  Private helper member functions
    //-----------------------------------
    //------------------------------------------------------------------------------
    //  Find table(s)
    //
    //  Return: 1. undefined if the parameters are invalid
    //          2. If not found, an object containing:
    //              1) Result: The table containing the level of sub-tables where the key is not found
    //              2) Index: The index of the key that's not found (Range from 0 to keyCount - 1)
    //          3. An array of found tables if found
    //
    //  @param keys: An array containing the exact number of keys that the
    //               user specifies when constructing the container. A key
    //               should be a string and if "All elements" is intended, the 
    //               key should be an empty string.
    //
    //------------------------------------------------------------------------------
    ESLSuite.MultikeyQueryContainer.prototype._findTables = function (keys) {
      if (!Array.isArray(keys)) {
        throw new Error("The parameter is not an array!");
      } else {
        if (keys.length !== this._keyCount) {
          throw new Error("The passed in keys'length does not match the key count of the container!");
        } else {
          var tables = [this._data]; //  Start from the base table
          var res; //  The results found

          for (let i = 0; i < keys.length; i++) {
            res = this.__findTablesHelper(keys[i], tables);

            if (typeof res === "undefined") {
              return undefined;
            } else {
              //  If not found. The __findTablesHelper returns false if not found
              if (!res) {
                res = {
                  Result: tables,
                  Index: i
                };

                return res;
              }
            }

            tables = res;
          }

          return tables;
        }
      }
    };

    //------------------------------------------------------------------------------
    //  Find table(s) helper function
    //
    //  Find the sub-table(s) that match a key in an array of tables
    //
    //  Return: 1. undefined if the parameters are invalid
    //          2. False if not found
    //          3. An array of found tables if found
    //
    //  @param key: The key to match in the table(s). Empty string means "All".
    //  @param tables: An array of table(s)
    //------------------------------------------------------------------------------
    ESLSuite.MultikeyQueryContainer.prototype.__findTablesHelper = function (key, tables) {
      //------------------------------
      //  If the parameters are invalid,
      //  return undefined.
      //------------------------------
      if (typeof key !== "string" ||
        !Array.isArray(tables)) {
        return undefined;
      }

      var ret = []; //  Array to return
      var notFound = true; // Flag to check if not found

      for (let i = 0; i < tables.length; i++) {
        //  If all sub-tables is requested, which means, the key is an empty string
        if (key === "") {
          for (let t in tables[i]) {
            notFound = false;
            ret.push(tables[i][t]);
          }
        } else if (tables[i].hasOwnProperty(key)) {
          notFound = false;
          ret.push(tables[i][key]);
        }
      }

      if (notFound) {
        return false;
      }

      return ret;
    };

    //------------------------------------------------------------------------------
    //  Get data in an array of tables
    //
    //  Take the data out of all tables inside the array. In other words, unroll all
    //  objects and take the values out of all properties.
    //
    //  Return: An array of data
    //
    //  @param tables: An array of table(s)
    //------------------------------------------------------------------------------
    ESLSuite.MultikeyQueryContainer.prototype._getDataInTables = function (tables) {

      var ret = [];

      if (typeof tables === "undefined" ||
        !Array.isArray(tables)) {
        return ret;
      }

      for (let i = 0; i < tables.length; i++) {
        ret = ret.concat(tables[i].Data);
      }

      return ret;
    };

  })();