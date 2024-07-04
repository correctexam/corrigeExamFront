/**
 * @licstart The following is the entire license notice for the
 * JavaScript code in this page
 *
 * Copyright 2023 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * JavaScript code in this page
 */

/******/ var __webpack_modules__ = ({

/***/ 9306:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);
var tryToString = __webpack_require__(6823);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 3506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isPossiblePrototype = __webpack_require__(3925);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 7080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var has = (__webpack_require__(4402).has);

// Perform ? RequireInternalSlot(M, [[SetData]])
module.exports = function (it) {
  has(it);
  return it;
};


/***/ }),

/***/ 6469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);
var create = __webpack_require__(2360);
var defineProperty = (__webpack_require__(4913).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isPrototypeOf = __webpack_require__(1625);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ }),

/***/ 8551:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(34);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 7811:
/***/ ((module) => {


// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ 7394:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThisAccessor = __webpack_require__(6706);
var classof = __webpack_require__(4576);

var $TypeError = TypeError;

// Includes
// - Perform ? RequireInternalSlot(O, [[ArrayBufferData]]).
// - If IsSharedArrayBuffer(O) is true, throw a TypeError exception.
module.exports = uncurryThisAccessor(ArrayBuffer.prototype, 'byteLength', 'get') || function (O) {
  if (classof(O) !== 'ArrayBuffer') throw new $TypeError('ArrayBuffer expected');
  return O.byteLength;
};


/***/ }),

/***/ 3238:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var arrayBufferByteLength = __webpack_require__(7394);

var slice = uncurryThis(ArrayBuffer.prototype.slice);

module.exports = function (O) {
  if (arrayBufferByteLength(O) !== 0) return false;
  try {
    slice(O, 0, 0);
    return false;
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 5636:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var uncurryThis = __webpack_require__(9504);
var uncurryThisAccessor = __webpack_require__(6706);
var toIndex = __webpack_require__(7696);
var isDetached = __webpack_require__(3238);
var arrayBufferByteLength = __webpack_require__(7394);
var detachTransferable = __webpack_require__(4483);
var PROPER_STRUCTURED_CLONE_TRANSFER = __webpack_require__(1548);

var structuredClone = global.structuredClone;
var ArrayBuffer = global.ArrayBuffer;
var DataView = global.DataView;
var TypeError = global.TypeError;
var min = Math.min;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataViewPrototype = DataView.prototype;
var slice = uncurryThis(ArrayBufferPrototype.slice);
var isResizable = uncurryThisAccessor(ArrayBufferPrototype, 'resizable', 'get');
var maxByteLength = uncurryThisAccessor(ArrayBufferPrototype, 'maxByteLength', 'get');
var getInt8 = uncurryThis(DataViewPrototype.getInt8);
var setInt8 = uncurryThis(DataViewPrototype.setInt8);

module.exports = (PROPER_STRUCTURED_CLONE_TRANSFER || detachTransferable) && function (arrayBuffer, newLength, preserveResizability) {
  var byteLength = arrayBufferByteLength(arrayBuffer);
  var newByteLength = newLength === undefined ? byteLength : toIndex(newLength);
  var fixedLength = !isResizable || !isResizable(arrayBuffer);
  var newBuffer;
  if (isDetached(arrayBuffer)) throw new TypeError('ArrayBuffer is detached');
  if (PROPER_STRUCTURED_CLONE_TRANSFER) {
    arrayBuffer = structuredClone(arrayBuffer, { transfer: [arrayBuffer] });
    if (byteLength === newByteLength && (preserveResizability || fixedLength)) return arrayBuffer;
  }
  if (byteLength >= newByteLength && (!preserveResizability || fixedLength)) {
    newBuffer = slice(arrayBuffer, 0, newByteLength);
  } else {
    var options = preserveResizability && !fixedLength && maxByteLength ? { maxByteLength: maxByteLength(arrayBuffer) } : undefined;
    newBuffer = new ArrayBuffer(newByteLength, options);
    var a = new DataView(arrayBuffer);
    var b = new DataView(newBuffer);
    var copyLength = min(newByteLength, byteLength);
    for (var i = 0; i < copyLength; i++) setInt8(b, i, getInt8(a, i));
  }
  if (!PROPER_STRUCTURED_CLONE_TRANSFER) detachTransferable(arrayBuffer);
  return newBuffer;
};


/***/ }),

/***/ 4644:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_ARRAY_BUFFER = __webpack_require__(7811);
var DESCRIPTORS = __webpack_require__(3724);
var global = __webpack_require__(4475);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var hasOwn = __webpack_require__(9297);
var classof = __webpack_require__(6955);
var tryToString = __webpack_require__(6823);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIn = __webpack_require__(6840);
var defineBuiltInAccessor = __webpack_require__(2106);
var isPrototypeOf = __webpack_require__(1625);
var getPrototypeOf = __webpack_require__(2787);
var setPrototypeOf = __webpack_require__(2967);
var wellKnownSymbol = __webpack_require__(8227);
var uid = __webpack_require__(3392);
var InternalStateModule = __webpack_require__(1181);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw new TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw new TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw new TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 4373:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toObject = __webpack_require__(8981);
var toAbsoluteIndex = __webpack_require__(5610);
var lengthOfArrayLike = __webpack_require__(6198);

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = lengthOfArrayLike(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ 5370:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var lengthOfArrayLike = __webpack_require__(6198);

module.exports = function (Constructor, list, $length) {
  var index = 0;
  var length = arguments.length > 2 ? $length : lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};


/***/ }),

/***/ 9617:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIndexedObject = __webpack_require__(5397);
var toAbsoluteIndex = __webpack_require__(5610);
var lengthOfArrayLike = __webpack_require__(6198);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 3839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var bind = __webpack_require__(6080);
var IndexedObject = __webpack_require__(7055);
var toObject = __webpack_require__(8981);
var lengthOfArrayLike = __webpack_require__(6198);

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_FIND_LAST_INDEX = TYPE === 1;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var index = lengthOfArrayLike(self);
    var boundFunction = bind(callbackfn, that);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0: return value; // findLast
        case 1: return index; // findLastIndex
      }
    }
    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};

module.exports = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod(1)
};


/***/ }),

/***/ 4527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var isArray = __webpack_require__(4376);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 7680:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

module.exports = uncurryThis([].slice);


/***/ }),

/***/ 4488:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var arraySlice = __webpack_require__(7680);

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ }),

/***/ 7628:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var lengthOfArrayLike = __webpack_require__(6198);

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
module.exports = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};


/***/ }),

/***/ 9928:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var lengthOfArrayLike = __webpack_require__(6198);
var toIntegerOrInfinity = __webpack_require__(1291);

var $RangeError = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
module.exports = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw new $RangeError('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};


/***/ }),

/***/ 6319:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var anObject = __webpack_require__(8551);
var iteratorClose = __webpack_require__(9539);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),

/***/ 4576:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 6955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var TO_STRING_TAG_SUPPORT = __webpack_require__(2140);
var isCallable = __webpack_require__(4901);
var classofRaw = __webpack_require__(4576);
var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 7740:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var hasOwn = __webpack_require__(9297);
var ownKeys = __webpack_require__(5031);
var getOwnPropertyDescriptorModule = __webpack_require__(7347);
var definePropertyModule = __webpack_require__(4913);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 2211:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 2529:
/***/ ((module) => {


// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ 6699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var definePropertyModule = __webpack_require__(4913);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 6980:
/***/ ((module) => {


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 2278:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var definePropertyModule = __webpack_require__(4913);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = function (object, key, value) {
  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};


/***/ }),

/***/ 2106:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var makeBuiltIn = __webpack_require__(283);
var defineProperty = __webpack_require__(4913);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 6840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);
var definePropertyModule = __webpack_require__(4913);
var makeBuiltIn = __webpack_require__(283);
var defineGlobalProperty = __webpack_require__(9433);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 6279:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var defineBuiltIn = __webpack_require__(6840);

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ 9433:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 3724:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 4483:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var tryNodeRequire = __webpack_require__(9714);
var PROPER_STRUCTURED_CLONE_TRANSFER = __webpack_require__(1548);

var structuredClone = global.structuredClone;
var $ArrayBuffer = global.ArrayBuffer;
var $MessageChannel = global.MessageChannel;
var detach = false;
var WorkerThreads, channel, buffer, $detach;

if (PROPER_STRUCTURED_CLONE_TRANSFER) {
  detach = function (transferable) {
    structuredClone(transferable, { transfer: [transferable] });
  };
} else if ($ArrayBuffer) try {
  if (!$MessageChannel) {
    WorkerThreads = tryNodeRequire('worker_threads');
    if (WorkerThreads) $MessageChannel = WorkerThreads.MessageChannel;
  }

  if ($MessageChannel) {
    channel = new $MessageChannel();
    buffer = new $ArrayBuffer(2);

    $detach = function (transferable) {
      channel.port1.postMessage(null, [transferable]);
    };

    if (buffer.byteLength === 2) {
      $detach(buffer);
      if (buffer.byteLength === 0) detach = $detach;
    }
  }
} catch (error) { /* empty */ }

module.exports = detach;


/***/ }),

/***/ 4055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var isObject = __webpack_require__(34);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 6837:
/***/ ((module) => {


var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 5002:
/***/ ((module) => {


module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};


/***/ }),

/***/ 8834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var userAgent = __webpack_require__(9392);

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ 7290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var IS_DENO = __webpack_require__(516);
var IS_NODE = __webpack_require__(9088);

module.exports = !IS_DENO && !IS_NODE
  && typeof window == 'object'
  && typeof document == 'object';


/***/ }),

/***/ 516:
/***/ ((module) => {


/* global Deno -- Deno case */
module.exports = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';


/***/ }),

/***/ 3202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var UA = __webpack_require__(9392);

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ 9088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var classof = __webpack_require__(4576);

module.exports = classof(global.process) === 'process';


/***/ }),

/***/ 9392:
/***/ ((module) => {


module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 7388:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var userAgent = __webpack_require__(9392);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 9160:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var userAgent = __webpack_require__(9392);

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ 8727:
/***/ ((module) => {


// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 6193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ 747:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var createNonEnumerableProperty = __webpack_require__(6699);
var clearErrorStack = __webpack_require__(6193);
var ERROR_STACK_INSTALLABLE = __webpack_require__(4659);

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ 4659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ 6518:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var getOwnPropertyDescriptor = (__webpack_require__(7347).f);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIn = __webpack_require__(6840);
var defineGlobalProperty = __webpack_require__(9433);
var copyConstructorProperties = __webpack_require__(7740);
var isForced = __webpack_require__(2796);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = global[TARGET] && global[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 9039:
/***/ ((module) => {


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 8745:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(616);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 6080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(7476);
var aCallable = __webpack_require__(9306);
var NATIVE_BIND = __webpack_require__(616);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 616:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 9565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(616);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var hasOwn = __webpack_require__(9297);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 6706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var aCallable = __webpack_require__(9306);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 7476:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classofRaw = __webpack_require__(4576);
var uncurryThis = __webpack_require__(9504);

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ 9504:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(616);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 7751:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var isCallable = __webpack_require__(4901);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 1767:
/***/ ((module) => {


// `GetIteratorDirect(obj)` abstract operation
// https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
module.exports = function (obj) {
  return {
    iterator: obj,
    next: obj.next,
    done: false
  };
};


/***/ }),

/***/ 8646:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);
var getIteratorMethod = __webpack_require__(851);

module.exports = function (obj, stringHandling) {
  if (!stringHandling || typeof obj !== 'string') anObject(obj);
  var method = getIteratorMethod(obj);
  return getIteratorDirect(anObject(method !== undefined ? call(method, obj) : obj));
};


/***/ }),

/***/ 851:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(6955);
var getMethod = __webpack_require__(5966);
var isNullOrUndefined = __webpack_require__(4117);
var Iterators = __webpack_require__(6269);
var wellKnownSymbol = __webpack_require__(8227);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ 81:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var tryToString = __webpack_require__(6823);
var getIteratorMethod = __webpack_require__(851);

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ 5966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aCallable = __webpack_require__(9306);
var isNullOrUndefined = __webpack_require__(4117);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 3789:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var call = __webpack_require__(9565);
var toIntegerOrInfinity = __webpack_require__(1291);
var getIteratorDirect = __webpack_require__(1767);

var INVALID_SIZE = 'Invalid size';
var $RangeError = RangeError;
var $TypeError = TypeError;
var max = Math.max;

var SetRecord = function (set, intSize) {
  this.set = set;
  this.size = max(intSize, 0);
  this.has = aCallable(set.has);
  this.keys = aCallable(set.keys);
};

SetRecord.prototype = {
  getIterator: function () {
    return getIteratorDirect(anObject(call(this.keys, this.set)));
  },
  includes: function (it) {
    return call(this.has, this.set, it);
  }
};

// `GetSetRecord` abstract operation
// https://tc39.es/proposal-set-methods/#sec-getsetrecord
module.exports = function (obj) {
  anObject(obj);
  var numSize = +obj.size;
  // NOTE: If size is undefined, then numSize will be NaN
  // eslint-disable-next-line no-self-compare -- NaN check
  if (numSize !== numSize) throw new $TypeError(INVALID_SIZE);
  var intSize = toIntegerOrInfinity(numSize);
  if (intSize < 0) throw new $RangeError(INVALID_SIZE);
  return new SetRecord(obj, intSize);
};


/***/ }),

/***/ 4475:
/***/ (function(module) {


var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 9297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var toObject = __webpack_require__(8981);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 421:
/***/ ((module) => {


module.exports = {};


/***/ }),

/***/ 397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 5917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);
var createElement = __webpack_require__(4055);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 7055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var classof = __webpack_require__(4576);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 3167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var setPrototypeOf = __webpack_require__(2967);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 3706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var isCallable = __webpack_require__(4901);
var store = __webpack_require__(7629);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 7584:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(6699);

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ 1181:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_WEAK_MAP = __webpack_require__(8622);
var global = __webpack_require__(4475);
var isObject = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(6699);
var hasOwn = __webpack_require__(9297);
var shared = __webpack_require__(7629);
var sharedKey = __webpack_require__(6119);
var hiddenKeys = __webpack_require__(421);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 4209:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);
var Iterators = __webpack_require__(6269);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 4376:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(4576);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 1108:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(6955);

module.exports = function (it) {
  var klass = classof(it);
  return klass === 'BigInt64Array' || klass === 'BigUint64Array';
};


/***/ }),

/***/ 4901:
/***/ ((module) => {


// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 2796:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 4117:
/***/ ((module) => {


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 34:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 3925:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(34);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 6395:
/***/ ((module) => {


module.exports = false;


/***/ }),

/***/ 757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);
var isCallable = __webpack_require__(4901);
var isPrototypeOf = __webpack_require__(1625);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 507:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);

module.exports = function (record, fn, ITERATOR_INSTEAD_OF_RECORD) {
  var iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator;
  var next = record.next;
  var step, result;
  while (!(step = call(next, iterator)).done) {
    result = fn(step.value);
    if (result !== undefined) return result;
  }
};


/***/ }),

/***/ 2652:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var bind = __webpack_require__(6080);
var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var tryToString = __webpack_require__(6823);
var isArrayIteratorMethod = __webpack_require__(4209);
var lengthOfArrayLike = __webpack_require__(6198);
var isPrototypeOf = __webpack_require__(1625);
var getIterator = __webpack_require__(81);
var getIteratorMethod = __webpack_require__(851);
var iteratorClose = __webpack_require__(9539);

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ 9539:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var getMethod = __webpack_require__(5966);

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ 9462:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var create = __webpack_require__(2360);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIns = __webpack_require__(6279);
var wellKnownSymbol = __webpack_require__(8227);
var InternalStateModule = __webpack_require__(1181);
var getMethod = __webpack_require__(5966);
var IteratorPrototype = (__webpack_require__(7657).IteratorPrototype);
var createIterResultObject = __webpack_require__(2529);
var iteratorClose = __webpack_require__(9539);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ITERATOR_HELPER = 'IteratorHelper';
var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
var setInternalState = InternalStateModule.set;

var createIteratorProxyPrototype = function (IS_ITERATOR) {
  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);

  return defineBuiltIns(create(IteratorPrototype), {
    next: function next() {
      var state = getInternalState(this);
      // for simplification:
      //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
      //   for `%IteratorHelperPrototype%.next` - just a value
      if (IS_ITERATOR) return state.nextHandler();
      try {
        var result = state.done ? undefined : state.nextHandler();
        return createIterResultObject(result, state.done);
      } catch (error) {
        state.done = true;
        throw error;
      }
    },
    'return': function () {
      var state = getInternalState(this);
      var iterator = state.iterator;
      state.done = true;
      if (IS_ITERATOR) {
        var returnMethod = getMethod(iterator, 'return');
        return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
      }
      if (state.inner) try {
        iteratorClose(state.inner.iterator, 'normal');
      } catch (error) {
        return iteratorClose(iterator, 'throw', error);
      }
      iteratorClose(iterator, 'normal');
      return createIterResultObject(undefined, true);
    }
  });
};

var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
var IteratorHelperPrototype = createIteratorProxyPrototype(false);

createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');

module.exports = function (nextHandler, IS_ITERATOR) {
  var IteratorProxy = function Iterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };

  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

  return IteratorProxy;
};


/***/ }),

/***/ 713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);
var createIteratorProxy = __webpack_require__(9462);
var callWithSafeIterationClosing = __webpack_require__(6319);

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
});

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function map(mapper) {
  anObject(this);
  aCallable(mapper);
  return new IteratorProxy(getIteratorDirect(this), {
    mapper: mapper
  });
};


/***/ }),

/***/ 7657:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var create = __webpack_require__(2360);
var getPrototypeOf = __webpack_require__(2787);
var defineBuiltIn = __webpack_require__(6840);
var wellKnownSymbol = __webpack_require__(8227);
var IS_PURE = __webpack_require__(6395);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 6269:
/***/ ((module) => {


module.exports = {};


/***/ }),

/***/ 6198:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toLength = __webpack_require__(8014);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 283:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);
var hasOwn = __webpack_require__(9297);
var DESCRIPTORS = __webpack_require__(3724);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(350).CONFIGURABLE);
var inspectSource = __webpack_require__(3706);
var InternalStateModule = __webpack_require__(1181);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 741:
/***/ ((module) => {


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 6043:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aCallable = __webpack_require__(9306);

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toString = __webpack_require__(655);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 2360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(8551);
var definePropertiesModule = __webpack_require__(6801);
var enumBugKeys = __webpack_require__(8727);
var hiddenKeys = __webpack_require__(421);
var html = __webpack_require__(397);
var documentCreateElement = __webpack_require__(4055);
var sharedKey = __webpack_require__(6119);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 6801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var definePropertyModule = __webpack_require__(4913);
var anObject = __webpack_require__(8551);
var toIndexedObject = __webpack_require__(5397);
var objectKeys = __webpack_require__(1072);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 4913:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var IE8_DOM_DEFINE = __webpack_require__(5917);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var anObject = __webpack_require__(8551);
var toPropertyKey = __webpack_require__(6969);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 7347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var call = __webpack_require__(9565);
var propertyIsEnumerableModule = __webpack_require__(8773);
var createPropertyDescriptor = __webpack_require__(6980);
var toIndexedObject = __webpack_require__(5397);
var toPropertyKey = __webpack_require__(6969);
var hasOwn = __webpack_require__(9297);
var IE8_DOM_DEFINE = __webpack_require__(5917);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 8480:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 3717:
/***/ ((__unused_webpack_module, exports) => {


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 2787:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var hasOwn = __webpack_require__(9297);
var isCallable = __webpack_require__(4901);
var toObject = __webpack_require__(8981);
var sharedKey = __webpack_require__(6119);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(2211);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 1625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 1828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var hasOwn = __webpack_require__(9297);
var toIndexedObject = __webpack_require__(5397);
var indexOf = (__webpack_require__(9617).indexOf);
var hiddenKeys = __webpack_require__(421);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 1072:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 8773:
/***/ ((__unused_webpack_module, exports) => {


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 2967:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(6706);
var isObject = __webpack_require__(34);
var requireObjectCoercible = __webpack_require__(7750);
var aPossiblePrototype = __webpack_require__(3506);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 4270:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 5031:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);
var uncurryThis = __webpack_require__(9504);
var getOwnPropertyNamesModule = __webpack_require__(8480);
var getOwnPropertySymbolsModule = __webpack_require__(3717);
var anObject = __webpack_require__(8551);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 8235:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var hasOwn = __webpack_require__(9297);

var $SyntaxError = SyntaxError;
var $parseInt = parseInt;
var fromCharCode = String.fromCharCode;
var at = uncurryThis(''.charAt);
var slice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);

var codePoints = {
  '\\"': '"',
  '\\\\': '\\',
  '\\/': '/',
  '\\b': '\b',
  '\\f': '\f',
  '\\n': '\n',
  '\\r': '\r',
  '\\t': '\t'
};

var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
// eslint-disable-next-line regexp/no-control-character -- safe
var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;

module.exports = function (source, i) {
  var unterminated = true;
  var value = '';
  while (i < source.length) {
    var chr = at(source, i);
    if (chr === '\\') {
      var twoChars = slice(source, i, i + 2);
      if (hasOwn(codePoints, twoChars)) {
        value += codePoints[twoChars];
        i += 2;
      } else if (twoChars === '\\u') {
        i += 2;
        var fourHexDigits = slice(source, i, i + 4);
        if (!exec(IS_4_HEX_DIGITS, fourHexDigits)) throw new $SyntaxError('Bad Unicode escape at: ' + i);
        value += fromCharCode($parseInt(fourHexDigits, 16));
        i += 4;
      } else throw new $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
    } else if (chr === '"') {
      unterminated = false;
      i++;
      break;
    } else {
      if (exec(IS_C0_CONTROL_CODE, chr)) throw new $SyntaxError('Bad control character in string literal at: ' + i);
      value += chr;
      i++;
    }
  }
  if (unterminated) throw new $SyntaxError('Unterminated string at: ' + i);
  return { value: value, end: i };
};


/***/ }),

/***/ 1056:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var defineProperty = (__webpack_require__(4913).f);

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


/***/ }),

/***/ 7750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isNullOrUndefined = __webpack_require__(4117);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 9286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var SetHelpers = __webpack_require__(4402);
var iterate = __webpack_require__(8469);

var Set = SetHelpers.Set;
var add = SetHelpers.add;

module.exports = function (set) {
  var result = new Set();
  iterate(set, function (it) {
    add(result, it);
  });
  return result;
};


/***/ }),

/***/ 3440:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var SetHelpers = __webpack_require__(4402);
var clone = __webpack_require__(9286);
var size = __webpack_require__(5170);
var getSetRecord = __webpack_require__(3789);
var iterateSet = __webpack_require__(8469);
var iterateSimple = __webpack_require__(507);

var has = SetHelpers.has;
var remove = SetHelpers.remove;

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
module.exports = function difference(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  var result = clone(O);
  if (size(O) <= otherRec.size) iterateSet(O, function (e) {
    if (otherRec.includes(e)) remove(result, e);
  });
  else iterateSimple(otherRec.getIterator(), function (e) {
    if (has(O, e)) remove(result, e);
  });
  return result;
};


/***/ }),

/***/ 4402:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

// eslint-disable-next-line es/no-set -- safe
var SetPrototype = Set.prototype;

module.exports = {
  // eslint-disable-next-line es/no-set -- safe
  Set: Set,
  add: uncurryThis(SetPrototype.add),
  has: uncurryThis(SetPrototype.has),
  remove: uncurryThis(SetPrototype['delete']),
  proto: SetPrototype
};


/***/ }),

/***/ 8750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var SetHelpers = __webpack_require__(4402);
var size = __webpack_require__(5170);
var getSetRecord = __webpack_require__(3789);
var iterateSet = __webpack_require__(8469);
var iterateSimple = __webpack_require__(507);

var Set = SetHelpers.Set;
var add = SetHelpers.add;
var has = SetHelpers.has;

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
module.exports = function intersection(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  var result = new Set();

  if (size(O) > otherRec.size) {
    iterateSimple(otherRec.getIterator(), function (e) {
      if (has(O, e)) add(result, e);
    });
  } else {
    iterateSet(O, function (e) {
      if (otherRec.includes(e)) add(result, e);
    });
  }

  return result;
};


/***/ }),

/***/ 4449:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var has = (__webpack_require__(4402).has);
var size = __webpack_require__(5170);
var getSetRecord = __webpack_require__(3789);
var iterateSet = __webpack_require__(8469);
var iterateSimple = __webpack_require__(507);
var iteratorClose = __webpack_require__(9539);

// `Set.prototype.isDisjointFrom` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
module.exports = function isDisjointFrom(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) <= otherRec.size) return iterateSet(O, function (e) {
    if (otherRec.includes(e)) return false;
  }, true) !== false;
  var iterator = otherRec.getIterator();
  return iterateSimple(iterator, function (e) {
    if (has(O, e)) return iteratorClose(iterator, 'normal', false);
  }) !== false;
};


/***/ }),

/***/ 3838:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var size = __webpack_require__(5170);
var iterate = __webpack_require__(8469);
var getSetRecord = __webpack_require__(3789);

// `Set.prototype.isSubsetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
module.exports = function isSubsetOf(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) > otherRec.size) return false;
  return iterate(O, function (e) {
    if (!otherRec.includes(e)) return false;
  }, true) !== false;
};


/***/ }),

/***/ 8527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var has = (__webpack_require__(4402).has);
var size = __webpack_require__(5170);
var getSetRecord = __webpack_require__(3789);
var iterateSimple = __webpack_require__(507);
var iteratorClose = __webpack_require__(9539);

// `Set.prototype.isSupersetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
module.exports = function isSupersetOf(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) < otherRec.size) return false;
  var iterator = otherRec.getIterator();
  return iterateSimple(iterator, function (e) {
    if (!has(O, e)) return iteratorClose(iterator, 'normal', false);
  }) !== false;
};


/***/ }),

/***/ 8469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var iterateSimple = __webpack_require__(507);
var SetHelpers = __webpack_require__(4402);

var Set = SetHelpers.Set;
var SetPrototype = SetHelpers.proto;
var forEach = uncurryThis(SetPrototype.forEach);
var keys = uncurryThis(SetPrototype.keys);
var next = keys(new Set()).next;

module.exports = function (set, fn, interruptible) {
  return interruptible ? iterateSimple({ iterator: keys(set), next: next }, fn) : forEach(set, fn);
};


/***/ }),

/***/ 4916:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);

var createSetLike = function (size) {
  return {
    size: size,
    has: function () {
      return false;
    },
    keys: function () {
      return {
        next: function () {
          return { done: true };
        }
      };
    }
  };
};

module.exports = function (name) {
  var Set = getBuiltIn('Set');
  try {
    new Set()[name](createSetLike(0));
    try {
      // late spec change, early WebKit ~ Safari 17.0 beta implementation does not pass it
      // https://github.com/tc39/proposal-set-methods/pull/88
      new Set()[name](createSetLike(-1));
      return false;
    } catch (error2) {
      return true;
    }
  } catch (error) {
    return false;
  }
};


/***/ }),

/***/ 5170:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThisAccessor = __webpack_require__(6706);
var SetHelpers = __webpack_require__(4402);

module.exports = uncurryThisAccessor(SetHelpers.proto, 'size', 'get') || function (set) {
  return set.size;
};


/***/ }),

/***/ 3650:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var SetHelpers = __webpack_require__(4402);
var clone = __webpack_require__(9286);
var getSetRecord = __webpack_require__(3789);
var iterateSimple = __webpack_require__(507);

var add = SetHelpers.add;
var has = SetHelpers.has;
var remove = SetHelpers.remove;

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
module.exports = function symmetricDifference(other) {
  var O = aSet(this);
  var keysIter = getSetRecord(other).getIterator();
  var result = clone(O);
  iterateSimple(keysIter, function (e) {
    if (has(O, e)) remove(result, e);
    else add(result, e);
  });
  return result;
};


/***/ }),

/***/ 4204:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aSet = __webpack_require__(7080);
var add = (__webpack_require__(4402).add);
var clone = __webpack_require__(9286);
var getSetRecord = __webpack_require__(3789);
var iterateSimple = __webpack_require__(507);

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
module.exports = function union(other) {
  var O = aSet(this);
  var keysIter = getSetRecord(other).getIterator();
  var result = clone(O);
  iterateSimple(keysIter, function (it) {
    add(result, it);
  });
  return result;
};


/***/ }),

/***/ 6119:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var shared = __webpack_require__(5745);
var uid = __webpack_require__(3392);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 7629:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var IS_PURE = __webpack_require__(6395);
var globalThis = __webpack_require__(4475);
var defineGlobalProperty = __webpack_require__(9433);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.37.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.37.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 5745:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var store = __webpack_require__(7629);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 1548:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var fails = __webpack_require__(9039);
var V8 = __webpack_require__(7388);
var IS_BROWSER = __webpack_require__(7290);
var IS_DENO = __webpack_require__(516);
var IS_NODE = __webpack_require__(9088);

var structuredClone = global.structuredClone;

module.exports = !!structuredClone && !fails(function () {
  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if ((IS_DENO && V8 > 92) || (IS_NODE && V8 > 94) || (IS_BROWSER && V8 > 97)) return false;
  var buffer = new ArrayBuffer(8);
  var clone = structuredClone(buffer, { transfer: [buffer] });
  return buffer.byteLength !== 0 || clone.byteLength !== 8;
});


/***/ }),

/***/ 4495:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7388);
var fails = __webpack_require__(9039);
var global = __webpack_require__(4475);

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 5610:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(1291);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5854:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toPrimitive = __webpack_require__(2777);

var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw new $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
};


/***/ }),

/***/ 7696:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(1291);
var toLength = __webpack_require__(8014);

var $RangeError = RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity(it);
  var length = toLength(number);
  if (number !== length) throw new $RangeError('Wrong length or index');
  return length;
};


/***/ }),

/***/ 5397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(7055);
var requireObjectCoercible = __webpack_require__(7750);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 1291:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var trunc = __webpack_require__(741);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 8014:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(1291);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 8981:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var requireObjectCoercible = __webpack_require__(7750);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 8229:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toPositiveInteger = __webpack_require__(9590);

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw new $RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ 9590:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(1291);

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw new $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ 2777:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var isObject = __webpack_require__(34);
var isSymbol = __webpack_require__(757);
var getMethod = __webpack_require__(5966);
var ordinaryToPrimitive = __webpack_require__(4270);
var wellKnownSymbol = __webpack_require__(8227);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 6969:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toPrimitive = __webpack_require__(2777);
var isSymbol = __webpack_require__(757);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 2140:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(6955);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 9714:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var IS_NODE = __webpack_require__(9088);

module.exports = function (name) {
  try {
    // eslint-disable-next-line no-new-func -- safe
    if (IS_NODE) return Function('return require("' + name + '")')();
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 6823:
/***/ ((module) => {


var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 3392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 7040:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(4495);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 8686:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 2812:
/***/ ((module) => {


var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ 8622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var isCallable = __webpack_require__(4901);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 8227:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var shared = __webpack_require__(5745);
var hasOwn = __webpack_require__(9297);
var uid = __webpack_require__(3392);
var NATIVE_SYMBOL = __webpack_require__(4495);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 4601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);
var hasOwn = __webpack_require__(9297);
var createNonEnumerableProperty = __webpack_require__(6699);
var isPrototypeOf = __webpack_require__(1625);
var setPrototypeOf = __webpack_require__(2967);
var copyConstructorProperties = __webpack_require__(7740);
var proxyAccessor = __webpack_require__(1056);
var inheritIfRequired = __webpack_require__(3167);
var normalizeStringArgument = __webpack_require__(2603);
var installErrorCause = __webpack_require__(7584);
var installErrorStack = __webpack_require__(747);
var DESCRIPTORS = __webpack_require__(3724);
var IS_PURE = __webpack_require__(6395);

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    installErrorStack(result, WrappedError, result.stack, 2);
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


/***/ }),

/***/ 6573:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var defineBuiltInAccessor = __webpack_require__(2106);
var isDetached = __webpack_require__(3238);

var ArrayBufferPrototype = ArrayBuffer.prototype;

if (DESCRIPTORS && !('detached' in ArrayBufferPrototype)) {
  defineBuiltInAccessor(ArrayBufferPrototype, 'detached', {
    configurable: true,
    get: function detached() {
      return isDetached(this);
    }
  });
}


/***/ }),

/***/ 7936:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var $transfer = __webpack_require__(5636);

// `ArrayBuffer.prototype.transferToFixedLength` method
// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfertofixedlength
if ($transfer) $({ target: 'ArrayBuffer', proto: true }, {
  transferToFixedLength: function transferToFixedLength() {
    return $transfer(this, arguments.length ? arguments[0] : undefined, false);
  }
});


/***/ }),

/***/ 8100:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var $transfer = __webpack_require__(5636);

// `ArrayBuffer.prototype.transfer` method
// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfer
if ($transfer) $({ target: 'ArrayBuffer', proto: true }, {
  transfer: function transfer() {
    return $transfer(this, arguments.length ? arguments[0] : undefined, true);
  }
});


/***/ }),

/***/ 8107:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var toObject = __webpack_require__(8981);
var lengthOfArrayLike = __webpack_require__(6198);
var toIntegerOrInfinity = __webpack_require__(1291);
var addToUnscopables = __webpack_require__(6469);

// `Array.prototype.at` method
// https://tc39.es/ecma262/#sec-array.prototype.at
$({ target: 'Array', proto: true }, {
  at: function at(index) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : O[k];
  }
});

addToUnscopables('at');


/***/ }),

/***/ 4114:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var toObject = __webpack_require__(8981);
var lengthOfArrayLike = __webpack_require__(6198);
var setArrayLength = __webpack_require__(4527);
var doesNotExceedSafeInteger = __webpack_require__(6837);
var fails = __webpack_require__(9039);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 6280:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__(6518);
var global = __webpack_require__(4475);
var apply = __webpack_require__(8745);
var wrapErrorConstructorWithCause = __webpack_require__(4601);

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = global[WEB_ASSEMBLY];

// eslint-disable-next-line es/no-error-cause -- feature detection
var FORCED = new Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  }
};

// https://tc39.es/ecma262/#sec-nativeerror
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


/***/ }),

/***/ 4628:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var newPromiseCapabilityModule = __webpack_require__(6043);

// `Promise.withResolvers` method
// https://github.com/tc39/proposal-promise-with-resolvers
$({ target: 'Promise', stat: true }, {
  withResolvers: function withResolvers() {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    return {
      promise: promiseCapability.promise,
      resolve: promiseCapability.resolve,
      reject: promiseCapability.reject
    };
  }
});


/***/ }),

/***/ 7642:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var difference = __webpack_require__(3440);
var setMethodAcceptSetLike = __webpack_require__(4916);

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('difference') }, {
  difference: difference
});


/***/ }),

/***/ 8004:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var fails = __webpack_require__(9039);
var intersection = __webpack_require__(8750);
var setMethodAcceptSetLike = __webpack_require__(4916);

var INCORRECT = !setMethodAcceptSetLike('intersection') || fails(function () {
  // eslint-disable-next-line es/no-array-from, es/no-set -- testing
  return String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2])))) !== '3,2';
});

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
  intersection: intersection
});


/***/ }),

/***/ 3853:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var isDisjointFrom = __webpack_require__(4449);
var setMethodAcceptSetLike = __webpack_require__(4916);

// `Set.prototype.isDisjointFrom` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('isDisjointFrom') }, {
  isDisjointFrom: isDisjointFrom
});


/***/ }),

/***/ 5876:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var isSubsetOf = __webpack_require__(3838);
var setMethodAcceptSetLike = __webpack_require__(4916);

// `Set.prototype.isSubsetOf` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('isSubsetOf') }, {
  isSubsetOf: isSubsetOf
});


/***/ }),

/***/ 2475:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var isSupersetOf = __webpack_require__(8527);
var setMethodAcceptSetLike = __webpack_require__(4916);

// `Set.prototype.isSupersetOf` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('isSupersetOf') }, {
  isSupersetOf: isSupersetOf
});


/***/ }),

/***/ 5024:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var symmetricDifference = __webpack_require__(3650);
var setMethodAcceptSetLike = __webpack_require__(4916);

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('symmetricDifference') }, {
  symmetricDifference: symmetricDifference
});


/***/ }),

/***/ 1698:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var union = __webpack_require__(4204);
var setMethodAcceptSetLike = __webpack_require__(4916);

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
$({ target: 'Set', proto: true, real: true, forced: !setMethodAcceptSetLike('union') }, {
  union: union
});


/***/ }),

/***/ 7357:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var uncurryThis = __webpack_require__(9504);
var requireObjectCoercible = __webpack_require__(7750);
var toIntegerOrInfinity = __webpack_require__(1291);
var toString = __webpack_require__(655);
var fails = __webpack_require__(9039);

var charAt = uncurryThis(''.charAt);

var FORCED = fails(function () {
  // eslint-disable-next-line es/no-array-string-prototype-at -- safe
  return '𠮷'.at(-2) !== '\uD842';
});

// `String.prototype.at` method
// https://tc39.es/ecma262/#sec-string.prototype.at
$({ target: 'String', proto: true, forced: FORCED }, {
  at: function at(index) {
    var S = toString(requireObjectCoercible(this));
    var len = S.length;
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : charAt(S, k);
  }
});


/***/ }),

/***/ 8140:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var ArrayBufferViewCore = __webpack_require__(4644);
var lengthOfArrayLike = __webpack_require__(6198);
var toIntegerOrInfinity = __webpack_require__(1291);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.at
exportTypedArrayMethod('at', function at(index) {
  var O = aTypedArray(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});


/***/ }),

/***/ 5044:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var ArrayBufferViewCore = __webpack_require__(4644);
var $fill = __webpack_require__(4373);
var toBigInt = __webpack_require__(5854);
var classof = __webpack_require__(6955);
var call = __webpack_require__(9565);
var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var slice = uncurryThis(''.slice);

// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
var CONVERSION_BUG = fails(function () {
  var count = 0;
  // eslint-disable-next-line es/no-typed-arrays -- safe
  new Int8Array(2).fill({ valueOf: function () { return count++; } });
  return count !== 1;
});

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  var length = arguments.length;
  aTypedArray(this);
  var actualValue = slice(classof(this), 0, 3) === 'Big' ? toBigInt(value) : +value;
  return call($fill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
}, CONVERSION_BUG);


/***/ }),

/***/ 1134:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var ArrayBufferViewCore = __webpack_require__(4644);
var $findLastIndex = (__webpack_require__(3839).findLastIndex);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findlastindex
exportTypedArrayMethod('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 1903:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var ArrayBufferViewCore = __webpack_require__(4644);
var $findLast = (__webpack_require__(3839).findLast);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findlast
exportTypedArrayMethod('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ 8845:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var call = __webpack_require__(9565);
var ArrayBufferViewCore = __webpack_require__(4644);
var lengthOfArrayLike = __webpack_require__(6198);
var toOffset = __webpack_require__(8229);
var toIndexedObject = __webpack_require__(8981);
var fails = __webpack_require__(9039);

var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw new RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ }),

/***/ 373:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var global = __webpack_require__(4475);
var uncurryThis = __webpack_require__(7476);
var fails = __webpack_require__(9039);
var aCallable = __webpack_require__(9306);
var internalSort = __webpack_require__(4488);
var ArrayBufferViewCore = __webpack_require__(4644);
var FF = __webpack_require__(8834);
var IE_OR_EDGE = __webpack_require__(3202);
var V8 = __webpack_require__(7388);
var WEBKIT = __webpack_require__(9160);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = global.Uint16Array;
var nativeSort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
  nativeSort(new Uint16Array(2), null);
}) && fails(function () {
  nativeSort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  nativeSort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return nativeSort(this, comparefn);

  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);


/***/ }),

/***/ 7467:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var arrayToReversed = __webpack_require__(7628);
var ArrayBufferViewCore = __webpack_require__(4644);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.toreversed
exportTypedArrayMethod('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray(this), getTypedArrayConstructor(this));
});


/***/ }),

/***/ 4732:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var ArrayBufferViewCore = __webpack_require__(4644);
var uncurryThis = __webpack_require__(9504);
var aCallable = __webpack_require__(9306);
var arrayFromConstructorAndList = __webpack_require__(5370);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var sort = uncurryThis(ArrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tosorted
exportTypedArrayMethod('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor(O), O);
  return sort(A, compareFn);
});


/***/ }),

/***/ 9577:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var arrayWith = __webpack_require__(9928);
var ArrayBufferViewCore = __webpack_require__(4644);
var isBigIntArray = __webpack_require__(1108);
var toIntegerOrInfinity = __webpack_require__(1291);
var toBigInt = __webpack_require__(5854);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays, es/no-array-prototype-with -- required for testing
    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', { 'with': function (index, value) {
  var O = aTypedArray(this);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
} }['with'], !PROPER_ORDER);


/***/ }),

/***/ 8992:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var global = __webpack_require__(4475);
var anInstance = __webpack_require__(679);
var anObject = __webpack_require__(8551);
var isCallable = __webpack_require__(4901);
var getPrototypeOf = __webpack_require__(2787);
var defineBuiltInAccessor = __webpack_require__(2106);
var createProperty = __webpack_require__(2278);
var fails = __webpack_require__(9039);
var hasOwn = __webpack_require__(9297);
var wellKnownSymbol = __webpack_require__(8227);
var IteratorPrototype = (__webpack_require__(7657).IteratorPrototype);
var DESCRIPTORS = __webpack_require__(3724);
var IS_PURE = __webpack_require__(6395);

var CONSTRUCTOR = 'constructor';
var ITERATOR = 'Iterator';
var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var $TypeError = TypeError;
var NativeIterator = global[ITERATOR];

// FF56- have non-standard global helper `Iterator`
var FORCED = IS_PURE
  || !isCallable(NativeIterator)
  || NativeIterator.prototype !== IteratorPrototype
  // FF44- non-standard `Iterator` passes previous tests
  || !fails(function () { NativeIterator({}); });

var IteratorConstructor = function Iterator() {
  anInstance(this, IteratorPrototype);
  if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable');
};

var defineIteratorPrototypeAccessor = function (key, value) {
  if (DESCRIPTORS) {
    defineBuiltInAccessor(IteratorPrototype, key, {
      configurable: true,
      get: function () {
        return value;
      },
      set: function (replacement) {
        anObject(this);
        if (this === IteratorPrototype) throw new $TypeError("You can't redefine this property");
        if (hasOwn(this, key)) this[key] = replacement;
        else createProperty(this, key, replacement);
      }
    });
  } else IteratorPrototype[key] = value;
};

if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR);

if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
  defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
}

IteratorConstructor.prototype = IteratorPrototype;

// `Iterator` constructor
// https://github.com/tc39/proposal-iterator-helpers
$({ global: true, constructor: true, forced: FORCED }, {
  Iterator: IteratorConstructor
});


/***/ }),

/***/ 3215:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var iterate = __webpack_require__(2652);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);

// `Iterator.prototype.every` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  every: function every(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return !iterate(record, function (value, stop) {
      if (!predicate(value, counter++)) return stop();
    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
  }
});


/***/ }),

/***/ 4520:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);
var createIteratorProxy = __webpack_require__(9462);
var callWithSafeIterationClosing = __webpack_require__(6319);
var IS_PURE = __webpack_require__(6395);

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var predicate = this.predicate;
  var next = this.next;
  var result, done, value;
  while (true) {
    result = anObject(call(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
    value = result.value;
    if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value;
  }
});

// `Iterator.prototype.filter` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  filter: function filter(predicate) {
    anObject(this);
    aCallable(predicate);
    return new IteratorProxy(getIteratorDirect(this), {
      predicate: predicate
    });
  }
});


/***/ }),

/***/ 670:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);
var getIteratorFlattenable = __webpack_require__(8646);
var createIteratorProxy = __webpack_require__(9462);
var iteratorClose = __webpack_require__(9539);
var IS_PURE = __webpack_require__(6395);

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var mapper = this.mapper;
  var result, inner;

  while (true) {
    if (inner = this.inner) try {
      result = anObject(call(inner.next, inner.iterator));
      if (!result.done) return result.value;
      this.inner = null;
    } catch (error) { iteratorClose(iterator, 'throw', error); }

    result = anObject(call(this.next, iterator));

    if (this.done = !!result.done) return;

    try {
      this.inner = getIteratorFlattenable(mapper(result.value, this.counter++), false);
    } catch (error) { iteratorClose(iterator, 'throw', error); }
  }
});

// `Iterator.prototype.flatMap` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  flatMap: function flatMap(mapper) {
    anObject(this);
    aCallable(mapper);
    return new IteratorProxy(getIteratorDirect(this), {
      mapper: mapper,
      inner: null
    });
  }
});


/***/ }),

/***/ 3949:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var iterate = __webpack_require__(2652);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);

// `Iterator.prototype.forEach` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    anObject(this);
    aCallable(fn);
    var record = getIteratorDirect(this);
    var counter = 0;
    iterate(record, function (value) {
      fn(value, counter++);
    }, { IS_RECORD: true });
  }
});


/***/ }),

/***/ 1454:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var map = __webpack_require__(713);
var IS_PURE = __webpack_require__(6395);

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  map: map
});


/***/ }),

/***/ 7550:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var iterate = __webpack_require__(2652);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);

// `Iterator.prototype.some` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  some: function some(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop();
    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
  }
});


/***/ }),

/***/ 8335:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var DESCRIPTORS = __webpack_require__(3724);
var global = __webpack_require__(4475);
var getBuiltIn = __webpack_require__(7751);
var uncurryThis = __webpack_require__(9504);
var call = __webpack_require__(9565);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var isArray = __webpack_require__(4376);
var hasOwn = __webpack_require__(9297);
var toString = __webpack_require__(655);
var lengthOfArrayLike = __webpack_require__(6198);
var createProperty = __webpack_require__(2278);
var fails = __webpack_require__(9039);
var parseJSONString = __webpack_require__(8235);
var NATIVE_SYMBOL = __webpack_require__(4495);

var JSON = global.JSON;
var Number = global.Number;
var SyntaxError = global.SyntaxError;
var nativeParse = JSON && JSON.parse;
var enumerableOwnProperties = getBuiltIn('Object', 'keys');
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var at = uncurryThis(''.charAt);
var slice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);
var push = uncurryThis([].push);

var IS_DIGIT = /^\d$/;
var IS_NON_ZERO_DIGIT = /^[1-9]$/;
var IS_NUMBER_START = /^(?:-|\d)$/;
var IS_WHITESPACE = /^[\t\n\r ]$/;

var PRIMITIVE = 0;
var OBJECT = 1;

var $parse = function (source, reviver) {
  source = toString(source);
  var context = new Context(source, 0, '');
  var root = context.parse();
  var value = root.value;
  var endIndex = context.skip(IS_WHITESPACE, root.end);
  if (endIndex < source.length) {
    throw new SyntaxError('Unexpected extra character: "' + at(source, endIndex) + '" after the parsed data at: ' + endIndex);
  }
  return isCallable(reviver) ? internalize({ '': value }, '', reviver, root) : value;
};

var internalize = function (holder, name, reviver, node) {
  var val = holder[name];
  var unmodified = node && val === node.value;
  var context = unmodified && typeof node.source == 'string' ? { source: node.source } : {};
  var elementRecordsLen, keys, len, i, P;
  if (isObject(val)) {
    var nodeIsArray = isArray(val);
    var nodes = unmodified ? node.nodes : nodeIsArray ? [] : {};
    if (nodeIsArray) {
      elementRecordsLen = nodes.length;
      len = lengthOfArrayLike(val);
      for (i = 0; i < len; i++) {
        internalizeProperty(val, i, internalize(val, '' + i, reviver, i < elementRecordsLen ? nodes[i] : undefined));
      }
    } else {
      keys = enumerableOwnProperties(val);
      len = lengthOfArrayLike(keys);
      for (i = 0; i < len; i++) {
        P = keys[i];
        internalizeProperty(val, P, internalize(val, P, reviver, hasOwn(nodes, P) ? nodes[P] : undefined));
      }
    }
  }
  return call(reviver, holder, name, val, context);
};

var internalizeProperty = function (object, key, value) {
  if (DESCRIPTORS) {
    var descriptor = getOwnPropertyDescriptor(object, key);
    if (descriptor && !descriptor.configurable) return;
  }
  if (value === undefined) delete object[key];
  else createProperty(object, key, value);
};

var Node = function (value, end, source, nodes) {
  this.value = value;
  this.end = end;
  this.source = source;
  this.nodes = nodes;
};

var Context = function (source, index) {
  this.source = source;
  this.index = index;
};

// https://www.json.org/json-en.html
Context.prototype = {
  fork: function (nextIndex) {
    return new Context(this.source, nextIndex);
  },
  parse: function () {
    var source = this.source;
    var i = this.skip(IS_WHITESPACE, this.index);
    var fork = this.fork(i);
    var chr = at(source, i);
    if (exec(IS_NUMBER_START, chr)) return fork.number();
    switch (chr) {
      case '{':
        return fork.object();
      case '[':
        return fork.array();
      case '"':
        return fork.string();
      case 't':
        return fork.keyword(true);
      case 'f':
        return fork.keyword(false);
      case 'n':
        return fork.keyword(null);
    } throw new SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
  },
  node: function (type, value, start, end, nodes) {
    return new Node(value, end, type ? null : slice(this.source, start, end), nodes);
  },
  object: function () {
    var source = this.source;
    var i = this.index + 1;
    var expectKeypair = false;
    var object = {};
    var nodes = {};
    while (i < source.length) {
      i = this.until(['"', '}'], i);
      if (at(source, i) === '}' && !expectKeypair) {
        i++;
        break;
      }
      // Parsing the key
      var result = this.fork(i).string();
      var key = result.value;
      i = result.end;
      i = this.until([':'], i) + 1;
      // Parsing value
      i = this.skip(IS_WHITESPACE, i);
      result = this.fork(i).parse();
      createProperty(nodes, key, result);
      createProperty(object, key, result.value);
      i = this.until([',', '}'], result.end);
      var chr = at(source, i);
      if (chr === ',') {
        expectKeypair = true;
        i++;
      } else if (chr === '}') {
        i++;
        break;
      }
    }
    return this.node(OBJECT, object, this.index, i, nodes);
  },
  array: function () {
    var source = this.source;
    var i = this.index + 1;
    var expectElement = false;
    var array = [];
    var nodes = [];
    while (i < source.length) {
      i = this.skip(IS_WHITESPACE, i);
      if (at(source, i) === ']' && !expectElement) {
        i++;
        break;
      }
      var result = this.fork(i).parse();
      push(nodes, result);
      push(array, result.value);
      i = this.until([',', ']'], result.end);
      if (at(source, i) === ',') {
        expectElement = true;
        i++;
      } else if (at(source, i) === ']') {
        i++;
        break;
      }
    }
    return this.node(OBJECT, array, this.index, i, nodes);
  },
  string: function () {
    var index = this.index;
    var parsed = parseJSONString(this.source, this.index + 1);
    return this.node(PRIMITIVE, parsed.value, index, parsed.end);
  },
  number: function () {
    var source = this.source;
    var startIndex = this.index;
    var i = startIndex;
    if (at(source, i) === '-') i++;
    if (at(source, i) === '0') i++;
    else if (exec(IS_NON_ZERO_DIGIT, at(source, i))) i = this.skip(IS_DIGIT, ++i);
    else throw new SyntaxError('Failed to parse number at: ' + i);
    if (at(source, i) === '.') i = this.skip(IS_DIGIT, ++i);
    if (at(source, i) === 'e' || at(source, i) === 'E') {
      i++;
      if (at(source, i) === '+' || at(source, i) === '-') i++;
      var exponentStartIndex = i;
      i = this.skip(IS_DIGIT, i);
      if (exponentStartIndex === i) throw new SyntaxError("Failed to parse number's exponent value at: " + i);
    }
    return this.node(PRIMITIVE, Number(slice(source, startIndex, i)), startIndex, i);
  },
  keyword: function (value) {
    var keyword = '' + value;
    var index = this.index;
    var endIndex = index + keyword.length;
    if (slice(this.source, index, endIndex) !== keyword) throw new SyntaxError('Failed to parse value at: ' + index);
    return this.node(PRIMITIVE, value, index, endIndex);
  },
  skip: function (regex, i) {
    var source = this.source;
    for (; i < source.length; i++) if (!exec(regex, at(source, i))) break;
    return i;
  },
  until: function (array, i) {
    i = this.skip(IS_WHITESPACE, i);
    var chr = at(this.source, i);
    for (var j = 0; j < array.length; j++) if (array[j] === chr) return i;
    throw new SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
  }
};

var NO_SOURCE_SUPPORT = fails(function () {
  var unsafeInt = '9007199254740993';
  var source;
  nativeParse(unsafeInt, function (key, value, context) {
    source = context.source;
  });
  return source !== unsafeInt;
});

var PROPER_BASE_PARSE = NATIVE_SYMBOL && !fails(function () {
  // Safari 9 bug
  return 1 / nativeParse('-0 \t') !== -Infinity;
});

// `JSON.parse` method
// https://tc39.es/ecma262/#sec-json.parse
// https://github.com/tc39/proposal-json-parse-with-source
$({ target: 'JSON', stat: true, forced: NO_SOURCE_SUPPORT }, {
  parse: function parse(text, reviver) {
    return PROPER_BASE_PARSE && !isCallable(reviver) ? nativeParse(text) : $parse(text, reviver);
  }
});


/***/ }),

/***/ 3375:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(7642);


/***/ }),

/***/ 9225:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(8004);


/***/ }),

/***/ 3972:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(3853);


/***/ }),

/***/ 9209:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(5876);


/***/ }),

/***/ 5714:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(2475);


/***/ }),

/***/ 7561:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(5024);


/***/ }),

/***/ 6197:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(1698);


/***/ }),

/***/ 4979:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var global = __webpack_require__(4475);
var getBuiltIn = __webpack_require__(7751);
var createPropertyDescriptor = __webpack_require__(6980);
var defineProperty = (__webpack_require__(4913).f);
var hasOwn = __webpack_require__(9297);
var anInstance = __webpack_require__(679);
var inheritIfRequired = __webpack_require__(3167);
var normalizeStringArgument = __webpack_require__(2603);
var DOMExceptionConstants = __webpack_require__(5002);
var clearErrorStack = __webpack_require__(6193);
var DESCRIPTORS = __webpack_require__(3724);
var IS_PURE = __webpack_require__(6395);

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = new Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in new Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, constructor: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ }),

/***/ 3611:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var global = __webpack_require__(4475);
var defineBuiltInAccessor = __webpack_require__(2106);
var DESCRIPTORS = __webpack_require__(3724);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var INCORRECT_VALUE = global.self !== global;

// `self` getter
// https://html.spec.whatwg.org/multipage/window-object.html#dom-self
try {
  if (DESCRIPTORS) {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var descriptor = Object.getOwnPropertyDescriptor(global, 'self');
    // some engines have `self`, but with incorrect descriptor
    // https://github.com/denoland/deno/issues/15765
    if (INCORRECT_VALUE || !descriptor || !descriptor.get || !descriptor.enumerable) {
      defineBuiltInAccessor(global, 'self', {
        get: function self() {
          return global;
        },
        set: function self(value) {
          if (this !== global) throw new $TypeError('Illegal invocation');
          defineProperty(global, 'self', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
          });
        },
        configurable: true,
        enumerable: true
      });
    }
  } else $({ global: true, simple: true, forced: INCORRECT_VALUE }, {
    self: global
  });
} catch (error) { /* empty */ }


/***/ }),

/***/ 4603:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var defineBuiltIn = __webpack_require__(6840);
var uncurryThis = __webpack_require__(9504);
var toString = __webpack_require__(655);
var validateArgumentsLength = __webpack_require__(2812);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var append = uncurryThis(URLSearchParamsPrototype.append);
var $delete = uncurryThis(URLSearchParamsPrototype['delete']);
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);
var push = uncurryThis([].push);
var params = new $URLSearchParams('a=1&a=2&b=3');

params['delete']('a', 1);
// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
params['delete']('b', undefined);

if (params + '' !== 'a=2') {
  defineBuiltIn(URLSearchParamsPrototype, 'delete', function (name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $delete(this, name);
    var entries = [];
    forEach(this, function (v, k) { // also validates `this`
      push(entries, { key: k, value: v });
    });
    validateArgumentsLength(length, 1);
    var key = toString(name);
    var value = toString($value);
    var index = 0;
    var dindex = 0;
    var found = false;
    var entriesLength = entries.length;
    var entry;
    while (index < entriesLength) {
      entry = entries[index++];
      if (found || entry.key === key) {
        found = true;
        $delete(this, entry.key);
      } else dindex++;
    }
    while (dindex < entriesLength) {
      entry = entries[dindex++];
      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
    }
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 7566:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var defineBuiltIn = __webpack_require__(6840);
var uncurryThis = __webpack_require__(9504);
var toString = __webpack_require__(655);
var validateArgumentsLength = __webpack_require__(2812);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var getAll = uncurryThis(URLSearchParamsPrototype.getAll);
var $has = uncurryThis(URLSearchParamsPrototype.has);
var params = new $URLSearchParams('a=1');

// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
if (params.has('a', 2) || !params.has('a', undefined)) {
  defineBuiltIn(URLSearchParamsPrototype, 'has', function has(name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $has(this, name);
    var values = getAll(this, name); // also validates `this`
    validateArgumentsLength(length, 1);
    var value = toString($value);
    var index = 0;
    while (index < values.length) {
      if (values[index++] === value) return true;
    } return false;
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 8721:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var uncurryThis = __webpack_require__(9504);
var defineBuiltInAccessor = __webpack_require__(2106);

var URLSearchParamsPrototype = URLSearchParams.prototype;
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);

// `URLSearchParams.prototype.size` getter
// https://github.com/whatwg/url/pull/734
if (DESCRIPTORS && !('size' in URLSearchParamsPrototype)) {
  defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
    get: function size() {
      var count = 0;
      forEach(this, function () { count++; });
      return count;
    },
    configurable: true,
    enumerable: true
  });
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = globalThis.pdfjsLib = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  AbortException: () => (/* reexport */ AbortException),
  AnnotationEditorLayer: () => (/* reexport */ AnnotationEditorLayer),
  AnnotationEditorParamsType: () => (/* reexport */ AnnotationEditorParamsType),
  AnnotationEditorType: () => (/* reexport */ AnnotationEditorType),
  AnnotationEditorUIManager: () => (/* reexport */ AnnotationEditorUIManager),
  AnnotationLayer: () => (/* reexport */ AnnotationLayer),
  AnnotationMode: () => (/* reexport */ AnnotationMode),
  CMapCompressionType: () => (/* reexport */ CMapCompressionType),
  ColorPicker: () => (/* reexport */ ColorPicker),
  DOMSVGFactory: () => (/* reexport */ DOMSVGFactory),
  DrawLayer: () => (/* reexport */ DrawLayer),
  FeatureTest: () => (/* reexport */ util_FeatureTest),
  GlobalWorkerOptions: () => (/* reexport */ GlobalWorkerOptions),
  ImageKind: () => (/* reexport */ util_ImageKind),
  InvalidPDFException: () => (/* reexport */ InvalidPDFException),
  MissingPDFException: () => (/* reexport */ MissingPDFException),
  OPS: () => (/* reexport */ OPS),
  Outliner: () => (/* reexport */ Outliner),
  PDFDataRangeTransport: () => (/* reexport */ PDFDataRangeTransport),
  PDFDateString: () => (/* reexport */ PDFDateString),
  PDFWorker: () => (/* reexport */ PDFWorker),
  PasswordResponses: () => (/* reexport */ PasswordResponses),
  PermissionFlag: () => (/* reexport */ PermissionFlag),
  PixelsPerInch: () => (/* reexport */ PixelsPerInch),
  RenderingCancelledException: () => (/* reexport */ RenderingCancelledException),
  TextLayer: () => (/* reexport */ TextLayer),
  UnexpectedResponseException: () => (/* reexport */ UnexpectedResponseException),
  Util: () => (/* reexport */ Util),
  VerbosityLevel: () => (/* reexport */ VerbosityLevel),
  XfaLayer: () => (/* reexport */ XfaLayer),
  build: () => (/* reexport */ build),
  createValidAbsoluteUrl: () => (/* reexport */ createValidAbsoluteUrl),
  fetchData: () => (/* reexport */ fetchData),
  getDocument: () => (/* reexport */ getDocument),
  getFilenameFromUrl: () => (/* reexport */ getFilenameFromUrl),
  getPdfFilenameFromUrl: () => (/* reexport */ getPdfFilenameFromUrl),
  getXfaPageViewport: () => (/* reexport */ getXfaPageViewport),
  isDataScheme: () => (/* reexport */ isDataScheme),
  isPdfFile: () => (/* reexport */ isPdfFile),
  noContextMenu: () => (/* reexport */ noContextMenu),
  normalizeUnicode: () => (/* reexport */ normalizeUnicode),
  renderTextLayer: () => (/* reexport */ renderTextLayer),
  setLayerDimensions: () => (/* reexport */ setLayerDimensions),
  shadow: () => (/* reexport */ shadow),
  updateTextLayer: () => (/* reexport */ updateTextLayer),
  version: () => (/* reexport */ version)
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__(6280);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(4114);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.detached.js
var es_array_buffer_detached = __webpack_require__(6573);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.transfer.js
var es_array_buffer_transfer = __webpack_require__(8100);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array-buffer.transfer-to-fixed-length.js
var es_array_buffer_transfer_to_fixed_length = __webpack_require__(7936);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.at.js
var es_typed_array_at = __webpack_require__(8140);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.fill.js
var es_typed_array_fill = __webpack_require__(5044);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-last.js
var es_typed_array_find_last = __webpack_require__(1903);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-last-index.js
var es_typed_array_find_last_index = __webpack_require__(1134);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__(8845);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.sort.js
var es_typed_array_sort = __webpack_require__(373);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.to-reversed.js
var es_typed_array_to_reversed = __webpack_require__(7467);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.to-sorted.js
var es_typed_array_to_sorted = __webpack_require__(4732);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.with.js
var es_typed_array_with = __webpack_require__(9577);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.self.js
var web_self = __webpack_require__(3611);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(4603);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(7566);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(8721);
;// CONCATENATED MODULE: ./src/shared/util.js
var _Util;function _assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const isNodeJS=typeof process==="object"&&process+""==="[object process]"&&!process.versions.nw&&!(process.versions.electron&&process.type&&process.type!=="browser");const IDENTITY_MATRIX=[1,0,0,1,0,0];const FONT_IDENTITY_MATRIX=[0.001,0,0,0.001,0,0];const MAX_IMAGE_SIZE_TO_CACHE=10e6;const LINE_FACTOR=1.35;const LINE_DESCENT_FACTOR=0.35;const BASELINE_FACTOR=LINE_DESCENT_FACTOR/LINE_FACTOR;const RenderingIntentFlag={ANY:0x01,DISPLAY:0x02,PRINT:0x04,SAVE:0x08,ANNOTATIONS_FORMS:0x10,ANNOTATIONS_STORAGE:0x20,ANNOTATIONS_DISABLE:0x40,OPLIST:0x100};const AnnotationMode={DISABLE:0,ENABLE:1,ENABLE_FORMS:2,ENABLE_STORAGE:3};const AnnotationEditorPrefix="pdfjs_internal_editor_";const AnnotationEditorType={DISABLE:-1,NONE:0,FREETEXT:3,HIGHLIGHT:9,STAMP:13,INK:15};const AnnotationEditorParamsType={RESIZE:1,CREATE:2,FREETEXT_SIZE:11,FREETEXT_COLOR:12,FREETEXT_OPACITY:13,INK_COLOR:21,INK_THICKNESS:22,INK_OPACITY:23,HIGHLIGHT_COLOR:31,HIGHLIGHT_DEFAULT_COLOR:32,HIGHLIGHT_THICKNESS:33,HIGHLIGHT_FREE:34,HIGHLIGHT_SHOW_ALL:35};const PermissionFlag={PRINT:0x04,MODIFY_CONTENTS:0x08,COPY:0x10,MODIFY_ANNOTATIONS:0x20,FILL_INTERACTIVE_FORMS:0x100,COPY_FOR_ACCESSIBILITY:0x200,ASSEMBLE:0x400,PRINT_HIGH_QUALITY:0x800};const TextRenderingMode={FILL:0,STROKE:1,FILL_STROKE:2,INVISIBLE:3,FILL_ADD_TO_PATH:4,STROKE_ADD_TO_PATH:5,FILL_STROKE_ADD_TO_PATH:6,ADD_TO_PATH:7,FILL_STROKE_MASK:3,ADD_TO_PATH_FLAG:4};const util_ImageKind={GRAYSCALE_1BPP:1,RGB_24BPP:2,RGBA_32BPP:3};const AnnotationType={TEXT:1,LINK:2,FREETEXT:3,LINE:4,SQUARE:5,CIRCLE:6,POLYGON:7,POLYLINE:8,HIGHLIGHT:9,UNDERLINE:10,SQUIGGLY:11,STRIKEOUT:12,STAMP:13,CARET:14,INK:15,POPUP:16,FILEATTACHMENT:17,SOUND:18,MOVIE:19,WIDGET:20,SCREEN:21,PRINTERMARK:22,TRAPNET:23,WATERMARK:24,THREED:25,REDACT:26};const AnnotationReplyType={GROUP:"Group",REPLY:"R"};const AnnotationFlag={INVISIBLE:0x01,HIDDEN:0x02,PRINT:0x04,NOZOOM:0x08,NOROTATE:0x10,NOVIEW:0x20,READONLY:0x40,LOCKED:0x80,TOGGLENOVIEW:0x100,LOCKEDCONTENTS:0x200};const AnnotationFieldFlag={READONLY:0x0000001,REQUIRED:0x0000002,NOEXPORT:0x0000004,MULTILINE:0x0001000,PASSWORD:0x0002000,NOTOGGLETOOFF:0x0004000,RADIO:0x0008000,PUSHBUTTON:0x0010000,COMBO:0x0020000,EDIT:0x0040000,SORT:0x0080000,FILESELECT:0x0100000,MULTISELECT:0x0200000,DONOTSPELLCHECK:0x0400000,DONOTSCROLL:0x0800000,COMB:0x1000000,RICHTEXT:0x2000000,RADIOSINUNISON:0x2000000,COMMITONSELCHANGE:0x4000000};const AnnotationBorderStyleType={SOLID:1,DASHED:2,BEVELED:3,INSET:4,UNDERLINE:5};const AnnotationActionEventType={E:"Mouse Enter",X:"Mouse Exit",D:"Mouse Down",U:"Mouse Up",Fo:"Focus",Bl:"Blur",PO:"PageOpen",PC:"PageClose",PV:"PageVisible",PI:"PageInvisible",K:"Keystroke",F:"Format",V:"Validate",C:"Calculate"};const DocumentActionEventType={WC:"WillClose",WS:"WillSave",DS:"DidSave",WP:"WillPrint",DP:"DidPrint"};const PageActionEventType={O:"PageOpen",C:"PageClose"};const VerbosityLevel={ERRORS:0,WARNINGS:1,INFOS:5};const CMapCompressionType={NONE:0,BINARY:1};const OPS={dependency:1,setLineWidth:2,setLineCap:3,setLineJoin:4,setMiterLimit:5,setDash:6,setRenderingIntent:7,setFlatness:8,setGState:9,save:10,restore:11,transform:12,moveTo:13,lineTo:14,curveTo:15,curveTo2:16,curveTo3:17,closePath:18,rectangle:19,stroke:20,closeStroke:21,fill:22,eoFill:23,fillStroke:24,eoFillStroke:25,closeFillStroke:26,closeEOFillStroke:27,endPath:28,clip:29,eoClip:30,beginText:31,endText:32,setCharSpacing:33,setWordSpacing:34,setHScale:35,setLeading:36,setFont:37,setTextRenderingMode:38,setTextRise:39,moveText:40,setLeadingMoveText:41,setTextMatrix:42,nextLine:43,showText:44,showSpacedText:45,nextLineShowText:46,nextLineSetSpacingShowText:47,setCharWidth:48,setCharWidthAndBounds:49,setStrokeColorSpace:50,setFillColorSpace:51,setStrokeColor:52,setStrokeColorN:53,setFillColor:54,setFillColorN:55,setStrokeGray:56,setFillGray:57,setStrokeRGBColor:58,setFillRGBColor:59,setStrokeCMYKColor:60,setFillCMYKColor:61,shadingFill:62,beginInlineImage:63,beginImageData:64,endInlineImage:65,paintXObject:66,markPoint:67,markPointProps:68,beginMarkedContent:69,beginMarkedContentProps:70,endMarkedContent:71,beginCompat:72,endCompat:73,paintFormXObjectBegin:74,paintFormXObjectEnd:75,beginGroup:76,endGroup:77,beginAnnotation:80,endAnnotation:81,paintImageMaskXObject:83,paintImageMaskXObjectGroup:84,paintImageXObject:85,paintInlineImageXObject:86,paintInlineImageXObjectGroup:87,paintImageXObjectRepeat:88,paintImageMaskXObjectRepeat:89,paintSolidColorImageMask:90,constructPath:91};const PasswordResponses={NEED_PASSWORD:1,INCORRECT_PASSWORD:2};let verbosity=VerbosityLevel.WARNINGS;function setVerbosityLevel(level){if(Number.isInteger(level)){verbosity=level;}}function getVerbosityLevel(){return verbosity;}function info(msg){if(verbosity>=VerbosityLevel.INFOS){if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope){console.log(`Info: ${msg}`);}else if(Window&&globalThis.ngxConsole){globalThis.ngxConsole.log(`Info: ${msg}`);}else{console.log(`Info: ${msg}`);}}}function warn(msg){if(verbosity>=VerbosityLevel.WARNINGS){if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope){console.log(`Warning: ${msg}`);}else if(Window&&globalThis.ngxConsole){globalThis.ngxConsole.log(`Warning: ${msg}`);}else{console.log(`Warning: ${msg}`);}}}function unreachable(msg){throw new Error(msg);}function assert(cond,msg){if(!cond){unreachable(msg);}}function _isValidProtocol(url){switch(url?.protocol){case"http:":case"https:":case"ftp:":case"mailto:":case"tel:":case"capacitor":return true;default:return false;}}function createValidAbsoluteUrl(url){let baseUrl=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;if(!url){return null;}try{if(options&&typeof url==="string"){if(options.addDefaultProtocol&&url.startsWith("www.")){const dots=url.match(/\./g);if(dots?.length>=2){url=`http://${url}`;}}if(options.tryConvertEncoding){try{url=stringToUTF8String(url);}catch{}}}const absoluteUrl=baseUrl?new URL(url,baseUrl):new URL(url);if(_isValidProtocol(absoluteUrl)){return absoluteUrl;}}catch{}return null;}function shadow(obj,prop,value){let nonSerializable=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;Object.defineProperty(obj,prop,{value,enumerable:!nonSerializable,configurable:true,writable:false});return value;}const BaseException=function BaseExceptionClosure(){function BaseException(message,name){if(this.constructor===BaseException){unreachable("Cannot initialize BaseException.");}this.message=message;this.name=name;}BaseException.prototype=new Error();BaseException.constructor=BaseException;return BaseException;}();class PasswordException extends BaseException{constructor(msg,code){super(msg,"PasswordException");this.code=code;}}class UnknownErrorException extends BaseException{constructor(msg,details){super(msg,"UnknownErrorException");this.details=details;}}class InvalidPDFException extends BaseException{constructor(msg){super(msg,"InvalidPDFException");}}class MissingPDFException extends BaseException{constructor(msg){super(msg,"MissingPDFException");}}class UnexpectedResponseException extends BaseException{constructor(msg,status){super(msg,"UnexpectedResponseException");this.status=status;}}class FormatError extends BaseException{constructor(msg){super(msg,"FormatError");}}class AbortException extends BaseException{constructor(msg){super(msg,"AbortException");}}function bytesToString(bytes){if(typeof bytes!=="object"||bytes?.length===undefined){unreachable("Invalid argument for bytesToString");}const length=bytes.length;const MAX_ARGUMENT_COUNT=8192;if(length<MAX_ARGUMENT_COUNT){return String.fromCharCode.apply(null,bytes);}const strBuf=[];for(let i=0;i<length;i+=MAX_ARGUMENT_COUNT){const chunkEnd=Math.min(i+MAX_ARGUMENT_COUNT,length);const chunk=bytes.subarray(i,chunkEnd);strBuf.push(String.fromCharCode.apply(null,chunk));}return strBuf.join("");}function stringToBytes(str){if(typeof str!=="string"){unreachable("Invalid argument for stringToBytes");}const length=str.length;const bytes=new Uint8Array(length);for(let i=0;i<length;++i){bytes[i]=str.charCodeAt(i)&0xff;}return bytes;}function string32(value){return String.fromCharCode(value>>24&0xff,value>>16&0xff,value>>8&0xff,value&0xff);}function objectSize(obj){return Object.keys(obj).length;}function objectFromMap(map){const obj=Object.create(null);for(const[key,value]of map){obj[key]=value;}return obj;}function isLittleEndian(){const buffer8=new Uint8Array(4);buffer8[0]=1;const view32=new Uint32Array(buffer8.buffer,0,1);return view32[0]===1;}function isEvalSupported(){try{new Function("");return true;}catch{return false;}}class util_FeatureTest{static get isLittleEndian(){return shadow(this,"isLittleEndian",isLittleEndian());}static get isEvalSupported(){return shadow(this,"isEvalSupported",isEvalSupported());}static get isOffscreenCanvasSupported(){return shadow(this,"isOffscreenCanvasSupported",typeof OffscreenCanvas!=="undefined");}static get platform(){if(typeof navigator!=="undefined"&&typeof navigator?.platform==="string"){return shadow(this,"platform",{isMac:navigator.platform.includes("Mac")});}return shadow(this,"platform",{isMac:false});}static get isCSSRoundSupported(){return shadow(this,"isCSSRoundSupported",globalThis.CSS?.supports?.("width: round(1.5px, 1px)"));}}const hexNumbers=Array.from(Array(256).keys(),n=>n.toString(16).padStart(2,"0"));class Util{static makeHexColor(r,g,b){return`#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;}static scaleMinMax(transform,minMax){let temp;if(transform[0]){if(transform[0]<0){temp=minMax[0];minMax[0]=minMax[2];minMax[2]=temp;}minMax[0]*=transform[0];minMax[2]*=transform[0];if(transform[3]<0){temp=minMax[1];minMax[1]=minMax[3];minMax[3]=temp;}minMax[1]*=transform[3];minMax[3]*=transform[3];}else{temp=minMax[0];minMax[0]=minMax[1];minMax[1]=temp;temp=minMax[2];minMax[2]=minMax[3];minMax[3]=temp;if(transform[1]<0){temp=minMax[1];minMax[1]=minMax[3];minMax[3]=temp;}minMax[1]*=transform[1];minMax[3]*=transform[1];if(transform[2]<0){temp=minMax[0];minMax[0]=minMax[2];minMax[2]=temp;}minMax[0]*=transform[2];minMax[2]*=transform[2];}minMax[0]+=transform[4];minMax[1]+=transform[5];minMax[2]+=transform[4];minMax[3]+=transform[5];}static transform(m1,m2){return[m1[0]*m2[0]+m1[2]*m2[1],m1[1]*m2[0]+m1[3]*m2[1],m1[0]*m2[2]+m1[2]*m2[3],m1[1]*m2[2]+m1[3]*m2[3],m1[0]*m2[4]+m1[2]*m2[5]+m1[4],m1[1]*m2[4]+m1[3]*m2[5]+m1[5]];}static applyTransform(p,m){const xt=p[0]*m[0]+p[1]*m[2]+m[4];const yt=p[0]*m[1]+p[1]*m[3]+m[5];return[xt,yt];}static applyInverseTransform(p,m){const d=m[0]*m[3]-m[1]*m[2];const xt=(p[0]*m[3]-p[1]*m[2]+m[2]*m[5]-m[4]*m[3])/d;const yt=(-p[0]*m[1]+p[1]*m[0]+m[4]*m[1]-m[5]*m[0])/d;return[xt,yt];}static getAxialAlignedBoundingBox(r,m){const p1=this.applyTransform(r,m);const p2=this.applyTransform(r.slice(2,4),m);const p3=this.applyTransform([r[0],r[3]],m);const p4=this.applyTransform([r[2],r[1]],m);return[Math.min(p1[0],p2[0],p3[0],p4[0]),Math.min(p1[1],p2[1],p3[1],p4[1]),Math.max(p1[0],p2[0],p3[0],p4[0]),Math.max(p1[1],p2[1],p3[1],p4[1])];}static inverseTransform(m){const d=m[0]*m[3]-m[1]*m[2];return[m[3]/d,-m[1]/d,-m[2]/d,m[0]/d,(m[2]*m[5]-m[4]*m[3])/d,(m[4]*m[1]-m[5]*m[0])/d];}static singularValueDecompose2dScale(m){const transpose=[m[0],m[2],m[1],m[3]];const a=m[0]*transpose[0]+m[1]*transpose[2];const b=m[0]*transpose[1]+m[1]*transpose[3];const c=m[2]*transpose[0]+m[3]*transpose[2];const d=m[2]*transpose[1]+m[3]*transpose[3];const first=(a+d)/2;const second=Math.sqrt((a+d)**2-4*(a*d-c*b))/2;const sx=first+second||1;const sy=first-second||1;return[Math.sqrt(sx),Math.sqrt(sy)];}static normalizeRect(rect){const r=rect.slice(0);if(rect[0]>rect[2]){r[0]=rect[2];r[2]=rect[0];}if(rect[1]>rect[3]){r[1]=rect[3];r[3]=rect[1];}return r;}static intersect(rect1,rect2){const xLow=Math.max(Math.min(rect1[0],rect1[2]),Math.min(rect2[0],rect2[2]));const xHigh=Math.min(Math.max(rect1[0],rect1[2]),Math.max(rect2[0],rect2[2]));if(xLow>xHigh){return null;}const yLow=Math.max(Math.min(rect1[1],rect1[3]),Math.min(rect2[1],rect2[3]));const yHigh=Math.min(Math.max(rect1[1],rect1[3]),Math.max(rect2[1],rect2[3]));if(yLow>yHigh){return null;}return[xLow,yLow,xHigh,yHigh];}static bezierBoundingBox(x0,y0,x1,y1,x2,y2,x3,y3,minMax){if(minMax){minMax[0]=Math.min(minMax[0],x0,x3);minMax[1]=Math.min(minMax[1],y0,y3);minMax[2]=Math.max(minMax[2],x0,x3);minMax[3]=Math.max(minMax[3],y0,y3);}else{minMax=[Math.min(x0,x3),Math.min(y0,y3),Math.max(x0,x3),Math.max(y0,y3)];}_assertClassBrand(Util,this,_getExtremum).call(this,x0,x1,x2,x3,y0,y1,y2,y3,3*(-x0+3*(x1-x2)+x3),6*(x0-2*x1+x2),3*(x1-x0),minMax);_assertClassBrand(Util,this,_getExtremum).call(this,x0,x1,x2,x3,y0,y1,y2,y3,3*(-y0+3*(y1-y2)+y3),6*(y0-2*y1+y2),3*(y1-y0),minMax);return minMax;}}_Util=Util;function _getExtremumOnCurve(x0,x1,x2,x3,y0,y1,y2,y3,t,minMax){if(t<=0||t>=1){return;}const mt=1-t;const tt=t*t;const ttt=tt*t;const x=mt*(mt*(mt*x0+3*t*x1)+3*tt*x2)+ttt*x3;const y=mt*(mt*(mt*y0+3*t*y1)+3*tt*y2)+ttt*y3;minMax[0]=Math.min(minMax[0],x);minMax[1]=Math.min(minMax[1],y);minMax[2]=Math.max(minMax[2],x);minMax[3]=Math.max(minMax[3],y);}function _getExtremum(x0,x1,x2,x3,y0,y1,y2,y3,a,b,c,minMax){if(Math.abs(a)<1e-12){if(Math.abs(b)>=1e-12){_assertClassBrand(_Util,this,_getExtremumOnCurve).call(this,x0,x1,x2,x3,y0,y1,y2,y3,-c/b,minMax);}return;}const delta=b**2-4*c*a;if(delta<0){return;}const sqrtDelta=Math.sqrt(delta);const a2=2*a;_assertClassBrand(_Util,this,_getExtremumOnCurve).call(this,x0,x1,x2,x3,y0,y1,y2,y3,(-b+sqrtDelta)/a2,minMax);_assertClassBrand(_Util,this,_getExtremumOnCurve).call(this,x0,x1,x2,x3,y0,y1,y2,y3,(-b-sqrtDelta)/a2,minMax);}const PDFStringTranslateTable=(/* unused pure expression or super */ null && ([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x2d8,0x2c7,0x2c6,0x2d9,0x2dd,0x2db,0x2da,0x2dc,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x2022,0x2020,0x2021,0x2026,0x2014,0x2013,0x192,0x2044,0x2039,0x203a,0x2212,0x2030,0x201e,0x201c,0x201d,0x2018,0x2019,0x201a,0x2122,0xfb01,0xfb02,0x141,0x152,0x160,0x178,0x17d,0x131,0x142,0x153,0x161,0x17e,0,0x20ac]));function stringToPDFString(str){if(str[0]>="\xEF"){let encoding;if(str[0]==="\xFE"&&str[1]==="\xFF"){encoding="utf-16be";if(str.length%2===1){str=str.slice(0,-1);}}else if(str[0]==="\xFF"&&str[1]==="\xFE"){encoding="utf-16le";if(str.length%2===1){str=str.slice(0,-1);}}else if(str[0]==="\xEF"&&str[1]==="\xBB"&&str[2]==="\xBF"){encoding="utf-8";}if(encoding){try{const decoder=new TextDecoder(encoding,{fatal:true});const buffer=stringToBytes(str);const decoded=decoder.decode(buffer);if(!decoded.includes("\x1b")){return decoded;}return decoded.replaceAll(/\x1b[^\x1b]*(?:\x1b|$)/g,"");}catch(ex){warn(`stringToPDFString: "${ex}".`);}}}const strBuf=[];for(let i=0,ii=str.length;i<ii;i++){const charCode=str.charCodeAt(i);if(charCode===0x1b){while(++i<ii&&str.charCodeAt(i)!==0x1b){}continue;}const code=PDFStringTranslateTable[charCode];strBuf.push(code?String.fromCharCode(code):str.charAt(i));}return strBuf.join("");}function stringToUTF8String(str){return decodeURIComponent(escape(str));}function utf8StringToString(str){return unescape(encodeURIComponent(str));}function isArrayEqual(arr1,arr2){if(arr1.length!==arr2.length){return false;}for(let i=0,ii=arr1.length;i<ii;i++){if(arr1[i]!==arr2[i]){return false;}}return true;}function getModificationDate(){let date=arguments.length>0&&arguments[0]!==undefined?arguments[0]:new Date();const buffer=[date.getUTCFullYear().toString(),(date.getUTCMonth()+1).toString().padStart(2,"0"),date.getUTCDate().toString().padStart(2,"0"),date.getUTCHours().toString().padStart(2,"0"),date.getUTCMinutes().toString().padStart(2,"0"),date.getUTCSeconds().toString().padStart(2,"0")];return buffer.join("");}let NormalizeRegex=null;let NormalizationMap=null;function normalizeUnicode(str){if(!NormalizeRegex){NormalizeRegex=/([\u00a0\u00b5\u037e\u0eb3\u2000-\u200a\u202f\u2126\ufb00-\ufb04\ufb06\ufb20-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufba1\ufba4-\ufba9\ufbae-\ufbb1\ufbd3-\ufbdc\ufbde-\ufbe7\ufbea-\ufbf8\ufbfc-\ufbfd\ufc00-\ufc5d\ufc64-\ufcf1\ufcf5-\ufd3d\ufd88\ufdf4\ufdfa-\ufdfb\ufe71\ufe77\ufe79\ufe7b\ufe7d]+)|(\ufb05+)/gu;NormalizationMap=new Map([["ﬅ","ſt"]]);}return str.replaceAll(NormalizeRegex,(_,p1,p2)=>p1?p1.normalize("NFKC"):NormalizationMap.get(p2));}function getUuid(){if(typeof crypto!=="undefined"&&typeof crypto?.randomUUID==="function"){return crypto.randomUUID();}const buf=new Uint8Array(32);if(typeof crypto!=="undefined"&&typeof crypto?.getRandomValues==="function"){crypto.getRandomValues(buf);}else{for(let i=0;i<32;i++){buf[i]=Math.floor(Math.random()*255);}}return bytesToString(buf);}const AnnotationPrefix="pdfjs_internal_id_";const FontRenderOps={BEZIER_CURVE_TO:0,MOVE_TO:1,LINE_TO:2,QUADRATIC_CURVE_TO:3,RESTORE:4,SAVE:5,SCALE:6,TRANSFORM:7,TRANSLATE:8};
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.with-resolvers.js
var es_promise_with_resolvers = __webpack_require__(4628);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.map.js
var esnext_iterator_map = __webpack_require__(1454);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.difference.v2.js
var esnext_set_difference_v2 = __webpack_require__(3375);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.intersection.v2.js
var esnext_set_intersection_v2 = __webpack_require__(9225);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.is-disjoint-from.v2.js
var esnext_set_is_disjoint_from_v2 = __webpack_require__(3972);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.is-subset-of.v2.js
var esnext_set_is_subset_of_v2 = __webpack_require__(9209);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.is-superset-of.v2.js
var esnext_set_is_superset_of_v2 = __webpack_require__(5714);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.symmetric-difference.v2.js
var esnext_set_symmetric_difference_v2 = __webpack_require__(7561);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.set.union.v2.js
var esnext_set_union_v2 = __webpack_require__(6197);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__(4979);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.at.js
var es_array_at = __webpack_require__(8107);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.at-alternative.js
var es_string_at_alternative = __webpack_require__(7357);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.constructor.js
var esnext_iterator_constructor = __webpack_require__(8992);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.every.js
var esnext_iterator_every = __webpack_require__(3215);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.for-each.js
var esnext_iterator_for_each = __webpack_require__(3949);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.some.js
var esnext_iterator_some = __webpack_require__(7550);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.json.parse.js
var esnext_json_parse = __webpack_require__(8335);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.filter.js
var esnext_iterator_filter = __webpack_require__(4520);
;// CONCATENATED MODULE: ./src/display/base_factory.js
class BaseFilterFactory{constructor(){if(this.constructor===BaseFilterFactory){unreachable("Cannot initialize BaseFilterFactory.");}}addFilter(maps){return"none";}addHCMFilter(fgColor,bgColor){return"none";}addAlphaFilter(map){return"none";}addLuminosityFilter(map){return"none";}addHighlightHCMFilter(filterName,fgColor,bgColor,newFgColor,newBgColor){return"none";}destroy(){let keepHCM=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;}}class BaseCanvasFactory{constructor(){if(this.constructor===BaseCanvasFactory){unreachable("Cannot initialize BaseCanvasFactory.");}}create(width,height){if(width<=0||height<=0){throw new Error("Invalid canvas size");}const canvas=this._createCanvas(width,height);const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const context=canvas.getContext("2d",options);return{canvas,context};}reset(canvasAndContext,width,height){if(!canvasAndContext.canvas){throw new Error("Canvas is not specified");}if(width<=0||height<=0){throw new Error("Invalid canvas size");}canvasAndContext.canvas.width=width;canvasAndContext.canvas.height=height;}destroy(canvasAndContext){if(!canvasAndContext.canvas){throw new Error("Canvas is not specified");}canvasAndContext.canvas.width=0;canvasAndContext.canvas.height=0;canvasAndContext.canvas=null;canvasAndContext.context=null;}_createCanvas(width,height){unreachable("Abstract method `_createCanvas` called.");}}class BaseCMapReaderFactory{constructor(_ref){let{baseUrl=null,isCompressed=true}=_ref;if(this.constructor===BaseCMapReaderFactory){unreachable("Cannot initialize BaseCMapReaderFactory.");}this.baseUrl=baseUrl;this.isCompressed=isCompressed;}async fetch(_ref2){let{name}=_ref2;if(!this.baseUrl){throw new Error('The CMap "baseUrl" parameter must be specified, ensure that '+'the "cMapUrl" and "cMapPacked" API parameters are provided.');}if(!name){throw new Error("CMap name must be specified.");}const url=this.baseUrl+name+(this.isCompressed?".bcmap":"");const compressionType=this.isCompressed?CMapCompressionType.BINARY:CMapCompressionType.NONE;return this._fetchData(url,compressionType).catch(reason=>{throw new Error(`Unable to load ${this.isCompressed?"binary ":""}CMap at: ${url}`);});}_fetchData(url,compressionType){unreachable("Abstract method `_fetchData` called.");}}class BaseStandardFontDataFactory{constructor(_ref3){let{baseUrl=null}=_ref3;if(this.constructor===BaseStandardFontDataFactory){unreachable("Cannot initialize BaseStandardFontDataFactory.");}this.baseUrl=baseUrl;}async fetch(_ref4){let{filename}=_ref4;if(!this.baseUrl){throw new Error('The standard font "baseUrl" parameter must be specified, ensure that '+'the "standardFontDataUrl" API parameter is provided.');}if(!filename){throw new Error("Font filename must be specified.");}const url=`${this.baseUrl}${filename}`;return this._fetchData(url).catch(reason=>{throw new Error(`Unable to load font data at: ${url}`);});}_fetchData(url){unreachable("Abstract method `_fetchData` called.");}}class BaseSVGFactory{constructor(){if(this.constructor===BaseSVGFactory){unreachable("Cannot initialize BaseSVGFactory.");}}create(width,height){let skipDimensions=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(width<=0||height<=0){throw new Error("Invalid SVG dimensions");}const svg=this._createSVG("svg:svg");svg.setAttribute("version","1.1");if(!skipDimensions){svg.setAttribute("width",`${width}px`);svg.setAttribute("height",`${height}px`);}svg.setAttribute("preserveAspectRatio","none");svg.setAttribute("viewBox",`0 0 ${width} ${height}`);return svg;}createElement(type){if(typeof type!=="string"){throw new Error("Invalid SVG element type");}return this._createSVG(type);}_createSVG(type){unreachable("Abstract method `_createSVG` called.");}}
;// CONCATENATED MODULE: ./src/display/display_utils.js
var _PixelsPerInch;function _classPrivateMethodInitSpec(e,a){_checkPrivateRedeclaration(e,a),a.add(e);}function _classPrivateFieldInitSpec(e,t,a){_checkPrivateRedeclaration(e,t),t.set(e,a);}function _checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function _classPrivateGetter(s,r,a){return a(display_utils_assertClassBrand(s,r));}function _classPrivateFieldGet(s,a){return s.get(display_utils_assertClassBrand(s,a));}function _classPrivateFieldSet(s,a,r){return s.set(display_utils_assertClassBrand(s,a),r),r;}function display_utils_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}const SVG_NS="http://www.w3.org/2000/svg";class PixelsPerInch{}_PixelsPerInch=PixelsPerInch;_defineProperty(PixelsPerInch,"CSS",96.0);_defineProperty(PixelsPerInch,"PDF",72.0);_defineProperty(PixelsPerInch,"PDF_TO_CSS_UNITS",_PixelsPerInch.CSS/_PixelsPerInch.PDF);var _cache=/*#__PURE__*/new WeakMap();var _defs=/*#__PURE__*/new WeakMap();var _docId=/*#__PURE__*/new WeakMap();var _document=/*#__PURE__*/new WeakMap();var _hcmCache=/*#__PURE__*/new WeakMap();var _id=/*#__PURE__*/new WeakMap();var _DOMFilterFactory_brand=/*#__PURE__*/new WeakSet();class DOMFilterFactory extends BaseFilterFactory{constructor(){let{docId,ownerDocument=globalThis.document}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};super();_classPrivateMethodInitSpec(this,_DOMFilterFactory_brand);_classPrivateFieldInitSpec(this,_cache,void 0);_classPrivateFieldInitSpec(this,_defs,void 0);_classPrivateFieldInitSpec(this,_docId,void 0);_classPrivateFieldInitSpec(this,_document,void 0);_classPrivateFieldInitSpec(this,_hcmCache,void 0);_classPrivateFieldInitSpec(this,_id,0);_classPrivateFieldSet(_docId,this,docId);_classPrivateFieldSet(_document,this,ownerDocument);}addFilter(maps){var _this$id,_this$id2;if(!maps){return"none";}let value=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).get(maps);if(value){return value;}const[tableR,tableG,tableB]=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createTables).call(this,maps);const key=maps.length===1?tableR:`${tableR}${tableG}${tableB}`;value=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).get(key);if(value){_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(maps,value);return value;}const id=`g_${_classPrivateFieldGet(_docId,this)}_transfer_map_${(_classPrivateFieldSet(_id,this,(_this$id=_classPrivateFieldGet(_id,this),_this$id2=_this$id++,_this$id)),_this$id2)}`;const url=`url(#${id})`;_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(maps,url);_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(key,url);const filter=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createFilter).call(this,id);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addTransferMapConversion).call(this,tableR,tableG,tableB,filter);return url;}addHCMFilter(fgColor,bgColor){const key=`${fgColor}-${bgColor}`;const filterName="base";let info=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_hcmCache).get(filterName);if(info?.key===key){return info.url;}if(info){info.filter?.remove();info.key=key;info.url="none";info.filter=null;}else{info={key,url:"none",filter:null};_classPrivateGetter(_DOMFilterFactory_brand,this,_get_hcmCache).set(filterName,info);}if(!fgColor||!bgColor){return info.url;}const fgRGB=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_getRGB).call(this,fgColor);fgColor=Util.makeHexColor(...fgRGB);const bgRGB=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_getRGB).call(this,bgColor);bgColor=Util.makeHexColor(...bgRGB);_classPrivateGetter(_DOMFilterFactory_brand,this,_get_defs).style.color="";if(fgColor==="#000000"&&bgColor==="#ffffff"||fgColor===bgColor){return info.url;}const map=new Array(256);for(let i=0;i<=255;i++){const x=i/255;map[i]=x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4;}const table=map.join(",");const id=`g_${_classPrivateFieldGet(_docId,this)}_hcm_filter`;const filter=info.filter=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createFilter).call(this,id);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addTransferMapConversion).call(this,table,table,table,filter);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addGrayConversion).call(this,filter);const getSteps=(c,n)=>{const start=fgRGB[c]/255;const end=bgRGB[c]/255;const arr=new Array(n+1);for(let i=0;i<=n;i++){arr[i]=start+i/n*(end-start);}return arr.join(",");};display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addTransferMapConversion).call(this,getSteps(0,5),getSteps(1,5),getSteps(2,5),filter);info.url=`url(#${id})`;return info.url;}addAlphaFilter(map){var _this$id3,_this$id4;let value=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).get(map);if(value){return value;}const[tableA]=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createTables).call(this,[map]);const key=`alpha_${tableA}`;value=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).get(key);if(value){_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(map,value);return value;}const id=`g_${_classPrivateFieldGet(_docId,this)}_alpha_map_${(_classPrivateFieldSet(_id,this,(_this$id3=_classPrivateFieldGet(_id,this),_this$id4=_this$id3++,_this$id3)),_this$id4)}`;const url=`url(#${id})`;_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(map,url);_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(key,url);const filter=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createFilter).call(this,id);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addTransferMapAlphaConversion).call(this,tableA,filter);return url;}addLuminosityFilter(map){var _this$id5,_this$id6;let value=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).get(map||"luminosity");if(value){return value;}let tableA,key;if(map){[tableA]=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createTables).call(this,[map]);key=`luminosity_${tableA}`;}else{key="luminosity";}value=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).get(key);if(value){_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(map,value);return value;}const id=`g_${_classPrivateFieldGet(_docId,this)}_luminosity_map_${(_classPrivateFieldSet(_id,this,(_this$id5=_classPrivateFieldGet(_id,this),_this$id6=_this$id5++,_this$id5)),_this$id6)}`;const url=`url(#${id})`;_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(map,url);_classPrivateGetter(_DOMFilterFactory_brand,this,_get_cache).set(key,url);const filter=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createFilter).call(this,id);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addLuminosityConversion).call(this,filter);if(map){display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addTransferMapAlphaConversion).call(this,tableA,filter);}return url;}addHighlightHCMFilter(filterName,fgColor,bgColor,newFgColor,newBgColor){const key=`${fgColor}-${bgColor}-${newFgColor}-${newBgColor}`;let info=_classPrivateGetter(_DOMFilterFactory_brand,this,_get_hcmCache).get(filterName);if(info?.key===key){return info.url;}if(info){info.filter?.remove();info.key=key;info.url="none";info.filter=null;}else{info={key,url:"none",filter:null};_classPrivateGetter(_DOMFilterFactory_brand,this,_get_hcmCache).set(filterName,info);}if(!fgColor||!bgColor){return info.url;}const[fgRGB,bgRGB]=[fgColor,bgColor].map(display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_getRGB).bind(this));let fgGray=Math.round(0.2126*fgRGB[0]+0.7152*fgRGB[1]+0.0722*fgRGB[2]);let bgGray=Math.round(0.2126*bgRGB[0]+0.7152*bgRGB[1]+0.0722*bgRGB[2]);let[newFgRGB,newBgRGB]=[newFgColor,newBgColor].map(display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_getRGB).bind(this));if(bgGray<fgGray){[fgGray,bgGray,newFgRGB,newBgRGB]=[bgGray,fgGray,newBgRGB,newFgRGB];}_classPrivateGetter(_DOMFilterFactory_brand,this,_get_defs).style.color="";const getSteps=(fg,bg,n)=>{const arr=new Array(256);const step=(bgGray-fgGray)/n;const newStart=fg/255;const newStep=(bg-fg)/(255*n);let prev=0;for(let i=0;i<=n;i++){const k=Math.round(fgGray+i*step);const value=newStart+i*newStep;for(let j=prev;j<=k;j++){arr[j]=value;}prev=k+1;}for(let i=prev;i<256;i++){arr[i]=arr[prev-1];}return arr.join(",");};const id=`g_${_classPrivateFieldGet(_docId,this)}_hcm_${filterName}_filter`;const filter=info.filter=display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_createFilter).call(this,id);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addGrayConversion).call(this,filter);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_addTransferMapConversion).call(this,getSteps(newFgRGB[0],newBgRGB[0],5),getSteps(newFgRGB[1],newBgRGB[1],5),getSteps(newFgRGB[2],newBgRGB[2],5),filter);info.url=`url(#${id})`;return info.url;}destroy(){let keepHCM=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(keepHCM&&_classPrivateGetter(_DOMFilterFactory_brand,this,_get_hcmCache).size!==0){return;}if(_classPrivateFieldGet(_defs,this)){_classPrivateFieldGet(_defs,this).parentNode.parentNode.remove();_classPrivateFieldSet(_defs,this,null);}if(_classPrivateFieldGet(_cache,this)){_classPrivateFieldGet(_cache,this).clear();_classPrivateFieldSet(_cache,this,null);}_classPrivateFieldSet(_id,this,0);}}function _get_cache(_this){return _classPrivateFieldGet(_cache,_this)||_classPrivateFieldSet(_cache,_this,new Map());}function _get_hcmCache(_this2){return _classPrivateFieldGet(_hcmCache,_this2)||_classPrivateFieldSet(_hcmCache,_this2,new Map());}function _get_defs(_this3){if(!_classPrivateFieldGet(_defs,_this3)){const div=_classPrivateFieldGet(_document,_this3).createElement("div");const{style}=div;style.visibility="hidden";style.contain="strict";style.width=style.height=0;style.position="absolute";style.top=style.left=0;style.zIndex=-1;const svg=_classPrivateFieldGet(_document,_this3).createElementNS(SVG_NS,"svg");svg.setAttribute("width",0);svg.setAttribute("height",0);_classPrivateFieldSet(_defs,_this3,_classPrivateFieldGet(_document,_this3).createElementNS(SVG_NS,"defs"));div.append(svg);svg.append(_classPrivateFieldGet(_defs,_this3));_classPrivateFieldGet(_document,_this3).body.append(div);}return _classPrivateFieldGet(_defs,_this3);}function _createTables(maps){if(maps.length===1){const mapR=maps[0];const buffer=new Array(256);for(let i=0;i<256;i++){buffer[i]=mapR[i]/255;}const table=buffer.join(",");return[table,table,table];}const[mapR,mapG,mapB]=maps;const bufferR=new Array(256);const bufferG=new Array(256);const bufferB=new Array(256);for(let i=0;i<256;i++){bufferR[i]=mapR[i]/255;bufferG[i]=mapG[i]/255;bufferB[i]=mapB[i]/255;}return[bufferR.join(","),bufferG.join(","),bufferB.join(",")];}function _addLuminosityConversion(filter){const feColorMatrix=_classPrivateFieldGet(_document,this).createElementNS(SVG_NS,"feColorMatrix");feColorMatrix.setAttribute("type","matrix");feColorMatrix.setAttribute("values","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0.59 0.11 0 0");filter.append(feColorMatrix);}function _addGrayConversion(filter){const feColorMatrix=_classPrivateFieldGet(_document,this).createElementNS(SVG_NS,"feColorMatrix");feColorMatrix.setAttribute("type","matrix");feColorMatrix.setAttribute("values","0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0");filter.append(feColorMatrix);}function _createFilter(id){const filter=_classPrivateFieldGet(_document,this).createElementNS(SVG_NS,"filter");filter.setAttribute("color-interpolation-filters","sRGB");filter.setAttribute("id",id);_classPrivateGetter(_DOMFilterFactory_brand,this,_get_defs).append(filter);return filter;}function _appendFeFunc(feComponentTransfer,func,table){const feFunc=_classPrivateFieldGet(_document,this).createElementNS(SVG_NS,func);feFunc.setAttribute("type","discrete");feFunc.setAttribute("tableValues",table);feComponentTransfer.append(feFunc);}function _addTransferMapConversion(rTable,gTable,bTable,filter){const feComponentTransfer=_classPrivateFieldGet(_document,this).createElementNS(SVG_NS,"feComponentTransfer");filter.append(feComponentTransfer);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_appendFeFunc).call(this,feComponentTransfer,"feFuncR",rTable);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_appendFeFunc).call(this,feComponentTransfer,"feFuncG",gTable);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_appendFeFunc).call(this,feComponentTransfer,"feFuncB",bTable);}function _addTransferMapAlphaConversion(aTable,filter){const feComponentTransfer=_classPrivateFieldGet(_document,this).createElementNS(SVG_NS,"feComponentTransfer");filter.append(feComponentTransfer);display_utils_assertClassBrand(_DOMFilterFactory_brand,this,_appendFeFunc).call(this,feComponentTransfer,"feFuncA",aTable);}function _getRGB(color){_classPrivateGetter(_DOMFilterFactory_brand,this,_get_defs).style.color=color;return getRGB(getComputedStyle(_classPrivateGetter(_DOMFilterFactory_brand,this,_get_defs)).getPropertyValue("color"));}class DOMCanvasFactory extends BaseCanvasFactory{constructor(){let{ownerDocument=globalThis.document}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};super();this._document=ownerDocument;}_createCanvas(width,height){const canvas=this._document.createElement("canvas");canvas.width=width;canvas.height=height;return canvas;}}async function fetchData(url){let type=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"text";if(isValidFetchUrl(url,document.baseURI)){const response=await fetch(url);if(!response.ok){throw new Error(response.statusText);}switch(type){case"arraybuffer":return response.arrayBuffer();case"blob":return response.blob();case"json":return response.json();}return response.text();}return new Promise((resolve,reject)=>{const request=new XMLHttpRequest();request.open("GET",url,true);request.responseType=type;request.onreadystatechange=()=>{if(request.readyState!==XMLHttpRequest.DONE){return;}if(request.status===200||request.status===0){switch(type){case"arraybuffer":case"blob":case"json":resolve(request.response);return;}resolve(request.responseText);return;}reject(new Error(request.statusText));};request.send(null);});}class DOMCMapReaderFactory extends BaseCMapReaderFactory{_fetchData(url,compressionType){return fetchData(url,this.isCompressed?"arraybuffer":"text").then(data=>({cMapData:data instanceof ArrayBuffer?new Uint8Array(data):stringToBytes(data),compressionType}));}}class DOMStandardFontDataFactory extends BaseStandardFontDataFactory{_fetchData(url){return fetchData(url,"arraybuffer").then(data=>new Uint8Array(data));}}class DOMSVGFactory extends BaseSVGFactory{_createSVG(type){return document.createElementNS(SVG_NS,type);}}class PageViewport{constructor(_ref){let{viewBox,scale,rotation,offsetX=0,offsetY=0,dontFlip=false}=_ref;this.viewBox=viewBox;this.scale=scale;this.rotation=rotation;this.offsetX=offsetX;this.offsetY=offsetY;const centerX=(viewBox[2]+viewBox[0])/2;const centerY=(viewBox[3]+viewBox[1])/2;let rotateA,rotateB,rotateC,rotateD;rotation%=360;if(rotation<0){rotation+=360;}switch(rotation){case 180:rotateA=-1;rotateB=0;rotateC=0;rotateD=1;break;case 90:rotateA=0;rotateB=1;rotateC=1;rotateD=0;break;case 270:rotateA=0;rotateB=-1;rotateC=-1;rotateD=0;break;case 0:rotateA=1;rotateB=0;rotateC=0;rotateD=-1;break;default:throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");}if(dontFlip){rotateC=-rotateC;rotateD=-rotateD;}let offsetCanvasX,offsetCanvasY;let width,height;if(rotateA===0){offsetCanvasX=Math.abs(centerY-viewBox[1])*scale+offsetX;offsetCanvasY=Math.abs(centerX-viewBox[0])*scale+offsetY;width=(viewBox[3]-viewBox[1])*scale;height=(viewBox[2]-viewBox[0])*scale;}else{offsetCanvasX=Math.abs(centerX-viewBox[0])*scale+offsetX;offsetCanvasY=Math.abs(centerY-viewBox[1])*scale+offsetY;width=(viewBox[2]-viewBox[0])*scale;height=(viewBox[3]-viewBox[1])*scale;}this.transform=[rotateA*scale,rotateB*scale,rotateC*scale,rotateD*scale,offsetCanvasX-rotateA*scale*centerX-rotateC*scale*centerY,offsetCanvasY-rotateB*scale*centerX-rotateD*scale*centerY];this.width=width;this.height=height;}get rawDims(){const{viewBox}=this;return shadow(this,"rawDims",{pageWidth:viewBox[2]-viewBox[0],pageHeight:viewBox[3]-viewBox[1],pageX:viewBox[0],pageY:viewBox[1]});}clone(){let{scale=this.scale,rotation=this.rotation,offsetX=this.offsetX,offsetY=this.offsetY,dontFlip=false}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return new PageViewport({viewBox:this.viewBox.slice(),scale,rotation,offsetX,offsetY,dontFlip});}convertToViewportPoint(x,y){return Util.applyTransform([x,y],this.transform);}convertToViewportRectangle(rect){const topLeft=Util.applyTransform([rect[0],rect[1]],this.transform);const bottomRight=Util.applyTransform([rect[2],rect[3]],this.transform);return[topLeft[0],topLeft[1],bottomRight[0],bottomRight[1]];}convertToPdfPoint(x,y){return Util.applyInverseTransform([x,y],this.transform);}}class RenderingCancelledException extends BaseException{constructor(msg){let extraDelay=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;super(msg,"RenderingCancelledException");this.extraDelay=extraDelay;}}function isDataScheme(url){const ii=url.length;let i=0;while(i<ii&&url[i].trim()===""){i++;}return url.substring(i,i+5).toLowerCase()==="data:";}function isPdfFile(filename){return typeof filename==="string"&&/\.pdf$/i.test(filename);}function getFilenameFromUrl(url){[url]=url.split(/[#?]/,1);return url.substring(url.lastIndexOf("/")+1);}function getPdfFilenameFromUrl(url){let defaultFilename=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"document.pdf";if(window.PDFViewerApplication.appConfig.filenameForDownload){return window.PDFViewerApplication.appConfig.filenameForDownload;}if(typeof url!=="string"){return defaultFilename;}if(isDataScheme(url)){warn('getPdfFilenameFromUrl: ignore "data:"-URL for performance reasons.');return defaultFilename;}const reURI=/^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;const reFilename=/[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i;const splitURI=reURI.exec(url);let suggestedFilename=reFilename.exec(splitURI[1])||reFilename.exec(splitURI[2])||reFilename.exec(splitURI[3]);if(suggestedFilename){suggestedFilename=suggestedFilename[0];if(suggestedFilename.includes("%")){try{suggestedFilename=reFilename.exec(decodeURIComponent(suggestedFilename))[0];}catch{}}}return suggestedFilename||defaultFilename;}class StatTimer{constructor(){_defineProperty(this,"started",Object.create(null));_defineProperty(this,"times",[]);}time(name){if(name in this.started){warn(`Timer is already running for ${name}`);}this.started[name]=Date.now();}timeEnd(name){if(!(name in this.started)){warn(`Timer has not been started for ${name}`);}this.times.push({name,start:this.started[name],end:Date.now()});delete this.started[name];}toString(){const outBuf=[];let longest=0;for(const{name}of this.times){longest=Math.max(name.length,longest);}for(const{name,start,end}of this.times){outBuf.push(`${name.padEnd(longest)} ${end-start}ms\n`);}return outBuf.join("");}}function isValidFetchUrl(url,baseUrl){try{const{protocol}=baseUrl?new URL(url,baseUrl):new URL(url);return protocol==="http:"||protocol==="https:"||protocol==="capacitor:";}catch{return false;}}function generateTrustedURL(sourcePath){if(window.trustedTypes){const sanitizer=window.trustedTypes.createPolicy("pdf-viewer-2",{createScriptURL:url=>url});return sanitizer.createScriptURL(sourcePath);}return sourcePath;}function noContextMenu(e){e.preventDefault();}function deprecated(details){globalThis.ngxConsole.log("Deprecated API usage: "+details);}let pdfDateStringRegex;class PDFDateString{static toDateObject(input){if(!input||typeof input!=="string"){return null;}pdfDateStringRegex||=new RegExp("^D:"+"(\\d{4})"+"(\\d{2})?"+"(\\d{2})?"+"(\\d{2})?"+"(\\d{2})?"+"(\\d{2})?"+"([Z|+|-])?"+"(\\d{2})?"+"'?"+"(\\d{2})?"+"'?");const matches=pdfDateStringRegex.exec(input);if(!matches){return null;}const year=parseInt(matches[1],10);let month=parseInt(matches[2],10);month=month>=1&&month<=12?month-1:0;let day=parseInt(matches[3],10);day=day>=1&&day<=31?day:1;let hour=parseInt(matches[4],10);hour=hour>=0&&hour<=23?hour:0;let minute=parseInt(matches[5],10);minute=minute>=0&&minute<=59?minute:0;let second=parseInt(matches[6],10);second=second>=0&&second<=59?second:0;const universalTimeRelation=matches[7]||"Z";let offsetHour=parseInt(matches[8],10);offsetHour=offsetHour>=0&&offsetHour<=23?offsetHour:0;let offsetMinute=parseInt(matches[9],10)||0;offsetMinute=offsetMinute>=0&&offsetMinute<=59?offsetMinute:0;if(universalTimeRelation==="-"){hour+=offsetHour;minute+=offsetMinute;}else if(universalTimeRelation==="+"){hour-=offsetHour;minute-=offsetMinute;}return new Date(Date.UTC(year,month,day,hour,minute,second));}}function getXfaPageViewport(xfaPage,_ref2){let{scale=1,rotation=0}=_ref2;const{width,height}=xfaPage.attributes.style;const viewBox=[0,0,parseInt(width),parseInt(height)];return new PageViewport({viewBox,scale,rotation});}function getRGB(color){if(color.startsWith("#")){const colorRGB=parseInt(color.slice(1),16);return[(colorRGB&0xff0000)>>16,(colorRGB&0x00ff00)>>8,colorRGB&0x0000ff];}if(color.startsWith("rgb(")){return color.slice(4,-1).split(",").map(x=>parseInt(x));}if(color.startsWith("rgba(")){return color.slice(5,-1).split(",").map(x=>parseInt(x)).slice(0,3);}warn(`Not a valid color format: "${color}"`);return[0,0,0];}function getColorValues(colors){const span=document.createElement("span");span.style.visibility="hidden";document.body.append(span);for(const name of colors.keys()){span.style.color=name;const computedColor=window.getComputedStyle(span).color;colors.set(name,getRGB(computedColor));}span.remove();}function getCurrentTransform(ctx){const{a,b,c,d,e,f}=ctx.getTransform();return[a,b,c,d,e,f];}function getCurrentTransformInverse(ctx){const{a,b,c,d,e,f}=ctx.getTransform().invertSelf();return[a,b,c,d,e,f];}function setLayerDimensions(div,viewport){let mustFlip=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;let mustRotate=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;if(viewport instanceof PageViewport){const{pageWidth,pageHeight}=viewport.rawDims;const{style}=div;const useRound=util_FeatureTest.isCSSRoundSupported;const w=`var(--scale-factor) * ${pageWidth}px`,h=`var(--scale-factor) * ${pageHeight}px`;const widthStr=useRound?`round(${w}, 1px)`:`calc(${w})`,heightStr=useRound?`round(${h}, 1px)`:`calc(${h})`;if(!mustFlip||viewport.rotation%180===0){style.width=widthStr;style.height=heightStr;}else{style.width=heightStr;style.height=widthStr;}}if(mustRotate){div.setAttribute("data-main-rotation",viewport.rotation);}}
;// CONCATENATED MODULE: ./src/display/editor/toolbar.js
function toolbar_classPrivateMethodInitSpec(e,a){toolbar_checkPrivateRedeclaration(e,a),a.add(e);}function toolbar_classPrivateFieldInitSpec(e,t,a){toolbar_checkPrivateRedeclaration(e,t),t.set(e,a);}function toolbar_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function toolbar_classPrivateGetter(s,r,a){return a(toolbar_assertClassBrand(s,r));}function toolbar_classPrivateFieldGet(s,a){return s.get(toolbar_assertClassBrand(s,a));}function toolbar_classPrivateFieldSet(s,a,r){return s.set(toolbar_assertClassBrand(s,a),r),r;}function toolbar_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _toolbar=/*#__PURE__*/new WeakMap();var _colorPicker=/*#__PURE__*/new WeakMap();var _editor=/*#__PURE__*/new WeakMap();var _buttons=/*#__PURE__*/new WeakMap();var _EditorToolbar_brand=/*#__PURE__*/new WeakSet();class EditorToolbar{constructor(editor){toolbar_classPrivateMethodInitSpec(this,_EditorToolbar_brand);toolbar_classPrivateFieldInitSpec(this,_toolbar,null);toolbar_classPrivateFieldInitSpec(this,_colorPicker,null);toolbar_classPrivateFieldInitSpec(this,_editor,void 0);toolbar_classPrivateFieldInitSpec(this,_buttons,null);toolbar_classPrivateFieldSet(_editor,this,editor);}render(){const editToolbar=toolbar_classPrivateFieldSet(_toolbar,this,document.createElement("div"));editToolbar.className="editToolbar";editToolbar.setAttribute("role","toolbar");editToolbar.addEventListener("contextmenu",noContextMenu);editToolbar.addEventListener("pointerdown",_pointerDown);const buttons=toolbar_classPrivateFieldSet(_buttons,this,document.createElement("div"));buttons.className="buttons";editToolbar.append(buttons);const position=toolbar_classPrivateFieldGet(_editor,this).toolbarPosition;if(position){const{style}=editToolbar;const x=toolbar_classPrivateFieldGet(_editor,this)._uiManager.direction==="ltr"?1-position[0]:position[0];style.insetInlineEnd=`${100*x}%`;style.top=`calc(${100*position[1]}% + var(--editor-toolbar-vert-offset))`;}toolbar_assertClassBrand(_EditorToolbar_brand,this,_addDeleteButton).call(this);return editToolbar;}hide(){toolbar_classPrivateFieldGet(_toolbar,this).classList.add("hidden");toolbar_classPrivateFieldGet(_colorPicker,this)?.hideDropdown();}show(){toolbar_classPrivateFieldGet(_toolbar,this).classList.remove("hidden");}addAltTextButton(button){toolbar_assertClassBrand(_EditorToolbar_brand,this,_addListenersToElement).call(this,button);toolbar_classPrivateFieldGet(_buttons,this).prepend(button,toolbar_classPrivateGetter(_EditorToolbar_brand,this,_get_divider));}addColorPicker(colorPicker){toolbar_classPrivateFieldSet(_colorPicker,this,colorPicker);const button=colorPicker.renderButton();toolbar_assertClassBrand(_EditorToolbar_brand,this,_addListenersToElement).call(this,button);toolbar_classPrivateFieldGet(_buttons,this).prepend(button,toolbar_classPrivateGetter(_EditorToolbar_brand,this,_get_divider));}remove(){toolbar_classPrivateFieldGet(_toolbar,this).remove();toolbar_classPrivateFieldGet(_colorPicker,this)?.destroy();toolbar_classPrivateFieldSet(_colorPicker,this,null);}}function _pointerDown(e){e.stopPropagation();}function _focusIn(e){toolbar_classPrivateFieldGet(_editor,this)._focusEventsAllowed=false;e.preventDefault();e.stopPropagation();}function _focusOut(e){toolbar_classPrivateFieldGet(_editor,this)._focusEventsAllowed=true;e.preventDefault();e.stopPropagation();}function _addListenersToElement(element){element.addEventListener("focusin",toolbar_assertClassBrand(_EditorToolbar_brand,this,_focusIn).bind(this),{capture:true});element.addEventListener("focusout",toolbar_assertClassBrand(_EditorToolbar_brand,this,_focusOut).bind(this),{capture:true});element.addEventListener("contextmenu",noContextMenu);}function _addDeleteButton(){const button=document.createElement("button");button.className="delete";button.tabIndex=0;button.setAttribute("data-l10n-id",`pdfjs-editor-remove-${toolbar_classPrivateFieldGet(_editor,this).editorType}-button`);toolbar_assertClassBrand(_EditorToolbar_brand,this,_addListenersToElement).call(this,button);button.addEventListener("click",e=>{toolbar_classPrivateFieldGet(_editor,this)._uiManager.delete();});toolbar_classPrivateFieldGet(_buttons,this).append(button);}function _get_divider(_this){const divider=document.createElement("div");divider.className="divider";return divider;}var _buttons2=/*#__PURE__*/new WeakMap();var _toolbar2=/*#__PURE__*/new WeakMap();var _uiManager=/*#__PURE__*/new WeakMap();var _HighlightToolbar_brand=/*#__PURE__*/new WeakSet();class HighlightToolbar{constructor(uiManager){toolbar_classPrivateMethodInitSpec(this,_HighlightToolbar_brand);toolbar_classPrivateFieldInitSpec(this,_buttons2,null);toolbar_classPrivateFieldInitSpec(this,_toolbar2,null);toolbar_classPrivateFieldInitSpec(this,_uiManager,void 0);toolbar_classPrivateFieldSet(_uiManager,this,uiManager);}show(parent,boxes,isLTR){const[x,y]=toolbar_assertClassBrand(_HighlightToolbar_brand,this,_getLastPoint).call(this,boxes,isLTR);const{style}=toolbar_classPrivateFieldGet(_toolbar2,this)||toolbar_classPrivateFieldSet(_toolbar2,this,toolbar_assertClassBrand(_HighlightToolbar_brand,this,_render).call(this));parent.append(toolbar_classPrivateFieldGet(_toolbar2,this));style.insetInlineEnd=`${100*x}%`;style.top=`calc(${100*y}% + var(--editor-toolbar-vert-offset))`;}hide(){toolbar_classPrivateFieldGet(_toolbar2,this).remove();}}function _render(){const editToolbar=toolbar_classPrivateFieldSet(_toolbar2,this,document.createElement("div"));editToolbar.className="editToolbar";editToolbar.setAttribute("role","toolbar");editToolbar.addEventListener("contextmenu",noContextMenu);const buttons=toolbar_classPrivateFieldSet(_buttons2,this,document.createElement("div"));buttons.className="buttons";editToolbar.append(buttons);toolbar_assertClassBrand(_HighlightToolbar_brand,this,_addHighlightButton).call(this);return editToolbar;}function _getLastPoint(boxes,isLTR){let lastY=0;let lastX=0;for(const box of boxes){const y=box.y+box.height;if(y<lastY){continue;}const x=box.x+(isLTR?box.width:0);if(y>lastY){lastX=x;lastY=y;continue;}if(isLTR){if(x>lastX){lastX=x;}}else if(x<lastX){lastX=x;}}return[isLTR?1-lastX:lastX,lastY];}function _addHighlightButton(){const button=document.createElement("button");button.className="highlightButton";button.tabIndex=0;button.setAttribute("data-l10n-id",`pdfjs-highlight-floating-button1`);const span=document.createElement("span");button.append(span);span.className="visuallyHidden";span.setAttribute("data-l10n-id","pdfjs-highlight-floating-button-label");button.addEventListener("contextmenu",noContextMenu);button.addEventListener("click",()=>{toolbar_classPrivateFieldGet(_uiManager,this).highlightSelection("floating_button");});toolbar_classPrivateFieldGet(_buttons2,this).append(button);}
;// CONCATENATED MODULE: ./src/display/editor/tools.js
var _ImageManager;function tools_classPrivateGetter(s,r,a){return a(tools_assertClassBrand(s,r));}function tools_defineProperty(e,r,t){return(r=tools_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function tools_toPropertyKey(t){var i=tools_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function tools_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function tools_classPrivateMethodInitSpec(e,a){tools_checkPrivateRedeclaration(e,a),a.add(e);}function tools_classPrivateFieldInitSpec(e,t,a){tools_checkPrivateRedeclaration(e,t),t.set(e,a);}function tools_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function tools_classPrivateFieldGet(s,a){return s.get(tools_assertClassBrand(s,a));}function tools_classPrivateFieldSet(s,a,r){return s.set(tools_assertClassBrand(s,a),r),r;}function tools_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}function bindEvents(obj,element,names){for(const name of names){element.addEventListener(name,obj[name].bind(obj));}}function opacityToHex(opacity){return Math.round(Math.min(255,Math.max(1,255*opacity))).toString(16).padStart(2,"0");}var tools_id=/*#__PURE__*/new WeakMap();class IdManager{constructor(){tools_classPrivateFieldInitSpec(this,tools_id,0);}get id(){var _this$id,_this$id2;return`${AnnotationEditorPrefix}${(tools_classPrivateFieldSet(tools_id,this,(_this$id=tools_classPrivateFieldGet(tools_id,this),_this$id2=_this$id++,_this$id)),_this$id2)}`;}}var _baseId=/*#__PURE__*/new WeakMap();var _id2=/*#__PURE__*/new WeakMap();var tools_cache=/*#__PURE__*/new WeakMap();var _ImageManager_brand=/*#__PURE__*/new WeakSet();class ImageManager{constructor(){tools_classPrivateMethodInitSpec(this,_ImageManager_brand);tools_classPrivateFieldInitSpec(this,_baseId,getUuid());tools_classPrivateFieldInitSpec(this,_id2,0);tools_classPrivateFieldInitSpec(this,tools_cache,null);}static get _isSVGFittingCanvas(){const svg=`data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 1 1" width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" style="fill:red;"/></svg>`;const canvas=new OffscreenCanvas(1,3);const ctx=canvas.getContext("2d");const image=new Image();image.src=svg;const promise=image.decode().then(()=>{ctx.drawImage(image,0,0,1,1,0,0,1,3);return new Uint32Array(ctx.getImageData(0,0,1,1).data.buffer)[0]===0;});return shadow(this,"_isSVGFittingCanvas",promise);}async getFromFile(file){const{lastModified,name,size,type}=file;return tools_assertClassBrand(_ImageManager_brand,this,_get).call(this,`${lastModified}_${name}_${size}_${type}`,file);}async getFromUrl(url){return tools_assertClassBrand(_ImageManager_brand,this,_get).call(this,url,url);}async getFromId(id){tools_classPrivateFieldGet(tools_cache,this)||tools_classPrivateFieldSet(tools_cache,this,new Map());const data=tools_classPrivateFieldGet(tools_cache,this).get(id);if(!data){return null;}if(data.bitmap){data.refCounter+=1;return data;}if(data.file){return this.getFromFile(data.file);}return this.getFromUrl(data.url);}getSvgUrl(id){const data=tools_classPrivateFieldGet(tools_cache,this).get(id);if(!data?.isSvg){return null;}return data.svgUrl;}deleteId(id){tools_classPrivateFieldGet(tools_cache,this)||tools_classPrivateFieldSet(tools_cache,this,new Map());const data=tools_classPrivateFieldGet(tools_cache,this).get(id);if(!data){return;}data.refCounter-=1;if(data.refCounter!==0){return;}data.bitmap=null;}isValidId(id){return id.startsWith(`image_${tools_classPrivateFieldGet(_baseId,this)}_`);}}_ImageManager=ImageManager;async function _get(key,rawData){tools_classPrivateFieldGet(tools_cache,this)||tools_classPrivateFieldSet(tools_cache,this,new Map());let data=tools_classPrivateFieldGet(tools_cache,this).get(key);if(data===null){return null;}if(data?.bitmap){data.refCounter+=1;return data;}try{var _this$id3,_this$id4;data||={bitmap:null,id:`image_${tools_classPrivateFieldGet(_baseId,this)}_${(tools_classPrivateFieldSet(_id2,this,(_this$id3=tools_classPrivateFieldGet(_id2,this),_this$id4=_this$id3++,_this$id3)),_this$id4)}`,refCounter:0,isSvg:false};let image;if(typeof rawData==="string"){data.url=rawData;image=await fetchData(rawData,"blob");}else{image=data.file=rawData;}if(image.type==="image/svg+xml"){const mustRemoveAspectRatioPromise=_ImageManager._isSVGFittingCanvas;const fileReader=new FileReader();const imageElement=new Image();const imagePromise=new Promise((resolve,reject)=>{imageElement.onload=()=>{data.bitmap=imageElement;data.isSvg=true;resolve();};fileReader.onload=async()=>{const url=data.svgUrl=fileReader.result;imageElement.src=(await mustRemoveAspectRatioPromise)?`${url}#svgView(preserveAspectRatio(none))`:url;};imageElement.onerror=fileReader.onerror=reject;});fileReader.readAsDataURL(image);await imagePromise;}else{data.bitmap=await createImageBitmap(image);}data.refCounter=1;}catch(e){console.error(e);data=null;}tools_classPrivateFieldGet(tools_cache,this).set(key,data);if(data){tools_classPrivateFieldGet(tools_cache,this).set(data.id,data);}return data;}var _commands=/*#__PURE__*/new WeakMap();var _locked=/*#__PURE__*/new WeakMap();var _maxSize=/*#__PURE__*/new WeakMap();var _position=/*#__PURE__*/new WeakMap();class CommandManager{constructor(){let maxSize=arguments.length>0&&arguments[0]!==undefined?arguments[0]:128;tools_classPrivateFieldInitSpec(this,_commands,[]);tools_classPrivateFieldInitSpec(this,_locked,false);tools_classPrivateFieldInitSpec(this,_maxSize,void 0);tools_classPrivateFieldInitSpec(this,_position,-1);tools_classPrivateFieldSet(_maxSize,this,maxSize);}add(_ref){let{cmd,undo,post,mustExec,type=NaN,overwriteIfSameType=false,keepUndo=false}=_ref;if(mustExec){cmd();}if(tools_classPrivateFieldGet(_locked,this)){return;}const save={cmd,undo,post,type};if(tools_classPrivateFieldGet(_position,this)===-1){if(tools_classPrivateFieldGet(_commands,this).length>0){tools_classPrivateFieldGet(_commands,this).length=0;}tools_classPrivateFieldSet(_position,this,0);tools_classPrivateFieldGet(_commands,this).push(save);return;}if(overwriteIfSameType&&tools_classPrivateFieldGet(_commands,this)[tools_classPrivateFieldGet(_position,this)].type===type){if(keepUndo){save.undo=tools_classPrivateFieldGet(_commands,this)[tools_classPrivateFieldGet(_position,this)].undo;}tools_classPrivateFieldGet(_commands,this)[tools_classPrivateFieldGet(_position,this)]=save;return;}const next=tools_classPrivateFieldGet(_position,this)+1;if(next===tools_classPrivateFieldGet(_maxSize,this)){tools_classPrivateFieldGet(_commands,this).splice(0,1);}else{tools_classPrivateFieldSet(_position,this,next);if(next<tools_classPrivateFieldGet(_commands,this).length){tools_classPrivateFieldGet(_commands,this).splice(next);}}tools_classPrivateFieldGet(_commands,this).push(save);}undo(){if(tools_classPrivateFieldGet(_position,this)===-1){return;}tools_classPrivateFieldSet(_locked,this,true);const{undo,post}=tools_classPrivateFieldGet(_commands,this)[tools_classPrivateFieldGet(_position,this)];undo();post?.();tools_classPrivateFieldSet(_locked,this,false);tools_classPrivateFieldSet(_position,this,tools_classPrivateFieldGet(_position,this)-1);}redo(){if(tools_classPrivateFieldGet(_position,this)<tools_classPrivateFieldGet(_commands,this).length-1){tools_classPrivateFieldSet(_position,this,tools_classPrivateFieldGet(_position,this)+1);tools_classPrivateFieldSet(_locked,this,true);const{cmd,post}=tools_classPrivateFieldGet(_commands,this)[tools_classPrivateFieldGet(_position,this)];cmd();post?.();tools_classPrivateFieldSet(_locked,this,false);}}hasSomethingToUndo(){return tools_classPrivateFieldGet(_position,this)!==-1;}hasSomethingToRedo(){return tools_classPrivateFieldGet(_position,this)<tools_classPrivateFieldGet(_commands,this).length-1;}destroy(){tools_classPrivateFieldSet(_commands,this,null);}reset(){tools_classPrivateFieldSet(_commands,this,[]);tools_classPrivateFieldSet(_position,this,-1);tools_classPrivateFieldSet(_locked,this,false);}}var _KeyboardManager_brand=/*#__PURE__*/new WeakSet();class KeyboardManager{constructor(callbacks){tools_classPrivateMethodInitSpec(this,_KeyboardManager_brand);this.buffer=[];this.callbacks=new Map();this.allKeys=new Set();const{isMac}=util_FeatureTest.platform;for(const[keys,callback,options={}]of callbacks){for(const key of keys){const isMacKey=key.startsWith("mac+");if(isMac&&isMacKey){this.callbacks.set(key.slice(4),{callback,options});this.allKeys.add(key.split("+").at(-1));}else if(!isMac&&!isMacKey){this.callbacks.set(key,{callback,options});this.allKeys.add(key.split("+").at(-1));}}}}exec(self,event){if(!this.allKeys.has(event.key)){return;}const info=this.callbacks.get(tools_assertClassBrand(_KeyboardManager_brand,this,_serialize).call(this,event));if(!info){return;}const{callback,options:{bubbles=false,args=[],checker=null}}=info;if(checker&&!checker(self,event)){return;}callback.bind(self,...args,event)();if(!bubbles){event.stopPropagation();event.preventDefault();}}}function _serialize(event){if(event.altKey){this.buffer.push("alt");}if(event.ctrlKey){this.buffer.push("ctrl");}if(event.metaKey){this.buffer.push("meta");}if(event.shiftKey){this.buffer.push("shift");}this.buffer.push(event.key);const str=this.buffer.join("+");this.buffer.length=0;return str;}class ColorManager{get _colors(){const colors=new Map([["CanvasText",null],["Canvas",null]]);getColorValues(colors);return shadow(this,"_colors",colors);}convert(color){const rgb=getRGB(color);if(!window.matchMedia("(forced-colors: active)").matches){return rgb;}for(const[name,RGB]of this._colors){if(RGB.every((x,i)=>x===rgb[i])){return ColorManager._colorsMapping.get(name);}}return rgb;}getHexCode(name){const rgb=this._colors.get(name);if(!rgb){return name;}return Util.makeHexColor(...rgb);}}tools_defineProperty(ColorManager,"_colorsMapping",new Map([["CanvasText",[0,0,0]],["Canvas",[255,255,255]]]));var _activeEditor=/*#__PURE__*/new WeakMap();var _allEditors=/*#__PURE__*/new WeakMap();var _allLayers=/*#__PURE__*/new WeakMap();var _altTextManager=/*#__PURE__*/new WeakMap();var _annotationStorage=/*#__PURE__*/new WeakMap();var _changedExistingAnnotations=/*#__PURE__*/new WeakMap();var _commandManager=/*#__PURE__*/new WeakMap();var _currentPageIndex=/*#__PURE__*/new WeakMap();var _deletedAnnotationsElementIds=/*#__PURE__*/new WeakMap();var _draggingEditors=/*#__PURE__*/new WeakMap();var _editorTypes=/*#__PURE__*/new WeakMap();var _editorsToRescale=/*#__PURE__*/new WeakMap();var _enableHighlightFloatingButton=/*#__PURE__*/new WeakMap();var _filterFactory=/*#__PURE__*/new WeakMap();var _focusMainContainerTimeoutId=/*#__PURE__*/new WeakMap();var _highlightColors=/*#__PURE__*/new WeakMap();var _highlightWhenShiftUp=/*#__PURE__*/new WeakMap();var _highlightToolbar=/*#__PURE__*/new WeakMap();var _idManager=/*#__PURE__*/new WeakMap();var _isEnabled=/*#__PURE__*/new WeakMap();var _isWaiting=/*#__PURE__*/new WeakMap();var _lastActiveElement=/*#__PURE__*/new WeakMap();var _mainHighlightColorPicker=/*#__PURE__*/new WeakMap();var _mlManager=/*#__PURE__*/new WeakMap();var _mode=/*#__PURE__*/new WeakMap();var _selectedEditors=/*#__PURE__*/new WeakMap();var _selectedTextNode=/*#__PURE__*/new WeakMap();var _pageColors=/*#__PURE__*/new WeakMap();var _showAllStates=/*#__PURE__*/new WeakMap();var _boundBlur=/*#__PURE__*/new WeakMap();var _boundFocus=/*#__PURE__*/new WeakMap();var _boundCopy=/*#__PURE__*/new WeakMap();var _boundCut=/*#__PURE__*/new WeakMap();var _boundPaste=/*#__PURE__*/new WeakMap();var _boundKeydown=/*#__PURE__*/new WeakMap();var _boundKeyup=/*#__PURE__*/new WeakMap();var _boundOnEditingAction=/*#__PURE__*/new WeakMap();var _boundOnPageChanging=/*#__PURE__*/new WeakMap();var _boundOnScaleChanging=/*#__PURE__*/new WeakMap();var _boundSelectionChange=/*#__PURE__*/new WeakMap();var _boundOnRotationChanging=/*#__PURE__*/new WeakMap();var _previousStates=/*#__PURE__*/new WeakMap();var _translation=/*#__PURE__*/new WeakMap();var _translationTimeoutId=/*#__PURE__*/new WeakMap();var _container=/*#__PURE__*/new WeakMap();var _viewer=/*#__PURE__*/new WeakMap();var _AnnotationEditorUIManager_brand=/*#__PURE__*/new WeakSet();class AnnotationEditorUIManager{static get _keyboardManager(){const proto=AnnotationEditorUIManager.prototype;const arrowChecker=self=>tools_classPrivateFieldGet(_container,self).contains(document.activeElement)&&document.activeElement.tagName!=="BUTTON"&&self.hasSomethingToControl();const textInputChecker=(_self,_ref2)=>{let{target:el}=_ref2;if(el instanceof HTMLInputElement){const{type}=el;return type!=="text"&&type!=="number";}return true;};const small=this.TRANSLATE_SMALL;const big=this.TRANSLATE_BIG;return shadow(this,"_keyboardManager",new KeyboardManager([[["ctrl+a","mac+meta+a"],proto.selectAll,{checker:textInputChecker}],[["ctrl+z","mac+meta+z"],proto.undo,{checker:textInputChecker}],[["ctrl+y","ctrl+shift+z","mac+meta+shift+z","ctrl+shift+Z","mac+meta+shift+Z"],proto.redo,{checker:textInputChecker}],[["Backspace","alt+Backspace","ctrl+Backspace","shift+Backspace","mac+Backspace","mac+alt+Backspace","mac+ctrl+Backspace","Delete","ctrl+Delete","shift+Delete","mac+Delete"],proto.delete,{checker:textInputChecker}],[["Enter","mac+Enter"],proto.addNewEditorFromKeyboard,{checker:(self,_ref3)=>{let{target:el}=_ref3;return!(el instanceof HTMLButtonElement)&&tools_classPrivateFieldGet(_container,self).contains(el)&&!self.isEnterHandled;}}],[[" ","mac+ "],proto.addNewEditorFromKeyboard,{checker:(self,_ref4)=>{let{target:el}=_ref4;return!(el instanceof HTMLButtonElement)&&tools_classPrivateFieldGet(_container,self).contains(document.activeElement);}}],[["Escape","mac+Escape"],proto.unselectAll],[["ArrowLeft","mac+ArrowLeft"],proto.translateSelectedEditors,{args:[-small,0],checker:arrowChecker}],[["ctrl+ArrowLeft","mac+shift+ArrowLeft"],proto.translateSelectedEditors,{args:[-big,0],checker:arrowChecker}],[["ArrowRight","mac+ArrowRight"],proto.translateSelectedEditors,{args:[small,0],checker:arrowChecker}],[["ctrl+ArrowRight","mac+shift+ArrowRight"],proto.translateSelectedEditors,{args:[big,0],checker:arrowChecker}],[["ArrowUp","mac+ArrowUp"],proto.translateSelectedEditors,{args:[0,-small],checker:arrowChecker}],[["ctrl+ArrowUp","mac+shift+ArrowUp"],proto.translateSelectedEditors,{args:[0,-big],checker:arrowChecker}],[["ArrowDown","mac+ArrowDown"],proto.translateSelectedEditors,{args:[0,small],checker:arrowChecker}],[["ctrl+ArrowDown","mac+shift+ArrowDown"],proto.translateSelectedEditors,{args:[0,big],checker:arrowChecker}]]));}constructor(container,viewer,altTextManager,eventBus,pdfDocument,pageColors,highlightColors,enableHighlightFloatingButton,mlManager){tools_classPrivateMethodInitSpec(this,_AnnotationEditorUIManager_brand);tools_classPrivateFieldInitSpec(this,_activeEditor,null);tools_classPrivateFieldInitSpec(this,_allEditors,new Map());tools_classPrivateFieldInitSpec(this,_allLayers,new Map());tools_classPrivateFieldInitSpec(this,_altTextManager,null);tools_classPrivateFieldInitSpec(this,_annotationStorage,null);tools_classPrivateFieldInitSpec(this,_changedExistingAnnotations,null);tools_classPrivateFieldInitSpec(this,_commandManager,new CommandManager());tools_classPrivateFieldInitSpec(this,_currentPageIndex,0);tools_classPrivateFieldInitSpec(this,_deletedAnnotationsElementIds,new Set());tools_classPrivateFieldInitSpec(this,_draggingEditors,null);tools_classPrivateFieldInitSpec(this,_editorTypes,null);tools_classPrivateFieldInitSpec(this,_editorsToRescale,new Set());tools_classPrivateFieldInitSpec(this,_enableHighlightFloatingButton,false);tools_classPrivateFieldInitSpec(this,_filterFactory,null);tools_classPrivateFieldInitSpec(this,_focusMainContainerTimeoutId,null);tools_classPrivateFieldInitSpec(this,_highlightColors,null);tools_classPrivateFieldInitSpec(this,_highlightWhenShiftUp,false);tools_classPrivateFieldInitSpec(this,_highlightToolbar,null);tools_classPrivateFieldInitSpec(this,_idManager,new IdManager());tools_classPrivateFieldInitSpec(this,_isEnabled,false);tools_classPrivateFieldInitSpec(this,_isWaiting,false);tools_classPrivateFieldInitSpec(this,_lastActiveElement,null);tools_classPrivateFieldInitSpec(this,_mainHighlightColorPicker,null);tools_classPrivateFieldInitSpec(this,_mlManager,null);tools_classPrivateFieldInitSpec(this,_mode,AnnotationEditorType.NONE);tools_classPrivateFieldInitSpec(this,_selectedEditors,new Set());tools_classPrivateFieldInitSpec(this,_selectedTextNode,null);tools_classPrivateFieldInitSpec(this,_pageColors,null);tools_classPrivateFieldInitSpec(this,_showAllStates,null);tools_classPrivateFieldInitSpec(this,_boundBlur,this.blur.bind(this));tools_classPrivateFieldInitSpec(this,_boundFocus,this.focus.bind(this));tools_classPrivateFieldInitSpec(this,_boundCopy,this.copy.bind(this));tools_classPrivateFieldInitSpec(this,_boundCut,this.cut.bind(this));tools_classPrivateFieldInitSpec(this,_boundPaste,this.paste.bind(this));tools_classPrivateFieldInitSpec(this,_boundKeydown,this.keydown.bind(this));tools_classPrivateFieldInitSpec(this,_boundKeyup,this.keyup.bind(this));tools_classPrivateFieldInitSpec(this,_boundOnEditingAction,this.onEditingAction.bind(this));tools_classPrivateFieldInitSpec(this,_boundOnPageChanging,this.onPageChanging.bind(this));tools_classPrivateFieldInitSpec(this,_boundOnScaleChanging,this.onScaleChanging.bind(this));tools_classPrivateFieldInitSpec(this,_boundSelectionChange,tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_selectionChange).bind(this));tools_classPrivateFieldInitSpec(this,_boundOnRotationChanging,this.onRotationChanging.bind(this));tools_classPrivateFieldInitSpec(this,_previousStates,{isEditing:false,isEmpty:true,hasSomethingToUndo:false,hasSomethingToRedo:false,hasSelectedEditor:false,hasSelectedText:false});tools_classPrivateFieldInitSpec(this,_translation,[0,0]);tools_classPrivateFieldInitSpec(this,_translationTimeoutId,null);tools_classPrivateFieldInitSpec(this,_container,null);tools_classPrivateFieldInitSpec(this,_viewer,null);tools_classPrivateFieldSet(_container,this,container);tools_classPrivateFieldSet(_viewer,this,viewer);tools_classPrivateFieldSet(_altTextManager,this,altTextManager);this._eventBus=eventBus;this._eventBus._on("editingaction",tools_classPrivateFieldGet(_boundOnEditingAction,this));this._eventBus._on("pagechanging",tools_classPrivateFieldGet(_boundOnPageChanging,this));this._eventBus._on("scalechanging",tools_classPrivateFieldGet(_boundOnScaleChanging,this));this._eventBus._on("rotationchanging",tools_classPrivateFieldGet(_boundOnRotationChanging,this));tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addSelectionListener).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addKeyboardManager).call(this);tools_classPrivateFieldSet(_annotationStorage,this,pdfDocument.annotationStorage);tools_classPrivateFieldSet(_filterFactory,this,pdfDocument.filterFactory);tools_classPrivateFieldSet(_pageColors,this,pageColors);tools_classPrivateFieldSet(_highlightColors,this,highlightColors||null);tools_classPrivateFieldSet(_enableHighlightFloatingButton,this,enableHighlightFloatingButton);tools_classPrivateFieldSet(_mlManager,this,mlManager||null);this.viewParameters={realScale:PixelsPerInch.PDF_TO_CSS_UNITS,rotation:0};this.isShiftKeyDown=false;}destroy(){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeKeyboardManager).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeFocusManager).call(this);this._eventBus._off("editingaction",tools_classPrivateFieldGet(_boundOnEditingAction,this));this._eventBus._off("pagechanging",tools_classPrivateFieldGet(_boundOnPageChanging,this));this._eventBus._off("scalechanging",tools_classPrivateFieldGet(_boundOnScaleChanging,this));this._eventBus._off("rotationchanging",tools_classPrivateFieldGet(_boundOnRotationChanging,this));for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){layer.destroy();}tools_classPrivateFieldGet(_allLayers,this).clear();tools_classPrivateFieldGet(_allEditors,this).clear();tools_classPrivateFieldGet(_editorsToRescale,this).clear();tools_classPrivateFieldSet(_activeEditor,this,null);tools_classPrivateFieldGet(_selectedEditors,this).clear();tools_classPrivateFieldGet(_commandManager,this).destroy();tools_classPrivateFieldGet(_altTextManager,this)?.destroy();tools_classPrivateFieldGet(_highlightToolbar,this)?.hide();tools_classPrivateFieldSet(_highlightToolbar,this,null);if(tools_classPrivateFieldGet(_focusMainContainerTimeoutId,this)){clearTimeout(tools_classPrivateFieldGet(_focusMainContainerTimeoutId,this));tools_classPrivateFieldSet(_focusMainContainerTimeoutId,this,null);}if(tools_classPrivateFieldGet(_translationTimeoutId,this)){clearTimeout(tools_classPrivateFieldGet(_translationTimeoutId,this));tools_classPrivateFieldSet(_translationTimeoutId,this,null);}tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeSelectionListener).call(this);}async mlGuess(data){return tools_classPrivateFieldGet(_mlManager,this)?.guess(data)||null;}get hasMLManager(){return!!tools_classPrivateFieldGet(_mlManager,this);}get hcmFilter(){return shadow(this,"hcmFilter",tools_classPrivateFieldGet(_pageColors,this)?tools_classPrivateFieldGet(_filterFactory,this).addHCMFilter(tools_classPrivateFieldGet(_pageColors,this).foreground,tools_classPrivateFieldGet(_pageColors,this).background):"none");}get direction(){return shadow(this,"direction",getComputedStyle(tools_classPrivateFieldGet(_container,this)).direction);}get highlightColors(){return shadow(this,"highlightColors",tools_classPrivateFieldGet(_highlightColors,this)?new Map(tools_classPrivateFieldGet(_highlightColors,this).split(",").map(pair=>pair.split("=").map(x=>x.trim()))):null);}get highlightColorNames(){return shadow(this,"highlightColorNames",this.highlightColors?new Map(Array.from(this.highlightColors,e=>e.reverse())):null);}setMainHighlightColorPicker(colorPicker){tools_classPrivateFieldSet(_mainHighlightColorPicker,this,colorPicker);}editAltText(editor){tools_classPrivateFieldGet(_altTextManager,this)?.editAltText(this,editor);}onPageChanging(_ref5){let{pageNumber}=_ref5;tools_classPrivateFieldSet(_currentPageIndex,this,pageNumber-1);}focusMainContainer(){tools_classPrivateFieldGet(_container,this).focus();}findParent(x,y){for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){const{x:layerX,y:layerY,width,height}=layer.div.getBoundingClientRect();if(x>=layerX&&x<=layerX+width&&y>=layerY&&y<=layerY+height){return layer;}}return null;}disableUserSelect(){let value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;tools_classPrivateFieldGet(_viewer,this).classList.toggle("noUserSelect",value);}addShouldRescale(editor){tools_classPrivateFieldGet(_editorsToRescale,this).add(editor);}removeShouldRescale(editor){tools_classPrivateFieldGet(_editorsToRescale,this).delete(editor);}onScaleChanging(_ref6){let{scale}=_ref6;this.commitOrRemove();this.viewParameters.realScale=scale*PixelsPerInch.PDF_TO_CSS_UNITS;for(const editor of tools_classPrivateFieldGet(_editorsToRescale,this)){editor.onScaleChanging();}}onRotationChanging(_ref7){let{pagesRotation}=_ref7;this.commitOrRemove();this.viewParameters.rotation=pagesRotation;}highlightSelection(){let methodOfCreation=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";const selection=document.getSelection();if(!selection||selection.isCollapsed){return;}const{anchorNode,anchorOffset,focusNode,focusOffset}=selection;const text=selection.toString();const anchorElement=tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_getAnchorElementForSelection).call(this,selection);const textLayer=anchorElement.closest(".textLayer");const boxes=this.getSelectionBoxes(textLayer);if(!boxes){return;}selection.empty();if(tools_classPrivateFieldGet(_mode,this)===AnnotationEditorType.NONE){this._eventBus.dispatch("showannotationeditorui",{source:this,mode:AnnotationEditorType.HIGHLIGHT});this.showAllEditors("highlight",true,true);}for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){if(layer.hasTextLayer(textLayer)){layer.createAndAddNewEditor({x:0,y:0},false,{methodOfCreation,boxes,anchorNode,anchorOffset,focusNode,focusOffset,text});break;}}}addToAnnotationStorage(editor){if(!editor.isEmpty()&&tools_classPrivateFieldGet(_annotationStorage,this)&&!tools_classPrivateFieldGet(_annotationStorage,this).has(editor.id)){tools_classPrivateFieldGet(_annotationStorage,this).setValue(editor.id,editor);}}blur(){this.isShiftKeyDown=false;if(tools_classPrivateFieldGet(_highlightWhenShiftUp,this)){tools_classPrivateFieldSet(_highlightWhenShiftUp,this,false);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_onSelectEnd).call(this,"main_toolbar");}if(!this.hasSelection){return;}const{activeElement}=document;for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){if(editor.div.contains(activeElement)){tools_classPrivateFieldSet(_lastActiveElement,this,[editor,activeElement]);editor._focusEventsAllowed=false;break;}}}focus(){if(!tools_classPrivateFieldGet(_lastActiveElement,this)){return;}const[lastEditor,lastActiveElement]=tools_classPrivateFieldGet(_lastActiveElement,this);tools_classPrivateFieldSet(_lastActiveElement,this,null);lastActiveElement.addEventListener("focusin",()=>{lastEditor._focusEventsAllowed=true;},{once:true});lastActiveElement.focus();}addEditListeners(){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addKeyboardManager).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addCopyPasteListeners).call(this);}removeEditListeners(){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeKeyboardManager).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeCopyPasteListeners).call(this);}copy(event){event.preventDefault();tools_classPrivateFieldGet(_activeEditor,this)?.commitOrRemove();if(!this.hasSelection){return;}const editors=[];for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){const serialized=editor.serialize(true);if(serialized){editors.push(serialized);}}if(editors.length===0){return;}event.clipboardData.setData("application/pdfjs",JSON.stringify(editors));}cut(event){this.copy(event);this.delete();}paste(event){event.preventDefault();const{clipboardData}=event;for(const item of clipboardData.items){for(const editorType of tools_classPrivateFieldGet(_editorTypes,this)){if(editorType.isHandlingMimeForPasting(item.type)){editorType.paste(item,this.currentLayer);return;}}}const data=clipboardData.getData("application/pdfjs");this.addSerializedEditor(data);}addSerializedEditor(data){let activateEditorIfNecessary=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;let doNotMove=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;let ignorePageNumber=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;if(!data){return;}try{if(typeof data==="string"){data=JSON.parse(data);}}catch(ex){warn(`paste: "${ex.message}".`);return;}if(!Array.isArray(data)){return;}const previousMode=tools_classPrivateFieldGet(_mode,this);if(activateEditorIfNecessary&&previousMode===AnnotationEditorType.NONE){this.updateMode(AnnotationEditorType.FREETEXT);}this.unselectAll();try{const newEditors=[];for(const editor of data){const pageNumberMissing=editor.pageIndex===undefined;const useCurrentPage=ignorePageNumber||pageNumberMissing;const layer=useCurrentPage?this.currentLayer:this.getLayer(editor.pageIndex);const deserializedEditor=layer.deserialize(editor);if(!deserializedEditor){return;}deserializedEditor.doNotMove=doNotMove;newEditors.push(deserializedEditor);}const cmd=()=>{for(const editor of newEditors){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addEditorToLayer).call(this,editor);}tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_selectEditors).call(this,newEditors);};const undo=()=>{for(const editor of newEditors){editor.remove();}};this.addCommands({cmd,undo,mustExec:true});}catch(ex){warn(`paste: "${ex.message}".`);}if(activateEditorIfNecessary&&previousMode!==tools_classPrivateFieldGet(_mode,this)){this.updateMode(previousMode);}}keydown(event){if(!this.isShiftKeyDown&&event.key==="Shift"){this.isShiftKeyDown=true;}if(tools_classPrivateFieldGet(_mode,this)!==AnnotationEditorType.NONE&&!this.isEditorHandlingKeyboard){AnnotationEditorUIManager._keyboardManager.exec(this,event);}}keyup(event){if(this.isShiftKeyDown&&event.key==="Shift"){this.isShiftKeyDown=false;if(tools_classPrivateFieldGet(_highlightWhenShiftUp,this)){tools_classPrivateFieldSet(_highlightWhenShiftUp,this,false);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_onSelectEnd).call(this,"main_toolbar");}}}onEditingAction(_ref8){let{name}=_ref8;switch(name){case"undo":case"redo":case"delete":case"selectAll":this[name]();break;case"highlightSelection":this.highlightSelection("context_menu");break;}}setEditingState(isEditing){if(isEditing){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addFocusManager).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addCopyPasteListeners).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{isEditing:tools_classPrivateFieldGet(_mode,this)!==AnnotationEditorType.NONE,isEmpty:tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_isEmpty).call(this),hasSomethingToUndo:tools_classPrivateFieldGet(_commandManager,this).hasSomethingToUndo(),hasSomethingToRedo:tools_classPrivateFieldGet(_commandManager,this).hasSomethingToRedo(),hasSelectedEditor:false});}else{tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeFocusManager).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_removeCopyPasteListeners).call(this);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{isEditing:false});this.disableUserSelect(false);}}registerEditorTypes(types){if(tools_classPrivateFieldGet(_editorTypes,this)){return;}tools_classPrivateFieldSet(_editorTypes,this,types);for(const editorType of tools_classPrivateFieldGet(_editorTypes,this)){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,editorType.defaultPropertiesToUpdate);}}getId(){return tools_classPrivateFieldGet(_idManager,this).id;}get currentLayer(){return tools_classPrivateFieldGet(_allLayers,this).get(tools_classPrivateFieldGet(_currentPageIndex,this));}getLayer(pageIndex){return tools_classPrivateFieldGet(_allLayers,this).get(pageIndex);}get currentPageIndex(){return tools_classPrivateFieldGet(_currentPageIndex,this);}addLayer(layer){tools_classPrivateFieldGet(_allLayers,this).set(layer.pageIndex,layer);if(tools_classPrivateFieldGet(_isEnabled,this)){layer.enable();}else{layer.disable();}}removeLayer(layer){tools_classPrivateFieldGet(_allLayers,this).delete(layer.pageIndex);}updateMode(mode){let editId=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let isFromKeyboard=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(tools_classPrivateFieldGet(_mode,this)===mode){return;}tools_classPrivateFieldSet(_mode,this,mode);if(mode===AnnotationEditorType.NONE){this.setEditingState(false);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_disableAll).call(this);return;}this.setEditingState(true);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_enableAll).call(this);this.unselectAll();for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){layer.updateMode(mode);}if(!editId&&isFromKeyboard){this.addNewEditorFromKeyboard();return;}if(!editId){return;}for(const editor of tools_classPrivateFieldGet(_allEditors,this).values()){if(editor.annotationElementId===editId){this.setSelected(editor);editor.enterInEditMode();break;}}}addNewEditorFromKeyboard(){if(this.currentLayer.canCreateNewEmptyEditor()){this.currentLayer.addNewEditor();}}updateToolbar(mode){if(mode===tools_classPrivateFieldGet(_mode,this)){return;}this._eventBus.dispatch("switchannotationeditormode",{source:this,mode});}updateParams(type,value){if(!tools_classPrivateFieldGet(_editorTypes,this)){return;}switch(type){case AnnotationEditorParamsType.CREATE:this.currentLayer.addNewEditor();return;case AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR:tools_classPrivateFieldGet(_mainHighlightColorPicker,this)?.updateColor(value);break;case AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL:this._eventBus.dispatch("reporttelemetry",{source:this,details:{type:"editing",data:{type:"highlight",action:"toggle_visibility"}}});(tools_classPrivateFieldGet(_showAllStates,this)||tools_classPrivateFieldSet(_showAllStates,this,new Map())).set(type,value);this.showAllEditors("highlight",value);break;}for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){editor.updateParams(type,value);}for(const editorType of tools_classPrivateFieldGet(_editorTypes,this)){editorType.updateDefaultParams(type,value);}}showAllEditors(type,visible){let updateButton=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;for(const editor of tools_classPrivateFieldGet(_allEditors,this).values()){if(editor.editorType===type){editor.show(visible);}}const state=tools_classPrivateFieldGet(_showAllStates,this)?.get(AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL)??true;if(state!==visible){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,[[AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL,visible]]);}}enableWaiting(){let mustWait=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(tools_classPrivateFieldGet(_isWaiting,this)===mustWait){return;}tools_classPrivateFieldSet(_isWaiting,this,mustWait);for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){if(mustWait){layer.disableClick();}else{layer.enableClick();}layer.div.classList.toggle("waiting",mustWait);}}getEditors(pageIndex){const editors=[];for(const editor of tools_classPrivateFieldGet(_allEditors,this).values()){if(editor.pageIndex===pageIndex){editors.push(editor);}}return editors;}getEditor(id){return tools_classPrivateFieldGet(_allEditors,this).get(id);}addEditor(editor){tools_classPrivateFieldGet(_allEditors,this).set(editor.id,editor);}removeEditor(editor){if(editor.div.contains(document.activeElement)){if(tools_classPrivateFieldGet(_focusMainContainerTimeoutId,this)){clearTimeout(tools_classPrivateFieldGet(_focusMainContainerTimeoutId,this));}tools_classPrivateFieldSet(_focusMainContainerTimeoutId,this,setTimeout(()=>{this.focusMainContainer();tools_classPrivateFieldSet(_focusMainContainerTimeoutId,this,null);},0));}tools_classPrivateFieldGet(_allEditors,this).delete(editor.id);this.unselect(editor);if(!editor.annotationElementId||!tools_classPrivateFieldGet(_deletedAnnotationsElementIds,this).has(editor.annotationElementId)){tools_classPrivateFieldGet(_annotationStorage,this)?.remove(editor.id);}}addDeletedAnnotationElement(editor){tools_classPrivateFieldGet(_deletedAnnotationsElementIds,this).add(editor.annotationElementId);this.addChangedExistingAnnotation(editor);editor.deleted=true;}isDeletedAnnotationElement(annotationElementId){return tools_classPrivateFieldGet(_deletedAnnotationsElementIds,this).has(annotationElementId);}removeDeletedAnnotationElement(editor){tools_classPrivateFieldGet(_deletedAnnotationsElementIds,this).delete(editor.annotationElementId);this.removeChangedExistingAnnotation(editor);editor.deleted=false;}setActiveEditor(editor){if(tools_classPrivateFieldGet(_activeEditor,this)===editor){return;}tools_classPrivateFieldSet(_activeEditor,this,editor);if(editor){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,editor.propertiesToUpdate);}}updateUI(editor){if(tools_classPrivateGetter(_AnnotationEditorUIManager_brand,this,_get_lastSelectedEditor)===editor){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,editor.propertiesToUpdate);}}toggleSelected(editor){if(tools_classPrivateFieldGet(_selectedEditors,this).has(editor)){tools_classPrivateFieldGet(_selectedEditors,this).delete(editor);editor.unselect();tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedEditor:this.hasSelection});return;}tools_classPrivateFieldGet(_selectedEditors,this).add(editor);editor.select();tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,editor.propertiesToUpdate);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedEditor:true});}setSelected(editor){for(const ed of tools_classPrivateFieldGet(_selectedEditors,this)){if(ed!==editor){ed.unselect();}}tools_classPrivateFieldGet(_selectedEditors,this).clear();tools_classPrivateFieldGet(_selectedEditors,this).add(editor);editor.select();tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,editor.propertiesToUpdate);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedEditor:true});}isSelected(editor){return tools_classPrivateFieldGet(_selectedEditors,this).has(editor);}get firstSelectedEditor(){return tools_classPrivateFieldGet(_selectedEditors,this).values().next().value;}unselect(editor){editor.unselect();tools_classPrivateFieldGet(_selectedEditors,this).delete(editor);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedEditor:this.hasSelection});}get hasSelection(){return tools_classPrivateFieldGet(_selectedEditors,this).size!==0;}get isEnterHandled(){return tools_classPrivateFieldGet(_selectedEditors,this).size===1&&this.firstSelectedEditor.isEnterHandled;}undo(){tools_classPrivateFieldGet(_commandManager,this).undo();tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSomethingToUndo:tools_classPrivateFieldGet(_commandManager,this).hasSomethingToUndo(),hasSomethingToRedo:true,isEmpty:tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_isEmpty).call(this)});}redo(){tools_classPrivateFieldGet(_commandManager,this).redo();tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSomethingToUndo:true,hasSomethingToRedo:tools_classPrivateFieldGet(_commandManager,this).hasSomethingToRedo(),isEmpty:tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_isEmpty).call(this)});}addCommands(params){tools_classPrivateFieldGet(_commandManager,this).add(params);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSomethingToUndo:true,hasSomethingToRedo:false,isEmpty:tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_isEmpty).call(this)});}delete(){this.commitOrRemove();if(!this.hasSelection){return;}const editors=[...tools_classPrivateFieldGet(_selectedEditors,this)];const cmd=()=>{for(const editor of editors){editor.remove();}};const undo=()=>{for(const editor of editors){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_addEditorToLayer).call(this,editor);}};this.addCommands({cmd,undo,mustExec:true});}commitOrRemove(){tools_classPrivateFieldGet(_activeEditor,this)?.commitOrRemove();}hasSomethingToControl(){return tools_classPrivateFieldGet(_activeEditor,this)||this.hasSelection;}selectAll(){for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){editor.commit();}tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_selectEditors).call(this,tools_classPrivateFieldGet(_allEditors,this).values());}unselectAll(){if(tools_classPrivateFieldGet(_activeEditor,this)){tools_classPrivateFieldGet(_activeEditor,this).commitOrRemove();if(tools_classPrivateFieldGet(_mode,this)!==AnnotationEditorType.NONE){return;}}if(!this.hasSelection){return;}for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){editor.unselect();}tools_classPrivateFieldGet(_selectedEditors,this).clear();tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedEditor:false});}translateSelectedEditors(x,y){let noCommit=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(!noCommit){this.commitOrRemove();}if(!this.hasSelection){return;}tools_classPrivateFieldGet(_translation,this)[0]+=x;tools_classPrivateFieldGet(_translation,this)[1]+=y;const[totalX,totalY]=tools_classPrivateFieldGet(_translation,this);const editors=[...tools_classPrivateFieldGet(_selectedEditors,this)];const TIME_TO_WAIT=1000;if(tools_classPrivateFieldGet(_translationTimeoutId,this)){clearTimeout(tools_classPrivateFieldGet(_translationTimeoutId,this));}tools_classPrivateFieldSet(_translationTimeoutId,this,setTimeout(()=>{tools_classPrivateFieldSet(_translationTimeoutId,this,null);tools_classPrivateFieldGet(_translation,this)[0]=tools_classPrivateFieldGet(_translation,this)[1]=0;this.addCommands({cmd:()=>{for(const editor of editors){if(tools_classPrivateFieldGet(_allEditors,this).has(editor.id)){editor.translateInPage(totalX,totalY);}}},undo:()=>{for(const editor of editors){if(tools_classPrivateFieldGet(_allEditors,this).has(editor.id)){editor.translateInPage(-totalX,-totalY);}}},mustExec:false});},TIME_TO_WAIT));for(const editor of editors){editor.translateInPage(x,y);}}setUpDragSession(){if(!this.hasSelection){return;}this.disableUserSelect(true);tools_classPrivateFieldSet(_draggingEditors,this,new Map());for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){tools_classPrivateFieldGet(_draggingEditors,this).set(editor,{savedX:editor.x,savedY:editor.y,savedPageIndex:editor.pageIndex,newX:0,newY:0,newPageIndex:-1});}}endDragSession(){if(!tools_classPrivateFieldGet(_draggingEditors,this)){return false;}this.disableUserSelect(false);const map=tools_classPrivateFieldGet(_draggingEditors,this);tools_classPrivateFieldSet(_draggingEditors,this,null);let mustBeAddedInUndoStack=false;for(const[{x,y,pageIndex},value]of map){value.newX=x;value.newY=y;value.newPageIndex=pageIndex;mustBeAddedInUndoStack||=x!==value.savedX||y!==value.savedY||pageIndex!==value.savedPageIndex;}if(!mustBeAddedInUndoStack){return false;}const move=(editor,x,y,pageIndex)=>{if(tools_classPrivateFieldGet(_allEditors,this).has(editor.id)){const parent=tools_classPrivateFieldGet(_allLayers,this).get(pageIndex);if(parent){editor._setParentAndPosition(parent,x,y);}else{editor.pageIndex=pageIndex;editor.x=x;editor.y=y;}}};this.addCommands({cmd:()=>{for(const[editor,{newX,newY,newPageIndex,savedX,savedY,savedPageIndex}]of map){move(editor,newX,newY,newPageIndex);this._eventBus?.dispatch("annotation-editor-event",{source:editor,type:"moved",page:newPageIndex+1,editorType:editor.constructor.name,previousValue:{x:savedX,y:savedY,page:savedPageIndex+1},value:{x:newX,y:newY,page:newPageIndex+1}});}},undo:()=>{for(const[editor,{savedX,savedY,savedPageIndex}]of map){move(editor,savedX,savedY,savedPageIndex);}},mustExec:true});return true;}dragSelectedEditors(tx,ty){if(!tools_classPrivateFieldGet(_draggingEditors,this)){return;}for(const editor of tools_classPrivateFieldGet(_draggingEditors,this).keys()){editor.drag(tx,ty);}}rebuild(editor){if(editor.parent===null){const parent=this.getLayer(editor.pageIndex);if(parent){parent.changeParent(editor);parent.addOrRebuild(editor);}else{this.addEditor(editor);this.addToAnnotationStorage(editor);editor.rebuild();}}else{editor.parent.addOrRebuild(editor);}}get isEditorHandlingKeyboard(){return this.getActive()?.shouldGetKeyboardEvents()||tools_classPrivateFieldGet(_selectedEditors,this).size===1&&this.firstSelectedEditor.shouldGetKeyboardEvents();}isActive(editor){return tools_classPrivateFieldGet(_activeEditor,this)===editor;}getActive(){return tools_classPrivateFieldGet(_activeEditor,this);}getMode(){return tools_classPrivateFieldGet(_mode,this);}get imageManager(){return shadow(this,"imageManager",new ImageManager());}removeEditors(){let filterFunction=arguments.length>0&&arguments[0]!==undefined?arguments[0]:()=>true;let hasChanged=false;tools_classPrivateFieldGet(_allLayers,this).forEach(layer=>layer.setCleaningUp(true));tools_classPrivateFieldGet(_allEditors,this).forEach(editor=>{if(editor?.serialize()){if(filterFunction(editor.serialize())){editor.remove();hasChanged=true;}}});tools_classPrivateFieldGet(_allLayers,this).forEach(layer=>layer.setCleaningUp(false));if(hasChanged){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSomethingToUndo:false,hasSomethingToRedo:false,isEmpty:tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_isEmpty).call(this)});tools_classPrivateFieldGet(_commandManager,this).reset();}}getSelectionBoxes(textLayer){if(!textLayer){return null;}const selection=document.getSelection();for(let i=0,ii=selection.rangeCount;i<ii;i++){if(!textLayer.contains(selection.getRangeAt(i).commonAncestorContainer)){return null;}}const{x:layerX,y:layerY,width:parentWidth,height:parentHeight}=textLayer.getBoundingClientRect();let rotator;switch(textLayer.getAttribute("data-main-rotation")){case"90":rotator=(x,y,w,h)=>({x:(y-layerY)/parentHeight,y:1-(x+w-layerX)/parentWidth,width:h/parentHeight,height:w/parentWidth});break;case"180":rotator=(x,y,w,h)=>({x:1-(x+w-layerX)/parentWidth,y:1-(y+h-layerY)/parentHeight,width:w/parentWidth,height:h/parentHeight});break;case"270":rotator=(x,y,w,h)=>({x:1-(y+h-layerY)/parentHeight,y:(x-layerX)/parentWidth,width:h/parentHeight,height:w/parentWidth});break;default:rotator=(x,y,w,h)=>({x:(x-layerX)/parentWidth,y:(y-layerY)/parentHeight,width:w/parentWidth,height:h/parentHeight});break;}const boxes=[];for(let i=0,ii=selection.rangeCount;i<ii;i++){const range=selection.getRangeAt(i);if(range.collapsed){continue;}for(const{x,y,width,height}of range.getClientRects()){if(width===0||height===0){continue;}boxes.push(rotator(x,y,width,height));}}return boxes.length===0?null:boxes;}addChangedExistingAnnotation(_ref9){let{annotationElementId,id}=_ref9;(tools_classPrivateFieldGet(_changedExistingAnnotations,this)||tools_classPrivateFieldSet(_changedExistingAnnotations,this,new Map())).set(annotationElementId,id);}removeChangedExistingAnnotation(_ref10){let{annotationElementId}=_ref10;tools_classPrivateFieldGet(_changedExistingAnnotations,this)?.delete(annotationElementId);}renderAnnotationElement(annotation){const editorId=tools_classPrivateFieldGet(_changedExistingAnnotations,this)?.get(annotation.data.id);if(!editorId){return;}const editor=tools_classPrivateFieldGet(_annotationStorage,this).getRawValue(editorId);if(!editor){return;}if(tools_classPrivateFieldGet(_mode,this)===AnnotationEditorType.NONE&&!editor.hasBeenModified){return;}editor.renderAnnotationElement(annotation);}}function _getAnchorElementForSelection(_ref11){let{anchorNode}=_ref11;return anchorNode.nodeType===Node.TEXT_NODE?anchorNode.parentElement:anchorNode;}function _displayHighlightToolbar(){const selection=document.getSelection();if(!selection||selection.isCollapsed){return;}const anchorElement=tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_getAnchorElementForSelection).call(this,selection);const textLayer=anchorElement.closest(".textLayer");const boxes=this.getSelectionBoxes(textLayer);if(!boxes){return;}tools_classPrivateFieldGet(_highlightToolbar,this)||tools_classPrivateFieldSet(_highlightToolbar,this,new HighlightToolbar(this));tools_classPrivateFieldGet(_highlightToolbar,this).show(textLayer,boxes,this.direction==="ltr");}function _selectionChange(){const selection=document.getSelection();if(!selection||selection.isCollapsed){if(tools_classPrivateFieldGet(_selectedTextNode,this)){tools_classPrivateFieldGet(_highlightToolbar,this)?.hide();tools_classPrivateFieldSet(_selectedTextNode,this,null);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedText:false});}return;}const{anchorNode}=selection;if(anchorNode===tools_classPrivateFieldGet(_selectedTextNode,this)){return;}const anchorElement=tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_getAnchorElementForSelection).call(this,selection);const textLayer=anchorElement.closest(".textLayer");if(!textLayer){if(tools_classPrivateFieldGet(_selectedTextNode,this)){tools_classPrivateFieldGet(_highlightToolbar,this)?.hide();tools_classPrivateFieldSet(_selectedTextNode,this,null);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedText:false});}return;}tools_classPrivateFieldGet(_highlightToolbar,this)?.hide();tools_classPrivateFieldSet(_selectedTextNode,this,anchorNode);tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedText:true});if(tools_classPrivateFieldGet(_mode,this)!==AnnotationEditorType.HIGHLIGHT&&tools_classPrivateFieldGet(_mode,this)!==AnnotationEditorType.NONE){return;}if(tools_classPrivateFieldGet(_mode,this)===AnnotationEditorType.HIGHLIGHT){this.showAllEditors("highlight",true,true);}tools_classPrivateFieldSet(_highlightWhenShiftUp,this,this.isShiftKeyDown);if(!this.isShiftKeyDown){const pointerup=e=>{if(e.type==="pointerup"&&e.button!==0){return;}window.removeEventListener("pointerup",pointerup);window.removeEventListener("blur",pointerup);if(e.type==="pointerup"){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_onSelectEnd).call(this,"main_toolbar");}};window.addEventListener("pointerup",pointerup);window.addEventListener("blur",pointerup);}}function _onSelectEnd(){let methodOfCreation=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";if(tools_classPrivateFieldGet(_mode,this)===AnnotationEditorType.HIGHLIGHT){this.highlightSelection(methodOfCreation);}else if(tools_classPrivateFieldGet(_enableHighlightFloatingButton,this)){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_displayHighlightToolbar).call(this);}}function _addSelectionListener(){document.addEventListener("selectionchange",tools_classPrivateFieldGet(_boundSelectionChange,this));}function _removeSelectionListener(){document.removeEventListener("selectionchange",tools_classPrivateFieldGet(_boundSelectionChange,this));}function _addFocusManager(){window.addEventListener("focus",tools_classPrivateFieldGet(_boundFocus,this));window.addEventListener("blur",tools_classPrivateFieldGet(_boundBlur,this));}function _removeFocusManager(){window.removeEventListener("focus",tools_classPrivateFieldGet(_boundFocus,this));window.removeEventListener("blur",tools_classPrivateFieldGet(_boundBlur,this));}function _addKeyboardManager(){window.addEventListener("keydown",tools_classPrivateFieldGet(_boundKeydown,this));window.addEventListener("keyup",tools_classPrivateFieldGet(_boundKeyup,this));}function _removeKeyboardManager(){window.removeEventListener("keydown",tools_classPrivateFieldGet(_boundKeydown,this));window.removeEventListener("keyup",tools_classPrivateFieldGet(_boundKeyup,this));}function _addCopyPasteListeners(){document.addEventListener("copy",tools_classPrivateFieldGet(_boundCopy,this));document.addEventListener("cut",tools_classPrivateFieldGet(_boundCut,this));document.addEventListener("paste",tools_classPrivateFieldGet(_boundPaste,this));}function _removeCopyPasteListeners(){document.removeEventListener("copy",tools_classPrivateFieldGet(_boundCopy,this));document.removeEventListener("cut",tools_classPrivateFieldGet(_boundCut,this));document.removeEventListener("paste",tools_classPrivateFieldGet(_boundPaste,this));}function _dispatchUpdateStates(details){const hasChanged=Object.entries(details).some(_ref12=>{let[key,value]=_ref12;return tools_classPrivateFieldGet(_previousStates,this)[key]!==value;});if(hasChanged){this._eventBus.dispatch("annotationeditorstateschanged",{source:this,details:Object.assign(tools_classPrivateFieldGet(_previousStates,this),details)});if(tools_classPrivateFieldGet(_mode,this)===AnnotationEditorType.HIGHLIGHT&&details.hasSelectedEditor===false){tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateUI).call(this,[[AnnotationEditorParamsType.HIGHLIGHT_FREE,true]]);}}}function _dispatchUpdateUI(details){this._eventBus.dispatch("annotationeditorparamschanged",{source:this,details});}function _enableAll(){if(!tools_classPrivateFieldGet(_isEnabled,this)){tools_classPrivateFieldSet(_isEnabled,this,true);for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){layer.enable();}for(const editor of tools_classPrivateFieldGet(_allEditors,this).values()){editor.enable();}}}function _disableAll(){this.unselectAll();if(tools_classPrivateFieldGet(_isEnabled,this)){tools_classPrivateFieldSet(_isEnabled,this,false);for(const layer of tools_classPrivateFieldGet(_allLayers,this).values()){layer.disable();}for(const editor of tools_classPrivateFieldGet(_allEditors,this).values()){editor.disable();}}}function _addEditorToLayer(editor){const layer=tools_classPrivateFieldGet(_allLayers,this).get(editor.pageIndex);if(layer){layer.addOrRebuild(editor);}else{this.addEditor(editor);this.addToAnnotationStorage(editor);}}function _get_lastSelectedEditor(_this){let ed=null;for(ed of tools_classPrivateFieldGet(_selectedEditors,_this)){}return ed;}function _isEmpty(){if(tools_classPrivateFieldGet(_allEditors,this).size===0){return true;}if(tools_classPrivateFieldGet(_allEditors,this).size===1){for(const editor of tools_classPrivateFieldGet(_allEditors,this).values()){return editor.isEmpty();}}return false;}function _selectEditors(editors){for(const editor of tools_classPrivateFieldGet(_selectedEditors,this)){editor.unselect();}tools_classPrivateFieldGet(_selectedEditors,this).clear();for(const editor of editors){if(editor.isEmpty()){continue;}tools_classPrivateFieldGet(_selectedEditors,this).add(editor);editor.select();}tools_assertClassBrand(_AnnotationEditorUIManager_brand,this,_dispatchUpdateStates).call(this,{hasSelectedEditor:this.hasSelection});}tools_defineProperty(AnnotationEditorUIManager,"TRANSLATE_SMALL",1);tools_defineProperty(AnnotationEditorUIManager,"TRANSLATE_BIG",10);
;// CONCATENATED MODULE: ./src/display/editor/alt_text.js
var _AltText;function alt_text_classPrivateMethodInitSpec(e,a){alt_text_checkPrivateRedeclaration(e,a),a.add(e);}function alt_text_defineProperty(e,r,t){return(r=alt_text_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function alt_text_toPropertyKey(t){var i=alt_text_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function alt_text_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function alt_text_classPrivateFieldInitSpec(e,t,a){alt_text_checkPrivateRedeclaration(e,t),t.set(e,a);}function alt_text_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function alt_text_classPrivateFieldGet(s,a){return s.get(alt_text_assertClassBrand(s,a));}function alt_text_classPrivateFieldSet(s,a,r){return s.set(alt_text_assertClassBrand(s,a),r),r;}function alt_text_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _altText=/*#__PURE__*/new WeakMap();var _altTextDecorative=/*#__PURE__*/new WeakMap();var _altTextButton=/*#__PURE__*/new WeakMap();var _altTextTooltip=/*#__PURE__*/new WeakMap();var _altTextTooltipTimeout=/*#__PURE__*/new WeakMap();var _altTextWasFromKeyBoard=/*#__PURE__*/new WeakMap();var alt_text_editor=/*#__PURE__*/new WeakMap();var _AltText_brand=/*#__PURE__*/new WeakSet();class AltText{constructor(editor){alt_text_classPrivateMethodInitSpec(this,_AltText_brand);alt_text_classPrivateFieldInitSpec(this,_altText,"");alt_text_classPrivateFieldInitSpec(this,_altTextDecorative,false);alt_text_classPrivateFieldInitSpec(this,_altTextButton,null);alt_text_classPrivateFieldInitSpec(this,_altTextTooltip,null);alt_text_classPrivateFieldInitSpec(this,_altTextTooltipTimeout,null);alt_text_classPrivateFieldInitSpec(this,_altTextWasFromKeyBoard,false);alt_text_classPrivateFieldInitSpec(this,alt_text_editor,null);alt_text_classPrivateFieldSet(alt_text_editor,this,editor);}static initialize(l10nPromise){AltText._l10nPromise||=l10nPromise;}async render(){const altText=alt_text_classPrivateFieldSet(_altTextButton,this,document.createElement("button"));altText.className="altText";const msg=await AltText._l10nPromise.get("pdfjs-editor-alt-text-button-label");altText.textContent=msg;altText.setAttribute("aria-label",msg);altText.tabIndex="0";altText.addEventListener("contextmenu",noContextMenu);altText.addEventListener("pointerdown",event=>event.stopPropagation());const onClick=event=>{event.preventDefault();alt_text_classPrivateFieldGet(alt_text_editor,this)._uiManager.editAltText(alt_text_classPrivateFieldGet(alt_text_editor,this));};altText.addEventListener("click",onClick,{capture:true});altText.addEventListener("keydown",event=>{if(event.target===altText&&event.key==="Enter"){alt_text_classPrivateFieldSet(_altTextWasFromKeyBoard,this,true);onClick(event);}});await alt_text_assertClassBrand(_AltText_brand,this,_setState).call(this);return altText;}finish(){if(!alt_text_classPrivateFieldGet(_altTextButton,this)){return;}alt_text_classPrivateFieldGet(_altTextButton,this).focus({focusVisible:alt_text_classPrivateFieldGet(_altTextWasFromKeyBoard,this)});alt_text_classPrivateFieldSet(_altTextWasFromKeyBoard,this,false);}isEmpty(){return!alt_text_classPrivateFieldGet(_altText,this)&&!alt_text_classPrivateFieldGet(_altTextDecorative,this);}get data(){return{altText:alt_text_classPrivateFieldGet(_altText,this),decorative:alt_text_classPrivateFieldGet(_altTextDecorative,this)};}set data(_ref){let{altText,decorative}=_ref;if(alt_text_classPrivateFieldGet(_altText,this)===altText&&alt_text_classPrivateFieldGet(_altTextDecorative,this)===decorative){return;}alt_text_classPrivateFieldSet(_altText,this,altText);alt_text_classPrivateFieldSet(_altTextDecorative,this,decorative);alt_text_assertClassBrand(_AltText_brand,this,_setState).call(this);}toggle(){let enabled=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(!alt_text_classPrivateFieldGet(_altTextButton,this)){return;}if(!enabled&&alt_text_classPrivateFieldGet(_altTextTooltipTimeout,this)){clearTimeout(alt_text_classPrivateFieldGet(_altTextTooltipTimeout,this));alt_text_classPrivateFieldSet(_altTextTooltipTimeout,this,null);}alt_text_classPrivateFieldGet(_altTextButton,this).disabled=!enabled;}destroy(){alt_text_classPrivateFieldGet(_altTextButton,this)?.remove();alt_text_classPrivateFieldSet(_altTextButton,this,null);alt_text_classPrivateFieldSet(_altTextTooltip,this,null);}}_AltText=AltText;async function _setState(){const button=alt_text_classPrivateFieldGet(_altTextButton,this);if(!button){return;}if(!alt_text_classPrivateFieldGet(_altText,this)&&!alt_text_classPrivateFieldGet(_altTextDecorative,this)){button.classList.remove("done");alt_text_classPrivateFieldGet(_altTextTooltip,this)?.remove();return;}button.classList.add("done");_AltText._l10nPromise.get("pdfjs-editor-alt-text-edit-button-label").then(msg=>{button.setAttribute("aria-label",msg);});let tooltip=alt_text_classPrivateFieldGet(_altTextTooltip,this);if(!tooltip){alt_text_classPrivateFieldSet(_altTextTooltip,this,tooltip=document.createElement("span"));tooltip.className="tooltip";tooltip.setAttribute("role","tooltip");const id=tooltip.id=`alt-text-tooltip-${alt_text_classPrivateFieldGet(alt_text_editor,this).id}`;button.setAttribute("aria-describedby",id);const DELAY_TO_SHOW_TOOLTIP=100;button.addEventListener("mouseenter",()=>{alt_text_classPrivateFieldSet(_altTextTooltipTimeout,this,setTimeout(()=>{alt_text_classPrivateFieldSet(_altTextTooltipTimeout,this,null);alt_text_classPrivateFieldGet(_altTextTooltip,this).classList.add("show");alt_text_classPrivateFieldGet(alt_text_editor,this)._reportTelemetry({action:"alt_text_tooltip"});},DELAY_TO_SHOW_TOOLTIP));});button.addEventListener("mouseleave",()=>{if(alt_text_classPrivateFieldGet(_altTextTooltipTimeout,this)){clearTimeout(alt_text_classPrivateFieldGet(_altTextTooltipTimeout,this));alt_text_classPrivateFieldSet(_altTextTooltipTimeout,this,null);}alt_text_classPrivateFieldGet(_altTextTooltip,this)?.classList.remove("show");});}tooltip.innerText=alt_text_classPrivateFieldGet(_altTextDecorative,this)?await _AltText._l10nPromise.get("pdfjs-editor-alt-text-decorative-tooltip"):alt_text_classPrivateFieldGet(_altText,this);if(!tooltip.parentNode){button.append(tooltip);}const element=alt_text_classPrivateFieldGet(alt_text_editor,this).getImageForAltText();element?.setAttribute("aria-describedby",tooltip.id);}alt_text_defineProperty(AltText,"_l10nPromise",null);
;// CONCATENATED MODULE: ./src/display/editor/editor.js
var _AnnotationEditor;function editor_classPrivateMethodInitSpec(e,a){editor_checkPrivateRedeclaration(e,a),a.add(e);}function editor_defineProperty(e,r,t){return(r=editor_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function editor_toPropertyKey(t){var i=editor_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function editor_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function editor_classPrivateFieldInitSpec(e,t,a){editor_checkPrivateRedeclaration(e,t),t.set(e,a);}function editor_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function editor_classPrivateFieldSet(s,a,r){return s.set(editor_assertClassBrand(s,a),r),r;}function editor_classPrivateFieldGet(s,a){return s.get(editor_assertClassBrand(s,a));}function editor_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _allResizerDivs=/*#__PURE__*/new WeakMap();var editor_altText=/*#__PURE__*/new WeakMap();var _disabled=/*#__PURE__*/new WeakMap();var _keepAspectRatio=/*#__PURE__*/new WeakMap();var _resizersDiv=/*#__PURE__*/new WeakMap();var _savedDimensions=/*#__PURE__*/new WeakMap();var _boundFocusin=/*#__PURE__*/new WeakMap();var _boundFocusout=/*#__PURE__*/new WeakMap();var _editToolbar=/*#__PURE__*/new WeakMap();var _focusedResizerName=/*#__PURE__*/new WeakMap();var _hasBeenClicked=/*#__PURE__*/new WeakMap();var _initialPosition=/*#__PURE__*/new WeakMap();var _isEditing=/*#__PURE__*/new WeakMap();var _isInEditMode=/*#__PURE__*/new WeakMap();var _isResizerEnabledForKeyboard=/*#__PURE__*/new WeakMap();var _moveInDOMTimeout=/*#__PURE__*/new WeakMap();var _prevDragX=/*#__PURE__*/new WeakMap();var _prevDragY=/*#__PURE__*/new WeakMap();var _telemetryTimeouts=/*#__PURE__*/new WeakMap();var _isDraggable=/*#__PURE__*/new WeakMap();var _zIndex=/*#__PURE__*/new WeakMap();var _AnnotationEditor_brand=/*#__PURE__*/new WeakSet();class AnnotationEditor{static get _resizerKeyboardManager(){const resize=AnnotationEditor.prototype._resizeWithKeyboard;const small=AnnotationEditorUIManager.TRANSLATE_SMALL;const big=AnnotationEditorUIManager.TRANSLATE_BIG;return shadow(this,"_resizerKeyboardManager",new KeyboardManager([[["ArrowLeft","mac+ArrowLeft"],resize,{args:[-small,0]}],[["ctrl+ArrowLeft","mac+shift+ArrowLeft"],resize,{args:[-big,0]}],[["ArrowRight","mac+ArrowRight"],resize,{args:[small,0]}],[["ctrl+ArrowRight","mac+shift+ArrowRight"],resize,{args:[big,0]}],[["ArrowUp","mac+ArrowUp"],resize,{args:[0,-small]}],[["ctrl+ArrowUp","mac+shift+ArrowUp"],resize,{args:[0,-big]}],[["ArrowDown","mac+ArrowDown"],resize,{args:[0,small]}],[["ctrl+ArrowDown","mac+shift+ArrowDown"],resize,{args:[0,big]}],[["Escape","mac+Escape"],AnnotationEditor.prototype._stopResizingWithKeyboard]]));}constructor(parameters){editor_classPrivateMethodInitSpec(this,_AnnotationEditor_brand);editor_classPrivateFieldInitSpec(this,_allResizerDivs,null);editor_classPrivateFieldInitSpec(this,editor_altText,null);editor_classPrivateFieldInitSpec(this,_disabled,false);editor_classPrivateFieldInitSpec(this,_keepAspectRatio,false);editor_classPrivateFieldInitSpec(this,_resizersDiv,null);editor_classPrivateFieldInitSpec(this,_savedDimensions,null);editor_classPrivateFieldInitSpec(this,_boundFocusin,this.focusin.bind(this));editor_classPrivateFieldInitSpec(this,_boundFocusout,this.focusout.bind(this));editor_classPrivateFieldInitSpec(this,_editToolbar,null);editor_classPrivateFieldInitSpec(this,_focusedResizerName,"");editor_classPrivateFieldInitSpec(this,_hasBeenClicked,false);editor_classPrivateFieldInitSpec(this,_initialPosition,null);editor_classPrivateFieldInitSpec(this,_isEditing,false);editor_classPrivateFieldInitSpec(this,_isInEditMode,false);editor_classPrivateFieldInitSpec(this,_isResizerEnabledForKeyboard,false);editor_classPrivateFieldInitSpec(this,_moveInDOMTimeout,null);editor_classPrivateFieldInitSpec(this,_prevDragX,0);editor_classPrivateFieldInitSpec(this,_prevDragY,0);editor_classPrivateFieldInitSpec(this,_telemetryTimeouts,null);editor_defineProperty(this,"_initialOptions",Object.create(null));editor_defineProperty(this,"_isVisible",true);editor_defineProperty(this,"_uiManager",null);editor_defineProperty(this,"_focusEventsAllowed",true);editor_defineProperty(this,"_l10nPromise",null);editor_classPrivateFieldInitSpec(this,_isDraggable,false);editor_classPrivateFieldInitSpec(this,_zIndex,AnnotationEditor._zIndex++);editor_defineProperty(this,"doNotMove",false);if(this.constructor===AnnotationEditor){unreachable("Cannot initialize AnnotationEditor.");}this.parent=parameters.parent;this.id=parameters.id;this.width=this.height=null;this.pageIndex=parameters.parent.pageIndex;this.name=parameters.name;this.div=null;this._uiManager=parameters.uiManager;this.annotationElementId=null;this._willKeepAspectRatio=false;this._initialOptions.isCentered=parameters.isCentered;this._structTreeParentId=null;const{rotation:_rotation,rawDims:{pageWidth:_pageWidth,pageHeight:_pageHeight,pageX,pageY}}=this.parent.viewport;this.rotation=_rotation;this.pageRotation=(360+_rotation-this._uiManager.viewParameters.rotation)%360;this.pageDimensions=[_pageWidth,_pageHeight];this.pageTranslation=[pageX,pageY];const[_width,_height]=this.parentDimensions;this.x=parameters.x/_width;this.y=parameters.y/_height;this.isAttachedToDOM=false;this.deleted=false;this.eventBus=parameters.eventBus;}get editorType(){return Object.getPrototypeOf(this).constructor._type;}static get _defaultLineColor(){return shadow(this,"_defaultLineColor",this._colorManager.getHexCode("CanvasText"));}static deleteAnnotationElement(editor){const fakeEditor=new FakeEditor({id:editor.parent.getNextId(),parent:editor.parent,uiManager:editor._uiManager});fakeEditor.annotationElementId=editor.annotationElementId;fakeEditor.deleted=true;fakeEditor._uiManager.addToAnnotationStorage(fakeEditor);}static initialize(l10n,_uiManager,options){AnnotationEditor._l10nPromise||=new Map(["pdfjs-editor-alt-text-button-label","pdfjs-editor-alt-text-edit-button-label","pdfjs-editor-alt-text-decorative-tooltip","pdfjs-editor-resizer-label-topLeft","pdfjs-editor-resizer-label-topMiddle","pdfjs-editor-resizer-label-topRight","pdfjs-editor-resizer-label-middleRight","pdfjs-editor-resizer-label-bottomRight","pdfjs-editor-resizer-label-bottomMiddle","pdfjs-editor-resizer-label-bottomLeft","pdfjs-editor-resizer-label-middleLeft"].map(str=>[str,l10n.get(str.replaceAll(/([A-Z])/g,c=>`-${c.toLowerCase()}`))]));if(options?.strings){for(const str of options.strings){AnnotationEditor._l10nPromise.set(str,l10n.get(str));}}if(AnnotationEditor._borderLineWidth!==-1){return;}const style=getComputedStyle(document.documentElement);AnnotationEditor._borderLineWidth=parseFloat(style.getPropertyValue("--outline-width"))||0;}static updateDefaultParams(_type,_value){}static get defaultPropertiesToUpdate(){return[];}static isHandlingMimeForPasting(mime){return false;}static paste(item,parent){unreachable("Not implemented");}get propertiesToUpdate(){return[];}get _isDraggable(){return editor_classPrivateFieldGet(_isDraggable,this);}set _isDraggable(value){editor_classPrivateFieldSet(_isDraggable,this,value);this.div?.classList.toggle("draggable",value);}get isEnterHandled(){return true;}center(){const[pageWidth,pageHeight]=this.pageDimensions;switch(this.parentRotation){case 90:this.x-=this.height*pageHeight/(pageWidth*2);this.y+=this.width*pageWidth/(pageHeight*2);break;case 180:this.x+=this.width/2;this.y+=this.height/2;break;case 270:this.x+=this.height*pageHeight/(pageWidth*2);this.y-=this.width*pageWidth/(pageHeight*2);break;default:this.x-=this.width/2;this.y-=this.height/2;break;}this.fixAndSetPosition();}addCommands(params){this._uiManager.addCommands(params);}get currentLayer(){return this._uiManager.currentLayer;}setInBackground(){this.div.style.zIndex=0;}setInForeground(){this.div.style.zIndex=editor_classPrivateFieldGet(_zIndex,this);}setParent(parent){if(parent!==null){this.pageIndex=parent.pageIndex;this.pageDimensions=parent.pageDimensions;}else{editor_assertClassBrand(_AnnotationEditor_brand,this,_stopResizing).call(this);}this.parent=parent;}focusin(event){if(!this._focusEventsAllowed){return;}if(!editor_classPrivateFieldGet(_hasBeenClicked,this)){this.parent.setSelected(this);}else{editor_classPrivateFieldSet(_hasBeenClicked,this,false);}}focusout(event){if(!this._focusEventsAllowed){return;}if(!this.isAttachedToDOM){return;}const target=event.relatedTarget;if(target?.closest(`#${this.id}`)){return;}event.preventDefault();if(!this.parent?.isMultipleSelection){this.commitOrRemove();}}commitOrRemove(){if(this.isEmpty()){this.remove();}else{this.commit();}}commit(){this.addToAnnotationStorage();this._eventBus?.dispatch("annotation-editor-event",{source:this,type:"commit",page:this.pageIndex+1,editorType:this.constructor.name,value:this});}addToAnnotationStorage(){this._uiManager.addToAnnotationStorage(this);}setAt(x,y,tx,ty){const[width,height]=this.parentDimensions;[tx,ty]=this.screenToPageTranslation(tx,ty);if(this.doNotMove){[tx,ty]=[0,0];}this.x=(x+tx)/width;this.y=(y+ty)/height;this.fixAndSetPosition();}translate(x,y){editor_assertClassBrand(_AnnotationEditor_brand,this,_translate).call(this,this.parentDimensions,x,y);}translateInPage(x,y){editor_classPrivateFieldGet(_initialPosition,this)||editor_classPrivateFieldSet(_initialPosition,this,[this.x,this.y]);editor_assertClassBrand(_AnnotationEditor_brand,this,_translate).call(this,this.pageDimensions,x,y);this.div.scrollIntoView({block:"nearest"});}drag(tx,ty){editor_classPrivateFieldGet(_initialPosition,this)||editor_classPrivateFieldSet(_initialPosition,this,[this.x,this.y]);const[parentWidth,parentHeight]=this.parentDimensions;this.x+=tx/parentWidth;this.y+=ty/parentHeight;if(this.parent&&(this.x<0||this.x>1||this.y<0||this.y>1)){const{x,y}=this.div.getBoundingClientRect();if(this.parent.findNewParent(this,x,y)){this.x-=Math.floor(this.x);this.y-=Math.floor(this.y);}}let{x,y}=this;const[bx,by]=this.getBaseTranslation();x+=bx;y+=by;this.div.style.left=`${(100*x).toFixed(2)}%`;this.div.style.top=`${(100*y).toFixed(2)}%`;this.div.scrollIntoView({block:"nearest"});}get _hasBeenMoved(){return!!editor_classPrivateFieldGet(_initialPosition,this)&&(editor_classPrivateFieldGet(_initialPosition,this)[0]!==this.x||editor_classPrivateFieldGet(_initialPosition,this)[1]!==this.y);}getBaseTranslation(){const[parentWidth,parentHeight]=this.parentDimensions;const{_borderLineWidth}=AnnotationEditor;const x=_borderLineWidth/parentWidth;const y=_borderLineWidth/parentHeight;switch(this.rotation){case 90:return[-x,y];case 180:return[x,y];case 270:return[x,-y];default:return[-x,-y];}}get _mustFixPosition(){return true;}fixAndSetPosition(){let rotation=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.rotation;const[pageWidth,pageHeight]=this.pageDimensions;let{x,y,width,height}=this;width*=pageWidth;height*=pageHeight;x*=pageWidth;y*=pageHeight;if(this._mustFixPosition){switch(rotation){case 0:x=Math.max(0,Math.min(pageWidth-width,x));y=Math.max(0,Math.min(pageHeight-height,y));break;case 90:x=Math.max(0,Math.min(pageWidth-height,x));y=Math.min(pageHeight,Math.max(width,y));break;case 180:x=Math.min(pageWidth,Math.max(width,x));y=Math.min(pageHeight,Math.max(height,y));break;case 270:x=Math.min(pageWidth,Math.max(height,x));y=Math.max(0,Math.min(pageHeight-width,y));break;}}this.x=x/=pageWidth;this.y=y/=pageHeight;const[bx,by]=this.getBaseTranslation();x+=bx;y+=by;const{style}=this.div;style.left=`${(100*x).toFixed(2)}%`;style.top=`${(100*y).toFixed(2)}%`;this.moveInDOM();}screenToPageTranslation(x,y){return _rotatePoint.call(AnnotationEditor,x,y,this.parentRotation);}pageTranslationToScreen(x,y){return _rotatePoint.call(AnnotationEditor,x,y,360-this.parentRotation);}get parentScale(){return this._uiManager.viewParameters.realScale;}get parentRotation(){return(this._uiManager.viewParameters.rotation+this.pageRotation)%360;}get parentDimensions(){const{parentScale,pageDimensions:[pageWidth,pageHeight]}=this;const scaledWidth=pageWidth*parentScale;const scaledHeight=pageHeight*parentScale;return util_FeatureTest.isCSSRoundSupported?[Math.round(scaledWidth),Math.round(scaledHeight)]:[scaledWidth,scaledHeight];}setDims(width,height){const[parentWidth,parentHeight]=this.parentDimensions;this.div.style.width=`${(100*width/parentWidth).toFixed(2)}%`;if(!editor_classPrivateFieldGet(_keepAspectRatio,this)){this.div.style.height=`${(100*height/parentHeight).toFixed(2)}%`;}}fixDims(){const{style}=this.div;const{height,width}=style;const widthPercent=width.endsWith("%");const heightPercent=!editor_classPrivateFieldGet(_keepAspectRatio,this)&&height.endsWith("%");if(widthPercent&&heightPercent){return;}const[parentWidth,parentHeight]=this.parentDimensions;if(!widthPercent){style.width=`${(100*parseFloat(width)/parentWidth).toFixed(2)}%`;}if(!editor_classPrivateFieldGet(_keepAspectRatio,this)&&!heightPercent){style.height=`${(100*parseFloat(height)/parentHeight).toFixed(2)}%`;}}getInitialTranslation(){return[0,0];}altTextFinish(){editor_classPrivateFieldGet(editor_altText,this)?.finish();this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"altTextChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:editor_classPrivateFieldGet(editor_altText,this)});}async addEditToolbar(){if(editor_classPrivateFieldGet(_editToolbar,this)||editor_classPrivateFieldGet(_isInEditMode,this)){return editor_classPrivateFieldGet(_editToolbar,this);}editor_classPrivateFieldSet(_editToolbar,this,new EditorToolbar(this));this.div.append(editor_classPrivateFieldGet(_editToolbar,this).render());if(editor_classPrivateFieldGet(editor_altText,this)){editor_classPrivateFieldGet(_editToolbar,this).addAltTextButton(await editor_classPrivateFieldGet(editor_altText,this).render());}return editor_classPrivateFieldGet(_editToolbar,this);}removeEditToolbar(){if(!editor_classPrivateFieldGet(_editToolbar,this)){return;}editor_classPrivateFieldGet(_editToolbar,this).remove();editor_classPrivateFieldSet(_editToolbar,this,null);editor_classPrivateFieldGet(editor_altText,this)?.destroy();}getClientDimensions(){return this.div.getBoundingClientRect();}async addAltTextButton(){if(editor_classPrivateFieldGet(editor_altText,this)){return;}AltText.initialize(AnnotationEditor._l10nPromise);editor_classPrivateFieldSet(editor_altText,this,new AltText(this));await this.addEditToolbar();}get altTextData(){return editor_classPrivateFieldGet(editor_altText,this)?.data;}set altTextData(data){if(!editor_classPrivateFieldGet(editor_altText,this)){return;}editor_classPrivateFieldGet(editor_altText,this).data=data;}hasAltText(){return!editor_classPrivateFieldGet(editor_altText,this)?.isEmpty();}render(){this.div=document.createElement("div");this.div.setAttribute("data-editor-rotation",(360-this.rotation)%360);this.div.className=this.name;this.div.setAttribute("id",this.id);this.div.tabIndex=editor_classPrivateFieldGet(_disabled,this)?-1:0;if(!this._isVisible){this.div.classList.add("hidden");}this.setInForeground();this.div.addEventListener("focusin",editor_classPrivateFieldGet(_boundFocusin,this));this.div.addEventListener("focusout",editor_classPrivateFieldGet(_boundFocusout,this));const[parentWidth,parentHeight]=this.parentDimensions;if(this.parentRotation%180!==0){this.div.style.maxWidth=`${(100*parentHeight/parentWidth).toFixed(2)}%`;this.div.style.maxHeight=`${(100*parentWidth/parentHeight).toFixed(2)}%`;}const[tx,ty]=this.getInitialTranslation();this.translate(tx,ty);bindEvents(this,this.div,["pointerdown"]);return this.div;}pointerdown(event){const{isMac}=util_FeatureTest.platform;if(event.button!==0||event.ctrlKey&&isMac){event.preventDefault();return;}editor_classPrivateFieldSet(_hasBeenClicked,this,true);if(this._isDraggable){editor_assertClassBrand(_AnnotationEditor_brand,this,_setUpDragSession).call(this,event);return;}editor_assertClassBrand(_AnnotationEditor_brand,this,_selectOnPointerEvent).call(this,event);}moveInDOM(){if(editor_classPrivateFieldGet(_moveInDOMTimeout,this)){clearTimeout(editor_classPrivateFieldGet(_moveInDOMTimeout,this));}editor_classPrivateFieldSet(_moveInDOMTimeout,this,setTimeout(()=>{editor_classPrivateFieldSet(_moveInDOMTimeout,this,null);this.parent?.moveEditorInDOM(this);},0));}_setParentAndPosition(parent,x,y){parent.changeParent(this);this.x=x;this.y=y;this.fixAndSetPosition();}getRect(tx,ty){let rotation=arguments.length>2&&arguments[2]!==undefined?arguments[2]:this.rotation;const scale=this.parentScale;const[pageWidth,pageHeight]=this.pageDimensions;const[pageX,pageY]=this.pageTranslation;const shiftX=tx/scale;const shiftY=ty/scale;const x=this.x*pageWidth;const y=this.y*pageHeight;const width=this.width*pageWidth;const height=this.height*pageHeight;switch(rotation){case 0:return[x+shiftX+pageX,pageHeight-y-shiftY-height+pageY,x+shiftX+width+pageX,pageHeight-y-shiftY+pageY];case 90:return[x+shiftY+pageX,pageHeight-y+shiftX+pageY,x+shiftY+height+pageX,pageHeight-y+shiftX+width+pageY];case 180:return[x-shiftX-width+pageX,pageHeight-y+shiftY+pageY,x-shiftX+pageX,pageHeight-y+shiftY+height+pageY];case 270:return[x-shiftY-height+pageX,pageHeight-y-shiftX-width+pageY,x-shiftY+pageX,pageHeight-y-shiftX+pageY];default:throw new Error("Invalid rotation");}}getRectInCurrentCoords(rect,pageHeight){const[x1,y1,x2,y2]=rect;const width=x2-x1;const height=y2-y1;switch(this.rotation){case 0:return[x1,pageHeight-y2,width,height];case 90:return[x1,pageHeight-y1,height,width];case 180:return[x2,pageHeight-y1,width,height];case 270:return[x2,pageHeight-y2,height,width];default:throw new Error("Invalid rotation");}}onceAdded(){}isEmpty(){return false;}enableEditMode(){editor_classPrivateFieldSet(_isInEditMode,this,true);}disableEditMode(){editor_classPrivateFieldSet(_isInEditMode,this,false);}isInEditMode(){return editor_classPrivateFieldGet(_isInEditMode,this);}shouldGetKeyboardEvents(){return editor_classPrivateFieldGet(_isResizerEnabledForKeyboard,this);}needsToBeRebuilt(){return this.div&&!this.isAttachedToDOM;}rebuild(){this.div?.addEventListener("focusin",editor_classPrivateFieldGet(_boundFocusin,this));this.div?.addEventListener("focusout",editor_classPrivateFieldGet(_boundFocusout,this));}rotate(_angle){}serialize(){let isForCopying=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;let context=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;unreachable("An editor must be serializable");}static deserialize(data,parent,uiManager){const editor=new this.prototype.constructor({parent,id:parent.getNextId(),uiManager});editor.rotation=data.rotation;const[pageWidth,pageHeight]=editor.pageDimensions;const[x,y,width,height]=editor.getRectInCurrentCoords(data.rect,pageHeight);editor.x=x/pageWidth;editor.y=y/pageHeight;editor.width=width/pageWidth;editor.height=height/pageHeight;return editor;}get hasBeenModified(){return!!this.annotationElementId&&(this.deleted||this.serialize()!==null);}remove(){this.div.removeEventListener("focusin",editor_classPrivateFieldGet(_boundFocusin,this));this.div.removeEventListener("focusout",editor_classPrivateFieldGet(_boundFocusout,this));if(!this.isEmpty()){this.commit();}if(this.parent){this.parent.remove(this);}else{this._uiManager.removeEditor(this);}if(editor_classPrivateFieldGet(_moveInDOMTimeout,this)){clearTimeout(editor_classPrivateFieldGet(_moveInDOMTimeout,this));editor_classPrivateFieldSet(_moveInDOMTimeout,this,null);}editor_assertClassBrand(_AnnotationEditor_brand,this,_stopResizing).call(this);this.removeEditToolbar();if(editor_classPrivateFieldGet(_telemetryTimeouts,this)){for(const timeout of editor_classPrivateFieldGet(_telemetryTimeouts,this).values()){clearTimeout(timeout);}editor_classPrivateFieldSet(_telemetryTimeouts,this,null);}this.parent=null;this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"removed",page:this.pageIndex+1,editorType:this.constructor.name,value:this});}get isResizable(){return false;}makeResizable(){if(this.isResizable){editor_assertClassBrand(_AnnotationEditor_brand,this,_createResizers).call(this);editor_classPrivateFieldGet(_resizersDiv,this).classList.remove("hidden");bindEvents(this,this.div,["keydown"]);}}get toolbarPosition(){return null;}keydown(event){if(!this.isResizable||event.target!==this.div||event.key!=="Enter"){return;}this._uiManager.setSelected(this);editor_classPrivateFieldSet(_savedDimensions,this,{savedX:this.x,savedY:this.y,savedWidth:this.width,savedHeight:this.height});const children=editor_classPrivateFieldGet(_resizersDiv,this).children;if(!editor_classPrivateFieldGet(_allResizerDivs,this)){editor_classPrivateFieldSet(_allResizerDivs,this,Array.from(children));const boundResizerKeydown=editor_assertClassBrand(_AnnotationEditor_brand,this,_resizerKeydown).bind(this);const boundResizerBlur=editor_assertClassBrand(_AnnotationEditor_brand,this,_resizerBlur).bind(this);for(const div of editor_classPrivateFieldGet(_allResizerDivs,this)){const name=div.getAttribute("data-resizer-name");div.setAttribute("role","spinbutton");div.addEventListener("keydown",boundResizerKeydown);div.addEventListener("blur",boundResizerBlur);div.addEventListener("focus",editor_assertClassBrand(_AnnotationEditor_brand,this,_resizerFocus).bind(this,name));AnnotationEditor._l10nPromise.get(`pdfjs-editor-resizer-label-${name}`).then(msg=>div.setAttribute("aria-label",msg));}}const first=editor_classPrivateFieldGet(_allResizerDivs,this)[0];let firstPosition=0;for(const div of children){if(div===first){break;}firstPosition++;}const nextFirstPosition=(360-this.rotation+this.parentRotation)%360/90*(editor_classPrivateFieldGet(_allResizerDivs,this).length/4);if(nextFirstPosition!==firstPosition){if(nextFirstPosition<firstPosition){for(let i=0;i<firstPosition-nextFirstPosition;i++){editor_classPrivateFieldGet(_resizersDiv,this).append(editor_classPrivateFieldGet(_resizersDiv,this).firstChild);}}else if(nextFirstPosition>firstPosition){for(let i=0;i<nextFirstPosition-firstPosition;i++){editor_classPrivateFieldGet(_resizersDiv,this).firstChild.before(editor_classPrivateFieldGet(_resizersDiv,this).lastChild);}}let i=0;for(const child of children){const div=editor_classPrivateFieldGet(_allResizerDivs,this)[i++];const name=div.getAttribute("data-resizer-name");AnnotationEditor._l10nPromise.get(`pdfjs-editor-resizer-label-${name}`).then(msg=>child.setAttribute("aria-label",msg));}}editor_assertClassBrand(_AnnotationEditor_brand,this,_setResizerTabIndex).call(this,0);editor_classPrivateFieldSet(_isResizerEnabledForKeyboard,this,true);editor_classPrivateFieldGet(_resizersDiv,this).firstChild.focus({focusVisible:true});event.preventDefault();event.stopImmediatePropagation();}_resizeWithKeyboard(x,y){if(!editor_classPrivateFieldGet(_isResizerEnabledForKeyboard,this)){return;}editor_assertClassBrand(_AnnotationEditor_brand,this,_resizerPointermove).call(this,editor_classPrivateFieldGet(_focusedResizerName,this),{movementX:x,movementY:y});}_stopResizingWithKeyboard(){editor_assertClassBrand(_AnnotationEditor_brand,this,_stopResizing).call(this);this.div.focus();}select(){this.makeResizable();this.div?.classList.add("selectedEditor");if(!editor_classPrivateFieldGet(_editToolbar,this)){this.addEditToolbar().then(()=>{if(this.div?.classList.contains("selectedEditor")){editor_classPrivateFieldGet(_editToolbar,this)?.show();}});return;}editor_classPrivateFieldGet(_editToolbar,this)?.show();}unselect(){editor_classPrivateFieldGet(_resizersDiv,this)?.classList.add("hidden");this.div?.classList.remove("selectedEditor");if(this.div?.contains(document.activeElement)){this._uiManager.currentLayer.div.focus({preventScroll:true});}editor_classPrivateFieldGet(_editToolbar,this)?.hide();}updateParams(type,value){}disableEditing(){}enableEditing(){}enterInEditMode(){}getImageForAltText(){return null;}get contentDiv(){return this.div;}get isEditing(){return editor_classPrivateFieldGet(_isEditing,this);}set isEditing(value){editor_classPrivateFieldSet(_isEditing,this,value);if(!this.parent){return;}if(value){this.parent.setSelected(this);this.parent.setActiveEditor(this);}else{this.parent.setActiveEditor(null);}}setAspectRatio(width,height){editor_classPrivateFieldSet(_keepAspectRatio,this,true);const aspectRatio=width/height;const{style}=this.div;style.aspectRatio=aspectRatio;style.height="auto";}static get MIN_SIZE(){return 16;}static canCreateNewEmptyEditor(){return true;}get telemetryInitialData(){return{action:"added"};}get telemetryFinalData(){return null;}_reportTelemetry(data){let mustWait=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(mustWait){editor_classPrivateFieldGet(_telemetryTimeouts,this)||editor_classPrivateFieldSet(_telemetryTimeouts,this,new Map());const{action}=data;let timeout=editor_classPrivateFieldGet(_telemetryTimeouts,this).get(action);if(timeout){clearTimeout(timeout);}timeout=setTimeout(()=>{this._reportTelemetry(data);editor_classPrivateFieldGet(_telemetryTimeouts,this).delete(action);if(editor_classPrivateFieldGet(_telemetryTimeouts,this).size===0){editor_classPrivateFieldSet(_telemetryTimeouts,this,null);}},AnnotationEditor._telemetryTimeout);editor_classPrivateFieldGet(_telemetryTimeouts,this).set(action,timeout);return;}data.type||=this.editorType;this._uiManager._eventBus.dispatch("reporttelemetry",{source:this,details:{type:"editing",data}});}show(){let visible=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this._isVisible;this.div.classList.toggle("hidden",!visible);this._isVisible=visible;}enable(){if(this.div){this.div.tabIndex=0;}editor_classPrivateFieldSet(_disabled,this,false);}disable(){if(this.div){this.div.tabIndex=-1;}editor_classPrivateFieldSet(_disabled,this,true);}renderAnnotationElement(annotation){let content=annotation.container.querySelector(".annotationContent");if(!content){content=document.createElement("div");content.classList.add("annotationContent",this.editorType);annotation.container.prepend(content);}else if(content.nodeName==="CANVAS"){const canvas=content;content=document.createElement("div");content.classList.add("annotationContent",this.editorType);canvas.before(content);}return content;}resetAnnotationElement(annotation){const{firstChild}=annotation.container;if(firstChild.nodeName==="DIV"&&firstChild.classList.contains("annotationContent")){firstChild.remove();}}}_AnnotationEditor=AnnotationEditor;function _translate(_ref,x,y){let[width,height]=_ref;[x,y]=this.screenToPageTranslation(x,y);this.x+=x/width;this.y+=y/height;this.fixAndSetPosition();}function _rotatePoint(x,y,angle){switch(angle){case 90:return[y,-x];case 180:return[-x,-y];case 270:return[-y,x];default:return[x,y];}}function _getRotationMatrix(rotation){switch(rotation){case 90:{const[pageWidth,pageHeight]=this.pageDimensions;return[0,-pageWidth/pageHeight,pageHeight/pageWidth,0];}case 180:return[-1,0,0,-1];case 270:{const[pageWidth,pageHeight]=this.pageDimensions;return[0,pageWidth/pageHeight,-pageHeight/pageWidth,0];}default:return[1,0,0,1];}}function _createResizers(){if(editor_classPrivateFieldGet(_resizersDiv,this)){return;}editor_classPrivateFieldSet(_resizersDiv,this,document.createElement("div"));editor_classPrivateFieldGet(_resizersDiv,this).classList.add("resizers");const classes=this._willKeepAspectRatio?["topLeft","topRight","bottomRight","bottomLeft"]:["topLeft","topMiddle","topRight","middleRight","bottomRight","bottomMiddle","bottomLeft","middleLeft"];for(const name of classes){const div=document.createElement("div");editor_classPrivateFieldGet(_resizersDiv,this).append(div);div.classList.add("resizer",name);div.setAttribute("data-resizer-name",name);div.addEventListener("pointerdown",editor_assertClassBrand(_AnnotationEditor_brand,this,_resizerPointerdown).bind(this,name));div.addEventListener("contextmenu",noContextMenu);div.tabIndex=-1;}this.div.prepend(editor_classPrivateFieldGet(_resizersDiv,this));}function _resizerPointerdown(name,event){event.preventDefault();const{isMac}=util_FeatureTest.platform;if(event.button!==0||event.ctrlKey&&isMac){return;}editor_classPrivateFieldGet(editor_altText,this)?.toggle(false);const boundResizerPointermove=editor_assertClassBrand(_AnnotationEditor_brand,this,_resizerPointermove).bind(this,name);const savedDraggable=this._isDraggable;this._isDraggable=false;const pointerMoveOptions={passive:true,capture:true};this.parent.togglePointerEvents(false);window.addEventListener("pointermove",boundResizerPointermove,pointerMoveOptions);window.addEventListener("contextmenu",noContextMenu);const savedX=this.x;const savedY=this.y;const savedWidth=this.width;const savedHeight=this.height;const savedParentCursor=this.parent.div.style.cursor;const savedCursor=this.div.style.cursor;this.div.style.cursor=this.parent.div.style.cursor=window.getComputedStyle(event.target).cursor;const pointerUpCallback=()=>{this.parent.togglePointerEvents(true);editor_classPrivateFieldGet(editor_altText,this)?.toggle(true);this._isDraggable=savedDraggable;window.removeEventListener("pointerup",pointerUpCallback);window.removeEventListener("blur",pointerUpCallback);window.removeEventListener("pointermove",boundResizerPointermove,pointerMoveOptions);window.removeEventListener("contextmenu",noContextMenu);this.parent.div.style.cursor=savedParentCursor;this.div.style.cursor=savedCursor;editor_assertClassBrand(_AnnotationEditor_brand,this,_addResizeToUndoStack).call(this,savedX,savedY,savedWidth,savedHeight);};window.addEventListener("pointerup",pointerUpCallback);window.addEventListener("blur",pointerUpCallback);}function _addResizeToUndoStack(savedX,savedY,savedWidth,savedHeight){const newX=this.x;const newY=this.y;const newWidth=this.width;const newHeight=this.height;if(newX===savedX&&newY===savedY&&newWidth===savedWidth&&newHeight===savedHeight){return;}this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"sizeChanged",editorType:this.constructor.name,page:this.pageIndex+1,value:{x:savedX,y:savedY,width:savedWidth,height:savedHeight}});this.addCommands({cmd:()=>{this.width=newWidth;this.height=newHeight;this.x=newX;this.y=newY;const[parentWidth,parentHeight]=this.parentDimensions;this.setDims(parentWidth*newWidth,parentHeight*newHeight);this.fixAndSetPosition();},undo:()=>{this.width=savedWidth;this.height=savedHeight;this.x=savedX;this.y=savedY;const[parentWidth,parentHeight]=this.parentDimensions;this.setDims(parentWidth*savedWidth,parentHeight*savedHeight);this.fixAndSetPosition();},mustExec:true});}function _resizerPointermove(name,event){const[parentWidth,parentHeight]=this.parentDimensions;const savedX=this.x;const savedY=this.y;const savedWidth=this.width;const savedHeight=this.height;const minWidth=_AnnotationEditor.MIN_SIZE/parentWidth;const minHeight=_AnnotationEditor.MIN_SIZE/parentHeight;const round=x=>Math.round(x*10000)/10000;const rotationMatrix=editor_assertClassBrand(_AnnotationEditor_brand,this,_getRotationMatrix).call(this,this.rotation);const transf=(x,y)=>[rotationMatrix[0]*x+rotationMatrix[2]*y,rotationMatrix[1]*x+rotationMatrix[3]*y];const invRotationMatrix=editor_assertClassBrand(_AnnotationEditor_brand,this,_getRotationMatrix).call(this,360-this.rotation);const invTransf=(x,y)=>[invRotationMatrix[0]*x+invRotationMatrix[2]*y,invRotationMatrix[1]*x+invRotationMatrix[3]*y];let getPoint;let getOpposite;let isDiagonal=false;let isHorizontal=false;switch(name){case"topLeft":isDiagonal=true;getPoint=(w,h)=>[0,0];getOpposite=(w,h)=>[w,h];break;case"topMiddle":getPoint=(w,h)=>[w/2,0];getOpposite=(w,h)=>[w/2,h];break;case"topRight":isDiagonal=true;getPoint=(w,h)=>[w,0];getOpposite=(w,h)=>[0,h];break;case"middleRight":isHorizontal=true;getPoint=(w,h)=>[w,h/2];getOpposite=(w,h)=>[0,h/2];break;case"bottomRight":isDiagonal=true;getPoint=(w,h)=>[w,h];getOpposite=(w,h)=>[0,0];break;case"bottomMiddle":getPoint=(w,h)=>[w/2,h];getOpposite=(w,h)=>[w/2,0];break;case"bottomLeft":isDiagonal=true;getPoint=(w,h)=>[0,h];getOpposite=(w,h)=>[w,0];break;case"middleLeft":isHorizontal=true;getPoint=(w,h)=>[0,h/2];getOpposite=(w,h)=>[w,h/2];break;}const point=getPoint(savedWidth,savedHeight);const oppositePoint=getOpposite(savedWidth,savedHeight);let transfOppositePoint=transf(...oppositePoint);const oppositeX=round(savedX+transfOppositePoint[0]);const oppositeY=round(savedY+transfOppositePoint[1]);let ratioX=1;let ratioY=1;let[deltaX,deltaY]=this.screenToPageTranslation(event.movementX,event.movementY);[deltaX,deltaY]=invTransf(deltaX/parentWidth,deltaY/parentHeight);if(isDiagonal){const oldDiag=Math.hypot(savedWidth,savedHeight);ratioX=ratioY=Math.max(Math.min(Math.hypot(oppositePoint[0]-point[0]-deltaX,oppositePoint[1]-point[1]-deltaY)/oldDiag,1/savedWidth,1/savedHeight),minWidth/savedWidth,minHeight/savedHeight);}else if(isHorizontal){ratioX=Math.max(minWidth,Math.min(1,Math.abs(oppositePoint[0]-point[0]-deltaX)))/savedWidth;}else{ratioY=Math.max(minHeight,Math.min(1,Math.abs(oppositePoint[1]-point[1]-deltaY)))/savedHeight;}const newWidth=round(savedWidth*ratioX);const newHeight=round(savedHeight*ratioY);transfOppositePoint=transf(...getOpposite(newWidth,newHeight));const newX=oppositeX-transfOppositePoint[0];const newY=oppositeY-transfOppositePoint[1];this.width=newWidth;this.height=newHeight;this.x=newX;this.y=newY;this.setDims(parentWidth*newWidth,parentHeight*newHeight);this.fixAndSetPosition();}function _selectOnPointerEvent(event){const{isMac}=util_FeatureTest.platform;if(event.ctrlKey&&!isMac||event.shiftKey||event.metaKey&&isMac){this.parent.toggleSelected(this);}else{this.parent.setSelected(this);}}function _setUpDragSession(event){const isSelected=this._uiManager.isSelected(this);this._uiManager.setUpDragSession();let pointerMoveOptions,pointerMoveCallback;if(isSelected){this.div.classList.add("moving");pointerMoveOptions={passive:true,capture:true};editor_classPrivateFieldSet(_prevDragX,this,event.clientX);editor_classPrivateFieldSet(_prevDragY,this,event.clientY);pointerMoveCallback=e=>{const{clientX:x,clientY:y}=e;const[tx,ty]=this.screenToPageTranslation(x-editor_classPrivateFieldGet(_prevDragX,this),y-editor_classPrivateFieldGet(_prevDragY,this));editor_classPrivateFieldSet(_prevDragX,this,x);editor_classPrivateFieldSet(_prevDragY,this,y);this._uiManager.dragSelectedEditors(tx,ty);};window.addEventListener("pointermove",pointerMoveCallback,pointerMoveOptions);}const pointerUpCallback=()=>{window.removeEventListener("pointerup",pointerUpCallback);window.removeEventListener("blur",pointerUpCallback);if(isSelected){this.div.classList.remove("moving");window.removeEventListener("pointermove",pointerMoveCallback,pointerMoveOptions);}editor_classPrivateFieldSet(_hasBeenClicked,this,false);if(!this._uiManager.endDragSession()){editor_assertClassBrand(_AnnotationEditor_brand,this,_selectOnPointerEvent).call(this,event);}};window.addEventListener("pointerup",pointerUpCallback);window.addEventListener("blur",pointerUpCallback);}function _resizerKeydown(event){_AnnotationEditor._resizerKeyboardManager.exec(this,event);}function _resizerBlur(event){if(editor_classPrivateFieldGet(_isResizerEnabledForKeyboard,this)&&event.relatedTarget?.parentNode!==editor_classPrivateFieldGet(_resizersDiv,this)){editor_assertClassBrand(_AnnotationEditor_brand,this,_stopResizing).call(this);}}function _resizerFocus(name){editor_classPrivateFieldSet(_focusedResizerName,this,editor_classPrivateFieldGet(_isResizerEnabledForKeyboard,this)?name:"");}function _setResizerTabIndex(value){if(!editor_classPrivateFieldGet(_allResizerDivs,this)){return;}for(const div of editor_classPrivateFieldGet(_allResizerDivs,this)){div.tabIndex=value;}}function _stopResizing(){editor_classPrivateFieldSet(_isResizerEnabledForKeyboard,this,false);editor_assertClassBrand(_AnnotationEditor_brand,this,_setResizerTabIndex).call(this,-1);if(editor_classPrivateFieldGet(_savedDimensions,this)){const{savedX,savedY,savedWidth,savedHeight}=editor_classPrivateFieldGet(_savedDimensions,this);editor_assertClassBrand(_AnnotationEditor_brand,this,_addResizeToUndoStack).call(this,savedX,savedY,savedWidth,savedHeight);editor_classPrivateFieldSet(_savedDimensions,this,null);}}editor_defineProperty(AnnotationEditor,"_borderLineWidth",-1);editor_defineProperty(AnnotationEditor,"_colorManager",new ColorManager());editor_defineProperty(AnnotationEditor,"_zIndex",1);editor_defineProperty(AnnotationEditor,"_telemetryTimeout",1000);class FakeEditor extends AnnotationEditor{constructor(params){super(params);this.annotationElementId=params.annotationElementId;this.deleted=true;}serialize(){return{id:this.annotationElementId,deleted:true,pageIndex:this.pageIndex};}}
;// CONCATENATED MODULE: ./src/shared/murmurhash3.js
const SEED=0xc3d2e1f0;const MASK_HIGH=0xffff0000;const MASK_LOW=0xffff;class MurmurHash3_64{constructor(seed){this.h1=seed?seed&0xffffffff:SEED;this.h2=seed?seed&0xffffffff:SEED;}update(input){let data,length;if(typeof input==="string"){data=new Uint8Array(input.length*2);length=0;for(let i=0,ii=input.length;i<ii;i++){const code=input.charCodeAt(i);if(code<=0xff){data[length++]=code;}else{data[length++]=code>>>8;data[length++]=code&0xff;}}}else if(ArrayBuffer.isView(input)){data=input.slice();length=data.byteLength;}else{throw new Error("Invalid data format, must be a string or TypedArray.");}const blockCounts=length>>2;const tailLength=length-blockCounts*4;const dataUint32=new Uint32Array(data.buffer,0,blockCounts);let k1=0,k2=0;let h1=this.h1,h2=this.h2;const C1=0xcc9e2d51,C2=0x1b873593;const C1_LOW=C1&MASK_LOW,C2_LOW=C2&MASK_LOW;for(let i=0;i<blockCounts;i++){if(i&1){k1=dataUint32[i];k1=k1*C1&MASK_HIGH|k1*C1_LOW&MASK_LOW;k1=k1<<15|k1>>>17;k1=k1*C2&MASK_HIGH|k1*C2_LOW&MASK_LOW;h1^=k1;h1=h1<<13|h1>>>19;h1=h1*5+0xe6546b64;}else{k2=dataUint32[i];k2=k2*C1&MASK_HIGH|k2*C1_LOW&MASK_LOW;k2=k2<<15|k2>>>17;k2=k2*C2&MASK_HIGH|k2*C2_LOW&MASK_LOW;h2^=k2;h2=h2<<13|h2>>>19;h2=h2*5+0xe6546b64;}}k1=0;switch(tailLength){case 3:k1^=data[blockCounts*4+2]<<16;case 2:k1^=data[blockCounts*4+1]<<8;case 1:k1^=data[blockCounts*4];k1=k1*C1&MASK_HIGH|k1*C1_LOW&MASK_LOW;k1=k1<<15|k1>>>17;k1=k1*C2&MASK_HIGH|k1*C2_LOW&MASK_LOW;if(blockCounts&1){h1^=k1;}else{h2^=k1;}}this.h1=h1;this.h2=h2;}hexdigest(){let h1=this.h1,h2=this.h2;h1^=h2>>>1;h1=h1*0xed558ccd&MASK_HIGH|h1*0x8ccd&MASK_LOW;h2=h2*0xff51afd7&MASK_HIGH|((h2<<16|h1>>>16)*0xafd7ed55&MASK_HIGH)>>>16;h1^=h2>>>1;h1=h1*0x1a85ec53&MASK_HIGH|h1*0xec53&MASK_LOW;h2=h2*0xc4ceb9fe&MASK_HIGH|((h2<<16|h1>>>16)*0xb9fe1a85&MASK_HIGH)>>>16;h1^=h2>>>1;return(h1>>>0).toString(16).padStart(8,"0")+(h2>>>0).toString(16).padStart(8,"0");}}
;// CONCATENATED MODULE: ./src/display/annotation_storage.js
function annotation_storage_classPrivateMethodInitSpec(e,a){annotation_storage_checkPrivateRedeclaration(e,a),a.add(e);}function annotation_storage_classPrivateFieldInitSpec(e,t,a){annotation_storage_checkPrivateRedeclaration(e,t),t.set(e,a);}function annotation_storage_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function annotation_storage_classPrivateFieldSet(s,a,r){return s.set(annotation_storage_assertClassBrand(s,a),r),r;}function annotation_storage_classPrivateFieldGet(s,a){return s.get(annotation_storage_assertClassBrand(s,a));}function annotation_storage_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const SerializableEmpty=Object.freeze({map:null,hash:"",transfer:undefined});var _modified=/*#__PURE__*/new WeakMap();var _storage=/*#__PURE__*/new WeakMap();var _AnnotationStorage_brand=/*#__PURE__*/new WeakSet();class AnnotationStorage{constructor(){annotation_storage_classPrivateMethodInitSpec(this,_AnnotationStorage_brand);annotation_storage_classPrivateFieldInitSpec(this,_modified,false);annotation_storage_classPrivateFieldInitSpec(this,_storage,new Map());this.onSetModified=null;this.onResetModified=null;this.onAnnotationEditor=null;}getValue(key,defaultValue){const value=annotation_storage_classPrivateFieldGet(_storage,this).get(key);if(value===undefined){return defaultValue;}return Object.assign(defaultValue,value);}getRawValue(key){return annotation_storage_classPrivateFieldGet(_storage,this).get(key);}remove(key){annotation_storage_classPrivateFieldGet(_storage,this).delete(key);if(annotation_storage_classPrivateFieldGet(_storage,this).size===0){this.resetModified();}if(typeof this.onAnnotationEditor==="function"){for(const value of annotation_storage_classPrivateFieldGet(_storage,this).values()){if(value instanceof AnnotationEditor){return;}}this.onAnnotationEditor(null);}}setValue(key,value){const obj=annotation_storage_classPrivateFieldGet(_storage,this).get(key);let modified=false;if(obj!==undefined){for(const[entry,val]of Object.entries(value)){if(obj[entry]!==val){modified=true;obj[entry]=val;}}}else{modified=true;annotation_storage_classPrivateFieldGet(_storage,this).set(key,value);}if(modified){annotation_storage_assertClassBrand(_AnnotationStorage_brand,this,_setModified).call(this);}if(value instanceof AnnotationEditor&&typeof this.onAnnotationEditor==="function"){this.onAnnotationEditor(value.constructor._type);}}has(key){return annotation_storage_classPrivateFieldGet(_storage,this).has(key);}getAll(){return annotation_storage_classPrivateFieldGet(_storage,this).size>0?objectFromMap(annotation_storage_classPrivateFieldGet(_storage,this)):null;}setAll(obj){for(const[key,val]of Object.entries(obj)){this.setValue(key,val);}}get size(){return annotation_storage_classPrivateFieldGet(_storage,this).size;}resetModified(){if(annotation_storage_classPrivateFieldGet(_modified,this)){annotation_storage_classPrivateFieldSet(_modified,this,false);if(typeof this.onResetModified==="function"){this.onResetModified();}}}get print(){return new PrintAnnotationStorage(this);}get serializable(){if(annotation_storage_classPrivateFieldGet(_storage,this).size===0){return SerializableEmpty;}const map=new Map(),hash=new MurmurHash3_64(),transfer=[];const context=Object.create(null);let hasBitmap=false;for(const[key,val]of annotation_storage_classPrivateFieldGet(_storage,this)){const serialized=val instanceof AnnotationEditor?val.serialize(false,context):val;if(serialized){map.set(key,serialized);hash.update(`${key}:${JSON.stringify(serialized)}`);hasBitmap||=!!serialized.bitmap;}}if(hasBitmap){for(const value of map.values()){if(value.bitmap){transfer.push(value.bitmap);}}}return map.size>0?{map,hash:hash.hexdigest(),transfer}:SerializableEmpty;}get editorStats(){let stats=null;const typeToEditor=new Map();for(const value of annotation_storage_classPrivateFieldGet(_storage,this).values()){if(!(value instanceof AnnotationEditor)){continue;}const editorStats=value.telemetryFinalData;if(!editorStats){continue;}const{type}=editorStats;if(!typeToEditor.has(type)){typeToEditor.set(type,Object.getPrototypeOf(value).constructor);}stats||=Object.create(null);const map=stats[type]||=new Map();for(const[key,val]of Object.entries(editorStats)){if(key==="type"){continue;}let counters=map.get(key);if(!counters){counters=new Map();map.set(key,counters);}const count=counters.get(val)??0;counters.set(val,count+1);}}for(const[type,editor]of typeToEditor){stats[type]=editor.computeTelemetryFinalData(stats[type]);}return stats;}}function _setModified(){if(!annotation_storage_classPrivateFieldGet(_modified,this)){annotation_storage_classPrivateFieldSet(_modified,this,true);if(typeof this.onSetModified==="function"){this.onSetModified();}}}var _serializable=/*#__PURE__*/new WeakMap();class PrintAnnotationStorage extends AnnotationStorage{constructor(parent){super();annotation_storage_classPrivateFieldInitSpec(this,_serializable,void 0);const{map,hash,transfer}=parent.serializable;const clone=structuredClone(map,transfer?{transfer}:null);annotation_storage_classPrivateFieldSet(_serializable,this,{map:clone,hash,transfer});}get print(){unreachable("Should not call PrintAnnotationStorage.print");}get serializable(){return annotation_storage_classPrivateFieldGet(_serializable,this);}}
;// CONCATENATED MODULE: ./src/display/font_loader.js
function font_loader_classPrivateFieldInitSpec(e,t,a){font_loader_checkPrivateRedeclaration(e,t),t.set(e,a);}function font_loader_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function font_loader_classPrivateFieldGet(s,a){return s.get(font_loader_assertClassBrand(s,a));}function font_loader_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _systemFonts=/*#__PURE__*/new WeakMap();class FontLoader{constructor(_ref){let{ownerDocument=globalThis.document,styleElement=null}=_ref;font_loader_classPrivateFieldInitSpec(this,_systemFonts,new Set());this._document=ownerDocument;this.nativeFontFaces=new Set();this.styleElement=null;this.loadingRequests=[];this.loadTestFontId=0;}addNativeFontFace(nativeFontFace){this.nativeFontFaces.add(nativeFontFace);this._document.fonts.add(nativeFontFace);}removeNativeFontFace(nativeFontFace){this.nativeFontFaces.delete(nativeFontFace);this._document.fonts.delete(nativeFontFace);}insertRule(rule){if(!this.styleElement){this.styleElement=this._document.createElement("style");this._document.documentElement.getElementsByTagName("head")[0].append(this.styleElement);}const styleSheet=this.styleElement.sheet;styleSheet.insertRule(rule,styleSheet.cssRules.length);}clear(){for(const nativeFontFace of this.nativeFontFaces){this._document.fonts.delete(nativeFontFace);}this.nativeFontFaces.clear();font_loader_classPrivateFieldGet(_systemFonts,this).clear();if(this.styleElement){this.styleElement.remove();this.styleElement=null;}}async loadSystemFont(_ref2){let{systemFontInfo:info,_inspectFont}=_ref2;if(!info||font_loader_classPrivateFieldGet(_systemFonts,this).has(info.loadedName)){return;}assert(!this.disableFontFace,"loadSystemFont shouldn't be called when `disableFontFace` is set.");if(this.isFontLoadingAPISupported){const{loadedName,src,style}=info;const fontFace=new FontFace(loadedName,src,style);this.addNativeFontFace(fontFace);try{await fontFace.load();font_loader_classPrivateFieldGet(_systemFonts,this).add(loadedName);_inspectFont?.(info);}catch{warn(`Cannot load system font: ${info.baseFontName}, installing it could help to improve PDF rendering.`);this.removeNativeFontFace(fontFace);}return;}unreachable("Not implemented: loadSystemFont without the Font Loading API.");}async bind(font){if(font.attached||font.missingFile&&!font.systemFontInfo){return;}font.attached=true;if(font.systemFontInfo){await this.loadSystemFont(font);return;}if(this.isFontLoadingAPISupported){const nativeFontFace=font.createNativeFontFace();if(nativeFontFace){this.addNativeFontFace(nativeFontFace);try{await nativeFontFace.loaded;}catch(ex){warn(`Failed to load font '${nativeFontFace.family}': '${ex}'.`);font.disableFontFace=true;throw ex;}}return;}const rule=font.createFontFaceRule();if(rule){this.insertRule(rule);if(this.isSyncFontLoadingSupported){return;}await new Promise(resolve=>{const request=this._queueLoadingCallback(resolve);this._prepareFontLoadEvent(font,request);});}}get isFontLoadingAPISupported(){const hasFonts=!!this._document?.fonts;return shadow(this,"isFontLoadingAPISupported",hasFonts);}get isSyncFontLoadingSupported(){let supported=false;if(isNodeJS){supported=true;}else if(typeof navigator!=="undefined"&&typeof navigator?.userAgent==="string"&&/Mozilla\/5.0.*?rv:\d+.*? Gecko/.test(navigator.userAgent)){supported=true;}return shadow(this,"isSyncFontLoadingSupported",supported);}_queueLoadingCallback(callback){function completeRequest(){assert(!request.done,"completeRequest() cannot be called twice.");request.done=true;while(loadingRequests.length>0&&loadingRequests[0].done){const otherRequest=loadingRequests.shift();setTimeout(otherRequest.callback,0);}}const{loadingRequests}=this;const request={done:false,complete:completeRequest,callback};loadingRequests.push(request);return request;}get _loadTestFont(){const testFont=atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQA"+"FQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAA"+"ALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgA"+"AAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1"+"AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD"+"6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACM"+"AooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4D"+"IP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAA"+"AAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUA"+"AQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgAB"+"AAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABY"+"AAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAA"+"AC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+"AAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAA"+"AAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQAC"+"AQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3"+"Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTj"+"FQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");return shadow(this,"_loadTestFont",testFont);}_prepareFontLoadEvent(font,request){function int32(data,offset){return data.charCodeAt(offset)<<24|data.charCodeAt(offset+1)<<16|data.charCodeAt(offset+2)<<8|data.charCodeAt(offset+3)&0xff;}function spliceString(s,offset,remove,insert){const chunk1=s.substring(0,offset);const chunk2=s.substring(offset+remove);return chunk1+insert+chunk2;}let i,ii;const canvas=this._document.createElement("canvas");canvas.width=1;canvas.height=1;const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const ctx=canvas.getContext("2d",options);let called=0;function isFontReady(name,callback){if(++called>30){warn("Load test font never loaded.");callback();return;}ctx.font="30px "+name;ctx.fillText(".",0,20);const imageData=ctx.getImageData(0,0,1,1);if(imageData.data[3]>0){callback();return;}setTimeout(isFontReady.bind(null,name,callback));}const loadTestFontId=`lt${Date.now()}${this.loadTestFontId++}`;let data=this._loadTestFont;const COMMENT_OFFSET=976;data=spliceString(data,COMMENT_OFFSET,loadTestFontId.length,loadTestFontId);const CFF_CHECKSUM_OFFSET=16;const XXXX_VALUE=0x58585858;let checksum=int32(data,CFF_CHECKSUM_OFFSET);for(i=0,ii=loadTestFontId.length-3;i<ii;i+=4){checksum=checksum-XXXX_VALUE+int32(loadTestFontId,i)|0;}if(i<loadTestFontId.length){checksum=checksum-XXXX_VALUE+int32(loadTestFontId+"XXX",i)|0;}data=spliceString(data,CFF_CHECKSUM_OFFSET,4,string32(checksum));const url=`url(data:font/opentype;base64,${btoa(data)});`;const rule=`@font-face {font-family:"${loadTestFontId}";src:${url}}`;this.insertRule(rule);const div=this._document.createElement("div");div.style.visibility="hidden";div.style.width=div.style.height="10px";div.style.position="absolute";div.style.top=div.style.left="0px";for(const name of[font.loadedName,loadTestFontId]){const span=this._document.createElement("span");span.textContent="Hi";span.style.fontFamily=name;div.append(span);}this._document.body.append(div);isFontReady(loadTestFontId,()=>{div.remove();request.complete();});}}class FontFaceObject{constructor(translatedData,_ref3){let{disableFontFace=false,inspectFont=null}=_ref3;this.compiledGlyphs=Object.create(null);for(const i in translatedData){this[i]=translatedData[i];}this.disableFontFace=disableFontFace===true;this._inspectFont=inspectFont;}createNativeFontFace(){if(!this.data||this.disableFontFace){return null;}let nativeFontFace;if(!this.cssFontInfo){nativeFontFace=new FontFace(this.loadedName,this.data,{});}else{const css={weight:this.cssFontInfo.fontWeight};if(this.cssFontInfo.italicAngle){css.style=`oblique ${this.cssFontInfo.italicAngle}deg`;}nativeFontFace=new FontFace(this.cssFontInfo.fontFamily,this.data,css);}this._inspectFont?.(this);return nativeFontFace;}createFontFaceRule(){if(!this.data||this.disableFontFace){return null;}const data=bytesToString(this.data);const url=`url(data:${this.mimetype};base64,${btoa(data)});`;let rule;if(!this.cssFontInfo){rule=`@font-face {font-family:"${this.loadedName}";src:${url}}`;}else{let css=`font-weight: ${this.cssFontInfo.fontWeight};`;if(this.cssFontInfo.italicAngle){css+=`font-style: oblique ${this.cssFontInfo.italicAngle}deg;`;}rule=`@font-face {font-family:"${this.cssFontInfo.fontFamily}";${css}src:${url}}`;}this._inspectFont?.(this,url);return rule;}getPathGenerator(objs,character){if(this.compiledGlyphs[character]!==undefined){return this.compiledGlyphs[character];}let cmds;try{cmds=objs.get(this.loadedName+"_path_"+character);}catch(ex){warn(`getPathGenerator - ignoring character: "${ex}".`);}if(!Array.isArray(cmds)||cmds.length===0){return this.compiledGlyphs[character]=function(c,size){};}const commands=[];for(let i=0,ii=cmds.length;i<ii;){switch(cmds[i++]){case FontRenderOps.BEZIER_CURVE_TO:{const[a,b,c,d,e,f]=cmds.slice(i,i+6);commands.push(ctx=>ctx.bezierCurveTo(a,b,c,d,e,f));i+=6;}break;case FontRenderOps.MOVE_TO:{const[a,b]=cmds.slice(i,i+2);commands.push(ctx=>ctx.moveTo(a,b));i+=2;}break;case FontRenderOps.LINE_TO:{const[a,b]=cmds.slice(i,i+2);commands.push(ctx=>ctx.lineTo(a,b));i+=2;}break;case FontRenderOps.QUADRATIC_CURVE_TO:{const[a,b,c,d]=cmds.slice(i,i+4);commands.push(ctx=>ctx.quadraticCurveTo(a,b,c,d));i+=4;}break;case FontRenderOps.RESTORE:commands.push(ctx=>ctx.restore());break;case FontRenderOps.SAVE:commands.push(ctx=>ctx.save());break;case FontRenderOps.SCALE:assert(commands.length===2,"Scale command is only valid at the third position.");break;case FontRenderOps.TRANSFORM:{const[a,b,c,d,e,f]=cmds.slice(i,i+6);commands.push(ctx=>ctx.transform(a,b,c,d,e,f));i+=6;}break;case FontRenderOps.TRANSLATE:{const[a,b]=cmds.slice(i,i+2);commands.push(ctx=>ctx.translate(a,b));i+=2;}break;}}return this.compiledGlyphs[character]=function glyphDrawer(ctx,size){commands[0](ctx);commands[1](ctx);ctx.scale(size,-size);for(let i=2,ii=commands.length;i<ii;i++){commands[i](ctx);}};}}
;// CONCATENATED MODULE: ./src/display/node_utils.js
class NodePackages{static get promise(){return undefined;}static get(name){return undefined;}}const node_utils_fetchData=function(url){const fs=NodePackages.get("fs");return fs.promises.readFile(url).then(data=>new Uint8Array(data));};class NodeFilterFactory extends BaseFilterFactory{}class NodeCanvasFactory extends BaseCanvasFactory{_createCanvas(width,height){const canvas=NodePackages.get("canvas");return canvas.createCanvas(width,height);}}class NodeCMapReaderFactory extends BaseCMapReaderFactory{_fetchData(url,compressionType){return node_utils_fetchData(url).then(data=>({cMapData:data,compressionType}));}}class NodeStandardFontDataFactory extends BaseStandardFontDataFactory{_fetchData(url){return node_utils_fetchData(url);}}
;// CONCATENATED MODULE: ./src/display/pattern_helper.js
function pattern_helper_defineProperty(e,r,t){return(r=pattern_helper_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function pattern_helper_toPropertyKey(t){var i=pattern_helper_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function pattern_helper_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}const PathType={FILL:"Fill",STROKE:"Stroke",SHADING:"Shading"};function applyBoundingBox(ctx,bbox){if(!bbox){return;}const width=bbox[2]-bbox[0];const height=bbox[3]-bbox[1];const region=new Path2D();region.rect(bbox[0],bbox[1],width,height);ctx.clip(region);}class BaseShadingPattern{constructor(){if(this.constructor===BaseShadingPattern){unreachable("Cannot initialize BaseShadingPattern.");}}getPattern(){unreachable("Abstract method `getPattern` called.");}}class RadialAxialShadingPattern extends BaseShadingPattern{constructor(IR){super();this._type=IR[1];this._bbox=IR[2];this._colorStops=IR[3];this._p0=IR[4];this._p1=IR[5];this._r0=IR[6];this._r1=IR[7];this.matrix=null;}_createGradient(ctx){let grad;if(this._type==="axial"){grad=ctx.createLinearGradient(this._p0[0],this._p0[1],this._p1[0],this._p1[1]);}else if(this._type==="radial"){grad=ctx.createRadialGradient(this._p0[0],this._p0[1],this._r0,this._p1[0],this._p1[1],this._r1);}for(const colorStop of this._colorStops){grad.addColorStop(colorStop[0],colorStop[1]);}return grad;}getPattern(ctx,owner,inverse,pathType){let pattern;if(pathType===PathType.STROKE||pathType===PathType.FILL){const ownerBBox=owner.current.getClippedPathBoundingBox(pathType,getCurrentTransform(ctx))||[0,0,0,0];const width=Math.ceil(ownerBBox[2]-ownerBBox[0])||1;const height=Math.ceil(ownerBBox[3]-ownerBBox[1])||1;const tmpCanvas=owner.cachedCanvases.getCanvas("pattern",width,height,true);const tmpCtx=tmpCanvas.context;tmpCtx.clearRect(0,0,tmpCtx.canvas.width,tmpCtx.canvas.height);tmpCtx.beginPath();tmpCtx.rect(0,0,tmpCtx.canvas.width,tmpCtx.canvas.height);tmpCtx.translate(-ownerBBox[0],-ownerBBox[1]);inverse=Util.transform(inverse,[1,0,0,1,ownerBBox[0],ownerBBox[1]]);tmpCtx.transform(...owner.baseTransform);if(this.matrix){tmpCtx.transform(...this.matrix);}applyBoundingBox(tmpCtx,this._bbox);tmpCtx.fillStyle=this._createGradient(tmpCtx);tmpCtx.fill();pattern=ctx.createPattern(tmpCanvas.canvas,"no-repeat");const domMatrix=new DOMMatrix(inverse);pattern.setTransform(domMatrix);}else{applyBoundingBox(ctx,this._bbox);pattern=this._createGradient(ctx);}return pattern;}}function drawTriangle(data,context,p1,p2,p3,c1,c2,c3){const coords=context.coords,colors=context.colors;const bytes=data.data,rowSize=data.width*4;let tmp;if(coords[p1+1]>coords[p2+1]){tmp=p1;p1=p2;p2=tmp;tmp=c1;c1=c2;c2=tmp;}if(coords[p2+1]>coords[p3+1]){tmp=p2;p2=p3;p3=tmp;tmp=c2;c2=c3;c3=tmp;}if(coords[p1+1]>coords[p2+1]){tmp=p1;p1=p2;p2=tmp;tmp=c1;c1=c2;c2=tmp;}const x1=(coords[p1]+context.offsetX)*context.scaleX;const y1=(coords[p1+1]+context.offsetY)*context.scaleY;const x2=(coords[p2]+context.offsetX)*context.scaleX;const y2=(coords[p2+1]+context.offsetY)*context.scaleY;const x3=(coords[p3]+context.offsetX)*context.scaleX;const y3=(coords[p3+1]+context.offsetY)*context.scaleY;if(y1>=y3){return;}const c1r=colors[c1],c1g=colors[c1+1],c1b=colors[c1+2];const c2r=colors[c2],c2g=colors[c2+1],c2b=colors[c2+2];const c3r=colors[c3],c3g=colors[c3+1],c3b=colors[c3+2];const minY=Math.round(y1),maxY=Math.round(y3);let xa,car,cag,cab;let xb,cbr,cbg,cbb;for(let y=minY;y<=maxY;y++){if(y<y2){const k=y<y1?0:(y1-y)/(y1-y2);xa=x1-(x1-x2)*k;car=c1r-(c1r-c2r)*k;cag=c1g-(c1g-c2g)*k;cab=c1b-(c1b-c2b)*k;}else{let k;if(y>y3){k=1;}else if(y2===y3){k=0;}else{k=(y2-y)/(y2-y3);}xa=x2-(x2-x3)*k;car=c2r-(c2r-c3r)*k;cag=c2g-(c2g-c3g)*k;cab=c2b-(c2b-c3b)*k;}let k;if(y<y1){k=0;}else if(y>y3){k=1;}else{k=(y1-y)/(y1-y3);}xb=x1-(x1-x3)*k;cbr=c1r-(c1r-c3r)*k;cbg=c1g-(c1g-c3g)*k;cbb=c1b-(c1b-c3b)*k;const x1_=Math.round(Math.min(xa,xb));const x2_=Math.round(Math.max(xa,xb));let j=rowSize*y+x1_*4;for(let x=x1_;x<=x2_;x++){k=(xa-x)/(xa-xb);if(k<0){k=0;}else if(k>1){k=1;}bytes[j++]=car-(car-cbr)*k|0;bytes[j++]=cag-(cag-cbg)*k|0;bytes[j++]=cab-(cab-cbb)*k|0;bytes[j++]=255;}}}function drawFigure(data,figure,context){const ps=figure.coords;const cs=figure.colors;let i,ii;switch(figure.type){case"lattice":const verticesPerRow=figure.verticesPerRow;const rows=Math.floor(ps.length/verticesPerRow)-1;const cols=verticesPerRow-1;for(i=0;i<rows;i++){let q=i*verticesPerRow;for(let j=0;j<cols;j++,q++){drawTriangle(data,context,ps[q],ps[q+1],ps[q+verticesPerRow],cs[q],cs[q+1],cs[q+verticesPerRow]);drawTriangle(data,context,ps[q+verticesPerRow+1],ps[q+1],ps[q+verticesPerRow],cs[q+verticesPerRow+1],cs[q+1],cs[q+verticesPerRow]);}}break;case"triangles":for(i=0,ii=ps.length;i<ii;i+=3){drawTriangle(data,context,ps[i],ps[i+1],ps[i+2],cs[i],cs[i+1],cs[i+2]);}break;default:throw new Error("illegal figure");}}class MeshShadingPattern extends BaseShadingPattern{constructor(IR){super();this._coords=IR[2];this._colors=IR[3];this._figures=IR[4];this._bounds=IR[5];this._bbox=IR[7];this._background=IR[8];this.matrix=null;}_createMeshCanvas(combinedScale,backgroundColor,cachedCanvases){const EXPECTED_SCALE=1.1;const MAX_PATTERN_SIZE=3000;const BORDER_SIZE=2;const offsetX=Math.floor(this._bounds[0]);const offsetY=Math.floor(this._bounds[1]);const boundsWidth=Math.ceil(this._bounds[2])-offsetX;const boundsHeight=Math.ceil(this._bounds[3])-offsetY;const width=Math.min(Math.ceil(Math.abs(boundsWidth*combinedScale[0]*EXPECTED_SCALE)),MAX_PATTERN_SIZE);const height=Math.min(Math.ceil(Math.abs(boundsHeight*combinedScale[1]*EXPECTED_SCALE)),MAX_PATTERN_SIZE);const scaleX=boundsWidth/width;const scaleY=boundsHeight/height;const context={coords:this._coords,colors:this._colors,offsetX:-offsetX,offsetY:-offsetY,scaleX:1/scaleX,scaleY:1/scaleY};const paddedWidth=width+BORDER_SIZE*2;const paddedHeight=height+BORDER_SIZE*2;const tmpCanvas=cachedCanvases.getCanvas("mesh",paddedWidth,paddedHeight,false);const tmpCtx=tmpCanvas.context;const data=tmpCtx.createImageData(width,height);if(backgroundColor){const bytes=data.data;for(let i=0,ii=bytes.length;i<ii;i+=4){bytes[i]=backgroundColor[0];bytes[i+1]=backgroundColor[1];bytes[i+2]=backgroundColor[2];bytes[i+3]=255;}}for(const figure of this._figures){drawFigure(data,figure,context);}tmpCtx.putImageData(data,BORDER_SIZE,BORDER_SIZE);const canvas=tmpCanvas.canvas;return{canvas,offsetX:offsetX-BORDER_SIZE*scaleX,offsetY:offsetY-BORDER_SIZE*scaleY,scaleX,scaleY};}getPattern(ctx,owner,inverse,pathType){applyBoundingBox(ctx,this._bbox);let scale;if(pathType===PathType.SHADING){scale=Util.singularValueDecompose2dScale(getCurrentTransform(ctx));}else{scale=Util.singularValueDecompose2dScale(owner.baseTransform);if(this.matrix){const matrixScale=Util.singularValueDecompose2dScale(this.matrix);scale=[scale[0]*matrixScale[0],scale[1]*matrixScale[1]];}}const temporaryPatternCanvas=this._createMeshCanvas(scale,pathType===PathType.SHADING?null:this._background,owner.cachedCanvases);if(pathType!==PathType.SHADING){ctx.setTransform(...owner.baseTransform);if(this.matrix){ctx.transform(...this.matrix);}}ctx.translate(temporaryPatternCanvas.offsetX,temporaryPatternCanvas.offsetY);ctx.scale(temporaryPatternCanvas.scaleX,temporaryPatternCanvas.scaleY);return ctx.createPattern(temporaryPatternCanvas.canvas,"no-repeat");}}class DummyShadingPattern extends BaseShadingPattern{getPattern(){return"hotpink";}}function getShadingPattern(IR){switch(IR[0]){case"RadialAxial":return new RadialAxialShadingPattern(IR);case"Mesh":return new MeshShadingPattern(IR);case"Dummy":return new DummyShadingPattern();}throw new Error(`Unknown IR type: ${IR[0]}`);}const PaintType={COLORED:1,UNCOLORED:2};class TilingPattern{constructor(IR,color,ctx,canvasGraphicsFactory,baseTransform){this.operatorList=IR[2];this.matrix=IR[3];this.bbox=IR[4];this.xstep=IR[5];this.ystep=IR[6];this.paintType=IR[7];this.tilingType=IR[8];this.color=color;this.ctx=ctx;this.canvasGraphicsFactory=canvasGraphicsFactory;this.baseTransform=baseTransform;}createPatternCanvas(owner){const operatorList=this.operatorList;const bbox=this.bbox;const xstep=this.xstep;const ystep=this.ystep;const paintType=this.paintType;const tilingType=this.tilingType;const color=this.color;const canvasGraphicsFactory=this.canvasGraphicsFactory;info("TilingType: "+tilingType);const x0=bbox[0],y0=bbox[1],x1=bbox[2],y1=bbox[3];const matrixScale=Util.singularValueDecompose2dScale(this.matrix);const curMatrixScale=Util.singularValueDecompose2dScale(this.baseTransform);const combinedScale=[matrixScale[0]*curMatrixScale[0],matrixScale[1]*curMatrixScale[1]];const dimx=this.getSizeAndScale(xstep,this.ctx.canvas.width,combinedScale[0]);const dimy=this.getSizeAndScale(ystep,this.ctx.canvas.height,combinedScale[1]);const tmpCanvas=owner.cachedCanvases.getCanvas("pattern",dimx.size,dimy.size,true);const tmpCtx=tmpCanvas.context;const graphics=canvasGraphicsFactory.createCanvasGraphics(tmpCtx);graphics.groupLevel=owner.groupLevel;this.setFillAndStrokeStyleToContext(graphics,paintType,color);let adjustedX0=x0;let adjustedY0=y0;let adjustedX1=x1;let adjustedY1=y1;if(x0<0){adjustedX0=0;adjustedX1+=Math.abs(x0);}if(y0<0){adjustedY0=0;adjustedY1+=Math.abs(y0);}tmpCtx.translate(-(dimx.scale*adjustedX0),-(dimy.scale*adjustedY0));graphics.transform(dimx.scale,0,0,dimy.scale,0,0);tmpCtx.save();this.clipBbox(graphics,adjustedX0,adjustedY0,adjustedX1,adjustedY1);graphics.baseTransform=getCurrentTransform(graphics.ctx);graphics.executeOperatorList(operatorList);graphics.endDrawing();return{canvas:tmpCanvas.canvas,scaleX:dimx.scale,scaleY:dimy.scale,offsetX:adjustedX0,offsetY:adjustedY0};}getSizeAndScale(step,realOutputSize,scale){step=Math.abs(step);const maxSize=Math.max(TilingPattern.MAX_PATTERN_SIZE,realOutputSize);let size=Math.ceil(step*scale);if(size>=maxSize){size=maxSize;}else{scale=size/step;}return{scale,size};}clipBbox(graphics,x0,y0,x1,y1){const bboxWidth=x1-x0;const bboxHeight=y1-y0;graphics.ctx.rect(x0,y0,bboxWidth,bboxHeight);graphics.current.updateRectMinMax(getCurrentTransform(graphics.ctx),[x0,y0,x1,y1]);graphics.clip();graphics.endPath();}setFillAndStrokeStyleToContext(graphics,paintType,color){const context=graphics.ctx,current=graphics.current;switch(paintType){case PaintType.COLORED:const ctx=this.ctx;context.fillStyle=ctx.fillStyle;context.strokeStyle=ctx.strokeStyle;current.fillColor=ctx.fillStyle;current.strokeColor=ctx.strokeStyle;break;case PaintType.UNCOLORED:const cssColor=Util.makeHexColor(color[0],color[1],color[2]);context.fillStyle=cssColor;context.strokeStyle=cssColor;current.fillColor=cssColor;current.strokeColor=cssColor;break;default:throw new FormatError(`Unsupported paint type: ${paintType}`);}}getPattern(ctx,owner,inverse,pathType){let matrix=inverse;if(pathType!==PathType.SHADING){matrix=Util.transform(matrix,owner.baseTransform);if(this.matrix){matrix=Util.transform(matrix,this.matrix);}}const temporaryPatternCanvas=this.createPatternCanvas(owner);let domMatrix=new DOMMatrix(matrix);domMatrix=domMatrix.translate(temporaryPatternCanvas.offsetX,temporaryPatternCanvas.offsetY);domMatrix=domMatrix.scale(1/temporaryPatternCanvas.scaleX,1/temporaryPatternCanvas.scaleY);const pattern=ctx.createPattern(temporaryPatternCanvas.canvas,"repeat");pattern.setTransform(domMatrix);return pattern;}}pattern_helper_defineProperty(TilingPattern,"MAX_PATTERN_SIZE",3000);
;// CONCATENATED MODULE: ./src/shared/image_utils.js
function convertToRGBA(params){switch(params.kind){case ImageKind.GRAYSCALE_1BPP:return convertBlackAndWhiteToRGBA(params);case ImageKind.RGB_24BPP:return convertRGBToRGBA(params);}return null;}function convertBlackAndWhiteToRGBA(_ref){let{src,srcPos=0,dest,width,height,nonBlackColor=0xffffffff,inverseDecode=false}=_ref;const black=util_FeatureTest.isLittleEndian?0xff000000:0x000000ff;const[zeroMapping,oneMapping]=inverseDecode?[nonBlackColor,black]:[black,nonBlackColor];const widthInSource=width>>3;const widthRemainder=width&7;const srcLength=src.length;dest=new Uint32Array(dest.buffer);let destPos=0;for(let i=0;i<height;i++){for(const max=srcPos+widthInSource;srcPos<max;srcPos++){const elem=srcPos<srcLength?src[srcPos]:255;dest[destPos++]=elem&0b10000000?oneMapping:zeroMapping;dest[destPos++]=elem&0b1000000?oneMapping:zeroMapping;dest[destPos++]=elem&0b100000?oneMapping:zeroMapping;dest[destPos++]=elem&0b10000?oneMapping:zeroMapping;dest[destPos++]=elem&0b1000?oneMapping:zeroMapping;dest[destPos++]=elem&0b100?oneMapping:zeroMapping;dest[destPos++]=elem&0b10?oneMapping:zeroMapping;dest[destPos++]=elem&0b1?oneMapping:zeroMapping;}if(widthRemainder===0){continue;}const elem=srcPos<srcLength?src[srcPos++]:255;for(let j=0;j<widthRemainder;j++){dest[destPos++]=elem&1<<7-j?oneMapping:zeroMapping;}}return{srcPos,destPos};}function convertRGBToRGBA(_ref2){let{src,srcPos=0,dest,destPos=0,width,height}=_ref2;let i=0;const len32=src.length>>2;const src32=new Uint32Array(src.buffer,srcPos,len32);if(FeatureTest.isLittleEndian){for(;i<len32-2;i+=3,destPos+=4){const s1=src32[i];const s2=src32[i+1];const s3=src32[i+2];dest[destPos]=s1|0xff000000;dest[destPos+1]=s1>>>24|s2<<8|0xff000000;dest[destPos+2]=s2>>>16|s3<<16|0xff000000;dest[destPos+3]=s3>>>8|0xff000000;}for(let j=i*4,jj=src.length;j<jj;j+=3){dest[destPos++]=src[j]|src[j+1]<<8|src[j+2]<<16|0xff000000;}}else{for(;i<len32-2;i+=3,destPos+=4){const s1=src32[i];const s2=src32[i+1];const s3=src32[i+2];dest[destPos]=s1|0xff;dest[destPos+1]=s1<<24|s2>>>8|0xff;dest[destPos+2]=s2<<16|s3>>>16|0xff;dest[destPos+3]=s3<<8|0xff;}for(let j=i*4,jj=src.length;j<jj;j+=3){dest[destPos++]=src[j]<<24|src[j+1]<<16|src[j+2]<<8|0xff;}}return{srcPos,destPos};}function grayToRGBA(src,dest){if(FeatureTest.isLittleEndian){for(let i=0,ii=src.length;i<ii;i++){dest[i]=src[i]*0x10101|0xff000000;}}else{for(let i=0,ii=src.length;i<ii;i++){dest[i]=src[i]*0x1010100|0x000000ff;}}}
;// CONCATENATED MODULE: ./src/display/canvas.js
function canvas_classPrivateMethodInitSpec(e,a){canvas_checkPrivateRedeclaration(e,a),a.add(e);}function canvas_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function canvas_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const MIN_FONT_SIZE=16;const MAX_FONT_SIZE=100;const EXECUTION_TIME=15;const EXECUTION_STEPS=10;const MAX_SIZE_TO_COMPILE=1000;const FULL_CHUNK_HEIGHT=16;function mirrorContextOperations(ctx,destCtx){if(ctx._removeMirroring){throw new Error("Context is already forwarding operations.");}ctx.__originalSave=ctx.save;ctx.__originalRestore=ctx.restore;ctx.__originalRotate=ctx.rotate;ctx.__originalScale=ctx.scale;ctx.__originalTranslate=ctx.translate;ctx.__originalTransform=ctx.transform;ctx.__originalSetTransform=ctx.setTransform;ctx.__originalResetTransform=ctx.resetTransform;ctx.__originalClip=ctx.clip;ctx.__originalMoveTo=ctx.moveTo;ctx.__originalLineTo=ctx.lineTo;ctx.__originalBezierCurveTo=ctx.bezierCurveTo;ctx.__originalRect=ctx.rect;ctx.__originalClosePath=ctx.closePath;ctx.__originalBeginPath=ctx.beginPath;ctx._removeMirroring=()=>{ctx.save=ctx.__originalSave;ctx.restore=ctx.__originalRestore;ctx.rotate=ctx.__originalRotate;ctx.scale=ctx.__originalScale;ctx.translate=ctx.__originalTranslate;ctx.transform=ctx.__originalTransform;ctx.setTransform=ctx.__originalSetTransform;ctx.resetTransform=ctx.__originalResetTransform;ctx.clip=ctx.__originalClip;ctx.moveTo=ctx.__originalMoveTo;ctx.lineTo=ctx.__originalLineTo;ctx.bezierCurveTo=ctx.__originalBezierCurveTo;ctx.rect=ctx.__originalRect;ctx.closePath=ctx.__originalClosePath;ctx.beginPath=ctx.__originalBeginPath;delete ctx._removeMirroring;};ctx.save=function ctxSave(){destCtx.save();this.__originalSave();};ctx.restore=function ctxRestore(){destCtx.restore();this.__originalRestore();};ctx.translate=function ctxTranslate(x,y){destCtx.translate(x,y);this.__originalTranslate(x,y);};ctx.scale=function ctxScale(x,y){destCtx.scale(x,y);this.__originalScale(x,y);};ctx.transform=function ctxTransform(a,b,c,d,e,f){destCtx.transform(a,b,c,d,e,f);this.__originalTransform(a,b,c,d,e,f);};ctx.setTransform=function ctxSetTransform(a,b,c,d,e,f){destCtx.setTransform(a,b,c,d,e,f);this.__originalSetTransform(a,b,c,d,e,f);};ctx.resetTransform=function ctxResetTransform(){destCtx.resetTransform();this.__originalResetTransform();};ctx.rotate=function ctxRotate(angle){destCtx.rotate(angle);this.__originalRotate(angle);};ctx.clip=function ctxRotate(rule){destCtx.clip(rule);this.__originalClip(rule);};ctx.moveTo=function(x,y){destCtx.moveTo(x,y);this.__originalMoveTo(x,y);};ctx.lineTo=function(x,y){destCtx.lineTo(x,y);this.__originalLineTo(x,y);};ctx.bezierCurveTo=function(cp1x,cp1y,cp2x,cp2y,x,y){destCtx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);this.__originalBezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);};ctx.rect=function(x,y,width,height){destCtx.rect(x,y,width,height);this.__originalRect(x,y,width,height);};ctx.closePath=function(){destCtx.closePath();this.__originalClosePath();};ctx.beginPath=function(){destCtx.beginPath();this.__originalBeginPath();};}class CachedCanvases{constructor(canvasFactory){this.canvasFactory=canvasFactory;this.cache=Object.create(null);}getCanvas(id,width,height){let canvasEntry;if(this.cache[id]!==undefined){canvasEntry=this.cache[id];this.canvasFactory.reset(canvasEntry,width,height);}else{canvasEntry=this.canvasFactory.create(width,height);this.cache[id]=canvasEntry;}return canvasEntry;}delete(id){delete this.cache[id];}clear(){for(const id in this.cache){const canvasEntry=this.cache[id];this.canvasFactory.destroy(canvasEntry);delete this.cache[id];}}}function drawImageAtIntegerCoords(ctx,srcImg,srcX,srcY,srcW,srcH,destX,destY,destW,destH){const[a,b,c,d,tx,ty]=getCurrentTransform(ctx);if(b===0&&c===0){const tlX=destX*a+tx;const rTlX=Math.round(tlX);const tlY=destY*d+ty;const rTlY=Math.round(tlY);const brX=(destX+destW)*a+tx;const rWidth=Math.abs(Math.round(brX)-rTlX)||1;const brY=(destY+destH)*d+ty;const rHeight=Math.abs(Math.round(brY)-rTlY)||1;ctx.setTransform(Math.sign(a),0,0,Math.sign(d),rTlX,rTlY);ctx.drawImage(srcImg,srcX,srcY,srcW,srcH,0,0,rWidth,rHeight);ctx.setTransform(a,b,c,d,tx,ty);return[rWidth,rHeight];}if(a===0&&d===0){const tlX=destY*c+tx;const rTlX=Math.round(tlX);const tlY=destX*b+ty;const rTlY=Math.round(tlY);const brX=(destY+destH)*c+tx;const rWidth=Math.abs(Math.round(brX)-rTlX)||1;const brY=(destX+destW)*b+ty;const rHeight=Math.abs(Math.round(brY)-rTlY)||1;ctx.setTransform(0,Math.sign(b),Math.sign(c),0,rTlX,rTlY);ctx.drawImage(srcImg,srcX,srcY,srcW,srcH,0,0,rHeight,rWidth);ctx.setTransform(a,b,c,d,tx,ty);return[rHeight,rWidth];}ctx.drawImage(srcImg,srcX,srcY,srcW,srcH,destX,destY,destW,destH);const scaleX=Math.hypot(a,b);const scaleY=Math.hypot(c,d);return[scaleX*destW,scaleY*destH];}function compileType3Glyph(imgData){const{width,height}=imgData;if(width>MAX_SIZE_TO_COMPILE||height>MAX_SIZE_TO_COMPILE){return null;}const POINT_TO_PROCESS_LIMIT=1000;const POINT_TYPES=new Uint8Array([0,2,4,0,1,0,5,4,8,10,0,8,0,2,1,0]);const width1=width+1;let points=new Uint8Array(width1*(height+1));let i,j,j0;const lineSize=width+7&~7;let data=new Uint8Array(lineSize*height),pos=0;for(const elem of imgData.data){let mask=128;while(mask>0){data[pos++]=elem&mask?0:255;mask>>=1;}}let count=0;pos=0;if(data[pos]!==0){points[0]=1;++count;}for(j=1;j<width;j++){if(data[pos]!==data[pos+1]){points[j]=data[pos]?2:1;++count;}pos++;}if(data[pos]!==0){points[j]=2;++count;}for(i=1;i<height;i++){pos=i*lineSize;j0=i*width1;if(data[pos-lineSize]!==data[pos]){points[j0]=data[pos]?1:8;++count;}let sum=(data[pos]?4:0)+(data[pos-lineSize]?8:0);for(j=1;j<width;j++){sum=(sum>>2)+(data[pos+1]?4:0)+(data[pos-lineSize+1]?8:0);if(POINT_TYPES[sum]){points[j0+j]=POINT_TYPES[sum];++count;}pos++;}if(data[pos-lineSize]!==data[pos]){points[j0+j]=data[pos]?2:4;++count;}if(count>POINT_TO_PROCESS_LIMIT){return null;}}pos=lineSize*(height-1);j0=i*width1;if(data[pos]!==0){points[j0]=8;++count;}for(j=1;j<width;j++){if(data[pos]!==data[pos+1]){points[j0+j]=data[pos]?4:8;++count;}pos++;}if(data[pos]!==0){points[j0+j]=4;++count;}if(count>POINT_TO_PROCESS_LIMIT){return null;}const steps=new Int32Array([0,width1,-1,0,-width1,0,0,0,1]);const path=new Path2D();for(i=0;count&&i<=height;i++){let p=i*width1;const end=p+width;while(p<end&&!points[p]){p++;}if(p===end){continue;}path.moveTo(p%width1,i);const p0=p;let type=points[p];do{const step=steps[type];do{p+=step;}while(!points[p]);const pp=points[p];if(pp!==5&&pp!==10){type=pp;points[p]=0;}else{type=pp&0x33*type>>4;points[p]&=type>>2|type<<2;}path.lineTo(p%width1,p/width1|0);if(!points[p]){--count;}}while(p0!==p);--i;}data=null;points=null;const drawOutline=function(c){c.save();c.scale(1/width,-1/height);c.translate(0,-height);c.fill(path);c.beginPath();c.restore();};return drawOutline;}class CanvasExtraState{constructor(width,height){this.alphaIsShape=false;this.fontSize=0;this.fontSizeScale=1;this.textMatrix=IDENTITY_MATRIX;this.textMatrixScale=1;this.fontMatrix=FONT_IDENTITY_MATRIX;this.leading=0;this.x=0;this.y=0;this.lineX=0;this.lineY=0;this.charSpacing=0;this.wordSpacing=0;this.textHScale=1;this.textRenderingMode=TextRenderingMode.FILL;this.textRise=0;this.fillColor="#000000";this.strokeColor="#000000";this.patternFill=false;this.fillAlpha=1;this.strokeAlpha=1;this.lineWidth=1;this.activeSMask=null;this.transferMaps="none";this.startNewPathAndClipBox([0,0,width,height]);}clone(){const clone=Object.create(this);clone.clipBox=this.clipBox.slice();return clone;}setCurrentPoint(x,y){this.x=x;this.y=y;}updatePathMinMax(transform,x,y){[x,y]=Util.applyTransform([x,y],transform);this.minX=Math.min(this.minX,x);this.minY=Math.min(this.minY,y);this.maxX=Math.max(this.maxX,x);this.maxY=Math.max(this.maxY,y);}updateRectMinMax(transform,rect){const p1=Util.applyTransform(rect,transform);const p2=Util.applyTransform(rect.slice(2),transform);const p3=Util.applyTransform([rect[0],rect[3]],transform);const p4=Util.applyTransform([rect[2],rect[1]],transform);this.minX=Math.min(this.minX,p1[0],p2[0],p3[0],p4[0]);this.minY=Math.min(this.minY,p1[1],p2[1],p3[1],p4[1]);this.maxX=Math.max(this.maxX,p1[0],p2[0],p3[0],p4[0]);this.maxY=Math.max(this.maxY,p1[1],p2[1],p3[1],p4[1]);}updateScalingPathMinMax(transform,minMax){Util.scaleMinMax(transform,minMax);this.minX=Math.min(this.minX,minMax[0]);this.minY=Math.min(this.minY,minMax[1]);this.maxX=Math.max(this.maxX,minMax[2]);this.maxY=Math.max(this.maxY,minMax[3]);}updateCurvePathMinMax(transform,x0,y0,x1,y1,x2,y2,x3,y3,minMax){const box=Util.bezierBoundingBox(x0,y0,x1,y1,x2,y2,x3,y3,minMax);if(minMax){return;}this.updateRectMinMax(transform,box);}getPathBoundingBox(){let pathType=arguments.length>0&&arguments[0]!==undefined?arguments[0]:PathType.FILL;let transform=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;const box=[this.minX,this.minY,this.maxX,this.maxY];if(pathType===PathType.STROKE){if(!transform){unreachable("Stroke bounding box must include transform.");}const scale=Util.singularValueDecompose2dScale(transform);const xStrokePad=scale[0]*this.lineWidth/2;const yStrokePad=scale[1]*this.lineWidth/2;box[0]-=xStrokePad;box[1]-=yStrokePad;box[2]+=xStrokePad;box[3]+=yStrokePad;}return box;}updateClipFromPath(){const intersect=Util.intersect(this.clipBox,this.getPathBoundingBox());this.startNewPathAndClipBox(intersect||[0,0,0,0]);}isEmptyClip(){return this.minX===Infinity;}startNewPathAndClipBox(box){this.clipBox=box;this.minX=Infinity;this.minY=Infinity;this.maxX=0;this.maxY=0;}getClippedPathBoundingBox(){let pathType=arguments.length>0&&arguments[0]!==undefined?arguments[0]:PathType.FILL;let transform=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;return Util.intersect(this.clipBox,this.getPathBoundingBox(pathType,transform));}}function putBinaryImageData(ctx,imgData){if(typeof ImageData!=="undefined"&&imgData instanceof ImageData){ctx.putImageData(imgData,0,0);return;}const height=imgData.height,width=imgData.width;const partialChunkHeight=height%FULL_CHUNK_HEIGHT;const fullChunks=(height-partialChunkHeight)/FULL_CHUNK_HEIGHT;const totalChunks=partialChunkHeight===0?fullChunks:fullChunks+1;const chunkImgData=ctx.createImageData(width,FULL_CHUNK_HEIGHT);let srcPos=0,destPos;const src=imgData.data;const dest=chunkImgData.data;let i,j,thisChunkHeight,elemsInThisChunk;if(imgData.kind===util_ImageKind.GRAYSCALE_1BPP){const srcLength=src.byteLength;const dest32=new Uint32Array(dest.buffer,0,dest.byteLength>>2);const dest32DataLength=dest32.length;const fullSrcDiff=width+7>>3;const white=0xffffffff;const black=util_FeatureTest.isLittleEndian?0xff000000:0x000000ff;for(i=0;i<totalChunks;i++){thisChunkHeight=i<fullChunks?FULL_CHUNK_HEIGHT:partialChunkHeight;destPos=0;for(j=0;j<thisChunkHeight;j++){const srcDiff=srcLength-srcPos;let k=0;const kEnd=srcDiff>fullSrcDiff?width:srcDiff*8-7;const kEndUnrolled=kEnd&~7;let mask=0;let srcByte=0;for(;k<kEndUnrolled;k+=8){srcByte=src[srcPos++];dest32[destPos++]=srcByte&128?white:black;dest32[destPos++]=srcByte&64?white:black;dest32[destPos++]=srcByte&32?white:black;dest32[destPos++]=srcByte&16?white:black;dest32[destPos++]=srcByte&8?white:black;dest32[destPos++]=srcByte&4?white:black;dest32[destPos++]=srcByte&2?white:black;dest32[destPos++]=srcByte&1?white:black;}for(;k<kEnd;k++){if(mask===0){srcByte=src[srcPos++];mask=128;}dest32[destPos++]=srcByte&mask?white:black;mask>>=1;}}while(destPos<dest32DataLength){dest32[destPos++]=0;}ctx.putImageData(chunkImgData,0,i*FULL_CHUNK_HEIGHT);}}else if(imgData.kind===util_ImageKind.RGBA_32BPP){j=0;elemsInThisChunk=width*FULL_CHUNK_HEIGHT*4;for(i=0;i<fullChunks;i++){dest.set(src.subarray(srcPos,srcPos+elemsInThisChunk));srcPos+=elemsInThisChunk;ctx.putImageData(chunkImgData,0,j);j+=FULL_CHUNK_HEIGHT;}if(i<totalChunks){elemsInThisChunk=width*partialChunkHeight*4;dest.set(src.subarray(srcPos,srcPos+elemsInThisChunk));ctx.putImageData(chunkImgData,0,j);}}else if(imgData.kind===util_ImageKind.RGB_24BPP){thisChunkHeight=FULL_CHUNK_HEIGHT;elemsInThisChunk=width*thisChunkHeight;for(i=0;i<totalChunks;i++){if(i>=fullChunks){thisChunkHeight=partialChunkHeight;elemsInThisChunk=width*thisChunkHeight;}destPos=0;for(j=elemsInThisChunk;j--;){dest[destPos++]=src[srcPos++];dest[destPos++]=src[srcPos++];dest[destPos++]=src[srcPos++];dest[destPos++]=255;}ctx.putImageData(chunkImgData,0,i*FULL_CHUNK_HEIGHT);}}else{throw new Error(`bad image kind: ${imgData.kind}`);}}function putBinaryImageMask(ctx,imgData){if(imgData.bitmap){ctx.drawImage(imgData.bitmap,0,0);return;}const height=imgData.height,width=imgData.width;const partialChunkHeight=height%FULL_CHUNK_HEIGHT;const fullChunks=(height-partialChunkHeight)/FULL_CHUNK_HEIGHT;const totalChunks=partialChunkHeight===0?fullChunks:fullChunks+1;const chunkImgData=ctx.createImageData(width,FULL_CHUNK_HEIGHT);let srcPos=0;const src=imgData.data;const dest=chunkImgData.data;for(let i=0;i<totalChunks;i++){const thisChunkHeight=i<fullChunks?FULL_CHUNK_HEIGHT:partialChunkHeight;({srcPos}=convertBlackAndWhiteToRGBA({src,srcPos,dest,width,height:thisChunkHeight,nonBlackColor:0}));ctx.putImageData(chunkImgData,0,i*FULL_CHUNK_HEIGHT);}}function copyCtxState(sourceCtx,destCtx){const properties=["strokeStyle","fillStyle","fillRule","globalAlpha","lineWidth","lineCap","lineJoin","miterLimit","globalCompositeOperation","font","filter"];for(const property of properties){if(sourceCtx[property]!==undefined){destCtx[property]=sourceCtx[property];}}if(sourceCtx.setLineDash!==undefined){destCtx.setLineDash(sourceCtx.getLineDash());destCtx.lineDashOffset=sourceCtx.lineDashOffset;}}function resetCtxToDefault(ctx){ctx.strokeStyle=ctx.fillStyle="#000000";ctx.fillRule="nonzero";ctx.globalAlpha=1;ctx.lineWidth=1;ctx.lineCap="butt";ctx.lineJoin="miter";ctx.miterLimit=10;ctx.globalCompositeOperation="source-over";ctx.font="10px sans-serif";if(ctx.setLineDash!==undefined){ctx.setLineDash([]);ctx.lineDashOffset=0;}if(!isNodeJS){const{filter}=ctx;if(filter!=="none"&&filter!==""){ctx.filter="none";}}}function getImageSmoothingEnabled(transform,interpolate){if(interpolate){return true;}const scale=Util.singularValueDecompose2dScale(transform);scale[0]=Math.fround(scale[0]);scale[1]=Math.fround(scale[1]);const actualScale=Math.fround((globalThis.devicePixelRatio||1)*PixelsPerInch.PDF_TO_CSS_UNITS);return scale[0]<=actualScale&&scale[1]<=actualScale;}const LINE_CAP_STYLES=["butt","round","square"];const LINE_JOIN_STYLES=["miter","round","bevel"];const NORMAL_CLIP={};const EO_CLIP={};var _CanvasGraphics_brand=/*#__PURE__*/new WeakSet();class CanvasGraphics{constructor(canvasCtx,commonObjs,objs,canvasFactory,filterFactory,_ref,annotationCanvasMap,pageColors){let{optionalContentConfig,markedContentStack=null}=_ref;canvas_classPrivateMethodInitSpec(this,_CanvasGraphics_brand);this.ctx=canvasCtx;this.current=new CanvasExtraState(this.ctx.canvas.width,this.ctx.canvas.height);this.stateStack=[];this.pendingClip=null;this.pendingEOFill=false;this.res=null;this.xobjs=null;this.commonObjs=commonObjs;this.objs=objs;this.canvasFactory=canvasFactory;this.filterFactory=filterFactory;this.groupStack=[];this.processingType3=null;this.baseTransform=null;this.baseTransformStack=[];this.groupLevel=0;this.smaskStack=[];this.smaskCounter=0;this.tempSMask=null;this.suspendedCtx=null;this.contentVisible=true;this.markedContentStack=markedContentStack||[];this.optionalContentConfig=optionalContentConfig;this.cachedCanvases=new CachedCanvases(this.canvasFactory);this.cachedPatterns=new Map();this.annotationCanvasMap=annotationCanvasMap;this.viewportScale=1;this.outputScaleX=1;this.outputScaleY=1;this.pageColors=pageColors;this._cachedScaleForStroking=[-1,0];this._cachedGetSinglePixelWidth=null;this._cachedBitmapsMap=new Map();}getObject(data){let fallback=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;if(typeof data==="string"){return data.startsWith("g_")?this.commonObjs.get(data):this.objs.get(data);}return fallback;}beginDrawing(_ref2){let{transform,viewport,transparency=false,background=null}=_ref2;const width=this.ctx.canvas.width;const height=this.ctx.canvas.height;const savedFillStyle=this.ctx.fillStyle;this.ctx.fillStyle=background||"#ffffff";this.ctx.fillRect(0,0,width,height);this.ctx.fillStyle=savedFillStyle;if(transparency){const transparentCanvas=this.cachedCanvases.getCanvas("transparent",width,height);this.compositeCtx=this.ctx;this.transparentCanvas=transparentCanvas.canvas;this.ctx=transparentCanvas.context;this.ctx.save();this.ctx.transform(...getCurrentTransform(this.compositeCtx));}this.ctx.save();resetCtxToDefault(this.ctx);if(transform){this.ctx.transform(...transform);this.outputScaleX=transform[0];this.outputScaleY=transform[0];}this.ctx.transform(...viewport.transform);this.viewportScale=viewport.scale;this.baseTransform=getCurrentTransform(this.ctx);}executeOperatorList(operatorList,executionStartIdx,continueCallback,stepper){const argsArray=operatorList.argsArray;const fnArray=operatorList.fnArray;let i=executionStartIdx||0;const argsArrayLen=argsArray.length;if(argsArrayLen===i){return i;}const chunkOperations=argsArrayLen-i>EXECUTION_STEPS&&typeof continueCallback==="function";const endTime=chunkOperations?Date.now()+EXECUTION_TIME:0;let steps=0;const commonObjs=this.commonObjs;const objs=this.objs;let fnId;while(true){if(stepper!==undefined&&i===stepper.nextBreakPoint){stepper.breakIt(i,continueCallback);return i;}fnId=fnArray[i];if(fnId!==OPS.dependency){this[fnId].apply(this,argsArray[i]);}else{for(const depObjId of argsArray[i]){const objsPool=depObjId.startsWith("g_")?commonObjs:objs;if(!objsPool.has(depObjId)){objsPool.get(depObjId,continueCallback);return i;}}}i++;if(i===argsArrayLen){return i;}if(chunkOperations&&++steps>EXECUTION_STEPS){if(Date.now()>endTime){continueCallback();return i;}steps=0;}}}endDrawing(){canvas_assertClassBrand(_CanvasGraphics_brand,this,_restoreInitialState).call(this);this.cachedCanvases.clear();this.cachedPatterns.clear();for(const cache of this._cachedBitmapsMap.values()){for(const canvas of cache.values()){if(typeof HTMLCanvasElement!=="undefined"&&canvas instanceof HTMLCanvasElement){canvas.width=canvas.height=0;}}cache.clear();}this._cachedBitmapsMap.clear();canvas_assertClassBrand(_CanvasGraphics_brand,this,_drawFilter).call(this);}_scaleImage(img,inverseTransform){const width=img.width;const height=img.height;let widthScale=Math.max(Math.hypot(inverseTransform[0],inverseTransform[1]),1);let heightScale=Math.max(Math.hypot(inverseTransform[2],inverseTransform[3]),1);let paintWidth=width,paintHeight=height;let tmpCanvasId="prescale1";let tmpCanvas,tmpCtx;while(widthScale>2&&paintWidth>1||heightScale>2&&paintHeight>1){let newWidth=paintWidth,newHeight=paintHeight;if(widthScale>2&&paintWidth>1){newWidth=paintWidth>=16384?Math.floor(paintWidth/2)-1||1:Math.ceil(paintWidth/2);widthScale/=paintWidth/newWidth;}if(heightScale>2&&paintHeight>1){newHeight=paintHeight>=16384?Math.floor(paintHeight/2)-1||1:Math.ceil(paintHeight)/2;heightScale/=paintHeight/newHeight;}tmpCanvas=this.cachedCanvases.getCanvas(tmpCanvasId,newWidth,newHeight);tmpCtx=tmpCanvas.context;tmpCtx.clearRect(0,0,newWidth,newHeight);tmpCtx.drawImage(img,0,0,paintWidth,paintHeight,0,0,newWidth,newHeight);img=tmpCanvas.canvas;paintWidth=newWidth;paintHeight=newHeight;tmpCanvasId=tmpCanvasId==="prescale1"?"prescale2":"prescale1";}return{img,paintWidth,paintHeight};}_createMaskCanvas(img){const ctx=this.ctx;const{width,height}=img;const fillColor=this.current.fillColor;const isPatternFill=this.current.patternFill;const currentTransform=getCurrentTransform(ctx);let cache,cacheKey,scaled,maskCanvas;if((img.bitmap||img.data)&&img.count>1){const mainKey=img.bitmap||img.data.buffer;cacheKey=JSON.stringify(isPatternFill?currentTransform:[currentTransform.slice(0,4),fillColor]);cache=this._cachedBitmapsMap.get(mainKey);if(!cache){cache=new Map();this._cachedBitmapsMap.set(mainKey,cache);}const cachedImage=cache.get(cacheKey);if(cachedImage&&!isPatternFill){const offsetX=Math.round(Math.min(currentTransform[0],currentTransform[2])+currentTransform[4]);const offsetY=Math.round(Math.min(currentTransform[1],currentTransform[3])+currentTransform[5]);return{canvas:cachedImage,offsetX,offsetY};}scaled=cachedImage;}if(!scaled){maskCanvas=this.cachedCanvases.getCanvas("maskCanvas",width,height);putBinaryImageMask(maskCanvas.context,img);}let maskToCanvas=Util.transform(currentTransform,[1/width,0,0,-1/height,0,0]);maskToCanvas=Util.transform(maskToCanvas,[1,0,0,1,0,-height]);const[minX,minY,maxX,maxY]=Util.getAxialAlignedBoundingBox([0,0,width,height],maskToCanvas);const drawnWidth=Math.round(maxX-minX)||1;const drawnHeight=Math.round(maxY-minY)||1;const fillCanvas=this.cachedCanvases.getCanvas("fillCanvas",drawnWidth,drawnHeight);const fillCtx=fillCanvas.context;const offsetX=minX;const offsetY=minY;fillCtx.translate(-offsetX,-offsetY);fillCtx.transform(...maskToCanvas);if(!scaled){scaled=this._scaleImage(maskCanvas.canvas,getCurrentTransformInverse(fillCtx));scaled=scaled.img;if(cache&&isPatternFill){cache.set(cacheKey,scaled);}}fillCtx.imageSmoothingEnabled=getImageSmoothingEnabled(getCurrentTransform(fillCtx),img.interpolate);drawImageAtIntegerCoords(fillCtx,scaled,0,0,scaled.width,scaled.height,0,0,width,height);fillCtx.globalCompositeOperation="source-in";const inverse=Util.transform(getCurrentTransformInverse(fillCtx),[1,0,0,1,-offsetX,-offsetY]);fillCtx.fillStyle=isPatternFill?fillColor.getPattern(ctx,this,inverse,PathType.FILL):fillColor;fillCtx.fillRect(0,0,width,height);if(cache&&!isPatternFill){this.cachedCanvases.delete("fillCanvas");cache.set(cacheKey,fillCanvas.canvas);}return{canvas:fillCanvas.canvas,offsetX:Math.round(offsetX),offsetY:Math.round(offsetY)};}setLineWidth(width){if(width!==this.current.lineWidth){this._cachedScaleForStroking[0]=-1;}this.current.lineWidth=width;this.ctx.lineWidth=width;}setLineCap(style){this.ctx.lineCap=LINE_CAP_STYLES[style];}setLineJoin(style){this.ctx.lineJoin=LINE_JOIN_STYLES[style];}setMiterLimit(limit){this.ctx.miterLimit=limit;}setDash(dashArray,dashPhase){const ctx=this.ctx;if(ctx.setLineDash!==undefined){ctx.setLineDash(dashArray);ctx.lineDashOffset=dashPhase;}}setRenderingIntent(intent){}setFlatness(flatness){}setGState(states){for(const[key,value]of states){switch(key){case"LW":this.setLineWidth(value);break;case"LC":this.setLineCap(value);break;case"LJ":this.setLineJoin(value);break;case"ML":this.setMiterLimit(value);break;case"D":this.setDash(value[0],value[1]);break;case"RI":this.setRenderingIntent(value);break;case"FL":this.setFlatness(value);break;case"Font":this.setFont(value[0],value[1]);break;case"CA":this.current.strokeAlpha=value;break;case"ca":this.current.fillAlpha=value;this.ctx.globalAlpha=value;break;case"BM":this.ctx.globalCompositeOperation=value;break;case"SMask":this.current.activeSMask=value?this.tempSMask:null;this.tempSMask=null;this.checkSMaskState();break;case"TR":this.ctx.filter=this.current.transferMaps=this.filterFactory.addFilter(value);break;}}}get inSMaskMode(){return!!this.suspendedCtx;}checkSMaskState(){const inSMaskMode=this.inSMaskMode;if(this.current.activeSMask&&!inSMaskMode){this.beginSMaskMode();}else if(!this.current.activeSMask&&inSMaskMode){this.endSMaskMode();}}beginSMaskMode(){if(this.inSMaskMode){throw new Error("beginSMaskMode called while already in smask mode");}const drawnWidth=this.ctx.canvas.width;const drawnHeight=this.ctx.canvas.height;const cacheId="smaskGroupAt"+this.groupLevel;const scratchCanvas=this.cachedCanvases.getCanvas(cacheId,drawnWidth,drawnHeight);this.suspendedCtx=this.ctx;this.ctx=scratchCanvas.context;const ctx=this.ctx;ctx.setTransform(...getCurrentTransform(this.suspendedCtx));copyCtxState(this.suspendedCtx,ctx);mirrorContextOperations(ctx,this.suspendedCtx);this.setGState([["BM","source-over"],["ca",1],["CA",1]]);}endSMaskMode(){if(!this.inSMaskMode){throw new Error("endSMaskMode called while not in smask mode");}this.ctx._removeMirroring();copyCtxState(this.ctx,this.suspendedCtx);this.ctx=this.suspendedCtx;this.suspendedCtx=null;}compose(dirtyBox){if(!this.current.activeSMask){return;}if(!dirtyBox){dirtyBox=[0,0,this.ctx.canvas.width,this.ctx.canvas.height];}else{dirtyBox[0]=Math.floor(dirtyBox[0]);dirtyBox[1]=Math.floor(dirtyBox[1]);dirtyBox[2]=Math.ceil(dirtyBox[2]);dirtyBox[3]=Math.ceil(dirtyBox[3]);}const smask=this.current.activeSMask;const suspendedCtx=this.suspendedCtx;this.composeSMask(suspendedCtx,smask,this.ctx,dirtyBox);this.ctx.save();this.ctx.setTransform(1,0,0,1,0,0);this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);this.ctx.restore();}composeSMask(ctx,smask,layerCtx,layerBox){const layerOffsetX=layerBox[0];const layerOffsetY=layerBox[1];const layerWidth=layerBox[2]-layerOffsetX;const layerHeight=layerBox[3]-layerOffsetY;if(layerWidth===0||layerHeight===0){return;}this.genericComposeSMask(smask.context,layerCtx,layerWidth,layerHeight,smask.subtype,smask.backdrop,smask.transferMap,layerOffsetX,layerOffsetY,smask.offsetX,smask.offsetY);ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(layerCtx.canvas,0,0);ctx.restore();}genericComposeSMask(maskCtx,layerCtx,width,height,subtype,backdrop,transferMap,layerOffsetX,layerOffsetY,maskOffsetX,maskOffsetY){let maskCanvas=maskCtx.canvas;let maskX=layerOffsetX-maskOffsetX;let maskY=layerOffsetY-maskOffsetY;if(backdrop){if(maskX<0||maskY<0||maskX+width>maskCanvas.width||maskY+height>maskCanvas.height){const canvas=this.cachedCanvases.getCanvas("maskExtension",width,height);const ctx=canvas.context;ctx.drawImage(maskCanvas,-maskX,-maskY);if(backdrop.some(c=>c!==0)){ctx.globalCompositeOperation="destination-atop";ctx.fillStyle=Util.makeHexColor(...backdrop);ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation="source-over";}maskCanvas=canvas.canvas;maskX=maskY=0;}else if(backdrop.some(c=>c!==0)){maskCtx.save();maskCtx.globalAlpha=1;maskCtx.setTransform(1,0,0,1,0,0);const clip=new Path2D();clip.rect(maskX,maskY,width,height);maskCtx.clip(clip);maskCtx.globalCompositeOperation="destination-atop";maskCtx.fillStyle=Util.makeHexColor(...backdrop);maskCtx.fillRect(maskX,maskY,width,height);maskCtx.restore();}}layerCtx.save();layerCtx.globalAlpha=1;layerCtx.setTransform(1,0,0,1,0,0);if(subtype==="Alpha"&&transferMap){layerCtx.filter=this.filterFactory.addAlphaFilter(transferMap);}else if(subtype==="Luminosity"){layerCtx.filter=this.filterFactory.addLuminosityFilter(transferMap);}const clip=new Path2D();clip.rect(layerOffsetX,layerOffsetY,width,height);layerCtx.clip(clip);layerCtx.globalCompositeOperation="destination-in";layerCtx.drawImage(maskCanvas,maskX,maskY,width,height,layerOffsetX,layerOffsetY,width,height);layerCtx.restore();}save(){if(this.inSMaskMode){copyCtxState(this.ctx,this.suspendedCtx);this.suspendedCtx.save();}else{this.ctx.save();}const old=this.current;this.stateStack.push(old);this.current=old.clone();}restore(){if(this.stateStack.length===0&&this.inSMaskMode){this.endSMaskMode();}if(this.stateStack.length!==0){this.current=this.stateStack.pop();if(this.inSMaskMode){this.suspendedCtx.restore();copyCtxState(this.suspendedCtx,this.ctx);}else{this.ctx.restore();}this.checkSMaskState();this.pendingClip=null;this._cachedScaleForStroking[0]=-1;this._cachedGetSinglePixelWidth=null;}}transform(a,b,c,d,e,f){this.ctx.transform(a,b,c,d,e,f);this._cachedScaleForStroking[0]=-1;this._cachedGetSinglePixelWidth=null;}constructPath(ops,args,minMax){const ctx=this.ctx;const current=this.current;let x=current.x,y=current.y;let startX,startY;const currentTransform=getCurrentTransform(ctx);const isScalingMatrix=currentTransform[0]===0&&currentTransform[3]===0||currentTransform[1]===0&&currentTransform[2]===0;const minMaxForBezier=isScalingMatrix?minMax.slice(0):null;for(let i=0,j=0,ii=ops.length;i<ii;i++){switch(ops[i]|0){case OPS.rectangle:x=args[j++];y=args[j++];const width=args[j++];const height=args[j++];const xw=x+width;const yh=y+height;ctx.moveTo(x,y);if(width===0||height===0){ctx.lineTo(xw,yh);}else{ctx.lineTo(xw,y);ctx.lineTo(xw,yh);ctx.lineTo(x,yh);}if(!isScalingMatrix){current.updateRectMinMax(currentTransform,[x,y,xw,yh]);}ctx.closePath();break;case OPS.moveTo:x=args[j++];y=args[j++];ctx.moveTo(x,y);if(!isScalingMatrix){current.updatePathMinMax(currentTransform,x,y);}break;case OPS.lineTo:x=args[j++];y=args[j++];ctx.lineTo(x,y);if(!isScalingMatrix){current.updatePathMinMax(currentTransform,x,y);}break;case OPS.curveTo:startX=x;startY=y;x=args[j+4];y=args[j+5];ctx.bezierCurveTo(args[j],args[j+1],args[j+2],args[j+3],x,y);current.updateCurvePathMinMax(currentTransform,startX,startY,args[j],args[j+1],args[j+2],args[j+3],x,y,minMaxForBezier);j+=6;break;case OPS.curveTo2:startX=x;startY=y;ctx.bezierCurveTo(x,y,args[j],args[j+1],args[j+2],args[j+3]);current.updateCurvePathMinMax(currentTransform,startX,startY,x,y,args[j],args[j+1],args[j+2],args[j+3],minMaxForBezier);x=args[j+2];y=args[j+3];j+=4;break;case OPS.curveTo3:startX=x;startY=y;x=args[j+2];y=args[j+3];ctx.bezierCurveTo(args[j],args[j+1],x,y,x,y);current.updateCurvePathMinMax(currentTransform,startX,startY,args[j],args[j+1],x,y,x,y,minMaxForBezier);j+=4;break;case OPS.closePath:ctx.closePath();break;}}if(isScalingMatrix){current.updateScalingPathMinMax(currentTransform,minMaxForBezier);}current.setCurrentPoint(x,y);}closePath(){this.ctx.closePath();}stroke(){let consumePath=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;const ctx=this.ctx;const strokeColor=this.current.strokeColor;ctx.globalAlpha=this.current.strokeAlpha;if(this.contentVisible){if(typeof strokeColor==="object"&&strokeColor?.getPattern){ctx.save();ctx.strokeStyle=strokeColor.getPattern(ctx,this,getCurrentTransformInverse(ctx),PathType.STROKE);this.rescaleAndStroke(false);ctx.restore();}else{this.rescaleAndStroke(true);}}if(consumePath){this.consumePath(this.current.getClippedPathBoundingBox());}ctx.globalAlpha=this.current.fillAlpha;}closeStroke(){this.closePath();this.stroke();}fill(){let consumePath=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;const ctx=this.ctx;const fillColor=this.current.fillColor;const isPatternFill=this.current.patternFill;let needRestore=false;if(isPatternFill){ctx.save();ctx.fillStyle=fillColor.getPattern(ctx,this,getCurrentTransformInverse(ctx),PathType.FILL);needRestore=true;}const intersect=this.current.getClippedPathBoundingBox();if(this.contentVisible&&intersect!==null){if(this.pendingEOFill){ctx.fill("evenodd");this.pendingEOFill=false;}else{ctx.fill();}}if(needRestore){ctx.restore();}if(consumePath){this.consumePath(intersect);}}eoFill(){this.pendingEOFill=true;this.fill();}fillStroke(){this.fill(false);this.stroke(false);this.consumePath();}eoFillStroke(){this.pendingEOFill=true;this.fillStroke();}closeFillStroke(){this.closePath();this.fillStroke();}closeEOFillStroke(){this.pendingEOFill=true;this.closePath();this.fillStroke();}endPath(){this.consumePath();}clip(){this.pendingClip=NORMAL_CLIP;}eoClip(){this.pendingClip=EO_CLIP;}beginText(){this.current.textMatrix=IDENTITY_MATRIX;this.current.textMatrixScale=1;this.current.x=this.current.lineX=0;this.current.y=this.current.lineY=0;}endText(){const paths=this.pendingTextPaths;const ctx=this.ctx;if(paths===undefined){ctx.beginPath();return;}ctx.save();ctx.beginPath();for(const path of paths){ctx.setTransform(...path.transform);ctx.translate(path.x,path.y);path.addToPath(ctx,path.fontSize);}ctx.restore();ctx.clip();ctx.beginPath();delete this.pendingTextPaths;}setCharSpacing(spacing){this.current.charSpacing=spacing;}setWordSpacing(spacing){this.current.wordSpacing=spacing;}setHScale(scale){this.current.textHScale=scale/100;}setLeading(leading){this.current.leading=-leading;}setFont(fontRefName,size){const fontObj=this.commonObjs.get(fontRefName);const current=this.current;if(!fontObj){throw new Error(`Can't find font for ${fontRefName}`);}current.fontMatrix=fontObj.fontMatrix||FONT_IDENTITY_MATRIX;if(current.fontMatrix[0]===0||current.fontMatrix[3]===0){warn("Invalid font matrix for font "+fontRefName);}if(size<0){size=-size;current.fontDirection=-1;}else{current.fontDirection=1;}this.current.font=fontObj;this.current.fontSize=size;if(fontObj.isType3Font){return;}const name=fontObj.loadedName||"sans-serif";const typeface=fontObj.systemFontInfo?.css||`"${name}", ${fontObj.fallbackName}`;let bold="normal";if(fontObj.black){bold="900";}else if(fontObj.bold){bold="bold";}const italic=fontObj.italic?"italic":"normal";let browserFontSize=size;if(size<MIN_FONT_SIZE){browserFontSize=MIN_FONT_SIZE;}else if(size>MAX_FONT_SIZE){browserFontSize=MAX_FONT_SIZE;}this.current.fontSizeScale=size/browserFontSize;this.ctx.font=`${italic} ${bold} ${browserFontSize}px ${typeface}`;}setTextRenderingMode(mode){this.current.textRenderingMode=mode;}setTextRise(rise){this.current.textRise=rise;}moveText(x,y){this.current.x=this.current.lineX+=x;this.current.y=this.current.lineY+=y;}setLeadingMoveText(x,y){this.setLeading(-y);this.moveText(x,y);}setTextMatrix(a,b,c,d,e,f){this.current.textMatrix=[a,b,c,d,e,f];this.current.textMatrixScale=Math.hypot(a,b);this.current.x=this.current.lineX=0;this.current.y=this.current.lineY=0;}nextLine(){this.moveText(0,this.current.leading);}paintChar(character,x,y,patternTransform){const ctx=this.ctx;const current=this.current;const font=current.font;const textRenderingMode=current.textRenderingMode;const fontSize=current.fontSize/current.fontSizeScale;const fillStrokeMode=textRenderingMode&TextRenderingMode.FILL_STROKE_MASK;const isAddToPathSet=!!(textRenderingMode&TextRenderingMode.ADD_TO_PATH_FLAG);const patternFill=current.patternFill&&!font.missingFile;let addToPath;if(font.disableFontFace||isAddToPathSet||patternFill){addToPath=font.getPathGenerator(this.commonObjs,character);}if(font.disableFontFace||patternFill){ctx.save();ctx.translate(x,y);ctx.beginPath();addToPath(ctx,fontSize);if(patternTransform){ctx.setTransform(...patternTransform);}if(fillStrokeMode===TextRenderingMode.FILL||fillStrokeMode===TextRenderingMode.FILL_STROKE){ctx.fill();}if(fillStrokeMode===TextRenderingMode.STROKE||fillStrokeMode===TextRenderingMode.FILL_STROKE){ctx.stroke();}ctx.restore();}else{if(fillStrokeMode===TextRenderingMode.FILL||fillStrokeMode===TextRenderingMode.FILL_STROKE){ctx.fillText(character,x,y);}if(fillStrokeMode===TextRenderingMode.STROKE||fillStrokeMode===TextRenderingMode.FILL_STROKE){ctx.strokeText(character,x,y);}}if(isAddToPathSet){const paths=this.pendingTextPaths||=[];paths.push({transform:getCurrentTransform(ctx),x,y,fontSize,addToPath});}}get isFontSubpixelAAEnabled(){const{context:ctx}=this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled",10,10);ctx.scale(1.5,1);ctx.fillText("I",0,10);const data=ctx.getImageData(0,0,10,10).data;let enabled=false;for(let i=3;i<data.length;i+=4){if(data[i]>0&&data[i]<255){enabled=true;break;}}return shadow(this,"isFontSubpixelAAEnabled",enabled);}showText(glyphs){const current=this.current;const font=current.font;if(font.isType3Font){return this.showType3Text(glyphs);}const fontSize=current.fontSize;if(fontSize===0){return undefined;}const ctx=this.ctx;const fontSizeScale=current.fontSizeScale;const charSpacing=current.charSpacing;const wordSpacing=current.wordSpacing;const fontDirection=current.fontDirection;const textHScale=current.textHScale*fontDirection;const glyphsLength=glyphs.length;const vertical=font.vertical;const spacingDir=vertical?1:-1;const defaultVMetrics=font.defaultVMetrics;const widthAdvanceScale=fontSize*current.fontMatrix[0];const simpleFillText=current.textRenderingMode===TextRenderingMode.FILL&&!font.disableFontFace&&!current.patternFill;ctx.save();ctx.transform(...current.textMatrix);ctx.translate(current.x,current.y+current.textRise);if(fontDirection>0){ctx.scale(textHScale,-1);}else{ctx.scale(textHScale,1);}let patternTransform;if(current.patternFill){ctx.save();const pattern=current.fillColor.getPattern(ctx,this,getCurrentTransformInverse(ctx),PathType.FILL);patternTransform=getCurrentTransform(ctx);ctx.restore();ctx.fillStyle=pattern;}let lineWidth=current.lineWidth;const scale=current.textMatrixScale;if(scale===0||lineWidth===0){const fillStrokeMode=current.textRenderingMode&TextRenderingMode.FILL_STROKE_MASK;if(fillStrokeMode===TextRenderingMode.STROKE||fillStrokeMode===TextRenderingMode.FILL_STROKE){lineWidth=this.getSinglePixelWidth();}}else{lineWidth/=scale;}if(fontSizeScale!==1.0){ctx.scale(fontSizeScale,fontSizeScale);lineWidth/=fontSizeScale;}ctx.lineWidth=lineWidth;if(font.isInvalidPDFjsFont){const chars=[];let width=0;for(const glyph of glyphs){chars.push(glyph.unicode);width+=glyph.width;}ctx.fillText(chars.join(""),0,0);current.x+=width*widthAdvanceScale*textHScale;ctx.restore();this.compose();return undefined;}let x=0,i;for(i=0;i<glyphsLength;++i){const glyph=glyphs[i];if(typeof glyph==="number"){x+=spacingDir*glyph*fontSize/1000;continue;}let restoreNeeded=false;const spacing=(glyph.isSpace?wordSpacing:0)+charSpacing;const character=glyph.fontChar;const accent=glyph.accent;let scaledX,scaledY;let width=glyph.width;if(vertical){const vmetric=glyph.vmetric||defaultVMetrics;const vx=-(glyph.vmetric?vmetric[1]:width*0.5)*widthAdvanceScale;const vy=vmetric[2]*widthAdvanceScale;width=vmetric?-vmetric[0]:width;scaledX=vx/fontSizeScale;scaledY=(x+vy)/fontSizeScale;}else{scaledX=x/fontSizeScale;scaledY=0;}if(font.remeasure&&width>0){const measuredWidth=ctx.measureText(character).width*1000/fontSize*fontSizeScale;if(width<measuredWidth&&this.isFontSubpixelAAEnabled){const characterScaleX=width/measuredWidth;restoreNeeded=true;ctx.save();ctx.scale(characterScaleX,1);scaledX/=characterScaleX;}else if(width!==measuredWidth){scaledX+=(width-measuredWidth)/2000*fontSize/fontSizeScale;}}if(this.contentVisible&&(glyph.isInFont||font.missingFile)){if(simpleFillText&&!accent){ctx.fillText(character,scaledX,scaledY);}else{this.paintChar(character,scaledX,scaledY,patternTransform);if(accent){const scaledAccentX=scaledX+fontSize*accent.offset.x/fontSizeScale;const scaledAccentY=scaledY-fontSize*accent.offset.y/fontSizeScale;this.paintChar(accent.fontChar,scaledAccentX,scaledAccentY,patternTransform);}}}const charWidth=vertical?width*widthAdvanceScale-spacing*fontDirection:width*widthAdvanceScale+spacing*fontDirection;x+=charWidth;if(restoreNeeded){ctx.restore();}}if(vertical){current.y-=x;}else{current.x+=x*textHScale;}ctx.restore();this.compose();return undefined;}showType3Text(glyphs){const ctx=this.ctx;const current=this.current;const font=current.font;const fontSize=current.fontSize;const fontDirection=current.fontDirection;const spacingDir=font.vertical?1:-1;const charSpacing=current.charSpacing;const wordSpacing=current.wordSpacing;const textHScale=current.textHScale*fontDirection;const fontMatrix=current.fontMatrix||FONT_IDENTITY_MATRIX;const glyphsLength=glyphs.length;const isTextInvisible=current.textRenderingMode===TextRenderingMode.INVISIBLE;let i,glyph,width,spacingLength;if(isTextInvisible||fontSize===0){return;}this._cachedScaleForStroking[0]=-1;this._cachedGetSinglePixelWidth=null;ctx.save();ctx.transform(...current.textMatrix);ctx.translate(current.x,current.y);ctx.scale(textHScale,fontDirection);for(i=0;i<glyphsLength;++i){glyph=glyphs[i];if(typeof glyph==="number"){spacingLength=spacingDir*glyph*fontSize/1000;this.ctx.translate(spacingLength,0);current.x+=spacingLength*textHScale;continue;}const spacing=(glyph.isSpace?wordSpacing:0)+charSpacing;const operatorList=font.charProcOperatorList[glyph.operatorListId];if(!operatorList){warn(`Type3 character "${glyph.operatorListId}" is not available.`);continue;}if(this.contentVisible){this.processingType3=glyph;this.save();ctx.scale(fontSize,fontSize);ctx.transform(...fontMatrix);this.executeOperatorList(operatorList);this.restore();}const transformed=Util.applyTransform([glyph.width,0],fontMatrix);width=transformed[0]*fontSize+spacing;ctx.translate(width,0);current.x+=width*textHScale;}ctx.restore();this.processingType3=null;}setCharWidth(xWidth,yWidth){}setCharWidthAndBounds(xWidth,yWidth,llx,lly,urx,ury){this.ctx.rect(llx,lly,urx-llx,ury-lly);this.ctx.clip();this.endPath();}getColorN_Pattern(IR){let pattern;if(IR[0]==="TilingPattern"){const color=IR[1];const baseTransform=this.baseTransform||getCurrentTransform(this.ctx);const canvasGraphicsFactory={createCanvasGraphics:ctx=>new CanvasGraphics(ctx,this.commonObjs,this.objs,this.canvasFactory,this.filterFactory,{optionalContentConfig:this.optionalContentConfig,markedContentStack:this.markedContentStack})};pattern=new TilingPattern(IR,color,this.ctx,canvasGraphicsFactory,baseTransform);}else{pattern=this._getPattern(IR[1],IR[2]);}return pattern;}setStrokeColorN(){this.current.strokeColor=this.getColorN_Pattern(arguments);}setFillColorN(){this.current.fillColor=this.getColorN_Pattern(arguments);this.current.patternFill=true;}setStrokeRGBColor(r,g,b){const color=Util.makeHexColor(r,g,b);this.ctx.strokeStyle=color;this.current.strokeColor=color;}setFillRGBColor(r,g,b){const color=Util.makeHexColor(r,g,b);this.ctx.fillStyle=color;this.current.fillColor=color;this.current.patternFill=false;}_getPattern(objId){let matrix=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let pattern;if(this.cachedPatterns.has(objId)){pattern=this.cachedPatterns.get(objId);}else{pattern=getShadingPattern(this.getObject(objId));this.cachedPatterns.set(objId,pattern);}if(matrix){pattern.matrix=matrix;}return pattern;}shadingFill(objId){if(!this.contentVisible){return;}const ctx=this.ctx;this.save();const pattern=this._getPattern(objId);ctx.fillStyle=pattern.getPattern(ctx,this,getCurrentTransformInverse(ctx),PathType.SHADING);const inv=getCurrentTransformInverse(ctx);if(inv){const{width,height}=ctx.canvas;const[x0,y0,x1,y1]=Util.getAxialAlignedBoundingBox([0,0,width,height],inv);this.ctx.fillRect(x0,y0,x1-x0,y1-y0);}else{this.ctx.fillRect(-1e10,-1e10,2e10,2e10);}this.compose(this.current.getClippedPathBoundingBox());this.restore();}beginInlineImage(){unreachable("Should not call beginInlineImage");}beginImageData(){unreachable("Should not call beginImageData");}paintFormXObjectBegin(matrix,bbox){if(!this.contentVisible){return;}this.save();this.baseTransformStack.push(this.baseTransform);if(matrix){this.transform(...matrix);}this.baseTransform=getCurrentTransform(this.ctx);if(bbox){const width=bbox[2]-bbox[0];const height=bbox[3]-bbox[1];this.ctx.rect(bbox[0],bbox[1],width,height);this.current.updateRectMinMax(getCurrentTransform(this.ctx),bbox);this.clip();this.endPath();}}paintFormXObjectEnd(){if(!this.contentVisible){return;}this.restore();this.baseTransform=this.baseTransformStack.pop();}beginGroup(group){if(!this.contentVisible){return;}this.save();if(this.inSMaskMode){this.endSMaskMode();this.current.activeSMask=null;}const currentCtx=this.ctx;if(!group.isolated){info("TODO: Support non-isolated groups.");}if(group.knockout){warn("Knockout groups not supported.");}const currentTransform=getCurrentTransform(currentCtx);if(group.matrix){currentCtx.transform(...group.matrix);}if(!group.bbox){throw new Error("Bounding box is required.");}let bounds=Util.getAxialAlignedBoundingBox(group.bbox,getCurrentTransform(currentCtx));const canvasBounds=[0,0,currentCtx.canvas.width,currentCtx.canvas.height];bounds=Util.intersect(bounds,canvasBounds)||[0,0,0,0];const offsetX=Math.floor(bounds[0]);const offsetY=Math.floor(bounds[1]);const drawnWidth=Math.max(Math.ceil(bounds[2])-offsetX,1);const drawnHeight=Math.max(Math.ceil(bounds[3])-offsetY,1);this.current.startNewPathAndClipBox([0,0,drawnWidth,drawnHeight]);let cacheId="groupAt"+this.groupLevel;if(group.smask){cacheId+="_smask_"+this.smaskCounter++%2;}const scratchCanvas=this.cachedCanvases.getCanvas(cacheId,drawnWidth,drawnHeight);const groupCtx=scratchCanvas.context;groupCtx.translate(-offsetX,-offsetY);groupCtx.transform(...currentTransform);if(group.smask){this.smaskStack.push({canvas:scratchCanvas.canvas,context:groupCtx,offsetX,offsetY,subtype:group.smask.subtype,backdrop:group.smask.backdrop,transferMap:group.smask.transferMap||null,startTransformInverse:null});}else{currentCtx.setTransform(1,0,0,1,0,0);currentCtx.translate(offsetX,offsetY);currentCtx.save();}copyCtxState(currentCtx,groupCtx);this.ctx=groupCtx;this.setGState([["BM","source-over"],["ca",1],["CA",1]]);this.groupStack.push(currentCtx);this.groupLevel++;}endGroup(group){if(!this.contentVisible){return;}this.groupLevel--;const groupCtx=this.ctx;const ctx=this.groupStack.pop();this.ctx=ctx;this.ctx.imageSmoothingEnabled=false;if(group.smask){this.tempSMask=this.smaskStack.pop();this.restore();}else{this.ctx.restore();const currentMtx=getCurrentTransform(this.ctx);this.restore();this.ctx.save();this.ctx.setTransform(...currentMtx);const dirtyBox=Util.getAxialAlignedBoundingBox([0,0,groupCtx.canvas.width,groupCtx.canvas.height],currentMtx);this.ctx.drawImage(groupCtx.canvas,0,0);this.ctx.restore();this.compose(dirtyBox);}}beginAnnotation(id,rect,transform,matrix,hasOwnCanvas){canvas_assertClassBrand(_CanvasGraphics_brand,this,_restoreInitialState).call(this);resetCtxToDefault(this.ctx);this.ctx.save();this.save();if(this.baseTransform){this.ctx.setTransform(...this.baseTransform);}if(rect){const width=rect[2]-rect[0];const height=rect[3]-rect[1];if(hasOwnCanvas&&this.annotationCanvasMap){transform=transform.slice();transform[4]-=rect[0];transform[5]-=rect[1];rect=rect.slice();rect[0]=rect[1]=0;rect[2]=width;rect[3]=height;const[scaleX,scaleY]=Util.singularValueDecompose2dScale(getCurrentTransform(this.ctx));const{viewportScale}=this;const canvasWidth=Math.ceil(width*this.outputScaleX*viewportScale);const canvasHeight=Math.ceil(height*this.outputScaleY*viewportScale);this.annotationCanvas=this.canvasFactory.create(canvasWidth,canvasHeight);const{canvas,context}=this.annotationCanvas;this.annotationCanvasMap.set(id,canvas);this.annotationCanvas.savedCtx=this.ctx;this.ctx=context;this.ctx.save();this.ctx.setTransform(scaleX,0,0,-scaleY,0,height*scaleY);resetCtxToDefault(this.ctx);}else{resetCtxToDefault(this.ctx);this.ctx.rect(rect[0],rect[1],width,height);this.ctx.clip();this.endPath();}}this.current=new CanvasExtraState(this.ctx.canvas.width,this.ctx.canvas.height);this.transform(...transform);this.transform(...matrix);}endAnnotation(){if(this.annotationCanvas){this.ctx.restore();canvas_assertClassBrand(_CanvasGraphics_brand,this,_drawFilter).call(this);this.ctx=this.annotationCanvas.savedCtx;delete this.annotationCanvas.savedCtx;delete this.annotationCanvas;}}paintImageMaskXObject(img){if(!this.contentVisible){return;}const count=img.count;img=this.getObject(img.data,img);img.count=count;const ctx=this.ctx;const glyph=this.processingType3;if(glyph){if(glyph.compiled===undefined){glyph.compiled=compileType3Glyph(img);}if(glyph.compiled){glyph.compiled(ctx);return;}}const mask=this._createMaskCanvas(img);const maskCanvas=mask.canvas;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(maskCanvas,mask.offsetX,mask.offsetY);ctx.restore();this.compose();}paintImageMaskXObjectRepeat(img,scaleX){let skewX=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;let skewY=arguments.length>3&&arguments[3]!==undefined?arguments[3]:0;let scaleY=arguments.length>4?arguments[4]:undefined;let positions=arguments.length>5?arguments[5]:undefined;if(!this.contentVisible){return;}img=this.getObject(img.data,img);const ctx=this.ctx;ctx.save();const currentTransform=getCurrentTransform(ctx);ctx.transform(scaleX,skewX,skewY,scaleY,0,0);const mask=this._createMaskCanvas(img);ctx.setTransform(1,0,0,1,mask.offsetX-currentTransform[4],mask.offsetY-currentTransform[5]);for(let i=0,ii=positions.length;i<ii;i+=2){const trans=Util.transform(currentTransform,[scaleX,skewX,skewY,scaleY,positions[i],positions[i+1]]);const[x,y]=Util.applyTransform([0,0],trans);ctx.drawImage(mask.canvas,x,y);}ctx.restore();this.compose();}paintImageMaskXObjectGroup(images){if(!this.contentVisible){return;}const ctx=this.ctx;const fillColor=this.current.fillColor;const isPatternFill=this.current.patternFill;for(const image of images){const{data,width,height,transform}=image;const maskCanvas=this.cachedCanvases.getCanvas("maskCanvas",width,height);const maskCtx=maskCanvas.context;maskCtx.save();const img=this.getObject(data,image);putBinaryImageMask(maskCtx,img);maskCtx.globalCompositeOperation="source-in";maskCtx.fillStyle=isPatternFill?fillColor.getPattern(maskCtx,this,getCurrentTransformInverse(ctx),PathType.FILL):fillColor;maskCtx.fillRect(0,0,width,height);maskCtx.restore();ctx.save();ctx.transform(...transform);ctx.scale(1,-1);drawImageAtIntegerCoords(ctx,maskCanvas.canvas,0,0,width,height,0,-1,1,1);ctx.restore();}this.compose();}paintImageXObject(objId){if(!this.contentVisible){return;}const imgData=this.getObject(objId);if(!imgData){warn("Dependent image isn't ready yet");return;}this.paintInlineImageXObject(imgData);}paintImageXObjectRepeat(objId,scaleX,scaleY,positions){if(!this.contentVisible){return;}const imgData=this.getObject(objId);if(!imgData){warn("Dependent image isn't ready yet");return;}const width=imgData.width;const height=imgData.height;const map=[];for(let i=0,ii=positions.length;i<ii;i+=2){map.push({transform:[scaleX,0,0,scaleY,positions[i],positions[i+1]],x:0,y:0,w:width,h:height});}this.paintInlineImageXObjectGroup(imgData,map);}applyTransferMapsToCanvas(ctx){if(this.current.transferMaps!=="none"){ctx.filter=this.current.transferMaps;ctx.drawImage(ctx.canvas,0,0);ctx.filter="none";}return ctx.canvas;}applyTransferMapsToBitmap(imgData){if(this.current.transferMaps==="none"){return imgData.bitmap;}const{bitmap,width,height}=imgData;const tmpCanvas=this.cachedCanvases.getCanvas("inlineImage",width,height);const tmpCtx=tmpCanvas.context;tmpCtx.filter=this.current.transferMaps;tmpCtx.drawImage(bitmap,0,0);tmpCtx.filter="none";return tmpCanvas.canvas;}paintInlineImageXObject(imgData){if(!this.contentVisible){return;}const width=imgData.width;const height=imgData.height;const ctx=this.ctx;this.save();if(!isNodeJS){const{filter}=ctx;if(filter!=="none"&&filter!==""){ctx.filter="none";}}ctx.scale(1/width,-1/height);let imgToPaint;if(imgData.bitmap){imgToPaint=this.applyTransferMapsToBitmap(imgData);}else if(typeof HTMLElement==="function"&&imgData instanceof HTMLElement||!imgData.data){imgToPaint=imgData;}else{const tmpCanvas=this.cachedCanvases.getCanvas("inlineImage",width,height);const tmpCtx=tmpCanvas.context;putBinaryImageData(tmpCtx,imgData);imgToPaint=this.applyTransferMapsToCanvas(tmpCtx);}const scaled=this._scaleImage(imgToPaint,getCurrentTransformInverse(ctx));ctx.imageSmoothingEnabled=getImageSmoothingEnabled(getCurrentTransform(ctx),imgData.interpolate);drawImageAtIntegerCoords(ctx,scaled.img,0,0,scaled.paintWidth,scaled.paintHeight,0,-height,width,height);this.compose();this.restore();}paintInlineImageXObjectGroup(imgData,map){if(!this.contentVisible){return;}const ctx=this.ctx;let imgToPaint;if(imgData.bitmap){imgToPaint=imgData.bitmap;}else{const w=imgData.width;const h=imgData.height;const tmpCanvas=this.cachedCanvases.getCanvas("inlineImage",w,h);const tmpCtx=tmpCanvas.context;putBinaryImageData(tmpCtx,imgData);imgToPaint=this.applyTransferMapsToCanvas(tmpCtx);}for(const entry of map){ctx.save();ctx.transform(...entry.transform);ctx.scale(1,-1);drawImageAtIntegerCoords(ctx,imgToPaint,entry.x,entry.y,entry.w,entry.h,0,-1,1,1);ctx.restore();}this.compose();}paintSolidColorImageMask(){if(!this.contentVisible){return;}this.ctx.fillRect(0,0,1,1);this.compose();}markPoint(tag){}markPointProps(tag,properties){}beginMarkedContent(tag){this.markedContentStack.push({visible:true});}beginMarkedContentProps(tag,properties){if(tag==="OC"){this.markedContentStack.push({visible:this.optionalContentConfig.isVisible(properties)});}else{this.markedContentStack.push({visible:true});}this.contentVisible=this.isContentVisible();}endMarkedContent(){this.markedContentStack.pop();this.contentVisible=this.isContentVisible();}beginCompat(){}endCompat(){}consumePath(clipBox){const isEmpty=this.current.isEmptyClip();if(this.pendingClip){this.current.updateClipFromPath();}if(!this.pendingClip){this.compose(clipBox);}const ctx=this.ctx;if(this.pendingClip){if(!isEmpty){if(this.pendingClip===EO_CLIP){ctx.clip("evenodd");}else{ctx.clip();}}this.pendingClip=null;}this.current.startNewPathAndClipBox(this.current.clipBox);ctx.beginPath();}getSinglePixelWidth(){if(!this._cachedGetSinglePixelWidth){const m=getCurrentTransform(this.ctx);if(m[1]===0&&m[2]===0){this._cachedGetSinglePixelWidth=1/Math.min(Math.abs(m[0]),Math.abs(m[3]));}else{const absDet=Math.abs(m[0]*m[3]-m[2]*m[1]);const normX=Math.hypot(m[0],m[2]);const normY=Math.hypot(m[1],m[3]);this._cachedGetSinglePixelWidth=Math.max(normX,normY)/absDet;}}return this._cachedGetSinglePixelWidth;}getScaleForStroking(){if(this._cachedScaleForStroking[0]===-1){const{lineWidth}=this.current;const{a,b,c,d}=this.ctx.getTransform();let scaleX,scaleY;if(b===0&&c===0){const normX=Math.abs(a);const normY=Math.abs(d);if(normX===normY){if(lineWidth===0){scaleX=scaleY=1/normX;}else{const scaledLineWidth=normX*lineWidth;scaleX=scaleY=scaledLineWidth<1?1/scaledLineWidth:1;}}else if(lineWidth===0){scaleX=1/normX;scaleY=1/normY;}else{const scaledXLineWidth=normX*lineWidth;const scaledYLineWidth=normY*lineWidth;scaleX=scaledXLineWidth<1?1/scaledXLineWidth:1;scaleY=scaledYLineWidth<1?1/scaledYLineWidth:1;}}else{const absDet=Math.abs(a*d-b*c);const normX=Math.hypot(a,b);const normY=Math.hypot(c,d);if(lineWidth===0){scaleX=normY/absDet;scaleY=normX/absDet;}else{const baseArea=lineWidth*absDet;scaleX=normY>baseArea?normY/baseArea:1;scaleY=normX>baseArea?normX/baseArea:1;}}this._cachedScaleForStroking[0]=scaleX;this._cachedScaleForStroking[1]=scaleY;}return this._cachedScaleForStroking;}rescaleAndStroke(saveRestore){const{ctx}=this;const{lineWidth}=this.current;const[scaleX,scaleY]=this.getScaleForStroking();ctx.lineWidth=lineWidth||1;if(scaleX===1&&scaleY===1){ctx.stroke();return;}const dashes=ctx.getLineDash();if(saveRestore){ctx.save();}ctx.scale(scaleX,scaleY);if(dashes.length>0){const scale=Math.max(scaleX,scaleY);ctx.setLineDash(dashes.map(x=>x/scale));ctx.lineDashOffset/=scale;}ctx.stroke();if(saveRestore){ctx.restore();}}isContentVisible(){for(let i=this.markedContentStack.length-1;i>=0;i--){if(!this.markedContentStack[i].visible){return false;}}return true;}}function _restoreInitialState(){while(this.stateStack.length||this.inSMaskMode){this.restore();}this.ctx.restore();if(this.transparentCanvas){this.ctx=this.compositeCtx;this.ctx.save();this.ctx.setTransform(1,0,0,1,0,0);this.ctx.drawImage(this.transparentCanvas,0,0);this.ctx.restore();this.transparentCanvas=null;}}function _drawFilter(){if(this.pageColors){const hcmFilterId=this.filterFactory.addHCMFilter(this.pageColors.foreground,this.pageColors.background);if(hcmFilterId!=="none"){const savedFilter=this.ctx.filter;this.ctx.filter=hcmFilterId;this.ctx.drawImage(this.ctx.canvas,0,0);this.ctx.filter=savedFilter;}}}for(const op in OPS){if(CanvasGraphics.prototype[op]!==undefined){CanvasGraphics.prototype[OPS[op]]=CanvasGraphics.prototype[op];}}
;// CONCATENATED MODULE: ./src/display/worker_options.js
function worker_options_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}class GlobalWorkerOptions{static get workerPort(){return worker_options_assertClassBrand(GlobalWorkerOptions,this,_port)._;}static set workerPort(val){if(!(typeof Worker!=="undefined"&&val instanceof Worker)&&val!==null){throw new Error("Invalid `workerPort` type.");}_port._=worker_options_assertClassBrand(GlobalWorkerOptions,this,val);}static get workerSrc(){return worker_options_assertClassBrand(GlobalWorkerOptions,this,_src)._;}static set workerSrc(val){if(typeof val!=="string"){throw new Error("Invalid `workerSrc` type.");}_src._=worker_options_assertClassBrand(GlobalWorkerOptions,this,val);}}var _port={_:null};var _src={_:""};
;// CONCATENATED MODULE: ./src/shared/message_handler.js
function message_handler_classPrivateMethodInitSpec(e,a){message_handler_checkPrivateRedeclaration(e,a),a.add(e);}function message_handler_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function message_handler_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const CallbackKind={UNKNOWN:0,DATA:1,ERROR:2};const StreamKind={UNKNOWN:0,CANCEL:1,CANCEL_COMPLETE:2,CLOSE:3,ENQUEUE:4,ERROR:5,PULL:6,PULL_COMPLETE:7,START_COMPLETE:8};function wrapReason(reason){if(!(reason instanceof Error||typeof reason==="object"&&reason!==null)){unreachable('wrapReason: Expected "reason" to be a (possibly cloned) Error.');}switch(reason.name){case"AbortException":return new AbortException(reason.message);case"MissingPDFException":return new MissingPDFException(reason.message);case"PasswordException":return new PasswordException(reason.message,reason.code);case"UnexpectedResponseException":return new UnexpectedResponseException(reason.message,reason.status);case"UnknownErrorException":return new UnknownErrorException(reason.message,reason.details);default:return new UnknownErrorException(reason.message,reason.toString());}}var _MessageHandler_brand=/*#__PURE__*/new WeakSet();class MessageHandler{constructor(_sourceName,_targetName,_comObj){message_handler_classPrivateMethodInitSpec(this,_MessageHandler_brand);this.sourceName=_sourceName;this.targetName=_targetName;this.comObj=_comObj;this.callbackId=1;this.streamId=1;this.streamSinks=Object.create(null);this.streamControllers=Object.create(null);this.callbackCapabilities=Object.create(null);this.actionHandler=Object.create(null);this._onComObjOnMessage=event=>{const data=event.data;if(data.targetName!==this.sourceName){return;}if(data.stream){message_handler_assertClassBrand(_MessageHandler_brand,this,_processStreamMessage).call(this,data);return;}if(data.callback){const callbackId=data.callbackId;const capability=this.callbackCapabilities[callbackId];if(!capability){throw new Error(`Cannot resolve callback ${callbackId}`);}delete this.callbackCapabilities[callbackId];if(data.callback===CallbackKind.DATA){capability.resolve(data.data);}else if(data.callback===CallbackKind.ERROR){capability.reject(wrapReason(data.reason));}else{throw new Error("Unexpected callback case");}return;}const action=this.actionHandler[data.action];if(!action){throw new Error(`Unknown action from worker: ${data.action}`);}if(data.callbackId){const cbSourceName=this.sourceName;const cbTargetName=data.sourceName;new Promise(function(resolve){resolve(action(data.data));}).then(function(result){_comObj.postMessage({sourceName:cbSourceName,targetName:cbTargetName,callback:CallbackKind.DATA,callbackId:data.callbackId,data:result});},function(reason){_comObj.postMessage({sourceName:cbSourceName,targetName:cbTargetName,callback:CallbackKind.ERROR,callbackId:data.callbackId,reason:wrapReason(reason)});});return;}if(data.streamId){message_handler_assertClassBrand(_MessageHandler_brand,this,_createStreamSink).call(this,data);return;}action(data.data);};_comObj.addEventListener("message",this._onComObjOnMessage);}on(actionName,handler){const ah=this.actionHandler;if(ah[actionName]){throw new Error(`There is already an actionName called "${actionName}"`);}ah[actionName]=handler;}send(actionName,data,transfers){this.comObj.postMessage({sourceName:this.sourceName,targetName:this.targetName,action:actionName,data},transfers);}sendWithPromise(actionName,data,transfers){const callbackId=this.callbackId++;const capability=Promise.withResolvers();this.callbackCapabilities[callbackId]=capability;try{this.comObj.postMessage({sourceName:this.sourceName,targetName:this.targetName,action:actionName,callbackId,data},transfers);}catch(ex){capability.reject(ex);}return capability.promise;}sendWithStream(actionName,data,queueingStrategy,transfers){const streamId=this.streamId++,sourceName=this.sourceName,targetName=this.targetName,comObj=this.comObj;return new ReadableStream({start:controller=>{const startCapability=Promise.withResolvers();this.streamControllers[streamId]={controller,startCall:startCapability,pullCall:null,cancelCall:null,isClosed:false};comObj.postMessage({sourceName,targetName,action:actionName,streamId,data,desiredSize:controller.desiredSize},transfers);return startCapability.promise;},pull:controller=>{const pullCapability=Promise.withResolvers();this.streamControllers[streamId].pullCall=pullCapability;comObj.postMessage({sourceName,targetName,stream:StreamKind.PULL,streamId,desiredSize:controller.desiredSize});return pullCapability.promise;},cancel:reason=>{assert(reason instanceof Error,"cancel must have a valid reason");const cancelCapability=Promise.withResolvers();this.streamControllers[streamId].cancelCall=cancelCapability;this.streamControllers[streamId].isClosed=true;comObj.postMessage({sourceName,targetName,stream:StreamKind.CANCEL,streamId,reason:wrapReason(reason)});return cancelCapability.promise;}},queueingStrategy);}destroy(){this.comObj.removeEventListener("message",this._onComObjOnMessage);}}function _createStreamSink(data){const streamId=data.streamId,sourceName=this.sourceName,targetName=data.sourceName,comObj=this.comObj;const self=this,action=this.actionHandler[data.action];const streamSink={enqueue(chunk){let size=arguments.length>1&&arguments[1]!==undefined?arguments[1]:1;let transfers=arguments.length>2?arguments[2]:undefined;if(this.isCancelled){return;}const lastDesiredSize=this.desiredSize;this.desiredSize-=size;if(lastDesiredSize>0&&this.desiredSize<=0){this.sinkCapability=Promise.withResolvers();this.ready=this.sinkCapability.promise;}comObj.postMessage({sourceName,targetName,stream:StreamKind.ENQUEUE,streamId,chunk},transfers);},close(){if(this.isCancelled){return;}this.isCancelled=true;comObj.postMessage({sourceName,targetName,stream:StreamKind.CLOSE,streamId});delete self.streamSinks[streamId];},error(reason){assert(reason instanceof Error,"error must have a valid reason");if(this.isCancelled){return;}this.isCancelled=true;comObj.postMessage({sourceName,targetName,stream:StreamKind.ERROR,streamId,reason:wrapReason(reason)});},sinkCapability:Promise.withResolvers(),onPull:null,onCancel:null,isCancelled:false,desiredSize:data.desiredSize,ready:null};streamSink.sinkCapability.resolve();streamSink.ready=streamSink.sinkCapability.promise;this.streamSinks[streamId]=streamSink;new Promise(function(resolve){resolve(action(data.data,streamSink));}).then(function(){comObj.postMessage({sourceName,targetName,stream:StreamKind.START_COMPLETE,streamId,success:true});},function(reason){comObj.postMessage({sourceName,targetName,stream:StreamKind.START_COMPLETE,streamId,reason:wrapReason(reason)});});}function _processStreamMessage(data){const streamId=data.streamId,sourceName=this.sourceName,targetName=data.sourceName,comObj=this.comObj;const streamController=this.streamControllers[streamId],streamSink=this.streamSinks[streamId];switch(data.stream){case StreamKind.START_COMPLETE:if(data.success){streamController.startCall.resolve();}else{streamController.startCall.reject(wrapReason(data.reason));}break;case StreamKind.PULL_COMPLETE:if(data.success){streamController.pullCall.resolve();}else{streamController.pullCall.reject(wrapReason(data.reason));}break;case StreamKind.PULL:if(!streamSink){comObj.postMessage({sourceName,targetName,stream:StreamKind.PULL_COMPLETE,streamId,success:true});break;}if(streamSink.desiredSize<=0&&data.desiredSize>0){streamSink.sinkCapability.resolve();}streamSink.desiredSize=data.desiredSize;new Promise(function(resolve){resolve(streamSink.onPull?.());}).then(function(){comObj.postMessage({sourceName,targetName,stream:StreamKind.PULL_COMPLETE,streamId,success:true});},function(reason){comObj.postMessage({sourceName,targetName,stream:StreamKind.PULL_COMPLETE,streamId,reason:wrapReason(reason)});});break;case StreamKind.ENQUEUE:assert(streamController,"enqueue should have stream controller");if(streamController.isClosed){break;}streamController.controller.enqueue(data.chunk);break;case StreamKind.CLOSE:assert(streamController,"close should have stream controller");if(streamController.isClosed){break;}streamController.isClosed=true;streamController.controller.close();message_handler_assertClassBrand(_MessageHandler_brand,this,_deleteStreamController).call(this,streamController,streamId);break;case StreamKind.ERROR:assert(streamController,"error should have stream controller");streamController.controller.error(wrapReason(data.reason));message_handler_assertClassBrand(_MessageHandler_brand,this,_deleteStreamController).call(this,streamController,streamId);break;case StreamKind.CANCEL_COMPLETE:if(data.success){streamController.cancelCall.resolve();}else{streamController.cancelCall.reject(wrapReason(data.reason));}message_handler_assertClassBrand(_MessageHandler_brand,this,_deleteStreamController).call(this,streamController,streamId);break;case StreamKind.CANCEL:if(!streamSink){break;}new Promise(function(resolve){resolve(streamSink.onCancel?.(wrapReason(data.reason)));}).then(function(){comObj.postMessage({sourceName,targetName,stream:StreamKind.CANCEL_COMPLETE,streamId,success:true});},function(reason){comObj.postMessage({sourceName,targetName,stream:StreamKind.CANCEL_COMPLETE,streamId,reason:wrapReason(reason)});});streamSink.sinkCapability.reject(wrapReason(data.reason));streamSink.isCancelled=true;delete this.streamSinks[streamId];break;default:throw new Error("Unexpected stream case");}}async function _deleteStreamController(streamController,streamId){await Promise.allSettled([streamController.startCall?.promise,streamController.pullCall?.promise,streamController.cancelCall?.promise]);delete this.streamControllers[streamId];}
;// CONCATENATED MODULE: ./src/display/metadata.js
function metadata_classPrivateFieldInitSpec(e,t,a){metadata_checkPrivateRedeclaration(e,t),t.set(e,a);}function metadata_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function metadata_classPrivateFieldGet(s,a){return s.get(metadata_assertClassBrand(s,a));}function metadata_classPrivateFieldSet(s,a,r){return s.set(metadata_assertClassBrand(s,a),r),r;}function metadata_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _metadataMap=/*#__PURE__*/new WeakMap();var _data=/*#__PURE__*/new WeakMap();class Metadata{constructor(_ref){let{parsedData,rawData}=_ref;metadata_classPrivateFieldInitSpec(this,_metadataMap,void 0);metadata_classPrivateFieldInitSpec(this,_data,void 0);metadata_classPrivateFieldSet(_metadataMap,this,parsedData);metadata_classPrivateFieldSet(_data,this,rawData);}getRaw(){return metadata_classPrivateFieldGet(_data,this);}get(name){return metadata_classPrivateFieldGet(_metadataMap,this).get(name)??null;}getAll(){return objectFromMap(metadata_classPrivateFieldGet(_metadataMap,this));}has(name){return metadata_classPrivateFieldGet(_metadataMap,this).has(name);}}
;// CONCATENATED MODULE: ./src/display/optional_content_config.js
function optional_content_config_classPrivateMethodInitSpec(e,a){optional_content_config_checkPrivateRedeclaration(e,a),a.add(e);}function optional_content_config_classPrivateFieldInitSpec(e,t,a){optional_content_config_checkPrivateRedeclaration(e,t),t.set(e,a);}function optional_content_config_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function optional_content_config_classPrivateFieldGet(s,a){return s.get(optional_content_config_assertClassBrand(s,a));}function optional_content_config_classPrivateFieldSet(s,a,r){return s.set(optional_content_config_assertClassBrand(s,a),r),r;}function optional_content_config_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const INTERNAL=Symbol("INTERNAL");var _isDisplay=/*#__PURE__*/new WeakMap();var _isPrint=/*#__PURE__*/new WeakMap();var _userSet=/*#__PURE__*/new WeakMap();var _visible=/*#__PURE__*/new WeakMap();class OptionalContentGroup{constructor(renderingIntent,_ref){let{name,intent,usage}=_ref;optional_content_config_classPrivateFieldInitSpec(this,_isDisplay,false);optional_content_config_classPrivateFieldInitSpec(this,_isPrint,false);optional_content_config_classPrivateFieldInitSpec(this,_userSet,false);optional_content_config_classPrivateFieldInitSpec(this,_visible,true);optional_content_config_classPrivateFieldSet(_isDisplay,this,!!(renderingIntent&RenderingIntentFlag.DISPLAY));optional_content_config_classPrivateFieldSet(_isPrint,this,!!(renderingIntent&RenderingIntentFlag.PRINT));this.name=name;this.intent=intent;this.usage=usage;}get visible(){if(optional_content_config_classPrivateFieldGet(_userSet,this)){return optional_content_config_classPrivateFieldGet(_visible,this);}if(!optional_content_config_classPrivateFieldGet(_visible,this)){return false;}const{print,view}=this.usage;if(optional_content_config_classPrivateFieldGet(_isDisplay,this)){return view?.viewState!=="OFF";}else if(optional_content_config_classPrivateFieldGet(_isPrint,this)){return print?.printState!=="OFF";}return true;}_setVisible(internal,visible){let userSet=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(internal!==INTERNAL){unreachable("Internal method `_setVisible` called.");}optional_content_config_classPrivateFieldSet(_userSet,this,userSet);optional_content_config_classPrivateFieldSet(_visible,this,visible);}}var _cachedGetHash=/*#__PURE__*/new WeakMap();var _groups=/*#__PURE__*/new WeakMap();var _initialHash=/*#__PURE__*/new WeakMap();var _order=/*#__PURE__*/new WeakMap();var _OptionalContentConfig_brand=/*#__PURE__*/new WeakSet();class OptionalContentConfig{constructor(data){let renderingIntent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:RenderingIntentFlag.DISPLAY;optional_content_config_classPrivateMethodInitSpec(this,_OptionalContentConfig_brand);optional_content_config_classPrivateFieldInitSpec(this,_cachedGetHash,null);optional_content_config_classPrivateFieldInitSpec(this,_groups,new Map());optional_content_config_classPrivateFieldInitSpec(this,_initialHash,null);optional_content_config_classPrivateFieldInitSpec(this,_order,null);this.renderingIntent=renderingIntent;this.name=null;this.creator=null;if(data===null){return;}this.name=data.name;this.creator=data.creator;optional_content_config_classPrivateFieldSet(_order,this,data.order);for(const group of data.groups){optional_content_config_classPrivateFieldGet(_groups,this).set(group.id,new OptionalContentGroup(renderingIntent,group));}if(data.baseState==="OFF"){for(const group of optional_content_config_classPrivateFieldGet(_groups,this).values()){group._setVisible(INTERNAL,false);}}for(const on of data.on){optional_content_config_classPrivateFieldGet(_groups,this).get(on)._setVisible(INTERNAL,true);}for(const off of data.off){optional_content_config_classPrivateFieldGet(_groups,this).get(off)._setVisible(INTERNAL,false);}optional_content_config_classPrivateFieldSet(_initialHash,this,this.getHash());}isVisible(group){if(optional_content_config_classPrivateFieldGet(_groups,this).size===0){return true;}if(!group){info("Optional content group not defined.");return true;}if(group.type==="OCG"){if(!optional_content_config_classPrivateFieldGet(_groups,this).has(group.id)){warn(`Optional content group not found: ${group.id}`);return true;}return optional_content_config_classPrivateFieldGet(_groups,this).get(group.id).visible;}else if(group.type==="OCMD"){if(group.expression){return optional_content_config_assertClassBrand(_OptionalContentConfig_brand,this,_evaluateVisibilityExpression).call(this,group.expression);}if(!group.policy||group.policy==="AnyOn"){for(const id of group.ids){if(!optional_content_config_classPrivateFieldGet(_groups,this).has(id)){warn(`Optional content group not found: ${id}`);return true;}if(optional_content_config_classPrivateFieldGet(_groups,this).get(id).visible){return true;}}return false;}else if(group.policy==="AllOn"){for(const id of group.ids){if(!optional_content_config_classPrivateFieldGet(_groups,this).has(id)){warn(`Optional content group not found: ${id}`);return true;}if(!optional_content_config_classPrivateFieldGet(_groups,this).get(id).visible){return false;}}return true;}else if(group.policy==="AnyOff"){for(const id of group.ids){if(!optional_content_config_classPrivateFieldGet(_groups,this).has(id)){warn(`Optional content group not found: ${id}`);return true;}if(!optional_content_config_classPrivateFieldGet(_groups,this).get(id).visible){return true;}}return false;}else if(group.policy==="AllOff"){for(const id of group.ids){if(!optional_content_config_classPrivateFieldGet(_groups,this).has(id)){warn(`Optional content group not found: ${id}`);return true;}if(optional_content_config_classPrivateFieldGet(_groups,this).get(id).visible){return false;}}return true;}warn(`Unknown optional content policy ${group.policy}.`);return true;}warn(`Unknown group type ${group.type}.`);return true;}setVisibility(id){let visible=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;const group=optional_content_config_classPrivateFieldGet(_groups,this).get(id);if(!group){warn(`Optional content group not found: ${id}`);return;}group._setVisible(INTERNAL,!!visible,true);optional_content_config_classPrivateFieldSet(_cachedGetHash,this,null);}setOCGState(_ref2){let{state,preserveRB}=_ref2;let operator;for(const elem of state){switch(elem){case"ON":case"OFF":case"Toggle":operator=elem;continue;}const group=optional_content_config_classPrivateFieldGet(_groups,this).get(elem);if(!group){continue;}switch(operator){case"ON":group._setVisible(INTERNAL,true);break;case"OFF":group._setVisible(INTERNAL,false);break;case"Toggle":group._setVisible(INTERNAL,!group.visible);break;}}optional_content_config_classPrivateFieldSet(_cachedGetHash,this,null);}get hasInitialVisibility(){return optional_content_config_classPrivateFieldGet(_initialHash,this)===null||this.getHash()===optional_content_config_classPrivateFieldGet(_initialHash,this);}getOrder(){if(!optional_content_config_classPrivateFieldGet(_groups,this).size){return null;}if(optional_content_config_classPrivateFieldGet(_order,this)){return optional_content_config_classPrivateFieldGet(_order,this).slice();}return[...optional_content_config_classPrivateFieldGet(_groups,this).keys()];}getGroups(){return optional_content_config_classPrivateFieldGet(_groups,this).size>0?objectFromMap(optional_content_config_classPrivateFieldGet(_groups,this)):null;}getGroup(id){return optional_content_config_classPrivateFieldGet(_groups,this).get(id)||null;}getHash(){if(optional_content_config_classPrivateFieldGet(_cachedGetHash,this)!==null){return optional_content_config_classPrivateFieldGet(_cachedGetHash,this);}const hash=new MurmurHash3_64();for(const[id,group]of optional_content_config_classPrivateFieldGet(_groups,this)){hash.update(`${id}:${group.visible}`);}return optional_content_config_classPrivateFieldSet(_cachedGetHash,this,hash.hexdigest());}}function _evaluateVisibilityExpression(array){const length=array.length;if(length<2){return true;}const operator=array[0];for(let i=1;i<length;i++){const element=array[i];let state;if(Array.isArray(element)){state=optional_content_config_assertClassBrand(_OptionalContentConfig_brand,this,_evaluateVisibilityExpression).call(this,element);}else if(optional_content_config_classPrivateFieldGet(_groups,this).has(element)){state=optional_content_config_classPrivateFieldGet(_groups,this).get(element).visible;}else{warn(`Optional content group not found: ${element}`);return true;}switch(operator){case"And":if(!state){return false;}break;case"Or":if(state){return true;}break;case"Not":return!state;default:return true;}}return operator==="And";}
;// CONCATENATED MODULE: ./src/display/transport_stream.js
class PDFDataTransportStream{constructor(pdfDataRangeTransport,_ref){let{disableRange=false,disableStream=false}=_ref;assert(pdfDataRangeTransport,'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');const{length,initialData,progressiveDone,contentDispositionFilename}=pdfDataRangeTransport;this._queuedChunks=[];this._progressiveDone=progressiveDone;this._contentDispositionFilename=contentDispositionFilename;if(initialData?.length>0){const buffer=initialData instanceof Uint8Array&&initialData.byteLength===initialData.buffer.byteLength?initialData.buffer:new Uint8Array(initialData).buffer;this._queuedChunks.push(buffer);}this._pdfDataRangeTransport=pdfDataRangeTransport;this._isStreamingSupported=!disableStream;this._isRangeSupported=!disableRange;this._contentLength=length;this._fullRequestReader=null;this._rangeReaders=[];pdfDataRangeTransport.addRangeListener((begin,chunk)=>{this._onReceiveData({begin,chunk});});pdfDataRangeTransport.addProgressListener((loaded,total)=>{this._onProgress({loaded,total});});pdfDataRangeTransport.addProgressiveReadListener(chunk=>{this._onReceiveData({chunk});});pdfDataRangeTransport.addProgressiveDoneListener(()=>{this._onProgressiveDone();});pdfDataRangeTransport.transportReady();}_onReceiveData(_ref2){let{begin,chunk}=_ref2;const buffer=chunk instanceof Uint8Array&&chunk.byteLength===chunk.buffer.byteLength?chunk.buffer:new Uint8Array(chunk).buffer;if(begin===undefined){if(this._fullRequestReader){this._fullRequestReader._enqueue(buffer);}else{this._queuedChunks.push(buffer);}}else{const found=this._rangeReaders.some(function(rangeReader){if(rangeReader._begin!==begin){return false;}rangeReader._enqueue(buffer);return true;});assert(found,"_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");}}get _progressiveDataLength(){return this._fullRequestReader?._loaded??0;}_onProgress(evt){if(evt.total===undefined){this._rangeReaders[0]?.onProgress?.({loaded:evt.loaded});}else{this._fullRequestReader?.onProgress?.({loaded:evt.loaded,total:evt.total});}}_onProgressiveDone(){this._fullRequestReader?.progressiveDone();this._progressiveDone=true;}_removeRangeReader(reader){const i=this._rangeReaders.indexOf(reader);if(i>=0){this._rangeReaders.splice(i,1);}}getFullReader(){assert(!this._fullRequestReader,"PDFDataTransportStream.getFullReader can only be called once.");const queuedChunks=this._queuedChunks;this._queuedChunks=null;return new PDFDataTransportStreamReader(this,queuedChunks,this._progressiveDone,this._contentDispositionFilename);}getRangeReader(begin,end){if(end<=this._progressiveDataLength){return null;}const reader=new PDFDataTransportStreamRangeReader(this,begin,end);this._pdfDataRangeTransport.requestDataRange(begin,end);this._rangeReaders.push(reader);return reader;}cancelAllRequests(reason){this._fullRequestReader?.cancel(reason);for(const reader of this._rangeReaders.slice(0)){reader.cancel(reason);}this._pdfDataRangeTransport.abort();}}class PDFDataTransportStreamReader{constructor(stream,queuedChunks){let progressiveDone=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;let contentDispositionFilename=arguments.length>3&&arguments[3]!==undefined?arguments[3]:null;this._stream=stream;this._done=progressiveDone||false;this._filename=isPdfFile(contentDispositionFilename)?contentDispositionFilename:null;this._queuedChunks=queuedChunks||[];this._loaded=0;for(const chunk of this._queuedChunks){this._loaded+=chunk.byteLength;}this._requests=[];this._headersReady=Promise.resolve();stream._fullRequestReader=this;this.onProgress=null;}_enqueue(chunk){if(this._done){return;}if(this._requests.length>0){const requestCapability=this._requests.shift();requestCapability.resolve({value:chunk,done:false});}else{this._queuedChunks.push(chunk);}this._loaded+=chunk.byteLength;}get headersReady(){return this._headersReady;}get filename(){return this._filename;}get isRangeSupported(){return this._stream._isRangeSupported;}get isStreamingSupported(){return this._stream._isStreamingSupported;}get contentLength(){return this._stream._contentLength;}async read(){if(this._queuedChunks.length>0){const chunk=this._queuedChunks.shift();return{value:chunk,done:false};}if(this._done){return{value:undefined,done:true};}const requestCapability=Promise.withResolvers();this._requests.push(requestCapability);return requestCapability.promise;}cancel(reason){this._done=true;for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;}progressiveDone(){if(this._done){return;}this._done=true;}}class PDFDataTransportStreamRangeReader{constructor(stream,begin,end){this._stream=stream;this._begin=begin;this._end=end;this._queuedChunk=null;this._requests=[];this._done=false;this.onProgress=null;}_enqueue(chunk){if(this._done){return;}if(this._requests.length===0){this._queuedChunk=chunk;}else{const requestsCapability=this._requests.shift();requestsCapability.resolve({value:chunk,done:false});for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;}this._done=true;this._stream._removeRangeReader(this);}get isStreamingSupported(){return false;}async read(){if(this._queuedChunk){const chunk=this._queuedChunk;this._queuedChunk=null;return{value:chunk,done:false};}if(this._done){return{value:undefined,done:true};}const requestCapability=Promise.withResolvers();this._requests.push(requestCapability);return requestCapability.promise;}cancel(reason){this._done=true;for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;this._stream._removeRangeReader(this);}}
;// CONCATENATED MODULE: ./src/display/content_disposition.js
function getFilenameFromContentDispositionHeader(contentDisposition){let needsEncodingFixup=true;let tmp=toParamRegExp("filename\\*","i").exec(contentDisposition);if(tmp){tmp=tmp[1];let filename=rfc2616unquote(tmp);filename=unescape(filename);filename=rfc5987decode(filename);filename=rfc2047decode(filename);return fixupEncoding(filename);}tmp=rfc2231getparam(contentDisposition);if(tmp){const filename=rfc2047decode(tmp);return fixupEncoding(filename);}tmp=toParamRegExp("filename","i").exec(contentDisposition);if(tmp){tmp=tmp[1];let filename=rfc2616unquote(tmp);filename=rfc2047decode(filename);return fixupEncoding(filename);}function toParamRegExp(attributePattern,flags){return new RegExp("(?:^|;)\\s*"+attributePattern+"\\s*=\\s*"+"("+'[^";\\s][^;\\s]*'+"|"+'"(?:[^"\\\\]|\\\\"?)+"?'+")",flags);}function textdecode(encoding,value){if(encoding){if(!/^[\x00-\xFF]+$/.test(value)){return value;}try{const decoder=new TextDecoder(encoding,{fatal:true});const buffer=stringToBytes(value);value=decoder.decode(buffer);needsEncodingFixup=false;}catch{}}return value;}function fixupEncoding(value){if(needsEncodingFixup&&/[\x80-\xff]/.test(value)){value=textdecode("utf-8",value);if(needsEncodingFixup){value=textdecode("iso-8859-1",value);}}return value;}function rfc2231getparam(contentDispositionStr){const matches=[];let match;const iter=toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)","ig");while((match=iter.exec(contentDispositionStr))!==null){let[,n,quot,part]=match;n=parseInt(n,10);if(n in matches){if(n===0){break;}continue;}matches[n]=[quot,part];}const parts=[];for(let n=0;n<matches.length;++n){if(!(n in matches)){break;}let[quot,part]=matches[n];part=rfc2616unquote(part);if(quot){part=unescape(part);if(n===0){part=rfc5987decode(part);}}parts.push(part);}return parts.join("");}function rfc2616unquote(value){if(value.startsWith('"')){const parts=value.slice(1).split('\\"');for(let i=0;i<parts.length;++i){const quotindex=parts[i].indexOf('"');if(quotindex!==-1){parts[i]=parts[i].slice(0,quotindex);parts.length=i+1;}parts[i]=parts[i].replaceAll(/\\(.)/g,"$1");}value=parts.join('"');}return value;}function rfc5987decode(extvalue){const encodingend=extvalue.indexOf("'");if(encodingend===-1){return extvalue;}const encoding=extvalue.slice(0,encodingend);const langvalue=extvalue.slice(encodingend+1);const value=langvalue.replace(/^[^']*'/,"");return textdecode(encoding,value);}function rfc2047decode(value){if(!value.startsWith("=?")||/[\x00-\x19\x80-\xff]/.test(value)){return value;}return value.replaceAll(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g,function(matches,charset,encoding,text){if(encoding==="q"||encoding==="Q"){text=text.replaceAll("_"," ");text=text.replaceAll(/=([0-9a-fA-F]{2})/g,function(match,hex){return String.fromCharCode(parseInt(hex,16));});return textdecode(charset,text);}try{text=atob(text);}catch{}return textdecode(charset,text);});}return"";}
;// CONCATENATED MODULE: ./src/display/network_utils.js
function validateRangeRequestCapabilities(_ref){let{getResponseHeader,isHttp,rangeChunkSize,disableRange}=_ref;const returnValues={allowRangeRequests:false,suggestedLength:undefined};const length=parseInt(getResponseHeader("Content-Length"),10);if(!Number.isInteger(length)){return returnValues;}returnValues.suggestedLength=length;if(length<=2*rangeChunkSize){return returnValues;}if(disableRange||!isHttp){return returnValues;}if(getResponseHeader("Accept-Ranges")!=="bytes"){return returnValues;}const contentEncoding=getResponseHeader("Content-Encoding")||"identity";if(contentEncoding!=="identity"){return returnValues;}returnValues.allowRangeRequests=true;return returnValues;}function extractFilenameFromHeader(getResponseHeader){const contentDisposition=getResponseHeader("Content-Disposition");if(contentDisposition){let filename=getFilenameFromContentDispositionHeader(contentDisposition);if(filename.includes("%")){try{filename=decodeURIComponent(filename);}catch{}}if(isPdfFile(filename)){return filename;}}return null;}function createResponseStatusError(status,url){if(status===404||status===0&&url.startsWith("file:")){return new MissingPDFException('Missing PDF "'+url+'".');}return new UnexpectedResponseException(`Unexpected server response (${status}) while retrieving PDF "${url}".`,status);}function validateResponseStatus(status){return status===200||status===206;}
;// CONCATENATED MODULE: ./src/display/fetch_stream.js
function createFetchOptions(headers,withCredentials,abortController){return{method:"GET",headers,signal:abortController.signal,mode:"cors",credentials:withCredentials?"include":"same-origin",redirect:"follow"};}function createHeaders(httpHeaders){const headers=new Headers();for(const property in httpHeaders){const value=httpHeaders[property];if(value===undefined){continue;}headers.append(property,value);}return headers;}function getArrayBuffer(val){if(val instanceof Uint8Array){return val.buffer;}if(val instanceof ArrayBuffer){return val;}warn(`getArrayBuffer - unexpected data format: ${val}`);return new Uint8Array(val).buffer;}class PDFFetchStream{constructor(source){this.source=source;this.isHttp=/^https?:/i.test(source.url);this.httpHeaders=this.isHttp&&source.httpHeaders||{};this._fullRequestReader=null;this._rangeRequestReaders=[];}get _progressiveDataLength(){return this._fullRequestReader?._loaded??0;}getFullReader(){assert(!this._fullRequestReader,"PDFFetchStream.getFullReader can only be called once.");this._fullRequestReader=new PDFFetchStreamReader(this);return this._fullRequestReader;}getRangeReader(begin,end){if(end<=this._progressiveDataLength){return null;}const reader=new PDFFetchStreamRangeReader(this,begin,end);this._rangeRequestReaders.push(reader);return reader;}cancelAllRequests(reason){this._fullRequestReader?.cancel(reason);for(const reader of this._rangeRequestReaders.slice(0)){reader.cancel(reason);}}}class PDFFetchStreamReader{constructor(stream){this._stream=stream;this._reader=null;this._loaded=0;this._filename=null;const source=stream.source;this._withCredentials=source.withCredentials||false;this._contentLength=source.length;this._headersCapability=Promise.withResolvers();this._disableRange=source.disableRange||false;this._rangeChunkSize=source.rangeChunkSize;if(!this._rangeChunkSize&&!this._disableRange){this._disableRange=true;}this._abortController=new AbortController();this._isStreamingSupported=!source.disableStream;this._isRangeSupported=!source.disableRange;this._headers=createHeaders(this._stream.httpHeaders);const url=source.url;fetch(url,createFetchOptions(this._headers,this._withCredentials,this._abortController)).then(response=>{if(!validateResponseStatus(response.status)){throw createResponseStatusError(response.status,url);}this._reader=response.body.getReader();this._headersCapability.resolve();const getResponseHeader=name=>response.headers.get(name);const{allowRangeRequests,suggestedLength}=validateRangeRequestCapabilities({getResponseHeader,isHttp:this._stream.isHttp,rangeChunkSize:this._rangeChunkSize,disableRange:this._disableRange});this._isRangeSupported=allowRangeRequests;this._contentLength=suggestedLength||this._contentLength;this._filename=extractFilenameFromHeader(getResponseHeader);if(!this._isStreamingSupported&&this._isRangeSupported){this.cancel(new AbortException("Streaming is disabled."));}}).catch(this._headersCapability.reject);this.onProgress=null;}get headersReady(){return this._headersCapability.promise;}get filename(){return this._filename;}get contentLength(){return this._contentLength;}get isRangeSupported(){return this._isRangeSupported;}get isStreamingSupported(){return this._isStreamingSupported;}async read(){await this._headersCapability.promise;const{value,done}=await this._reader.read();if(done){return{value,done};}this._loaded+=value.byteLength;this.onProgress?.({loaded:this._loaded,total:this._contentLength});return{value:getArrayBuffer(value),done:false};}cancel(reason){this._reader?.cancel(reason);this._abortController.abort();}}class PDFFetchStreamRangeReader{constructor(stream,begin,end){this._stream=stream;this._reader=null;this._loaded=0;const source=stream.source;this._withCredentials=source.withCredentials||false;this._readCapability=Promise.withResolvers();this._isStreamingSupported=!source.disableStream;this._abortController=new AbortController();this._headers=createHeaders(this._stream.httpHeaders);this._headers.append("Range",`bytes=${begin}-${end-1}`);const url=source.url;fetch(url,createFetchOptions(this._headers,this._withCredentials,this._abortController)).then(response=>{if(!validateResponseStatus(response.status)){throw createResponseStatusError(response.status,url);}this._readCapability.resolve();this._reader=response.body.getReader();}).catch(this._readCapability.reject);this.onProgress=null;}get isStreamingSupported(){return this._isStreamingSupported;}async read(){await this._readCapability.promise;const{value,done}=await this._reader.read();if(done){return{value,done};}this._loaded+=value.byteLength;this.onProgress?.({loaded:this._loaded});return{value:getArrayBuffer(value),done:false};}cancel(reason){this._reader?.cancel(reason);this._abortController.abort();}}
;// CONCATENATED MODULE: ./src/display/network.js
const OK_RESPONSE=200;const PARTIAL_CONTENT_RESPONSE=206;function network_getArrayBuffer(xhr){const data=xhr.response;if(typeof data!=="string"){return data;}return stringToBytes(data).buffer;}class NetworkManager{constructor(url){let args=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};this.url=url;this.isHttp=/^https?:/i.test(url);this.httpHeaders=this.isHttp&&args.httpHeaders||Object.create(null);this.withCredentials=args.withCredentials||false;this.currXhrId=0;this.pendingRequests=Object.create(null);}requestRange(begin,end,listeners){const args={begin,end};for(const prop in listeners){args[prop]=listeners[prop];}return this.request(args);}requestFull(listeners){return this.request(listeners);}request(args){const xhr=new XMLHttpRequest();const xhrId=this.currXhrId++;const pendingRequest=this.pendingRequests[xhrId]={xhr};xhr.open("GET",this.url);xhr.withCredentials=this.withCredentials;for(const property in this.httpHeaders){const value=this.httpHeaders[property];if(value===undefined){continue;}xhr.setRequestHeader(property,value);}if(this.isHttp&&"begin"in args&&"end"in args){xhr.setRequestHeader("Range",`bytes=${args.begin}-${args.end-1}`);pendingRequest.expectedStatus=PARTIAL_CONTENT_RESPONSE;}else{pendingRequest.expectedStatus=OK_RESPONSE;}xhr.responseType="arraybuffer";if(args.onError){xhr.onerror=function(evt){args.onError(xhr.status);};}xhr.onreadystatechange=this.onStateChange.bind(this,xhrId);xhr.onprogress=this.onProgress.bind(this,xhrId);pendingRequest.onHeadersReceived=args.onHeadersReceived;pendingRequest.onDone=args.onDone;pendingRequest.onError=args.onError;pendingRequest.onProgress=args.onProgress;xhr.send(null);return xhrId;}onProgress(xhrId,evt){const pendingRequest=this.pendingRequests[xhrId];if(!pendingRequest){return;}pendingRequest.onProgress?.(evt);}onStateChange(xhrId,evt){const pendingRequest=this.pendingRequests[xhrId];if(!pendingRequest){return;}const xhr=pendingRequest.xhr;if(xhr.readyState>=2&&pendingRequest.onHeadersReceived){pendingRequest.onHeadersReceived();delete pendingRequest.onHeadersReceived;}if(xhr.readyState!==4){return;}if(!(xhrId in this.pendingRequests)){return;}delete this.pendingRequests[xhrId];if(xhr.status===0&&this.isHttp){pendingRequest.onError?.(xhr.status);return;}const xhrStatus=xhr.status||OK_RESPONSE;const ok_response_on_range_request=xhrStatus===OK_RESPONSE&&pendingRequest.expectedStatus===PARTIAL_CONTENT_RESPONSE;if(!ok_response_on_range_request&&xhrStatus!==pendingRequest.expectedStatus){pendingRequest.onError?.(xhr.status);return;}const chunk=network_getArrayBuffer(xhr);if(xhrStatus===PARTIAL_CONTENT_RESPONSE){const rangeHeader=xhr.getResponseHeader("Content-Range");const matches=/bytes (\d+)-(\d+)\/(\d+)/.exec(rangeHeader);pendingRequest.onDone({begin:parseInt(matches[1],10),chunk});}else if(chunk){pendingRequest.onDone({begin:0,chunk});}else{pendingRequest.onError?.(xhr.status);}}getRequestXhr(xhrId){return this.pendingRequests[xhrId].xhr;}isPendingRequest(xhrId){return xhrId in this.pendingRequests;}abortRequest(xhrId){const xhr=this.pendingRequests[xhrId].xhr;delete this.pendingRequests[xhrId];xhr.abort();}}class PDFNetworkStream{constructor(source){this._source=source;this._manager=new NetworkManager(source.url,{httpHeaders:source.httpHeaders,withCredentials:source.withCredentials});this._rangeChunkSize=source.rangeChunkSize;this._fullRequestReader=null;this._rangeRequestReaders=[];}_onRangeRequestReaderClosed(reader){const i=this._rangeRequestReaders.indexOf(reader);if(i>=0){this._rangeRequestReaders.splice(i,1);}}getFullReader(){assert(!this._fullRequestReader,"PDFNetworkStream.getFullReader can only be called once.");this._fullRequestReader=new PDFNetworkStreamFullRequestReader(this._manager,this._source);return this._fullRequestReader;}getRangeReader(begin,end){const reader=new PDFNetworkStreamRangeRequestReader(this._manager,begin,end);reader.onClosed=this._onRangeRequestReaderClosed.bind(this);this._rangeRequestReaders.push(reader);return reader;}cancelAllRequests(reason){this._fullRequestReader?.cancel(reason);for(const reader of this._rangeRequestReaders.slice(0)){reader.cancel(reason);}}}class PDFNetworkStreamFullRequestReader{constructor(manager,source){this._manager=manager;const args={onHeadersReceived:this._onHeadersReceived.bind(this),onDone:this._onDone.bind(this),onError:this._onError.bind(this),onProgress:this._onProgress.bind(this)};this._url=source.url;this._fullRequestId=manager.requestFull(args);this._headersReceivedCapability=Promise.withResolvers();this._disableRange=source.disableRange||false;this._contentLength=source.length;this._rangeChunkSize=source.rangeChunkSize;if(!this._rangeChunkSize&&!this._disableRange){this._disableRange=true;}this._isStreamingSupported=false;this._isRangeSupported=false;this._cachedChunks=[];this._requests=[];this._done=false;this._storedError=undefined;this._filename=null;this.onProgress=null;}_onHeadersReceived(){const fullRequestXhrId=this._fullRequestId;const fullRequestXhr=this._manager.getRequestXhr(fullRequestXhrId);const getResponseHeader=name=>fullRequestXhr.getResponseHeader(name);const{allowRangeRequests,suggestedLength}=validateRangeRequestCapabilities({getResponseHeader,isHttp:this._manager.isHttp,rangeChunkSize:this._rangeChunkSize,disableRange:this._disableRange});if(allowRangeRequests){this._isRangeSupported=true;}this._contentLength=suggestedLength||this._contentLength;this._filename=extractFilenameFromHeader(getResponseHeader);if(this._isRangeSupported){this._manager.abortRequest(fullRequestXhrId);}this._headersReceivedCapability.resolve();}_onDone(data){if(data){if(this._requests.length>0){const requestCapability=this._requests.shift();requestCapability.resolve({value:data.chunk,done:false});}else{this._cachedChunks.push(data.chunk);}}this._done=true;if(this._cachedChunks.length>0){return;}for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;}_onError(status){this._storedError=createResponseStatusError(status,this._url);this._headersReceivedCapability.reject(this._storedError);for(const requestCapability of this._requests){requestCapability.reject(this._storedError);}this._requests.length=0;this._cachedChunks.length=0;}_onProgress(evt){this.onProgress?.({loaded:evt.loaded,total:evt.lengthComputable?evt.total:this._contentLength});}get filename(){return this._filename;}get isRangeSupported(){return this._isRangeSupported;}get isStreamingSupported(){return this._isStreamingSupported;}get contentLength(){return this._contentLength;}get headersReady(){return this._headersReceivedCapability.promise;}async read(){if(this._storedError){throw this._storedError;}if(this._cachedChunks.length>0){const chunk=this._cachedChunks.shift();return{value:chunk,done:false};}if(this._done){return{value:undefined,done:true};}const requestCapability=Promise.withResolvers();this._requests.push(requestCapability);return requestCapability.promise;}cancel(reason){this._done=true;this._headersReceivedCapability.reject(reason);for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;if(this._manager.isPendingRequest(this._fullRequestId)){this._manager.abortRequest(this._fullRequestId);}this._fullRequestReader=null;}}class PDFNetworkStreamRangeRequestReader{constructor(manager,begin,end){this._manager=manager;const args={onDone:this._onDone.bind(this),onError:this._onError.bind(this),onProgress:this._onProgress.bind(this)};this._url=manager.url;this._requestId=manager.requestRange(begin,end,args);this._requests=[];this._queuedChunk=null;this._done=false;this._storedError=undefined;this.onProgress=null;this.onClosed=null;}_close(){this.onClosed?.(this);}_onDone(data){const chunk=data.chunk;if(this._requests.length>0){const requestCapability=this._requests.shift();requestCapability.resolve({value:chunk,done:false});}else{this._queuedChunk=chunk;}this._done=true;for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;this._close();}_onError(status){this._storedError=createResponseStatusError(status,this._url);for(const requestCapability of this._requests){requestCapability.reject(this._storedError);}this._requests.length=0;this._queuedChunk=null;}_onProgress(evt){if(!this.isStreamingSupported){this.onProgress?.({loaded:evt.loaded});}}get isStreamingSupported(){return false;}async read(){if(this._storedError){throw this._storedError;}if(this._queuedChunk!==null){const chunk=this._queuedChunk;this._queuedChunk=null;return{value:chunk,done:false};}if(this._done){return{value:undefined,done:true};}const requestCapability=Promise.withResolvers();this._requests.push(requestCapability);return requestCapability.promise;}cancel(reason){this._done=true;for(const requestCapability of this._requests){requestCapability.resolve({value:undefined,done:true});}this._requests.length=0;if(this._manager.isPendingRequest(this._requestId)){this._manager.abortRequest(this._requestId);}this._close();}}
;// CONCATENATED MODULE: ./src/display/node_stream.js
const fileUriRegex=/^file:\/\/\/[a-zA-Z]:\//;function parseUrl(sourceUrl){const url=NodePackages.get("url");const parsedUrl=url.parse(sourceUrl);if(parsedUrl.protocol==="file:"||parsedUrl.host){return parsedUrl;}if(/^[a-z]:[/\\]/i.test(sourceUrl)){return url.parse(`file:///${sourceUrl}`);}if(!parsedUrl.host){parsedUrl.protocol="file:";}return parsedUrl;}class PDFNodeStream{constructor(source){this.source=source;this.url=parseUrl(source.url);this.isHttp=this.url.protocol==="http:"||this.url.protocol==="https:"||this.url.protocol==="capacitor:";this.isFsUrl=this.url.protocol==="file:";this.httpHeaders=this.isHttp&&source.httpHeaders||{};this._fullRequestReader=null;this._rangeRequestReaders=[];}get _progressiveDataLength(){return this._fullRequestReader?._loaded??0;}getFullReader(){assert(!this._fullRequestReader,"PDFNodeStream.getFullReader can only be called once.");this._fullRequestReader=this.isFsUrl?new PDFNodeStreamFsFullReader(this):new PDFNodeStreamFullReader(this);return this._fullRequestReader;}getRangeReader(start,end){if(end<=this._progressiveDataLength){return null;}const rangeReader=this.isFsUrl?new PDFNodeStreamFsRangeReader(this,start,end):new PDFNodeStreamRangeReader(this,start,end);this._rangeRequestReaders.push(rangeReader);return rangeReader;}cancelAllRequests(reason){this._fullRequestReader?.cancel(reason);for(const reader of this._rangeRequestReaders.slice(0)){reader.cancel(reason);}}}class BaseFullReader{constructor(stream){this._url=stream.url;this._done=false;this._storedError=null;this.onProgress=null;const source=stream.source;this._contentLength=source.length;this._loaded=0;this._filename=null;this._disableRange=source.disableRange||false;this._rangeChunkSize=source.rangeChunkSize;if(!this._rangeChunkSize&&!this._disableRange){this._disableRange=true;}this._isStreamingSupported=!source.disableStream;this._isRangeSupported=!source.disableRange;this._readableStream=null;this._readCapability=Promise.withResolvers();this._headersCapability=Promise.withResolvers();}get headersReady(){return this._headersCapability.promise;}get filename(){return this._filename;}get contentLength(){return this._contentLength;}get isRangeSupported(){return this._isRangeSupported;}get isStreamingSupported(){return this._isStreamingSupported;}async read(){await this._readCapability.promise;if(this._done){return{value:undefined,done:true};}if(this._storedError){throw this._storedError;}const chunk=this._readableStream.read();if(chunk===null){this._readCapability=Promise.withResolvers();return this.read();}this._loaded+=chunk.length;this.onProgress?.({loaded:this._loaded,total:this._contentLength});const buffer=new Uint8Array(chunk).buffer;return{value:buffer,done:false};}cancel(reason){if(!this._readableStream){this._error(reason);return;}this._readableStream.destroy(reason);}_error(reason){this._storedError=reason;this._readCapability.resolve();}_setReadableStream(readableStream){this._readableStream=readableStream;readableStream.on("readable",()=>{this._readCapability.resolve();});readableStream.on("end",()=>{readableStream.destroy();this._done=true;this._readCapability.resolve();});readableStream.on("error",reason=>{this._error(reason);});if(!this._isStreamingSupported&&this._isRangeSupported){this._error(new AbortException("streaming is disabled"));}if(this._storedError){this._readableStream.destroy(this._storedError);}}}class BaseRangeReader{constructor(stream){this._url=stream.url;this._done=false;this._storedError=null;this.onProgress=null;this._loaded=0;this._readableStream=null;this._readCapability=Promise.withResolvers();const source=stream.source;this._isStreamingSupported=!source.disableStream;}get isStreamingSupported(){return this._isStreamingSupported;}async read(){await this._readCapability.promise;if(this._done){return{value:undefined,done:true};}if(this._storedError){throw this._storedError;}const chunk=this._readableStream.read();if(chunk===null){this._readCapability=Promise.withResolvers();return this.read();}this._loaded+=chunk.length;this.onProgress?.({loaded:this._loaded});const buffer=new Uint8Array(chunk).buffer;return{value:buffer,done:false};}cancel(reason){if(!this._readableStream){this._error(reason);return;}this._readableStream.destroy(reason);}_error(reason){this._storedError=reason;this._readCapability.resolve();}_setReadableStream(readableStream){this._readableStream=readableStream;readableStream.on("readable",()=>{this._readCapability.resolve();});readableStream.on("end",()=>{readableStream.destroy();this._done=true;this._readCapability.resolve();});readableStream.on("error",reason=>{this._error(reason);});if(this._storedError){this._readableStream.destroy(this._storedError);}}}function createRequestOptions(parsedUrl,headers){return{protocol:parsedUrl.protocol,auth:parsedUrl.auth,host:parsedUrl.hostname,port:parsedUrl.port,path:parsedUrl.path,method:"GET",headers};}class PDFNodeStreamFullReader extends BaseFullReader{constructor(stream){super(stream);const handleResponse=response=>{if(response.statusCode===404){const error=new MissingPDFException(`Missing PDF "${this._url}".`);this._storedError=error;this._headersCapability.reject(error);return;}this._headersCapability.resolve();this._setReadableStream(response);const getResponseHeader=name=>this._readableStream.headers[name.toLowerCase()];const{allowRangeRequests,suggestedLength}=validateRangeRequestCapabilities({getResponseHeader,isHttp:stream.isHttp,rangeChunkSize:this._rangeChunkSize,disableRange:this._disableRange});this._isRangeSupported=allowRangeRequests;this._contentLength=suggestedLength||this._contentLength;this._filename=extractFilenameFromHeader(getResponseHeader);};this._request=null;if(this._url.protocol==="http:"){const http=NodePackages.get("http");this._request=http.request(createRequestOptions(this._url,stream.httpHeaders),handleResponse);}else{const https=NodePackages.get("https");this._request=https.request(createRequestOptions(this._url,stream.httpHeaders),handleResponse);}this._request.on("error",reason=>{this._storedError=reason;this._headersCapability.reject(reason);});this._request.end();}}class PDFNodeStreamRangeReader extends BaseRangeReader{constructor(stream,start,end){super(stream);this._httpHeaders={};for(const property in stream.httpHeaders){const value=stream.httpHeaders[property];if(value===undefined){continue;}this._httpHeaders[property]=value;}this._httpHeaders.Range=`bytes=${start}-${end-1}`;const handleResponse=response=>{if(response.statusCode===404){const error=new MissingPDFException(`Missing PDF "${this._url}".`);this._storedError=error;return;}this._setReadableStream(response);};this._request=null;if(this._url.protocol==="http:"){const http=NodePackages.get("http");this._request=http.request(createRequestOptions(this._url,this._httpHeaders),handleResponse);}else{const https=NodePackages.get("https");this._request=https.request(createRequestOptions(this._url,this._httpHeaders),handleResponse);}this._request.on("error",reason=>{this._storedError=reason;});this._request.end();}}class PDFNodeStreamFsFullReader extends BaseFullReader{constructor(stream){super(stream);let path=decodeURIComponent(this._url.path);if(fileUriRegex.test(this._url.href)){path=path.replace(/^\//,"");}const fs=NodePackages.get("fs");fs.promises.lstat(path).then(stat=>{this._contentLength=stat.size;this._setReadableStream(fs.createReadStream(path));this._headersCapability.resolve();},error=>{if(error.code==="ENOENT"){error=new MissingPDFException(`Missing PDF "${path}".`);}this._storedError=error;this._headersCapability.reject(error);});}}class PDFNodeStreamFsRangeReader extends BaseRangeReader{constructor(stream,start,end){super(stream);let path=decodeURIComponent(this._url.path);if(fileUriRegex.test(this._url.href)){path=path.replace(/^\//,"");}const fs=NodePackages.get("fs");this._setReadableStream(fs.createReadStream(path,{start,end:end-1}));}}
;// CONCATENATED MODULE: ./src/display/text_layer.js
var _TextLayer;function text_layer_classPrivateMethodInitSpec(e,a){text_layer_checkPrivateRedeclaration(e,a),a.add(e);}function text_layer_classPrivateFieldInitSpec(e,t,a){text_layer_checkPrivateRedeclaration(e,t),t.set(e,a);}function text_layer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function text_layer_classPrivateFieldGet(s,a){return s.get(text_layer_assertClassBrand(s,a));}function text_layer_classPrivateFieldSet(s,a,r){return s.set(text_layer_assertClassBrand(s,a),r),r;}function text_layer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const MAX_TEXT_DIVS_TO_RENDER=100000;const DEFAULT_FONT_SIZE=30;const DEFAULT_FONT_ASCENT=0.8;var _capability=/*#__PURE__*/new WeakMap();var text_layer_container=/*#__PURE__*/new WeakMap();var _disableProcessItems=/*#__PURE__*/new WeakMap();var _fontInspectorEnabled=/*#__PURE__*/new WeakMap();var _lang=/*#__PURE__*/new WeakMap();var _layoutTextParams=/*#__PURE__*/new WeakMap();var _pageHeight=/*#__PURE__*/new WeakMap();var _pageWidth=/*#__PURE__*/new WeakMap();var _reader=/*#__PURE__*/new WeakMap();var _rootContainer=/*#__PURE__*/new WeakMap();var _rotation=/*#__PURE__*/new WeakMap();var _scale=/*#__PURE__*/new WeakMap();var _styleCache=/*#__PURE__*/new WeakMap();var _textContentItemsStr=/*#__PURE__*/new WeakMap();var _textContentSource=/*#__PURE__*/new WeakMap();var _textDivs=/*#__PURE__*/new WeakMap();var _textDivProperties=/*#__PURE__*/new WeakMap();var _transform=/*#__PURE__*/new WeakMap();var _TextLayer_brand=/*#__PURE__*/new WeakSet();class TextLayer{constructor(_ref){let{textContentSource,container,viewport}=_ref;text_layer_classPrivateMethodInitSpec(this,_TextLayer_brand);text_layer_classPrivateFieldInitSpec(this,_capability,Promise.withResolvers());text_layer_classPrivateFieldInitSpec(this,text_layer_container,null);text_layer_classPrivateFieldInitSpec(this,_disableProcessItems,false);text_layer_classPrivateFieldInitSpec(this,_fontInspectorEnabled,!!globalThis.FontInspector?.enabled);text_layer_classPrivateFieldInitSpec(this,_lang,null);text_layer_classPrivateFieldInitSpec(this,_layoutTextParams,null);text_layer_classPrivateFieldInitSpec(this,_pageHeight,0);text_layer_classPrivateFieldInitSpec(this,_pageWidth,0);text_layer_classPrivateFieldInitSpec(this,_reader,null);text_layer_classPrivateFieldInitSpec(this,_rootContainer,null);text_layer_classPrivateFieldInitSpec(this,_rotation,0);text_layer_classPrivateFieldInitSpec(this,_scale,0);text_layer_classPrivateFieldInitSpec(this,_styleCache,Object.create(null));text_layer_classPrivateFieldInitSpec(this,_textContentItemsStr,[]);text_layer_classPrivateFieldInitSpec(this,_textContentSource,null);text_layer_classPrivateFieldInitSpec(this,_textDivs,[]);text_layer_classPrivateFieldInitSpec(this,_textDivProperties,new WeakMap());text_layer_classPrivateFieldInitSpec(this,_transform,null);if(textContentSource instanceof ReadableStream){text_layer_classPrivateFieldSet(_textContentSource,this,textContentSource);}else if(typeof textContentSource==="object"){text_layer_classPrivateFieldSet(_textContentSource,this,new ReadableStream({start(controller){controller.enqueue(textContentSource);controller.close();}}));}else{throw new Error('No "textContentSource" parameter specified.');}text_layer_classPrivateFieldSet(text_layer_container,this,text_layer_classPrivateFieldSet(_rootContainer,this,container));text_layer_classPrivateFieldSet(_scale,this,viewport.scale*(globalThis.devicePixelRatio||1));text_layer_classPrivateFieldSet(_rotation,this,viewport.rotation);text_layer_classPrivateFieldSet(_layoutTextParams,this,{prevFontSize:null,prevFontFamily:null,div:null,properties:null,ctx:null});const{pageWidth,pageHeight,pageX,pageY}=viewport.rawDims;text_layer_classPrivateFieldSet(_transform,this,[1,0,0,-1,-pageX,pageY+pageHeight]);text_layer_classPrivateFieldSet(_pageWidth,this,pageWidth);text_layer_classPrivateFieldSet(_pageHeight,this,pageHeight);setLayerDimensions(container,viewport);text_layer_classPrivateFieldGet(_capability,this).promise.catch(()=>{}).then(()=>{_pendingTextLayers._.delete(this);text_layer_classPrivateFieldSet(_layoutTextParams,this,null);text_layer_classPrivateFieldSet(_styleCache,this,null);});}render(){const pump=()=>{text_layer_classPrivateFieldGet(_reader,this).read().then(_ref2=>{let{value,done}=_ref2;if(done){text_layer_classPrivateFieldGet(_capability,this).resolve();return;}text_layer_classPrivateFieldGet(_lang,this)??text_layer_classPrivateFieldSet(_lang,this,value.lang);Object.assign(text_layer_classPrivateFieldGet(_styleCache,this),value.styles);text_layer_assertClassBrand(_TextLayer_brand,this,_processItems).call(this,value.items);pump();},text_layer_classPrivateFieldGet(_capability,this).reject);};text_layer_classPrivateFieldSet(_reader,this,text_layer_classPrivateFieldGet(_textContentSource,this).getReader());_pendingTextLayers._.add(this);pump();return text_layer_classPrivateFieldGet(_capability,this).promise;}update(_ref3){let{viewport,onBefore=null}=_ref3;const scale=viewport.scale*(globalThis.devicePixelRatio||1);const rotation=viewport.rotation;if(rotation!==text_layer_classPrivateFieldGet(_rotation,this)){onBefore?.();text_layer_classPrivateFieldSet(_rotation,this,rotation);setLayerDimensions(text_layer_classPrivateFieldGet(_rootContainer,this),{rotation});}if(scale!==text_layer_classPrivateFieldGet(_scale,this)){onBefore?.();text_layer_classPrivateFieldSet(_scale,this,scale);const params={prevFontSize:null,prevFontFamily:null,div:null,properties:null,ctx:_getCtx.call(TextLayer,text_layer_classPrivateFieldGet(_lang,this))};for(const div of text_layer_classPrivateFieldGet(_textDivs,this)){params.properties=text_layer_classPrivateFieldGet(_textDivProperties,this).get(div);params.div=div;text_layer_assertClassBrand(_TextLayer_brand,this,_layout).call(this,params);}}}cancel(){const abortEx=new AbortException("TextLayer task cancelled.");text_layer_classPrivateFieldGet(_reader,this)?.cancel(abortEx).catch(()=>{});text_layer_classPrivateFieldSet(_reader,this,null);text_layer_classPrivateFieldGet(_capability,this).reject(abortEx);}get textDivs(){return text_layer_classPrivateFieldGet(_textDivs,this);}get textContentItemsStr(){return text_layer_classPrivateFieldGet(_textContentItemsStr,this);}static cleanup(){if(text_layer_assertClassBrand(TextLayer,this,_pendingTextLayers)._.size>0){return;}text_layer_assertClassBrand(TextLayer,this,_ascentCache)._.clear();for(const{canvas}of text_layer_assertClassBrand(TextLayer,this,_canvasContexts)._.values()){canvas.remove();}text_layer_assertClassBrand(TextLayer,this,_canvasContexts)._.clear();}}_TextLayer=TextLayer;function _processItems(items){if(text_layer_classPrivateFieldGet(_disableProcessItems,this)){return;}text_layer_classPrivateFieldGet(_layoutTextParams,this).ctx||=_getCtx.call(_TextLayer,text_layer_classPrivateFieldGet(_lang,this));const textDivs=text_layer_classPrivateFieldGet(_textDivs,this),textContentItemsStr=text_layer_classPrivateFieldGet(_textContentItemsStr,this);for(const item of items){if(textDivs.length>MAX_TEXT_DIVS_TO_RENDER){warn("Ignoring additional textDivs for performance reasons.");text_layer_classPrivateFieldSet(_disableProcessItems,this,true);return;}if(item.str===undefined){if(item.type==="beginMarkedContentProps"||item.type==="beginMarkedContent"){const parent=text_layer_classPrivateFieldGet(text_layer_container,this);text_layer_classPrivateFieldSet(text_layer_container,this,document.createElement("span"));text_layer_classPrivateFieldGet(text_layer_container,this).classList.add("markedContent");if(item.id!==null){text_layer_classPrivateFieldGet(text_layer_container,this).setAttribute("id",`${item.id}`);}parent.append(text_layer_classPrivateFieldGet(text_layer_container,this));}else if(item.type==="endMarkedContent"){text_layer_classPrivateFieldSet(text_layer_container,this,text_layer_classPrivateFieldGet(text_layer_container,this).parentNode);}continue;}textContentItemsStr.push(item.str);text_layer_assertClassBrand(_TextLayer_brand,this,_appendText).call(this,item);}}function _appendText(geom){const textDiv=document.createElement("span");const textDivProperties={angle:0,canvasWidth:0,hasText:geom.str!=="",hasEOL:geom.hasEOL,fontSize:0};text_layer_classPrivateFieldGet(_textDivs,this).push(textDiv);const tx=Util.transform(text_layer_classPrivateFieldGet(_transform,this),geom.transform);let angle=Math.atan2(tx[1],tx[0]);const style=text_layer_classPrivateFieldGet(_styleCache,this)[geom.fontName];if(style.vertical){angle+=Math.PI/2;}const fontFamily=text_layer_classPrivateFieldGet(_fontInspectorEnabled,this)&&style.fontSubstitution||style.fontFamily;const fontHeight=Math.hypot(tx[2],tx[3]);const fontAscent=fontHeight*_getAscent.call(_TextLayer,fontFamily,text_layer_classPrivateFieldGet(_lang,this));let left,top;if(angle===0){left=tx[4];top=tx[5]-fontAscent;}else{left=tx[4]+fontAscent*Math.sin(angle);top=tx[5]-fontAscent*Math.cos(angle);}const scaleFactorStr="calc(var(--scale-factor)*";const divStyle=textDiv.style;if(text_layer_classPrivateFieldGet(text_layer_container,this)===text_layer_classPrivateFieldGet(_rootContainer,this)){divStyle.left=`${(100*left/text_layer_classPrivateFieldGet(_pageWidth,this)).toFixed(2)}%`;divStyle.top=`${(100*top/text_layer_classPrivateFieldGet(_pageHeight,this)).toFixed(2)}%`;}else{divStyle.left=`${scaleFactorStr}${left.toFixed(2)}px)`;divStyle.top=`${scaleFactorStr}${top.toFixed(2)}px)`;}divStyle.fontSize=`${scaleFactorStr}${fontHeight.toFixed(2)}px)`;divStyle.fontFamily=fontFamily;textDivProperties.fontSize=fontHeight;textDiv.setAttribute("role","presentation");textDiv.textContent=geom.str;textDiv.dir=geom.dir;if(text_layer_classPrivateFieldGet(_fontInspectorEnabled,this)){textDiv.dataset.fontName=style.fontSubstitutionLoadedName||geom.fontName;}if(angle!==0){textDivProperties.angle=angle*(180/Math.PI);}let shouldScaleText=false;if(geom.str.length>1){shouldScaleText=true;}else if(geom.str!==" "&&geom.transform[0]!==geom.transform[3]){const absScaleX=Math.abs(geom.transform[0]),absScaleY=Math.abs(geom.transform[3]);if(absScaleX!==absScaleY&&Math.max(absScaleX,absScaleY)/Math.min(absScaleX,absScaleY)>1.5){shouldScaleText=true;}}if(shouldScaleText){textDivProperties.canvasWidth=style.vertical?geom.height:geom.width;}text_layer_classPrivateFieldGet(_textDivProperties,this).set(textDiv,textDivProperties);text_layer_classPrivateFieldGet(_layoutTextParams,this).div=textDiv;text_layer_classPrivateFieldGet(_layoutTextParams,this).properties=textDivProperties;text_layer_assertClassBrand(_TextLayer_brand,this,_layout).call(this,text_layer_classPrivateFieldGet(_layoutTextParams,this));if(textDivProperties.hasText){text_layer_classPrivateFieldGet(text_layer_container,this).append(textDiv);}if(textDivProperties.hasEOL){const br=document.createElement("br");br.setAttribute("role","presentation");text_layer_classPrivateFieldGet(text_layer_container,this).append(br);}}function _layout(params){const{div,properties,ctx,prevFontSize,prevFontFamily}=params;const{style}=div;let transform="";if(properties.canvasWidth!==0&&properties.hasText){const{fontFamily}=style;const{canvasWidth,fontSize}=properties;if(prevFontSize!==fontSize||prevFontFamily!==fontFamily){ctx.font=`${fontSize*text_layer_classPrivateFieldGet(_scale,this)}px ${fontFamily}`;params.prevFontSize=fontSize;params.prevFontFamily=fontFamily;}try{const{width}=ctx.measureText(div.textContent);if(width>0){transform=`scaleX(${canvasWidth*text_layer_classPrivateFieldGet(_scale,this)/width})`;}}catch(fingerprintIsBlockedException){}}if(properties.angle!==0){transform=`rotate(${properties.angle}deg) ${transform}`;}if(transform.length>0){style.transform=transform;}}function _getCtx(){let lang=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;let canvasContext=text_layer_assertClassBrand(_TextLayer,this,_canvasContexts)._.get(lang||="");if(!canvasContext){const canvas=document.createElement("canvas");canvas.className="hiddenCanvasElement";canvas.lang=lang;document.body.append(canvas);const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true,alpha:false}:{alpha:false};canvasContext=canvas.getContext("2d",options);text_layer_assertClassBrand(_TextLayer,this,_canvasContexts)._.set(lang,canvasContext);}return canvasContext;}function _getAscent(fontFamily,lang){const cachedAscent=text_layer_assertClassBrand(_TextLayer,this,_ascentCache)._.get(fontFamily);if(cachedAscent){return cachedAscent;}const ctx=text_layer_assertClassBrand(_TextLayer,this,_getCtx).call(this,lang);const savedFont=ctx.font;ctx.canvas.width=ctx.canvas.height=DEFAULT_FONT_SIZE;ctx.font=`${DEFAULT_FONT_SIZE}px ${fontFamily}`;const metrics=ctx.measureText("");let ascent=metrics?.fontBoundingBoxAscent;let descent=Math.abs(metrics?.fontBoundingBoxDescent);if(ascent){const ratio=ascent/(ascent+descent);text_layer_assertClassBrand(_TextLayer,this,_ascentCache)._.set(fontFamily,ratio);ctx.canvas.width=ctx.canvas.height=0;ctx.font=savedFont;return ratio;}ctx.strokeStyle="red";ctx.clearRect(0,0,DEFAULT_FONT_SIZE,DEFAULT_FONT_SIZE);ctx.strokeText("g",0,0);let pixels=ctx.getImageData(0,0,DEFAULT_FONT_SIZE,DEFAULT_FONT_SIZE).data;descent=0;for(let i=pixels.length-1-3;i>=0;i-=4){if(pixels[i]>0){descent=Math.ceil(i/4/DEFAULT_FONT_SIZE);break;}}ctx.clearRect(0,0,DEFAULT_FONT_SIZE,DEFAULT_FONT_SIZE);ctx.strokeText("A",0,DEFAULT_FONT_SIZE);pixels=ctx.getImageData(0,0,DEFAULT_FONT_SIZE,DEFAULT_FONT_SIZE).data;ascent=0;for(let i=0,ii=pixels.length;i<ii;i+=4){if(pixels[i]>0){ascent=DEFAULT_FONT_SIZE-Math.floor(i/4/DEFAULT_FONT_SIZE);break;}}ctx.canvas.width=ctx.canvas.height=0;ctx.font=savedFont;const ratio=ascent?ascent/(ascent+descent):DEFAULT_FONT_ASCENT;text_layer_assertClassBrand(_TextLayer,this,_ascentCache)._.set(fontFamily,ratio);return ratio;}var _ascentCache={_:new Map()};var _canvasContexts={_:new Map()};var _pendingTextLayers={_:new Set()};function renderTextLayer(){deprecated("`renderTextLayer`, please use `TextLayer` instead.");const{textContentSource,container,viewport,...rest}=arguments[0];const restKeys=Object.keys(rest);if(restKeys.length>0){warn("Ignoring `renderTextLayer` parameters: "+restKeys.join(", "));}const textLayer=new TextLayer({textContentSource,container,viewport});const{textDivs,textContentItemsStr}=textLayer;const promise=textLayer.render();return{promise,textDivs,textContentItemsStr};}function updateTextLayer(){deprecated("`updateTextLayer`, please use `TextLayer` instead.");}
;// CONCATENATED MODULE: ./src/display/xfa_text.js
class XfaText{static textContent(xfa){const items=[];const output={items,styles:Object.create(null)};function walk(node){if(!node){return;}let str=null;const name=node.name;if(name==="#text"){str=node.value;}else if(!XfaText.shouldBuildText(name)){return;}else if(node?.attributes?.textContent){str=node.attributes.textContent;}else if(node.value){str=node.value;}if(str!==null){items.push({str});}if(!node.children){return;}for(const child of node.children){walk(child);}}walk(xfa);return output;}static shouldBuildText(name){return!(name==="textarea"||name==="input"||name==="option"||name==="select");}}
;// CONCATENATED MODULE: ./src/display/api.js
function api_classPrivateGetter(s,r,a){return a(api_assertClassBrand(s,r));}function api_classPrivateMethodInitSpec(e,a){api_checkPrivateRedeclaration(e,a),a.add(e);}function api_classPrivateFieldInitSpec(e,t,a){api_checkPrivateRedeclaration(e,t),t.set(e,a);}function api_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function api_classPrivateFieldGet(s,a){return s.get(api_assertClassBrand(s,a));}function api_classPrivateFieldSet(s,a,r){return s.set(api_assertClassBrand(s,a),r),r;}function api_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DEFAULT_RANGE_CHUNK_SIZE=65536;const RENDERING_CANCELLED_TIMEOUT=100;const DELAYED_CLEANUP_TIMEOUT=5000;const ServiceWorkerOptions={showUnverifiedSignatures:false};window.ServiceWorkerOptions=ServiceWorkerOptions;const DefaultCanvasFactory=isNodeJS?NodeCanvasFactory:DOMCanvasFactory;const DefaultCMapReaderFactory=isNodeJS?NodeCMapReaderFactory:DOMCMapReaderFactory;const DefaultFilterFactory=isNodeJS?NodeFilterFactory:DOMFilterFactory;const DefaultStandardFontDataFactory=isNodeJS?NodeStandardFontDataFactory:DOMStandardFontDataFactory;function getDocument(src){if(typeof src==="string"||src instanceof URL){src={url:src};}else if(src instanceof ArrayBuffer||ArrayBuffer.isView(src)){src={data:src};}if(typeof src!=="object"){throw new Error("Invalid parameter in getDocument, need parameter object.");}if(!src.url&&!src.data&&!src.range){throw new Error("Invalid parameter object: need either .data, .range or .url");}const task=new PDFDocumentLoadingTask();const{docId}=task;const url=src.url?getUrlProp(src.url,src.baseHref):null;const data=src.data?getDataProp(src.data):null;const httpHeaders=src.httpHeaders||null;const withCredentials=src.withCredentials===true;const password=src.password??null;const rangeTransport=src.range instanceof PDFDataRangeTransport?src.range:null;const rangeChunkSize=Number.isInteger(src.rangeChunkSize)&&src.rangeChunkSize>0?src.rangeChunkSize:DEFAULT_RANGE_CHUNK_SIZE;let worker=src.worker instanceof PDFWorker?src.worker:null;const verbosity=src.verbosity;const docBaseUrl=typeof src.docBaseUrl==="string"&&!isDataScheme(src.docBaseUrl)?src.docBaseUrl:null;const cMapUrl=typeof src.cMapUrl==="function"?src.cMapUrl():typeof src.cMapUrl==="string"?src.cMapUrl:null;const cMapPacked=src.cMapPacked!==false;const CMapReaderFactory=src.CMapReaderFactory||DefaultCMapReaderFactory;const standardFontDataUrl=typeof src.standardFontDataUrl==="function"?src.standardFontDataUrl():typeof src.standardFontDataUrl==="string"?src.standardFontDataUrl:null;const StandardFontDataFactory=src.StandardFontDataFactory||DefaultStandardFontDataFactory;const ignoreErrors=src.stopAtErrors!==true;const maxImageSize=Number.isInteger(src.maxImageSize)&&src.maxImageSize>-1?src.maxImageSize:-1;const isEvalSupported=src.isEvalSupported!==false;const isOffscreenCanvasSupported=typeof src.isOffscreenCanvasSupported==="boolean"?src.isOffscreenCanvasSupported:!isNodeJS;const canvasMaxAreaInBytes=Number.isInteger(src.canvasMaxAreaInBytes)?src.canvasMaxAreaInBytes:-1;const disableFontFace=typeof src.disableFontFace==="boolean"?src.disableFontFace:isNodeJS;const fontExtraProperties=src.fontExtraProperties===true;const enableXfa=src.enableXfa===true;const ownerDocument=src.ownerDocument||globalThis.document;const disableRange=src.disableRange===true;const disableStream=src.disableStream===true;const disableAutoFetch=src.disableAutoFetch===true;const pdfBug=src.pdfBug===true;const length=rangeTransport?rangeTransport.length:src.length??NaN;const useSystemFonts=typeof src.useSystemFonts==="boolean"?src.useSystemFonts:!isNodeJS&&!disableFontFace;const useWorkerFetch=typeof src.useWorkerFetch==="boolean"?src.useWorkerFetch:CMapReaderFactory===DOMCMapReaderFactory&&StandardFontDataFactory===DOMStandardFontDataFactory&&cMapUrl&&standardFontDataUrl&&isValidFetchUrl(cMapUrl,document.baseURI)&&isValidFetchUrl(standardFontDataUrl,document.baseURI);const canvasFactory=src.canvasFactory||new DefaultCanvasFactory({ownerDocument});const filterFactory=src.filterFactory||new DefaultFilterFactory({docId,ownerDocument});const styleElement=null;setVerbosityLevel(verbosity);const transportFactory={canvasFactory,filterFactory};if(!useWorkerFetch){transportFactory.cMapReaderFactory=new CMapReaderFactory({baseUrl:cMapUrl,isCompressed:cMapPacked});transportFactory.standardFontDataFactory=new StandardFontDataFactory({baseUrl:standardFontDataUrl});}if(!worker){const workerParams={verbosity,port:GlobalWorkerOptions.workerPort};worker=workerParams.port?PDFWorker.fromPort(workerParams):new PDFWorker(workerParams);task._worker=worker;}const docParams={docId,apiVersion:"4.3.659",data,password,disableAutoFetch,rangeChunkSize,length,docBaseUrl,enableXfa,evaluatorOptions:{maxImageSize,disableFontFace,ignoreErrors,isEvalSupported,isOffscreenCanvasSupported,canvasMaxAreaInBytes,fontExtraProperties,useSystemFonts,cMapUrl:useWorkerFetch?cMapUrl:null,standardFontDataUrl:useWorkerFetch?standardFontDataUrl:null}};const transportParams={disableFontFace,fontExtraProperties,ownerDocument,pdfBug,styleElement,loadingParams:{disableAutoFetch,enableXfa}};worker.promise.then(function(){if(task.destroyed){throw new Error("Loading aborted");}if(worker.destroyed){throw new Error("Worker was destroyed");}const workerIdPromise=worker.messageHandler.sendWithPromise("GetDocRequest",docParams,data?[data.buffer]:null);let networkStream;if(rangeTransport){networkStream=new PDFDataTransportStream(rangeTransport,{disableRange,disableStream});}else if(!data){const createPDFNetworkStream=params=>{if(isNodeJS){const isFetchSupported=function(){return typeof fetch!=="undefined"&&typeof Response!=="undefined"&&"body"in Response.prototype;};return isFetchSupported()&&isValidFetchUrl(params.url)?new PDFFetchStream(params):new PDFNodeStream(params);}return isValidFetchUrl(params.url)?new PDFFetchStream(params):new PDFNetworkStream(params);};networkStream=createPDFNetworkStream({url,length,httpHeaders,withCredentials,rangeChunkSize,disableRange,disableStream});}return workerIdPromise.then(workerId=>{if(task.destroyed){throw new Error("Loading aborted");}if(worker.destroyed){throw new Error("Worker was destroyed");}const messageHandler=new MessageHandler(docId,workerId,worker.port);const transport=new WorkerTransport(messageHandler,task,networkStream,transportParams,transportFactory);task._transport=transport;messageHandler.send("Ready",null);});}).catch(task._capability.reject);return task;}function getUrlProp(val,baseHref){if(val instanceof URL){return val.href;}try{if(baseHref){return new URL(val,window.location.origin+baseHref).href;}else{return new URL(val,window.location).href;}}catch(ex){if(isNodeJS&&typeof val==="string"){return val;}}throw new Error("Invalid PDF url data: "+"either string or URL-object is expected in the url property.");}function getDataProp(val){if(isNodeJS&&typeof Buffer!=="undefined"&&val instanceof Buffer){throw new Error("Please provide binary data as `Uint8Array`, rather than `Buffer`.");}if(val instanceof Uint8Array&&val.byteLength===val.buffer.byteLength){return val;}if(typeof val==="string"){return stringToBytes(val);}if(val instanceof ArrayBuffer||ArrayBuffer.isView(val)||typeof val==="object"&&!isNaN(val?.length)){return new Uint8Array(val);}throw new Error("Invalid PDF binary data: either TypedArray, "+"string, or array-like object is expected in the data property.");}function isRefProxy(ref){return typeof ref==="object"&&Number.isInteger(ref?.num)&&ref.num>=0&&Number.isInteger(ref?.gen)&&ref.gen>=0;}class PDFDocumentLoadingTask{constructor(){var _PDFDocumentLoadingTa,_PDFDocumentLoadingTa2;this._capability=Promise.withResolvers();this._transport=null;this._worker=null;this.docId=`d${(api_docId._=(_PDFDocumentLoadingTa=api_docId._,_PDFDocumentLoadingTa2=_PDFDocumentLoadingTa++,_PDFDocumentLoadingTa),_PDFDocumentLoadingTa2)}`;this.destroyed=false;this.onPassword=null;this.onProgress=null;}get promise(){return this._capability.promise;}async destroy(){this.destroyed=true;try{if(this._worker?.port){this._worker._pendingDestroy=true;}await this._transport?.destroy();}catch(ex){if(this._worker?.port){delete this._worker._pendingDestroy;}throw ex;}this._transport=null;if(this._worker){this._worker.destroy();this._worker=null;}}}var api_docId={_:0};class PDFDataRangeTransport{constructor(length,initialData){let progressiveDone=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;let contentDispositionFilename=arguments.length>3&&arguments[3]!==undefined?arguments[3]:null;this.length=length;this.initialData=initialData;this.progressiveDone=progressiveDone;this.contentDispositionFilename=contentDispositionFilename;this._rangeListeners=[];this._progressListeners=[];this._progressiveReadListeners=[];this._progressiveDoneListeners=[];this._readyCapability=Promise.withResolvers();}addRangeListener(listener){this._rangeListeners.push(listener);}addProgressListener(listener){this._progressListeners.push(listener);}addProgressiveReadListener(listener){this._progressiveReadListeners.push(listener);}addProgressiveDoneListener(listener){this._progressiveDoneListeners.push(listener);}onDataRange(begin,chunk){for(const listener of this._rangeListeners){listener(begin,chunk);}}onDataProgress(loaded,total){this._readyCapability.promise.then(()=>{for(const listener of this._progressListeners){listener(loaded,total);}});}onDataProgressiveRead(chunk){this._readyCapability.promise.then(()=>{for(const listener of this._progressiveReadListeners){listener(chunk);}});}onDataProgressiveDone(){this._readyCapability.promise.then(()=>{for(const listener of this._progressiveDoneListeners){listener();}});}transportReady(){this._readyCapability.resolve();}requestDataRange(begin,end){unreachable("Abstract method PDFDataRangeTransport.requestDataRange");}abort(){}}class PDFDocumentProxy{constructor(pdfInfo,transport){this._pdfInfo=pdfInfo;this._transport=transport;}get annotationStorage(){return this._transport.annotationStorage;}get filterFactory(){return this._transport.filterFactory;}get numPages(){return this._pdfInfo.numPages;}get fingerprints(){return this._pdfInfo.fingerprints;}get isPureXfa(){return shadow(this,"isPureXfa",!!this._transport._htmlForXfa);}get allXfaHtml(){return this._transport._htmlForXfa;}getPage(pageNumber){return this._transport.getPage(pageNumber);}getPageIndex(ref){return this._transport.getPageIndex(ref);}getDestinations(){return this._transport.getDestinations();}getDestination(id){return this._transport.getDestination(id);}getPageLabels(){return this._transport.getPageLabels();}getPageLayout(){return this._transport.getPageLayout();}getPageMode(){return this._transport.getPageMode();}getViewerPreferences(){return this._transport.getViewerPreferences();}getOpenAction(){return this._transport.getOpenAction();}getAttachments(){return this._transport.getAttachments();}getJSActions(){return this._transport.getDocJSActions();}getOutline(){return this._transport.getOutline();}getOptionalContentConfig(){let{intent="display"}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};const{renderingIntent}=this._transport.getRenderingIntent(intent);return this._transport.getOptionalContentConfig(renderingIntent);}getPermissions(){return this._transport.getPermissions();}getMetadata(){return this._transport.getMetadata();}getMarkInfo(){return this._transport.getMarkInfo();}getData(){return this._transport.getData();}saveDocument(){return this._transport.saveDocument();}getDownloadInfo(){return this._transport.downloadInfoCapability.promise;}cleanup(){let keepLoadedFonts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;return this._transport.startCleanup(keepLoadedFonts||this.isPureXfa);}destroy(){return this.loadingTask.destroy();}cachedPageNumber(ref){return this._transport.cachedPageNumber(ref);}get loadingParams(){return this._transport.loadingParams;}get loadingTask(){return this._transport.loadingTask;}getFieldObjects(){return this._transport.getFieldObjects();}hasJSActions(){return this._transport.hasJSActions();}getCalculationOrderIds(){return this._transport.getCalculationOrderIds();}}var _delayedCleanupTimeout=/*#__PURE__*/new WeakMap();var _pendingCleanup=/*#__PURE__*/new WeakMap();var _PDFPageProxy_brand=/*#__PURE__*/new WeakSet();class PDFPageProxy{constructor(pageIndex,pageInfo,transport){let pdfBug=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;api_classPrivateMethodInitSpec(this,_PDFPageProxy_brand);api_classPrivateFieldInitSpec(this,_delayedCleanupTimeout,null);api_classPrivateFieldInitSpec(this,_pendingCleanup,false);this._pageIndex=pageIndex;this._pageInfo=pageInfo;this._transport=transport;this._stats=pdfBug?new StatTimer():null;this._pdfBug=pdfBug;this.commonObjs=transport.commonObjs;this.objs=new PDFObjects();this._maybeCleanupAfterRender=false;this._intentStates=new Map();this.destroyed=false;}get pageNumber(){return this._pageIndex+1;}get rotate(){return this._pageInfo.rotate;}get ref(){return this._pageInfo.ref;}get userUnit(){return this._pageInfo.userUnit;}get view(){return this._pageInfo.view;}getViewport(){let{scale,rotation=this.rotate,offsetX=0,offsetY=0,dontFlip=false}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return new PageViewport({viewBox:this.view,scale,rotation,offsetX,offsetY,dontFlip});}getAnnotations(){let{intent="display"}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};const{renderingIntent}=this._transport.getRenderingIntent(intent);return this._transport.getAnnotations(this._pageIndex,renderingIntent);}getJSActions(){return this._transport.getPageJSActions(this._pageIndex);}get filterFactory(){return this._transport.filterFactory;}get isPureXfa(){return shadow(this,"isPureXfa",!!this._transport._htmlForXfa);}async getXfa(){return this._transport._htmlForXfa?.children[this._pageIndex]||null;}render(_ref){let{canvasContext,viewport,intent="display",annotationMode=AnnotationMode.ENABLE,transform=null,background=null,optionalContentConfigPromise=null,annotationCanvasMap=null,pageColors=null,printAnnotationStorage=null}=_ref;this._stats?.time("Overall");const intentArgs=this._transport.getRenderingIntent(intent,annotationMode,printAnnotationStorage);const{renderingIntent,cacheKey}=intentArgs;api_classPrivateFieldSet(_pendingCleanup,this,false);api_assertClassBrand(_PDFPageProxy_brand,this,_abortDelayedCleanup).call(this);optionalContentConfigPromise||=this._transport.getOptionalContentConfig(renderingIntent);let intentState=this._intentStates.get(cacheKey);if(!intentState){intentState=Object.create(null);this._intentStates.set(cacheKey,intentState);}if(intentState.streamReaderCancelTimeout){clearTimeout(intentState.streamReaderCancelTimeout);intentState.streamReaderCancelTimeout=null;}const intentPrint=!!(renderingIntent&RenderingIntentFlag.PRINT);if(!intentState.displayReadyCapability){intentState.displayReadyCapability=Promise.withResolvers();intentState.operatorList={fnArray:[],argsArray:[],lastChunk:false,separateAnnots:null};this._stats?.time("Page Request");this._pumpOperatorList(intentArgs);}const complete=error=>{intentState.renderTasks.delete(internalRenderTask);if(this._maybeCleanupAfterRender||intentPrint){api_classPrivateFieldSet(_pendingCleanup,this,true);}api_assertClassBrand(_PDFPageProxy_brand,this,_tryCleanup).call(this,!intentPrint);if(error){internalRenderTask.capability.reject(error);this._abortOperatorList({intentState,reason:error instanceof Error?error:new Error(error)});}else{internalRenderTask.capability.resolve();}if(this._stats){this._stats.timeEnd("Rendering");this._stats.timeEnd("Overall");if(globalThis.Stats?.enabled){globalThis.Stats.add(this.pageNumber,this._stats);}}};const internalRenderTask=new InternalRenderTask({callback:complete,params:{canvasContext,viewport,transform,background},objs:this.objs,commonObjs:this.commonObjs,annotationCanvasMap,operatorList:intentState.operatorList,pageIndex:this._pageIndex,canvasFactory:this._transport.canvasFactory,filterFactory:this._transport.filterFactory,useRequestAnimationFrame:!intentPrint,pdfBug:this._pdfBug,pageColors});(intentState.renderTasks||=new Set()).add(internalRenderTask);const renderTask=internalRenderTask.task;Promise.all([intentState.displayReadyCapability.promise,optionalContentConfigPromise]).then(_ref2=>{let[transparency,optionalContentConfig]=_ref2;if(this.destroyed){complete();return;}this._stats?.time("Rendering");if(!(optionalContentConfig.renderingIntent&renderingIntent)){throw new Error("Must use the same `intent`-argument when calling the `PDFPageProxy.render` "+"and `PDFDocumentProxy.getOptionalContentConfig` methods.");}internalRenderTask.initializeGraphics({transparency,optionalContentConfig});internalRenderTask.operatorListChanged();}).catch(complete);return renderTask;}getOperatorList(){let{intent="display",annotationMode=AnnotationMode.ENABLE,printAnnotationStorage=null}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};function operatorListChanged(){if(intentState.operatorList.lastChunk){intentState.opListReadCapability.resolve(intentState.operatorList);intentState.renderTasks.delete(opListTask);}}const intentArgs=this._transport.getRenderingIntent(intent,annotationMode,printAnnotationStorage,true);let intentState=this._intentStates.get(intentArgs.cacheKey);if(!intentState){intentState=Object.create(null);this._intentStates.set(intentArgs.cacheKey,intentState);}let opListTask;if(!intentState.opListReadCapability){opListTask=Object.create(null);opListTask.operatorListChanged=operatorListChanged;intentState.opListReadCapability=Promise.withResolvers();(intentState.renderTasks||=new Set()).add(opListTask);intentState.operatorList={fnArray:[],argsArray:[],lastChunk:false,separateAnnots:null};this._stats?.time("Page Request");this._pumpOperatorList(intentArgs);}return intentState.opListReadCapability.promise;}streamTextContent(){let{includeMarkedContent=false,disableNormalization=false}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};const TEXT_CONTENT_CHUNK_SIZE=100;return this._transport.messageHandler.sendWithStream("GetTextContent",{pageIndex:this._pageIndex,includeMarkedContent:includeMarkedContent===true,disableNormalization:disableNormalization===true},{highWaterMark:TEXT_CONTENT_CHUNK_SIZE,size(textContent){return textContent.items.length;}});}getTextContent(){let params=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(this._transport._htmlForXfa){return this.getXfa().then(xfa=>XfaText.textContent(xfa));}const readableStream=this.streamTextContent(params);return new Promise(function(resolve,reject){function pump(){reader.read().then(function(_ref3){let{value,done}=_ref3;if(done){resolve(textContent);return;}textContent.lang??=value.lang;Object.assign(textContent.styles,value.styles);textContent.items.push(...value.items);pump();},reject);}const reader=readableStream.getReader();const textContent={items:[],styles:Object.create(null),lang:null};pump();});}getStructTree(){return this._transport.getStructTree(this._pageIndex);}_destroy(){this.destroyed=true;const waitOn=[];for(const intentState of this._intentStates.values()){this._abortOperatorList({intentState,reason:new Error("Page was destroyed."),force:true});if(intentState.opListReadCapability){continue;}for(const internalRenderTask of intentState.renderTasks){waitOn.push(internalRenderTask.completed);internalRenderTask.cancel();}}this.objs.clear();api_classPrivateFieldSet(_pendingCleanup,this,false);api_assertClassBrand(_PDFPageProxy_brand,this,_abortDelayedCleanup).call(this);return Promise.all(waitOn);}cleanup(){let resetStats=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;api_classPrivateFieldSet(_pendingCleanup,this,true);const success=api_assertClassBrand(_PDFPageProxy_brand,this,_tryCleanup).call(this,false);if(resetStats&&success){this._stats&&=new StatTimer();}return success;}_startRenderPage(transparency,cacheKey){const intentState=this._intentStates.get(cacheKey);if(!intentState){return;}this._stats?.timeEnd("Page Request");intentState.displayReadyCapability?.resolve(transparency);}_renderPageChunk(operatorListChunk,intentState){for(let i=0,ii=operatorListChunk.length;i<ii;i++){intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);}intentState.operatorList.lastChunk=operatorListChunk.lastChunk;intentState.operatorList.separateAnnots=operatorListChunk.separateAnnots;for(const internalRenderTask of intentState.renderTasks){internalRenderTask.operatorListChanged();}if(operatorListChunk.lastChunk){api_assertClassBrand(_PDFPageProxy_brand,this,_tryCleanup).call(this,true);}}_pumpOperatorList(_ref4){let{renderingIntent,cacheKey,annotationStorageSerializable}=_ref4;const{map,transfer}=annotationStorageSerializable;const readableStream=this._transport.messageHandler.sendWithStream("GetOperatorList",{pageIndex:this._pageIndex,intent:renderingIntent,cacheKey,annotationStorage:map},transfer);const reader=readableStream.getReader();const intentState=this._intentStates.get(cacheKey);intentState.streamReader=reader;const pump=()=>{reader.read().then(_ref5=>{let{value,done}=_ref5;if(done){intentState.streamReader=null;return;}if(this._transport.destroyed){return;}this._renderPageChunk(value,intentState);pump();},reason=>{intentState.streamReader=null;if(this._transport.destroyed){return;}if(intentState.operatorList){intentState.operatorList.lastChunk=true;for(const internalRenderTask of intentState.renderTasks){internalRenderTask.operatorListChanged();}api_assertClassBrand(_PDFPageProxy_brand,this,_tryCleanup).call(this,true);}if(intentState.displayReadyCapability){intentState.displayReadyCapability.reject(reason);}else if(intentState.opListReadCapability){intentState.opListReadCapability.reject(reason);}else{throw reason;}});};pump();}_abortOperatorList(_ref6){let{intentState,reason,force=false}=_ref6;if(!intentState.streamReader){return;}if(intentState.streamReaderCancelTimeout){clearTimeout(intentState.streamReaderCancelTimeout);intentState.streamReaderCancelTimeout=null;}if(!force){if(intentState.renderTasks.size>0){return;}if(reason instanceof RenderingCancelledException){let delay=RENDERING_CANCELLED_TIMEOUT;if(reason.extraDelay>0&&reason.extraDelay<1000){delay+=reason.extraDelay;}intentState.streamReaderCancelTimeout=setTimeout(()=>{intentState.streamReaderCancelTimeout=null;this._abortOperatorList({intentState,reason,force:true});},delay);return;}}intentState.streamReader.cancel(new AbortException(reason.message)).catch(()=>{});intentState.streamReader=null;if(this._transport.destroyed){return;}for(const[curCacheKey,curIntentState]of this._intentStates){if(curIntentState===intentState){this._intentStates.delete(curCacheKey);break;}}this.cleanup();}get stats(){return this._stats;}}function _tryCleanup(){let delayed=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;api_assertClassBrand(_PDFPageProxy_brand,this,_abortDelayedCleanup).call(this);if(!api_classPrivateFieldGet(_pendingCleanup,this)||this.destroyed){return false;}if(delayed){api_classPrivateFieldSet(_delayedCleanupTimeout,this,setTimeout(()=>{api_classPrivateFieldSet(_delayedCleanupTimeout,this,null);api_assertClassBrand(_PDFPageProxy_brand,this,_tryCleanup).call(this,false);},DELAYED_CLEANUP_TIMEOUT));return false;}for(const{renderTasks,operatorList}of this._intentStates.values()){if(renderTasks.size>0||!operatorList.lastChunk){return false;}}this._intentStates.clear();this.objs.clear();api_classPrivateFieldSet(_pendingCleanup,this,false);return true;}function _abortDelayedCleanup(){if(api_classPrivateFieldGet(_delayedCleanupTimeout,this)){clearTimeout(api_classPrivateFieldGet(_delayedCleanupTimeout,this));api_classPrivateFieldSet(_delayedCleanupTimeout,this,null);}}var _listeners=/*#__PURE__*/new WeakMap();var _deferred=/*#__PURE__*/new WeakMap();class LoopbackPort{constructor(){api_classPrivateFieldInitSpec(this,_listeners,new Set());api_classPrivateFieldInitSpec(this,_deferred,Promise.resolve());}postMessage(obj,transfer){const event={data:structuredClone(obj,transfer?{transfer}:null)};api_classPrivateFieldGet(_deferred,this).then(()=>{for(const listener of api_classPrivateFieldGet(_listeners,this)){listener.call(this,event);}});}addEventListener(name,listener){api_classPrivateFieldGet(_listeners,this).add(listener);}removeEventListener(name,listener){api_classPrivateFieldGet(_listeners,this).delete(listener);}terminate(){api_classPrivateFieldGet(_listeners,this).clear();}}const PDFWorkerUtil={isWorkerDisabled:false,fakeWorkerId:0};{if(isNodeJS){PDFWorkerUtil.isWorkerDisabled=true;GlobalWorkerOptions.workerSrc||="./pdf.worker.mjs";}PDFWorkerUtil.isSameOrigin=function(baseUrl,otherUrl){let base;try{base=new URL(baseUrl);if(!base.origin||base.origin==="null"){return false;}}catch{return false;}const other=new URL(otherUrl,base);return base.origin===other.origin;};PDFWorkerUtil.createCDNWrapper=function(url){const wrapper=`await import("${url}");`;return URL.createObjectURL(new Blob([wrapper],{type:"text/javascript"}));};}var _PDFWorker_brand=/*#__PURE__*/new WeakSet();class PDFWorker{constructor(){let{name=null,port=null,verbosity=getVerbosityLevel()}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};api_classPrivateMethodInitSpec(this,_PDFWorker_brand);this.name=name;this.destroyed=false;this.verbosity=verbosity;this._readyCapability=Promise.withResolvers();this._port=null;this._webWorker=null;this._messageHandler=null;if(port){if(_workerPorts._?.has(port)){throw new Error("Cannot use more than one PDFWorker per port.");}(_workerPorts._||(_workerPorts._=new WeakMap())).set(port,this);this._initializeFromPort(port);return;}this._initialize();}get promise(){if(isNodeJS){return Promise.all([NodePackages.promise,this._readyCapability.promise]);}return this._readyCapability.promise;}get port(){return this._port;}get messageHandler(){return this._messageHandler;}_initializeFromPort(port){this._port=port;this._messageHandler=new MessageHandler("main","worker",port);this._messageHandler.on("ready",function(){});this._readyCapability.resolve();this._messageHandler.send("configure",{verbosity:this.verbosity});}_initialize(){if(!PDFWorkerUtil.isWorkerDisabled&&!_get_mainThreadWorkerMessageHandler(PDFWorker)){let{workerSrc}=PDFWorker;try{if(!PDFWorkerUtil.isSameOrigin(window.location.href,workerSrc)){workerSrc=PDFWorkerUtil.createCDNWrapper(new URL(workerSrc,window.location).href);}const worker=new Worker(api_assertClassBrand(_PDFWorker_brand,this,_generateTrustedURL).call(this,workerSrc),{type:"module"});const messageHandler=new MessageHandler("main","worker",worker);const terminateEarly=()=>{worker.removeEventListener("error",onWorkerError);messageHandler.destroy();worker.terminate();if(this.destroyed){this._readyCapability.reject(new Error("Worker was destroyed"));}else{this._setupFakeWorker();}};const onWorkerError=()=>{if(!this._webWorker){terminateEarly();}};worker.addEventListener("error",onWorkerError);messageHandler.on("test",data=>{worker.removeEventListener("error",onWorkerError);if(this.destroyed){terminateEarly();return;}if(data){this._messageHandler=messageHandler;this._port=worker;this._webWorker=worker;this._readyCapability.resolve();messageHandler.send("configure",{verbosity:this.verbosity});}else{this._setupFakeWorker();messageHandler.destroy();worker.terminate();}});messageHandler.on("ready",data=>{worker.removeEventListener("error",onWorkerError);if(this.destroyed){terminateEarly();return;}try{sendTest();}catch{this._setupFakeWorker();}});const sendTest=()=>{const testObj=new Uint8Array();messageHandler.send("test",testObj,[testObj.buffer]);};sendTest();return;}catch{info("The worker has been disabled.");}}this._setupFakeWorker();}_setupFakeWorker(){if(!PDFWorkerUtil.isWorkerDisabled){warn("Setting up fake worker.");PDFWorkerUtil.isWorkerDisabled=true;}PDFWorker._setupFakeWorkerGlobal.then(WorkerMessageHandler=>{if(this.destroyed){this._readyCapability.reject(new Error("Worker was destroyed"));return;}const port=new LoopbackPort();this._port=port;const id=`fake${PDFWorkerUtil.fakeWorkerId++}`;const workerHandler=new MessageHandler(id+"_worker",id,port);WorkerMessageHandler.setup(workerHandler,port);const messageHandler=new MessageHandler(id,id+"_worker",port);this._messageHandler=messageHandler;this._readyCapability.resolve();messageHandler.send("configure",{verbosity:this.verbosity});}).catch(reason=>{this._readyCapability.reject(new Error(`Setting up fake worker failed: "${reason.message}".`));});}destroy(){this.destroyed=true;if(this._webWorker){this._webWorker.terminate();this._webWorker=null;}_workerPorts._?.delete(this._port);this._port=null;if(this._messageHandler){this._messageHandler.destroy();this._messageHandler=null;}}static fromPort(params){if(!params?.port){throw new Error("PDFWorker.fromPort - invalid method signature.");}const cachedPort=api_assertClassBrand(PDFWorker,this,_workerPorts)._?.get(params.port);if(cachedPort){if(cachedPort._pendingDestroy){throw new Error("PDFWorker.fromPort - the worker is being destroyed.\n"+"Please remember to await `PDFDocumentLoadingTask.destroy()`-calls.");}return cachedPort;}return new PDFWorker(params);}static get workerSrc(){if(GlobalWorkerOptions.workerSrc){if(GlobalWorkerOptions.workerSrc.constructor.name==="Function"){return GlobalWorkerOptions.workerSrc();}return GlobalWorkerOptions.workerSrc;}throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');}static get _setupFakeWorkerGlobal(){const loader=async()=>{if(api_classPrivateGetter(PDFWorker,this,_get_mainThreadWorkerMessageHandler)){return api_classPrivateGetter(PDFWorker,this,_get_mainThreadWorkerMessageHandler);}const worker=await import(/*webpackIgnore: true*/this.workerSrc);return worker.WorkerMessageHandler;};return shadow(this,"_setupFakeWorkerGlobal",loader());}}function _generateTrustedURL(sourcePath){if(window.trustedTypes){return window.pdfViewerSanitizer.createScriptURL(sourcePath);}return sourcePath;}function _get_mainThreadWorkerMessageHandler(_this){try{return globalThis.pdfjsWorker?.WorkerMessageHandler||null;}catch{return null;}}var _workerPorts={_:void 0};var _methodPromises=/*#__PURE__*/new WeakMap();var _pageCache=/*#__PURE__*/new WeakMap();var _pagePromises=/*#__PURE__*/new WeakMap();var _pageRefCache=/*#__PURE__*/new WeakMap();var _passwordCapability=/*#__PURE__*/new WeakMap();var _WorkerTransport_brand=/*#__PURE__*/new WeakSet();class WorkerTransport{constructor(messageHandler,loadingTask,networkStream,params,factory){api_classPrivateMethodInitSpec(this,_WorkerTransport_brand);api_classPrivateFieldInitSpec(this,_methodPromises,new Map());api_classPrivateFieldInitSpec(this,_pageCache,new Map());api_classPrivateFieldInitSpec(this,_pagePromises,new Map());api_classPrivateFieldInitSpec(this,_pageRefCache,new Map());api_classPrivateFieldInitSpec(this,_passwordCapability,null);this.messageHandler=messageHandler;this.loadingTask=loadingTask;this.commonObjs=new PDFObjects();this.fontLoader=new FontLoader({ownerDocument:params.ownerDocument,styleElement:params.styleElement});this.loadingParams=params.loadingParams;this._params=params;this.canvasFactory=factory.canvasFactory;this.filterFactory=factory.filterFactory;this.cMapReaderFactory=factory.cMapReaderFactory;this.standardFontDataFactory=factory.standardFontDataFactory;this.destroyed=false;this.destroyCapability=null;this._networkStream=networkStream;this._fullReader=null;this._lastProgress=null;this.downloadInfoCapability=Promise.withResolvers();this.setupMessageHandler();}get annotationStorage(){return shadow(this,"annotationStorage",new AnnotationStorage());}getRenderingIntent(intent){let annotationMode=arguments.length>1&&arguments[1]!==undefined?arguments[1]:AnnotationMode.ENABLE;let printAnnotationStorage=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;let isOpList=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;let renderingIntent=RenderingIntentFlag.DISPLAY;let annotationStorageSerializable=SerializableEmpty;switch(intent){case"any":renderingIntent=RenderingIntentFlag.ANY;break;case"display":break;case"print":renderingIntent=RenderingIntentFlag.PRINT;break;default:warn(`getRenderingIntent - invalid intent: ${intent}`);}switch(annotationMode){case AnnotationMode.DISABLE:renderingIntent+=RenderingIntentFlag.ANNOTATIONS_DISABLE;break;case AnnotationMode.ENABLE:break;case AnnotationMode.ENABLE_FORMS:renderingIntent+=RenderingIntentFlag.ANNOTATIONS_FORMS;break;case AnnotationMode.ENABLE_STORAGE:renderingIntent+=RenderingIntentFlag.ANNOTATIONS_STORAGE;const annotationStorage=renderingIntent&RenderingIntentFlag.PRINT&&printAnnotationStorage instanceof PrintAnnotationStorage?printAnnotationStorage:this.annotationStorage;annotationStorageSerializable=annotationStorage.serializable;break;default:warn(`getRenderingIntent - invalid annotationMode: ${annotationMode}`);}if(isOpList){renderingIntent+=RenderingIntentFlag.OPLIST;}return{renderingIntent,cacheKey:`${renderingIntent}_${annotationStorageSerializable.hash}`,annotationStorageSerializable};}destroy(){if(this.destroyCapability){return this.destroyCapability.promise;}this.destroyed=true;this.destroyCapability=Promise.withResolvers();api_classPrivateFieldGet(_passwordCapability,this)?.reject(new Error("Worker was destroyed during onPassword callback"));const waitOn=[];for(const page of api_classPrivateFieldGet(_pageCache,this).values()){waitOn.push(page._destroy());}api_classPrivateFieldGet(_pageCache,this).clear();api_classPrivateFieldGet(_pagePromises,this).clear();api_classPrivateFieldGet(_pageRefCache,this).clear();if(this.hasOwnProperty("annotationStorage")){this.annotationStorage.resetModified();}const terminated=this.messageHandler.sendWithPromise("Terminate",null);waitOn.push(terminated);Promise.all(waitOn).then(()=>{this.commonObjs.clear();this.fontLoader.clear();api_classPrivateFieldGet(_methodPromises,this).clear();this.filterFactory.destroy();TextLayer.cleanup();this._networkStream?.cancelAllRequests(new AbortException("Worker was terminated."));if(this.messageHandler){this.messageHandler.destroy();this.messageHandler=null;}this.destroyCapability.resolve();},this.destroyCapability.reject);return this.destroyCapability.promise;}setupMessageHandler(){const{messageHandler,loadingTask}=this;messageHandler.on("GetReader",(data,sink)=>{assert(this._networkStream,"GetReader - no `IPDFStream` instance available.");this._fullReader=this._networkStream.getFullReader();this._fullReader.onProgress=evt=>{this._lastProgress={loaded:evt.loaded,total:evt.total};};sink.onPull=()=>{this._fullReader.read().then(function(_ref7){let{value,done}=_ref7;if(done){sink.close();return;}assert(value instanceof ArrayBuffer,"GetReader - expected an ArrayBuffer.");sink.enqueue(new Uint8Array(value),1,[value]);}).catch(reason=>{sink.error(reason);});};sink.onCancel=reason=>{this._fullReader.cancel(reason);sink.ready.catch(readyReason=>{if(this.destroyed){return;}throw readyReason;});};});messageHandler.on("ReaderHeadersReady",data=>{const headersCapability=Promise.withResolvers();const fullReader=this._fullReader;fullReader.headersReady.then(()=>{if(!fullReader.isStreamingSupported||!fullReader.isRangeSupported){if(this._lastProgress){loadingTask.onProgress?.(this._lastProgress);}fullReader.onProgress=evt=>{loadingTask.onProgress?.({loaded:evt.loaded,total:evt.total});};}headersCapability.resolve({isStreamingSupported:fullReader.isStreamingSupported,isRangeSupported:fullReader.isRangeSupported,contentLength:fullReader.contentLength});},headersCapability.reject);return headersCapability.promise;});messageHandler.on("GetRangeReader",(data,sink)=>{assert(this._networkStream,"GetRangeReader - no `IPDFStream` instance available.");const rangeReader=this._networkStream.getRangeReader(data.begin,data.end);if(!rangeReader){sink.close();return;}sink.onPull=()=>{rangeReader.read().then(function(_ref8){let{value,done}=_ref8;if(done){sink.close();return;}assert(value instanceof ArrayBuffer,"GetRangeReader - expected an ArrayBuffer.");sink.enqueue(new Uint8Array(value),1,[value]);}).catch(reason=>{sink.error(reason);});};sink.onCancel=reason=>{rangeReader.cancel(reason);sink.ready.catch(readyReason=>{if(this.destroyed){return;}throw readyReason;});};});messageHandler.on("GetDoc",_ref9=>{let{pdfInfo}=_ref9;this._numPages=pdfInfo.numPages;this._htmlForXfa=pdfInfo.htmlForXfa;delete pdfInfo.htmlForXfa;loadingTask._capability.resolve(new PDFDocumentProxy(pdfInfo,this));});messageHandler.on("DocException",function(ex){let reason;switch(ex.name){case"PasswordException":reason=new PasswordException(ex.message,ex.code);break;case"InvalidPDFException":reason=new InvalidPDFException(ex.message);break;case"MissingPDFException":reason=new MissingPDFException(ex.message);break;case"UnexpectedResponseException":reason=new UnexpectedResponseException(ex.message,ex.status);break;case"UnknownErrorException":reason=new UnknownErrorException(ex.message,ex.details);break;default:unreachable("DocException - expected a valid Error.");}loadingTask._capability.reject(reason);});messageHandler.on("PasswordRequest",exception=>{api_classPrivateFieldSet(_passwordCapability,this,Promise.withResolvers());if(loadingTask.onPassword){const updatePassword=password=>{if(password instanceof Error){api_classPrivateFieldGet(_passwordCapability,this).reject(password);}else{api_classPrivateFieldGet(_passwordCapability,this).resolve({password});}};try{loadingTask.onPassword(updatePassword,exception.code);}catch(ex){api_classPrivateFieldGet(_passwordCapability,this).reject(ex);}}else{api_classPrivateFieldGet(_passwordCapability,this).reject(new PasswordException(exception.message,exception.code));}return api_classPrivateFieldGet(_passwordCapability,this).promise;});messageHandler.on("DataLoaded",data=>{loadingTask.onProgress?.({loaded:data.length,total:data.length});this.downloadInfoCapability.resolve(data);});messageHandler.on("StartRenderPage",data=>{if(this.destroyed){return;}const page=api_classPrivateFieldGet(_pageCache,this).get(data.pageIndex);page._startRenderPage(data.transparency,data.cacheKey);});messageHandler.on("commonobj",_ref10=>{let[id,type,exportedData]=_ref10;if(this.destroyed){return null;}if(this.commonObjs.has(id)){return null;}switch(type){case"Font":const{disableFontFace,fontExtraProperties,pdfBug}=this._params;if("error"in exportedData){const exportedError=exportedData.error;warn(`Error during font loading: ${exportedError}`);this.commonObjs.resolve(id,exportedError);break;}const inspectFont=pdfBug&&globalThis.FontInspector?.enabled?(font,url)=>globalThis.FontInspector.fontAdded(font,url):null;const font=new FontFaceObject(exportedData,{disableFontFace,inspectFont});this.fontLoader.bind(font).catch(()=>messageHandler.sendWithPromise("FontFallback",{id})).finally(()=>{if(!fontExtraProperties&&font.data){font.data=null;}this.commonObjs.resolve(id,font);});break;case"CopyLocalImage":const{imageRef}=exportedData;assert(imageRef,"The imageRef must be defined.");for(const pageProxy of api_classPrivateFieldGet(_pageCache,this).values()){for(const[,data]of pageProxy.objs){if(data?.ref!==imageRef){continue;}if(!data.dataLen){return null;}this.commonObjs.resolve(id,structuredClone(data));return data.dataLen;}}break;case"FontPath":case"Image":case"Pattern":this.commonObjs.resolve(id,exportedData);break;default:throw new Error(`Got unknown common object type ${type}`);}return null;});messageHandler.on("obj",_ref11=>{let[id,pageIndex,type,imageData]=_ref11;if(this.destroyed){return;}const pageProxy=api_classPrivateFieldGet(_pageCache,this).get(pageIndex);if(pageProxy.objs.has(id)){return;}if(pageProxy._intentStates.size===0){imageData?.bitmap?.close();return;}switch(type){case"Image":pageProxy.objs.resolve(id,imageData);if(imageData?.dataLen>MAX_IMAGE_SIZE_TO_CACHE){pageProxy._maybeCleanupAfterRender=true;}break;case"Pattern":pageProxy.objs.resolve(id,imageData);break;default:throw new Error(`Got unknown object type ${type}`);}});messageHandler.on("DocProgress",data=>{if(this.destroyed){return;}loadingTask.onProgress?.({loaded:data.loaded,total:data.total});});messageHandler.on("FetchBuiltInCMap",data=>{if(this.destroyed){return Promise.reject(new Error("Worker was destroyed."));}if(!this.cMapReaderFactory){return Promise.reject(new Error("CMapReaderFactory not initialized, see the `useWorkerFetch` parameter."));}return this.cMapReaderFactory.fetch(data);});messageHandler.on("FetchStandardFontData",data=>{if(this.destroyed){return Promise.reject(new Error("Worker was destroyed."));}if(!this.standardFontDataFactory){return Promise.reject(new Error("StandardFontDataFactory not initialized, see the `useWorkerFetch` parameter."));}return this.standardFontDataFactory.fetch(data);});}getData(){return this.messageHandler.sendWithPromise("GetData",null);}saveDocument(){if(this.annotationStorage.size<=0){warn("saveDocument called while `annotationStorage` is empty, "+"please use the getData-method instead.");}const{map,transfer}=this.annotationStorage.serializable;return this.messageHandler.sendWithPromise("SaveDocument",{isPureXfa:!!this._htmlForXfa,numPages:this._numPages,annotationStorage:map,filename:this._fullReader?.filename??null},transfer).finally(()=>{this.annotationStorage.resetModified();});}getPage(pageNumber){if(!Number.isInteger(pageNumber)||pageNumber<=0||pageNumber>this._numPages){return Promise.reject(new Error("Invalid page request."));}const pageIndex=pageNumber-1,cachedPromise=api_classPrivateFieldGet(_pagePromises,this).get(pageIndex);if(cachedPromise){return cachedPromise;}const promise=this.messageHandler.sendWithPromise("GetPage",{pageIndex}).then(pageInfo=>{if(this.destroyed){throw new Error("Transport destroyed");}if(pageInfo.refStr){api_classPrivateFieldGet(_pageRefCache,this).set(pageInfo.refStr,pageNumber);}const page=new PDFPageProxy(pageIndex,pageInfo,this,this._params.pdfBug);api_classPrivateFieldGet(_pageCache,this).set(pageIndex,page);return page;});api_classPrivateFieldGet(_pagePromises,this).set(pageIndex,promise);return promise;}getPageIndex(ref){if(!isRefProxy(ref)){return Promise.reject(new Error("Invalid pageIndex request."));}return this.messageHandler.sendWithPromise("GetPageIndex",{num:ref.num,gen:ref.gen});}getAnnotations(pageIndex,intent){return this.messageHandler.sendWithPromise("GetAnnotations",{pageIndex,intent});}getFieldObjects(){return api_assertClassBrand(_WorkerTransport_brand,this,_cacheSimpleMethod).call(this,"GetFieldObjects");}hasJSActions(){return api_assertClassBrand(_WorkerTransport_brand,this,_cacheSimpleMethod).call(this,"HasJSActions");}getCalculationOrderIds(){return this.messageHandler.sendWithPromise("GetCalculationOrderIds",null);}getDestinations(){return this.messageHandler.sendWithPromise("GetDestinations",null);}getDestination(id){if(typeof id!=="string"){return Promise.reject(new Error("Invalid destination request."));}return this.messageHandler.sendWithPromise("GetDestination",{id});}getPageLabels(){return this.messageHandler.sendWithPromise("GetPageLabels",null);}getPageLayout(){return this.messageHandler.sendWithPromise("GetPageLayout",null);}getPageMode(){return this.messageHandler.sendWithPromise("GetPageMode",null);}getViewerPreferences(){return this.messageHandler.sendWithPromise("GetViewerPreferences",null);}getOpenAction(){return this.messageHandler.sendWithPromise("GetOpenAction",null);}getAttachments(){return this.messageHandler.sendWithPromise("GetAttachments",null);}getDocJSActions(){return api_assertClassBrand(_WorkerTransport_brand,this,_cacheSimpleMethod).call(this,"GetDocJSActions");}getPageJSActions(pageIndex){return this.messageHandler.sendWithPromise("GetPageJSActions",{pageIndex});}getStructTree(pageIndex){return this.messageHandler.sendWithPromise("GetStructTree",{pageIndex});}getOutline(){return this.messageHandler.sendWithPromise("GetOutline",null);}getOptionalContentConfig(renderingIntent){return api_assertClassBrand(_WorkerTransport_brand,this,_cacheSimpleMethod).call(this,"GetOptionalContentConfig").then(data=>new OptionalContentConfig(data,renderingIntent));}getPermissions(){return this.messageHandler.sendWithPromise("GetPermissions",null);}getMetadata(){const name="GetMetadata",cachedPromise=api_classPrivateFieldGet(_methodPromises,this).get(name);if(cachedPromise){return cachedPromise;}const promise=this.messageHandler.sendWithPromise(name,null).then(results=>({info:results[0],metadata:results[1]?new Metadata(results[1]):null,contentDispositionFilename:this._fullReader?.filename??null,contentLength:this._fullReader?.contentLength??null}));api_classPrivateFieldGet(_methodPromises,this).set(name,promise);return promise;}getMarkInfo(){return this.messageHandler.sendWithPromise("GetMarkInfo",null);}async startCleanup(){let keepLoadedFonts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(this.destroyed){return;}await this.messageHandler.sendWithPromise("Cleanup",null);for(const page of api_classPrivateFieldGet(_pageCache,this).values()){const cleanupSuccessful=page.cleanup();if(!cleanupSuccessful){throw new Error(`startCleanup: Page ${page.pageNumber} is currently rendering.`);}}this.commonObjs.clear();if(!keepLoadedFonts){this.fontLoader.clear();}api_classPrivateFieldGet(_methodPromises,this).clear();this.filterFactory.destroy(true);TextLayer.cleanup();}cachedPageNumber(ref){if(!isRefProxy(ref)){return null;}const refStr=ref.gen===0?`${ref.num}R`:`${ref.num}R${ref.gen}`;return api_classPrivateFieldGet(_pageRefCache,this).get(refStr)??null;}}function _cacheSimpleMethod(name){let data=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;const cachedPromise=api_classPrivateFieldGet(_methodPromises,this).get(name);if(cachedPromise){return cachedPromise;}const promise=this.messageHandler.sendWithPromise(name,data);api_classPrivateFieldGet(_methodPromises,this).set(name,promise);return promise;}const INITIAL_DATA=Symbol("INITIAL_DATA");var _objs=/*#__PURE__*/new WeakMap();var _PDFObjects_brand=/*#__PURE__*/new WeakSet();class PDFObjects{constructor(){api_classPrivateMethodInitSpec(this,_PDFObjects_brand);api_classPrivateFieldInitSpec(this,_objs,Object.create(null));}get(objId){let callback=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;if(callback){const obj=api_assertClassBrand(_PDFObjects_brand,this,_ensureObj).call(this,objId);obj.promise.then(()=>callback(obj.data));return null;}const obj=api_classPrivateFieldGet(_objs,this)[objId];if(!obj||obj.data===INITIAL_DATA){throw new Error(`Requesting object that isn't resolved yet ${objId}.`);}return obj.data;}has(objId){const obj=api_classPrivateFieldGet(_objs,this)[objId];return!!obj&&obj.data!==INITIAL_DATA;}resolve(objId){let data=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;const obj=api_assertClassBrand(_PDFObjects_brand,this,_ensureObj).call(this,objId);obj.data=data;obj.resolve();}clear(){for(const objId in api_classPrivateFieldGet(_objs,this)){const{data}=api_classPrivateFieldGet(_objs,this)[objId];data?.bitmap?.close();}api_classPrivateFieldSet(_objs,this,Object.create(null));}*[Symbol.iterator](){for(const objId in api_classPrivateFieldGet(_objs,this)){const{data}=api_classPrivateFieldGet(_objs,this)[objId];if(data===INITIAL_DATA){continue;}yield[objId,data];}}}function _ensureObj(objId){return api_classPrivateFieldGet(_objs,this)[objId]||={...Promise.withResolvers(),data:INITIAL_DATA};}var _internalRenderTask=/*#__PURE__*/new WeakMap();class RenderTask{constructor(internalRenderTask){api_classPrivateFieldInitSpec(this,_internalRenderTask,null);api_classPrivateFieldSet(_internalRenderTask,this,internalRenderTask);this.onContinue=null;}get promise(){return api_classPrivateFieldGet(_internalRenderTask,this).capability.promise;}cancel(){let extraDelay=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;api_classPrivateFieldGet(_internalRenderTask,this).cancel(null,extraDelay);}get separateAnnots(){const{separateAnnots}=api_classPrivateFieldGet(_internalRenderTask,this).operatorList;if(!separateAnnots){return false;}const{annotationCanvasMap}=api_classPrivateFieldGet(_internalRenderTask,this);return separateAnnots.form||separateAnnots.canvas&&annotationCanvasMap?.size>0;}}class InternalRenderTask{constructor(_ref12){let{callback,params,objs,commonObjs,annotationCanvasMap,operatorList,pageIndex,canvasFactory,filterFactory,useRequestAnimationFrame=false,pdfBug=false,pageColors=null}=_ref12;this.callback=callback;this.params=params;this.objs=objs;this.commonObjs=commonObjs;this.annotationCanvasMap=annotationCanvasMap;this.operatorListIdx=null;this.operatorList=operatorList;this._pageIndex=pageIndex;this.canvasFactory=canvasFactory;this.filterFactory=filterFactory;this._pdfBug=pdfBug;this.pageColors=pageColors;this.running=false;this.graphicsReadyCallback=null;this.graphicsReady=false;this._useRequestAnimationFrame=useRequestAnimationFrame===true&&typeof window!=="undefined";this.cancelled=false;this.capability=Promise.withResolvers();this.task=new RenderTask(this);this._cancelBound=this.cancel.bind(this);this._continueBound=this._continue.bind(this);this._scheduleNextBound=this._scheduleNext.bind(this);this._nextBound=this._next.bind(this);this._canvas=params.canvasContext.canvas;}get completed(){return this.capability.promise.catch(function(){});}initializeGraphics(_ref13){let{transparency=false,optionalContentConfig}=_ref13;if(this.cancelled){return;}if(this._canvas){if(_canvasInUse._.has(this._canvas)){throw new Error("Cannot use the same canvas during multiple render() operations. "+"Use different canvas or ensure previous operations were "+"cancelled or completed.");}_canvasInUse._.add(this._canvas);}if(this._pdfBug&&globalThis.StepperManager?.enabled){this.stepper=globalThis.StepperManager.create(this._pageIndex);this.stepper.init(this.operatorList);this.stepper.nextBreakPoint=this.stepper.getNextBreakPoint();}const{canvasContext,viewport,transform,background}=this.params;this.gfx=new CanvasGraphics(canvasContext,this.commonObjs,this.objs,this.canvasFactory,this.filterFactory,{optionalContentConfig},this.annotationCanvasMap,this.pageColors);this.gfx.beginDrawing({transform,viewport,transparency,background});this.operatorListIdx=0;this.graphicsReady=true;this.graphicsReadyCallback?.();}cancel(){let error=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;let extraDelay=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;this.running=false;this.cancelled=true;this.gfx?.endDrawing();_canvasInUse._.delete(this._canvas);this.callback(error||new RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex+1}`,extraDelay));}operatorListChanged(){if(!this.graphicsReady){this.graphicsReadyCallback||=this._continueBound;return;}this.stepper?.updateOperatorList(this.operatorList);if(this.running){return;}this._continue();}_continue(){this.running=true;if(this.cancelled){return;}if(this.task.onContinue){this.task.onContinue(this._scheduleNextBound);}else{this._scheduleNext();}}_scheduleNext(){window.ngxZone.runOutsideAngular(()=>{if(this._useRequestAnimationFrame){window.requestAnimationFrame(()=>{this._nextBound().catch(this._cancelBound);});}else{Promise.resolve().then(this._nextBound).catch(this._cancelBound);}});}async _next(){if(this.cancelled){return;}this.operatorListIdx=this.gfx.executeOperatorList(this.operatorList,this.operatorListIdx,this._continueBound,this.stepper);if(this.operatorListIdx===this.operatorList.argsArray.length){this.running=false;if(this.operatorList.lastChunk){this.gfx.endDrawing();_canvasInUse._.delete(this._canvas);this.callback();}}}}var _canvasInUse={_:new WeakSet()};const version="4.3.659";const build="ba0b24810";
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.flat-map.js
var esnext_iterator_flat_map = __webpack_require__(670);
;// CONCATENATED MODULE: ./src/shared/scripting_utils.js
function makeColorComp(n){return Math.floor(Math.max(0,Math.min(1,n))*255).toString(16).padStart(2,"0");}function scaleAndClamp(x){return Math.max(0,Math.min(255,255*x));}class ColorConverters{static CMYK_G(_ref){let[c,y,m,k]=_ref;return["G",1-Math.min(1,0.3*c+0.59*m+0.11*y+k)];}static G_CMYK(_ref2){let[g]=_ref2;return["CMYK",0,0,0,1-g];}static G_RGB(_ref3){let[g]=_ref3;return["RGB",g,g,g];}static G_rgb(_ref4){let[g]=_ref4;g=scaleAndClamp(g);return[g,g,g];}static G_HTML(_ref5){let[g]=_ref5;const G=makeColorComp(g);return`#${G}${G}${G}`;}static RGB_G(_ref6){let[r,g,b]=_ref6;return["G",0.3*r+0.59*g+0.11*b];}static RGB_rgb(color){return color.map(scaleAndClamp);}static RGB_HTML(color){return`#${color.map(makeColorComp).join("")}`;}static T_HTML(){return"#00000000";}static T_rgb(){return[null];}static CMYK_RGB(_ref7){let[c,y,m,k]=_ref7;return["RGB",1-Math.min(1,c+k),1-Math.min(1,m+k),1-Math.min(1,y+k)];}static CMYK_rgb(_ref8){let[c,y,m,k]=_ref8;return[scaleAndClamp(1-Math.min(1,c+k)),scaleAndClamp(1-Math.min(1,m+k)),scaleAndClamp(1-Math.min(1,y+k))];}static CMYK_HTML(components){const rgb=this.CMYK_RGB(components).slice(1);return this.RGB_HTML(rgb);}static RGB_CMYK(_ref9){let[r,g,b]=_ref9;const c=1-r;const m=1-g;const y=1-b;const k=Math.min(c,m,y);return["CMYK",c,m,y,k];}}
;// CONCATENATED MODULE: ./src/display/xfa_layer.js
class XfaLayer{static setupStorage(html,id,element,storage,intent){const angularData=window.getFormValueFromAngular(html);if(angularData.value){storage.setValue(id,angularData);}const initialValue=storage.getValue(id,{value:null});const storedData=angularData.value?angularData:initialValue;window.registerXFAField(html,storedData,initialValue);html.addEventListener("updateFromAngular",value=>storage.setValue(id,{value:value.detail}));switch(element.name){case"textarea":if(storedData.value!==null){html.textContent=storedData.value;}if(intent==="print"){break;}html.addEventListener("input",event=>{window.updateAngularFormValue(html,{value:event.target.value});storage.setValue(id,{value:event.target.value});});break;case"input":if(element.attributes.type==="radio"||element.attributes.type==="checkbox"){if(storedData.value===element.attributes.xfaOn){html.setAttribute("checked",true);}else{html.removeAttribute("checked");}if(intent==="print"){break;}html.addEventListener("change",event=>{window.updateAngularFormValue(html,{value:event.target.checked?event.target.getAttribute("xfaOn"):event.target.getAttribute("xfaOff")});storage.setValue(id,{value:event.target.checked?event.target.getAttribute("xfaOn"):event.target.getAttribute("xfaOff")});});}else{if(storedData.value!==null){html.setAttribute("value",storedData.value);}if(intent==="print"){break;}html.addEventListener("input",event=>{window.updateAngularFormValue(html,{value:event.target.value});storage.setValue(id,{value:event.target.value});});}break;case"select":if(storedData.value!==null){html.setAttribute("value",storedData.value);for(const option of element.children){if(option.attributes.value===storedData.value){option.attributes.selected=true;}else if(option.attributes.hasOwnProperty("selected")){delete option.attributes.selected;}}}html.addEventListener("input",event=>{const options=event.target.options;const value=options.selectedIndex===-1?"":options[options.selectedIndex].value;window.updateAngularFormValue(html,{value});storage.setValue(id,{value});});break;}}static setAttributes(_ref){let{html,element,storage=null,intent,linkService}=_ref;const{attributes}=element;const isHTMLAnchorElement=html instanceof HTMLAnchorElement;if(attributes.type==="radio"){attributes.name=`${attributes.name}-${intent}`;}for(const[key,value]of Object.entries(attributes)){if(value===null||value===undefined){continue;}switch(key){case"class":if(value.length){html.setAttribute(key,value.join(" "));}break;case"dataId":break;case"id":html.setAttribute("data-element-id",value);break;case"style":Object.assign(html.style,value);break;case"textContent":html.textContent=value;break;default:if(!isHTMLAnchorElement||key!=="href"&&key!=="newWindow"){html.setAttribute(key,value);}}}if(isHTMLAnchorElement){linkService.addLinkAttributes(html,attributes.href,attributes.newWindow);}if(storage&&attributes.dataId){this.setupStorage(html,attributes.dataId,element,storage);}}static render(parameters){const storage=parameters.annotationStorage;const linkService=parameters.linkService;const root=parameters.xfaHtml;const intent=parameters.intent||"display";const rootHtml=document.createElement(root.name);if(root.attributes){this.setAttributes({html:rootHtml,element:root,intent,linkService});}const isNotForRichText=intent!=="richText";const rootDiv=parameters.div;rootDiv.append(rootHtml);if(parameters.viewport){const transform=`matrix(${parameters.viewport.transform.join(",")})`;rootDiv.style.transform=transform;}if(isNotForRichText){rootDiv.setAttribute("class","xfaLayer xfaFont");}const textDivs=[];if(root.children.length===0){if(root.value){const node=document.createTextNode(root.value);rootHtml.append(node);if(isNotForRichText&&XfaText.shouldBuildText(root.name)){textDivs.push(node);}}return{textDivs};}const stack=[[root,-1,rootHtml]];while(stack.length>0){const[parent,i,html]=stack.at(-1);if(i+1===parent.children.length){stack.pop();continue;}const child=parent.children[++stack.at(-1)[1]];if(child===null){continue;}const{name}=child;if(name==="#text"){const node=document.createTextNode(child.value);textDivs.push(node);html.append(node);continue;}const childHtml=child?.attributes?.xmlns?document.createElementNS(child.attributes.xmlns,name):document.createElement(name);html.append(childHtml);if(child.attributes){this.setAttributes({html:childHtml,element:child,storage,intent,linkService});}if(child.children?.length>0){stack.push([child,-1,childHtml]);}else if(child.value){const node=document.createTextNode(child.value);if(isNotForRichText&&XfaText.shouldBuildText(name)){textDivs.push(node);}childHtml.append(node);}}for(const el of rootDiv.querySelectorAll(".xfaNonInteractive input, .xfaNonInteractive textarea")){el.setAttribute("readOnly",true);}return{textDivs};}static update(parameters){const transform=`matrix(${parameters.viewport.transform.join(",")})`;parameters.div.style.transform=transform;parameters.div.hidden=false;}}
;// CONCATENATED MODULE: ./src/display/annotation_layer.js
function _toSetter(t,e,n){e||(e=[]);var r=e.length++;return Object.defineProperty({},"_",{set:function(o){e[r]=o,t.apply(n,e);}});}function annotation_layer_classPrivateGetter(s,r,a){return a(annotation_layer_assertClassBrand(s,r));}function annotation_layer_classPrivateMethodInitSpec(e,a){annotation_layer_checkPrivateRedeclaration(e,a),a.add(e);}function annotation_layer_classPrivateFieldInitSpec(e,t,a){annotation_layer_checkPrivateRedeclaration(e,t),t.set(e,a);}function annotation_layer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function annotation_layer_classPrivateFieldSet(s,a,r){return s.set(annotation_layer_assertClassBrand(s,a),r),r;}function annotation_layer_classPrivateFieldGet(s,a){return s.get(annotation_layer_assertClassBrand(s,a));}function annotation_layer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DEFAULT_TAB_INDEX=1000;const annotation_layer_DEFAULT_FONT_SIZE=9;const GetElementsByNameSet=new WeakSet();function getRectDims(rect){return{width:rect[2]-rect[0],height:rect[3]-rect[1]};}class AnnotationElementFactory{static create(parameters){const subtype=parameters.data.annotationType;switch(subtype){case AnnotationType.LINK:return new LinkAnnotationElement(parameters);case AnnotationType.TEXT:return new TextAnnotationElement(parameters);case AnnotationType.WIDGET:const fieldType=parameters.data.fieldType;switch(fieldType){case"Tx":return new TextWidgetAnnotationElement(parameters);case"Btn":if(parameters.data.radioButton){return new RadioButtonWidgetAnnotationElement(parameters);}else if(parameters.data.checkBox){return new CheckboxWidgetAnnotationElement(parameters);}return new PushButtonWidgetAnnotationElement(parameters);case"Ch":return new ChoiceWidgetAnnotationElement(parameters);case"Sig":return new SignatureWidgetAnnotationElement(parameters);}return new WidgetAnnotationElement(parameters);case AnnotationType.POPUP:return new PopupAnnotationElement(parameters);case AnnotationType.FREETEXT:return new FreeTextAnnotationElement(parameters);case AnnotationType.LINE:return new LineAnnotationElement(parameters);case AnnotationType.SQUARE:return new SquareAnnotationElement(parameters);case AnnotationType.CIRCLE:return new CircleAnnotationElement(parameters);case AnnotationType.POLYLINE:return new PolylineAnnotationElement(parameters);case AnnotationType.CARET:return new CaretAnnotationElement(parameters);case AnnotationType.INK:return new InkAnnotationElement(parameters);case AnnotationType.POLYGON:return new PolygonAnnotationElement(parameters);case AnnotationType.HIGHLIGHT:return new HighlightAnnotationElement(parameters);case AnnotationType.UNDERLINE:return new UnderlineAnnotationElement(parameters);case AnnotationType.SQUIGGLY:return new SquigglyAnnotationElement(parameters);case AnnotationType.STRIKEOUT:return new StrikeOutAnnotationElement(parameters);case AnnotationType.STAMP:return new StampAnnotationElement(parameters);case AnnotationType.FILEATTACHMENT:return new FileAttachmentAnnotationElement(parameters);default:return new AnnotationElement(parameters);}}}var _updates=/*#__PURE__*/new WeakMap();var _hasBorder=/*#__PURE__*/new WeakMap();var _popupElement=/*#__PURE__*/new WeakMap();var _AnnotationElement_brand=/*#__PURE__*/new WeakSet();class AnnotationElement{constructor(parameters){let{isRenderable=false,ignoreBorder=false,createQuadrilaterals=false}=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};annotation_layer_classPrivateMethodInitSpec(this,_AnnotationElement_brand);annotation_layer_classPrivateFieldInitSpec(this,_updates,null);annotation_layer_classPrivateFieldInitSpec(this,_hasBorder,false);annotation_layer_classPrivateFieldInitSpec(this,_popupElement,null);this.isRenderable=isRenderable;this.data=parameters.data;this.layer=parameters.layer;this.linkService=parameters.linkService;this.downloadManager=parameters.downloadManager;this.imageResourcesPath=parameters.imageResourcesPath;this.renderForms=parameters.renderForms;this.svgFactory=parameters.svgFactory;this.annotationStorage=parameters.annotationStorage;this.enableScripting=parameters.enableScripting;this.hasJSActions=parameters.hasJSActions;this._fieldObjects=parameters.fieldObjects;this.parent=parameters.parent;if(isRenderable){this.container=this._createContainer(ignoreBorder);}if(createQuadrilaterals){this._createQuadrilaterals();}}static _hasPopupData(_ref){let{titleObj,contentsObj,richText}=_ref;return!!(titleObj?.str||contentsObj?.str||richText?.str);}get hasPopupData(){return AnnotationElement._hasPopupData(this.data);}updateEdited(params){if(!this.container){return;}annotation_layer_classPrivateFieldGet(_updates,this)||annotation_layer_classPrivateFieldSet(_updates,this,{rect:this.data.rect.slice(0)});const{rect}=params;if(rect){annotation_layer_assertClassBrand(_AnnotationElement_brand,this,_setRectEdited).call(this,rect);}annotation_layer_classPrivateFieldGet(_popupElement,this)?.popup.updateEdited(params);}resetEdited(){if(!annotation_layer_classPrivateFieldGet(_updates,this)){return;}annotation_layer_assertClassBrand(_AnnotationElement_brand,this,_setRectEdited).call(this,annotation_layer_classPrivateFieldGet(_updates,this).rect);annotation_layer_classPrivateFieldGet(_popupElement,this)?.popup.resetEdited();annotation_layer_classPrivateFieldSet(_updates,this,null);}_createContainer(ignoreBorder){const{data,parent:{page,viewport}}=this;const container=document.createElement("section");container.setAttribute("data-annotation-id",data.id);if(!(this instanceof WidgetAnnotationElement)){container.tabIndex=DEFAULT_TAB_INDEX;}const{style}=container;style.zIndex=this.parent.zIndex++;if(data.popupRef){container.setAttribute("aria-haspopup","dialog");}if(data.alternativeText){container.title=data.alternativeText;}if(data.noRotate){container.classList.add("norotate");}if(!data.rect||this instanceof PopupAnnotationElement){const{rotation}=data;if(!data.hasOwnCanvas&&rotation!==0){this.setRotation(rotation,container);}return container;}const{width,height}=getRectDims(data.rect);if(!ignoreBorder&&data.borderStyle.width>0){style.borderWidth=`${data.borderStyle.width}px`;const horizontalRadius=data.borderStyle.horizontalCornerRadius;const verticalRadius=data.borderStyle.verticalCornerRadius;if(horizontalRadius>0||verticalRadius>0){const radius=`calc(${horizontalRadius}px * var(--scale-factor)) / calc(${verticalRadius}px * var(--scale-factor))`;style.borderRadius=radius;}else if(this instanceof RadioButtonWidgetAnnotationElement){const radius=`calc(${width}px * var(--scale-factor)) / calc(${height}px * var(--scale-factor))`;style.borderRadius=radius;}switch(data.borderStyle.style){case AnnotationBorderStyleType.SOLID:style.borderStyle="solid";break;case AnnotationBorderStyleType.DASHED:style.borderStyle="dashed";break;case AnnotationBorderStyleType.BEVELED:warn("Unimplemented border style: beveled");break;case AnnotationBorderStyleType.INSET:warn("Unimplemented border style: inset");break;case AnnotationBorderStyleType.UNDERLINE:style.borderBottomStyle="solid";break;default:break;}const borderColor=data.borderColor||null;if(borderColor){annotation_layer_classPrivateFieldSet(_hasBorder,this,true);style.borderColor=Util.makeHexColor(borderColor[0]|0,borderColor[1]|0,borderColor[2]|0);}else{style.borderWidth=0;}}const rect=Util.normalizeRect([data.rect[0],page.view[3]-data.rect[1]+page.view[1],data.rect[2],page.view[3]-data.rect[3]+page.view[1]]);const{pageWidth,pageHeight,pageX,pageY}=viewport.rawDims;style.left=`${100*(rect[0]-pageX)/pageWidth}%`;style.top=`${100*(rect[1]-pageY)/pageHeight}%`;const{rotation}=data;if(data.hasOwnCanvas||rotation===0){style.width=`${100*width/pageWidth}%`;style.height=`${100*height/pageHeight}%`;}else{this.setRotation(rotation,container);}return container;}setRotation(angle){let container=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.container;if(!this.data.rect){return;}const{pageWidth,pageHeight}=this.parent.viewport.rawDims;const{width,height}=getRectDims(this.data.rect);let elementWidth,elementHeight;if(angle%180===0){elementWidth=100*width/pageWidth;elementHeight=100*height/pageHeight;}else{elementWidth=100*height/pageWidth;elementHeight=100*width/pageHeight;}container.style.width=`${elementWidth}%`;container.style.height=`${elementHeight}%`;container.setAttribute("data-main-rotation",(360-angle)%360);}get _commonActions(){const setColor=(jsName,styleName,event)=>{const color=event.detail[jsName];const colorType=color[0];const colorArray=color.slice(1);event.target.style[styleName]=ColorConverters[`${colorType}_HTML`](colorArray);this.annotationStorage.setValue(this.data.id,{[styleName]:ColorConverters[`${colorType}_rgb`](colorArray)});};return shadow(this,"_commonActions",{display:event=>{const{display}=event.detail;const hidden=display%2===1;this.container.style.visibility=hidden?"hidden":"visible";this.annotationStorage.setValue(this.data.id,{noView:hidden,noPrint:display===1||display===2});},print:event=>{this.annotationStorage.setValue(this.data.id,{noPrint:!event.detail.print});},hidden:event=>{const{hidden}=event.detail;this.container.style.visibility=hidden?"hidden":"visible";this.annotationStorage.setValue(this.data.id,{noPrint:hidden,noView:hidden});},focus:event=>{setTimeout(()=>event.target.focus({preventScroll:false}),0);},userName:event=>{event.target.title=event.detail.userName;},readonly:event=>{event.target.disabled=event.detail.readonly;},required:event=>{this._setRequired(event.target,event.detail.required);},bgColor:event=>{setColor("bgColor","backgroundColor",event);},fillColor:event=>{setColor("fillColor","backgroundColor",event);},fgColor:event=>{setColor("fgColor","color",event);},textColor:event=>{setColor("textColor","color",event);},borderColor:event=>{setColor("borderColor","borderColor",event);},strokeColor:event=>{setColor("strokeColor","borderColor",event);},rotation:event=>{const angle=event.detail.rotation;this.setRotation(angle);this.annotationStorage.setValue(this.data.id,{rotation:angle});}});}_dispatchEventFromSandbox(actions,jsEvent){const commonActions=this._commonActions;for(const name of Object.keys(jsEvent.detail)){const action=actions[name]||commonActions[name];action?.(jsEvent);}}_setDefaultPropertiesFromJS(element){if(!this.enableScripting){return;}const storedData=this.annotationStorage.getRawValue(this.data.id);if(!storedData){return;}const commonActions=this._commonActions;for(const[actionName,detail]of Object.entries(storedData)){const action=commonActions[actionName];if(action){const eventProxy={detail:{[actionName]:detail},target:element};action(eventProxy);delete storedData[actionName];}}}_createQuadrilaterals(){if(!this.container){return;}const{quadPoints}=this.data;if(!quadPoints){return;}const[rectBlX,rectBlY,rectTrX,rectTrY]=this.data.rect;if(quadPoints.length===1){const[,{x:trX,y:trY},{x:blX,y:blY}]=quadPoints[0];if(rectTrX===trX&&rectTrY===trY&&rectBlX===blX&&rectBlY===blY){return;}}const{style}=this.container;let svgBuffer;if(annotation_layer_classPrivateFieldGet(_hasBorder,this)){const{borderColor,borderWidth}=style;style.borderWidth=0;svgBuffer=["url('data:image/svg+xml;utf8,",`<svg xmlns="http://www.w3.org/2000/svg"`,` preserveAspectRatio="none" viewBox="0 0 1 1">`,`<g fill="transparent" stroke="${borderColor}" stroke-width="${borderWidth}">`];this.container.classList.add("hasBorder");}const width=rectTrX-rectBlX;const height=rectTrY-rectBlY;const{svgFactory}=this;const svg=svgFactory.createElement("svg");svg.classList.add("quadrilateralsContainer");svg.setAttribute("width",0);svg.setAttribute("height",0);const defs=svgFactory.createElement("defs");svg.append(defs);const clipPath=svgFactory.createElement("clipPath");const id=`clippath_${this.data.id}`;clipPath.setAttribute("id",id);clipPath.setAttribute("clipPathUnits","objectBoundingBox");defs.append(clipPath);for(const[,{x:trX,y:trY},{x:blX,y:blY}]of quadPoints){const rect=svgFactory.createElement("rect");const x=(blX-rectBlX)/width;const y=(rectTrY-trY)/height;const rectWidth=(trX-blX)/width;const rectHeight=(trY-blY)/height;rect.setAttribute("x",x);rect.setAttribute("y",y);rect.setAttribute("width",rectWidth);rect.setAttribute("height",rectHeight);clipPath.append(rect);svgBuffer?.push(`<rect vector-effect="non-scaling-stroke" x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}"/>`);}if(annotation_layer_classPrivateFieldGet(_hasBorder,this)){svgBuffer.push(`</g></svg>')`);style.backgroundImage=svgBuffer.join("");}this.container.append(svg);this.container.style.clipPath=`url(#${id})`;}_createPopup(){const{container,data}=this;container.setAttribute("aria-haspopup","dialog");const popup=annotation_layer_classPrivateFieldSet(_popupElement,this,new PopupAnnotationElement({data:{color:data.color,titleObj:data.titleObj,modificationDate:data.modificationDate,contentsObj:data.contentsObj,richText:data.richText,parentRect:data.rect,borderStyle:0,id:`popup_${data.id}`,rotation:data.rotation},parent:this.parent,elements:[this]}));this.parent.div.append(popup.render());}render(){unreachable("Abstract method `AnnotationElement.render` called");}_getElementsByName(name){let skipId=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;const fields=[];if(this._fieldObjects){const fieldObj=this._fieldObjects[name];if(fieldObj){for(const{page,id,exportValues}of fieldObj){if(page===-1){continue;}if(id===skipId){continue;}const exportValue=typeof exportValues==="string"?exportValues:null;const domElement=document.querySelector(`[data-element-id="${id}"]`);if(domElement&&!GetElementsByNameSet.has(domElement)){warn(`_getElementsByName - element not allowed: ${id}`);continue;}fields.push({id,exportValue,domElement});}}return fields;}for(const domElement of document.getElementsByName(name)){const{exportValue}=domElement;const id=domElement.getAttribute("data-element-id");if(id===skipId){continue;}if(!GetElementsByNameSet.has(domElement)){continue;}fields.push({id,exportValue,domElement});}return fields;}show(){if(this.container){this.container.hidden=false;}this.popup?.maybeShow();}hide(){if(this.container){this.container.hidden=true;}this.popup?.forceHide();}getElementsToTriggerPopup(){return this.container;}addHighlightArea(){const triggers=this.getElementsToTriggerPopup();if(Array.isArray(triggers)){for(const element of triggers){element.classList.add("highlightArea");}}else{triggers.classList.add("highlightArea");}}get _isEditable(){return false;}_editOnDoubleClick(){if(!this._isEditable){return;}const{annotationEditorType:mode,data:{id:editId}}=this;this.container.addEventListener("dblclick",()=>{this.linkService.eventBus?.dispatch("switchannotationeditormode",{source:this,mode,editId});});}}function _setRectEdited(rect){const{container:{style},data:{rect:currentRect,rotation},parent:{viewport:{rawDims:{pageWidth,pageHeight,pageX,pageY}}}}=this;currentRect?.splice(0,4,...rect);const{width,height}=getRectDims(rect);style.left=`${100*(rect[0]-pageX)/pageWidth}%`;style.top=`${100*(pageHeight-rect[3]+pageY)/pageHeight}%`;if(rotation===0){style.width=`${100*width/pageWidth}%`;style.height=`${100*height/pageHeight}%`;}else{this.setRotation(rotation);}}var _LinkAnnotationElement_brand=/*#__PURE__*/new WeakSet();class LinkAnnotationElement extends AnnotationElement{constructor(parameters){let options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;super(parameters,{isRenderable:true,ignoreBorder:!!options?.ignoreBorder,createQuadrilaterals:true});annotation_layer_classPrivateMethodInitSpec(this,_LinkAnnotationElement_brand);this.isTooltipOnly=parameters.data.isTooltipOnly;}render(){const{data,linkService}=this;const link=document.createElement("a");link.setAttribute("data-element-id",data.id);let isBound=false;if(data.url){linkService.addLinkAttributes(link,data.url,data.newWindow);isBound=true;}else if(data.action){this._bindNamedAction(link,data.action);isBound=true;}else if(data.attachment){annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_bindAttachment).call(this,link,data.attachment,data.attachmentDest);isBound=true;}else if(data.setOCGState){annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_bindSetOCGState).call(this,link,data.setOCGState);isBound=true;}else if(data.dest){this._bindLink(link,data.dest);isBound=true;}else{if(data.actions&&(data.actions.Action||data.actions["Mouse Up"]||data.actions["Mouse Down"])&&this.enableScripting&&this.hasJSActions){this._bindJSAction(link,data);isBound=true;}if(data.resetForm){this._bindResetFormAction(link,data.resetForm);isBound=true;}else if(this.isTooltipOnly&&!isBound){this._bindLink(link,"");isBound=true;}}this.container.classList.add("linkAnnotation");if(isBound){this.container.append(link);}return this.container;}_bindLink(link,destination){link.href=this.linkService.getDestinationHash(destination);link.onclick=()=>{if(destination){this.linkService.goToDestination(destination);}return false;};if(destination||destination===""){annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_setInternalLink).call(this);}}_bindNamedAction(link,action){link.href=this.linkService.getAnchorUrl("");link.onclick=()=>{this.linkService.executeNamedAction(action);return false;};annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_setInternalLink).call(this);}_bindJSAction(link,data){link.href=this.linkService.getAnchorUrl("");const map=new Map([["Action","onclick"],["Mouse Up","onmouseup"],["Mouse Down","onmousedown"]]);for(const name of Object.keys(data.actions)){const jsName=map.get(name);if(!jsName){continue;}link[jsName]=()=>{this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id:data.id,name}});return false;};}if(!link.onclick){link.onclick=()=>false;}annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_setInternalLink).call(this);}_bindResetFormAction(link,resetForm){const otherClickAction=link.onclick;if(!otherClickAction){link.href=this.linkService.getAnchorUrl("");}annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_setInternalLink).call(this);if(!this._fieldObjects){warn(`_bindResetFormAction - "resetForm" action not supported, `+"ensure that the `fieldObjects` parameter is provided.");if(!otherClickAction){link.onclick=()=>false;}return;}link.onclick=()=>{otherClickAction?.();const{fields:resetFormFields,refs:resetFormRefs,include}=resetForm;const allFields=[];if(resetFormFields.length!==0||resetFormRefs.length!==0){const fieldIds=new Set(resetFormRefs);for(const fieldName of resetFormFields){const fields=this._fieldObjects[fieldName]||[];for(const{id}of fields){fieldIds.add(id);}}for(const fields of Object.values(this._fieldObjects)){for(const field of fields){if(fieldIds.has(field.id)===include){allFields.push(field);}}}}else{for(const fields of Object.values(this._fieldObjects)){allFields.push(...fields);}}const storage=this.annotationStorage;const allIds=[];for(const field of allFields){const{id}=field;allIds.push(id);switch(field.type){case"text":{const value=field.defaultValue||"";storage.setValue(id,{value});window.updateAngularFormValue(id,{value});break;}case"checkbox":case"radiobutton":{const value=field.defaultValue===field.exportValues;storage.setValue(id,{value});window.updateAngularFormValue(id,{value});break;}case"combobox":case"listbox":{const value=field.defaultValue||"";storage.setValue(id,{value});window.updateAngularFormValue(id,{value});break;}default:continue;}const domElement=document.querySelector(`[data-element-id="${id}"]`);if(!domElement){continue;}else if(!GetElementsByNameSet.has(domElement)){warn(`_bindResetFormAction - element not allowed: ${id}`);continue;}domElement.dispatchEvent(new Event("resetform"));}if(this.enableScripting){this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id:"app",ids:allIds,name:"ResetForm"}});}return false;};}}function _setInternalLink(){this.container.setAttribute("data-internal-link","");}function _bindAttachment(link,attachment){let dest=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;link.href=this.linkService.getAnchorUrl("");if(attachment.description){link.title=attachment.description;}link.onclick=()=>{this.downloadManager?.openOrDownloadData(attachment.content,attachment.filename,dest);return false;};annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_setInternalLink).call(this);}function _bindSetOCGState(link,action){link.href=this.linkService.getAnchorUrl("");link.onclick=()=>{this.linkService.executeSetOCGState(action);return false;};annotation_layer_assertClassBrand(_LinkAnnotationElement_brand,this,_setInternalLink).call(this);}class TextAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true});}render(){this.container.classList.add("textAnnotation");const image=document.createElement("img");image.src=this.imageResourcesPath+"annotation-"+this.data.name.toLowerCase()+".svg";image.setAttribute("data-l10n-id","pdfjs-text-annotation-type");image.setAttribute("data-l10n-args",JSON.stringify({type:this.data.name}));if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}this.container.append(image);return this.container;}}class WidgetAnnotationElement extends AnnotationElement{render(){return this.container;}showElementAndHideCanvas(element){if(this.data.hasOwnCanvas){if(element.previousSibling?.nodeName==="CANVAS"){element.previousSibling.hidden=true;}element.hidden=false;}}_getKeyModifier(event){return util_FeatureTest.platform.isMac?event.metaKey:event.ctrlKey;}_setEventListener(element,elementData,baseName,eventName,valueGetter){if(baseName.includes("mouse")){element.addEventListener(baseName,event=>{this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id:this.data.id,name:eventName,value:valueGetter(event),shift:event.shiftKey,modifier:this._getKeyModifier(event)}});});}else{element.addEventListener(baseName,event=>{if(baseName==="blur"){if(!elementData.focused||!event.relatedTarget){return;}elementData.focused=false;}else if(baseName==="focus"){if(elementData.focused){return;}elementData.focused=true;}if(!valueGetter){return;}this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id:this.data.id,name:eventName,value:valueGetter(event)}});});}}_setEventListeners(element,elementData,names,getter){for(const[baseName,eventName]of names){if(eventName==="Action"||this.data.actions?.[eventName]){if(eventName==="Focus"||eventName==="Blur"){elementData||={focused:false};}this._setEventListener(element,elementData,baseName,eventName,getter);if(eventName==="Focus"&&!this.data.actions?.Blur){this._setEventListener(element,elementData,"blur","Blur",null);}else if(eventName==="Blur"&&!this.data.actions?.Focus){this._setEventListener(element,elementData,"focus","Focus",null);}}}}_setBackgroundColor(element){const color=this.data.backgroundColor||null;element.style.backgroundColor=color===null?"transparent":Util.makeHexColor(color[0],color[1],color[2]);}_setTextStyle(element){const TEXT_ALIGNMENT=["left","center","right"];const{fontColor}=this.data.defaultAppearanceData;const fontSize=this.data.defaultAppearanceData.fontSize||annotation_layer_DEFAULT_FONT_SIZE;const style=element.style;let computedFontSize;const BORDER_SIZE=2;const roundToOneDecimal=x=>Math.round(10*x)/10;if(this.data.multiLine){const height=Math.abs(this.data.rect[3]-this.data.rect[1]-BORDER_SIZE);const numberOfLines=Math.round(height/(LINE_FACTOR*fontSize))||1;const lineHeight=height/numberOfLines;computedFontSize=Math.min(fontSize,roundToOneDecimal(lineHeight/LINE_FACTOR));}else{const height=Math.abs(this.data.rect[3]-this.data.rect[1]-BORDER_SIZE);computedFontSize=Math.min(fontSize,roundToOneDecimal(height/LINE_FACTOR));}style.fontSize=`calc(${computedFontSize}px * var(--scale-factor))`;style.color=Util.makeHexColor(fontColor[0],fontColor[1],fontColor[2]);if(this.data.textAlignment!==null){style.textAlign=TEXT_ALIGNMENT[this.data.textAlignment];}}_setRequired(element,isRequired){if(isRequired){element.setAttribute("required",true);}else{element.removeAttribute("required");}element.setAttribute("aria-required",isRequired);}}class TextWidgetAnnotationElement extends WidgetAnnotationElement{constructor(parameters){const isRenderable=parameters.renderForms||parameters.data.hasOwnCanvas||!parameters.data.hasAppearance&&!!parameters.data.fieldValue;super(parameters,{isRenderable});}setPropertyOnSiblings(base,key,value,keyInStorage){const storage=this.annotationStorage;for(const element of this._getElementsByName(base.name,base.id)){if(element.domElement){element.domElement[key]=value;}storage.setValue(element.id,{[keyInStorage]:value});}}render(){const storage=this.annotationStorage;const id=this.data.id;this.container.classList.add("textWidgetAnnotation");let element=null;if(this.renderForms){const angularData=window.getFormValueFromAngular(this.data.fieldName);const formData=storage.getValue(id,{value:this.data.fieldValue});const storedData=angularData.value?angularData:formData;if(angularData!==formData){storage.setValue(id,{value:angularData.value});storedData.formattedValue=angularData.value;}let textContent=storedData.value||"";const maxLen=storage.getValue(id,{charLimit:this.data.maxLen}).charLimit;if(maxLen&&textContent.length>maxLen){textContent=textContent.slice(0,maxLen);}let fieldFormattedValues=storedData.formattedValue||this.data.textContent?.join("\n")||null;if(fieldFormattedValues&&this.data.comb){fieldFormattedValues=fieldFormattedValues.replaceAll(/\s+/g,"");}const elementData={userValue:textContent,formattedValue:fieldFormattedValues,lastCommittedValue:null,commitKey:1,focused:false};if(this.data.multiLine){element=document.createElement("textarea");element.textContent=fieldFormattedValues??textContent;if(this.data.doNotScroll){element.style.overflowY="hidden";}}else{element=document.createElement("input");element.type="text";element.setAttribute("value",fieldFormattedValues??textContent);if(this.data.doNotScroll){element.style.overflowX="hidden";}}if(this.data.hasOwnCanvas){element.hidden=true;}GetElementsByNameSet.add(element);element.setAttribute("data-element-id",id);element.disabled=this.data.readOnly;element.name=this.data.fieldName;element.tabIndex=DEFAULT_TAB_INDEX;this._setRequired(element,this.data.required);if(maxLen){element.maxLength=maxLen;}element.addEventListener("input",event=>{storage.setValue(id,{value:event.target.value});window.updateAngularFormValue(id,{value:event.target.value});this.setPropertyOnSiblings(element,"value",event.target.value,"value");elementData.formattedValue=null;});element.addEventListener("resetform",event=>{const defaultValue=this.data.defaultFieldValue??"";element.value=elementData.userValue=defaultValue;elementData.formattedValue=null;});let blurListener=event=>{const{formattedValue}=elementData;if(formattedValue!==null&&formattedValue!==undefined){event.target.value=formattedValue;}event.target.scrollLeft=0;};window.registerAcroformField(id,element,storedData.value,undefined,this.data.fieldValue);element.addEventListener("updateFromAngular",newvalue=>storage.setValue(id,{value:newvalue.detail}));if(this.enableScripting&&this.hasJSActions){element.addEventListener("focus",event=>{if(elementData.focused){return;}const{target}=event;if(elementData.userValue){target.value=elementData.userValue;}elementData.lastCommittedValue=target.value;elementData.commitKey=1;if(!this.data.actions?.Focus){elementData.focused=true;}});element.addEventListener("updatefromsandbox",jsEvent=>{this.showElementAndHideCanvas(jsEvent.target);const actions={value(event){elementData.userValue=event.detail.value??"";storage.setValue(id,{value:elementData.userValue.toString()});window.updateAngularFormValue(id,{value:elementData.userValue.toString()});event.target.value=elementData.userValue;},formattedValue(event){const{formattedValue}=event.detail;elementData.formattedValue=formattedValue;if(formattedValue!==null&&formattedValue!==undefined&&event.target!==document.activeElement){event.target.value=formattedValue;}storage.setValue(id,{formattedValue});window.updateAngularFormValue(id,{formattedValue});},selRange(event){event.target.setSelectionRange(...event.detail.selRange);},charLimit:event=>{const{charLimit}=event.detail;const{target}=event;if(charLimit===0){target.removeAttribute("maxLength");return;}target.setAttribute("maxLength",charLimit);let value=elementData.userValue;if(!value||value.length<=charLimit){return;}value=value.slice(0,charLimit);target.value=elementData.userValue=value;storage.setValue(id,{value});window.updateAngularFormValue(id,{value});this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id,name:"Keystroke",value,willCommit:true,commitKey:1,selStart:target.selectionStart,selEnd:target.selectionEnd}});}};this._dispatchEventFromSandbox(actions,jsEvent);});element.addEventListener("keydown",event=>{elementData.commitKey=1;let commitKey=-1;if(event.key==="Escape"){commitKey=0;}else if(event.key==="Enter"&&!this.data.multiLine){commitKey=2;}else if(event.key==="Tab"){elementData.commitKey=3;}if(commitKey===-1){return;}const{value}=event.target;if(elementData.lastCommittedValue===value){return;}elementData.lastCommittedValue=value;elementData.userValue=value;this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id,name:"Keystroke",value,willCommit:true,commitKey,selStart:event.target.selectionStart,selEnd:event.target.selectionEnd}});});const _blurListener=blurListener;blurListener=null;element.addEventListener("blur",event=>{if(!elementData.focused||!event.relatedTarget){return;}if(!this.data.actions?.Blur){elementData.focused=false;}const{value}=event.target;elementData.userValue=value;if(elementData.lastCommittedValue!==value){this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id,name:"Keystroke",value,willCommit:true,commitKey:elementData.commitKey,selStart:event.target.selectionStart,selEnd:event.target.selectionEnd}});}_blurListener(event);});if(this.data.actions?.Keystroke){element.addEventListener("beforeinput",event=>{elementData.lastCommittedValue=null;const{data,target}=event;const{value,selectionStart,selectionEnd}=target;let selStart=selectionStart,selEnd=selectionEnd;switch(event.inputType){case"deleteWordBackward":{const match=value.substring(0,selectionStart).match(/\w*[^\w]*$/);if(match){selStart-=match[0].length;}break;}case"deleteWordForward":{const match=value.substring(selectionStart).match(/^[^\w]*\w*/);if(match){selEnd+=match[0].length;}break;}case"deleteContentBackward":if(selectionStart===selectionEnd){selStart-=1;}break;case"deleteContentForward":if(selectionStart===selectionEnd){selEnd+=1;}break;}event.preventDefault();this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id,name:"Keystroke",value,change:data||"",willCommit:false,selStart,selEnd}});});}this._setEventListeners(element,elementData,[["focus","Focus"],["blur","Blur"],["mousedown","Mouse Down"],["mouseenter","Mouse Enter"],["mouseleave","Mouse Exit"],["mouseup","Mouse Up"]],event=>event.target.value);}if(blurListener){element.addEventListener("blur",blurListener);}if(this.data.comb){const fieldWidth=this.data.rect[2]-this.data.rect[0];const combWidth=fieldWidth/maxLen;element.classList.add("comb");element.style.letterSpacing=`calc(${combWidth}px * var(--scale-factor) - 1ch)`;}}else{element=document.createElement("div");element.textContent=this.data.fieldValue;element.style.verticalAlign="middle";element.style.display="table-cell";if(this.data.hasOwnCanvas){element.hidden=true;}}this._setTextStyle(element);this._setBackgroundColor(element);this._setDefaultPropertiesFromJS(element);this.container.append(element);return this.container;}}class SignatureWidgetAnnotationElement extends WidgetAnnotationElement{constructor(parameters){super(parameters,{isRenderable:!!parameters.data.hasOwnCanvas});}}class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement{constructor(parameters){super(parameters,{isRenderable:parameters.renderForms});}render(){const storage=this.annotationStorage;const data=this.data;const id=data.id;const angularData=window.getFormValueFromAngular(this.data.fieldName);const formValue=storage.getValue(id,{value:data.exportValue===data.fieldValue}).value;let angularValue=undefined;if(angularData.value){angularValue=angularData.value===true||angularData.value===data.exportValue;}let value=angularValue!==undefined?angularValue:formValue;let updateAngularValueNecessary=false;if(typeof value==="string"){value=value===data.exportValue;storage.setValue(id,{value});updateAngularValueNecessary=true;}else if(angularData?.value!==undefined&&angularData.value!==formValue){const isChecked=angularData.value===true||angularData.value===data.exportValue;value=isChecked?data.exportValue:undefined;storage.setValue(id,{value});}this.container.classList.add("buttonWidgetAnnotation","checkBox");const element=document.createElement("input");GetElementsByNameSet.add(element);element.setAttribute("data-element-id",id);element.disabled=data.readOnly;this._setRequired(element,this.data.required);element.type="checkbox";element.name=data.fieldName;if(value){element.setAttribute("checked",true);}element.setAttribute("exportValue",data.exportValue);element.tabIndex=DEFAULT_TAB_INDEX;element.addEventListener("change",event=>{const{name,checked}=event.target;for(const checkbox of this._getElementsByName(name,id)){const curChecked=checked&&checkbox.exportValue===data.exportValue;if(checkbox.domElement){checkbox.domElement.checked=curChecked;}storage.setValue(checkbox.id,{value:curChecked});window.updateAngularFormValue(id,{value:curChecked});}storage.setValue(id,{value:checked});window.updateAngularFormValue(id,{value:checked});});element.addEventListener("resetform",event=>{const defaultValue=data.defaultFieldValue||"Off";event.target.checked=defaultValue===data.exportValue;});window.registerAcroformField(id,element,value?data.exportValue:undefined,undefined,this.data.fieldValue);element.addEventListener("updateFromAngular",newvalue=>storage.setValue(id,{value:newvalue.detail}));if(updateAngularValueNecessary){window.updateAngularFormValue(id,{value});}if(this.enableScripting&&this.hasJSActions){element.addEventListener("updatefromsandbox",jsEvent=>{const actions={value(event){event.target.checked=event.detail.value!=="Off";storage.setValue(id,{value:event.target.checked});window.updateAngularFormValue(id,{value:event.target.value});}};this._dispatchEventFromSandbox(actions,jsEvent);});this._setEventListeners(element,null,[["change","Validate"],["change","Action"],["focus","Focus"],["blur","Blur"],["mousedown","Mouse Down"],["mouseenter","Mouse Enter"],["mouseleave","Mouse Exit"],["mouseup","Mouse Up"]],event=>event.target.checked);}this._setBackgroundColor(element);this._setDefaultPropertiesFromJS(element);this.container.append(element);return this.container;}}class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement{constructor(parameters){super(parameters,{isRenderable:parameters.renderForms});}render(){this.container.classList.add("buttonWidgetAnnotation","radioButton");const storage=this.annotationStorage;const data=this.data;const id=data.id;const angularData=window.getFormValueFromAngular(this.data.fieldName);const defaultValue=data.fieldValue===data.buttonValue?data.buttonValue:undefined;const formValue=storage.getValue(id,{value:defaultValue}).value;let value=angularData.value??formValue;if(typeof value==="string"||angularData!==formValue){value=value===data.buttonValue;storage.setValue(id,{value});}else if(value){window.updateAngularFormValue(id,{value:data.buttonValue});}if(value){for(const radio of this._getElementsByName(data.fieldName,id)){storage.setValue(radio.id,{value:false});}}const element=document.createElement("input");GetElementsByNameSet.add(element);element.setAttribute("data-element-id",id);element.disabled=data.readOnly;this._setRequired(element,this.data.required);element.type="radio";element.name=data.fieldName;if(value){element.setAttribute("checked",true);}element.tabIndex=DEFAULT_TAB_INDEX;element.addEventListener("change",event=>{const{name,checked}=event.target;for(const radio of this._getElementsByName(name,id)){storage.setValue(radio.id,{value:false});window.updateAngularFormValue(radio.id,{value:false});}storage.setValue(id,{value:checked});window.updateAngularFormValue(id,{value:checked});});element.addEventListener("resetform",event=>{const defaultValue=data.defaultFieldValue;event.target.checked=defaultValue!==null&&defaultValue!==undefined&&defaultValue===data.buttonValue;});window.registerAcroformField(id,element,value?data.buttonValue:undefined,data.buttonValue,this.data.fieldValue);element.addEventListener("updateFromAngular",newvalue=>storage.setValue(id,{value:newvalue.detail}));if(this.enableScripting&&this.hasJSActions){const pdfButtonValue=data.buttonValue;element.addEventListener("updatefromsandbox",jsEvent=>{const actions={value:event=>{const checked=pdfButtonValue===event.detail.value;for(const radio of this._getElementsByName(event.target.name)){const curChecked=checked&&radio.id===id;if(radio.domElement){radio.domElement.checked=curChecked;}storage.setValue(radio.id,{value:curChecked});window.updateAngularFormValue(id,{value:curChecked});}}};this._dispatchEventFromSandbox(actions,jsEvent);});this._setEventListeners(element,null,[["change","Validate"],["change","Action"],["focus","Focus"],["blur","Blur"],["mousedown","Mouse Down"],["mouseenter","Mouse Enter"],["mouseleave","Mouse Exit"],["mouseup","Mouse Up"]],event=>event.target.checked);}this._setBackgroundColor(element);this._setDefaultPropertiesFromJS(element);this.container.append(element);return this.container;}}class PushButtonWidgetAnnotationElement extends LinkAnnotationElement{constructor(parameters){super(parameters,{ignoreBorder:parameters.data.hasAppearance});}render(){const container=super.render();container.classList.add("buttonWidgetAnnotation","pushButton");const linkElement=container.lastChild;if(this.enableScripting&&this.hasJSActions&&linkElement){this._setDefaultPropertiesFromJS(linkElement);linkElement.addEventListener("updatefromsandbox",jsEvent=>{this._dispatchEventFromSandbox({},jsEvent);});}return container;}}class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement{constructor(parameters){super(parameters,{isRenderable:parameters.renderForms});}render(){this.container.classList.add("choiceWidgetAnnotation");const storage=this.annotationStorage;const id=this.data.id;const angularData=window.getFormValueFromAngular(this.data.fieldName);const formData=storage.getValue(id,{value:this.data.fieldValue});const storedData=angularData.value?angularData:formData;if(angularData!==formData){storage.setValue(id,{value:angularData.value});}const selectElement=document.createElement("select");GetElementsByNameSet.add(selectElement);selectElement.setAttribute("data-element-id",id);selectElement.disabled=this.data.readOnly;this._setRequired(selectElement,this.data.required);selectElement.name=this.data.fieldName;selectElement.tabIndex=DEFAULT_TAB_INDEX;let addAnEmptyEntry=this.data.combo&&this.data.options.length>0;if(!this.data.combo){selectElement.size=this.data.options.length;if(this.data.multiSelect){selectElement.multiple=true;}}selectElement.addEventListener("resetform",event=>{const defaultValue=this.data.defaultFieldValue;for(const option of selectElement.options){option.selected=option.value===defaultValue;}});for(const option of this.data.options){const optionElement=document.createElement("option");optionElement.textContent=option.displayValue;optionElement.value=option.exportValue;if(storedData.value.includes(option.exportValue)){optionElement.setAttribute("selected",true);addAnEmptyEntry=false;}selectElement.append(optionElement);}let removeEmptyEntry=null;if(addAnEmptyEntry){const noneOptionElement=document.createElement("option");noneOptionElement.value=" ";noneOptionElement.setAttribute("hidden",true);noneOptionElement.setAttribute("selected",true);selectElement.prepend(noneOptionElement);removeEmptyEntry=()=>{noneOptionElement.remove();selectElement.removeEventListener("input",removeEmptyEntry);removeEmptyEntry=null;};selectElement.addEventListener("input",removeEmptyEntry);}const getValue=isExport=>{const name=isExport?"value":"textContent";const{options,multiple}=selectElement;if(!multiple){return options.selectedIndex===-1?null:options[options.selectedIndex][name];}return Array.prototype.filter.call(options,option=>option.selected).map(option=>option[name]);};let selectedValues=getValue(false);const getItems=event=>{const options=event.target.options;return Array.prototype.map.call(options,option=>({displayValue:option.textContent,exportValue:option.value}));};window.registerAcroformField(id,selectElement,selectedValues,undefined,this.data.fieldValue);selectElement.addEventListener("updateFromAngular",newvalue=>storage.setValue(id,{value:newvalue.detail}));if(this.enableScripting&&this.hasJSActions){selectElement.addEventListener("updatefromsandbox",jsEvent=>{const actions={value(event){removeEmptyEntry?.();const value=event.detail.value;const values=new Set(Array.isArray(value)?value:[value]);for(const option of selectElement.options){option.selected=values.has(option.value);}storage.setValue(id,{value:getValue(true)});selectedValues=getValue(false);window.updateAngularFormValue(id,{value:selectedValues});},multipleSelection(event){selectElement.multiple=true;},remove(event){const options=selectElement.options;const index=event.detail.remove;options[index].selected=false;selectElement.remove(index);if(options.length>0){const i=Array.prototype.findIndex.call(options,option=>option.selected);if(i===-1){options[0].selected=true;}}storage.setValue(id,{value:getValue(true),items:getItems(event)});selectedValues=getValue(false);},clear(event){while(selectElement.length!==0){selectElement.remove(0);}storage.setValue(id,{value:null,items:[]});selectedValues=getValue(false);window.updateAngularFormValue(id,{value:selectedValues});},insert(event){const{index,displayValue,exportValue}=event.detail.insert;const selectChild=selectElement.children[index];const optionElement=document.createElement("option");optionElement.textContent=displayValue;optionElement.value=exportValue;if(selectChild){selectChild.before(optionElement);}else{selectElement.append(optionElement);}storage.setValue(id,{value:getValue(true),items:getItems(event)});selectedValues=getValue(false);window.updateAngularFormValue(id,{value:selectedValues});},items(event){const{items}=event.detail;while(selectElement.length!==0){selectElement.remove(0);}for(const item of items){const{displayValue,exportValue}=item;const optionElement=document.createElement("option");optionElement.textContent=displayValue;optionElement.value=exportValue;selectElement.append(optionElement);}if(selectElement.options.length>0){selectElement.options[0].selected=true;}storage.setValue(id,{value:getValue(true),items:getItems(event)});selectedValues=getValue(false);window.updateAngularFormValue(id,{value:selectedValues});},indices(event){const indices=new Set(event.detail.indices);for(const option of event.target.options){option.selected=indices.has(option.index);}storage.setValue(id,{value:getValue(true)});selectedValues=getValue(false);window.updateAngularFormValue(id,{value:selectedValues});},editable(event){event.target.disabled=!event.detail.editable;}};this._dispatchEventFromSandbox(actions,jsEvent);});selectElement.addEventListener("input",event=>{const exportValue=getValue(true);const change=getValue(false);storage.setValue(id,{value:exportValue});window.updateAngularFormValue(id,{value:exportValue});event.preventDefault();this.linkService.eventBus?.dispatch("dispatcheventinsandbox",{source:this,detail:{id,name:"Keystroke",value:selectedValues,change,changeEx:exportValue,willCommit:false,commitKey:1,keyDown:false}});});this._setEventListeners(selectElement,null,[["focus","Focus"],["blur","Blur"],["mousedown","Mouse Down"],["mouseenter","Mouse Enter"],["mouseleave","Mouse Exit"],["mouseup","Mouse Up"],["input","Action"],["input","Validate"]],event=>event.target.value);}else{selectElement.addEventListener("input",function(event){storage.setValue(id,{value:getValue(true)});window.updateAngularFormValue(id,{value:getValue(true)});});}if(this.data.combo){this._setTextStyle(selectElement);}else{}this._setBackgroundColor(selectElement);this._setDefaultPropertiesFromJS(selectElement);this.container.append(selectElement);return this.container;}}class PopupAnnotationElement extends AnnotationElement{constructor(parameters){const{data,elements}=parameters;super(parameters,{isRenderable:AnnotationElement._hasPopupData(data)});this.elements=elements;this.popup=null;}render(){this.container.classList.add("popupAnnotation");const popup=this.popup=new PopupElement({container:this.container,color:this.data.color,titleObj:this.data.titleObj,modificationDate:this.data.modificationDate,contentsObj:this.data.contentsObj,richText:this.data.richText,rect:this.data.rect,parentRect:this.data.parentRect||null,parent:this.parent,elements:this.elements,open:this.data.open});const elementIds=[];for(const element of this.elements){element.popup=popup;elementIds.push(element.data.id);element.addHighlightArea();}this.container.setAttribute("aria-controls",elementIds.map(id=>`${AnnotationPrefix}${id}`).join(","));return this.container;}}var _boundKeyDown=/*#__PURE__*/new WeakMap();var _boundHide=/*#__PURE__*/new WeakMap();var _boundShow=/*#__PURE__*/new WeakMap();var _boundToggle=/*#__PURE__*/new WeakMap();var _color=/*#__PURE__*/new WeakMap();var annotation_layer_container=/*#__PURE__*/new WeakMap();var _contentsObj=/*#__PURE__*/new WeakMap();var _dateObj=/*#__PURE__*/new WeakMap();var _elements=/*#__PURE__*/new WeakMap();var _parent=/*#__PURE__*/new WeakMap();var _parentRect=/*#__PURE__*/new WeakMap();var _pinned=/*#__PURE__*/new WeakMap();var _popup=/*#__PURE__*/new WeakMap();var annotation_layer_position=/*#__PURE__*/new WeakMap();var _rect=/*#__PURE__*/new WeakMap();var _richText=/*#__PURE__*/new WeakMap();var _titleObj=/*#__PURE__*/new WeakMap();var _updates2=/*#__PURE__*/new WeakMap();var _wasVisible=/*#__PURE__*/new WeakMap();var _PopupElement_brand=/*#__PURE__*/new WeakSet();class PopupElement{constructor(_ref2){let{container,color,elements,titleObj,modificationDate,contentsObj:_contentsObj2,richText:_richText2,parent,rect:_rect2,parentRect,open}=_ref2;annotation_layer_classPrivateMethodInitSpec(this,_PopupElement_brand);annotation_layer_classPrivateFieldInitSpec(this,_boundKeyDown,annotation_layer_assertClassBrand(_PopupElement_brand,this,_keyDown).bind(this));annotation_layer_classPrivateFieldInitSpec(this,_boundHide,annotation_layer_assertClassBrand(_PopupElement_brand,this,_hide).bind(this));annotation_layer_classPrivateFieldInitSpec(this,_boundShow,annotation_layer_assertClassBrand(_PopupElement_brand,this,_show).bind(this));annotation_layer_classPrivateFieldInitSpec(this,_boundToggle,annotation_layer_assertClassBrand(_PopupElement_brand,this,_toggle).bind(this));annotation_layer_classPrivateFieldInitSpec(this,_color,null);annotation_layer_classPrivateFieldInitSpec(this,annotation_layer_container,null);annotation_layer_classPrivateFieldInitSpec(this,_contentsObj,null);annotation_layer_classPrivateFieldInitSpec(this,_dateObj,null);annotation_layer_classPrivateFieldInitSpec(this,_elements,null);annotation_layer_classPrivateFieldInitSpec(this,_parent,null);annotation_layer_classPrivateFieldInitSpec(this,_parentRect,null);annotation_layer_classPrivateFieldInitSpec(this,_pinned,false);annotation_layer_classPrivateFieldInitSpec(this,_popup,null);annotation_layer_classPrivateFieldInitSpec(this,annotation_layer_position,null);annotation_layer_classPrivateFieldInitSpec(this,_rect,null);annotation_layer_classPrivateFieldInitSpec(this,_richText,null);annotation_layer_classPrivateFieldInitSpec(this,_titleObj,null);annotation_layer_classPrivateFieldInitSpec(this,_updates2,null);annotation_layer_classPrivateFieldInitSpec(this,_wasVisible,false);annotation_layer_classPrivateFieldSet(annotation_layer_container,this,container);annotation_layer_classPrivateFieldSet(_titleObj,this,titleObj);annotation_layer_classPrivateFieldSet(_contentsObj,this,_contentsObj2);annotation_layer_classPrivateFieldSet(_richText,this,_richText2);annotation_layer_classPrivateFieldSet(_parent,this,parent);annotation_layer_classPrivateFieldSet(_color,this,color);annotation_layer_classPrivateFieldSet(_rect,this,_rect2);annotation_layer_classPrivateFieldSet(_parentRect,this,parentRect);annotation_layer_classPrivateFieldSet(_elements,this,elements);annotation_layer_classPrivateFieldSet(_dateObj,this,PDFDateString.toDateObject(modificationDate));this.trigger=elements.flatMap(e=>e.getElementsToTriggerPopup());for(const element of this.trigger){element.addEventListener("click",annotation_layer_classPrivateFieldGet(_boundToggle,this));element.addEventListener("mouseenter",annotation_layer_classPrivateFieldGet(_boundShow,this));element.addEventListener("mouseleave",annotation_layer_classPrivateFieldGet(_boundHide,this));element.classList.add("popupTriggerArea");}for(const element of elements){element.container?.addEventListener("keydown",annotation_layer_classPrivateFieldGet(_boundKeyDown,this));}annotation_layer_classPrivateFieldGet(annotation_layer_container,this).hidden=true;if(open){annotation_layer_assertClassBrand(_PopupElement_brand,this,_toggle).call(this);}}render(){if(annotation_layer_classPrivateFieldGet(_popup,this)){return;}const popup=annotation_layer_classPrivateFieldSet(_popup,this,document.createElement("div"));popup.className="popup";if(annotation_layer_classPrivateFieldGet(_color,this)){const baseColor=popup.style.outlineColor=Util.makeHexColor(...annotation_layer_classPrivateFieldGet(_color,this));if(CSS.supports("background-color","color-mix(in srgb, red 30%, white)")){popup.style.backgroundColor=`color-mix(in srgb, ${baseColor} 30%, white)`;}else{const BACKGROUND_ENLIGHT=0.7;popup.style.backgroundColor=Util.makeHexColor(...annotation_layer_classPrivateFieldGet(_color,this).map(c=>Math.floor(BACKGROUND_ENLIGHT*(255-c)+c)));}}const header=document.createElement("span");header.className="header";const title=document.createElement("h1");header.append(title);({dir:title.dir,str:title.textContent}=annotation_layer_classPrivateFieldGet(_titleObj,this));popup.append(header);if(annotation_layer_classPrivateFieldGet(_dateObj,this)){const modificationDate=document.createElement("span");modificationDate.classList.add("popupDate");modificationDate.setAttribute("data-l10n-id","pdfjs-annotation-date-string");modificationDate.setAttribute("data-l10n-args",JSON.stringify({date:annotation_layer_classPrivateFieldGet(_dateObj,this).toLocaleDateString(),time:annotation_layer_classPrivateFieldGet(_dateObj,this).toLocaleTimeString()}));header.append(modificationDate);}const html=annotation_layer_classPrivateGetter(_PopupElement_brand,this,_get_html);if(html){XfaLayer.render({xfaHtml:html,intent:"richText",div:popup});popup.lastChild.classList.add("richText","popupContent");}else{const contents=this._formatContents(annotation_layer_classPrivateFieldGet(_contentsObj,this));popup.append(contents);}annotation_layer_classPrivateFieldGet(annotation_layer_container,this).append(popup);}_formatContents(_ref3){let{str,dir}=_ref3;const p=document.createElement("p");p.classList.add("popupContent");p.dir=dir;const lines=str.split(/(?:\r\n?|\n)/);for(let i=0,ii=lines.length;i<ii;++i){const line=lines[i];p.append(document.createTextNode(line));if(i<ii-1){p.append(document.createElement("br"));}}return p;}updateEdited(_ref4){let{rect,popupContent}=_ref4;annotation_layer_classPrivateFieldGet(_updates2,this)||annotation_layer_classPrivateFieldSet(_updates2,this,{contentsObj:annotation_layer_classPrivateFieldGet(_contentsObj,this),richText:annotation_layer_classPrivateFieldGet(_richText,this)});if(rect){annotation_layer_classPrivateFieldSet(annotation_layer_position,this,null);}if(popupContent){annotation_layer_classPrivateFieldSet(_richText,this,annotation_layer_assertClassBrand(_PopupElement_brand,this,_makePopupContent).call(this,popupContent));annotation_layer_classPrivateFieldSet(_contentsObj,this,null);}annotation_layer_classPrivateFieldGet(_popup,this)?.remove();annotation_layer_classPrivateFieldSet(_popup,this,null);}resetEdited(){if(!annotation_layer_classPrivateFieldGet(_updates2,this)){return;}({contentsObj:_toSetter(annotation_layer_classPrivateFieldSet,[_contentsObj,this])._,richText:_toSetter(annotation_layer_classPrivateFieldSet,[_richText,this])._}=annotation_layer_classPrivateFieldGet(_updates2,this));annotation_layer_classPrivateFieldSet(_updates2,this,null);annotation_layer_classPrivateFieldGet(_popup,this)?.remove();annotation_layer_classPrivateFieldSet(_popup,this,null);annotation_layer_classPrivateFieldSet(annotation_layer_position,this,null);}forceHide(){annotation_layer_classPrivateFieldSet(_wasVisible,this,this.isVisible);if(!annotation_layer_classPrivateFieldGet(_wasVisible,this)){return;}annotation_layer_classPrivateFieldGet(annotation_layer_container,this).hidden=true;}maybeShow(){if(!annotation_layer_classPrivateFieldGet(_wasVisible,this)){return;}if(!annotation_layer_classPrivateFieldGet(_popup,this)){annotation_layer_assertClassBrand(_PopupElement_brand,this,_show).call(this);}annotation_layer_classPrivateFieldSet(_wasVisible,this,false);annotation_layer_classPrivateFieldGet(annotation_layer_container,this).hidden=false;}get isVisible(){return annotation_layer_classPrivateFieldGet(annotation_layer_container,this).hidden===false;}}function _get_html(_this){const richText=annotation_layer_classPrivateFieldGet(_richText,_this);const contentsObj=annotation_layer_classPrivateFieldGet(_contentsObj,_this);if(richText?.str&&(!contentsObj?.str||contentsObj.str===richText.str)){return annotation_layer_classPrivateFieldGet(_richText,_this).html||null;}return null;}function _get_fontSize(_this2){return annotation_layer_classPrivateGetter(_PopupElement_brand,_this2,_get_html)?.attributes?.style?.fontSize||0;}function _get_fontColor(_this3){return annotation_layer_classPrivateGetter(_PopupElement_brand,_this3,_get_html)?.attributes?.style?.color||null;}function _makePopupContent(text){const popupLines=[];const popupContent={str:text,html:{name:"div",attributes:{dir:"auto"},children:[{name:"p",children:popupLines}]}};const lineAttributes={style:{color:annotation_layer_classPrivateGetter(_PopupElement_brand,this,_get_fontColor),fontSize:annotation_layer_classPrivateGetter(_PopupElement_brand,this,_get_fontSize)?`calc(${annotation_layer_classPrivateGetter(_PopupElement_brand,this,_get_fontSize)}px * var(--scale-factor))`:""}};for(const line of text.split("\n")){popupLines.push({name:"span",value:line,attributes:lineAttributes});}return popupContent;}function _keyDown(event){if(event.altKey||event.shiftKey||event.ctrlKey||event.metaKey){return;}if(event.key==="Enter"||event.key==="Escape"&&annotation_layer_classPrivateFieldGet(_pinned,this)){annotation_layer_assertClassBrand(_PopupElement_brand,this,_toggle).call(this);}}function _setPosition(){if(annotation_layer_classPrivateFieldGet(annotation_layer_position,this)!==null){return;}const{page:{view},viewport:{rawDims:{pageWidth,pageHeight,pageX,pageY}}}=annotation_layer_classPrivateFieldGet(_parent,this);let useParentRect=!!annotation_layer_classPrivateFieldGet(_parentRect,this);let rect=useParentRect?annotation_layer_classPrivateFieldGet(_parentRect,this):annotation_layer_classPrivateFieldGet(_rect,this);for(const element of annotation_layer_classPrivateFieldGet(_elements,this)){if(!rect||Util.intersect(element.data.rect,rect)!==null){rect=element.data.rect;useParentRect=true;break;}}const normalizedRect=Util.normalizeRect([rect[0],view[3]-rect[1]+view[1],rect[2],view[3]-rect[3]+view[1]]);const HORIZONTAL_SPACE_AFTER_ANNOTATION=5;const parentWidth=useParentRect?rect[2]-rect[0]+HORIZONTAL_SPACE_AFTER_ANNOTATION:0;const popupLeft=normalizedRect[0]+parentWidth;const popupTop=normalizedRect[1];annotation_layer_classPrivateFieldSet(annotation_layer_position,this,[100*(popupLeft-pageX)/pageWidth,100*(popupTop-pageY)/pageHeight]);const{style}=annotation_layer_classPrivateFieldGet(annotation_layer_container,this);style.left=`${annotation_layer_classPrivateFieldGet(annotation_layer_position,this)[0]}%`;style.top=`${annotation_layer_classPrivateFieldGet(annotation_layer_position,this)[1]}%`;}function _toggle(){annotation_layer_classPrivateFieldSet(_pinned,this,!annotation_layer_classPrivateFieldGet(_pinned,this));if(annotation_layer_classPrivateFieldGet(_pinned,this)){annotation_layer_assertClassBrand(_PopupElement_brand,this,_show).call(this);annotation_layer_classPrivateFieldGet(annotation_layer_container,this).addEventListener("click",annotation_layer_classPrivateFieldGet(_boundToggle,this));annotation_layer_classPrivateFieldGet(annotation_layer_container,this).addEventListener("keydown",annotation_layer_classPrivateFieldGet(_boundKeyDown,this));}else{annotation_layer_assertClassBrand(_PopupElement_brand,this,_hide).call(this);annotation_layer_classPrivateFieldGet(annotation_layer_container,this).removeEventListener("click",annotation_layer_classPrivateFieldGet(_boundToggle,this));annotation_layer_classPrivateFieldGet(annotation_layer_container,this).removeEventListener("keydown",annotation_layer_classPrivateFieldGet(_boundKeyDown,this));}}function _show(){if(!annotation_layer_classPrivateFieldGet(_popup,this)){this.render();}if(!this.isVisible){annotation_layer_assertClassBrand(_PopupElement_brand,this,_setPosition).call(this);annotation_layer_classPrivateFieldGet(annotation_layer_container,this).hidden=false;annotation_layer_classPrivateFieldGet(annotation_layer_container,this).style.zIndex=parseInt(annotation_layer_classPrivateFieldGet(annotation_layer_container,this).style.zIndex)+1000;}else if(annotation_layer_classPrivateFieldGet(_pinned,this)){annotation_layer_classPrivateFieldGet(annotation_layer_container,this).classList.add("focused");}}function _hide(){annotation_layer_classPrivateFieldGet(annotation_layer_container,this).classList.remove("focused");if(annotation_layer_classPrivateFieldGet(_pinned,this)||!this.isVisible){return;}annotation_layer_classPrivateFieldGet(annotation_layer_container,this).hidden=true;annotation_layer_classPrivateFieldGet(annotation_layer_container,this).style.zIndex=parseInt(annotation_layer_classPrivateFieldGet(annotation_layer_container,this).style.zIndex)-1000;}class FreeTextAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});this.textContent=parameters.data.textContent;this.textPosition=parameters.data.textPosition;this.annotationEditorType=AnnotationEditorType.FREETEXT;}render(){this.container.classList.add("freeTextAnnotation");if(this.textContent){const content=document.createElement("div");content.classList.add("annotationTextContent");content.setAttribute("role","comment");for(const line of this.textContent){const lineSpan=document.createElement("span");lineSpan.textContent=line;content.append(lineSpan);}this.container.append(content);}if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}this._editOnDoubleClick();return this.container;}get _isEditable(){return this.data.hasOwnCanvas;}}var _line=/*#__PURE__*/new WeakMap();class LineAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});annotation_layer_classPrivateFieldInitSpec(this,_line,null);}render(){this.container.classList.add("lineAnnotation");const data=this.data;const{width,height}=getRectDims(data.rect);const svg=this.svgFactory.create(width,height,true);const line=annotation_layer_classPrivateFieldSet(_line,this,this.svgFactory.createElement("svg:line"));line.setAttribute("x1",data.rect[2]-data.lineCoordinates[0]);line.setAttribute("y1",data.rect[3]-data.lineCoordinates[1]);line.setAttribute("x2",data.rect[2]-data.lineCoordinates[2]);line.setAttribute("y2",data.rect[3]-data.lineCoordinates[3]);line.setAttribute("stroke-width",data.borderStyle.width||1);line.setAttribute("stroke","transparent");line.setAttribute("fill","transparent");svg.append(line);this.container.append(svg);if(!data.popupRef&&this.hasPopupData){this._createPopup();}return this.container;}getElementsToTriggerPopup(){return annotation_layer_classPrivateFieldGet(_line,this);}addHighlightArea(){this.container.classList.add("highlightArea");}}var _square=/*#__PURE__*/new WeakMap();class SquareAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});annotation_layer_classPrivateFieldInitSpec(this,_square,null);}render(){this.container.classList.add("squareAnnotation");const data=this.data;const{width,height}=getRectDims(data.rect);const svg=this.svgFactory.create(width,height,true);const borderWidth=data.borderStyle.width;const square=annotation_layer_classPrivateFieldSet(_square,this,this.svgFactory.createElement("svg:rect"));square.setAttribute("x",borderWidth/2);square.setAttribute("y",borderWidth/2);square.setAttribute("width",width-borderWidth);square.setAttribute("height",height-borderWidth);square.setAttribute("stroke-width",borderWidth||1);square.setAttribute("stroke","transparent");square.setAttribute("fill","transparent");svg.append(square);this.container.append(svg);if(!data.popupRef&&this.hasPopupData){this._createPopup();}return this.container;}getElementsToTriggerPopup(){return annotation_layer_classPrivateFieldGet(_square,this);}addHighlightArea(){this.container.classList.add("highlightArea");}}var _circle=/*#__PURE__*/new WeakMap();class CircleAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});annotation_layer_classPrivateFieldInitSpec(this,_circle,null);}render(){this.container.classList.add("circleAnnotation");const data=this.data;const{width,height}=getRectDims(data.rect);const svg=this.svgFactory.create(width,height,true);const borderWidth=data.borderStyle.width;const circle=annotation_layer_classPrivateFieldSet(_circle,this,this.svgFactory.createElement("svg:ellipse"));circle.setAttribute("cx",width/2);circle.setAttribute("cy",height/2);circle.setAttribute("rx",width/2-borderWidth/2);circle.setAttribute("ry",height/2-borderWidth/2);circle.setAttribute("stroke-width",borderWidth||1);circle.setAttribute("stroke","transparent");circle.setAttribute("fill","transparent");svg.append(circle);this.container.append(svg);if(!data.popupRef&&this.hasPopupData){this._createPopup();}return this.container;}getElementsToTriggerPopup(){return annotation_layer_classPrivateFieldGet(_circle,this);}addHighlightArea(){this.container.classList.add("highlightArea");}}var _polyline=/*#__PURE__*/new WeakMap();class PolylineAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});annotation_layer_classPrivateFieldInitSpec(this,_polyline,null);this.containerClassName="polylineAnnotation";this.svgElementName="svg:polyline";}render(){this.container.classList.add(this.containerClassName);const data=this.data;const{width,height}=getRectDims(data.rect);const svg=this.svgFactory.create(width,height,true);let points=[];for(const coordinate of data.vertices){const x=coordinate.x-data.rect[0];const y=data.rect[3]-coordinate.y;points.push(x+","+y);}points=points.join(" ");const polyline=annotation_layer_classPrivateFieldSet(_polyline,this,this.svgFactory.createElement(this.svgElementName));polyline.setAttribute("points",points);polyline.setAttribute("stroke-width",data.borderStyle.width||1);polyline.setAttribute("stroke","transparent");polyline.setAttribute("fill","transparent");svg.append(polyline);this.container.append(svg);if(!data.popupRef&&this.hasPopupData){this._createPopup();}return this.container;}getElementsToTriggerPopup(){return annotation_layer_classPrivateFieldGet(_polyline,this);}addHighlightArea(){this.container.classList.add("highlightArea");}}class PolygonAnnotationElement extends PolylineAnnotationElement{constructor(parameters){super(parameters);this.containerClassName="polygonAnnotation";this.svgElementName="svg:polygon";}}class CaretAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});}render(){this.container.classList.add("caretAnnotation");if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}return this.container;}}var _polylines=/*#__PURE__*/new WeakMap();class InkAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});annotation_layer_classPrivateFieldInitSpec(this,_polylines,[]);this.containerClassName="inkAnnotation";this.svgElementName="svg:polyline";this.annotationEditorType=AnnotationEditorType.INK;}render(){this.container.classList.add(this.containerClassName);const data=this.data;const{width,height}=getRectDims(data.rect);const svg=this.svgFactory.create(width,height,true);for(const inkList of data.inkLists){let points=[];for(const coordinate of inkList){const x=coordinate.x-data.rect[0];const y=data.rect[3]-coordinate.y;points.push(`${x},${y}`);}points=points.join(" ");const polyline=this.svgFactory.createElement(this.svgElementName);annotation_layer_classPrivateFieldGet(_polylines,this).push(polyline);polyline.setAttribute("points",points);polyline.setAttribute("stroke-width",data.borderStyle.width||1);polyline.setAttribute("stroke","transparent");polyline.setAttribute("fill","transparent");if(!data.popupRef&&this.hasPopupData){this._createPopup();}svg.append(polyline);}this.container.append(svg);return this.container;}getElementsToTriggerPopup(){return annotation_layer_classPrivateFieldGet(_polylines,this);}addHighlightArea(){this.container.classList.add("highlightArea");}}class HighlightAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true,createQuadrilaterals:true});}render(){if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}this.container.classList.add("highlightAnnotation");return this.container;}}class UnderlineAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true,createQuadrilaterals:true});}render(){if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}this.container.classList.add("underlineAnnotation");return this.container;}}class SquigglyAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true,createQuadrilaterals:true});}render(){if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}this.container.classList.add("squigglyAnnotation");return this.container;}}class StrikeOutAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true,createQuadrilaterals:true});}render(){if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}this.container.classList.add("strikeoutAnnotation");return this.container;}}class StampAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true,ignoreBorder:true});}render(){this.container.classList.add("stampAnnotation");if(!this.data.popupRef&&this.hasPopupData){this._createPopup();}return this.container;}}var _trigger=/*#__PURE__*/new WeakMap();var _FileAttachmentAnnotationElement_brand=/*#__PURE__*/new WeakSet();class FileAttachmentAnnotationElement extends AnnotationElement{constructor(parameters){super(parameters,{isRenderable:true});annotation_layer_classPrivateMethodInitSpec(this,_FileAttachmentAnnotationElement_brand);annotation_layer_classPrivateFieldInitSpec(this,_trigger,null);const{file}=this.data;this.filename=file.filename;this.content=file.content;this.linkService.eventBus?.dispatch("fileattachmentannotation",{source:this,...file});}render(){this.container.classList.add("fileAttachmentAnnotation");const{container,data}=this;let trigger;if(data.hasAppearance||data.fillAlpha===0){trigger=document.createElement("div");}else{trigger=document.createElement("img");trigger.src=`${this.imageResourcesPath}annotation-${/paperclip/i.test(data.name)?"paperclip":"pushpin"}.svg`;if(data.fillAlpha&&data.fillAlpha<1){trigger.style=`filter: opacity(${Math.round(data.fillAlpha*100)}%);`;}}trigger.addEventListener("dblclick",annotation_layer_assertClassBrand(_FileAttachmentAnnotationElement_brand,this,_download).bind(this));annotation_layer_classPrivateFieldSet(_trigger,this,trigger);const{isMac}=util_FeatureTest.platform;container.addEventListener("keydown",evt=>{if(evt.key==="Enter"&&(isMac?evt.metaKey:evt.ctrlKey)){annotation_layer_assertClassBrand(_FileAttachmentAnnotationElement_brand,this,_download).call(this);}});if(!data.popupRef&&this.hasPopupData){this._createPopup();}else{trigger.classList.add("popupTriggerArea");}container.append(trigger);return container;}getElementsToTriggerPopup(){return annotation_layer_classPrivateFieldGet(_trigger,this);}addHighlightArea(){this.container.classList.add("highlightArea");}}function _download(){this.downloadManager?.openOrDownloadData(this.content,this.filename);}var _accessibilityManager=/*#__PURE__*/new WeakMap();var _annotationCanvasMap=/*#__PURE__*/new WeakMap();var _editableAnnotations=/*#__PURE__*/new WeakMap();var _AnnotationLayer_brand=/*#__PURE__*/new WeakSet();class AnnotationLayer{constructor(_ref5){let{div,accessibilityManager,annotationCanvasMap,annotationEditorUIManager,page,viewport}=_ref5;annotation_layer_classPrivateMethodInitSpec(this,_AnnotationLayer_brand);annotation_layer_classPrivateFieldInitSpec(this,_accessibilityManager,null);annotation_layer_classPrivateFieldInitSpec(this,_annotationCanvasMap,null);annotation_layer_classPrivateFieldInitSpec(this,_editableAnnotations,new Map());this.div=div;annotation_layer_classPrivateFieldSet(_accessibilityManager,this,accessibilityManager);annotation_layer_classPrivateFieldSet(_annotationCanvasMap,this,annotationCanvasMap);this.page=page;this.viewport=viewport;this.zIndex=0;this._annotationEditorUIManager=annotationEditorUIManager;}async render(params){const{annotations}=params;const layer=this.div;setLayerDimensions(layer,this.viewport);const popupToElements=new Map();const elementParams={data:null,layer,linkService:params.linkService,downloadManager:params.downloadManager,imageResourcesPath:params.imageResourcesPath||"",renderForms:params.renderForms!==false,svgFactory:new DOMSVGFactory(),annotationStorage:params.annotationStorage||new AnnotationStorage(),enableScripting:params.enableScripting===true,hasJSActions:params.hasJSActions,fieldObjects:params.fieldObjects,parent:this,elements:null};for(const data of annotations){if(data.noHTML){continue;}const isPopupAnnotation=data.annotationType===AnnotationType.POPUP;if(!isPopupAnnotation){const{width,height}=getRectDims(data.rect);if(width<=0||height<=0){continue;}}else{const elements=popupToElements.get(data.id);if(!elements){continue;}elementParams.elements=elements;}elementParams.data=data;const element=AnnotationElementFactory.create(elementParams);if(!element.isRenderable){continue;}if(!isPopupAnnotation&&data.popupRef){const elements=popupToElements.get(data.popupRef);if(!elements){popupToElements.set(data.popupRef,[element]);}else{elements.push(element);}}const rendered=element.render();if(data.hidden){rendered.style.visibility="hidden";}annotation_layer_assertClassBrand(_AnnotationLayer_brand,this,_appendElement).call(this,rendered,data.id);if(element.annotationEditorType>0){annotation_layer_classPrivateFieldGet(_editableAnnotations,this).set(element.data.id,element);this._annotationEditorUIManager?.renderAnnotationElement(element);}}annotation_layer_assertClassBrand(_AnnotationLayer_brand,this,_setAnnotationCanvasMap).call(this);}update(_ref6){let{viewport}=_ref6;const layer=this.div;this.viewport=viewport;setLayerDimensions(layer,{rotation:viewport.rotation});annotation_layer_assertClassBrand(_AnnotationLayer_brand,this,_setAnnotationCanvasMap).call(this);layer.hidden=false;}getEditableAnnotations(){return Array.from(annotation_layer_classPrivateFieldGet(_editableAnnotations,this).values());}getEditableAnnotation(id){return annotation_layer_classPrivateFieldGet(_editableAnnotations,this).get(id);}}function _appendElement(element,id){const contentElement=element.firstChild||element;contentElement.id=`${AnnotationPrefix}${id}`;this.div.append(element);annotation_layer_classPrivateFieldGet(_accessibilityManager,this)?.moveElementInDOM(this.div,element,contentElement,false);}function _setAnnotationCanvasMap(){if(!annotation_layer_classPrivateFieldGet(_annotationCanvasMap,this)){return;}const layer=this.div;for(const[id,canvas]of annotation_layer_classPrivateFieldGet(_annotationCanvasMap,this)){const element=layer.querySelector(`[data-annotation-id="${id}"]`);if(!element){continue;}canvas.className="annotationContent";const{firstChild}=element;if(!firstChild){element.append(canvas);}else if(firstChild.nodeName==="CANVAS"){firstChild.replaceWith(canvas);}else if(!firstChild.classList.contains("annotationContent")){firstChild.before(canvas);}else{firstChild.after(canvas);}}annotation_layer_classPrivateFieldGet(_annotationCanvasMap,this).clear();}
;// CONCATENATED MODULE: ./src/display/editor/freetext.js
var _FreeTextEditor;function freetext_classPrivateMethodInitSpec(e,a){freetext_checkPrivateRedeclaration(e,a),a.add(e);}function freetext_defineProperty(e,r,t){return(r=freetext_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function freetext_toPropertyKey(t){var i=freetext_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function freetext_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function freetext_classPrivateFieldInitSpec(e,t,a){freetext_checkPrivateRedeclaration(e,t),t.set(e,a);}function freetext_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function freetext_classPrivateFieldGet(s,a){return s.get(freetext_assertClassBrand(s,a));}function freetext_classPrivateFieldSet(s,a,r){return s.set(freetext_assertClassBrand(s,a),r),r;}function freetext_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const EOL_PATTERN=/\r\n?|\n/g;var _boundEditorDivBlur=/*#__PURE__*/new WeakMap();var _boundEditorDivFocus=/*#__PURE__*/new WeakMap();var _boundEditorDivInput=/*#__PURE__*/new WeakMap();var _boundEditorDivKeydown=/*#__PURE__*/new WeakMap();var _boundEditorDivPaste=/*#__PURE__*/new WeakMap();var freetext_color=/*#__PURE__*/new WeakMap();var _content=/*#__PURE__*/new WeakMap();var _editorDivId=/*#__PURE__*/new WeakMap();var _fontSize=/*#__PURE__*/new WeakMap();var _initialData=/*#__PURE__*/new WeakMap();var _FreeTextEditor_brand=/*#__PURE__*/new WeakSet();class FreeTextEditor extends AnnotationEditor{static get _keyboardManager(){const proto=FreeTextEditor.prototype;const arrowChecker=self=>self.isEmpty();const small=AnnotationEditorUIManager.TRANSLATE_SMALL;const big=AnnotationEditorUIManager.TRANSLATE_BIG;return shadow(this,"_keyboardManager",new KeyboardManager([[["ctrl+s","mac+meta+s","ctrl+p","mac+meta+p"],proto.commitOrRemove,{bubbles:true}],[["ctrl+Enter","mac+meta+Enter","Escape","mac+Escape"],proto.commitOrRemove],[["ArrowLeft","mac+ArrowLeft"],proto._translateEmpty,{args:[-small,0],checker:arrowChecker}],[["ctrl+ArrowLeft","mac+shift+ArrowLeft"],proto._translateEmpty,{args:[-big,0],checker:arrowChecker}],[["ArrowRight","mac+ArrowRight"],proto._translateEmpty,{args:[small,0],checker:arrowChecker}],[["ctrl+ArrowRight","mac+shift+ArrowRight"],proto._translateEmpty,{args:[big,0],checker:arrowChecker}],[["ArrowUp","mac+ArrowUp"],proto._translateEmpty,{args:[0,-small],checker:arrowChecker}],[["ctrl+ArrowUp","mac+shift+ArrowUp"],proto._translateEmpty,{args:[0,-big],checker:arrowChecker}],[["ArrowDown","mac+ArrowDown"],proto._translateEmpty,{args:[0,small],checker:arrowChecker}],[["ctrl+ArrowDown","mac+shift+ArrowDown"],proto._translateEmpty,{args:[0,big],checker:arrowChecker}]]));}constructor(params){super({...params,name:"freeTextEditor"});freetext_classPrivateMethodInitSpec(this,_FreeTextEditor_brand);freetext_classPrivateFieldInitSpec(this,_boundEditorDivBlur,this.editorDivBlur.bind(this));freetext_classPrivateFieldInitSpec(this,_boundEditorDivFocus,this.editorDivFocus.bind(this));freetext_classPrivateFieldInitSpec(this,_boundEditorDivInput,this.editorDivInput.bind(this));freetext_classPrivateFieldInitSpec(this,_boundEditorDivKeydown,this.editorDivKeydown.bind(this));freetext_classPrivateFieldInitSpec(this,_boundEditorDivPaste,this.editorDivPaste.bind(this));freetext_classPrivateFieldInitSpec(this,freetext_color,void 0);freetext_classPrivateFieldInitSpec(this,_content,"");freetext_classPrivateFieldInitSpec(this,_editorDivId,`${this.id}-editor`);freetext_classPrivateFieldInitSpec(this,_fontSize,void 0);freetext_classPrivateFieldInitSpec(this,_initialData,null);freetext_classPrivateFieldSet(freetext_color,this,params.color||FreeTextEditor._defaultColor||AnnotationEditor._defaultLineColor);freetext_classPrivateFieldSet(_fontSize,this,params.fontSize||FreeTextEditor._defaultFontSize);}static initialize(l10n,uiManager){AnnotationEditor.initialize(l10n,uiManager,{strings:["pdfjs-free-text-default-content"]});const style=getComputedStyle(document.documentElement);this._internalPadding=parseFloat(style.getPropertyValue("--freetext-padding"));}static updateDefaultParams(type,value){switch(type){case AnnotationEditorParamsType.FREETEXT_SIZE:FreeTextEditor._defaultFontSize=value;break;case AnnotationEditorParamsType.FREETEXT_COLOR:FreeTextEditor._defaultColor=value;break;}}updateParams(type,value){switch(type){case AnnotationEditorParamsType.FREETEXT_SIZE:freetext_assertClassBrand(_FreeTextEditor_brand,this,_updateFontSize).call(this,value);break;case AnnotationEditorParamsType.FREETEXT_COLOR:freetext_assertClassBrand(_FreeTextEditor_brand,this,_updateColor).call(this,value);break;}}static get defaultPropertiesToUpdate(){return[[AnnotationEditorParamsType.FREETEXT_SIZE,FreeTextEditor._defaultFontSize],[AnnotationEditorParamsType.FREETEXT_COLOR,FreeTextEditor._defaultColor||AnnotationEditor._defaultLineColor]];}get propertiesToUpdate(){return[[AnnotationEditorParamsType.FREETEXT_SIZE,freetext_classPrivateFieldGet(_fontSize,this)],[AnnotationEditorParamsType.FREETEXT_COLOR,freetext_classPrivateFieldGet(freetext_color,this)]];}_translateEmpty(x,y){this._uiManager.translateSelectedEditors(x,y,true);}getInitialTranslation(){const scale=this.parentScale;return[-FreeTextEditor._internalPadding*scale,-(FreeTextEditor._internalPadding+freetext_classPrivateFieldGet(_fontSize,this))*scale];}rebuild(){if(!this.parent){return;}super.rebuild();if(this.div===null){return;}if(!this.isAttachedToDOM){this.parent.add(this);}}enableEditMode(){if(this.isInEditMode()){return;}this.parent.setEditingState(false);this.parent.updateToolbar(AnnotationEditorType.FREETEXT);super.enableEditMode();this.overlayDiv.classList.remove("enabled");this.editorDiv.contentEditable=true;this._isDraggable=false;this.div.removeAttribute("aria-activedescendant");this.editorDiv.addEventListener("keydown",freetext_classPrivateFieldGet(_boundEditorDivKeydown,this));this.editorDiv.addEventListener("focus",freetext_classPrivateFieldGet(_boundEditorDivFocus,this));this.editorDiv.addEventListener("blur",freetext_classPrivateFieldGet(_boundEditorDivBlur,this));this.editorDiv.addEventListener("input",freetext_classPrivateFieldGet(_boundEditorDivInput,this));this.editorDiv.addEventListener("paste",freetext_classPrivateFieldGet(_boundEditorDivPaste,this));}disableEditMode(){if(!this.isInEditMode()){return;}this.parent.setEditingState(true);super.disableEditMode();this.overlayDiv.classList.add("enabled");this.editorDiv.contentEditable=false;this.div.setAttribute("aria-activedescendant",freetext_classPrivateFieldGet(_editorDivId,this));this._isDraggable=true;this.editorDiv.removeEventListener("keydown",freetext_classPrivateFieldGet(_boundEditorDivKeydown,this));this.editorDiv.removeEventListener("focus",freetext_classPrivateFieldGet(_boundEditorDivFocus,this));this.editorDiv.removeEventListener("blur",freetext_classPrivateFieldGet(_boundEditorDivBlur,this));this.editorDiv.removeEventListener("input",freetext_classPrivateFieldGet(_boundEditorDivInput,this));this.editorDiv.removeEventListener("paste",freetext_classPrivateFieldGet(_boundEditorDivPaste,this));this.div.focus({preventScroll:true});this.isEditing=false;this.parent.div.classList.add("freetextEditing");}focusin(event){if(!this._focusEventsAllowed){return;}super.focusin(event);if(event.target!==this.editorDiv){this.editorDiv.focus();}}onceAdded(){if(this.width){return;}this.enableEditMode();this.editorDiv.focus();if(this._initialOptions?.isCentered){this.center();}this._initialOptions=null;}isEmpty(){return!this.editorDiv||this.editorDiv.innerText.trim()==="";}remove(){this.isEditing=false;if(this.parent){this.parent.setEditingState(true);this.parent.div.classList.add("freetextEditing");}super.remove();}commit(){if(!this.isInEditMode()){return;}super.commit();this.disableEditMode();const savedText=freetext_classPrivateFieldGet(_content,this);const newText=freetext_classPrivateFieldSet(_content,this,freetext_assertClassBrand(_FreeTextEditor_brand,this,_extractText).call(this).trimEnd());if(savedText===newText){return;}const setText=text=>{freetext_classPrivateFieldSet(_content,this,text);if(!text){this.remove();return;}freetext_assertClassBrand(_FreeTextEditor_brand,this,_setContent).call(this);this._uiManager.rebuild(this);freetext_assertClassBrand(_FreeTextEditor_brand,this,_setEditorDimensions).call(this);};this.addCommands({cmd:()=>{setText(newText);},undo:()=>{setText(savedText);},mustExec:false});freetext_assertClassBrand(_FreeTextEditor_brand,this,_setEditorDimensions).call(this);this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"commit",page:this.pageIndex+1,value:newText,previousValue:savedText});}shouldGetKeyboardEvents(){return this.isInEditMode();}enterInEditMode(){this.enableEditMode();this.editorDiv.focus();}dblclick(event){this.enterInEditMode();}keydown(event){if(event.target===this.div&&event.key==="Enter"){this.enterInEditMode();event.preventDefault();}}editorDivKeydown(event){FreeTextEditor._keyboardManager.exec(this,event);}editorDivFocus(event){this.isEditing=true;}editorDivBlur(event){this.isEditing=false;}editorDivInput(event){this.parent.div.classList.toggle("freetextEditing",this.isEmpty());}disableEditing(){this.editorDiv.setAttribute("role","comment");this.editorDiv.removeAttribute("aria-multiline");}enableEditing(){this.editorDiv.setAttribute("role","textbox");this.editorDiv.setAttribute("aria-multiline",true);}render(){if(this.div){return this.div;}let baseX,baseY;if(this.width){baseX=this.x;baseY=this.y;}super.render();this.editorDiv=document.createElement("div");this.editorDiv.className="internal";this.editorDiv.setAttribute("id",freetext_classPrivateFieldGet(_editorDivId,this));this.editorDiv.setAttribute("data-l10n-id","pdfjs-free-text");this.enableEditing();AnnotationEditor._l10nPromise.get("pdfjs-free-text-default-content").then(msg=>this.editorDiv?.setAttribute("default-content",msg));this.editorDiv.contentEditable=true;const{style}=this.editorDiv;style.fontSize=`calc(${freetext_classPrivateFieldGet(_fontSize,this)}px * var(--scale-factor))`;style.color=freetext_classPrivateFieldGet(freetext_color,this);this.div.append(this.editorDiv);this.overlayDiv=document.createElement("div");this.overlayDiv.classList.add("overlay","enabled");this.div.append(this.overlayDiv);bindEvents(this,this.div,["dblclick","keydown"]);if(this.width){const[parentWidth,parentHeight]=this.parentDimensions;if(this.annotationElementId){const{position}=freetext_classPrivateFieldGet(_initialData,this);let[tx,ty]=this.getInitialTranslation();[tx,ty]=this.pageTranslationToScreen(tx,ty);const[pageWidth,pageHeight]=this.pageDimensions;const[pageX,pageY]=this.pageTranslation;let posX,posY;switch(this.rotation){case 0:posX=baseX+(position[0]-pageX)/pageWidth;posY=baseY+this.height-(position[1]-pageY)/pageHeight;break;case 90:posX=baseX+(position[0]-pageX)/pageWidth;posY=baseY-(position[1]-pageY)/pageHeight;[tx,ty]=[ty,-tx];break;case 180:posX=baseX-this.width+(position[0]-pageX)/pageWidth;posY=baseY-(position[1]-pageY)/pageHeight;[tx,ty]=[-tx,-ty];break;case 270:posX=baseX+(position[0]-pageX-this.height*pageHeight)/pageWidth;posY=baseY+(position[1]-pageY-this.width*pageWidth)/pageHeight;[tx,ty]=[-ty,tx];break;}this.setAt(posX*parentWidth,posY*parentHeight,tx,ty);}else{this.setAt(baseX*parentWidth,baseY*parentHeight,this.width*parentWidth,this.height*parentHeight);}freetext_assertClassBrand(_FreeTextEditor_brand,this,_setContent).call(this);this._isDraggable=true;this.editorDiv.contentEditable=false;}else{this._isDraggable=false;this.editorDiv.contentEditable=true;}return this.div;}editorDivPaste(event){const clipboardData=event.clipboardData||window.clipboardData;const{types}=clipboardData;if(types.length===1&&types[0]==="text/plain"){return;}event.preventDefault();const paste=_deserializeContent.call(FreeTextEditor,clipboardData.getData("text")||"").replaceAll(EOL_PATTERN,"\n");if(!paste){return;}const selection=window.getSelection();if(!selection.rangeCount){return;}this.editorDiv.normalize();selection.deleteFromDocument();const range=selection.getRangeAt(0);if(!paste.includes("\n")){range.insertNode(document.createTextNode(paste));this.editorDiv.normalize();selection.collapseToStart();return;}const{startContainer,startOffset}=range;const bufferBefore=[];const bufferAfter=[];if(startContainer.nodeType===Node.TEXT_NODE){const parent=startContainer.parentElement;bufferAfter.push(startContainer.nodeValue.slice(startOffset).replaceAll(EOL_PATTERN,""));if(parent!==this.editorDiv){let buffer=bufferBefore;for(const child of this.editorDiv.childNodes){if(child===parent){buffer=bufferAfter;continue;}buffer.push(_getNodeContent.call(FreeTextEditor,child));}}bufferBefore.push(startContainer.nodeValue.slice(0,startOffset).replaceAll(EOL_PATTERN,""));}else if(startContainer===this.editorDiv){let buffer=bufferBefore;let i=0;for(const child of this.editorDiv.childNodes){if(i++===startOffset){buffer=bufferAfter;}buffer.push(_getNodeContent.call(FreeTextEditor,child));}}freetext_classPrivateFieldSet(_content,this,`${bufferBefore.join("\n")}${paste}${bufferAfter.join("\n")}`);freetext_assertClassBrand(_FreeTextEditor_brand,this,_setContent).call(this);const newRange=new Range();let beforeLength=bufferBefore.reduce((acc,line)=>acc+line.length,0);for(const{firstChild}of this.editorDiv.childNodes){if(firstChild.nodeType===Node.TEXT_NODE){const length=firstChild.nodeValue.length;if(beforeLength<=length){newRange.setStart(firstChild,beforeLength);newRange.setEnd(firstChild,beforeLength);break;}beforeLength-=length;}}selection.removeAllRanges();selection.addRange(newRange);}get contentDiv(){return this.editorDiv;}static deserialize(data,parent,uiManager){let initialData=null;if(data instanceof FreeTextAnnotationElement){const{data:{defaultAppearanceData:{fontSize,fontColor},rect,rotation,id},textContent,textPosition,parent:{page:{pageNumber}}}=data;if(!textContent||textContent.length===0){return null;}initialData=data={annotationType:AnnotationEditorType.FREETEXT,color:Array.from(fontColor),fontSize,value:textContent.join("\n"),position:textPosition,pageIndex:pageNumber-1,rect:rect.slice(0),rotation,id,deleted:false};}const editor=super.deserialize(data,parent,uiManager);freetext_classPrivateFieldSet(_fontSize,editor,data.fontSize);freetext_classPrivateFieldSet(freetext_color,editor,Util.makeHexColor(...data.color));freetext_classPrivateFieldSet(_content,editor,_deserializeContent.call(FreeTextEditor,data.value));editor.annotationElementId=data.id||null;freetext_classPrivateFieldSet(_initialData,editor,initialData);return editor;}serialize(){let isForCopying=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(this.isEmpty()){return null;}if(this.deleted){return{pageIndex:this.pageIndex,id:this.annotationElementId,deleted:true};}const padding=FreeTextEditor._internalPadding*this.parentScale;const rect=this.getRect(padding,padding);const color=AnnotationEditor._colorManager.convert(this.isAttachedToDOM?getComputedStyle(this.editorDiv).color:freetext_classPrivateFieldGet(freetext_color,this));const serialized={annotationType:AnnotationEditorType.FREETEXT,color,fontSize:freetext_classPrivateFieldGet(_fontSize,this),value:freetext_assertClassBrand(_FreeTextEditor_brand,this,_serializeContent).call(this),pageIndex:this.pageIndex,rect,rotation:this.rotation,structTreeParentId:this._structTreeParentId};if(isForCopying){return serialized;}if(this.annotationElementId&&!freetext_assertClassBrand(_FreeTextEditor_brand,this,_hasElementChanged).call(this,serialized)){return null;}serialized.id=this.annotationElementId;return serialized;}renderAnnotationElement(annotation){const content=super.renderAnnotationElement(annotation);if(this.deleted){return content;}const{style}=content;style.fontSize=`calc(${freetext_classPrivateFieldGet(_fontSize,this)}px * var(--scale-factor))`;style.color=freetext_classPrivateFieldGet(freetext_color,this);content.replaceChildren();for(const line of freetext_classPrivateFieldGet(_content,this).split("\n")){const div=document.createElement("div");div.append(line?document.createTextNode(line):document.createElement("br"));content.append(div);}const padding=FreeTextEditor._internalPadding*this.parentScale;annotation.updateEdited({rect:this.getRect(padding,padding),popupContent:freetext_classPrivateFieldGet(_content,this)});return content;}resetAnnotationElement(annotation){super.resetAnnotationElement(annotation);annotation.resetEdited();}}_FreeTextEditor=FreeTextEditor;function _updateFontSize(fontSize){const setFontsize=size=>{this.editorDiv.style.fontSize=`calc(${size}px * var(--scale-factor))`;this.translate(0,-(size-freetext_classPrivateFieldGet(_fontSize,this))*this.parentScale);freetext_classPrivateFieldSet(_fontSize,this,size);freetext_assertClassBrand(_FreeTextEditor_brand,this,_setEditorDimensions).call(this);};const savedFontsize=freetext_classPrivateFieldGet(_fontSize,this);this.addCommands({cmd:setFontsize.bind(this,fontSize),undo:setFontsize.bind(this,savedFontsize),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.FREETEXT_SIZE,overwriteIfSameType:true,keepUndo:true});this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"fontSizeChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:fontSize,previousValue:freetext_classPrivateFieldGet(_fontSize,this)});}function _updateColor(color){const setColor=col=>{freetext_classPrivateFieldSet(freetext_color,this,this.editorDiv.style.color=col);};const savedColor=freetext_classPrivateFieldGet(freetext_color,this);this.addCommands({cmd:setColor.bind(this,color),undo:setColor.bind(this,savedColor),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.FREETEXT_COLOR,overwriteIfSameType:true,keepUndo:true});this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"colorChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:color,previousValue:freetext_classPrivateFieldGet(freetext_color,this)});}function _extractText(){const buffer=[];this.editorDiv.normalize();for(const child of this.editorDiv.childNodes){buffer.push(_getNodeContent.call(_FreeTextEditor,child));}return buffer.join("\n");}function _setEditorDimensions(){const[parentWidth,parentHeight]=this.parentDimensions;let rect;if(this.isAttachedToDOM){rect=this.div.getBoundingClientRect();}else{const{currentLayer,div}=this;const savedDisplay=div.style.display;const savedVisibility=div.classList.contains("hidden");div.classList.remove("hidden");div.style.display="hidden";currentLayer.div.append(this.div);rect=div.getBoundingClientRect();div.remove();div.style.display=savedDisplay;div.classList.toggle("hidden",savedVisibility);}if(this.rotation%180===this.parentRotation%180){this.width=rect.width/parentWidth;this.height=rect.height/parentHeight;}else{this.width=rect.height/parentWidth;this.height=rect.width/parentHeight;}this.fixAndSetPosition();}function _getNodeContent(node){return(node.nodeType===Node.TEXT_NODE?node.nodeValue:node.innerText).replaceAll(EOL_PATTERN,"");}function _setContent(){this.editorDiv.replaceChildren();if(!freetext_classPrivateFieldGet(_content,this)){return;}for(const line of freetext_classPrivateFieldGet(_content,this).split("\n")){const div=document.createElement("div");div.append(line?document.createTextNode(line):document.createElement("br"));this.editorDiv.append(div);}}function _serializeContent(){return freetext_classPrivateFieldGet(_content,this).replaceAll("\xa0"," ");}function _deserializeContent(content){return content.replaceAll(" ","\xa0");}function _hasElementChanged(serialized){const{value,fontSize,color,pageIndex}=freetext_classPrivateFieldGet(_initialData,this);return this._hasBeenMoved||serialized.value!==value||serialized.fontSize!==fontSize||serialized.color.some((c,i)=>c!==color[i])||serialized.pageIndex!==pageIndex;}freetext_defineProperty(FreeTextEditor,"_freeTextDefaultContent","");freetext_defineProperty(FreeTextEditor,"_internalPadding",0);freetext_defineProperty(FreeTextEditor,"_defaultColor",null);freetext_defineProperty(FreeTextEditor,"_defaultFontSize",10);freetext_defineProperty(FreeTextEditor,"_type","freetext");freetext_defineProperty(FreeTextEditor,"_editorType",AnnotationEditorType.FREETEXT);
;// CONCATENATED MODULE: ./src/display/editor/outliner.js
function outliner_classPrivateMethodInitSpec(e,a){outliner_checkPrivateRedeclaration(e,a),a.add(e);}function outliner_classPrivateFieldInitSpec(e,t,a){outliner_checkPrivateRedeclaration(e,t),t.set(e,a);}function outliner_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function outliner_classPrivateFieldSet(s,a,r){return s.set(outliner_assertClassBrand(s,a),r),r;}function outliner_classPrivateFieldGet(s,a){return s.get(outliner_assertClassBrand(s,a));}function outliner_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _box=/*#__PURE__*/new WeakMap();var _verticalEdges=/*#__PURE__*/new WeakMap();var _intervals=/*#__PURE__*/new WeakMap();var _Outliner_brand=/*#__PURE__*/new WeakSet();class Outliner{constructor(boxes){let borderWidth=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;let innerMargin=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;let isLTR=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;outliner_classPrivateMethodInitSpec(this,_Outliner_brand);outliner_classPrivateFieldInitSpec(this,_box,void 0);outliner_classPrivateFieldInitSpec(this,_verticalEdges,[]);outliner_classPrivateFieldInitSpec(this,_intervals,[]);let minX=Infinity;let maxX=-Infinity;let minY=Infinity;let maxY=-Infinity;const NUMBER_OF_DIGITS=4;const EPSILON=10**-NUMBER_OF_DIGITS;for(const{x,y,width,height}of boxes){const x1=Math.floor((x-borderWidth)/EPSILON)*EPSILON;const x2=Math.ceil((x+width+borderWidth)/EPSILON)*EPSILON;const y1=Math.floor((y-borderWidth)/EPSILON)*EPSILON;const y2=Math.ceil((y+height+borderWidth)/EPSILON)*EPSILON;const left=[x1,y1,y2,true];const right=[x2,y1,y2,false];outliner_classPrivateFieldGet(_verticalEdges,this).push(left,right);minX=Math.min(minX,x1);maxX=Math.max(maxX,x2);minY=Math.min(minY,y1);maxY=Math.max(maxY,y2);}const bboxWidth=maxX-minX+2*innerMargin;const bboxHeight=maxY-minY+2*innerMargin;const shiftedMinX=minX-innerMargin;const shiftedMinY=minY-innerMargin;const lastEdge=outliner_classPrivateFieldGet(_verticalEdges,this).at(isLTR?-1:-2);const lastPoint=[lastEdge[0],lastEdge[2]];for(const edge of outliner_classPrivateFieldGet(_verticalEdges,this)){const[x,y1,y2]=edge;edge[0]=(x-shiftedMinX)/bboxWidth;edge[1]=(y1-shiftedMinY)/bboxHeight;edge[2]=(y2-shiftedMinY)/bboxHeight;}outliner_classPrivateFieldSet(_box,this,{x:shiftedMinX,y:shiftedMinY,width:bboxWidth,height:bboxHeight,lastPoint});}getOutlines(){outliner_classPrivateFieldGet(_verticalEdges,this).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);const outlineVerticalEdges=[];for(const edge of outliner_classPrivateFieldGet(_verticalEdges,this)){if(edge[3]){outlineVerticalEdges.push(...outliner_assertClassBrand(_Outliner_brand,this,_breakEdge).call(this,edge));outliner_assertClassBrand(_Outliner_brand,this,_insert).call(this,edge);}else{outliner_assertClassBrand(_Outliner_brand,this,_remove).call(this,edge);outlineVerticalEdges.push(...outliner_assertClassBrand(_Outliner_brand,this,_breakEdge).call(this,edge));}}return outliner_assertClassBrand(_Outliner_brand,this,_getOutlines).call(this,outlineVerticalEdges);}}function _getOutlines(outlineVerticalEdges){const edges=[];const allEdges=new Set();for(const edge of outlineVerticalEdges){const[x,y1,y2]=edge;edges.push([x,y1,edge],[x,y2,edge]);}edges.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);for(let i=0,ii=edges.length;i<ii;i+=2){const edge1=edges[i][2];const edge2=edges[i+1][2];edge1.push(edge2);edge2.push(edge1);allEdges.add(edge1);allEdges.add(edge2);}const outlines=[];let outline;while(allEdges.size>0){const edge=allEdges.values().next().value;let[x,y1,y2,edge1,edge2]=edge;allEdges.delete(edge);let lastPointX=x;let lastPointY=y1;outline=[x,y2];outlines.push(outline);while(true){let e;if(allEdges.has(edge1)){e=edge1;}else if(allEdges.has(edge2)){e=edge2;}else{break;}allEdges.delete(e);[x,y1,y2,edge1,edge2]=e;if(lastPointX!==x){outline.push(lastPointX,lastPointY,x,lastPointY===y1?y1:y2);lastPointX=x;}lastPointY=lastPointY===y1?y2:y1;}outline.push(lastPointX,lastPointY);}return new HighlightOutline(outlines,outliner_classPrivateFieldGet(_box,this));}function _binarySearch(y){const array=outliner_classPrivateFieldGet(_intervals,this);let start=0;let end=array.length-1;while(start<=end){const middle=start+end>>1;const y1=array[middle][0];if(y1===y){return middle;}if(y1<y){start=middle+1;}else{end=middle-1;}}return end+1;}function _insert(_ref5){let[,y1,y2]=_ref5;const index=outliner_assertClassBrand(_Outliner_brand,this,_binarySearch).call(this,y1);outliner_classPrivateFieldGet(_intervals,this).splice(index,0,[y1,y2]);}function _remove(_ref6){let[,y1,y2]=_ref6;const index=outliner_assertClassBrand(_Outliner_brand,this,_binarySearch).call(this,y1);for(let i=index;i<outliner_classPrivateFieldGet(_intervals,this).length;i++){const[start,end]=outliner_classPrivateFieldGet(_intervals,this)[i];if(start!==y1){break;}if(start===y1&&end===y2){outliner_classPrivateFieldGet(_intervals,this).splice(i,1);return;}}for(let i=index-1;i>=0;i--){const[start,end]=outliner_classPrivateFieldGet(_intervals,this)[i];if(start!==y1){break;}if(start===y1&&end===y2){outliner_classPrivateFieldGet(_intervals,this).splice(i,1);return;}}}function _breakEdge(edge){const[x,y1,y2]=edge;const results=[[x,y1,y2]];const index=outliner_assertClassBrand(_Outliner_brand,this,_binarySearch).call(this,y2);for(let i=0;i<index;i++){const[start,end]=outliner_classPrivateFieldGet(_intervals,this)[i];for(let j=0,jj=results.length;j<jj;j++){const[,y3,y4]=results[j];if(end<=y3||y4<=start){continue;}if(y3>=start){if(y4>end){results[j][1]=end;}else{if(jj===1){return[];}results.splice(j,1);j--;jj--;}continue;}results[j][2]=start;if(y4>end){results.push([x,end,y4]);}}}return results;}class Outline{toSVGPath(){throw new Error("Abstract method `toSVGPath` must be implemented.");}get box(){throw new Error("Abstract getter `box` must be implemented.");}serialize(_bbox,_rotation){throw new Error("Abstract method `serialize` must be implemented.");}get free(){return this instanceof FreeHighlightOutline;}}var _box2=/*#__PURE__*/new WeakMap();var _outlines=/*#__PURE__*/new WeakMap();class HighlightOutline extends Outline{constructor(outlines,box){super();outliner_classPrivateFieldInitSpec(this,_box2,void 0);outliner_classPrivateFieldInitSpec(this,_outlines,void 0);outliner_classPrivateFieldSet(_outlines,this,outlines);outliner_classPrivateFieldSet(_box2,this,box);}toSVGPath(){const buffer=[];for(const polygon of outliner_classPrivateFieldGet(_outlines,this)){let[prevX,prevY]=polygon;buffer.push(`M${prevX} ${prevY}`);for(let i=2;i<polygon.length;i+=2){const x=polygon[i];const y=polygon[i+1];if(x===prevX){buffer.push(`V${y}`);prevY=y;}else if(y===prevY){buffer.push(`H${x}`);prevX=x;}}buffer.push("Z");}return buffer.join(" ");}serialize(_ref,_rotation){let[blX,blY,trX,trY]=_ref;const outlines=[];const width=trX-blX;const height=trY-blY;for(const outline of outliner_classPrivateFieldGet(_outlines,this)){const points=new Array(outline.length);for(let i=0;i<outline.length;i+=2){points[i]=blX+outline[i]*width;points[i+1]=trY-outline[i+1]*height;}outlines.push(points);}return outlines;}get box(){return outliner_classPrivateFieldGet(_box2,this);}}var _box3=/*#__PURE__*/new WeakMap();var _bottom=/*#__PURE__*/new WeakMap();var _innerMargin=/*#__PURE__*/new WeakMap();var _isLTR=/*#__PURE__*/new WeakMap();var _top=/*#__PURE__*/new WeakMap();var _last=/*#__PURE__*/new WeakMap();var _lastX=/*#__PURE__*/new WeakMap();var _lastY=/*#__PURE__*/new WeakMap();var _min=/*#__PURE__*/new WeakMap();var _min_dist=/*#__PURE__*/new WeakMap();var _scaleFactor=/*#__PURE__*/new WeakMap();var _thickness=/*#__PURE__*/new WeakMap();var _points=/*#__PURE__*/new WeakMap();var _FreeOutliner_brand=/*#__PURE__*/new WeakSet();class FreeOutliner{constructor(_ref2,box,scaleFactor,thickness,isLTR){let{x:_x,y:_y}=_ref2;let innerMargin=arguments.length>5&&arguments[5]!==undefined?arguments[5]:0;outliner_classPrivateMethodInitSpec(this,_FreeOutliner_brand);outliner_classPrivateFieldInitSpec(this,_box3,void 0);outliner_classPrivateFieldInitSpec(this,_bottom,[]);outliner_classPrivateFieldInitSpec(this,_innerMargin,void 0);outliner_classPrivateFieldInitSpec(this,_isLTR,void 0);outliner_classPrivateFieldInitSpec(this,_top,[]);outliner_classPrivateFieldInitSpec(this,_last,new Float64Array(18));outliner_classPrivateFieldInitSpec(this,_lastX,void 0);outliner_classPrivateFieldInitSpec(this,_lastY,void 0);outliner_classPrivateFieldInitSpec(this,_min,void 0);outliner_classPrivateFieldInitSpec(this,_min_dist,void 0);outliner_classPrivateFieldInitSpec(this,_scaleFactor,void 0);outliner_classPrivateFieldInitSpec(this,_thickness,void 0);outliner_classPrivateFieldInitSpec(this,_points,[]);outliner_classPrivateFieldSet(_box3,this,box);outliner_classPrivateFieldSet(_thickness,this,thickness*scaleFactor);outliner_classPrivateFieldSet(_isLTR,this,isLTR);outliner_classPrivateFieldGet(_last,this).set([NaN,NaN,NaN,NaN,_x,_y],6);outliner_classPrivateFieldSet(_innerMargin,this,innerMargin);outliner_classPrivateFieldSet(_min_dist,this,_MIN_DIST._*scaleFactor);outliner_classPrivateFieldSet(_min,this,_MIN._*scaleFactor);outliner_classPrivateFieldSet(_scaleFactor,this,scaleFactor);outliner_classPrivateFieldGet(_points,this).push(_x,_y);}get free(){return true;}isEmpty(){return isNaN(outliner_classPrivateFieldGet(_last,this)[8]);}add(_ref3){let{x,y}=_ref3;outliner_classPrivateFieldSet(_lastX,this,x);outliner_classPrivateFieldSet(_lastY,this,y);const[layerX,layerY,layerWidth,layerHeight]=outliner_classPrivateFieldGet(_box3,this);let[x1,y1,x2,y2]=outliner_classPrivateFieldGet(_last,this).subarray(8,12);const diffX=x-x2;const diffY=y-y2;const d=Math.hypot(diffX,diffY);if(d<outliner_classPrivateFieldGet(_min,this)){return false;}const diffD=d-outliner_classPrivateFieldGet(_min_dist,this);const K=diffD/d;const shiftX=K*diffX;const shiftY=K*diffY;let x0=x1;let y0=y1;x1=x2;y1=y2;x2+=shiftX;y2+=shiftY;outliner_classPrivateFieldGet(_points,this)?.push(x,y);const nX=-shiftY/diffD;const nY=shiftX/diffD;const thX=nX*outliner_classPrivateFieldGet(_thickness,this);const thY=nY*outliner_classPrivateFieldGet(_thickness,this);outliner_classPrivateFieldGet(_last,this).set(outliner_classPrivateFieldGet(_last,this).subarray(2,8),0);outliner_classPrivateFieldGet(_last,this).set([x2+thX,y2+thY],4);outliner_classPrivateFieldGet(_last,this).set(outliner_classPrivateFieldGet(_last,this).subarray(14,18),12);outliner_classPrivateFieldGet(_last,this).set([x2-thX,y2-thY],16);if(isNaN(outliner_classPrivateFieldGet(_last,this)[6])){if(outliner_classPrivateFieldGet(_top,this).length===0){outliner_classPrivateFieldGet(_last,this).set([x1+thX,y1+thY],2);outliner_classPrivateFieldGet(_top,this).push(NaN,NaN,NaN,NaN,(x1+thX-layerX)/layerWidth,(y1+thY-layerY)/layerHeight);outliner_classPrivateFieldGet(_last,this).set([x1-thX,y1-thY],14);outliner_classPrivateFieldGet(_bottom,this).push(NaN,NaN,NaN,NaN,(x1-thX-layerX)/layerWidth,(y1-thY-layerY)/layerHeight);}outliner_classPrivateFieldGet(_last,this).set([x0,y0,x1,y1,x2,y2],6);return!this.isEmpty();}outliner_classPrivateFieldGet(_last,this).set([x0,y0,x1,y1,x2,y2],6);const angle=Math.abs(Math.atan2(y0-y1,x0-x1)-Math.atan2(shiftY,shiftX));if(angle<Math.PI/2){[x1,y1,x2,y2]=outliner_classPrivateFieldGet(_last,this).subarray(2,6);outliner_classPrivateFieldGet(_top,this).push(NaN,NaN,NaN,NaN,((x1+x2)/2-layerX)/layerWidth,((y1+y2)/2-layerY)/layerHeight);[x1,y1,x0,y0]=outliner_classPrivateFieldGet(_last,this).subarray(14,18);outliner_classPrivateFieldGet(_bottom,this).push(NaN,NaN,NaN,NaN,((x0+x1)/2-layerX)/layerWidth,((y0+y1)/2-layerY)/layerHeight);return true;}[x0,y0,x1,y1,x2,y2]=outliner_classPrivateFieldGet(_last,this).subarray(0,6);outliner_classPrivateFieldGet(_top,this).push(((x0+5*x1)/6-layerX)/layerWidth,((y0+5*y1)/6-layerY)/layerHeight,((5*x1+x2)/6-layerX)/layerWidth,((5*y1+y2)/6-layerY)/layerHeight,((x1+x2)/2-layerX)/layerWidth,((y1+y2)/2-layerY)/layerHeight);[x2,y2,x1,y1,x0,y0]=outliner_classPrivateFieldGet(_last,this).subarray(12,18);outliner_classPrivateFieldGet(_bottom,this).push(((x0+5*x1)/6-layerX)/layerWidth,((y0+5*y1)/6-layerY)/layerHeight,((5*x1+x2)/6-layerX)/layerWidth,((5*y1+y2)/6-layerY)/layerHeight,((x1+x2)/2-layerX)/layerWidth,((y1+y2)/2-layerY)/layerHeight);return true;}toSVGPath(){if(this.isEmpty()){return"";}const top=outliner_classPrivateFieldGet(_top,this);const bottom=outliner_classPrivateFieldGet(_bottom,this);const lastTop=outliner_classPrivateFieldGet(_last,this).subarray(4,6);const lastBottom=outliner_classPrivateFieldGet(_last,this).subarray(16,18);const[x,y,width,height]=outliner_classPrivateFieldGet(_box3,this);const[lastTopX,lastTopY,lastBottomX,lastBottomY]=outliner_assertClassBrand(_FreeOutliner_brand,this,_getLastCoords).call(this);if(isNaN(outliner_classPrivateFieldGet(_last,this)[6])&&!this.isEmpty()){return`M${(outliner_classPrivateFieldGet(_last,this)[2]-x)/width} ${(outliner_classPrivateFieldGet(_last,this)[3]-y)/height} L${(outliner_classPrivateFieldGet(_last,this)[4]-x)/width} ${(outliner_classPrivateFieldGet(_last,this)[5]-y)/height} L${lastTopX} ${lastTopY} L${lastBottomX} ${lastBottomY} L${(outliner_classPrivateFieldGet(_last,this)[16]-x)/width} ${(outliner_classPrivateFieldGet(_last,this)[17]-y)/height} L${(outliner_classPrivateFieldGet(_last,this)[14]-x)/width} ${(outliner_classPrivateFieldGet(_last,this)[15]-y)/height} Z`;}const buffer=[];buffer.push(`M${top[4]} ${top[5]}`);for(let i=6;i<top.length;i+=6){if(isNaN(top[i])){buffer.push(`L${top[i+4]} ${top[i+5]}`);}else{buffer.push(`C${top[i]} ${top[i+1]} ${top[i+2]} ${top[i+3]} ${top[i+4]} ${top[i+5]}`);}}buffer.push(`L${(lastTop[0]-x)/width} ${(lastTop[1]-y)/height} L${lastTopX} ${lastTopY} L${lastBottomX} ${lastBottomY} L${(lastBottom[0]-x)/width} ${(lastBottom[1]-y)/height}`);for(let i=bottom.length-6;i>=6;i-=6){if(isNaN(bottom[i])){buffer.push(`L${bottom[i+4]} ${bottom[i+5]}`);}else{buffer.push(`C${bottom[i]} ${bottom[i+1]} ${bottom[i+2]} ${bottom[i+3]} ${bottom[i+4]} ${bottom[i+5]}`);}}buffer.push(`L${bottom[4]} ${bottom[5]} Z`);return buffer.join(" ");}getOutlines(){const top=outliner_classPrivateFieldGet(_top,this);const bottom=outliner_classPrivateFieldGet(_bottom,this);const last=outliner_classPrivateFieldGet(_last,this);const lastTop=last.subarray(4,6);const lastBottom=last.subarray(16,18);const[layerX,layerY,layerWidth,layerHeight]=outliner_classPrivateFieldGet(_box3,this);const points=new Float64Array((outliner_classPrivateFieldGet(_points,this)?.length??0)+2);for(let i=0,ii=points.length-2;i<ii;i+=2){points[i]=(outliner_classPrivateFieldGet(_points,this)[i]-layerX)/layerWidth;points[i+1]=(outliner_classPrivateFieldGet(_points,this)[i+1]-layerY)/layerHeight;}points[points.length-2]=(outliner_classPrivateFieldGet(_lastX,this)-layerX)/layerWidth;points[points.length-1]=(outliner_classPrivateFieldGet(_lastY,this)-layerY)/layerHeight;const[lastTopX,lastTopY,lastBottomX,lastBottomY]=outliner_assertClassBrand(_FreeOutliner_brand,this,_getLastCoords).call(this);if(isNaN(last[6])&&!this.isEmpty()){const outline=new Float64Array(36);outline.set([NaN,NaN,NaN,NaN,(last[2]-layerX)/layerWidth,(last[3]-layerY)/layerHeight,NaN,NaN,NaN,NaN,(last[4]-layerX)/layerWidth,(last[5]-layerY)/layerHeight,NaN,NaN,NaN,NaN,lastTopX,lastTopY,NaN,NaN,NaN,NaN,lastBottomX,lastBottomY,NaN,NaN,NaN,NaN,(last[16]-layerX)/layerWidth,(last[17]-layerY)/layerHeight,NaN,NaN,NaN,NaN,(last[14]-layerX)/layerWidth,(last[15]-layerY)/layerHeight],0);return new FreeHighlightOutline(outline,points,outliner_classPrivateFieldGet(_box3,this),outliner_classPrivateFieldGet(_scaleFactor,this),outliner_classPrivateFieldGet(_innerMargin,this),outliner_classPrivateFieldGet(_isLTR,this));}const outline=new Float64Array(outliner_classPrivateFieldGet(_top,this).length+24+outliner_classPrivateFieldGet(_bottom,this).length);let N=top.length;for(let i=0;i<N;i+=2){if(isNaN(top[i])){outline[i]=outline[i+1]=NaN;continue;}outline[i]=top[i];outline[i+1]=top[i+1];}outline.set([NaN,NaN,NaN,NaN,(lastTop[0]-layerX)/layerWidth,(lastTop[1]-layerY)/layerHeight,NaN,NaN,NaN,NaN,lastTopX,lastTopY,NaN,NaN,NaN,NaN,lastBottomX,lastBottomY,NaN,NaN,NaN,NaN,(lastBottom[0]-layerX)/layerWidth,(lastBottom[1]-layerY)/layerHeight],N);N+=24;for(let i=bottom.length-6;i>=6;i-=6){for(let j=0;j<6;j+=2){if(isNaN(bottom[i+j])){outline[N]=outline[N+1]=NaN;N+=2;continue;}outline[N]=bottom[i+j];outline[N+1]=bottom[i+j+1];N+=2;}}outline.set([NaN,NaN,NaN,NaN,bottom[4],bottom[5]],N);return new FreeHighlightOutline(outline,points,outliner_classPrivateFieldGet(_box3,this),outliner_classPrivateFieldGet(_scaleFactor,this),outliner_classPrivateFieldGet(_innerMargin,this),outliner_classPrivateFieldGet(_isLTR,this));}}function _getLastCoords(){const lastTop=outliner_classPrivateFieldGet(_last,this).subarray(4,6);const lastBottom=outliner_classPrivateFieldGet(_last,this).subarray(16,18);const[x,y,width,height]=outliner_classPrivateFieldGet(_box3,this);return[(outliner_classPrivateFieldGet(_lastX,this)+(lastTop[0]-lastBottom[0])/2-x)/width,(outliner_classPrivateFieldGet(_lastY,this)+(lastTop[1]-lastBottom[1])/2-y)/height,(outliner_classPrivateFieldGet(_lastX,this)+(lastBottom[0]-lastTop[0])/2-x)/width,(outliner_classPrivateFieldGet(_lastY,this)+(lastBottom[1]-lastTop[1])/2-y)/height];}var _MIN_DIST={_:8};var _MIN_DIFF={_:2};var _MIN={_:_MIN_DIST._+_MIN_DIFF._};var _box4=/*#__PURE__*/new WeakMap();var _bbox2=/*#__PURE__*/new WeakMap();var _innerMargin2=/*#__PURE__*/new WeakMap();var _isLTR2=/*#__PURE__*/new WeakMap();var _points2=/*#__PURE__*/new WeakMap();var _scaleFactor2=/*#__PURE__*/new WeakMap();var _outline=/*#__PURE__*/new WeakMap();var _FreeHighlightOutline_brand=/*#__PURE__*/new WeakSet();class FreeHighlightOutline extends Outline{constructor(_outline2,points,box,scaleFactor,innerMargin,_isLTR3){super();outliner_classPrivateMethodInitSpec(this,_FreeHighlightOutline_brand);outliner_classPrivateFieldInitSpec(this,_box4,void 0);outliner_classPrivateFieldInitSpec(this,_bbox2,null);outliner_classPrivateFieldInitSpec(this,_innerMargin2,void 0);outliner_classPrivateFieldInitSpec(this,_isLTR2,void 0);outliner_classPrivateFieldInitSpec(this,_points2,void 0);outliner_classPrivateFieldInitSpec(this,_scaleFactor2,void 0);outliner_classPrivateFieldInitSpec(this,_outline,void 0);outliner_classPrivateFieldSet(_outline,this,_outline2);outliner_classPrivateFieldSet(_points2,this,points);outliner_classPrivateFieldSet(_box4,this,box);outliner_classPrivateFieldSet(_scaleFactor2,this,scaleFactor);outliner_classPrivateFieldSet(_innerMargin2,this,innerMargin);outliner_classPrivateFieldSet(_isLTR2,this,_isLTR3);outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_computeMinMax).call(this,_isLTR3);const{x:_x2,y:_y2,width:_width,height:_height}=outliner_classPrivateFieldGet(_bbox2,this);for(let i=0,ii=_outline2.length;i<ii;i+=2){_outline2[i]=(_outline2[i]-_x2)/_width;_outline2[i+1]=(_outline2[i+1]-_y2)/_height;}for(let i=0,ii=points.length;i<ii;i+=2){points[i]=(points[i]-_x2)/_width;points[i+1]=(points[i+1]-_y2)/_height;}}toSVGPath(){const buffer=[`M${outliner_classPrivateFieldGet(_outline,this)[4]} ${outliner_classPrivateFieldGet(_outline,this)[5]}`];for(let i=6,ii=outliner_classPrivateFieldGet(_outline,this).length;i<ii;i+=6){if(isNaN(outliner_classPrivateFieldGet(_outline,this)[i])){buffer.push(`L${outliner_classPrivateFieldGet(_outline,this)[i+4]} ${outliner_classPrivateFieldGet(_outline,this)[i+5]}`);continue;}buffer.push(`C${outliner_classPrivateFieldGet(_outline,this)[i]} ${outliner_classPrivateFieldGet(_outline,this)[i+1]} ${outliner_classPrivateFieldGet(_outline,this)[i+2]} ${outliner_classPrivateFieldGet(_outline,this)[i+3]} ${outliner_classPrivateFieldGet(_outline,this)[i+4]} ${outliner_classPrivateFieldGet(_outline,this)[i+5]}`);}buffer.push("Z");return buffer.join(" ");}serialize(_ref4,rotation){let[blX,blY,trX,trY]=_ref4;const width=trX-blX;const height=trY-blY;let outline;let points;switch(rotation){case 0:outline=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescale).call(this,outliner_classPrivateFieldGet(_outline,this),blX,trY,width,-height);points=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescale).call(this,outliner_classPrivateFieldGet(_points2,this),blX,trY,width,-height);break;case 90:outline=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescaleAndSwap).call(this,outliner_classPrivateFieldGet(_outline,this),blX,blY,width,height);points=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescaleAndSwap).call(this,outliner_classPrivateFieldGet(_points2,this),blX,blY,width,height);break;case 180:outline=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescale).call(this,outliner_classPrivateFieldGet(_outline,this),trX,blY,-width,height);points=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescale).call(this,outliner_classPrivateFieldGet(_points2,this),trX,blY,-width,height);break;case 270:outline=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescaleAndSwap).call(this,outliner_classPrivateFieldGet(_outline,this),trX,trY,-width,-height);points=outliner_assertClassBrand(_FreeHighlightOutline_brand,this,_rescaleAndSwap).call(this,outliner_classPrivateFieldGet(_points2,this),trX,trY,-width,-height);break;}return{outline:Array.from(outline),points:[Array.from(points)]};}get box(){return outliner_classPrivateFieldGet(_bbox2,this);}getNewOutline(thickness,innerMargin){const{x,y,width,height}=outliner_classPrivateFieldGet(_bbox2,this);const[layerX,layerY,layerWidth,layerHeight]=outliner_classPrivateFieldGet(_box4,this);const sx=width*layerWidth;const sy=height*layerHeight;const tx=x*layerWidth+layerX;const ty=y*layerHeight+layerY;const outliner=new FreeOutliner({x:outliner_classPrivateFieldGet(_points2,this)[0]*sx+tx,y:outliner_classPrivateFieldGet(_points2,this)[1]*sy+ty},outliner_classPrivateFieldGet(_box4,this),outliner_classPrivateFieldGet(_scaleFactor2,this),thickness,outliner_classPrivateFieldGet(_isLTR2,this),innerMargin??outliner_classPrivateFieldGet(_innerMargin2,this));for(let i=2;i<outliner_classPrivateFieldGet(_points2,this).length;i+=2){outliner.add({x:outliner_classPrivateFieldGet(_points2,this)[i]*sx+tx,y:outliner_classPrivateFieldGet(_points2,this)[i+1]*sy+ty});}return outliner.getOutlines();}}function _rescale(src,tx,ty,sx,sy){const dest=new Float64Array(src.length);for(let i=0,ii=src.length;i<ii;i+=2){dest[i]=tx+src[i]*sx;dest[i+1]=ty+src[i+1]*sy;}return dest;}function _rescaleAndSwap(src,tx,ty,sx,sy){const dest=new Float64Array(src.length);for(let i=0,ii=src.length;i<ii;i+=2){dest[i]=tx+src[i+1]*sx;dest[i+1]=ty+src[i]*sy;}return dest;}function _computeMinMax(isLTR){const outline=outliner_classPrivateFieldGet(_outline,this);let lastX=outline[4];let lastY=outline[5];let minX=lastX;let minY=lastY;let maxX=lastX;let maxY=lastY;let lastPointX=lastX;let lastPointY=lastY;const ltrCallback=isLTR?Math.max:Math.min;for(let i=6,ii=outline.length;i<ii;i+=6){if(isNaN(outline[i])){minX=Math.min(minX,outline[i+4]);minY=Math.min(minY,outline[i+5]);maxX=Math.max(maxX,outline[i+4]);maxY=Math.max(maxY,outline[i+5]);if(lastPointY<outline[i+5]){lastPointX=outline[i+4];lastPointY=outline[i+5];}else if(lastPointY===outline[i+5]){lastPointX=ltrCallback(lastPointX,outline[i+4]);}}else{const bbox=Util.bezierBoundingBox(lastX,lastY,...outline.slice(i,i+6));minX=Math.min(minX,bbox[0]);minY=Math.min(minY,bbox[1]);maxX=Math.max(maxX,bbox[2]);maxY=Math.max(maxY,bbox[3]);if(lastPointY<bbox[3]){lastPointX=bbox[2];lastPointY=bbox[3];}else if(lastPointY===bbox[3]){lastPointX=ltrCallback(lastPointX,bbox[2]);}}lastX=outline[i+4];lastY=outline[i+5];}const x=minX-outliner_classPrivateFieldGet(_innerMargin2,this),y=minY-outliner_classPrivateFieldGet(_innerMargin2,this),width=maxX-minX+2*outliner_classPrivateFieldGet(_innerMargin2,this),height=maxY-minY+2*outliner_classPrivateFieldGet(_innerMargin2,this);outliner_classPrivateFieldSet(_bbox2,this,{x,y,width,height,lastPoint:[lastPointX,lastPointY]});}
;// CONCATENATED MODULE: ./src/display/editor/color_picker.js
var _ColorPicker;function color_picker_classPrivateMethodInitSpec(e,a){color_picker_checkPrivateRedeclaration(e,a),a.add(e);}function color_picker_classPrivateFieldInitSpec(e,t,a){color_picker_checkPrivateRedeclaration(e,t),t.set(e,a);}function color_picker_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function color_picker_classPrivateGetter(s,r,a){return a(color_picker_assertClassBrand(s,r));}function color_picker_classPrivateFieldGet(s,a){return s.get(color_picker_assertClassBrand(s,a));}function color_picker_classPrivateFieldSet(s,a,r){return s.set(color_picker_assertClassBrand(s,a),r),r;}function color_picker_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var color_picker_boundKeyDown=/*#__PURE__*/new WeakMap();var _boundPointerDown=/*#__PURE__*/new WeakMap();var _button=/*#__PURE__*/new WeakMap();var _buttonSwatch=/*#__PURE__*/new WeakMap();var _defaultColor=/*#__PURE__*/new WeakMap();var _dropdown=/*#__PURE__*/new WeakMap();var _dropdownWasFromKeyboard=/*#__PURE__*/new WeakMap();var _isMainColorPicker=/*#__PURE__*/new WeakMap();var color_picker_editor=/*#__PURE__*/new WeakMap();var _eventBus=/*#__PURE__*/new WeakMap();var color_picker_uiManager=/*#__PURE__*/new WeakMap();var _type=/*#__PURE__*/new WeakMap();var _ColorPicker_brand=/*#__PURE__*/new WeakSet();class ColorPicker{static get _keyboardManager(){return shadow(this,"_keyboardManager",new KeyboardManager([[["Escape","mac+Escape"],ColorPicker.prototype._hideDropdownFromKeyboard],[[" ","mac+ "],ColorPicker.prototype._colorSelectFromKeyboard],[["ArrowDown","ArrowRight","mac+ArrowDown","mac+ArrowRight"],ColorPicker.prototype._moveToNext],[["ArrowUp","ArrowLeft","mac+ArrowUp","mac+ArrowLeft"],ColorPicker.prototype._moveToPrevious],[["Home","mac+Home"],ColorPicker.prototype._moveToBeginning],[["End","mac+End"],ColorPicker.prototype._moveToEnd]]));}constructor(_ref){let{editor=null,uiManager=null}=_ref;color_picker_classPrivateMethodInitSpec(this,_ColorPicker_brand);color_picker_classPrivateFieldInitSpec(this,color_picker_boundKeyDown,color_picker_assertClassBrand(_ColorPicker_brand,this,color_picker_keyDown).bind(this));color_picker_classPrivateFieldInitSpec(this,_boundPointerDown,color_picker_assertClassBrand(_ColorPicker_brand,this,color_picker_pointerDown).bind(this));color_picker_classPrivateFieldInitSpec(this,_button,null);color_picker_classPrivateFieldInitSpec(this,_buttonSwatch,null);color_picker_classPrivateFieldInitSpec(this,_defaultColor,void 0);color_picker_classPrivateFieldInitSpec(this,_dropdown,null);color_picker_classPrivateFieldInitSpec(this,_dropdownWasFromKeyboard,false);color_picker_classPrivateFieldInitSpec(this,_isMainColorPicker,false);color_picker_classPrivateFieldInitSpec(this,color_picker_editor,null);color_picker_classPrivateFieldInitSpec(this,_eventBus,void 0);color_picker_classPrivateFieldInitSpec(this,color_picker_uiManager,null);color_picker_classPrivateFieldInitSpec(this,_type,void 0);if(editor){color_picker_classPrivateFieldSet(_isMainColorPicker,this,false);color_picker_classPrivateFieldSet(_type,this,AnnotationEditorParamsType.HIGHLIGHT_COLOR);color_picker_classPrivateFieldSet(color_picker_editor,this,editor);}else{color_picker_classPrivateFieldSet(_isMainColorPicker,this,true);color_picker_classPrivateFieldSet(_type,this,AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR);}color_picker_classPrivateFieldSet(color_picker_uiManager,this,editor?._uiManager||uiManager);color_picker_classPrivateFieldSet(_eventBus,this,color_picker_classPrivateFieldGet(color_picker_uiManager,this)._eventBus);color_picker_classPrivateFieldSet(_defaultColor,this,editor?.color||color_picker_classPrivateFieldGet(color_picker_uiManager,this)?.highlightColors.values().next().value||"#FFFF98");}renderButton(){const button=color_picker_classPrivateFieldSet(_button,this,document.createElement("button"));button.className="colorPicker";button.tabIndex="0";button.setAttribute("data-l10n-id","pdfjs-editor-colorpicker-button");button.setAttribute("aria-haspopup",true);button.addEventListener("click",color_picker_assertClassBrand(_ColorPicker_brand,this,_openDropdown).bind(this));button.addEventListener("keydown",color_picker_classPrivateFieldGet(color_picker_boundKeyDown,this));const swatch=color_picker_classPrivateFieldSet(_buttonSwatch,this,document.createElement("span"));swatch.className="swatch";swatch.setAttribute("aria-hidden",true);swatch.style.backgroundColor=color_picker_classPrivateFieldGet(_defaultColor,this);button.append(swatch);return button;}renderMainDropdown(){const dropdown=color_picker_classPrivateFieldSet(_dropdown,this,color_picker_assertClassBrand(_ColorPicker_brand,this,_getDropdownRoot).call(this));dropdown.setAttribute("aria-orientation","horizontal");dropdown.setAttribute("aria-labelledby","highlightColorPickerLabel");return dropdown;}_colorSelectFromKeyboard(event){if(event.target===color_picker_classPrivateFieldGet(_button,this)){color_picker_assertClassBrand(_ColorPicker_brand,this,_openDropdown).call(this,event);return;}const color=event.target.getAttribute("data-color");if(!color){return;}color_picker_assertClassBrand(_ColorPicker_brand,this,_colorSelect).call(this,color,event);}_moveToNext(event){if(!color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){color_picker_assertClassBrand(_ColorPicker_brand,this,_openDropdown).call(this,event);return;}if(event.target===color_picker_classPrivateFieldGet(_button,this)){color_picker_classPrivateFieldGet(_dropdown,this).firstChild?.focus();return;}event.target.nextSibling?.focus();}_moveToPrevious(event){if(event.target===color_picker_classPrivateFieldGet(_dropdown,this)?.firstChild||event.target===color_picker_classPrivateFieldGet(_button,this)){if(color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){this._hideDropdownFromKeyboard();}return;}if(!color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){color_picker_assertClassBrand(_ColorPicker_brand,this,_openDropdown).call(this,event);}event.target.previousSibling?.focus();}_moveToBeginning(event){if(!color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){color_picker_assertClassBrand(_ColorPicker_brand,this,_openDropdown).call(this,event);return;}color_picker_classPrivateFieldGet(_dropdown,this).firstChild?.focus();}_moveToEnd(event){if(!color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){color_picker_assertClassBrand(_ColorPicker_brand,this,_openDropdown).call(this,event);return;}color_picker_classPrivateFieldGet(_dropdown,this).lastChild?.focus();}hideDropdown(){color_picker_classPrivateFieldGet(_dropdown,this)?.classList.add("hidden");window.removeEventListener("pointerdown",color_picker_classPrivateFieldGet(_boundPointerDown,this));}_hideDropdownFromKeyboard(){if(color_picker_classPrivateFieldGet(_isMainColorPicker,this)){return;}if(!color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){color_picker_classPrivateFieldGet(color_picker_editor,this)?.unselect();return;}this.hideDropdown();color_picker_classPrivateFieldGet(_button,this).focus({preventScroll:true,focusVisible:color_picker_classPrivateFieldGet(_dropdownWasFromKeyboard,this)});}updateColor(color){if(color_picker_classPrivateFieldGet(_buttonSwatch,this)){color_picker_classPrivateFieldGet(_buttonSwatch,this).style.backgroundColor=color;}if(!color_picker_classPrivateFieldGet(_dropdown,this)){return;}const i=color_picker_classPrivateFieldGet(color_picker_uiManager,this).highlightColors.values();for(const child of color_picker_classPrivateFieldGet(_dropdown,this).children){child.setAttribute("aria-selected",i.next().value===color);}}destroy(){color_picker_classPrivateFieldGet(_button,this)?.remove();color_picker_classPrivateFieldSet(_button,this,null);color_picker_classPrivateFieldSet(_buttonSwatch,this,null);color_picker_classPrivateFieldGet(_dropdown,this)?.remove();color_picker_classPrivateFieldSet(_dropdown,this,null);}}_ColorPicker=ColorPicker;function _getDropdownRoot(){const div=document.createElement("div");div.addEventListener("contextmenu",noContextMenu);div.className="dropdown";div.role="listbox";div.setAttribute("aria-multiselectable",false);div.setAttribute("aria-orientation","vertical");div.setAttribute("data-l10n-id","pdfjs-editor-colorpicker-dropdown");for(const[name,color]of color_picker_classPrivateFieldGet(color_picker_uiManager,this).highlightColors){const button=document.createElement("button");button.tabIndex="0";button.role="option";button.setAttribute("data-color",color);button.title=name;button.setAttribute("data-l10n-id",`pdfjs-editor-colorpicker-${name}`);const swatch=document.createElement("span");button.append(swatch);swatch.className="swatch";swatch.style.backgroundColor=color;button.setAttribute("aria-selected",color===color_picker_classPrivateFieldGet(_defaultColor,this));button.addEventListener("click",color_picker_assertClassBrand(_ColorPicker_brand,this,_colorSelect).bind(this,color));div.append(button);}div.addEventListener("keydown",color_picker_classPrivateFieldGet(color_picker_boundKeyDown,this));return div;}function _colorSelect(color,event){event.stopPropagation();color_picker_classPrivateFieldGet(_eventBus,this).dispatch("switchannotationeditorparams",{source:this,type:color_picker_classPrivateFieldGet(_type,this),value:color});}function color_picker_keyDown(event){_ColorPicker._keyboardManager.exec(this,event);}function _openDropdown(event){if(color_picker_classPrivateGetter(_ColorPicker_brand,this,_get_isDropdownVisible)){this.hideDropdown();return;}color_picker_classPrivateFieldSet(_dropdownWasFromKeyboard,this,event.detail===0);window.addEventListener("pointerdown",color_picker_classPrivateFieldGet(_boundPointerDown,this));if(color_picker_classPrivateFieldGet(_dropdown,this)){color_picker_classPrivateFieldGet(_dropdown,this).classList.remove("hidden");return;}const root=color_picker_classPrivateFieldSet(_dropdown,this,color_picker_assertClassBrand(_ColorPicker_brand,this,_getDropdownRoot).call(this));color_picker_classPrivateFieldGet(_button,this).append(root);}function color_picker_pointerDown(event){if(color_picker_classPrivateFieldGet(_dropdown,this)?.contains(event.target)){return;}this.hideDropdown();}function _get_isDropdownVisible(_this){return color_picker_classPrivateFieldGet(_dropdown,_this)&&!color_picker_classPrivateFieldGet(_dropdown,_this).classList.contains("hidden");}
;// CONCATENATED MODULE: ./src/display/editor/highlight.js
var _HighlightEditor;function highlight_classPrivateMethodInitSpec(e,a){highlight_checkPrivateRedeclaration(e,a),a.add(e);}function highlight_defineProperty(e,r,t){return(r=highlight_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function highlight_toPropertyKey(t){var i=highlight_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function highlight_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function highlight_classPrivateFieldInitSpec(e,t,a){highlight_checkPrivateRedeclaration(e,t),t.set(e,a);}function highlight_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function highlight_toSetter(t,e,n){e||(e=[]);var r=e.length++;return Object.defineProperty({},"_",{set:function(o){e[r]=o,t.apply(n,e);}});}function highlight_classPrivateFieldGet(s,a){return s.get(highlight_assertClassBrand(s,a));}function highlight_classPrivateFieldSet(s,a,r){return s.set(highlight_assertClassBrand(s,a),r),r;}function highlight_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _anchorNode=/*#__PURE__*/new WeakMap();var _anchorOffset=/*#__PURE__*/new WeakMap();var _boxes=/*#__PURE__*/new WeakMap();var _clipPathId=/*#__PURE__*/new WeakMap();var highlight_colorPicker=/*#__PURE__*/new WeakMap();var _focusOutlines=/*#__PURE__*/new WeakMap();var _focusNode=/*#__PURE__*/new WeakMap();var _focusOffset=/*#__PURE__*/new WeakMap();var _highlightDiv=/*#__PURE__*/new WeakMap();var _highlightOutlines=/*#__PURE__*/new WeakMap();var highlight_id=/*#__PURE__*/new WeakMap();var _isFreeHighlight=/*#__PURE__*/new WeakMap();var highlight_boundKeydown=/*#__PURE__*/new WeakMap();var _lastPoint=/*#__PURE__*/new WeakMap();var _opacity=/*#__PURE__*/new WeakMap();var _outlineId=/*#__PURE__*/new WeakMap();var _text=/*#__PURE__*/new WeakMap();var highlight_thickness=/*#__PURE__*/new WeakMap();var _methodOfCreation=/*#__PURE__*/new WeakMap();var _HighlightEditor_brand=/*#__PURE__*/new WeakSet();class HighlightEditor extends AnnotationEditor{static get _keyboardManager(){const proto=HighlightEditor.prototype;return shadow(this,"_keyboardManager",new KeyboardManager([[["ArrowLeft","mac+ArrowLeft"],proto._moveCaret,{args:[0]}],[["ArrowRight","mac+ArrowRight"],proto._moveCaret,{args:[1]}],[["ArrowUp","mac+ArrowUp"],proto._moveCaret,{args:[2]}],[["ArrowDown","mac+ArrowDown"],proto._moveCaret,{args:[3]}]]));}constructor(params){super({...params,name:"highlightEditor"});highlight_classPrivateMethodInitSpec(this,_HighlightEditor_brand);highlight_classPrivateFieldInitSpec(this,_anchorNode,null);highlight_classPrivateFieldInitSpec(this,_anchorOffset,0);highlight_classPrivateFieldInitSpec(this,_boxes,void 0);highlight_classPrivateFieldInitSpec(this,_clipPathId,null);highlight_classPrivateFieldInitSpec(this,highlight_colorPicker,null);highlight_classPrivateFieldInitSpec(this,_focusOutlines,null);highlight_classPrivateFieldInitSpec(this,_focusNode,null);highlight_classPrivateFieldInitSpec(this,_focusOffset,0);highlight_classPrivateFieldInitSpec(this,_highlightDiv,null);highlight_classPrivateFieldInitSpec(this,_highlightOutlines,null);highlight_classPrivateFieldInitSpec(this,highlight_id,null);highlight_classPrivateFieldInitSpec(this,_isFreeHighlight,false);highlight_classPrivateFieldInitSpec(this,highlight_boundKeydown,highlight_assertClassBrand(_HighlightEditor_brand,this,_keydown).bind(this));highlight_classPrivateFieldInitSpec(this,_lastPoint,null);highlight_classPrivateFieldInitSpec(this,_opacity,void 0);highlight_classPrivateFieldInitSpec(this,_outlineId,null);highlight_classPrivateFieldInitSpec(this,_text,"");highlight_classPrivateFieldInitSpec(this,highlight_thickness,void 0);highlight_classPrivateFieldInitSpec(this,_methodOfCreation,"");this.color=params.color||HighlightEditor._defaultColor;highlight_classPrivateFieldSet(highlight_thickness,this,params.thickness||HighlightEditor._defaultThickness);highlight_classPrivateFieldSet(_opacity,this,params.opacity||HighlightEditor._defaultOpacity);highlight_classPrivateFieldSet(_boxes,this,params.boxes||null);highlight_classPrivateFieldSet(_methodOfCreation,this,params.methodOfCreation||"");highlight_classPrivateFieldSet(_text,this,params.text||"");this._isDraggable=false;if(params.highlightId>-1){highlight_classPrivateFieldSet(_isFreeHighlight,this,true);highlight_assertClassBrand(_HighlightEditor_brand,this,_createFreeOutlines).call(this,params);highlight_assertClassBrand(_HighlightEditor_brand,this,_addToDrawLayer).call(this);}else{highlight_classPrivateFieldSet(_anchorNode,this,params.anchorNode);highlight_classPrivateFieldSet(_anchorOffset,this,params.anchorOffset);highlight_classPrivateFieldSet(_focusNode,this,params.focusNode);highlight_classPrivateFieldSet(_focusOffset,this,params.focusOffset);highlight_assertClassBrand(_HighlightEditor_brand,this,_createOutlines).call(this);highlight_assertClassBrand(_HighlightEditor_brand,this,_addToDrawLayer).call(this);this.rotate(this.rotation);}}get telemetryInitialData(){return{action:"added",type:highlight_classPrivateFieldGet(_isFreeHighlight,this)?"free_highlight":"highlight",color:this._uiManager.highlightColorNames.get(this.color),thickness:highlight_classPrivateFieldGet(highlight_thickness,this),methodOfCreation:highlight_classPrivateFieldGet(_methodOfCreation,this)};}get telemetryFinalData(){return{type:"highlight",color:this._uiManager.highlightColorNames.get(this.color)};}static computeTelemetryFinalData(data){return{numberOfColors:data.get("color").size};}static initialize(l10n,uiManager){AnnotationEditor.initialize(l10n,uiManager);HighlightEditor._defaultColor||=uiManager.highlightColors?.values().next().value||"#fff066";}static updateDefaultParams(type,value){switch(type){case AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR:HighlightEditor._defaultColor=value;break;case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:HighlightEditor._defaultThickness=value;break;}}translateInPage(x,y){}get toolbarPosition(){return highlight_classPrivateFieldGet(_lastPoint,this);}updateParams(type,value){switch(type){case AnnotationEditorParamsType.HIGHLIGHT_COLOR:highlight_assertClassBrand(_HighlightEditor_brand,this,highlight_updateColor).call(this,value);break;case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:highlight_assertClassBrand(_HighlightEditor_brand,this,_updateThickness).call(this,value);break;}}static get defaultPropertiesToUpdate(){return[[AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR,HighlightEditor._defaultColor],[AnnotationEditorParamsType.HIGHLIGHT_THICKNESS,HighlightEditor._defaultThickness]];}get propertiesToUpdate(){return[[AnnotationEditorParamsType.HIGHLIGHT_COLOR,this.color||HighlightEditor._defaultColor],[AnnotationEditorParamsType.HIGHLIGHT_THICKNESS,highlight_classPrivateFieldGet(highlight_thickness,this)||HighlightEditor._defaultThickness],[AnnotationEditorParamsType.HIGHLIGHT_FREE,highlight_classPrivateFieldGet(_isFreeHighlight,this)]];}async addEditToolbar(){const toolbar=await super.addEditToolbar();if(!toolbar){return null;}if(this._uiManager.highlightColors){highlight_classPrivateFieldSet(highlight_colorPicker,this,new ColorPicker({editor:this}));toolbar.addColorPicker(highlight_classPrivateFieldGet(highlight_colorPicker,this));}return toolbar;}disableEditing(){super.disableEditing();this.div.classList.toggle("disabled",true);}enableEditing(){super.enableEditing();this.div.classList.toggle("disabled",false);}fixAndSetPosition(){return super.fixAndSetPosition(highlight_assertClassBrand(_HighlightEditor_brand,this,_getRotation).call(this));}getBaseTranslation(){return[0,0];}getRect(tx,ty){return super.getRect(tx,ty,highlight_assertClassBrand(_HighlightEditor_brand,this,_getRotation).call(this));}onceAdded(){this.parent.addUndoableEditor(this);this.div.focus();}remove(){highlight_assertClassBrand(_HighlightEditor_brand,this,_cleanDrawLayer).call(this);this._reportTelemetry({action:"deleted"});super.remove();}rebuild(){if(!this.parent){return;}super.rebuild();if(this.div===null){return;}highlight_assertClassBrand(_HighlightEditor_brand,this,_addToDrawLayer).call(this);if(!this.isAttachedToDOM){this.parent.add(this);}}setParent(parent){let mustBeSelected=false;if(this.parent&&!parent){highlight_assertClassBrand(_HighlightEditor_brand,this,_cleanDrawLayer).call(this);}else if(parent){highlight_assertClassBrand(_HighlightEditor_brand,this,_addToDrawLayer).call(this,parent);mustBeSelected=!this.parent&&this.div?.classList.contains("selectedEditor");}super.setParent(parent);this.show(this._isVisible);if(mustBeSelected){this.select();}}rotate(angle){const{drawLayer}=this.parent;let box;if(highlight_classPrivateFieldGet(_isFreeHighlight,this)){angle=(angle-this.rotation+360)%360;box=_rotateBbox.call(HighlightEditor,highlight_classPrivateFieldGet(_highlightOutlines,this).box,angle);}else{box=_rotateBbox.call(HighlightEditor,this,angle);}drawLayer.rotate(highlight_classPrivateFieldGet(highlight_id,this),angle);drawLayer.rotate(highlight_classPrivateFieldGet(_outlineId,this),angle);drawLayer.updateBox(highlight_classPrivateFieldGet(highlight_id,this),box);drawLayer.updateBox(highlight_classPrivateFieldGet(_outlineId,this),_rotateBbox.call(HighlightEditor,highlight_classPrivateFieldGet(_focusOutlines,this).box,angle));}render(){if(this.div){return this.div;}const div=super.render();if(highlight_classPrivateFieldGet(_text,this)){div.setAttribute("aria-label",highlight_classPrivateFieldGet(_text,this));div.setAttribute("role","mark");}if(highlight_classPrivateFieldGet(_isFreeHighlight,this)){div.classList.add("free");}else{this.div.addEventListener("keydown",highlight_classPrivateFieldGet(highlight_boundKeydown,this));}const highlightDiv=highlight_classPrivateFieldSet(_highlightDiv,this,document.createElement("div"));div.append(highlightDiv);highlightDiv.setAttribute("aria-hidden","true");highlightDiv.className="internal";highlightDiv.style.clipPath=highlight_classPrivateFieldGet(_clipPathId,this);const[parentWidth,parentHeight]=this.parentDimensions;this.setDims(this.width*parentWidth,this.height*parentHeight);bindEvents(this,highlight_classPrivateFieldGet(_highlightDiv,this),["pointerover","pointerleave"]);this.enableEditing();return div;}pointerover(){this.parent.drawLayer.addClass(highlight_classPrivateFieldGet(_outlineId,this),"hovered");}pointerleave(){this.parent.drawLayer.removeClass(highlight_classPrivateFieldGet(_outlineId,this),"hovered");}_moveCaret(direction){this.parent.unselect(this);switch(direction){case 0:case 2:highlight_assertClassBrand(_HighlightEditor_brand,this,_setCaret).call(this,true);break;case 1:case 3:highlight_assertClassBrand(_HighlightEditor_brand,this,_setCaret).call(this,false);break;}}select(){super.select();if(!highlight_classPrivateFieldGet(_outlineId,this)){return;}this.parent?.drawLayer.removeClass(highlight_classPrivateFieldGet(_outlineId,this),"hovered");this.parent?.drawLayer.addClass(highlight_classPrivateFieldGet(_outlineId,this),"selected");}unselect(){super.unselect();if(!highlight_classPrivateFieldGet(_outlineId,this)){return;}this.parent?.drawLayer.removeClass(highlight_classPrivateFieldGet(_outlineId,this),"selected");if(!highlight_classPrivateFieldGet(_isFreeHighlight,this)){highlight_assertClassBrand(_HighlightEditor_brand,this,_setCaret).call(this,false);}}get _mustFixPosition(){return!highlight_classPrivateFieldGet(_isFreeHighlight,this);}show(){let visible=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this._isVisible;super.show(visible);if(this.parent){this.parent.drawLayer.show(highlight_classPrivateFieldGet(highlight_id,this),visible);this.parent.drawLayer.show(highlight_classPrivateFieldGet(_outlineId,this),visible);}}static startHighlighting(parent,isLTR,_ref){let{target:textLayer,x,y}=_ref;const{x:layerX,y:layerY,width:parentWidth,height:parentHeight}=textLayer.getBoundingClientRect();const pointerMove=e=>{highlight_assertClassBrand(HighlightEditor,this,_highlightMove).call(this,parent,e);};const pointerDownOptions={capture:true,passive:false};const pointerDown=e=>{e.preventDefault();e.stopPropagation();};const pointerUpCallback=e=>{textLayer.removeEventListener("pointermove",pointerMove);window.removeEventListener("blur",pointerUpCallback);window.removeEventListener("pointerup",pointerUpCallback);window.removeEventListener("pointerdown",pointerDown,pointerDownOptions);window.removeEventListener("contextmenu",noContextMenu);highlight_assertClassBrand(HighlightEditor,this,_endHighlight).call(this,parent,e);};window.addEventListener("blur",pointerUpCallback);window.addEventListener("pointerup",pointerUpCallback);window.addEventListener("pointerdown",pointerDown,pointerDownOptions);window.addEventListener("contextmenu",noContextMenu);textLayer.addEventListener("pointermove",pointerMove);this._freeHighlight=new FreeOutliner({x,y},[layerX,layerY,parentWidth,parentHeight],parent.scale,this._defaultThickness/2,isLTR,0.001);({id:this._freeHighlightId,clipPathId:this._freeHighlightClipId}=parent.drawLayer.highlight(this._freeHighlight,this._defaultColor,this._defaultOpacity,true));}static deserialize(data,parent,uiManager){const editor=super.deserialize(data,parent,uiManager);const{rect:[blX,blY,trX,trY],color,quadPoints}=data;editor.color=Util.makeHexColor(...color);highlight_classPrivateFieldSet(_opacity,editor,data.opacity);const[pageWidth,pageHeight]=editor.pageDimensions;editor.width=(trX-blX)/pageWidth;editor.height=(trY-blY)/pageHeight;const boxes=highlight_classPrivateFieldSet(_boxes,editor,[]);for(let i=0;i<quadPoints.length;i+=8){boxes.push({x:(quadPoints[4]-trX)/pageWidth,y:(trY-(1-quadPoints[i+5]))/pageHeight,width:(quadPoints[i+2]-quadPoints[i])/pageWidth,height:(quadPoints[i+5]-quadPoints[i+1])/pageHeight});}highlight_assertClassBrand(_HighlightEditor_brand,editor,_createOutlines).call(editor);return editor;}serialize(){let isForCopying=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(this.isEmpty()||isForCopying){return null;}const rect=this.getRect(0,0);const color=AnnotationEditor._colorManager.convert(this.color);return{annotationType:AnnotationEditorType.HIGHLIGHT,color,opacity:highlight_classPrivateFieldGet(_opacity,this),thickness:highlight_classPrivateFieldGet(highlight_thickness,this),quadPoints:highlight_assertClassBrand(_HighlightEditor_brand,this,_serializeBoxes).call(this),outlines:highlight_assertClassBrand(_HighlightEditor_brand,this,_serializeOutlines).call(this,rect),pageIndex:this.pageIndex,rect,rotation:highlight_assertClassBrand(_HighlightEditor_brand,this,_getRotation).call(this),structTreeParentId:this._structTreeParentId};}static canCreateNewEmptyEditor(){return false;}}_HighlightEditor=HighlightEditor;function _createOutlines(){const outliner=new Outliner(highlight_classPrivateFieldGet(_boxes,this),0.001);highlight_classPrivateFieldSet(_highlightOutlines,this,outliner.getOutlines());({x:this.x,y:this.y,width:this.width,height:this.height}=highlight_classPrivateFieldGet(_highlightOutlines,this).box);const outlinerForOutline=new Outliner(highlight_classPrivateFieldGet(_boxes,this),0.0025,0.001,this._uiManager.direction==="ltr");highlight_classPrivateFieldSet(_focusOutlines,this,outlinerForOutline.getOutlines());const{lastPoint}=highlight_classPrivateFieldGet(_focusOutlines,this).box;highlight_classPrivateFieldSet(_lastPoint,this,[(lastPoint[0]-this.x)/this.width,(lastPoint[1]-this.y)/this.height]);}function _createFreeOutlines(_ref2){let{highlightOutlines,highlightId,clipPathId}=_ref2;highlight_classPrivateFieldSet(_highlightOutlines,this,highlightOutlines);const extraThickness=1.5;highlight_classPrivateFieldSet(_focusOutlines,this,highlightOutlines.getNewOutline(highlight_classPrivateFieldGet(highlight_thickness,this)/2+extraThickness,0.0025));if(highlightId>=0){highlight_classPrivateFieldSet(highlight_id,this,highlightId);highlight_classPrivateFieldSet(_clipPathId,this,clipPathId);this.parent.drawLayer.finalizeLine(highlightId,highlightOutlines);highlight_classPrivateFieldSet(_outlineId,this,this.parent.drawLayer.highlightOutline(highlight_classPrivateFieldGet(_focusOutlines,this)));}else if(this.parent){const angle=this.parent.viewport.rotation;this.parent.drawLayer.updateLine(highlight_classPrivateFieldGet(highlight_id,this),highlightOutlines);this.parent.drawLayer.updateBox(highlight_classPrivateFieldGet(highlight_id,this),_rotateBbox.call(_HighlightEditor,highlight_classPrivateFieldGet(_highlightOutlines,this).box,(angle-this.rotation+360)%360));this.parent.drawLayer.updateLine(highlight_classPrivateFieldGet(_outlineId,this),highlight_classPrivateFieldGet(_focusOutlines,this));this.parent.drawLayer.updateBox(highlight_classPrivateFieldGet(_outlineId,this),_rotateBbox.call(_HighlightEditor,highlight_classPrivateFieldGet(_focusOutlines,this).box,angle));}const{x,y,width,height}=highlightOutlines.box;switch(this.rotation){case 0:this.x=x;this.y=y;this.width=width;this.height=height;break;case 90:{const[pageWidth,pageHeight]=this.parentDimensions;this.x=y;this.y=1-x;this.width=width*pageHeight/pageWidth;this.height=height*pageWidth/pageHeight;break;}case 180:this.x=1-x;this.y=1-y;this.width=width;this.height=height;break;case 270:{const[pageWidth,pageHeight]=this.parentDimensions;this.x=1-y;this.y=x;this.width=width*pageHeight/pageWidth;this.height=height*pageWidth/pageHeight;break;}}const{lastPoint}=highlight_classPrivateFieldGet(_focusOutlines,this).box;highlight_classPrivateFieldSet(_lastPoint,this,[(lastPoint[0]-x)/width,(lastPoint[1]-y)/height]);}function highlight_updateColor(color){const setColor=col=>{this.color=col;this.parent?.drawLayer.changeColor(highlight_classPrivateFieldGet(highlight_id,this),col);highlight_classPrivateFieldGet(highlight_colorPicker,this)?.updateColor(col);};const savedColor=this.color;this.addCommands({cmd:setColor.bind(this,color),undo:setColor.bind(this,savedColor),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.HIGHLIGHT_COLOR,overwriteIfSameType:true,keepUndo:true});this._reportTelemetry({action:"color_changed",color:this._uiManager.highlightColorNames.get(color)},true);this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"colorChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:color,previousValue:savedColor});}function _updateThickness(thickness){const savedThickness=highlight_classPrivateFieldGet(highlight_thickness,this);const setThickness=th=>{highlight_classPrivateFieldSet(highlight_thickness,this,th);highlight_assertClassBrand(_HighlightEditor_brand,this,_changeThickness).call(this,th);};this.addCommands({cmd:setThickness.bind(this,thickness),undo:setThickness.bind(this,savedThickness),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.INK_THICKNESS,overwriteIfSameType:true,keepUndo:true});this._reportTelemetry({action:"thickness_changed",thickness},true);this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"thicknessChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:thickness,previousValue:savedThickness});}function _changeThickness(thickness){if(!highlight_classPrivateFieldGet(_isFreeHighlight,this)){return;}highlight_assertClassBrand(_HighlightEditor_brand,this,_createFreeOutlines).call(this,{highlightOutlines:highlight_classPrivateFieldGet(_highlightOutlines,this).getNewOutline(thickness/2)});this.fixAndSetPosition();const[parentWidth,parentHeight]=this.parentDimensions;this.setDims(this.width*parentWidth,this.height*parentHeight);}function _cleanDrawLayer(){if(highlight_classPrivateFieldGet(highlight_id,this)===null||!this.parent){return;}this.parent.drawLayer.remove(highlight_classPrivateFieldGet(highlight_id,this));highlight_classPrivateFieldSet(highlight_id,this,null);this.parent.drawLayer.remove(highlight_classPrivateFieldGet(_outlineId,this));highlight_classPrivateFieldSet(_outlineId,this,null);}function _addToDrawLayer(){let parent=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.parent;if(highlight_classPrivateFieldGet(highlight_id,this)!==null){return;}({id:highlight_toSetter(highlight_classPrivateFieldSet,[highlight_id,this])._,clipPathId:highlight_toSetter(highlight_classPrivateFieldSet,[_clipPathId,this])._}=parent.drawLayer.highlight(highlight_classPrivateFieldGet(_highlightOutlines,this),this.color,highlight_classPrivateFieldGet(_opacity,this)));highlight_classPrivateFieldSet(_outlineId,this,parent.drawLayer.highlightOutline(highlight_classPrivateFieldGet(_focusOutlines,this)));if(highlight_classPrivateFieldGet(_highlightDiv,this)){highlight_classPrivateFieldGet(_highlightDiv,this).style.clipPath=highlight_classPrivateFieldGet(_clipPathId,this);}}function _rotateBbox(_ref3,angle){let{x,y,width,height}=_ref3;switch(angle){case 90:return{x:1-y-height,y:x,width:height,height:width};case 180:return{x:1-x-width,y:1-y-height,width,height};case 270:return{x:y,y:1-x-width,width:height,height:width};}return{x,y,width,height};}function _keydown(event){_HighlightEditor._keyboardManager.exec(this,event);}function _setCaret(start){if(!highlight_classPrivateFieldGet(_anchorNode,this)){return;}const selection=window.getSelection();if(start){selection.setPosition(highlight_classPrivateFieldGet(_anchorNode,this),highlight_classPrivateFieldGet(_anchorOffset,this));}else{selection.setPosition(highlight_classPrivateFieldGet(_focusNode,this),highlight_classPrivateFieldGet(_focusOffset,this));}}function _getRotation(){return highlight_classPrivateFieldGet(_isFreeHighlight,this)?this.rotation:0;}function _serializeBoxes(){if(highlight_classPrivateFieldGet(_isFreeHighlight,this)){return null;}const[pageWidth,pageHeight]=this.pageDimensions;const boxes=highlight_classPrivateFieldGet(_boxes,this);const quadPoints=new Array(boxes.length*8);let i=0;for(const{x,y,width,height}of boxes){const sx=x*pageWidth;const sy=(1-y-height)*pageHeight;quadPoints[i]=quadPoints[i+4]=sx;quadPoints[i+1]=quadPoints[i+3]=sy;quadPoints[i+2]=quadPoints[i+6]=sx+width*pageWidth;quadPoints[i+5]=quadPoints[i+7]=sy+height*pageHeight;i+=8;}return quadPoints;}function _serializeOutlines(rect){return highlight_classPrivateFieldGet(_highlightOutlines,this).serialize(rect,highlight_assertClassBrand(_HighlightEditor_brand,this,_getRotation).call(this));}function _highlightMove(parent,event){if(this._freeHighlight.add(event)){parent.drawLayer.updatePath(this._freeHighlightId,this._freeHighlight);}}function _endHighlight(parent,event){if(!this._freeHighlight.isEmpty()){parent.createAndAddNewEditor(event,false,{highlightId:this._freeHighlightId,highlightOutlines:this._freeHighlight.getOutlines(),clipPathId:this._freeHighlightClipId,methodOfCreation:"main_toolbar"});}else{parent.drawLayer.removeFreeHighlight(this._freeHighlightId);}this._freeHighlightId=-1;this._freeHighlight=null;this._freeHighlightClipId="";}highlight_defineProperty(HighlightEditor,"_defaultColor",null);highlight_defineProperty(HighlightEditor,"_defaultOpacity",1);highlight_defineProperty(HighlightEditor,"_defaultThickness",12);highlight_defineProperty(HighlightEditor,"_l10nPromise",void 0);highlight_defineProperty(HighlightEditor,"_type","highlight");highlight_defineProperty(HighlightEditor,"_editorType",AnnotationEditorType.HIGHLIGHT);highlight_defineProperty(HighlightEditor,"_freeHighlightId",-1);highlight_defineProperty(HighlightEditor,"_freeHighlight",null);highlight_defineProperty(HighlightEditor,"_freeHighlightClipId","");
;// CONCATENATED MODULE: ./src/display/editor/ink.js
var _InkEditor;function ink_classPrivateMethodInitSpec(e,a){ink_checkPrivateRedeclaration(e,a),a.add(e);}function ink_defineProperty(e,r,t){return(r=ink_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function ink_toPropertyKey(t){var i=ink_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function ink_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function ink_classPrivateFieldInitSpec(e,t,a){ink_checkPrivateRedeclaration(e,t),t.set(e,a);}function ink_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function ink_classPrivateFieldSet(s,a,r){return s.set(ink_assertClassBrand(s,a),r),r;}function ink_classPrivateFieldGet(s,a){return s.get(ink_assertClassBrand(s,a));}function ink_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _baseHeight=/*#__PURE__*/new WeakMap();var _baseWidth=/*#__PURE__*/new WeakMap();var _boundCanvasPointermove=/*#__PURE__*/new WeakMap();var _boundCanvasPointerleave=/*#__PURE__*/new WeakMap();var _boundCanvasPointerup=/*#__PURE__*/new WeakMap();var _boundCanvasPointerdown=/*#__PURE__*/new WeakMap();var _canvasContextMenuTimeoutId=/*#__PURE__*/new WeakMap();var _currentPath2D=/*#__PURE__*/new WeakMap();var _disableEditing=/*#__PURE__*/new WeakMap();var _hasSomethingToDraw=/*#__PURE__*/new WeakMap();var _isCanvasInitialized=/*#__PURE__*/new WeakMap();var _observer=/*#__PURE__*/new WeakMap();var _realWidth=/*#__PURE__*/new WeakMap();var _realHeight=/*#__PURE__*/new WeakMap();var _requestFrameCallback=/*#__PURE__*/new WeakMap();var _InkEditor_brand=/*#__PURE__*/new WeakSet();class InkEditor extends AnnotationEditor{constructor(params){super({...params,name:"inkEditor"});ink_classPrivateMethodInitSpec(this,_InkEditor_brand);ink_classPrivateFieldInitSpec(this,_baseHeight,0);ink_classPrivateFieldInitSpec(this,_baseWidth,0);ink_classPrivateFieldInitSpec(this,_boundCanvasPointermove,this.canvasPointermove.bind(this));ink_classPrivateFieldInitSpec(this,_boundCanvasPointerleave,this.canvasPointerleave.bind(this));ink_classPrivateFieldInitSpec(this,_boundCanvasPointerup,this.canvasPointerup.bind(this));ink_classPrivateFieldInitSpec(this,_boundCanvasPointerdown,this.canvasPointerdown.bind(this));ink_classPrivateFieldInitSpec(this,_canvasContextMenuTimeoutId,null);ink_classPrivateFieldInitSpec(this,_currentPath2D,new Path2D());ink_classPrivateFieldInitSpec(this,_disableEditing,false);ink_classPrivateFieldInitSpec(this,_hasSomethingToDraw,false);ink_classPrivateFieldInitSpec(this,_isCanvasInitialized,false);ink_classPrivateFieldInitSpec(this,_observer,null);ink_classPrivateFieldInitSpec(this,_realWidth,0);ink_classPrivateFieldInitSpec(this,_realHeight,0);ink_classPrivateFieldInitSpec(this,_requestFrameCallback,null);this.color=params.color||null;this.thickness=params.thickness||null;this.opacity=params.opacity||null;this.paths=[];this.bezierPath2D=[];this.allRawPaths=[];this.currentPath=[];this.scaleFactor=1;this.translationX=this.translationY=0;this.x=0;this.y=0;this._willKeepAspectRatio=true;}static initialize(l10n,uiManager){AnnotationEditor.initialize(l10n,uiManager);}static updateDefaultParams(type,value){switch(type){case AnnotationEditorParamsType.INK_THICKNESS:InkEditor._defaultThickness=value;break;case AnnotationEditorParamsType.INK_COLOR:InkEditor._defaultColor=value;break;case AnnotationEditorParamsType.INK_OPACITY:InkEditor._defaultOpacity=value/100;break;}}updateParams(type,value){switch(type){case AnnotationEditorParamsType.INK_THICKNESS:ink_assertClassBrand(_InkEditor_brand,this,ink_updateThickness).call(this,value);break;case AnnotationEditorParamsType.INK_COLOR:ink_assertClassBrand(_InkEditor_brand,this,ink_updateColor).call(this,value);break;case AnnotationEditorParamsType.INK_OPACITY:ink_assertClassBrand(_InkEditor_brand,this,_updateOpacity).call(this,value);break;}}static get defaultPropertiesToUpdate(){return[[AnnotationEditorParamsType.INK_THICKNESS,InkEditor._defaultThickness],[AnnotationEditorParamsType.INK_COLOR,InkEditor._defaultColor||AnnotationEditor._defaultLineColor],[AnnotationEditorParamsType.INK_OPACITY,Math.round(InkEditor._defaultOpacity*100)]];}get propertiesToUpdate(){return[[AnnotationEditorParamsType.INK_THICKNESS,this.thickness||InkEditor._defaultThickness],[AnnotationEditorParamsType.INK_COLOR,this.color||InkEditor._defaultColor||AnnotationEditor._defaultLineColor],[AnnotationEditorParamsType.INK_OPACITY,Math.round(100*(this.opacity??InkEditor._defaultOpacity))]];}rebuild(){if(!this.parent){return;}super.rebuild();if(this.div===null){return;}if(!this.canvas){ink_assertClassBrand(_InkEditor_brand,this,_createCanvas).call(this);ink_assertClassBrand(_InkEditor_brand,this,_createObserver).call(this);}if(!this.isAttachedToDOM){this.parent.add(this);ink_assertClassBrand(_InkEditor_brand,this,_setCanvasDims).call(this);}ink_assertClassBrand(_InkEditor_brand,this,_fitToContent).call(this);}remove(){if(this.canvas===null){return;}if(!this.isEmpty()){this.commit();}this.canvas.width=this.canvas.height=0;this.canvas.remove();this.canvas=null;if(ink_classPrivateFieldGet(_canvasContextMenuTimeoutId,this)){clearTimeout(ink_classPrivateFieldGet(_canvasContextMenuTimeoutId,this));ink_classPrivateFieldSet(_canvasContextMenuTimeoutId,this,null);}ink_classPrivateFieldGet(_observer,this).disconnect();ink_classPrivateFieldSet(_observer,this,null);super.remove();}setParent(parent){if(!this.parent&&parent){this._uiManager.removeShouldRescale(this);}else if(this.parent&&parent===null){this._uiManager.addShouldRescale(this);}super.setParent(parent);}onScaleChanging(){const[parentWidth,parentHeight]=this.parentDimensions;const width=this.width*parentWidth;const height=this.height*parentHeight;this.setDimensions(width,height);}enableEditMode(){if(ink_classPrivateFieldGet(_disableEditing,this)||this.canvas===null){return;}super.enableEditMode();this._isDraggable=false;this.canvas.addEventListener("pointerdown",ink_classPrivateFieldGet(_boundCanvasPointerdown,this));}disableEditMode(){if(!this.isInEditMode()||this.canvas===null){return;}super.disableEditMode();this._isDraggable=!this.isEmpty();this.div.classList.remove("editing");this.canvas.removeEventListener("pointerdown",ink_classPrivateFieldGet(_boundCanvasPointerdown,this));}onceAdded(){this._isDraggable=!this.isEmpty();}isEmpty(){return this.paths.length===0||this.paths.length===1&&this.paths[0].length===0;}commit(){if(ink_classPrivateFieldGet(_disableEditing,this)){return;}super.commit();this.isEditing=false;this.disableEditMode();this.setInForeground();ink_classPrivateFieldSet(_disableEditing,this,true);this.div.classList.add("disabled");ink_assertClassBrand(_InkEditor_brand,this,_fitToContent).call(this,true);this.select();this.parent.addInkEditorIfNeeded(true);this.moveInDOM();this.div.focus({preventScroll:true});}focusin(event){if(!this._focusEventsAllowed){return;}super.focusin(event);this.enableEditMode();}canvasPointerdown(event){if(event.button!==0||!this.isInEditMode()||ink_classPrivateFieldGet(_disableEditing,this)){return;}this.setInForeground();event.preventDefault();if(!this.div.contains(document.activeElement)){this.div.focus({preventScroll:true});}ink_assertClassBrand(_InkEditor_brand,this,_startDrawing).call(this,event.offsetX,event.offsetY);}canvasPointermove(event){event.preventDefault();ink_assertClassBrand(_InkEditor_brand,this,_draw).call(this,event.offsetX,event.offsetY);}canvasPointerup(event){event.preventDefault();ink_assertClassBrand(_InkEditor_brand,this,_endDrawing).call(this,event);}canvasPointerleave(event){ink_assertClassBrand(_InkEditor_brand,this,_endDrawing).call(this,event);}get isResizable(){return!this.isEmpty()&&ink_classPrivateFieldGet(_disableEditing,this);}render(){if(this.div){return this.div;}let baseX,baseY;if(this.width){baseX=this.x;baseY=this.y;}super.render();this.div.setAttribute("data-l10n-id","pdfjs-ink");const[x,y,w,h]=ink_assertClassBrand(_InkEditor_brand,this,_getInitialBBox).call(this);this.setAt(x,y,0,0);this.setDims(w,h);ink_assertClassBrand(_InkEditor_brand,this,_createCanvas).call(this);if(this.width){const[parentWidth,parentHeight]=this.parentDimensions;this.setAspectRatio(this.width*parentWidth,this.height*parentHeight);this.setAt(baseX*parentWidth,baseY*parentHeight,this.width*parentWidth,this.height*parentHeight);ink_classPrivateFieldSet(_isCanvasInitialized,this,true);ink_assertClassBrand(_InkEditor_brand,this,_setCanvasDims).call(this);this.setDims(this.width*parentWidth,this.height*parentHeight);ink_assertClassBrand(_InkEditor_brand,this,_redraw).call(this);this.div.classList.add("disabled");}else{this.div.classList.add("editing");this.enableEditMode();}ink_assertClassBrand(_InkEditor_brand,this,_createObserver).call(this);return this.div;}setDimensions(width,height){const roundedWidth=Math.round(width);const roundedHeight=Math.round(height);if(ink_classPrivateFieldGet(_realWidth,this)===roundedWidth&&ink_classPrivateFieldGet(_realHeight,this)===roundedHeight){return;}ink_classPrivateFieldSet(_realWidth,this,roundedWidth);ink_classPrivateFieldSet(_realHeight,this,roundedHeight);this.canvas.style.visibility="hidden";const[parentWidth,parentHeight]=this.parentDimensions;this.width=width/parentWidth;this.height=height/parentHeight;this.fixAndSetPosition();if(ink_classPrivateFieldGet(_disableEditing,this)){ink_assertClassBrand(_InkEditor_brand,this,_setScaleFactor).call(this,width,height);}ink_assertClassBrand(_InkEditor_brand,this,_setCanvasDims).call(this);ink_assertClassBrand(_InkEditor_brand,this,_redraw).call(this);this.canvas.style.visibility="visible";this.fixDims();}static deserialize(data,parent,uiManager){if(data instanceof InkAnnotationElement){return null;}const editor=super.deserialize(data,parent,uiManager);editor.thickness=data.thickness;editor.color=Util.makeHexColor(...data.color);editor.opacity=data.opacity;const[pageWidth,pageHeight]=editor.pageDimensions;const width=editor.width*pageWidth;const height=editor.height*pageHeight;const scaleFactor=editor.parentScale;const padding=data.thickness/2;ink_classPrivateFieldSet(_disableEditing,editor,true);ink_classPrivateFieldSet(_realWidth,editor,Math.round(width));ink_classPrivateFieldSet(_realHeight,editor,Math.round(height));const{paths,rect,rotation}=data;for(let{bezier}of paths){bezier=_fromPDFCoordinates.call(InkEditor,bezier,rect,rotation);const path=[];editor.paths.push(path);let p0=scaleFactor*(bezier[0]-padding);let p1=scaleFactor*(bezier[1]-padding);for(let i=2,ii=bezier.length;i<ii;i+=6){const p10=scaleFactor*(bezier[i]-padding);const p11=scaleFactor*(bezier[i+1]-padding);const p20=scaleFactor*(bezier[i+2]-padding);const p21=scaleFactor*(bezier[i+3]-padding);const p30=scaleFactor*(bezier[i+4]-padding);const p31=scaleFactor*(bezier[i+5]-padding);path.push([[p0,p1],[p10,p11],[p20,p21],[p30,p31]]);p0=p30;p1=p31;}const path2D=ink_assertClassBrand(InkEditor,this,_buildPath2D).call(this,path);editor.bezierPath2D.push(path2D);}const bbox=ink_assertClassBrand(_InkEditor_brand,editor,_getBbox).call(editor);ink_classPrivateFieldSet(_baseWidth,editor,Math.max(AnnotationEditor.MIN_SIZE,bbox[2]-bbox[0]));ink_classPrivateFieldSet(_baseHeight,editor,Math.max(AnnotationEditor.MIN_SIZE,bbox[3]-bbox[1]));ink_assertClassBrand(_InkEditor_brand,editor,_setScaleFactor).call(editor,width,height);return editor;}serialize(){if(this.isEmpty()){return null;}const rect=this.getRect(0,0);const color=AnnotationEditor._colorManager.convert(this.ctx.strokeStyle);return{annotationType:AnnotationEditorType.INK,color,thickness:this.thickness,opacity:this.opacity,paths:ink_assertClassBrand(_InkEditor_brand,this,_serializePaths).call(this,this.scaleFactor/this.parentScale,this.translationX,this.translationY,rect),pageIndex:this.pageIndex,rect,rotation:this.rotation,structTreeParentId:this._structTreeParentId};}}_InkEditor=InkEditor;function ink_updateThickness(thickness){const setThickness=th=>{this.thickness=th;ink_assertClassBrand(_InkEditor_brand,this,_fitToContent).call(this);};const savedThickness=this.thickness;this.addCommands({cmd:setThickness.bind(this,thickness),undo:setThickness.bind(this,savedThickness),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.INK_THICKNESS,overwriteIfSameType:true,keepUndo:true});this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"thicknessChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:thickness,previousValue:savedThickness});}function ink_updateColor(color){const setColor=col=>{this.color=col;ink_assertClassBrand(_InkEditor_brand,this,_redraw).call(this);};const savedColor=this.color;this.addCommands({cmd:setColor.bind(this,color),undo:setColor.bind(this,savedColor),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.INK_COLOR,overwriteIfSameType:true,keepUndo:true});this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"colorChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:color,previousValue:savedColor});}function _updateOpacity(opacity){const setOpacity=op=>{this.opacity=op;ink_assertClassBrand(_InkEditor_brand,this,_redraw).call(this);};opacity/=100;const savedOpacity=this.opacity;this.addCommands({cmd:setOpacity.bind(this,opacity),undo:setOpacity.bind(this,savedOpacity),post:this._uiManager.updateUI.bind(this._uiManager,this),mustExec:true,type:AnnotationEditorParamsType.INK_OPACITY,overwriteIfSameType:true,keepUndo:true});this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"opacityChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:opacity,previousValue:savedOpacity});}function _getInitialBBox(){const{parentRotation,parentDimensions:[width,height]}=this;switch(parentRotation){case 90:return[0,height,height,width];case 180:return[width,height,width,height];case 270:return[width,0,height,width];default:return[0,0,width,height];}}function _setStroke(){const{ctx,color,opacity,thickness,parentScale,scaleFactor}=this;ctx.lineWidth=thickness*parentScale/scaleFactor;ctx.lineCap="round";ctx.lineJoin="round";ctx.miterLimit=10;ctx.strokeStyle=`${color}${opacityToHex(opacity)}`;}function _startDrawing(x,y){this.canvas.addEventListener("contextmenu",noContextMenu);this.canvas.addEventListener("pointerleave",ink_classPrivateFieldGet(_boundCanvasPointerleave,this));this.canvas.addEventListener("pointermove",ink_classPrivateFieldGet(_boundCanvasPointermove,this));this.canvas.addEventListener("pointerup",ink_classPrivateFieldGet(_boundCanvasPointerup,this));this.canvas.removeEventListener("pointerdown",ink_classPrivateFieldGet(_boundCanvasPointerdown,this));this.isEditing=true;if(!ink_classPrivateFieldGet(_isCanvasInitialized,this)){ink_classPrivateFieldSet(_isCanvasInitialized,this,true);ink_assertClassBrand(_InkEditor_brand,this,_setCanvasDims).call(this);this.thickness||=_InkEditor._defaultThickness;this.color||=_InkEditor._defaultColor||AnnotationEditor._defaultLineColor;this.opacity??=_InkEditor._defaultOpacity;}this.currentPath.push([x,y]);ink_classPrivateFieldSet(_hasSomethingToDraw,this,false);ink_assertClassBrand(_InkEditor_brand,this,_setStroke).call(this);ink_classPrivateFieldSet(_requestFrameCallback,this,()=>{ink_assertClassBrand(_InkEditor_brand,this,_drawPoints).call(this);if(ink_classPrivateFieldGet(_requestFrameCallback,this)){window.requestAnimationFrame(ink_classPrivateFieldGet(_requestFrameCallback,this));}});window.requestAnimationFrame(ink_classPrivateFieldGet(_requestFrameCallback,this));}function _draw(x,y){const[lastX,lastY]=this.currentPath.at(-1);if(this.currentPath.length>1&&x===lastX&&y===lastY){return;}const currentPath=this.currentPath;let path2D=ink_classPrivateFieldGet(_currentPath2D,this);currentPath.push([x,y]);ink_classPrivateFieldSet(_hasSomethingToDraw,this,true);if(currentPath.length<=2){path2D.moveTo(...currentPath[0]);path2D.lineTo(x,y);return;}if(currentPath.length===3){ink_classPrivateFieldSet(_currentPath2D,this,path2D=new Path2D());path2D.moveTo(...currentPath[0]);}ink_assertClassBrand(_InkEditor_brand,this,_makeBezierCurve).call(this,path2D,...currentPath.at(-3),...currentPath.at(-2),x,y);}function _endPath(){if(this.currentPath.length===0){return;}const lastPoint=this.currentPath.at(-1);ink_classPrivateFieldGet(_currentPath2D,this).lineTo(...lastPoint);}function _stopDrawing(x,y){ink_classPrivateFieldSet(_requestFrameCallback,this,null);x=Math.min(Math.max(x,0),this.canvas.width);y=Math.min(Math.max(y,0),this.canvas.height);ink_assertClassBrand(_InkEditor_brand,this,_draw).call(this,x,y);ink_assertClassBrand(_InkEditor_brand,this,_endPath).call(this);let bezier;if(this.currentPath.length!==1){bezier=ink_assertClassBrand(_InkEditor_brand,this,_generateBezierPoints).call(this);}else{const xy=[x,y];bezier=[[xy,xy.slice(),xy.slice(),xy]];}const path2D=ink_classPrivateFieldGet(_currentPath2D,this);const currentPath=this.currentPath;this.currentPath=[];ink_classPrivateFieldSet(_currentPath2D,this,new Path2D());const cmd=()=>{this.allRawPaths.push(currentPath);this.paths.push(bezier);this.bezierPath2D.push(path2D);this._uiManager.rebuild(this);};const undo=()=>{this.allRawPaths.pop();this.paths.pop();this.bezierPath2D.pop();if(this.paths.length===0){this.remove();}else{if(!this.canvas){ink_assertClassBrand(_InkEditor_brand,this,_createCanvas).call(this);ink_assertClassBrand(_InkEditor_brand,this,_createObserver).call(this);}ink_assertClassBrand(_InkEditor_brand,this,_fitToContent).call(this);}};this.addCommands({cmd,undo,mustExec:true});this.eventBus?.dispatch("annotation-editor-event",{source:this,type:"bezierPathChanged",page:this.pageIndex+1,editorType:this.constructor.name,value:bezier,previousValue:currentPath});}function _drawPoints(){if(!ink_classPrivateFieldGet(_hasSomethingToDraw,this)){return;}ink_classPrivateFieldSet(_hasSomethingToDraw,this,false);const thickness=Math.ceil(this.thickness*this.parentScale);const lastPoints=this.currentPath.slice(-3);const x=lastPoints.map(xy=>xy[0]);const y=lastPoints.map(xy=>xy[1]);const xMin=Math.min(...x)-thickness;const xMax=Math.max(...x)+thickness;const yMin=Math.min(...y)-thickness;const yMax=Math.max(...y)+thickness;const{ctx}=this;ctx.save();ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(const path of this.bezierPath2D){ctx.stroke(path);}ctx.stroke(ink_classPrivateFieldGet(_currentPath2D,this));ctx.restore();}function _makeBezierCurve(path2D,x0,y0,x1,y1,x2,y2){const prevX=(x0+x1)/2;const prevY=(y0+y1)/2;const x3=(x1+x2)/2;const y3=(y1+y2)/2;path2D.bezierCurveTo(prevX+2*(x1-prevX)/3,prevY+2*(y1-prevY)/3,x3+2*(x1-x3)/3,y3+2*(y1-y3)/3,x3,y3);}function _generateBezierPoints(){const path=this.currentPath;if(path.length<=2){return[[path[0],path[0],path.at(-1),path.at(-1)]];}const bezierPoints=[];let i;let[x0,y0]=path[0];for(i=1;i<path.length-2;i++){const[x1,y1]=path[i];const[x2,y2]=path[i+1];const x3=(x1+x2)/2;const y3=(y1+y2)/2;const control1=[x0+2*(x1-x0)/3,y0+2*(y1-y0)/3];const control2=[x3+2*(x1-x3)/3,y3+2*(y1-y3)/3];bezierPoints.push([[x0,y0],control1,control2,[x3,y3]]);[x0,y0]=[x3,y3];}const[x1,y1]=path[i];const[x2,y2]=path[i+1];const control1=[x0+2*(x1-x0)/3,y0+2*(y1-y0)/3];const control2=[x2+2*(x1-x2)/3,y2+2*(y1-y2)/3];bezierPoints.push([[x0,y0],control1,control2,[x2,y2]]);return bezierPoints;}function _redraw(){if(this.isEmpty()){ink_assertClassBrand(_InkEditor_brand,this,_updateTransform).call(this);return;}ink_assertClassBrand(_InkEditor_brand,this,_setStroke).call(this);const{canvas,ctx}=this;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ink_assertClassBrand(_InkEditor_brand,this,_updateTransform).call(this);for(const path of this.bezierPath2D){ctx.stroke(path);}}function _endDrawing(event){this.canvas.removeEventListener("pointerleave",ink_classPrivateFieldGet(_boundCanvasPointerleave,this));this.canvas.removeEventListener("pointermove",ink_classPrivateFieldGet(_boundCanvasPointermove,this));this.canvas.removeEventListener("pointerup",ink_classPrivateFieldGet(_boundCanvasPointerup,this));this.canvas.addEventListener("pointerdown",ink_classPrivateFieldGet(_boundCanvasPointerdown,this));if(ink_classPrivateFieldGet(_canvasContextMenuTimeoutId,this)){clearTimeout(ink_classPrivateFieldGet(_canvasContextMenuTimeoutId,this));}ink_classPrivateFieldSet(_canvasContextMenuTimeoutId,this,setTimeout(()=>{ink_classPrivateFieldSet(_canvasContextMenuTimeoutId,this,null);this.canvas.removeEventListener("contextmenu",noContextMenu);},10));ink_assertClassBrand(_InkEditor_brand,this,_stopDrawing).call(this,event.offsetX,event.offsetY);this.addToAnnotationStorage();this.setInBackground();}function _createCanvas(){this.canvas=document.createElement("canvas");this.canvas.width=this.canvas.height=0;this.canvas.className="inkEditorCanvas";this.canvas.setAttribute("data-l10n-id","pdfjs-ink-canvas");this.div.append(this.canvas);const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;this.ctx=this.canvas.getContext("2d",options);}function _createObserver(){ink_classPrivateFieldSet(_observer,this,new ResizeObserver(entries=>{const rect=entries[0].contentRect;if(rect.width&&rect.height){this.setDimensions(rect.width,rect.height);}}));ink_classPrivateFieldGet(_observer,this).observe(this.div);}function _setCanvasDims(){if(!ink_classPrivateFieldGet(_isCanvasInitialized,this)){return;}const[parentWidth,parentHeight]=this.parentDimensions;this.canvas.width=Math.ceil(this.width*parentWidth);this.canvas.height=Math.ceil(this.height*parentHeight);ink_assertClassBrand(_InkEditor_brand,this,_updateTransform).call(this);}function _setScaleFactor(width,height){const padding=ink_assertClassBrand(_InkEditor_brand,this,_getPadding).call(this);const scaleFactorW=(width-padding)/ink_classPrivateFieldGet(_baseWidth,this);const scaleFactorH=(height-padding)/ink_classPrivateFieldGet(_baseHeight,this);this.scaleFactor=Math.min(scaleFactorW,scaleFactorH);}function _updateTransform(){const padding=ink_assertClassBrand(_InkEditor_brand,this,_getPadding).call(this)/2;this.ctx.setTransform(this.scaleFactor,0,0,this.scaleFactor,this.translationX*this.scaleFactor+padding,this.translationY*this.scaleFactor+padding);}function _buildPath2D(bezier){const path2D=new Path2D();for(let i=0,ii=bezier.length;i<ii;i++){const[first,control1,control2,second]=bezier[i];if(i===0){path2D.moveTo(...first);}path2D.bezierCurveTo(control1[0],control1[1],control2[0],control2[1],second[0],second[1]);}return path2D;}function _toPDFCoordinates(points,rect,rotation){const[blX,blY,trX,trY]=rect;switch(rotation){case 0:for(let i=0,ii=points.length;i<ii;i+=2){points[i]+=blX;points[i+1]=trY-points[i+1];}break;case 90:for(let i=0,ii=points.length;i<ii;i+=2){const x=points[i];points[i]=points[i+1]+blX;points[i+1]=x+blY;}break;case 180:for(let i=0,ii=points.length;i<ii;i+=2){points[i]=trX-points[i];points[i+1]+=blY;}break;case 270:for(let i=0,ii=points.length;i<ii;i+=2){const x=points[i];points[i]=trX-points[i+1];points[i+1]=trY-x;}break;default:throw new Error("Invalid rotation");}return points;}function _fromPDFCoordinates(points,rect,rotation){const[blX,blY,trX,trY]=rect;switch(rotation){case 0:for(let i=0,ii=points.length;i<ii;i+=2){points[i]-=blX;points[i+1]=trY-points[i+1];}break;case 90:for(let i=0,ii=points.length;i<ii;i+=2){const x=points[i];points[i]=points[i+1]-blY;points[i+1]=x-blX;}break;case 180:for(let i=0,ii=points.length;i<ii;i+=2){points[i]=trX-points[i];points[i+1]-=blY;}break;case 270:for(let i=0,ii=points.length;i<ii;i+=2){const x=points[i];points[i]=trY-points[i+1];points[i+1]=trX-x;}break;default:throw new Error("Invalid rotation");}return points;}function _serializePaths(s,tx,ty,rect){const paths=[];const padding=this.thickness/2;const shiftX=s*tx+padding;const shiftY=s*ty+padding;for(const bezier of this.paths){const buffer=[];const points=[];for(let j=0,jj=bezier.length;j<jj;j++){const[first,control1,control2,second]=bezier[j];if(first[0]===second[0]&&first[1]===second[1]&&jj===1){const p0=s*first[0]+shiftX;const p1=s*first[1]+shiftY;buffer.push(p0,p1);points.push(p0,p1);break;}const p10=s*first[0]+shiftX;const p11=s*first[1]+shiftY;const p20=s*control1[0]+shiftX;const p21=s*control1[1]+shiftY;const p30=s*control2[0]+shiftX;const p31=s*control2[1]+shiftY;const p40=s*second[0]+shiftX;const p41=s*second[1]+shiftY;if(j===0){buffer.push(p10,p11);points.push(p10,p11);}buffer.push(p20,p21,p30,p31,p40,p41);points.push(p20,p21);if(j===jj-1){points.push(p40,p41);}}paths.push({bezier:_toPDFCoordinates.call(_InkEditor,buffer,rect,this.rotation),points:_toPDFCoordinates.call(_InkEditor,points,rect,this.rotation)});}return paths;}function _getBbox(){let xMin=Infinity;let xMax=-Infinity;let yMin=Infinity;let yMax=-Infinity;for(const path of this.paths){for(const[first,control1,control2,second]of path){const bbox=Util.bezierBoundingBox(...first,...control1,...control2,...second);xMin=Math.min(xMin,bbox[0]);yMin=Math.min(yMin,bbox[1]);xMax=Math.max(xMax,bbox[2]);yMax=Math.max(yMax,bbox[3]);}}return[xMin,yMin,xMax,yMax];}function _getPadding(){return ink_classPrivateFieldGet(_disableEditing,this)?Math.ceil(this.thickness*this.parentScale):0;}function _fitToContent(){let firstTime=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(this.isEmpty()){return;}if(!ink_classPrivateFieldGet(_disableEditing,this)){ink_assertClassBrand(_InkEditor_brand,this,_redraw).call(this);return;}const bbox=ink_assertClassBrand(_InkEditor_brand,this,_getBbox).call(this);const padding=ink_assertClassBrand(_InkEditor_brand,this,_getPadding).call(this);ink_classPrivateFieldSet(_baseWidth,this,Math.max(AnnotationEditor.MIN_SIZE,bbox[2]-bbox[0]));ink_classPrivateFieldSet(_baseHeight,this,Math.max(AnnotationEditor.MIN_SIZE,bbox[3]-bbox[1]));const width=Math.ceil(padding+ink_classPrivateFieldGet(_baseWidth,this)*this.scaleFactor);const height=Math.ceil(padding+ink_classPrivateFieldGet(_baseHeight,this)*this.scaleFactor);const[parentWidth,parentHeight]=this.parentDimensions;this.width=width/parentWidth;this.height=height/parentHeight;this.setAspectRatio(width,height);const prevTranslationX=this.translationX;const prevTranslationY=this.translationY;this.translationX=-bbox[0];this.translationY=-bbox[1];ink_assertClassBrand(_InkEditor_brand,this,_setCanvasDims).call(this);ink_assertClassBrand(_InkEditor_brand,this,_redraw).call(this);ink_classPrivateFieldSet(_realWidth,this,width);ink_classPrivateFieldSet(_realHeight,this,height);this.setDims(width,height);const unscaledPadding=firstTime?padding/this.scaleFactor/2:0;this.translate(prevTranslationX-this.translationX-unscaledPadding,prevTranslationY-this.translationY-unscaledPadding);}ink_defineProperty(InkEditor,"_defaultColor",null);ink_defineProperty(InkEditor,"_defaultOpacity",1);ink_defineProperty(InkEditor,"_defaultThickness",1);ink_defineProperty(InkEditor,"_type","ink");ink_defineProperty(InkEditor,"_editorType",AnnotationEditorType.INK);
;// CONCATENATED MODULE: ./src/display/editor/stamp.js
var _StampEditor;function stamp_classPrivateMethodInitSpec(e,a){stamp_checkPrivateRedeclaration(e,a),a.add(e);}function stamp_defineProperty(e,r,t){return(r=stamp_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function stamp_toPropertyKey(t){var i=stamp_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function stamp_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function stamp_classPrivateFieldInitSpec(e,t,a){stamp_checkPrivateRedeclaration(e,t),t.set(e,a);}function stamp_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function stamp_classPrivateFieldGet(s,a){return s.get(stamp_assertClassBrand(s,a));}function stamp_classPrivateFieldSet(s,a,r){return s.set(stamp_assertClassBrand(s,a),r),r;}function stamp_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _bitmap=/*#__PURE__*/new WeakMap();var _bitmapId=/*#__PURE__*/new WeakMap();var _bitmapPromise=/*#__PURE__*/new WeakMap();var _bitmapUrl=/*#__PURE__*/new WeakMap();var _bitmapFile=/*#__PURE__*/new WeakMap();var _bitmapFileName=/*#__PURE__*/new WeakMap();var _canvas=/*#__PURE__*/new WeakMap();var stamp_observer=/*#__PURE__*/new WeakMap();var _resizeTimeoutId=/*#__PURE__*/new WeakMap();var _isSvg=/*#__PURE__*/new WeakMap();var _hasBeenAddedInUndoStack=/*#__PURE__*/new WeakMap();var _StampEditor_brand=/*#__PURE__*/new WeakSet();class StampEditor extends AnnotationEditor{constructor(params){super({...params,name:"stampEditor"});stamp_classPrivateMethodInitSpec(this,_StampEditor_brand);stamp_classPrivateFieldInitSpec(this,_bitmap,null);stamp_classPrivateFieldInitSpec(this,_bitmapId,null);stamp_classPrivateFieldInitSpec(this,_bitmapPromise,null);stamp_classPrivateFieldInitSpec(this,_bitmapUrl,null);stamp_classPrivateFieldInitSpec(this,_bitmapFile,null);stamp_classPrivateFieldInitSpec(this,_bitmapFileName,"");stamp_classPrivateFieldInitSpec(this,_canvas,null);stamp_classPrivateFieldInitSpec(this,stamp_observer,null);stamp_classPrivateFieldInitSpec(this,_resizeTimeoutId,null);stamp_classPrivateFieldInitSpec(this,_isSvg,false);stamp_classPrivateFieldInitSpec(this,_hasBeenAddedInUndoStack,false);stamp_classPrivateFieldSet(_bitmapUrl,this,params.bitmapUrl);stamp_classPrivateFieldSet(_bitmapFile,this,params.bitmapFile);}static initialize(l10n,uiManager){AnnotationEditor.initialize(l10n,uiManager);}static get supportedTypes(){const types=["apng","avif","bmp","gif","jpeg","png","svg+xml","webp","x-icon"];return shadow(this,"supportedTypes",types.map(type=>`image/${type}`));}static get supportedTypesStr(){return shadow(this,"supportedTypesStr",this.supportedTypes.join(","));}static isHandlingMimeForPasting(mime){return this.supportedTypes.includes(mime);}static paste(item,parent){parent.pasteEditor(AnnotationEditorType.STAMP,{bitmapFile:item.getAsFile()});}remove(){if(stamp_classPrivateFieldGet(_bitmapId,this)){stamp_classPrivateFieldSet(_bitmap,this,null);this._uiManager.imageManager.deleteId(stamp_classPrivateFieldGet(_bitmapId,this));stamp_classPrivateFieldGet(_canvas,this)?.remove();stamp_classPrivateFieldSet(_canvas,this,null);stamp_classPrivateFieldGet(stamp_observer,this)?.disconnect();stamp_classPrivateFieldSet(stamp_observer,this,null);if(stamp_classPrivateFieldGet(_resizeTimeoutId,this)){clearTimeout(stamp_classPrivateFieldGet(_resizeTimeoutId,this));stamp_classPrivateFieldSet(_resizeTimeoutId,this,null);}}super.remove();}rebuild(){if(!this.parent){if(stamp_classPrivateFieldGet(_bitmapId,this)){stamp_assertClassBrand(_StampEditor_brand,this,_getBitmap).call(this);}return;}super.rebuild();if(this.div===null){return;}if(stamp_classPrivateFieldGet(_bitmapId,this)&&stamp_classPrivateFieldGet(_canvas,this)===null){stamp_assertClassBrand(_StampEditor_brand,this,_getBitmap).call(this);}if(!this.isAttachedToDOM){this.parent.add(this);}}onceAdded(){this._isDraggable=true;this.div.focus();}isEmpty(){return!(stamp_classPrivateFieldGet(_bitmapPromise,this)||stamp_classPrivateFieldGet(_bitmap,this)||stamp_classPrivateFieldGet(_bitmapUrl,this)||stamp_classPrivateFieldGet(_bitmapFile,this)||stamp_classPrivateFieldGet(_bitmapId,this));}get isResizable(){return true;}render(){if(this.div){return this.div;}let baseX,baseY;if(this.width){baseX=this.x;baseY=this.y;}super.render();this.div.hidden=true;this.addAltTextButton();if(stamp_classPrivateFieldGet(_bitmap,this)){stamp_assertClassBrand(_StampEditor_brand,this,stamp_createCanvas).call(this);}else{stamp_assertClassBrand(_StampEditor_brand,this,_getBitmap).call(this);}if(this.width){const[parentWidth,parentHeight]=this.parentDimensions;this.setAt(baseX*parentWidth,baseY*parentHeight,this.width*parentWidth,this.height*parentHeight);}return this.div;}getImageForAltText(){return stamp_classPrivateFieldGet(_canvas,this);}static deserialize(data,parent,uiManager){if(data instanceof StampAnnotationElement){return null;}const editor=super.deserialize(data,parent,uiManager);const{rect,bitmapUrl,bitmapId,isSvg,accessibilityData}=data;if(bitmapId&&uiManager.imageManager.isValidId(bitmapId)){stamp_classPrivateFieldSet(_bitmapId,editor,bitmapId);}else{stamp_classPrivateFieldSet(_bitmapUrl,editor,bitmapUrl);}stamp_classPrivateFieldSet(_isSvg,editor,isSvg);const[parentWidth,parentHeight]=editor.pageDimensions;editor.width=(rect[2]-rect[0])/parentWidth;editor.height=(rect[3]-rect[1])/parentHeight;if(accessibilityData){editor.altTextData=accessibilityData;}return editor;}serialize(){let isForCopying=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;let context=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;if(this.isEmpty()){return null;}const serialized={annotationType:AnnotationEditorType.STAMP,bitmapId:stamp_classPrivateFieldGet(_bitmapId,this),pageIndex:this.pageIndex,rect:this.getRect(0,0),rotation:this.rotation,isSvg:stamp_classPrivateFieldGet(_isSvg,this),structTreeParentId:this._structTreeParentId};if(isForCopying){serialized.bitmapUrl=stamp_assertClassBrand(_StampEditor_brand,this,_serializeBitmap).call(this,true);serialized.accessibilityData=this.altTextData;return serialized;}const{decorative,altText}=this.altTextData;if(!decorative&&altText){serialized.accessibilityData={type:"Figure",alt:altText};}if(context===null){return serialized;}context.stamps||=new Map();const area=stamp_classPrivateFieldGet(_isSvg,this)?(serialized.rect[2]-serialized.rect[0])*(serialized.rect[3]-serialized.rect[1]):null;if(!context.stamps.has(stamp_classPrivateFieldGet(_bitmapId,this))){context.stamps.set(stamp_classPrivateFieldGet(_bitmapId,this),{area,serialized});serialized.bitmap=stamp_assertClassBrand(_StampEditor_brand,this,_serializeBitmap).call(this,false);}else if(stamp_classPrivateFieldGet(_isSvg,this)){const prevData=context.stamps.get(stamp_classPrivateFieldGet(_bitmapId,this));if(area>prevData.area){prevData.area=area;prevData.serialized.bitmap.close();prevData.serialized.bitmap=stamp_assertClassBrand(_StampEditor_brand,this,_serializeBitmap).call(this,false);}}return serialized;}}_StampEditor=StampEditor;function _getBitmapFetched(data){let fromId=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(!data){this.remove();return;}stamp_classPrivateFieldSet(_bitmap,this,data.bitmap);if(!fromId){stamp_classPrivateFieldSet(_bitmapId,this,data.id);stamp_classPrivateFieldSet(_isSvg,this,data.isSvg);}if(data.file){stamp_classPrivateFieldSet(_bitmapFileName,this,data.file.name);}stamp_assertClassBrand(_StampEditor_brand,this,stamp_createCanvas).call(this);}function _getBitmapDone(){stamp_classPrivateFieldSet(_bitmapPromise,this,null);this._uiManager.enableWaiting(false);if(stamp_classPrivateFieldGet(_canvas,this)){this.div.focus();}}function _getBitmap(){if(stamp_classPrivateFieldGet(_bitmapId,this)){this._uiManager.enableWaiting(true);this._uiManager.imageManager.getFromId(stamp_classPrivateFieldGet(_bitmapId,this)).then(data=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapFetched).call(this,data,true)).finally(()=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapDone).call(this));return;}if(stamp_classPrivateFieldGet(_bitmapUrl,this)){const url=stamp_classPrivateFieldGet(_bitmapUrl,this);stamp_classPrivateFieldSet(_bitmapUrl,this,null);this._uiManager.enableWaiting(true);stamp_classPrivateFieldSet(_bitmapPromise,this,this._uiManager.imageManager.getFromUrl(url).then(data=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapFetched).call(this,data)).finally(()=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapDone).call(this)));return;}if(stamp_classPrivateFieldGet(_bitmapFile,this)){const file=stamp_classPrivateFieldGet(_bitmapFile,this);stamp_classPrivateFieldSet(_bitmapFile,this,null);this._uiManager.enableWaiting(true);stamp_classPrivateFieldSet(_bitmapPromise,this,this._uiManager.imageManager.getFromFile(file).then(data=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapFetched).call(this,data)).finally(()=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapDone).call(this)));return;}const input=document.createElement("input");input.type="file";input.accept=_StampEditor.supportedTypesStr;stamp_classPrivateFieldSet(_bitmapPromise,this,new Promise(resolve=>{input.addEventListener("change",async()=>{if(!input.files||input.files.length===0){this.remove();}else{this._uiManager.enableWaiting(true);const data=await this._uiManager.imageManager.getFromFile(input.files[0]);stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapFetched).call(this,data);}resolve();});input.addEventListener("cancel",()=>{this.remove();resolve();});}).finally(()=>stamp_assertClassBrand(_StampEditor_brand,this,_getBitmapDone).call(this)));input.click();}function stamp_createCanvas(){const{div}=this;let{width,height}=stamp_classPrivateFieldGet(_bitmap,this);const[pageWidth,pageHeight]=this.pageDimensions;const MAX_RATIO=0.75;if(this.width){width=this.width*pageWidth;height=this.height*pageHeight;}else if(width>MAX_RATIO*pageWidth||height>MAX_RATIO*pageHeight){const factor=Math.min(MAX_RATIO*pageWidth/width,MAX_RATIO*pageHeight/height);width*=factor;height*=factor;}const[parentWidth,parentHeight]=this.parentDimensions;this.setDims(width*parentWidth/pageWidth,height*parentHeight/pageHeight);this._uiManager.enableWaiting(false);const canvas=stamp_classPrivateFieldSet(_canvas,this,document.createElement("canvas"));div.append(canvas);div.hidden=false;stamp_assertClassBrand(_StampEditor_brand,this,_drawBitmap).call(this,width,height);stamp_assertClassBrand(_StampEditor_brand,this,stamp_createObserver).call(this);if(!stamp_classPrivateFieldGet(_hasBeenAddedInUndoStack,this)){this.parent.addUndoableEditor(this);stamp_classPrivateFieldSet(_hasBeenAddedInUndoStack,this,true);}this._reportTelemetry({action:"inserted_image"});if(stamp_classPrivateFieldGet(_bitmapFileName,this)){canvas.setAttribute("aria-label",stamp_classPrivateFieldGet(_bitmapFileName,this));}}function _setDimensions(width,height){const[parentWidth,parentHeight]=this.parentDimensions;this.width=width/parentWidth;this.height=height/parentHeight;this.setDims(width,height);if(this._initialOptions?.isCentered){this.center();}else{this.fixAndSetPosition();}this._initialOptions=null;if(stamp_classPrivateFieldGet(_resizeTimeoutId,this)!==null){clearTimeout(stamp_classPrivateFieldGet(_resizeTimeoutId,this));}const TIME_TO_WAIT=200;stamp_classPrivateFieldSet(_resizeTimeoutId,this,setTimeout(()=>{stamp_classPrivateFieldSet(_resizeTimeoutId,this,null);stamp_assertClassBrand(_StampEditor_brand,this,_drawBitmap).call(this,width,height);},TIME_TO_WAIT));}function _scaleBitmap(width,height){const{width:bitmapWidth,height:bitmapHeight}=stamp_classPrivateFieldGet(_bitmap,this);let newWidth=bitmapWidth;let newHeight=bitmapHeight;let bitmap=stamp_classPrivateFieldGet(_bitmap,this);while(newWidth>2*width||newHeight>2*height){const prevWidth=newWidth;const prevHeight=newHeight;if(newWidth>2*width){newWidth=newWidth>=16384?Math.floor(newWidth/2)-1:Math.ceil(newWidth/2);}if(newHeight>2*height){newHeight=newHeight>=16384?Math.floor(newHeight/2)-1:Math.ceil(newHeight/2);}const offscreen=new OffscreenCanvas(newWidth,newHeight);const ctx=offscreen.getContext("2d");ctx.drawImage(bitmap,0,0,prevWidth,prevHeight,0,0,newWidth,newHeight);bitmap=offscreen.transferToImageBitmap();}return bitmap;}function _drawBitmap(width,height){width=Math.ceil(width);height=Math.ceil(height);const canvas=stamp_classPrivateFieldGet(_canvas,this);if(!canvas||canvas.width===width&&canvas.height===height){return;}canvas.width=width;canvas.height=height;const bitmap=stamp_classPrivateFieldGet(_isSvg,this)?stamp_classPrivateFieldGet(_bitmap,this):stamp_assertClassBrand(_StampEditor_brand,this,_scaleBitmap).call(this,width,height);if(this._uiManager.hasMLManager&&!this.hasAltText()){const offscreen=new OffscreenCanvas(width,height);const ctx=offscreen.getContext("2d");ctx.drawImage(bitmap,0,0,bitmap.width,bitmap.height,0,0,width,height);this._uiManager.mlGuess({service:"image-to-text",request:{data:ctx.getImageData(0,0,width,height).data,width,height,channels:4}}).then(response=>{const altText=response?.output||"";if(this.parent&&altText&&!this.hasAltText()){this.altTextData={altText,decorative:false};}});}const ctx=canvas.getContext("2d");ctx.filter=this._uiManager.hcmFilter;ctx.drawImage(bitmap,0,0,bitmap.width,bitmap.height,0,0,width,height);}function _serializeBitmap(toUrl){if(toUrl){if(stamp_classPrivateFieldGet(_isSvg,this)){const url=this._uiManager.imageManager.getSvgUrl(stamp_classPrivateFieldGet(_bitmapId,this));if(url){return url;}}const canvas=document.createElement("canvas");({width:canvas.width,height:canvas.height}=stamp_classPrivateFieldGet(_bitmap,this));const ctx=canvas.getContext("2d");ctx.drawImage(stamp_classPrivateFieldGet(_bitmap,this),0,0);return canvas.toDataURL();}if(stamp_classPrivateFieldGet(_isSvg,this)){const[pageWidth,pageHeight]=this.pageDimensions;const width=Math.round(this.width*pageWidth*PixelsPerInch.PDF_TO_CSS_UNITS);const height=Math.round(this.height*pageHeight*PixelsPerInch.PDF_TO_CSS_UNITS);const offscreen=new OffscreenCanvas(width,height);const ctx=offscreen.getContext("2d");ctx.drawImage(stamp_classPrivateFieldGet(_bitmap,this),0,0,stamp_classPrivateFieldGet(_bitmap,this).width,stamp_classPrivateFieldGet(_bitmap,this).height,0,0,width,height);return offscreen.transferToImageBitmap();}return structuredClone(stamp_classPrivateFieldGet(_bitmap,this));}function stamp_createObserver(){stamp_classPrivateFieldSet(stamp_observer,this,new ResizeObserver(entries=>{const rect=entries[0].contentRect;if(rect.width&&rect.height){stamp_assertClassBrand(_StampEditor_brand,this,_setDimensions).call(this,rect.width,rect.height);}}));stamp_classPrivateFieldGet(stamp_observer,this).observe(this.div);}stamp_defineProperty(StampEditor,"_type","stamp");stamp_defineProperty(StampEditor,"_editorType",AnnotationEditorType.STAMP);
;// CONCATENATED MODULE: ./src/display/editor/annotation_editor_layer.js
function annotation_editor_layer_classPrivateMethodInitSpec(e,a){annotation_editor_layer_checkPrivateRedeclaration(e,a),a.add(e);}function annotation_editor_layer_defineProperty(e,r,t){return(r=annotation_editor_layer_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function annotation_editor_layer_toPropertyKey(t){var i=annotation_editor_layer_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function annotation_editor_layer_toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}function annotation_editor_layer_classPrivateFieldInitSpec(e,t,a){annotation_editor_layer_checkPrivateRedeclaration(e,t),t.set(e,a);}function annotation_editor_layer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function annotation_editor_layer_classPrivateGetter(s,r,a){return a(annotation_editor_layer_assertClassBrand(s,r));}function annotation_editor_layer_classPrivateFieldGet(s,a){return s.get(annotation_editor_layer_assertClassBrand(s,a));}function annotation_editor_layer_classPrivateFieldSet(s,a,r){return s.set(annotation_editor_layer_assertClassBrand(s,a),r),r;}function annotation_editor_layer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var annotation_editor_layer_accessibilityManager=/*#__PURE__*/new WeakMap();var _allowClick=/*#__PURE__*/new WeakMap();var _annotationLayer=/*#__PURE__*/new WeakMap();var _boundPointerup=/*#__PURE__*/new WeakMap();var _boundPointerdown=/*#__PURE__*/new WeakMap();var _boundTextLayerPointerDown=/*#__PURE__*/new WeakMap();var _editorFocusTimeoutId=/*#__PURE__*/new WeakMap();var _editors=/*#__PURE__*/new WeakMap();var _hadPointerDown=/*#__PURE__*/new WeakMap();var _isCleaningUp=/*#__PURE__*/new WeakMap();var _isDisabling=/*#__PURE__*/new WeakMap();var _textLayer=/*#__PURE__*/new WeakMap();var annotation_editor_layer_uiManager=/*#__PURE__*/new WeakMap();var _AnnotationEditorLayer_brand=/*#__PURE__*/new WeakSet();class AnnotationEditorLayer{constructor(_ref){let{uiManager,pageIndex,div,accessibilityManager,annotationLayer,drawLayer,textLayer,viewport,l10n,eventBus}=_ref;annotation_editor_layer_classPrivateMethodInitSpec(this,_AnnotationEditorLayer_brand);annotation_editor_layer_classPrivateFieldInitSpec(this,annotation_editor_layer_accessibilityManager,void 0);annotation_editor_layer_classPrivateFieldInitSpec(this,_allowClick,false);annotation_editor_layer_classPrivateFieldInitSpec(this,_annotationLayer,null);annotation_editor_layer_classPrivateFieldInitSpec(this,_boundPointerup,null);annotation_editor_layer_classPrivateFieldInitSpec(this,_boundPointerdown,null);annotation_editor_layer_classPrivateFieldInitSpec(this,_boundTextLayerPointerDown,null);annotation_editor_layer_classPrivateFieldInitSpec(this,_editorFocusTimeoutId,null);annotation_editor_layer_classPrivateFieldInitSpec(this,_editors,new Map());annotation_editor_layer_classPrivateFieldInitSpec(this,_hadPointerDown,false);annotation_editor_layer_classPrivateFieldInitSpec(this,_isCleaningUp,false);annotation_editor_layer_classPrivateFieldInitSpec(this,_isDisabling,false);annotation_editor_layer_classPrivateFieldInitSpec(this,_textLayer,null);annotation_editor_layer_classPrivateFieldInitSpec(this,annotation_editor_layer_uiManager,void 0);const editorTypes=[...annotation_editor_layer_editorTypes._.values()];if(!AnnotationEditorLayer._initialized){AnnotationEditorLayer._initialized=true;for(const editorType of editorTypes){editorType.initialize(l10n,uiManager);}}uiManager.registerEditorTypes(editorTypes);annotation_editor_layer_classPrivateFieldSet(annotation_editor_layer_uiManager,this,uiManager);this.pageIndex=pageIndex;this.div=div;annotation_editor_layer_classPrivateFieldSet(annotation_editor_layer_accessibilityManager,this,accessibilityManager);annotation_editor_layer_classPrivateFieldSet(_annotationLayer,this,annotationLayer);this.viewport=viewport;annotation_editor_layer_classPrivateFieldSet(_textLayer,this,textLayer);this.drawLayer=drawLayer;annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addLayer(this);this.eventBus=eventBus;}get isEmpty(){return annotation_editor_layer_classPrivateFieldGet(_editors,this).size===0;}get isInvisible(){return this.isEmpty&&annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getMode()===AnnotationEditorType.NONE;}updateToolbar(mode){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).updateToolbar(mode);}updateMode(){let mode=arguments.length>0&&arguments[0]!==undefined?arguments[0]:annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getMode();annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_cleanup).call(this);switch(mode){case AnnotationEditorType.NONE:this.disableTextSelection();this.togglePointerEvents(false);this.toggleAnnotationLayerPointerEvents(true);this.disableClick();return;case AnnotationEditorType.INK:this.addInkEditorIfNeeded(false);this.disableTextSelection();this.togglePointerEvents(true);this.disableClick();break;case AnnotationEditorType.HIGHLIGHT:this.enableTextSelection();this.togglePointerEvents(false);this.disableClick();break;default:this.disableTextSelection();this.togglePointerEvents(true);this.enableClick();}this.toggleAnnotationLayerPointerEvents(false);const{classList}=this.div;for(const editorType of annotation_editor_layer_editorTypes._.values()){classList.toggle(`${editorType._type}Editing`,mode===editorType._editorType);}this.div.hidden=false;}hasTextLayer(textLayer){return textLayer===annotation_editor_layer_classPrivateFieldGet(_textLayer,this)?.div;}addInkEditorIfNeeded(isCommitting){if(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getMode()!==AnnotationEditorType.INK){return;}if(!isCommitting){for(const editor of annotation_editor_layer_classPrivateFieldGet(_editors,this).values()){if(editor.isEmpty()){editor.setInBackground();return;}}}const editor=this.createAndAddNewEditor({offsetX:0,offsetY:0},false);editor.setInBackground();}setEditingState(isEditing){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).setEditingState(isEditing);}addCommands(params){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addCommands(params);}togglePointerEvents(){let enabled=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;this.div.classList.toggle("disabled",!enabled);}toggleAnnotationLayerPointerEvents(){let enabled=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;annotation_editor_layer_classPrivateFieldGet(_annotationLayer,this)?.div.classList.toggle("disabled",!enabled);}enable(){this.div.tabIndex=0;this.togglePointerEvents(true);const annotationElementIds=new Set();for(const editor of annotation_editor_layer_classPrivateFieldGet(_editors,this).values()){editor.enableEditing();editor.show(true);if(editor.annotationElementId){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).removeChangedExistingAnnotation(editor);annotationElementIds.add(editor.annotationElementId);}}if(!annotation_editor_layer_classPrivateFieldGet(_annotationLayer,this)){return;}const editables=annotation_editor_layer_classPrivateFieldGet(_annotationLayer,this).getEditableAnnotations();for(const editable of editables){editable.hide();if(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).isDeletedAnnotationElement(editable.data.id)){continue;}if(annotationElementIds.has(editable.data.id)){continue;}const editor=this.deserialize(editable);if(!editor){continue;}this.addOrRebuild(editor);editor.enableEditing();}}disable(){annotation_editor_layer_classPrivateFieldSet(_isDisabling,this,true);this.div.tabIndex=-1;this.togglePointerEvents(false);const changedAnnotations=new Map();const resetAnnotations=new Map();for(const editor of annotation_editor_layer_classPrivateFieldGet(_editors,this).values()){editor.disableEditing();if(!editor.annotationElementId){continue;}if(editor.serialize()!==null){changedAnnotations.set(editor.annotationElementId,editor);continue;}else{resetAnnotations.set(editor.annotationElementId,editor);}this.getEditableAnnotation(editor.annotationElementId)?.show();editor.remove();}if(annotation_editor_layer_classPrivateFieldGet(_annotationLayer,this)){const editables=annotation_editor_layer_classPrivateFieldGet(_annotationLayer,this).getEditableAnnotations();for(const editable of editables){const{id}=editable.data;if(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).isDeletedAnnotationElement(id)){continue;}let editor=resetAnnotations.get(id);if(editor){editor.resetAnnotationElement(editable);editor.show(false);editable.show();continue;}editor=changedAnnotations.get(id);if(editor){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addChangedExistingAnnotation(editor);editor.renderAnnotationElement(editable);editor.show(false);}editable.show();}}annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_cleanup).call(this);if(this.isEmpty){this.div.hidden=true;}const{classList}=this.div;for(const editorType of annotation_editor_layer_editorTypes._.values()){classList.remove(`${editorType._type}Editing`);}this.disableTextSelection();this.toggleAnnotationLayerPointerEvents(true);annotation_editor_layer_classPrivateFieldSet(_isDisabling,this,false);}getEditableAnnotation(id){return annotation_editor_layer_classPrivateFieldGet(_annotationLayer,this)?.getEditableAnnotation(id)||null;}setActiveEditor(editor){const currentActive=annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getActive();if(currentActive===editor){return;}annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).setActiveEditor(editor);}enableTextSelection(){this.div.tabIndex=-1;if(annotation_editor_layer_classPrivateFieldGet(_textLayer,this)?.div&&!annotation_editor_layer_classPrivateFieldGet(_boundTextLayerPointerDown,this)){annotation_editor_layer_classPrivateFieldSet(_boundTextLayerPointerDown,this,annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_textLayerPointerDown).bind(this));annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.addEventListener("pointerdown",annotation_editor_layer_classPrivateFieldGet(_boundTextLayerPointerDown,this));annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.classList.add("highlighting");}}disableTextSelection(){this.div.tabIndex=0;if(annotation_editor_layer_classPrivateFieldGet(_textLayer,this)?.div&&annotation_editor_layer_classPrivateFieldGet(_boundTextLayerPointerDown,this)){annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.removeEventListener("pointerdown",annotation_editor_layer_classPrivateFieldGet(_boundTextLayerPointerDown,this));annotation_editor_layer_classPrivateFieldSet(_boundTextLayerPointerDown,this,null);annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.classList.remove("highlighting");}}enableClick(){if(annotation_editor_layer_classPrivateFieldGet(_boundPointerdown,this)){return;}annotation_editor_layer_classPrivateFieldSet(_boundPointerdown,this,this.pointerdown.bind(this));annotation_editor_layer_classPrivateFieldSet(_boundPointerup,this,this.pointerup.bind(this));this.div.addEventListener("pointerdown",annotation_editor_layer_classPrivateFieldGet(_boundPointerdown,this));this.div.addEventListener("pointerup",annotation_editor_layer_classPrivateFieldGet(_boundPointerup,this));}disableClick(){if(!annotation_editor_layer_classPrivateFieldGet(_boundPointerdown,this)){return;}this.div.removeEventListener("pointerdown",annotation_editor_layer_classPrivateFieldGet(_boundPointerdown,this));this.div.removeEventListener("pointerup",annotation_editor_layer_classPrivateFieldGet(_boundPointerup,this));annotation_editor_layer_classPrivateFieldSet(_boundPointerdown,this,null);annotation_editor_layer_classPrivateFieldSet(_boundPointerup,this,null);}attach(editor){annotation_editor_layer_classPrivateFieldGet(_editors,this).set(editor.id,editor);const{annotationElementId}=editor;if(annotationElementId&&annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).isDeletedAnnotationElement(annotationElementId)){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).removeDeletedAnnotationElement(editor);}}detach(editor){annotation_editor_layer_classPrivateFieldGet(_editors,this).delete(editor.id);annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_accessibilityManager,this)?.removePointerInTextLayer(editor.contentDiv);if(!annotation_editor_layer_classPrivateFieldGet(_isDisabling,this)&&editor.annotationElementId){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addDeletedAnnotationElement(editor);}}remove(editor){this.detach(editor);annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).removeEditor(editor);editor.div.remove();editor.isAttachedToDOM=false;if(!annotation_editor_layer_classPrivateFieldGet(_isCleaningUp,this)){this.addInkEditorIfNeeded(false);}}changeParent(editor){if(editor.parent===this){return;}if(editor.parent&&editor.annotationElementId){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addDeletedAnnotationElement(editor.annotationElementId);AnnotationEditor.deleteAnnotationElement(editor);editor.annotationElementId=null;}this.attach(editor);editor.parent?.detach(editor);editor.setParent(this);if(editor.div&&editor.isAttachedToDOM){editor.div.remove();this.div.append(editor.div);}}add(editor){if(editor.parent===this&&editor.isAttachedToDOM){return;}this.changeParent(editor);annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addEditor(editor);this.attach(editor);if(!editor.isAttachedToDOM){const div=editor.render();this.div.append(div);editor.isAttachedToDOM=true;}editor.fixAndSetPosition();editor.onceAdded();annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).addToAnnotationStorage(editor);editor._reportTelemetry(editor.telemetryInitialData);}moveEditorInDOM(editor){if(!editor.isAttachedToDOM){return;}const{activeElement}=document;if(editor.div.contains(activeElement)&&!annotation_editor_layer_classPrivateFieldGet(_editorFocusTimeoutId,this)){editor._focusEventsAllowed=false;annotation_editor_layer_classPrivateFieldSet(_editorFocusTimeoutId,this,setTimeout(()=>{annotation_editor_layer_classPrivateFieldSet(_editorFocusTimeoutId,this,null);if(!editor.div.contains(document.activeElement)){editor.div.addEventListener("focusin",()=>{editor._focusEventsAllowed=true;},{once:true});activeElement.focus();}else{editor._focusEventsAllowed=true;}},0));}editor._structTreeParentId=annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_accessibilityManager,this)?.moveElementInDOM(this.div,editor.div,editor.contentDiv,true);}addOrRebuild(editor){if(editor.needsToBeRebuilt()){editor.parent||=this;editor.rebuild();editor.show();}else{this.add(editor);}}addUndoableEditor(editor){const cmd=()=>editor._uiManager.rebuild(editor);const undo=()=>{editor.remove();};this.addCommands({cmd,undo,mustExec:false});}getNextId(){return annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getId();}canCreateNewEmptyEditor(){return annotation_editor_layer_classPrivateGetter(_AnnotationEditorLayer_brand,this,_get_currentEditorType)?.canCreateNewEmptyEditor();}pasteEditor(mode,params){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).updateToolbar(mode);annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).updateMode(mode);const{offsetX,offsetY}=annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_getCenterPoint).call(this);const id=this.getNextId();const editor=annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_createNewEditor).call(this,{parent:this,id,x:offsetX,y:offsetY,uiManager:annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this),isCentered:true,...params});if(editor){this.add(editor);}}deserialize(data){return annotation_editor_layer_editorTypes._.get(data.annotationType??data.annotationEditorType)?.deserialize(data,this,annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this))||null;}createAndAddNewEditor(event,isCentered){let data=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};const id=this.getNextId();const editor=annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_createNewEditor).call(this,{parent:this,id,x:event.offsetX,y:event.offsetY,uiManager:annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this),isCentered,eventBus:this.eventBus,...data});if(editor){this.add(editor);}return editor;}addNewEditor(){this.createAndAddNewEditor(annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_getCenterPoint).call(this),true);}setSelected(editor){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).setSelected(editor);}toggleSelected(editor){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).toggleSelected(editor);}isSelected(editor){return annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).isSelected(editor);}unselect(editor){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).unselect(editor);}pointerup(event){const{isMac}=util_FeatureTest.platform;if(event.button!==0||event.ctrlKey&&isMac){return;}if(event.target!==this.div){return;}if(!annotation_editor_layer_classPrivateFieldGet(_hadPointerDown,this)){return;}annotation_editor_layer_classPrivateFieldSet(_hadPointerDown,this,false);if(!annotation_editor_layer_classPrivateFieldGet(_allowClick,this)){annotation_editor_layer_classPrivateFieldSet(_allowClick,this,true);return;}if(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getMode()===AnnotationEditorType.STAMP){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).unselectAll();return;}this.createAndAddNewEditor(event,false);}pointerdown(event){if(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getMode()===AnnotationEditorType.HIGHLIGHT){this.enableTextSelection();}if(annotation_editor_layer_classPrivateFieldGet(_hadPointerDown,this)){annotation_editor_layer_classPrivateFieldSet(_hadPointerDown,this,false);return;}const{isMac}=util_FeatureTest.platform;if(event.button!==0||event.ctrlKey&&isMac){return;}if(event.target!==this.div){return;}annotation_editor_layer_classPrivateFieldSet(_hadPointerDown,this,true);const editor=annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getActive();annotation_editor_layer_classPrivateFieldSet(_allowClick,this,!editor||editor.isEmpty());}findNewParent(editor,x,y){const layer=annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).findParent(x,y);if(layer===null||layer===this){return false;}layer.changeParent(editor);return true;}destroy(){if(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getActive()?.parent===this){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).commitOrRemove();annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).setActiveEditor(null);}if(annotation_editor_layer_classPrivateFieldGet(_editorFocusTimeoutId,this)){clearTimeout(annotation_editor_layer_classPrivateFieldGet(_editorFocusTimeoutId,this));annotation_editor_layer_classPrivateFieldSet(_editorFocusTimeoutId,this,null);}for(const editor of annotation_editor_layer_classPrivateFieldGet(_editors,this).values()){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_accessibilityManager,this)?.removePointerInTextLayer(editor.contentDiv);editor.setParent(null);editor.isAttachedToDOM=false;editor.div.remove();}this.div=null;annotation_editor_layer_classPrivateFieldGet(_editors,this).clear();annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).removeLayer(this);}render(_ref2){let{viewport}=_ref2;this.viewport=viewport;setLayerDimensions(this.div,viewport);for(const editor of annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).getEditors(this.pageIndex)){this.add(editor);editor.rebuild();}this.updateMode();}update(_ref3){let{viewport}=_ref3;annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).commitOrRemove();annotation_editor_layer_assertClassBrand(_AnnotationEditorLayer_brand,this,_cleanup).call(this);const oldRotation=this.viewport.rotation;const rotation=viewport.rotation;this.viewport=viewport;setLayerDimensions(this.div,{rotation});if(oldRotation!==rotation){for(const editor of annotation_editor_layer_classPrivateFieldGet(_editors,this).values()){editor.rotate(rotation);}}this.addInkEditorIfNeeded(false);}get pageDimensions(){const{pageWidth,pageHeight}=this.viewport.rawDims;return[pageWidth,pageHeight];}get scale(){return annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).viewParameters.realScale;}setCleaningUp(isCleaningUp){annotation_editor_layer_classPrivateFieldSet(_isCleaningUp,this,isCleaningUp);}}function _textLayerPointerDown(event){annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).unselectAll();if(event.target===annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div){const{isMac}=util_FeatureTest.platform;if(event.button!==0||event.ctrlKey&&isMac){return;}annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).showAllEditors("highlight",true,true);annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.classList.add("free");HighlightEditor.startHighlighting(this,annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,this).direction==="ltr",event);annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.addEventListener("pointerup",()=>{annotation_editor_layer_classPrivateFieldGet(_textLayer,this).div.classList.remove("free");},{once:true});event.preventDefault();}}function _get_currentEditorType(_this){return annotation_editor_layer_editorTypes._.get(annotation_editor_layer_classPrivateFieldGet(annotation_editor_layer_uiManager,_this).getMode());}function _createNewEditor(params){const editorType=annotation_editor_layer_classPrivateGetter(_AnnotationEditorLayer_brand,this,_get_currentEditorType);return editorType?new editorType.prototype.constructor(params):null;}function _getCenterPoint(){const{x,y,width,height}=this.div.getBoundingClientRect();const tlX=Math.max(0,x);const tlY=Math.max(0,y);const brX=Math.min(window.innerWidth,x+width);const brY=Math.min(window.innerHeight,y+height);const centerX=(tlX+brX)/2-x;const centerY=(tlY+brY)/2-y;const[offsetX,offsetY]=this.viewport.rotation%180===0?[centerX,centerY]:[centerY,centerX];return{offsetX,offsetY};}function _cleanup(){annotation_editor_layer_classPrivateFieldSet(_isCleaningUp,this,true);for(const editor of annotation_editor_layer_classPrivateFieldGet(_editors,this).values()){if(editor.isEmpty()){editor.remove();}}annotation_editor_layer_classPrivateFieldSet(_isCleaningUp,this,false);}annotation_editor_layer_defineProperty(AnnotationEditorLayer,"_initialized",false);var annotation_editor_layer_editorTypes={_:new Map([FreeTextEditor,InkEditor,StampEditor,HighlightEditor].map(type=>[type._editorType,type]))};
;// CONCATENATED MODULE: ./src/display/draw_layer.js
var _DrawLayer;function draw_layer_classPrivateMethodInitSpec(e,a){draw_layer_checkPrivateRedeclaration(e,a),a.add(e);}function draw_layer_classPrivateFieldInitSpec(e,t,a){draw_layer_checkPrivateRedeclaration(e,t),t.set(e,a);}function draw_layer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function draw_layer_classPrivateFieldSet(s,a,r){return s.set(draw_layer_assertClassBrand(s,a),r),r;}function draw_layer_classPrivateFieldGet(s,a){return s.get(draw_layer_assertClassBrand(s,a));}function draw_layer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var draw_layer_parent=/*#__PURE__*/new WeakMap();var draw_layer_id=/*#__PURE__*/new WeakMap();var _mapping=/*#__PURE__*/new WeakMap();var _toUpdate=/*#__PURE__*/new WeakMap();var _DrawLayer_brand=/*#__PURE__*/new WeakSet();class DrawLayer{constructor(_ref){let{pageIndex}=_ref;draw_layer_classPrivateMethodInitSpec(this,_DrawLayer_brand);draw_layer_classPrivateFieldInitSpec(this,draw_layer_parent,null);draw_layer_classPrivateFieldInitSpec(this,draw_layer_id,0);draw_layer_classPrivateFieldInitSpec(this,_mapping,new Map());draw_layer_classPrivateFieldInitSpec(this,_toUpdate,new Map());this.pageIndex=pageIndex;}setParent(parent){if(!draw_layer_classPrivateFieldGet(draw_layer_parent,this)){draw_layer_classPrivateFieldSet(draw_layer_parent,this,parent);return;}if(draw_layer_classPrivateFieldGet(draw_layer_parent,this)!==parent){if(draw_layer_classPrivateFieldGet(_mapping,this).size>0){for(const root of draw_layer_classPrivateFieldGet(_mapping,this).values()){root.remove();parent.append(root);}}draw_layer_classPrivateFieldSet(draw_layer_parent,this,parent);}}static get _svgFactory(){return shadow(this,"_svgFactory",new DOMSVGFactory());}highlight(outlines,color,opacity){var _this$id,_this$id2;let isPathUpdatable=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;const id=(draw_layer_classPrivateFieldSet(draw_layer_id,this,(_this$id=draw_layer_classPrivateFieldGet(draw_layer_id,this),_this$id2=_this$id++,_this$id)),_this$id2);const root=draw_layer_assertClassBrand(_DrawLayer_brand,this,_createSVG).call(this,outlines.box);root.classList.add("highlight");if(outlines.free){root.classList.add("free");}const defs=DrawLayer._svgFactory.createElement("defs");root.append(defs);const path=DrawLayer._svgFactory.createElement("path");defs.append(path);const pathId=`path_p${this.pageIndex}_${id}`;path.setAttribute("id",pathId);path.setAttribute("d",outlines.toSVGPath());if(isPathUpdatable){draw_layer_classPrivateFieldGet(_toUpdate,this).set(id,path);}const clipPathId=draw_layer_assertClassBrand(_DrawLayer_brand,this,_createClipPath).call(this,defs,pathId);const use=DrawLayer._svgFactory.createElement("use");root.append(use);root.setAttribute("fill",color);root.setAttribute("fill-opacity",opacity);use.setAttribute("href",`#${pathId}`);draw_layer_classPrivateFieldGet(_mapping,this).set(id,root);return{id,clipPathId:`url(#${clipPathId})`};}highlightOutline(outlines){var _this$id3,_this$id4;const id=(draw_layer_classPrivateFieldSet(draw_layer_id,this,(_this$id3=draw_layer_classPrivateFieldGet(draw_layer_id,this),_this$id4=_this$id3++,_this$id3)),_this$id4);const root=draw_layer_assertClassBrand(_DrawLayer_brand,this,_createSVG).call(this,outlines.box);root.classList.add("highlightOutline");const defs=DrawLayer._svgFactory.createElement("defs");root.append(defs);const path=DrawLayer._svgFactory.createElement("path");defs.append(path);const pathId=`path_p${this.pageIndex}_${id}`;path.setAttribute("id",pathId);path.setAttribute("d",outlines.toSVGPath());path.setAttribute("vector-effect","non-scaling-stroke");let maskId;if(outlines.free){root.classList.add("free");const mask=DrawLayer._svgFactory.createElement("mask");defs.append(mask);maskId=`mask_p${this.pageIndex}_${id}`;mask.setAttribute("id",maskId);mask.setAttribute("maskUnits","objectBoundingBox");const rect=DrawLayer._svgFactory.createElement("rect");mask.append(rect);rect.setAttribute("width","1");rect.setAttribute("height","1");rect.setAttribute("fill","white");const use=DrawLayer._svgFactory.createElement("use");mask.append(use);use.setAttribute("href",`#${pathId}`);use.setAttribute("stroke","none");use.setAttribute("fill","black");use.setAttribute("fill-rule","nonzero");use.classList.add("mask");}const use1=DrawLayer._svgFactory.createElement("use");root.append(use1);use1.setAttribute("href",`#${pathId}`);if(maskId){use1.setAttribute("mask",`url(#${maskId})`);}const use2=use1.cloneNode();root.append(use2);use1.classList.add("mainOutline");use2.classList.add("secondaryOutline");draw_layer_classPrivateFieldGet(_mapping,this).set(id,root);return id;}finalizeLine(id,line){const path=draw_layer_classPrivateFieldGet(_toUpdate,this).get(id);draw_layer_classPrivateFieldGet(_toUpdate,this).delete(id);this.updateBox(id,line.box);path.setAttribute("d",line.toSVGPath());}updateLine(id,line){const root=draw_layer_classPrivateFieldGet(_mapping,this).get(id);const defs=root.firstChild;const path=defs.firstChild;path.setAttribute("d",line.toSVGPath());}removeFreeHighlight(id){this.remove(id);draw_layer_classPrivateFieldGet(_toUpdate,this).delete(id);}updatePath(id,line){draw_layer_classPrivateFieldGet(_toUpdate,this).get(id).setAttribute("d",line.toSVGPath());}updateBox(id,box){_setBox.call(DrawLayer,draw_layer_classPrivateFieldGet(_mapping,this).get(id),box);}show(id,visible){draw_layer_classPrivateFieldGet(_mapping,this).get(id).classList.toggle("hidden",!visible);}rotate(id,angle){draw_layer_classPrivateFieldGet(_mapping,this).get(id).setAttribute("data-main-rotation",angle);}changeColor(id,color){draw_layer_classPrivateFieldGet(_mapping,this).get(id).setAttribute("fill",color);}changeOpacity(id,opacity){draw_layer_classPrivateFieldGet(_mapping,this).get(id).setAttribute("fill-opacity",opacity);}addClass(id,className){draw_layer_classPrivateFieldGet(_mapping,this).get(id).classList.add(className);}removeClass(id,className){draw_layer_classPrivateFieldGet(_mapping,this).get(id).classList.remove(className);}remove(id){if(draw_layer_classPrivateFieldGet(draw_layer_parent,this)===null){return;}draw_layer_classPrivateFieldGet(_mapping,this).get(id).remove();draw_layer_classPrivateFieldGet(_mapping,this).delete(id);}destroy(){draw_layer_classPrivateFieldSet(draw_layer_parent,this,null);for(const root of draw_layer_classPrivateFieldGet(_mapping,this).values()){root.remove();}draw_layer_classPrivateFieldGet(_mapping,this).clear();}}_DrawLayer=DrawLayer;function _setBox(element){let{x=0,y=0,width=1,height=1}=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};const{style}=element;style.top=`${100*y}%`;style.left=`${100*x}%`;style.width=`${100*width}%`;style.height=`${100*height}%`;}function _createSVG(box){const svg=_DrawLayer._svgFactory.create(1,1,true);draw_layer_classPrivateFieldGet(draw_layer_parent,this).append(svg);svg.setAttribute("aria-hidden",true);_setBox.call(_DrawLayer,svg,box);return svg;}function _createClipPath(defs,pathId){const clipPath=_DrawLayer._svgFactory.createElement("clipPath");defs.append(clipPath);const clipPathId=`clip_${pathId}`;clipPath.setAttribute("id",clipPathId);clipPath.setAttribute("clipPathUnits","objectBoundingBox");const clipPathUse=_DrawLayer._svgFactory.createElement("use");clipPath.append(clipPathUse);clipPathUse.setAttribute("href",`#${pathId}`);clipPathUse.classList.add("clip");return clipPathId;}
;// CONCATENATED MODULE: ./src/pdf.js
const pdfjsVersion="4.3.659";const pdfjsBuild="ba0b24810";
})();

var __webpack_exports__AbortException = __webpack_exports__.AbortException;
var __webpack_exports__AnnotationEditorLayer = __webpack_exports__.AnnotationEditorLayer;
var __webpack_exports__AnnotationEditorParamsType = __webpack_exports__.AnnotationEditorParamsType;
var __webpack_exports__AnnotationEditorType = __webpack_exports__.AnnotationEditorType;
var __webpack_exports__AnnotationEditorUIManager = __webpack_exports__.AnnotationEditorUIManager;
var __webpack_exports__AnnotationLayer = __webpack_exports__.AnnotationLayer;
var __webpack_exports__AnnotationMode = __webpack_exports__.AnnotationMode;
var __webpack_exports__CMapCompressionType = __webpack_exports__.CMapCompressionType;
var __webpack_exports__ColorPicker = __webpack_exports__.ColorPicker;
var __webpack_exports__DOMSVGFactory = __webpack_exports__.DOMSVGFactory;
var __webpack_exports__DrawLayer = __webpack_exports__.DrawLayer;
var __webpack_exports__FeatureTest = __webpack_exports__.FeatureTest;
var __webpack_exports__GlobalWorkerOptions = __webpack_exports__.GlobalWorkerOptions;
var __webpack_exports__ImageKind = __webpack_exports__.ImageKind;
var __webpack_exports__InvalidPDFException = __webpack_exports__.InvalidPDFException;
var __webpack_exports__MissingPDFException = __webpack_exports__.MissingPDFException;
var __webpack_exports__OPS = __webpack_exports__.OPS;
var __webpack_exports__Outliner = __webpack_exports__.Outliner;
var __webpack_exports__PDFDataRangeTransport = __webpack_exports__.PDFDataRangeTransport;
var __webpack_exports__PDFDateString = __webpack_exports__.PDFDateString;
var __webpack_exports__PDFWorker = __webpack_exports__.PDFWorker;
var __webpack_exports__PasswordResponses = __webpack_exports__.PasswordResponses;
var __webpack_exports__PermissionFlag = __webpack_exports__.PermissionFlag;
var __webpack_exports__PixelsPerInch = __webpack_exports__.PixelsPerInch;
var __webpack_exports__RenderingCancelledException = __webpack_exports__.RenderingCancelledException;
var __webpack_exports__TextLayer = __webpack_exports__.TextLayer;
var __webpack_exports__UnexpectedResponseException = __webpack_exports__.UnexpectedResponseException;
var __webpack_exports__Util = __webpack_exports__.Util;
var __webpack_exports__VerbosityLevel = __webpack_exports__.VerbosityLevel;
var __webpack_exports__XfaLayer = __webpack_exports__.XfaLayer;
var __webpack_exports__build = __webpack_exports__.build;
var __webpack_exports__createValidAbsoluteUrl = __webpack_exports__.createValidAbsoluteUrl;
var __webpack_exports__fetchData = __webpack_exports__.fetchData;
var __webpack_exports__getDocument = __webpack_exports__.getDocument;
var __webpack_exports__getFilenameFromUrl = __webpack_exports__.getFilenameFromUrl;
var __webpack_exports__getPdfFilenameFromUrl = __webpack_exports__.getPdfFilenameFromUrl;
var __webpack_exports__getXfaPageViewport = __webpack_exports__.getXfaPageViewport;
var __webpack_exports__isDataScheme = __webpack_exports__.isDataScheme;
var __webpack_exports__isPdfFile = __webpack_exports__.isPdfFile;
var __webpack_exports__noContextMenu = __webpack_exports__.noContextMenu;
var __webpack_exports__normalizeUnicode = __webpack_exports__.normalizeUnicode;
var __webpack_exports__renderTextLayer = __webpack_exports__.renderTextLayer;
var __webpack_exports__setLayerDimensions = __webpack_exports__.setLayerDimensions;
var __webpack_exports__shadow = __webpack_exports__.shadow;
var __webpack_exports__updateTextLayer = __webpack_exports__.updateTextLayer;
var __webpack_exports__version = __webpack_exports__.version;
export { __webpack_exports__AbortException as AbortException, __webpack_exports__AnnotationEditorLayer as AnnotationEditorLayer, __webpack_exports__AnnotationEditorParamsType as AnnotationEditorParamsType, __webpack_exports__AnnotationEditorType as AnnotationEditorType, __webpack_exports__AnnotationEditorUIManager as AnnotationEditorUIManager, __webpack_exports__AnnotationLayer as AnnotationLayer, __webpack_exports__AnnotationMode as AnnotationMode, __webpack_exports__CMapCompressionType as CMapCompressionType, __webpack_exports__ColorPicker as ColorPicker, __webpack_exports__DOMSVGFactory as DOMSVGFactory, __webpack_exports__DrawLayer as DrawLayer, __webpack_exports__FeatureTest as FeatureTest, __webpack_exports__GlobalWorkerOptions as GlobalWorkerOptions, __webpack_exports__ImageKind as ImageKind, __webpack_exports__InvalidPDFException as InvalidPDFException, __webpack_exports__MissingPDFException as MissingPDFException, __webpack_exports__OPS as OPS, __webpack_exports__Outliner as Outliner, __webpack_exports__PDFDataRangeTransport as PDFDataRangeTransport, __webpack_exports__PDFDateString as PDFDateString, __webpack_exports__PDFWorker as PDFWorker, __webpack_exports__PasswordResponses as PasswordResponses, __webpack_exports__PermissionFlag as PermissionFlag, __webpack_exports__PixelsPerInch as PixelsPerInch, __webpack_exports__RenderingCancelledException as RenderingCancelledException, __webpack_exports__TextLayer as TextLayer, __webpack_exports__UnexpectedResponseException as UnexpectedResponseException, __webpack_exports__Util as Util, __webpack_exports__VerbosityLevel as VerbosityLevel, __webpack_exports__XfaLayer as XfaLayer, __webpack_exports__build as build, __webpack_exports__createValidAbsoluteUrl as createValidAbsoluteUrl, __webpack_exports__fetchData as fetchData, __webpack_exports__getDocument as getDocument, __webpack_exports__getFilenameFromUrl as getFilenameFromUrl, __webpack_exports__getPdfFilenameFromUrl as getPdfFilenameFromUrl, __webpack_exports__getXfaPageViewport as getXfaPageViewport, __webpack_exports__isDataScheme as isDataScheme, __webpack_exports__isPdfFile as isPdfFile, __webpack_exports__noContextMenu as noContextMenu, __webpack_exports__normalizeUnicode as normalizeUnicode, __webpack_exports__renderTextLayer as renderTextLayer, __webpack_exports__setLayerDimensions as setLayerDimensions, __webpack_exports__shadow as shadow, __webpack_exports__updateTextLayer as updateTextLayer, __webpack_exports__version as version };
