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

/***/ 2577:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var iterate = __webpack_require__(2652);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);

// `Iterator.prototype.find` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  find: function find(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop(value);
    }, { IS_RECORD: true, INTERRUPTED: true }).result;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  PDFViewerApplication: () => (/* reexport */ app_PDFViewerApplication),
  PDFViewerApplicationConstants: () => (/* binding */ AppConstants),
  PDFViewerApplicationOptions: () => (/* reexport */ AppOptions),
  webViewerLoad: () => (/* binding */ webViewerLoad)
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.error.cause.js
var es_error_cause = __webpack_require__(6280);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.at.js
var es_array_at = __webpack_require__(8107);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(4114);
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
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(4603);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(7566);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(8721);
;// CONCATENATED MODULE: ./web/ui_utils.js
function _classPrivateFieldInitSpec(e,t,a){_checkPrivateRedeclaration(e,t),t.set(e,a);}function _checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function _classPrivateFieldGet(s,a){return s.get(_assertClassBrand(s,a));}function _classPrivateFieldSet(s,a,r){return s.set(_assertClassBrand(s,a),r),r;}function _assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DEFAULT_SCALE_VALUE="auto";const DEFAULT_SCALE=1.0;const DEFAULT_SCALE_DELTA=1.1;const MIN_SCALE=0.1;const MAX_SCALE=10.0;const UNKNOWN_SCALE=0;const MAX_AUTO_SCALE=1.25;const SCROLLBAR_PADDING=40;const VERTICAL_PADDING=5;const RenderingStates={INITIAL:0,RUNNING:1,PAUSED:2,FINISHED:3};const PresentationModeState={UNKNOWN:0,NORMAL:1,CHANGING:2,FULLSCREEN:3};const SidebarView={UNKNOWN:-1,NONE:0,THUMBS:1,OUTLINE:2,ATTACHMENTS:3,LAYERS:4};const TextLayerMode={DISABLE:0,ENABLE:1,ENABLE_PERMISSIONS:2};const ScrollMode={UNKNOWN:-1,VERTICAL:0,HORIZONTAL:1,WRAPPED:2,PAGE:3};const SpreadMode={UNKNOWN:-1,NONE:0,ODD:1,EVEN:2};const CursorTool={SELECT:0,HAND:1,ZOOM:2};const AutoPrintRegExp=/\bprint\s*\(/;class OutputScale{constructor(){const pixelRatio=window.devicePixelRatio||1;this.sx=pixelRatio;this.sy=pixelRatio;}get scaled(){return this.sx!==1||this.sy!==1;}}function scrollIntoView(element,spot){let scrollMatches=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;let infiniteScroll=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;if(element.classList.contains("stf__item")||element.parentElement?.classList.contains("stf__item")||element.parentElement?.parentElement?.classList.contains("stf__item")){return;}let parent=element.offsetParent;if(!parent){globalThis.ngxConsole.error("offsetParent is not set -- cannot scroll");return;}let offsetY=element.offsetTop+element.clientTop;let offsetX=element.offsetLeft+element.clientLeft;while(parent.clientHeight===parent.scrollHeight&&parent.clientWidth===parent.scrollWidth||scrollMatches&&(parent.classList.contains("markedContent")||getComputedStyle(parent).overflow==="hidden")){offsetY+=parent.offsetTop;offsetX+=parent.offsetLeft;parent=parent.offsetParent;if(!parent){if(infiniteScroll){if(document.body.clientHeight>offsetY){offsetY-=32;window.scrollTo(window.scrollX,offsetY);}}return;}}if(spot){if(spot.top!==undefined){offsetY+=spot.top;}if(spot.left!==undefined){offsetX+=spot.left;parent.scrollLeft=offsetX;}}else if(isDivInViewport(element)){return;}parent.scrollTop=offsetY;}function isDivInViewport(element){const rect=element.getBoundingClientRect();return rect.top>=0&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth);}function watchScroll(viewAreaElement,callback){const debounceScroll=function(evt){if(rAF){return;}rAF=window.requestAnimationFrame(function viewAreaElementScrolled(){rAF=null;const currentX=viewAreaElement.scrollLeft;const lastX=state.lastX;if(currentX!==lastX){state.right=currentX>lastX;}state.lastX=currentX;const currentY=viewAreaElement.scrollTop;const lastY=state.lastY;if(currentY!==lastY){state.down=currentY>lastY;}state.lastY=currentY;callback(state);});};const state={right:true,down:true,lastX:viewAreaElement.scrollLeft,lastY:viewAreaElement.scrollTop,_eventHandler:debounceScroll};let rAF=null;viewAreaElement.addEventListener("scroll",debounceScroll,true);return state;}function parseQueryString(query){const params=new Map();for(const[key,value]of new URLSearchParams(query)){params.set(key.toLowerCase(),value);}return params;}const InvisibleCharsRegExp=/[\x00-\x1F]/g;function removeNullCharacters(str){let replaceInvisible=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(!InvisibleCharsRegExp.test(str)){return str;}if(replaceInvisible){return str.replaceAll(InvisibleCharsRegExp,m=>m==="\x00"?"":" ");}return str.replaceAll("\x00","");}function binarySearchFirstItem(items,condition){let start=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;let minIndex=start;let maxIndex=items.length-1;if(maxIndex<0||!condition(items[maxIndex])){return items.length;}if(condition(items[minIndex])){return minIndex;}while(minIndex<maxIndex){const currentIndex=minIndex+maxIndex>>1;const currentItem=items[currentIndex];if(condition(currentItem)){maxIndex=currentIndex;}else{minIndex=currentIndex+1;}}return minIndex;}function approximateFraction(x){if(Math.floor(x)===x){return[x,1];}const xinv=1/x;const limit=8;if(xinv>limit){return[1,limit];}else if(Math.floor(xinv)===xinv){return[1,xinv];}const x_=x>1?xinv:x;let a=0,b=1,c=1,d=1;while(true){const p=a+c,q=b+d;if(q>limit){break;}if(x_<=p/q){c=p;d=q;}else{a=p;b=q;}}let result;if(x_-a/b<c/d-x_){result=x_===x?[a,b]:[b,a];}else{result=x_===x?[c,d]:[d,c];}return result;}function roundToDivide(x,div){const r=x%div;return r===0?x:Math.round(x-r+div);}function getPageSizeInches(_ref){let{view,userUnit,rotate}=_ref;const[x1,y1,x2,y2]=view;const changeOrientation=rotate%180!==0;const width=(x2-x1)/72*userUnit;const height=(y2-y1)/72*userUnit;return{width:changeOrientation?height:width,height:changeOrientation?width:height};}function backtrackBeforeAllVisibleElements(index,views,top){if(index<2){return index;}let elt=views[index].div;let pageTop=elt.offsetTop+elt.clientTop;if(pageTop>=top){elt=views[index-1].div;pageTop=elt.offsetTop+elt.clientTop;}for(let i=index-2;i>=0;--i){elt=views[i].div;if(elt.offsetTop+elt.clientTop+elt.clientHeight<=pageTop){break;}index=i;}return index;}function getVisibleElements(_ref2){let{scrollEl,views,sortByVisibility=false,horizontal=false,rtl=false}=_ref2;const top=scrollEl.scrollTop,bottom=top+scrollEl.clientHeight;const left=scrollEl.scrollLeft,right=left+scrollEl.clientWidth;function isElementBottomAfterViewTop(view){const element=view.div;const elementBottom=element.offsetTop+element.clientTop+element.clientHeight;return elementBottom>top;}function isElementNextAfterViewHorizontally(view){const element=view.div;const elementLeft=element.offsetLeft+element.clientLeft;const elementRight=elementLeft+element.clientWidth;return rtl?elementLeft<right:elementRight>left;}const visible=[],ids=new Set(),numViews=views.length;let firstVisibleElementInd=binarySearchFirstItem(views,horizontal?isElementNextAfterViewHorizontally:isElementBottomAfterViewTop);if(firstVisibleElementInd>0&&firstVisibleElementInd<numViews&&!horizontal){firstVisibleElementInd=backtrackBeforeAllVisibleElements(firstVisibleElementInd,views,top);}let lastEdge=horizontal?right:-1;for(let i=firstVisibleElementInd;i<numViews;i++){const view=views[i],element=view.div;const currentWidth=element.offsetLeft+element.clientLeft;const currentHeight=element.offsetTop+element.clientTop;const viewWidth=element.clientWidth,viewHeight=element.clientHeight;const viewRight=currentWidth+viewWidth;const viewBottom=currentHeight+viewHeight;if(lastEdge===-1){if(viewBottom>=bottom){lastEdge=viewBottom;}}else if((horizontal?currentWidth:currentHeight)>lastEdge){break;}if(viewBottom<=top||currentHeight>=bottom||viewRight<=left||currentWidth>=right){continue;}const hiddenHeight=Math.max(0,top-currentHeight)+Math.max(0,viewBottom-bottom);const hiddenWidth=Math.max(0,left-currentWidth)+Math.max(0,viewRight-right);const fractionHeight=(viewHeight-hiddenHeight)/viewHeight,fractionWidth=(viewWidth-hiddenWidth)/viewWidth;const percent=fractionHeight*fractionWidth*100|0;visible.push({id:view.id,x:currentWidth,y:currentHeight,view,percent,widthPercent:fractionWidth*100|0});ids.add(view.id);}const first=visible[0],last=visible.at(-1);if(sortByVisibility){visible.sort(function(a,b){const pc=a.percent-b.percent;if(Math.abs(pc)>0.001){return-pc;}return a.id-b.id;});}return{first,last,views:visible,ids};}function normalizeWheelEventDirection(evt){let delta=Math.hypot(evt.deltaX,evt.deltaY);const angle=Math.atan2(evt.deltaY,evt.deltaX);if(-0.25*Math.PI<angle&&angle<0.75*Math.PI){delta=-delta;}return delta;}function normalizeWheelEventDelta(evt){const deltaMode=evt.deltaMode;let delta=normalizeWheelEventDirection(evt);const MOUSE_PIXELS_PER_LINE=30;const MOUSE_LINES_PER_PAGE=30;if(deltaMode===WheelEvent.DOM_DELTA_PIXEL){delta/=MOUSE_PIXELS_PER_LINE*MOUSE_LINES_PER_PAGE;}else if(deltaMode===WheelEvent.DOM_DELTA_LINE){delta/=MOUSE_LINES_PER_PAGE;}return delta;}function isValidRotation(angle){return Number.isInteger(angle)&&angle%90===0;}function isValidScrollMode(mode){return Number.isInteger(mode)&&Object.values(ScrollMode).includes(mode)&&mode!==ScrollMode.UNKNOWN;}function isValidSpreadMode(mode){return Number.isInteger(mode)&&Object.values(SpreadMode).includes(mode)&&mode!==SpreadMode.UNKNOWN;}function isPortraitOrientation(size){return size.width<=size.height;}const animationStarted=new Promise(function(resolve){window.ngxZone.runOutsideAngular(()=>{window.requestAnimationFrame(resolve);});});const docStyle=document.documentElement.style;function clamp(v,min,max){return Math.min(Math.max(v,min),max);}var _classList=/*#__PURE__*/new WeakMap();var _disableAutoFetchTimeout=/*#__PURE__*/new WeakMap();var _percent=/*#__PURE__*/new WeakMap();var _style=/*#__PURE__*/new WeakMap();var _visible=/*#__PURE__*/new WeakMap();class ProgressBar{constructor(bar){_classPrivateFieldInitSpec(this,_classList,null);_classPrivateFieldInitSpec(this,_disableAutoFetchTimeout,null);_classPrivateFieldInitSpec(this,_percent,0);_classPrivateFieldInitSpec(this,_style,null);_classPrivateFieldInitSpec(this,_visible,true);_classPrivateFieldSet(_classList,this,bar.classList);_classPrivateFieldSet(_style,this,bar.style);}get percent(){return _classPrivateFieldGet(_percent,this);}set percent(val){_classPrivateFieldSet(_percent,this,clamp(val,0,100));if(isNaN(val)){_classPrivateFieldGet(_classList,this).add("indeterminate");return;}_classPrivateFieldGet(_classList,this).remove("indeterminate");_classPrivateFieldGet(_style,this).setProperty("--progressBar-percent",`${_classPrivateFieldGet(_percent,this)}%`);}setWidth(viewer){if(!viewer){return;}const container=viewer.parentNode;const scrollbarWidth=container.offsetWidth-viewer.offsetWidth;if(scrollbarWidth>0){_classPrivateFieldGet(_style,this).setProperty("--progressBar-end-offset",`${scrollbarWidth}px`);}}setDisableAutoFetch(){let delay=arguments.length>0&&arguments[0]!==undefined?arguments[0]:5000;if(isNaN(_classPrivateFieldGet(_percent,this))){return;}if(_classPrivateFieldGet(_disableAutoFetchTimeout,this)){clearTimeout(_classPrivateFieldGet(_disableAutoFetchTimeout,this));}this.show();_classPrivateFieldSet(_disableAutoFetchTimeout,this,setTimeout(()=>{_classPrivateFieldSet(_disableAutoFetchTimeout,this,null);this.hide();},delay));}hide(){if(!_classPrivateFieldGet(_visible,this)){return;}_classPrivateFieldSet(_visible,this,false);_classPrivateFieldGet(_classList,this).add("hidden");}show(){if(_classPrivateFieldGet(_visible,this)){return;}_classPrivateFieldSet(_visible,this,true);_classPrivateFieldGet(_classList,this).remove("hidden");}}function getActiveOrFocusedElement(){let curRoot=document;let curActiveOrFocused=curRoot.activeElement||curRoot.querySelector(":focus");while(curActiveOrFocused?.shadowRoot){curRoot=curActiveOrFocused.shadowRoot;curActiveOrFocused=curRoot.activeElement||curRoot.querySelector(":focus");}return curActiveOrFocused;}function apiPageLayoutToViewerModes(layout){let scrollMode=ScrollMode.VERTICAL,spreadMode=SpreadMode.NONE;switch(layout){case"SinglePage":scrollMode=ScrollMode.PAGE;break;case"OneColumn":break;case"TwoPageLeft":scrollMode=ScrollMode.PAGE;case"TwoColumnLeft":spreadMode=SpreadMode.ODD;break;case"TwoPageRight":scrollMode=ScrollMode.PAGE;case"TwoColumnRight":spreadMode=SpreadMode.EVEN;break;}return{scrollMode,spreadMode};}function apiPageModeToSidebarView(mode){switch(mode){case"UseNone":return SidebarView.NONE;case"UseThumbs":return SidebarView.THUMBS;case"UseOutlines":return SidebarView.OUTLINE;case"UseAttachments":return SidebarView.ATTACHMENTS;case"UseOC":return SidebarView.LAYERS;}return SidebarView.NONE;}function toggleCheckedBtn(button,toggle){let view=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;button.classList.toggle("toggled",toggle);button.setAttribute("aria-checked",toggle);view?.classList.toggle("hidden",!toggle);}function toggleExpandedBtn(button,toggle){let view=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;button.classList.toggle("toggled",toggle);button.setAttribute("aria-expanded",toggle);view?.classList.toggle("hidden",!toggle);}
;// CONCATENATED MODULE: ./web/app_options.js
{var compatibilityParams=Object.create(null);const userAgent=navigator.userAgent||"";const platform=navigator.platform||"";const maxTouchPoints=navigator.maxTouchPoints||1;const isAndroid=/Android/.test(userAgent);const isIOS=/\b(iPad|iPhone|iPod)(?=;)/.test(userAgent)||platform==="MacIntel"&&maxTouchPoints>1;(function checkCanvasSizeLimitation(){if(isIOS||isAndroid){compatibilityParams.maxCanvasPixels=5242880;}})();}const OptionKind={BROWSER:0x01,VIEWER:0x02,API:0x04,WORKER:0x08,PREFERENCE:0x80};const defaultOptions={canvasMaxAreaInBytes:{value:-1,kind:OptionKind.BROWSER+OptionKind.API},isInAutomation:{value:false,kind:OptionKind.BROWSER},supportsCaretBrowsingMode:{value:false,kind:OptionKind.BROWSER},supportsDocumentFonts:{value:true,kind:OptionKind.BROWSER},supportsIntegratedFind:{value:false,kind:OptionKind.BROWSER},supportsMouseWheelZoomCtrlKey:{value:true,kind:OptionKind.BROWSER},supportsMouseWheelZoomMetaKey:{value:true,kind:OptionKind.BROWSER},supportsPinchToZoom:{value:true,kind:OptionKind.BROWSER},annotationEditorMode:{value:0,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},annotationMode:{value:2,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},cursorToolOnLoad:{value:0,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},debuggerSrc:{value:"./debugger.mjs",kind:OptionKind.VIEWER},defaultZoomDelay:{value:400,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},defaultZoomValue:{value:"",kind:OptionKind.VIEWER+OptionKind.PREFERENCE},disableHistory:{value:false,kind:OptionKind.VIEWER},disablePageLabels:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enableHighlightEditor:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enableHighlightFloatingButton:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enableML:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enablePermissions:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enablePrintAutoRotate:{value:true,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enableScripting:{value:true,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},enableStampEditor:{value:true,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},externalLinkRel:{value:"noopener noreferrer nofollow",kind:OptionKind.VIEWER},externalLinkTarget:{value:0,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},highlightEditorColors:{value:"yellow=#FFFF98,green=#53FFBC,blue=#80EBFF,pink=#FFCBE6,red=#FF4F5F",kind:OptionKind.VIEWER+OptionKind.PREFERENCE},historyUpdateUrl:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},ignoreDestinationZoom:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},imageResourcesPath:{value:"./images/",kind:OptionKind.VIEWER},maxCanvasPixels:{value:2**25,kind:OptionKind.VIEWER},forcePageColors:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},pageColorsBackground:{value:"Canvas",kind:OptionKind.VIEWER+OptionKind.PREFERENCE},pageColorsForeground:{value:"CanvasText",kind:OptionKind.VIEWER+OptionKind.PREFERENCE},pdfBugEnabled:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},printResolution:{value:150,kind:OptionKind.VIEWER},removePageBorders:{value:false,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},sidebarViewOnLoad:{value:-1,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},scrollModeOnLoad:{value:-1,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},spreadModeOnLoad:{value:-1,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},textLayerMode:{value:1,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},viewOnLoad:{value:0,kind:OptionKind.VIEWER+OptionKind.PREFERENCE},cMapPacked:{value:true,kind:OptionKind.API},cMapUrl:{value:"../web/cmaps/",kind:OptionKind.API},disableAutoFetch:{value:false,kind:OptionKind.API+OptionKind.PREFERENCE},disableFontFace:{value:false,kind:OptionKind.API+OptionKind.PREFERENCE},disableRange:{value:false,kind:OptionKind.API+OptionKind.PREFERENCE},disableStream:{value:false,kind:OptionKind.API+OptionKind.PREFERENCE},docBaseUrl:{value:"",kind:OptionKind.API},enableXfa:{value:true,kind:OptionKind.API+OptionKind.PREFERENCE},fontExtraProperties:{value:false,kind:OptionKind.API},isEvalSupported:{value:true,kind:OptionKind.API},isOffscreenCanvasSupported:{value:true,kind:OptionKind.API},maxImageSize:{value:-1,kind:OptionKind.API},pdfBug:{value:false,kind:OptionKind.API},standardFontDataUrl:{value:"../web/standard_fonts/",kind:OptionKind.API},verbosity:{value:1,kind:OptionKind.API},workerPort:{value:null,kind:OptionKind.WORKER},workerSrc:{value:"./assets/pdf.worker.mjs",kind:OptionKind.WORKER}};{defaultOptions.defaultUrl={value:"compressed.tracemonkey-pldi-09.pdf",kind:OptionKind.VIEWER};defaultOptions.sandboxBundleSrc={value:"../build/pdf.sandbox.mjs",kind:OptionKind.VIEWER};defaultOptions.viewerCssTheme={value:0,kind:OptionKind.VIEWER+OptionKind.PREFERENCE};}{defaultOptions.disablePreferences={value:false,kind:OptionKind.VIEWER};defaultOptions.locale={value:navigator.language||"en-US",kind:OptionKind.VIEWER};}const userOptions=Object.create(null);{for(const name in compatibilityParams){userOptions[name]=compatibilityParams[name];}}if(globalThis.pdfDefaultOptions){for(const key in globalThis.pdfDefaultOptions){userOptions[key]=globalThis.pdfDefaultOptions[key];}}class AppOptions{constructor(){throw new Error("Cannot initialize AppOptions.");}static get(name){return userOptions[name]??defaultOptions[name]?.value??undefined;}static getAll(){let kind=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;let defaultOnly=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;const options=Object.create(null);for(const name in defaultOptions){const defaultOption=defaultOptions[name];if(kind&&!(kind&defaultOption.kind)){continue;}options[name]=defaultOnly?defaultOption.value:userOptions[name]??defaultOption.value;}return options;}static set(name,value){userOptions[name]=value;}static setAll(options){let init=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(init){if(this.get("disablePreferences")){return;}for(const name in userOptions){if(compatibilityParams[name]!==undefined){continue;}console.warn("setAll: The Preferences may override manually set AppOptions; "+'please use the "disablePreferences"-option in order to prevent that.');break;}}for(const name in options){userOptions[name]=options[name];}}static remove(name){delete userOptions[name];const val=compatibilityParams[name];if(val!==undefined){userOptions[name]=val;}}}
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.json.parse.js
var esnext_json_parse = __webpack_require__(8335);
;// CONCATENATED MODULE: ./web/pdf_link_service.js
function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}const DEFAULT_LINK_REL="noopener noreferrer nofollow";const LinkTarget={NONE:0,SELF:1,BLANK:2,PARENT:3,TOP:4};class PDFLinkService{constructor(){let{eventBus,externalLinkTarget=null,externalLinkRel=null,ignoreDestinationZoom=false}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_defineProperty(this,"externalLinkEnabled",true);this.eventBus=eventBus;this.externalLinkTarget=externalLinkTarget;this.externalLinkRel=externalLinkRel;this._ignoreDestinationZoom=ignoreDestinationZoom;this.baseUrl=null;this.pdfDocument=null;this.pdfViewer=null;this.pdfHistory=null;}setDocument(pdfDocument){let baseUrl=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;this.baseUrl=baseUrl;this.pdfDocument=pdfDocument;}setViewer(pdfViewer){this.pdfViewer=pdfViewer;}setHistory(pdfHistory){this.pdfHistory=pdfHistory;}get pagesCount(){return this.pdfDocument?this.pdfDocument.numPages:0;}get page(){return this.pdfDocument?this.pdfViewer.currentPageNumber:1;}set page(value){if(this.pdfDocument){this.pdfViewer.currentPageNumber=value;}}get rotation(){return this.pdfDocument?this.pdfViewer.pagesRotation:0;}set rotation(value){if(this.pdfDocument){this.pdfViewer.pagesRotation=value;}}get isInPresentationMode(){return this.pdfDocument?this.pdfViewer.isInPresentationMode:false;}async goToDestination(dest){if(!this.pdfDocument){return;}let namedDest,explicitDest,pageNumber;if(typeof dest==="string"){namedDest=dest;explicitDest=await this.pdfDocument.getDestination(dest);}else{namedDest=null;explicitDest=await dest;}if(!Array.isArray(explicitDest)){console.error(`goToDestination: "${explicitDest}" is not a valid destination array, for dest="${dest}".`);return;}const[destRef]=explicitDest;if(destRef&&typeof destRef==="object"){pageNumber=this.pdfDocument.cachedPageNumber(destRef);if(!pageNumber){try{pageNumber=(await this.pdfDocument.getPageIndex(destRef))+1;}catch{globalThis.ngxConsole.error(`goToDestination: "${destRef}" is not a valid page reference, for dest="${dest}".`);return;}}}else if(Number.isInteger(destRef)){pageNumber=destRef+1;}if(!pageNumber||pageNumber<1||pageNumber>this.pagesCount){globalThis.ngxConsole.error(`goToDestination: "${pageNumber}" is not a valid page number, for dest="${dest}".`);return;}if(this.pdfHistory){this.pdfHistory.pushCurrentPosition();this.pdfHistory.push({namedDest,explicitDest,pageNumber});}this.pdfViewer.scrollPageIntoView({pageNumber,destArray:explicitDest,ignoreDestinationZoom:this._ignoreDestinationZoom});}goToPage(val){if(!this.pdfDocument){return;}const pageNumber=typeof val==="string"&&this.pdfViewer.pageLabelToPageNumber(val)||val|0;if(!(Number.isInteger(pageNumber)&&pageNumber>0&&pageNumber<=this.pagesCount)){globalThis.ngxConsole.error(`PDFLinkService.goToPage: "${val}" is not a valid page.`);return;}if(this.pdfHistory){this.pdfHistory.pushCurrentPosition();this.pdfHistory.pushPage(pageNumber);}if(this.pdfViewer.pageViewMode==="book"){if(this.pdfViewer.pageFlip){this.pdfViewer.ensureAdjacentPagesAreLoaded();const evenPage=this.pdfViewer.currentPageNumber-this.pdfViewer.currentPageNumber%2;const evenTargetPage=pageNumber-pageNumber%2;if(evenPage===evenTargetPage-2){this.pdfViewer.pageFlip.flipNext();}else if(evenPage===evenTargetPage+2){this.pdfViewer.pageFlip.flipPrev();}else{this.pdfViewer.pageFlip.turnToPage(pageNumber-1);}}}else{this.pdfViewer.scrollPageIntoView({pageNumber});}}addLinkAttributes(link,url){let newWindow=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(!url||typeof url!=="string"){throw new Error('A valid "url" parameter must provided.');}const target=newWindow?LinkTarget.BLANK:this.externalLinkTarget,rel=this.externalLinkRel;if(this.externalLinkEnabled){link.href=link.title=url;}else{link.href="";link.title=`Disabled: ${url}`;link.onclick=()=>false;}let targetStr="";switch(target){case LinkTarget.NONE:break;case LinkTarget.SELF:targetStr="_self";break;case LinkTarget.BLANK:targetStr="_blank";break;case LinkTarget.PARENT:targetStr="_parent";break;case LinkTarget.TOP:targetStr="_top";break;}link.target=targetStr;link.rel=typeof rel==="string"?rel:DEFAULT_LINK_REL;}getDestinationHash(dest){if(typeof dest==="string"){if(dest.length>0){return this.getAnchorUrl("#"+escape(dest));}}else if(Array.isArray(dest)){const str=JSON.stringify(dest);if(str.length>0){return this.getAnchorUrl("#"+escape(str));}}return this.getAnchorUrl("");}getAnchorUrl(anchor){return this.baseUrl?this.baseUrl+anchor:anchor;}setHash(hash){if(!this.pdfDocument){return;}let pageNumber,dest;if(hash.includes("=")){const params=parseQueryString(hash);if(params.has("search")){const query=params.get("search").replaceAll('"',""),phrase=params.get("phrase")==="true";this.eventBus.dispatch("findfromurlhash",{source:this,query:phrase?query:query.match(/\S+/g)});}if(params.has("page")){pageNumber=params.get("page")|0||1;}if(params.has("zoom")){const zoomArgs=params.get("zoom").split(",");const zoomArg=zoomArgs[0];const zoomArgNumber=parseFloat(zoomArg);if(!zoomArg.includes("Fit")){dest=[null,{name:"XYZ"},zoomArgs.length>1?zoomArgs[1]|0:null,zoomArgs.length>2?zoomArgs[2]|0:null,zoomArgNumber?zoomArgNumber/100:zoomArg];}else if(zoomArg==="Fit"||zoomArg==="FitB"){dest=[null,{name:zoomArg}];}else if(zoomArg==="FitH"||zoomArg==="FitBH"||zoomArg==="FitV"||zoomArg==="FitBV"){dest=[null,{name:zoomArg},zoomArgs.length>1?zoomArgs[1]|0:null];}else if(zoomArg==="FitR"){if(zoomArgs.length!==5){globalThis.ngxConsole.error('PDFLinkService.setHash: Not enough parameters for "FitR".');}else{dest=[null,{name:zoomArg},zoomArgs[1]|0,zoomArgs[2]|0,zoomArgs[3]|0,zoomArgs[4]|0];}}else{globalThis.ngxConsole.error(`PDFLinkService.setHash: "${zoomArg}" is not a valid zoom value.`);}}if(dest){this.pdfViewer.scrollPageIntoView({pageNumber:pageNumber||this.page,destArray:dest,allowNegativeOffset:true});}else if(pageNumber){this.page=pageNumber;}if(params.has("pagemode")){this.eventBus.dispatch("pagemode",{source:this,mode:params.get("pagemode")});}if(params.has("nameddest")){this.goToDestination(params.get("nameddest"));}return;}dest=unescape(hash);try{dest=JSON.parse(dest);if(!Array.isArray(dest)){dest=dest.toString();}}catch{}if(typeof dest==="string"||_isValidExplicitDest.call(PDFLinkService,dest)){this.goToDestination(dest);return;}console.error(`PDFLinkService.setHash: "${unescape(hash)}" is not a valid destination.`);}executeNamedAction(action){if(!this.pdfDocument){return;}switch(action){case"GoBack":this.pdfHistory?.back();break;case"GoForward":this.pdfHistory?.forward();break;case"NextPage":this.pdfViewer.nextPage();break;case"PrevPage":this.pdfViewer.previousPage();break;case"LastPage":this.page=this.pagesCount;break;case"FirstPage":this.page=1;break;default:break;}this.eventBus.dispatch("namedaction",{source:this,action});}async executeSetOCGState(action){if(!this.pdfDocument){return;}const pdfDocument=this.pdfDocument,optionalContentConfig=await this.pdfViewer.optionalContentConfigPromise;if(pdfDocument!==this.pdfDocument){return;}optionalContentConfig.setOCGState(action);this.pdfViewer.optionalContentConfigPromise=Promise.resolve(optionalContentConfig);}}function _isValidExplicitDest(dest){if(!Array.isArray(dest)||dest.length<2){return false;}const[page,zoom,...args]=dest;if(!(typeof page==="object"&&Number.isInteger(page?.num)&&Number.isInteger(page?.gen))&&!Number.isInteger(page)){return false;}if(!(typeof zoom==="object"&&typeof zoom?.name==="string")){return false;}let allowNull=true;switch(zoom.name){case"XYZ":if(args.length!==3){return false;}break;case"Fit":case"FitB":return args.length===0;case"FitH":case"FitBH":case"FitV":case"FitBV":if(args.length!==1){return false;}break;case"FitR":if(args.length!==4){return false;}allowNull=false;break;default:return false;}for(const arg of args){if(!(typeof arg==="number"||allowNull&&arg===null)){return false;}}return true;}class SimpleLinkService extends PDFLinkService{setDocument(pdfDocument){let baseUrl=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;}}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.with-resolvers.js
var es_promise_with_resolvers = __webpack_require__(4628);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.constructor.js
var esnext_iterator_constructor = __webpack_require__(8992);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.some.js
var esnext_iterator_some = __webpack_require__(7550);
;// CONCATENATED MODULE: ./web/pdfjs.js
const{AbortException,AnnotationEditorLayer,AnnotationEditorParamsType,AnnotationEditorType,AnnotationEditorUIManager,AnnotationLayer,AnnotationMode,build,CMapCompressionType,ColorPicker,createValidAbsoluteUrl,DOMSVGFactory,DrawLayer,FeatureTest,fetchData,getDocument,getFilenameFromUrl,getPdfFilenameFromUrl: pdfjs_getPdfFilenameFromUrl,getXfaPageViewport,GlobalWorkerOptions,ImageKind,InvalidPDFException,isDataScheme,isPdfFile,MissingPDFException,noContextMenu,normalizeUnicode,OPS,Outliner,PasswordResponses,PDFDataRangeTransport,PDFDateString,PDFWorker,PermissionFlag,PixelsPerInch,RenderingCancelledException,renderTextLayer,setLayerDimensions,shadow,TextLayer,UnexpectedResponseException,updateTextLayer,Util,VerbosityLevel,version,XfaLayer}=globalThis.pdfjsLib;
;// CONCATENATED MODULE: ./web/ngx-extended-pdf-viewer-version.js
const ngxExtendedPdfViewerVersion='20.5.1';
;// CONCATENATED MODULE: ./web/event_utils.js
function event_utils_classPrivateFieldInitSpec(e,t,a){event_utils_checkPrivateRedeclaration(e,t),t.set(e,a);}function event_utils_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function event_utils_classPrivateFieldGet(s,a){return s.get(event_utils_assertClassBrand(s,a));}function event_utils_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const WaitOnType={EVENT:"event",TIMEOUT:"timeout"};async function waitOnEventOrTimeout(_ref){let{target,name,delay=0}=_ref;if(typeof target!=="object"||!(name&&typeof name==="string")||!(Number.isInteger(delay)&&delay>=0)){throw new Error("waitOnEventOrTimeout - invalid parameters.");}const{promise,resolve}=Promise.withResolvers();const ac=new AbortController();function handler(type){ac.abort();clearTimeout(timeout);resolve(type);}const evtMethod=target instanceof EventBus?"_on":"addEventListener";target[evtMethod](name,handler.bind(null,WaitOnType.EVENT),{signal:ac.signal});const timeout=setTimeout(handler.bind(null,WaitOnType.TIMEOUT),delay);return promise;}var _listeners=/*#__PURE__*/new WeakMap();class EventBus{constructor(){event_utils_classPrivateFieldInitSpec(this,_listeners,Object.create(null));}on(eventName,listener){let options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;this._on(eventName,listener,{external:true,once:options?.once,signal:options?.signal});}off(eventName,listener){let options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;this._off(eventName,listener);}dispatch(eventName,data){const eventListeners=event_utils_classPrivateFieldGet(_listeners,this)[eventName];if(!eventListeners||eventListeners.length===0){return;}let externalListeners;for(const{listener,external,once}of eventListeners.slice(0)){if(once){this._off(eventName,listener);}if(external){(externalListeners||=[]).push(listener);continue;}listener(data);}if(externalListeners){for(const listener of externalListeners){listener(data);}externalListeners=null;}}_on(eventName,listener){let options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;let rmAbort=null;if(options?.signal instanceof AbortSignal){const{signal}=options;if(signal.aborted){console.error("Cannot use an `aborted` signal.");return;}const onAbort=()=>this._off(eventName,listener);rmAbort=()=>signal.removeEventListener("abort",onAbort);signal.addEventListener("abort",onAbort);}const eventListeners=event_utils_classPrivateFieldGet(_listeners,this)[eventName]||=[];eventListeners.push({listener,external:options?.external===true,once:options?.once===true,rmAbort});}_off(eventName,listener){let options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;const eventListeners=event_utils_classPrivateFieldGet(_listeners,this)[eventName];if(!eventListeners){return;}for(let i=0,ii=eventListeners.length;i<ii;i++){const evt=eventListeners[i];if(evt.listener===listener){evt.rmAbort?.();eventListeners.splice(i,1);return;}}}destroy(){let eventName;for(eventName in event_utils_classPrivateFieldGet(_listeners,this)){event_utils_classPrivateFieldGet(_listeners,this)[eventName].length=0;}}}class AutomationEventBus extends EventBus{dispatch(eventName,data){throw new Error("Not implemented: AutomationEventBus.dispatch");}}
;// CONCATENATED MODULE: ./web/external_services.js
class BaseExternalServices{constructor(){if(this.constructor===BaseExternalServices){throw new Error("Cannot initialize BaseExternalServices.");}}updateFindControlState(data){}updateFindMatchesCount(data){}initPassiveLoading(){}reportTelemetry(data){}async createL10n(){throw new Error("Not implemented: createL10n");}createScripting(){throw new Error("Not implemented: createScripting");}updateEditorStates(data){throw new Error("Not implemented: updateEditorStates");}async getNimbusExperimentData(){}}
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__(4979);
;// CONCATENATED MODULE: ./web/preferences.js
function _classPrivateMethodInitSpec(e,a){preferences_checkPrivateRedeclaration(e,a),a.add(e);}function preferences_classPrivateFieldInitSpec(e,t,a){preferences_checkPrivateRedeclaration(e,t),t.set(e,a);}function preferences_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function preferences_classPrivateFieldSet(s,a,r){return s.set(preferences_assertClassBrand(s,a),r),r;}function preferences_classPrivateFieldGet(s,a){return s.get(preferences_assertClassBrand(s,a));}function preferences_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _browserDefaults=/*#__PURE__*/new WeakMap();var _defaults=/*#__PURE__*/new WeakMap();var _prefs=/*#__PURE__*/new WeakMap();var _initializedPromise=/*#__PURE__*/new WeakMap();var _BasePreferences_brand=/*#__PURE__*/new WeakSet();class BasePreferences{constructor(){_classPrivateMethodInitSpec(this,_BasePreferences_brand);preferences_classPrivateFieldInitSpec(this,_browserDefaults,Object.freeze({canvasMaxAreaInBytes:-1,isInAutomation:false,supportsCaretBrowsingMode:false,supportsDocumentFonts:true,supportsIntegratedFind:false,supportsMouseWheelZoomCtrlKey:true,supportsMouseWheelZoomMetaKey:true,supportsPinchToZoom:true}));preferences_classPrivateFieldInitSpec(this,_defaults,Object.freeze({annotationEditorMode:0,annotationMode:2,cursorToolOnLoad:0,defaultZoomDelay:400,defaultZoomValue:"",disablePageLabels:false,enableHighlightEditor:false,enableHighlightFloatingButton:false,enableML:false,enablePermissions:false,enablePrintAutoRotate:true,enableScripting:true,enableStampEditor:true,externalLinkTarget:0,highlightEditorColors:"yellow=#FFFF98,green=#53FFBC,blue=#80EBFF,pink=#FFCBE6,red=#FF4F5F",historyUpdateUrl:false,ignoreDestinationZoom:false,forcePageColors:false,pageColorsBackground:"Canvas",pageColorsForeground:"CanvasText",pdfBugEnabled:false,removePageBorders:false,sidebarViewOnLoad:-1,scrollModeOnLoad:-1,spreadModeOnLoad:-1,textLayerMode:1,viewOnLoad:0,disableAutoFetch:false,disableFontFace:false,disableRange:false,disableStream:false,enableXfa:true,viewerCssTheme:0}));preferences_classPrivateFieldInitSpec(this,_prefs,Object.create(null));preferences_classPrivateFieldInitSpec(this,_initializedPromise,null);if(this.constructor===BasePreferences){throw new Error("Cannot initialize BasePreferences.");}preferences_classPrivateFieldSet(_initializedPromise,this,this._readFromStorage(preferences_classPrivateFieldGet(_defaults,this)).then(_ref=>{let{browserPrefs,prefs}=_ref;const options=Object.create(null);for(const[name,val]of Object.entries(preferences_classPrivateFieldGet(_browserDefaults,this))){const prefVal=browserPrefs?.[name];options[name]=typeof prefVal===typeof val?prefVal:val;}for(const[name,val]of Object.entries(preferences_classPrivateFieldGet(_defaults,this))){const prefVal=prefs?.[name];options[name]=preferences_classPrivateFieldGet(_prefs,this)[name]=typeof prefVal===typeof val?prefVal:val;}AppOptions.setAll(options,true);}));}async _writeToStorage(prefObj){throw new Error("Not implemented: _writeToStorage");}async _readFromStorage(prefObj){throw new Error("Not implemented: _readFromStorage");}async reset(){await preferences_classPrivateFieldGet(_initializedPromise,this);const oldPrefs=structuredClone(preferences_classPrivateFieldGet(_prefs,this));preferences_classPrivateFieldSet(_prefs,this,Object.create(null));try{await this._writeToStorage(preferences_classPrivateFieldGet(_defaults,this));}catch(reason){preferences_classPrivateFieldSet(_prefs,this,oldPrefs);throw reason;}}async set(name,value){await preferences_classPrivateFieldGet(_initializedPromise,this);const defaultValue=preferences_classPrivateFieldGet(_defaults,this)[name],oldPrefs=structuredClone(preferences_classPrivateFieldGet(_prefs,this));if(defaultValue===undefined){throw new Error(`Set preference: "${name}" is undefined.`);}else if(value===undefined){throw new Error("Set preference: no value is specified.");}const valueType=typeof value,defaultType=typeof defaultValue;if(valueType!==defaultType){if(valueType==="number"&&defaultType==="string"){value=value.toString();}else{throw new Error(`Set preference: "${value}" is a ${valueType}, expected a ${defaultType}.`);}}else if(valueType==="number"&&!Number.isInteger(value)){throw new Error(`Set preference: "${value}" must be an integer.`);}preferences_classPrivateFieldGet(_prefs,this)[name]=value;try{await this._writeToStorage(preferences_classPrivateFieldGet(_prefs,this));}catch(reason){preferences_classPrivateFieldSet(_prefs,this,oldPrefs);throw reason;}}async get(name){await preferences_classPrivateFieldGet(_initializedPromise,this);const defaultValue=preferences_classPrivateFieldGet(_defaults,this)[name];if(defaultValue===undefined){throw new Error(`Get preference: "${name}" is undefined.`);}return preferences_classPrivateFieldGet(_prefs,this)[name]??defaultValue;}get initializedPromise(){return preferences_classPrivateFieldGet(_initializedPromise,this);}}function _updatePref(_ref2){let{name,value}=_ref2;throw new Error("Not implemented: #updatePref");}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/types.js
class FluentType{constructor(value){this.value=value;}valueOf(){return this.value;}}class FluentNone extends FluentType{constructor(){let value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"???";super(value);}toString(scope){return`{${this.value}}`;}}class FluentNumber extends FluentType{constructor(value){let opts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};super(value);this.opts=opts;}toString(scope){try{const nf=scope.memoizeIntlObject(Intl.NumberFormat,this.opts);return nf.format(this.value);}catch(err){scope.reportError(err);return this.value.toString(10);}}}class FluentDateTime extends FluentType{constructor(value){let opts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};super(value);this.opts=opts;}toString(scope){try{const dtf=scope.memoizeIntlObject(Intl.DateTimeFormat,this.opts);return dtf.format(this.value);}catch(err){scope.reportError(err);return new Date(this.value).toISOString();}}}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/resolver.js
const MAX_PLACEABLES=100;const FSI="\u2068";const PDI="\u2069";function match(scope,selector,key){if(key===selector){return true;}if(key instanceof FluentNumber&&selector instanceof FluentNumber&&key.value===selector.value){return true;}if(selector instanceof FluentNumber&&typeof key==="string"){let category=scope.memoizeIntlObject(Intl.PluralRules,selector.opts).select(selector.value);if(key===category){return true;}}return false;}function getDefault(scope,variants,star){if(variants[star]){return resolvePattern(scope,variants[star].value);}scope.reportError(new RangeError("No default"));return new FluentNone();}function getArguments(scope,args){const positional=[];const named=Object.create(null);for(const arg of args){if(arg.type==="narg"){named[arg.name]=resolveExpression(scope,arg.value);}else{positional.push(resolveExpression(scope,arg));}}return{positional,named};}function resolveExpression(scope,expr){switch(expr.type){case"str":return expr.value;case"num":return new FluentNumber(expr.value,{minimumFractionDigits:expr.precision});case"var":return resolveVariableReference(scope,expr);case"mesg":return resolveMessageReference(scope,expr);case"term":return resolveTermReference(scope,expr);case"func":return resolveFunctionReference(scope,expr);case"select":return resolveSelectExpression(scope,expr);default:return new FluentNone();}}function resolveVariableReference(scope,_ref){let{name}=_ref;let arg;if(scope.params){if(Object.prototype.hasOwnProperty.call(scope.params,name)){arg=scope.params[name];}else{return new FluentNone(`$${name}`);}}else if(scope.args&&Object.prototype.hasOwnProperty.call(scope.args,name)){arg=scope.args[name];}else{scope.reportError(new ReferenceError(`Unknown variable: $${name}`));return new FluentNone(`$${name}`);}if(arg instanceof FluentType){return arg;}switch(typeof arg){case"string":return arg;case"number":return new FluentNumber(arg);case"object":if(arg instanceof Date){return new FluentDateTime(arg.getTime());}default:scope.reportError(new TypeError(`Variable type not supported: $${name}, ${typeof arg}`));return new FluentNone(`$${name}`);}}function resolveMessageReference(scope,_ref2){let{name,attr}=_ref2;const message=scope.bundle._messages.get(name);if(!message){scope.reportError(new ReferenceError(`Unknown message: ${name}`));return new FluentNone(name);}if(attr){const attribute=message.attributes[attr];if(attribute){return resolvePattern(scope,attribute);}scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));return new FluentNone(`${name}.${attr}`);}if(message.value){return resolvePattern(scope,message.value);}scope.reportError(new ReferenceError(`No value: ${name}`));return new FluentNone(name);}function resolveTermReference(scope,_ref3){let{name,attr,args}=_ref3;const id=`-${name}`;const term=scope.bundle._terms.get(id);if(!term){scope.reportError(new ReferenceError(`Unknown term: ${id}`));return new FluentNone(id);}if(attr){const attribute=term.attributes[attr];if(attribute){scope.params=getArguments(scope,args).named;const resolved=resolvePattern(scope,attribute);scope.params=null;return resolved;}scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));return new FluentNone(`${id}.${attr}`);}scope.params=getArguments(scope,args).named;const resolved=resolvePattern(scope,term.value);scope.params=null;return resolved;}function resolveFunctionReference(scope,_ref4){let{name,args}=_ref4;let func=scope.bundle._functions[name];if(!func){scope.reportError(new ReferenceError(`Unknown function: ${name}()`));return new FluentNone(`${name}()`);}if(typeof func!=="function"){scope.reportError(new TypeError(`Function ${name}() is not callable`));return new FluentNone(`${name}()`);}try{let resolved=getArguments(scope,args);return func(resolved.positional,resolved.named);}catch(err){scope.reportError(err);return new FluentNone(`${name}()`);}}function resolveSelectExpression(scope,_ref5){let{selector,variants,star}=_ref5;let sel=resolveExpression(scope,selector);if(sel instanceof FluentNone){return getDefault(scope,variants,star);}for(const variant of variants){const key=resolveExpression(scope,variant.key);if(match(scope,sel,key)){return resolvePattern(scope,variant.value);}}return getDefault(scope,variants,star);}function resolveComplexPattern(scope,ptn){if(scope.dirty.has(ptn)){scope.reportError(new RangeError("Cyclic reference"));return new FluentNone();}scope.dirty.add(ptn);const result=[];const useIsolating=scope.bundle._useIsolating&&ptn.length>1;for(const elem of ptn){if(typeof elem==="string"){result.push(scope.bundle._transform(elem));continue;}scope.placeables++;if(scope.placeables>MAX_PLACEABLES){scope.dirty.delete(ptn);throw new RangeError(`Too many placeables expanded: ${scope.placeables}, `+`max allowed is ${MAX_PLACEABLES}`);}if(useIsolating){result.push(FSI);}result.push(resolveExpression(scope,elem).toString(scope));if(useIsolating){result.push(PDI);}}scope.dirty.delete(ptn);return result.join("");}function resolvePattern(scope,value){if(typeof value==="string"){return scope.bundle._transform(value);}return resolveComplexPattern(scope,value);}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/scope.js
class Scope{constructor(bundle,errors,args){this.dirty=new WeakSet();this.params=null;this.placeables=0;this.bundle=bundle;this.errors=errors;this.args=args;}reportError(error){if(!this.errors||!(error instanceof Error)){throw error;}this.errors.push(error);}memoizeIntlObject(ctor,opts){let cache=this.bundle._intls.get(ctor);if(!cache){cache={};this.bundle._intls.set(ctor,cache);}let id=JSON.stringify(opts);if(!cache[id]){cache[id]=new ctor(this.bundle.locales,opts);}return cache[id];}}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/builtins.js
function values(opts,allowed){const unwrapped=Object.create(null);for(const[name,opt]of Object.entries(opts)){if(allowed.includes(name)){unwrapped[name]=opt.valueOf();}}return unwrapped;}const NUMBER_ALLOWED=["unitDisplay","currencyDisplay","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits"];function NUMBER(args,opts){let arg=args[0];if(arg instanceof FluentNone){return new FluentNone(`NUMBER(${arg.valueOf()})`);}if(arg instanceof FluentNumber){return new FluentNumber(arg.valueOf(),{...arg.opts,...values(opts,NUMBER_ALLOWED)});}if(arg instanceof FluentDateTime){return new FluentNumber(arg.valueOf(),{...values(opts,NUMBER_ALLOWED)});}throw new TypeError("Invalid argument to NUMBER");}const DATETIME_ALLOWED=["dateStyle","timeStyle","fractionalSecondDigits","dayPeriod","hour12","weekday","era","year","month","day","hour","minute","second","timeZoneName"];function DATETIME(args,opts){let arg=args[0];if(arg instanceof FluentNone){return new FluentNone(`DATETIME(${arg.valueOf()})`);}if(arg instanceof FluentDateTime){return new FluentDateTime(arg.valueOf(),{...arg.opts,...values(opts,DATETIME_ALLOWED)});}if(arg instanceof FluentNumber){return new FluentDateTime(arg.valueOf(),{...values(opts,DATETIME_ALLOWED)});}throw new TypeError("Invalid argument to DATETIME");}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/memoizer.js
const cache=new Map();function getMemoizerForLocale(locales){const stringLocale=Array.isArray(locales)?locales.join(" "):locales;let memoizer=cache.get(stringLocale);if(memoizer===undefined){memoizer=new Map();cache.set(stringLocale,memoizer);}return memoizer;}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/bundle.js
class FluentBundle{constructor(locales){let{functions,useIsolating=true,transform=v=>v}=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};this._terms=new Map();this._messages=new Map();this.locales=Array.isArray(locales)?locales:[locales];this._functions={NUMBER: NUMBER,DATETIME: DATETIME,...functions};this._useIsolating=useIsolating;this._transform=transform;this._intls=getMemoizerForLocale(locales);}hasMessage(id){return this._messages.has(id);}getMessage(id){return this._messages.get(id);}addResource(res){let{allowOverrides=false}=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};const errors=[];for(let i=0;i<res.body.length;i++){let entry=res.body[i];if(entry.id.startsWith("-")){if(allowOverrides===false&&this._terms.has(entry.id)){errors.push(new Error(`Attempt to override an existing term: "${entry.id}"`));continue;}this._terms.set(entry.id,entry);}else{if(allowOverrides===false&&this._messages.has(entry.id)){errors.push(new Error(`Attempt to override an existing message: "${entry.id}"`));continue;}this._messages.set(entry.id,entry);}}return errors;}formatPattern(pattern){let args=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let errors=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;if(typeof pattern==="string"){return this._transform(pattern);}let scope=new Scope(this,errors,args);try{let value=resolveComplexPattern(scope,pattern);return value.toString(scope);}catch(err){if(scope.errors&&err instanceof Error){scope.errors.push(err);return new FluentNone().toString(scope);}throw err;}}}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/resource.js
const RE_MESSAGE_START=/^(-?[a-zA-Z][\w-]*) *= */gm;const RE_ATTRIBUTE_START=/\.([a-zA-Z][\w-]*) *= */y;const RE_VARIANT_START=/\*?\[/y;const RE_NUMBER_LITERAL=/(-?[0-9]+(?:\.([0-9]+))?)/y;const RE_IDENTIFIER=/([a-zA-Z][\w-]*)/y;const RE_REFERENCE=/([$-])?([a-zA-Z][\w-]*)(?:\.([a-zA-Z][\w-]*))?/y;const RE_FUNCTION_NAME=/^[A-Z][A-Z0-9_-]*$/;const RE_TEXT_RUN=/([^{}\n\r]+)/y;const RE_STRING_RUN=/([^\\"\n\r]*)/y;const RE_STRING_ESCAPE=/\\([\\"])/y;const RE_UNICODE_ESCAPE=/\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{6})/y;const RE_LEADING_NEWLINES=/^\n+/;const RE_TRAILING_SPACES=/ +$/;const RE_BLANK_LINES=/ *\r?\n/g;const RE_INDENT=/( *)$/;const TOKEN_BRACE_OPEN=/{\s*/y;const TOKEN_BRACE_CLOSE=/\s*}/y;const TOKEN_BRACKET_OPEN=/\[\s*/y;const TOKEN_BRACKET_CLOSE=/\s*] */y;const TOKEN_PAREN_OPEN=/\s*\(\s*/y;const TOKEN_ARROW=/\s*->\s*/y;const TOKEN_COLON=/\s*:\s*/y;const TOKEN_COMMA=/\s*,?\s*/y;const TOKEN_BLANK=/\s+/y;class FluentResource{constructor(source){this.body=[];RE_MESSAGE_START.lastIndex=0;let cursor=0;while(true){let next=RE_MESSAGE_START.exec(source);if(next===null){break;}cursor=RE_MESSAGE_START.lastIndex;try{this.body.push(parseMessage(next[1]));}catch(err){if(err instanceof SyntaxError){continue;}throw err;}}function test(re){re.lastIndex=cursor;return re.test(source);}function consumeChar(char,errorClass){if(source[cursor]===char){cursor++;return true;}if(errorClass){throw new errorClass(`Expected ${char}`);}return false;}function consumeToken(re,errorClass){if(test(re)){cursor=re.lastIndex;return true;}if(errorClass){throw new errorClass(`Expected ${re.toString()}`);}return false;}function match(re){re.lastIndex=cursor;let result=re.exec(source);if(result===null){throw new SyntaxError(`Expected ${re.toString()}`);}cursor=re.lastIndex;return result;}function match1(re){return match(re)[1];}function parseMessage(id){let value=parsePattern();let attributes=parseAttributes();if(value===null&&Object.keys(attributes).length===0){throw new SyntaxError("Expected message value or attributes");}return{id,value,attributes};}function parseAttributes(){let attrs=Object.create(null);while(test(RE_ATTRIBUTE_START)){let name=match1(RE_ATTRIBUTE_START);let value=parsePattern();if(value===null){throw new SyntaxError("Expected attribute value");}attrs[name]=value;}return attrs;}function parsePattern(){let first;if(test(RE_TEXT_RUN)){first=match1(RE_TEXT_RUN);}if(source[cursor]==="{"||source[cursor]==="}"){return parsePatternElements(first?[first]:[],Infinity);}let indent=parseIndent();if(indent){if(first){return parsePatternElements([first,indent],indent.length);}indent.value=trim(indent.value,RE_LEADING_NEWLINES);return parsePatternElements([indent],indent.length);}if(first){return trim(first,RE_TRAILING_SPACES);}return null;}function parsePatternElements(){let elements=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];let commonIndent=arguments.length>1?arguments[1]:undefined;while(true){if(test(RE_TEXT_RUN)){elements.push(match1(RE_TEXT_RUN));continue;}if(source[cursor]==="{"){elements.push(parsePlaceable());continue;}if(source[cursor]==="}"){throw new SyntaxError("Unbalanced closing brace");}let indent=parseIndent();if(indent){elements.push(indent);commonIndent=Math.min(commonIndent,indent.length);continue;}break;}let lastIndex=elements.length-1;let lastElement=elements[lastIndex];if(typeof lastElement==="string"){elements[lastIndex]=trim(lastElement,RE_TRAILING_SPACES);}let baked=[];for(let element of elements){if(element instanceof Indent){element=element.value.slice(0,element.value.length-commonIndent);}if(element){baked.push(element);}}return baked;}function parsePlaceable(){consumeToken(TOKEN_BRACE_OPEN,SyntaxError);let selector=parseInlineExpression();if(consumeToken(TOKEN_BRACE_CLOSE)){return selector;}if(consumeToken(TOKEN_ARROW)){let variants=parseVariants();consumeToken(TOKEN_BRACE_CLOSE,SyntaxError);return{type:"select",selector,...variants};}throw new SyntaxError("Unclosed placeable");}function parseInlineExpression(){if(source[cursor]==="{"){return parsePlaceable();}if(test(RE_REFERENCE)){let[,sigil,name,attr=null]=match(RE_REFERENCE);if(sigil==="$"){return{type:"var",name};}if(consumeToken(TOKEN_PAREN_OPEN)){let args=parseArguments();if(sigil==="-"){return{type:"term",name,attr,args};}if(RE_FUNCTION_NAME.test(name)){return{type:"func",name,args};}throw new SyntaxError("Function names must be all upper-case");}if(sigil==="-"){return{type:"term",name,attr,args:[]};}return{type:"mesg",name,attr};}return parseLiteral();}function parseArguments(){let args=[];while(true){switch(source[cursor]){case")":cursor++;return args;case undefined:throw new SyntaxError("Unclosed argument list");}args.push(parseArgument());consumeToken(TOKEN_COMMA);}}function parseArgument(){let expr=parseInlineExpression();if(expr.type!=="mesg"){return expr;}if(consumeToken(TOKEN_COLON)){return{type:"narg",name:expr.name,value:parseLiteral()};}return expr;}function parseVariants(){let variants=[];let count=0;let star;while(test(RE_VARIANT_START)){if(consumeChar("*")){star=count;}let key=parseVariantKey();let value=parsePattern();if(value===null){throw new SyntaxError("Expected variant value");}variants[count++]={key,value};}if(count===0){return null;}if(star===undefined){throw new SyntaxError("Expected default variant");}return{variants,star};}function parseVariantKey(){consumeToken(TOKEN_BRACKET_OPEN,SyntaxError);let key;if(test(RE_NUMBER_LITERAL)){key=parseNumberLiteral();}else{key={type:"str",value:match1(RE_IDENTIFIER)};}consumeToken(TOKEN_BRACKET_CLOSE,SyntaxError);return key;}function parseLiteral(){if(test(RE_NUMBER_LITERAL)){return parseNumberLiteral();}if(source[cursor]==='"'){return parseStringLiteral();}throw new SyntaxError("Invalid expression");}function parseNumberLiteral(){let[,value,fraction=""]=match(RE_NUMBER_LITERAL);let precision=fraction.length;return{type:"num",value:parseFloat(value),precision};}function parseStringLiteral(){consumeChar('"',SyntaxError);let value="";while(true){value+=match1(RE_STRING_RUN);if(source[cursor]==="\\"){value+=parseEscapeSequence();continue;}if(consumeChar('"')){return{type:"str",value};}throw new SyntaxError("Unclosed string literal");}}function parseEscapeSequence(){if(test(RE_STRING_ESCAPE)){return match1(RE_STRING_ESCAPE);}if(test(RE_UNICODE_ESCAPE)){let[,codepoint4,codepoint6]=match(RE_UNICODE_ESCAPE);let codepoint=parseInt(codepoint4||codepoint6,16);return codepoint<=0xd7ff||0xe000<=codepoint?String.fromCodePoint(codepoint):"�";}throw new SyntaxError("Unknown escape sequence");}function parseIndent(){let start=cursor;consumeToken(TOKEN_BLANK);switch(source[cursor]){case".":case"[":case"*":case"}":case undefined:return false;case"{":return makeIndent(source.slice(start,cursor));}if(source[cursor-1]===" "){return makeIndent(source.slice(start,cursor));}return false;}function trim(text,re){return text.replace(re,"");}function makeIndent(blank){let value=blank.replace(RE_BLANK_LINES,"\n");let length=RE_INDENT.exec(blank)[1].length;return new Indent(value,length);}}}class Indent{constructor(value,length){this.value=value;this.length=length;}}
;// CONCATENATED MODULE: ./node_modules/@fluent/bundle/esm/index.js

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.map.js
var esnext_iterator_map = __webpack_require__(1454);
;// CONCATENATED MODULE: ./node_modules/@fluent/dom/esm/overlay.js
const reOverlay=/<|&#?\w+;/;const TEXT_LEVEL_ELEMENTS={"http://www.w3.org/1999/xhtml":["em","strong","small","s","cite","q","dfn","abbr","data","time","code","var","samp","kbd","sub","sup","i","b","u","mark","bdi","bdo","span","br","wbr"]};const LOCALIZABLE_ATTRIBUTES={"http://www.w3.org/1999/xhtml":{global:["title","aria-label","aria-valuetext"],a:["download"],area:["download","alt"],input:["alt","placeholder"],menuitem:["label"],menu:["label"],optgroup:["label"],option:["label"],track:["label"],img:["alt"],textarea:["placeholder"],th:["abbr"]},"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul":{global:["accesskey","aria-label","aria-valuetext","label","title","tooltiptext"],description:["value"],key:["key","keycode"],label:["value"],textbox:["placeholder","value"]}};function translateElement(element,translation){const{value}=translation;if(typeof value==="string"){if(element.localName==="title"&&element.namespaceURI==="http://www.w3.org/1999/xhtml"){element.textContent=value;}else if(!reOverlay.test(value)){element.textContent=value;}else{const templateElement=element.ownerDocument.createElementNS("http://www.w3.org/1999/xhtml","template");templateElement.innerHTML=value;overlayChildNodes(templateElement.content,element);}}overlayAttributes(translation,element);}function overlayChildNodes(fromFragment,toElement){for(const childNode of fromFragment.childNodes){if(childNode.nodeType===childNode.TEXT_NODE){continue;}if(childNode.hasAttribute("data-l10n-name")){const sanitized=getNodeForNamedElement(toElement,childNode);fromFragment.replaceChild(sanitized,childNode);continue;}if(isElementAllowed(childNode)){const sanitized=createSanitizedElement(childNode);fromFragment.replaceChild(sanitized,childNode);continue;}console.warn(`An element of forbidden type "${childNode.localName}" was found in `+"the translation. Only safe text-level elements and elements with "+"data-l10n-name are allowed.");fromFragment.replaceChild(createTextNodeFromTextContent(childNode),childNode);}toElement.textContent="";toElement.appendChild(fromFragment);}function hasAttribute(attributes,name){if(!attributes){return false;}for(let attr of attributes){if(attr.name===name){return true;}}return false;}function overlayAttributes(fromElement,toElement){const explicitlyAllowed=toElement.hasAttribute("data-l10n-attrs")?toElement.getAttribute("data-l10n-attrs").split(",").map(i=>i.trim()):null;for(const attr of Array.from(toElement.attributes)){if(isAttrNameLocalizable(attr.name,toElement,explicitlyAllowed)&&!hasAttribute(fromElement.attributes,attr.name)){toElement.removeAttribute(attr.name);}}if(!fromElement.attributes){return;}for(const attr of Array.from(fromElement.attributes)){if(isAttrNameLocalizable(attr.name,toElement,explicitlyAllowed)&&toElement.getAttribute(attr.name)!==attr.value){toElement.setAttribute(attr.name,attr.value);}}}function getNodeForNamedElement(sourceElement,translatedChild){const childName=translatedChild.getAttribute("data-l10n-name");const sourceChild=sourceElement.querySelector(`[data-l10n-name="${childName}"]`);if(!sourceChild){console.warn(`An element named "${childName}" wasn't found in the source.`);return createTextNodeFromTextContent(translatedChild);}if(sourceChild.localName!==translatedChild.localName){console.warn(`An element named "${childName}" was found in the translation `+`but its type ${translatedChild.localName} didn't match the `+`element found in the source (${sourceChild.localName}).`);return createTextNodeFromTextContent(translatedChild);}sourceElement.removeChild(sourceChild);const clone=sourceChild.cloneNode(false);return shallowPopulateUsing(translatedChild,clone);}function createSanitizedElement(element){const clone=element.ownerDocument.createElement(element.localName);return shallowPopulateUsing(element,clone);}function createTextNodeFromTextContent(element){return element.ownerDocument.createTextNode(element.textContent);}function isElementAllowed(element){const allowed=TEXT_LEVEL_ELEMENTS[element.namespaceURI];return allowed&&allowed.includes(element.localName);}function isAttrNameLocalizable(name,element){let explicitlyAllowed=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;if(explicitlyAllowed&&explicitlyAllowed.includes(name)){return true;}const allowed=LOCALIZABLE_ATTRIBUTES[element.namespaceURI];if(!allowed){return false;}const attrName=name.toLowerCase();const elemName=element.localName;if(allowed.global.includes(attrName)){return true;}if(!allowed[elemName]){return false;}if(allowed[elemName].includes(attrName)){return true;}if(element.namespaceURI==="http://www.w3.org/1999/xhtml"&&elemName==="input"&&attrName==="value"){const type=element.type.toLowerCase();if(type==="submit"||type==="button"||type==="reset"){return true;}}return false;}function shallowPopulateUsing(fromElement,toElement){toElement.textContent=fromElement.textContent;overlayAttributes(fromElement,toElement);return toElement;}
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.filter.js
var esnext_iterator_filter = __webpack_require__(4520);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.for-each.js
var esnext_iterator_for_each = __webpack_require__(3949);
;// CONCATENATED MODULE: ./node_modules/cached-iterable/src/cached_iterable.mjs
class CachedIterable extends Array{static from(iterable){if(iterable instanceof this){return iterable;}return new this(iterable);}}
;// CONCATENATED MODULE: ./node_modules/cached-iterable/src/cached_sync_iterable.mjs
class CachedSyncIterable extends CachedIterable{constructor(iterable){super();if(Symbol.iterator in Object(iterable)){this.iterator=iterable[Symbol.iterator]();}else{throw new TypeError("Argument must implement the iteration protocol.");}}[Symbol.iterator](){const cached=this;let cur=0;return{next(){if(cached.length<=cur){cached.push(cached.iterator.next());}return cached[cur++];}};}touchNext(){let count=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;let idx=0;while(idx++<count){const last=this[this.length-1];if(last&&last.done){break;}this.push(this.iterator.next());}return this[this.length-1];}}
;// CONCATENATED MODULE: ./node_modules/cached-iterable/src/cached_async_iterable.mjs
class CachedAsyncIterable extends CachedIterable{constructor(iterable){super();if(Symbol.asyncIterator in Object(iterable)){this.iterator=iterable[Symbol.asyncIterator]();}else if(Symbol.iterator in Object(iterable)){this.iterator=iterable[Symbol.iterator]();}else{throw new TypeError("Argument must implement the iteration protocol.");}}[Symbol.asyncIterator](){const cached=this;let cur=0;return{async next(){if(cached.length<=cur){cached.push(cached.iterator.next());}return cached[cur++];}};}async touchNext(){let count=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;let idx=0;while(idx++<count){const last=this[this.length-1];if(last&&(await last).done){break;}this.push(this.iterator.next());}return this[this.length-1];}}
;// CONCATENATED MODULE: ./node_modules/cached-iterable/src/index.mjs

;// CONCATENATED MODULE: ./node_modules/@fluent/dom/esm/localization.js
class Localization{constructor(){let resourceIds=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];let generateBundles=arguments.length>1?arguments[1]:undefined;this.resourceIds=resourceIds;this.generateBundles=generateBundles;this.onChange(true);}addResourceIds(resourceIds){let eager=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;this.resourceIds.push(...resourceIds);this.onChange(eager);return this.resourceIds.length;}removeResourceIds(resourceIds){this.resourceIds=this.resourceIds.filter(r=>!resourceIds.includes(r));this.onChange();return this.resourceIds.length;}async formatWithFallback(keys,method){const translations=[];let hasAtLeastOneBundle=false;for await(const bundle of this.bundles){hasAtLeastOneBundle=true;const missingIds=keysFromBundle(method,bundle,keys,translations);if(missingIds.size===0){break;}if(typeof console!=="undefined"){const locale=bundle.locales[0];const ids=Array.from(missingIds).join(", ");console.warn(`[fluent] Missing translations in ${locale}: ${ids}`);}}if(!hasAtLeastOneBundle&&typeof console!=="undefined"){console.warn(`[fluent] Request for keys failed because no resource bundles got generated.
  keys: ${JSON.stringify(keys)}.
  resourceIds: ${JSON.stringify(this.resourceIds)}.`);}return translations;}formatMessages(keys){return this.formatWithFallback(keys,messageFromBundle);}formatValues(keys){return this.formatWithFallback(keys,valueFromBundle);}async formatValue(id,args){const[val]=await this.formatValues([{id,args}]);return val;}handleEvent(){this.onChange();}onChange(){let eager=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;this.bundles=CachedAsyncIterable.from(this.generateBundles(this.resourceIds));if(eager){this.bundles.touchNext(2);}}}function valueFromBundle(bundle,errors,message,args){if(message.value){return bundle.formatPattern(message.value,args,errors);}return null;}function messageFromBundle(bundle,errors,message,args){const formatted={value:null,attributes:null};if(message.value){formatted.value=bundle.formatPattern(message.value,args,errors);}let attrNames=Object.keys(message.attributes);if(attrNames.length>0){formatted.attributes=new Array(attrNames.length);for(let[i,name]of attrNames.entries()){let value=bundle.formatPattern(message.attributes[name],args,errors);formatted.attributes[i]={name,value};}}return formatted;}function keysFromBundle(method,bundle,keys,translations){const messageErrors=[];const missingIds=new Set();keys.forEach((_ref,i)=>{let{id,args}=_ref;if(translations[i]!==undefined){return;}let message=bundle.getMessage(id);if(message){messageErrors.length=0;translations[i]=method(bundle,messageErrors,message,args);if(messageErrors.length>0&&typeof console!=="undefined"){const locale=bundle.locales[0];const errors=messageErrors.join(", ");console.warn(`[fluent][resolver] errors in ${locale}/${id}: ${errors}.`);}}else{missingIds.add(id);}});return missingIds;}
;// CONCATENATED MODULE: ./node_modules/@fluent/dom/esm/dom_localization.js
const L10NID_ATTR_NAME="data-l10n-id";const L10NARGS_ATTR_NAME="data-l10n-args";const L10N_ELEMENT_QUERY=`[${L10NID_ATTR_NAME}]`;class DOMLocalization extends Localization{constructor(resourceIds,generateBundles){super(resourceIds,generateBundles);this.roots=new Set();this.pendingrAF=null;this.pendingElements=new Set();this.windowElement=null;this.mutationObserver=null;this.observerConfig={attributes:true,characterData:false,childList:true,subtree:true,attributeFilter:[L10NID_ATTR_NAME,L10NARGS_ATTR_NAME]};}onChange(){let eager=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;super.onChange(eager);if(this.roots){this.translateRoots();}}setAttributes(element,id,args){element.setAttribute(L10NID_ATTR_NAME,id);if(args){element.setAttribute(L10NARGS_ATTR_NAME,JSON.stringify(args));}else{element.removeAttribute(L10NARGS_ATTR_NAME);}return element;}getAttributes(element){return{id:element.getAttribute(L10NID_ATTR_NAME),args:JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME)||null)};}connectRoot(newRoot){for(const root of this.roots){if(root===newRoot||root.contains(newRoot)||newRoot.contains(root)){throw new Error("Cannot add a root that overlaps with existing root.");}}if(this.windowElement){if(this.windowElement!==newRoot.ownerDocument.defaultView){throw new Error(`Cannot connect a root:
          DOMLocalization already has a root from a different window.`);}}else{this.windowElement=newRoot.ownerDocument.defaultView;this.mutationObserver=new this.windowElement.MutationObserver(mutations=>this.translateMutations(mutations));}this.roots.add(newRoot);this.mutationObserver.observe(newRoot,this.observerConfig);}disconnectRoot(root){this.roots.delete(root);this.pauseObserving();if(this.roots.size===0){this.mutationObserver=null;this.windowElement=null;this.pendingrAF=null;this.pendingElements.clear();return true;}this.resumeObserving();return false;}translateRoots(){const roots=Array.from(this.roots);return Promise.all(roots.map(root=>this.translateFragment(root)));}pauseObserving(){if(!this.mutationObserver){return;}this.translateMutations(this.mutationObserver.takeRecords());this.mutationObserver.disconnect();}resumeObserving(){if(!this.mutationObserver){return;}for(const root of this.roots){this.mutationObserver.observe(root,this.observerConfig);}}translateMutations(mutations){for(const mutation of mutations){switch(mutation.type){case"attributes":if(mutation.target.hasAttribute("data-l10n-id")){this.pendingElements.add(mutation.target);}break;case"childList":for(const addedNode of mutation.addedNodes){if(addedNode.nodeType===addedNode.ELEMENT_NODE){if(addedNode.childElementCount){for(const element of this.getTranslatables(addedNode)){this.pendingElements.add(element);}}else if(addedNode.hasAttribute(L10NID_ATTR_NAME)){this.pendingElements.add(addedNode);}}}break;}}if(this.pendingElements.size>0){if(this.pendingrAF===null){this.pendingrAF=this.windowElement.requestAnimationFrame(()=>{this.translateElements(Array.from(this.pendingElements));this.pendingElements.clear();this.pendingrAF=null;});}}}translateFragment(frag){return this.translateElements(this.getTranslatables(frag));}async translateElements(elements){if(!elements.length){return undefined;}const keys=elements.map(this.getKeysForElement);const translations=await this.formatMessages(keys);return this.applyTranslations(elements,translations);}applyTranslations(elements,translations){this.pauseObserving();for(let i=0;i<elements.length;i++){if(translations[i]!==undefined){translateElement(elements[i],translations[i]);}}this.resumeObserving();}getTranslatables(element){const nodes=Array.from(element.querySelectorAll(L10N_ELEMENT_QUERY));if(typeof element.hasAttribute==="function"&&element.hasAttribute(L10NID_ATTR_NAME)){nodes.push(element);}return nodes;}getKeysForElement(element){return{id:element.getAttribute(L10NID_ATTR_NAME),args:JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME)||null)};}}
;// CONCATENATED MODULE: ./node_modules/@fluent/dom/esm/index.js

;// CONCATENATED MODULE: ./web/l10n.js
function l10n_classPrivateFieldInitSpec(e,t,a){l10n_checkPrivateRedeclaration(e,t),t.set(e,a);}function l10n_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function l10n_classPrivateFieldGet(s,a){return s.get(l10n_assertClassBrand(s,a));}function l10n_classPrivateFieldSet(s,a,r){return s.set(l10n_assertClassBrand(s,a),r),r;}function l10n_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _dir=/*#__PURE__*/new WeakMap();var _lang=/*#__PURE__*/new WeakMap();var _l10n=/*#__PURE__*/new WeakMap();class L10n{constructor(_ref){let{lang,isRTL}=_ref;let l10n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;l10n_classPrivateFieldInitSpec(this,_dir,void 0);l10n_classPrivateFieldInitSpec(this,_lang,void 0);l10n_classPrivateFieldInitSpec(this,_l10n,void 0);l10n_classPrivateFieldSet(_lang,this,_fixupLangCode.call(L10n,lang));l10n_classPrivateFieldSet(_l10n,this,l10n);l10n_classPrivateFieldSet(_dir,this,isRTL??_isRTL.call(L10n,l10n_classPrivateFieldGet(_lang,this))?"rtl":"ltr");}_setL10n(l10n){l10n_classPrivateFieldSet(_l10n,this,l10n);}getLanguage(){return l10n_classPrivateFieldGet(_lang,this);}getDirection(){return l10n_classPrivateFieldGet(_dir,this);}async get(ids){let args=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let fallback=arguments.length>2?arguments[2]:undefined;if(Array.isArray(ids)){ids=ids.map(id=>({id}));const messages=await l10n_classPrivateFieldGet(_l10n,this).formatMessages(ids);return messages.map(message=>message.value);}const messages=await l10n_classPrivateFieldGet(_l10n,this).formatMessages([{id:ids,args}]);return messages?.[0].value||fallback;}async translate(element){try{l10n_classPrivateFieldGet(_l10n,this).connectRoot(element);await l10n_classPrivateFieldGet(_l10n,this).translateRoots();}catch{}}pause(){l10n_classPrivateFieldGet(_l10n,this).pauseObserving();}resume(){l10n_classPrivateFieldGet(_l10n,this).resumeObserving();}}function _fixupLangCode(langCode){langCode=langCode?.toLowerCase()||"en-us";const PARTIAL_LANG_CODES={en:"en-us",es:"es-es",fy:"fy-nl",ga:"ga-ie",gu:"gu-in",hi:"hi-in",hy:"hy-am",nb:"nb-no",ne:"ne-np",nn:"nn-no",pa:"pa-in",pt:"pt-pt",sv:"sv-se",zh:"zh-cn"};return PARTIAL_LANG_CODES[langCode]||langCode;}function _isRTL(lang){const shortCode=lang.split("-",1)[0];return["ar","he","fa","ps","ur"].includes(shortCode);}const GenericL10n=null;
;// CONCATENATED MODULE: ./web/genericl10n.js
var _GenericL10n;function genericl10n_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}function createBundle(lang,text){const resource=new FluentResource(text);const bundle=new FluentBundle(lang);const errors=bundle.addResource(resource);if(errors.length){console.error("L10n errors",errors);}return bundle;}class genericl10n_GenericL10n extends L10n{constructor(lang){super({lang});const generateBundles=!lang?_generateBundlesFallback.bind(genericl10n_GenericL10n,this.getLanguage()):_generateBundles.bind(genericl10n_GenericL10n,"en-us",this.getLanguage());this._setL10n(new DOMLocalization([],generateBundles));}}_GenericL10n=genericl10n_GenericL10n;async function*_generateBundles(defaultLang,baseLang){const{baseURL,paths}=await genericl10n_assertClassBrand(_GenericL10n,this,_getPaths).call(this);const langs=[baseLang];if(defaultLang!==baseLang){const shortLang=baseLang.split("-",1)[0];if(shortLang!==baseLang){langs.push(shortLang);}langs.push(defaultLang);}for(const lang of langs){const bundle=await genericl10n_assertClassBrand(_GenericL10n,this,_createBundle).call(this,lang,baseURL,paths);if(bundle){yield bundle;}if(lang==="en-us"){yield genericl10n_assertClassBrand(_GenericL10n,this,_createBundleFallback).call(this,lang);}}}async function _createBundle(lang,baseURL,paths){const path=paths[lang];if(!path){return null;}const url=new URL(path,baseURL);const text=await fetchData(url,"text");return createBundle(lang,text);}async function _getPaths(){try{const{href}=document.querySelector(`link[type="application/l10n"]`);const paths=await fetchData(href,"json");return{baseURL:href.replace(/[^/]*$/,"")||"./",paths};}catch{}return{baseURL:"./",paths:Object.create(null)};}async function*_generateBundlesFallback(lang){yield genericl10n_assertClassBrand(_GenericL10n,this,_createBundleFallback).call(this,lang);}async function _createBundleFallback(lang){const text="pdfjs-previous-button =\n    .title = Previous Page\npdfjs-previous-button-label = Previous\npdfjs-next-button =\n    .title = Next Page\npdfjs-next-button-label = Next\npdfjs-page-input =\n    .title = Page\npdfjs-of-pages = of { $pagesCount }\npdfjs-page-of-pages = ({ $pageNumber } of { $pagesCount })\npdfjs-zoom-out-button =\n    .title = Zoom Out\npdfjs-zoom-out-button-label = Zoom Out\npdfjs-zoom-in-button =\n    .title = Zoom In\npdfjs-zoom-in-button-label = Zoom In\npdfjs-zoom-select =\n    .title = Zoom\npdfjs-presentation-mode-button =\n    .title = Switch to Presentation Mode\npdfjs-presentation-mode-button-label = Presentation Mode\npdfjs-open-file-button =\n    .title = Open File\npdfjs-open-file-button-label = Open\npdfjs-print-button =\n    .title = Print\npdfjs-print-button-label = Print\npdfjs-save-button =\n    .title = Save\npdfjs-save-button-label = Save\npdfjs-download-button =\n    .title = Download\npdfjs-download-button-label = Download\npdfjs-bookmark-button =\n    .title = Current Page (View URL from Current Page)\npdfjs-bookmark-button-label = Current Page\npdfjs-tools-button =\n    .title = Tools\npdfjs-tools-button-label = Tools\npdfjs-first-page-button =\n    .title = Go to First Page\npdfjs-first-page-button-label = Go to First Page\npdfjs-last-page-button =\n    .title = Go to Last Page\npdfjs-last-page-button-label = Go to Last Page\npdfjs-page-rotate-cw-button =\n    .title = Rotate Clockwise\npdfjs-page-rotate-cw-button-label = Rotate Clockwise\npdfjs-page-rotate-ccw-button =\n    .title = Rotate Counterclockwise\npdfjs-page-rotate-ccw-button-label = Rotate Counterclockwise\npdfjs-cursor-text-select-tool-button =\n    .title = Enable Text Selection Tool\npdfjs-cursor-text-select-tool-button-label = Text Selection Tool\npdfjs-cursor-hand-tool-button =\n    .title = Enable Hand Tool\npdfjs-cursor-hand-tool-button-label = Hand Tool\npdfjs-scroll-page-button =\n    .title = Use Page Scrolling\npdfjs-scroll-page-button-label = Page Scrolling\npdfjs-scroll-vertical-button =\n    .title = Use Vertical Scrolling\npdfjs-scroll-vertical-button-label = Vertical Scrolling\npdfjs-scroll-horizontal-button =\n    .title = Use Horizontal Scrolling\npdfjs-scroll-horizontal-button-label = Horizontal Scrolling\npdfjs-scroll-wrapped-button =\n    .title = Use Wrapped Scrolling\npdfjs-scroll-wrapped-button-label = Wrapped Scrolling\npdfjs-spread-none-button =\n    .title = Do not join page spreads\npdfjs-spread-none-button-label = No Spreads\npdfjs-spread-odd-button =\n    .title = Join page spreads starting with odd-numbered pages\npdfjs-spread-odd-button-label = Odd Spreads\npdfjs-spread-even-button =\n    .title = Join page spreads starting with even-numbered pages\npdfjs-spread-even-button-label = Even Spreads\npdfjs-document-properties-button =\n    .title = Document Properties\u2026\npdfjs-document-properties-button-label = Document Properties\u2026\npdfjs-document-properties-file-name = File name:\npdfjs-document-properties-file-size = File size:\npdfjs-document-properties-kb = { $size_kb } KB ({ $size_b } bytes)\npdfjs-document-properties-mb = { $size_mb } MB ({ $size_b } bytes)\npdfjs-document-properties-title = Title:\npdfjs-document-properties-author = Author:\npdfjs-document-properties-subject = Subject:\npdfjs-document-properties-keywords = Keywords:\npdfjs-document-properties-creation-date = Creation Date:\npdfjs-document-properties-modification-date = Modification Date:\npdfjs-document-properties-date-string = { $date }, { $time }\npdfjs-document-properties-creator = Creator:\npdfjs-document-properties-producer = PDF Producer:\npdfjs-document-properties-version = PDF Version:\npdfjs-document-properties-page-count = Page Count:\npdfjs-document-properties-page-size = Page Size:\npdfjs-document-properties-page-size-unit-inches = in\npdfjs-document-properties-page-size-unit-millimeters = mm\npdfjs-document-properties-page-size-orientation-portrait = portrait\npdfjs-document-properties-page-size-orientation-landscape = landscape\npdfjs-document-properties-page-size-name-a-three = A3\npdfjs-document-properties-page-size-name-a-four = A4\npdfjs-document-properties-page-size-name-letter = Letter\npdfjs-document-properties-page-size-name-legal = Legal\npdfjs-document-properties-page-size-dimension-string = { $width } \xD7 { $height } { $unit } ({ $orientation })\npdfjs-document-properties-page-size-dimension-name-string = { $width } \xD7 { $height } { $unit } ({ $name }, { $orientation })\npdfjs-document-properties-linearized = Fast Web View:\npdfjs-document-properties-linearized-yes = Yes\npdfjs-document-properties-linearized-no = No\npdfjs-document-properties-close-button = Close\npdfjs-print-progress-message = Preparing document for printing\u2026\npdfjs-print-progress-percent = { $progress }%\npdfjs-print-progress-close-button = Cancel\npdfjs-printing-not-supported = Warning: Printing is not fully supported by this browser.\npdfjs-printing-not-ready = Warning: The PDF is not fully loaded for printing.\npdfjs-toggle-sidebar-button =\n    .title = Toggle Sidebar\npdfjs-toggle-sidebar-notification-button =\n    .title = Toggle Sidebar (document contains outline/attachments/layers)\npdfjs-toggle-sidebar-button-label = Toggle Sidebar\npdfjs-document-outline-button =\n    .title = Show Document Outline (double-click to expand/collapse all items)\npdfjs-document-outline-button-label = Document Outline\npdfjs-attachments-button =\n    .title = Show Attachments\npdfjs-attachments-button-label = Attachments\npdfjs-layers-button =\n    .title = Show Layers (double-click to reset all layers to the default state)\npdfjs-layers-button-label = Layers\npdfjs-thumbs-button =\n    .title = Show Thumbnails\npdfjs-thumbs-button-label = Thumbnails\npdfjs-current-outline-item-button =\n    .title = Find Current Outline Item\npdfjs-current-outline-item-button-label = Current Outline Item\npdfjs-findbar-button =\n    .title = Find in Document\npdfjs-findbar-button-label = Find\npdfjs-additional-layers = Additional Layers\npdfjs-thumb-page-title =\n    .title = Page { $page }\npdfjs-thumb-page-canvas =\n    .aria-label = Thumbnail of Page { $page }\npdfjs-find-input =\n    .title = Find\n    .placeholder = Find in document\u2026\npdfjs-find-previous-button =\n    .title = Find the previous occurrence of the phrase\npdfjs-find-previous-button-label = Previous\npdfjs-find-next-button =\n    .title = Find the next occurrence of the phrase\npdfjs-find-next-button-label = Next\npdfjs-find-highlight-checkbox = Highlight All\npdfjs-find-match-case-checkbox-label = Match Case\npdfjs-find-match-diacritics-checkbox-label = Match Diacritics\npdfjs-find-entire-word-checkbox-label = Whole Words\npdfjs-find-reached-top = Reached top of document, continued from bottom\npdfjs-find-reached-bottom = Reached end of document, continued from top\npdfjs-find-match-count =\n    { $total ->\n        [one] { $current } of { $total } match\n       *[other] { $current } of { $total } matches\n    }\npdfjs-find-match-count-limit =\n    { $limit ->\n        [one] More than { $limit } match\n       *[other] More than { $limit } matches\n    }\npdfjs-find-not-found = Phrase not found\npdfjs-page-scale-width = Page Width\npdfjs-page-scale-fit = Page Fit\npdfjs-page-scale-auto = Automatic Zoom\npdfjs-page-scale-actual = Actual Size\npdfjs-page-scale-percent = { $scale }%\npdfjs-page-landmark =\n    .aria-label = Page { $page }\npdfjs-loading-error = An error occurred while loading the PDF.\npdfjs-invalid-file-error = Invalid or corrupted PDF file.\npdfjs-missing-file-error = Missing PDF file.\npdfjs-unexpected-response-error = Unexpected server response.\npdfjs-rendering-error = An error occurred while rendering the page.\npdfjs-annotation-date-string = { $date }, { $time }\npdfjs-text-annotation-type =\n    .alt = [{ $type } Annotation]\npdfjs-password-label = Enter the password to open this PDF file.\npdfjs-password-invalid = Invalid password. Please try again.\npdfjs-password-ok-button = OK\npdfjs-password-cancel-button = Cancel\npdfjs-web-fonts-disabled = Web fonts are disabled: unable to use embedded PDF fonts.\npdfjs-editor-free-text-button =\n    .title = Text\npdfjs-editor-free-text-button-label = Text\npdfjs-editor-ink-button =\n    .title = Draw\npdfjs-editor-ink-button-label = Draw\npdfjs-editor-stamp-button =\n    .title = Add or edit images\npdfjs-editor-stamp-button-label = Add or edit images\npdfjs-editor-highlight-button =\n    .title = Highlight\npdfjs-editor-highlight-button-label = Highlight\npdfjs-highlight-floating-button1 =\n    .title = Highlight\n    .aria-label = Highlight\npdfjs-highlight-floating-button-label = Highlight\npdfjs-editor-remove-ink-button =\n    .title = Remove drawing\npdfjs-editor-remove-freetext-button =\n    .title = Remove text\npdfjs-editor-remove-stamp-button =\n    .title = Remove image\npdfjs-editor-remove-highlight-button =\n    .title = Remove highlight\npdfjs-editor-free-text-color-input = Color\npdfjs-editor-free-text-size-input = Size\npdfjs-editor-ink-color-input = Color\npdfjs-editor-ink-thickness-input = Thickness\npdfjs-editor-ink-opacity-input = Opacity\npdfjs-editor-stamp-add-image-button =\n    .title = Add image\npdfjs-editor-stamp-add-image-button-label = Add image\npdfjs-editor-free-highlight-thickness-input = Thickness\npdfjs-editor-free-highlight-thickness-title =\n    .title = Change thickness when highlighting items other than text\npdfjs-free-text =\n    .aria-label = Text Editor\npdfjs-free-text-default-content = Start typing\u2026\npdfjs-ink =\n    .aria-label = Draw Editor\npdfjs-ink-canvas =\n    .aria-label = User-created image\npdfjs-editor-alt-text-button-label = Alt text\npdfjs-editor-alt-text-edit-button-label = Edit alt text\npdfjs-editor-alt-text-dialog-label = Choose an option\npdfjs-editor-alt-text-dialog-description = Alt text (alternative text) helps when people can\u2019t see the image or when it doesn\u2019t load.\npdfjs-editor-alt-text-add-description-label = Add a description\npdfjs-editor-alt-text-add-description-description = Aim for 1-2 sentences that describe the subject, setting, or actions.\npdfjs-editor-alt-text-mark-decorative-label = Mark as decorative\npdfjs-editor-alt-text-mark-decorative-description = This is used for ornamental images, like borders or watermarks.\npdfjs-editor-alt-text-cancel-button = Cancel\npdfjs-editor-alt-text-save-button = Save\npdfjs-editor-alt-text-decorative-tooltip = Marked as decorative\npdfjs-editor-alt-text-textarea =\n    .placeholder = For example, \u201CA young man sits down at a table to eat a meal\u201D\npdfjs-editor-resizer-label-top-left = Top left corner \u2014 resize\npdfjs-editor-resizer-label-top-middle = Top middle \u2014 resize\npdfjs-editor-resizer-label-top-right = Top right corner \u2014 resize\npdfjs-editor-resizer-label-middle-right = Middle right \u2014 resize\npdfjs-editor-resizer-label-bottom-right = Bottom right corner \u2014 resize\npdfjs-editor-resizer-label-bottom-middle = Bottom middle \u2014 resize\npdfjs-editor-resizer-label-bottom-left = Bottom left corner \u2014 resize\npdfjs-editor-resizer-label-middle-left = Middle left \u2014 resize\npdfjs-editor-highlight-colorpicker-label = Highlight color\npdfjs-editor-colorpicker-button =\n    .title = Change color\npdfjs-editor-colorpicker-dropdown =\n    .aria-label = Color choices\npdfjs-editor-colorpicker-yellow =\n    .title = Yellow\npdfjs-editor-colorpicker-green =\n    .title = Green\npdfjs-editor-colorpicker-blue =\n    .title = Blue\npdfjs-editor-colorpicker-pink =\n    .title = Pink\npdfjs-editor-colorpicker-red =\n    .title = Red\npdfjs-editor-highlight-show-all-button-label = Show all\npdfjs-editor-highlight-show-all-button =\n    .title = Show all";return createBundle(lang,text);}
;// CONCATENATED MODULE: ./web/generic_scripting.js
async function docProperties(pdfDocument){const url="",baseUrl=url.split("#",1)[0];let{info,metadata,contentDispositionFilename,contentLength}=await pdfDocument.getMetadata();if(!contentLength){const{length}=await pdfDocument.getDownloadInfo();contentLength=length;}return{...info,baseURL:baseUrl,filesize:contentLength,filename:contentDispositionFilename||getPdfFilenameFromUrl(url),metadata:metadata?.getRaw(),authors:metadata?.get("dc:creator"),numPages:pdfDocument.numPages,URL:url};}class GenericScripting{constructor(sandboxBundleSrc){if(sandboxBundleSrc?.constructor?.name==="Function"){sandboxBundleSrc=sandboxBundleSrc();}this._ready=new Promise((resolve,reject)=>{const sandbox=import(/*webpackIgnore: true*/sandboxBundleSrc);sandbox.then(pdfjsSandbox=>{resolve(pdfjsSandbox.QuickJSSandbox());}).catch(reject);});}async createSandbox(data){const sandbox=await this._ready;sandbox.create(data);}async dispatchEventInSandbox(event){const sandbox=await this._ready;setTimeout(()=>sandbox.dispatchEvent(event),0);}async destroySandbox(){const sandbox=await this._ready;sandbox.nukeSandbox();}}
;// CONCATENATED MODULE: ./web/genericcom.js
function initCom(app){}class Preferences extends BasePreferences{async _writeToStorage(prefObj){try{localStorage.setItem("pdfjs.preferences",JSON.stringify(prefObj));}catch(safariSecurityException){}}async _readFromStorage(prefObj){try{return{prefs:JSON.parse(localStorage.getItem("pdfjs.preferences"))};}catch(safariSecurityException){return{};}}}class ExternalServices extends BaseExternalServices{async createL10n(){return new genericl10n_GenericL10n(AppOptions.get("locale"));}createScripting(){return new GenericScripting(AppOptions.get("sandboxBundleSrc"));}}class MLManager{async guess(){return null;}}
;// CONCATENATED MODULE: ./web/alt_text_manager.js
function alt_text_manager_classPrivateMethodInitSpec(e,a){alt_text_manager_checkPrivateRedeclaration(e,a),a.add(e);}function alt_text_manager_classPrivateFieldInitSpec(e,t,a){alt_text_manager_checkPrivateRedeclaration(e,t),t.set(e,a);}function alt_text_manager_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function alt_text_manager_classPrivateFieldGet(s,a){return s.get(alt_text_manager_assertClassBrand(s,a));}function alt_text_manager_classPrivateFieldSet(s,a,r){return s.set(alt_text_manager_assertClassBrand(s,a),r),r;}function alt_text_manager_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _boundUpdateUIState=/*#__PURE__*/new WeakMap();var _boundSetPosition=/*#__PURE__*/new WeakMap();var _boundOnClick=/*#__PURE__*/new WeakMap();var _currentEditor=/*#__PURE__*/new WeakMap();var _cancelButton=/*#__PURE__*/new WeakMap();var _dialog=/*#__PURE__*/new WeakMap();var _eventBus=/*#__PURE__*/new WeakMap();var _hasUsedPointer=/*#__PURE__*/new WeakMap();var _optionDescription=/*#__PURE__*/new WeakMap();var _optionDecorative=/*#__PURE__*/new WeakMap();var _overlayManager=/*#__PURE__*/new WeakMap();var _saveButton=/*#__PURE__*/new WeakMap();var _textarea=/*#__PURE__*/new WeakMap();var _uiManager=/*#__PURE__*/new WeakMap();var _previousAltText=/*#__PURE__*/new WeakMap();var _svgElement=/*#__PURE__*/new WeakMap();var _rectElement=/*#__PURE__*/new WeakMap();var _container=/*#__PURE__*/new WeakMap();var _telemetryData=/*#__PURE__*/new WeakMap();var _AltTextManager_brand=/*#__PURE__*/new WeakSet();class AltTextManager{constructor(_ref,container,overlayManager,eventBus){let{dialog:_dialog2,optionDescription,optionDecorative,textarea,cancelButton,saveButton}=_ref;alt_text_manager_classPrivateMethodInitSpec(this,_AltTextManager_brand);alt_text_manager_classPrivateFieldInitSpec(this,_boundUpdateUIState,alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_updateUIState).bind(this));alt_text_manager_classPrivateFieldInitSpec(this,_boundSetPosition,alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_setPosition).bind(this));alt_text_manager_classPrivateFieldInitSpec(this,_boundOnClick,alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_onClick).bind(this));alt_text_manager_classPrivateFieldInitSpec(this,_currentEditor,null);alt_text_manager_classPrivateFieldInitSpec(this,_cancelButton,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_dialog,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_eventBus,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_hasUsedPointer,false);alt_text_manager_classPrivateFieldInitSpec(this,_optionDescription,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_optionDecorative,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_overlayManager,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_saveButton,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_textarea,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_uiManager,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_previousAltText,null);alt_text_manager_classPrivateFieldInitSpec(this,_svgElement,null);alt_text_manager_classPrivateFieldInitSpec(this,_rectElement,null);alt_text_manager_classPrivateFieldInitSpec(this,_container,void 0);alt_text_manager_classPrivateFieldInitSpec(this,_telemetryData,null);alt_text_manager_classPrivateFieldSet(_dialog,this,_dialog2);alt_text_manager_classPrivateFieldSet(_optionDescription,this,optionDescription);alt_text_manager_classPrivateFieldSet(_optionDecorative,this,optionDecorative);alt_text_manager_classPrivateFieldSet(_textarea,this,textarea);alt_text_manager_classPrivateFieldSet(_cancelButton,this,cancelButton);alt_text_manager_classPrivateFieldSet(_saveButton,this,saveButton);alt_text_manager_classPrivateFieldSet(_overlayManager,this,overlayManager);alt_text_manager_classPrivateFieldSet(_eventBus,this,eventBus);alt_text_manager_classPrivateFieldSet(_container,this,container);_dialog2.addEventListener("close",alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_close).bind(this));_dialog2.addEventListener("contextmenu",event=>{if(event.target!==alt_text_manager_classPrivateFieldGet(_textarea,this)){event.preventDefault();}});cancelButton.addEventListener("click",alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_finish).bind(this));saveButton.addEventListener("click",alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_save).bind(this));optionDescription.addEventListener("change",alt_text_manager_classPrivateFieldGet(_boundUpdateUIState,this));optionDecorative.addEventListener("change",alt_text_manager_classPrivateFieldGet(_boundUpdateUIState,this));alt_text_manager_classPrivateFieldGet(_overlayManager,this).register(_dialog2);}get _elements(){return shadow(this,"_elements",[alt_text_manager_classPrivateFieldGet(_optionDescription,this),alt_text_manager_classPrivateFieldGet(_optionDecorative,this),alt_text_manager_classPrivateFieldGet(_textarea,this),alt_text_manager_classPrivateFieldGet(_saveButton,this),alt_text_manager_classPrivateFieldGet(_cancelButton,this)]);}async editAltText(uiManager,editor){if(alt_text_manager_classPrivateFieldGet(_currentEditor,this)||!editor){return;}alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_createSVGElement).call(this);alt_text_manager_classPrivateFieldSet(_hasUsedPointer,this,false);for(const element of this._elements){element.addEventListener("click",alt_text_manager_classPrivateFieldGet(_boundOnClick,this));}const{altText,decorative}=editor.altTextData;if(decorative===true){alt_text_manager_classPrivateFieldGet(_optionDecorative,this).checked=true;alt_text_manager_classPrivateFieldGet(_optionDescription,this).checked=false;}else{alt_text_manager_classPrivateFieldGet(_optionDecorative,this).checked=false;alt_text_manager_classPrivateFieldGet(_optionDescription,this).checked=true;}alt_text_manager_classPrivateFieldSet(_previousAltText,this,alt_text_manager_classPrivateFieldGet(_textarea,this).value=altText?.trim()||"");alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_updateUIState).call(this);alt_text_manager_classPrivateFieldSet(_currentEditor,this,editor);alt_text_manager_classPrivateFieldSet(_uiManager,this,uiManager);alt_text_manager_classPrivateFieldGet(_uiManager,this).removeEditListeners();alt_text_manager_classPrivateFieldGet(_eventBus,this)._on("resize",alt_text_manager_classPrivateFieldGet(_boundSetPosition,this));try{await alt_text_manager_classPrivateFieldGet(_overlayManager,this).open(alt_text_manager_classPrivateFieldGet(_dialog,this));alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_setPosition).call(this);}catch(ex){alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_close).call(this);throw ex;}}destroy(){alt_text_manager_classPrivateFieldSet(_uiManager,this,null);alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_finish).call(this);alt_text_manager_classPrivateFieldGet(_svgElement,this)?.remove();alt_text_manager_classPrivateFieldSet(_svgElement,this,alt_text_manager_classPrivateFieldSet(_rectElement,this,null));}}function _createSVGElement(){if(alt_text_manager_classPrivateFieldGet(_svgElement,this)){return;}const svgFactory=new DOMSVGFactory();const svg=alt_text_manager_classPrivateFieldSet(_svgElement,this,svgFactory.createElement("svg"));svg.setAttribute("width","0");svg.setAttribute("height","0");const defs=svgFactory.createElement("defs");svg.append(defs);const mask=svgFactory.createElement("mask");defs.append(mask);mask.setAttribute("id","alttext-manager-mask");mask.setAttribute("maskContentUnits","objectBoundingBox");let rect=svgFactory.createElement("rect");mask.append(rect);rect.setAttribute("fill","white");rect.setAttribute("width","1");rect.setAttribute("height","1");rect.setAttribute("x","0");rect.setAttribute("y","0");rect=alt_text_manager_classPrivateFieldSet(_rectElement,this,svgFactory.createElement("rect"));mask.append(rect);rect.setAttribute("fill","black");alt_text_manager_classPrivateFieldGet(_dialog,this).append(svg);}function _setPosition(){if(!alt_text_manager_classPrivateFieldGet(_currentEditor,this)){return;}const dialog=alt_text_manager_classPrivateFieldGet(_dialog,this);const{style}=dialog;const{x:containerX,y:containerY,width:containerW,height:containerH}=alt_text_manager_classPrivateFieldGet(_container,this).getBoundingClientRect();const{innerWidth:windowW,innerHeight:windowH}=window;const{width:dialogW,height:dialogH}=dialog.getBoundingClientRect();const{x,y,width,height}=alt_text_manager_classPrivateFieldGet(_currentEditor,this).getClientDimensions();const MARGIN=10;const isLTR=alt_text_manager_classPrivateFieldGet(_uiManager,this).direction==="ltr";const xs=Math.max(x,containerX);const xe=Math.min(x+width,containerX+containerW);const ys=Math.max(y,containerY);const ye=Math.min(y+height,containerY+containerH);alt_text_manager_classPrivateFieldGet(_rectElement,this).setAttribute("width",`${(xe-xs)/windowW}`);alt_text_manager_classPrivateFieldGet(_rectElement,this).setAttribute("height",`${(ye-ys)/windowH}`);alt_text_manager_classPrivateFieldGet(_rectElement,this).setAttribute("x",`${xs/windowW}`);alt_text_manager_classPrivateFieldGet(_rectElement,this).setAttribute("y",`${ys/windowH}`);let left=null;let top=Math.max(y,0);top+=Math.min(windowH-(top+dialogH),0);if(isLTR){if(x+width+MARGIN+dialogW<windowW){left=x+width+MARGIN;}else if(x>dialogW+MARGIN){left=x-dialogW-MARGIN;}}else if(x>dialogW+MARGIN){left=x-dialogW-MARGIN;}else if(x+width+MARGIN+dialogW<windowW){left=x+width+MARGIN;}if(left===null){top=null;left=Math.max(x,0);left+=Math.min(windowW-(left+dialogW),0);if(y>dialogH+MARGIN){top=y-dialogH-MARGIN;}else if(y+height+MARGIN+dialogH<windowH){top=y+height+MARGIN;}}if(top!==null){dialog.classList.add("positioned");if(isLTR){style.left=`${left}px`;}else{style.right=`${windowW-left-dialogW}px`;}style.top=`${top}px`;}else{dialog.classList.remove("positioned");style.left="";style.top="";}}function _finish(){if(alt_text_manager_classPrivateFieldGet(_overlayManager,this).active===alt_text_manager_classPrivateFieldGet(_dialog,this)){alt_text_manager_classPrivateFieldGet(_overlayManager,this).close(alt_text_manager_classPrivateFieldGet(_dialog,this));}}function _close(){alt_text_manager_classPrivateFieldGet(_currentEditor,this)._reportTelemetry(alt_text_manager_classPrivateFieldGet(_telemetryData,this)||{action:"alt_text_cancel",alt_text_keyboard:!alt_text_manager_classPrivateFieldGet(_hasUsedPointer,this)});alt_text_manager_classPrivateFieldSet(_telemetryData,this,null);alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_removeOnClickListeners).call(this);alt_text_manager_classPrivateFieldGet(_uiManager,this)?.addEditListeners();alt_text_manager_classPrivateFieldGet(_eventBus,this)._off("resize",alt_text_manager_classPrivateFieldGet(_boundSetPosition,this));alt_text_manager_classPrivateFieldGet(_currentEditor,this).altTextFinish();alt_text_manager_classPrivateFieldSet(_currentEditor,this,null);alt_text_manager_classPrivateFieldSet(_uiManager,this,null);}function _updateUIState(){alt_text_manager_classPrivateFieldGet(_textarea,this).disabled=alt_text_manager_classPrivateFieldGet(_optionDecorative,this).checked;}function _save(){const altText=alt_text_manager_classPrivateFieldGet(_textarea,this).value.trim();const decorative=alt_text_manager_classPrivateFieldGet(_optionDecorative,this).checked;alt_text_manager_classPrivateFieldGet(_currentEditor,this).altTextData={altText,decorative};alt_text_manager_classPrivateFieldSet(_telemetryData,this,{action:"alt_text_save",alt_text_description:!!altText,alt_text_edit:!!alt_text_manager_classPrivateFieldGet(_previousAltText,this)&&alt_text_manager_classPrivateFieldGet(_previousAltText,this)!==altText,alt_text_decorative:decorative,alt_text_keyboard:!alt_text_manager_classPrivateFieldGet(_hasUsedPointer,this)});alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_finish).call(this);}function _onClick(evt){if(evt.detail===0){return;}alt_text_manager_classPrivateFieldSet(_hasUsedPointer,this,true);alt_text_manager_assertClassBrand(_AltTextManager_brand,this,_removeOnClickListeners).call(this);}function _removeOnClickListeners(){for(const element of this._elements){element.removeEventListener("click",alt_text_manager_classPrivateFieldGet(_boundOnClick,this));}}
;// CONCATENATED MODULE: ./web/annotation_editor_params.js
function annotation_editor_params_classPrivateMethodInitSpec(e,a){annotation_editor_params_checkPrivateRedeclaration(e,a),a.add(e);}function annotation_editor_params_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function annotation_editor_params_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _AnnotationEditorParams_brand=/*#__PURE__*/new WeakSet();class AnnotationEditorParams{constructor(options,eventBus){annotation_editor_params_classPrivateMethodInitSpec(this,_AnnotationEditorParams_brand);this.eventBus=eventBus;annotation_editor_params_assertClassBrand(_AnnotationEditorParams_brand,this,_bindListeners).call(this,options);}}function _bindListeners(_ref){let{editorFreeTextFontSize,editorFreeTextColor,editorInkColor,editorInkThickness,editorInkOpacity,editorStampAddImage,editorFreeHighlightThickness,editorHighlightShowAll}=_ref;const dispatchEvent=(typeStr,value)=>{this.eventBus.dispatch("switchannotationeditorparams",{source:this,type:AnnotationEditorParamsType[typeStr],value});};editorFreeTextFontSize.addEventListener("input",function(){dispatchEvent("FREETEXT_SIZE",this.valueAsNumber);});editorFreeTextColor.addEventListener("input",function(){dispatchEvent("FREETEXT_COLOR",this.value);});editorInkColor.addEventListener("input",function(){dispatchEvent("INK_COLOR",this.value);});editorInkThickness.addEventListener("input",function(){dispatchEvent("INK_THICKNESS",this.valueAsNumber);});editorInkOpacity.addEventListener("input",function(){dispatchEvent("INK_OPACITY",this.valueAsNumber);});editorStampAddImage.addEventListener("click",()=>{dispatchEvent("CREATE");});editorFreeHighlightThickness.addEventListener("input",function(){dispatchEvent("HIGHLIGHT_THICKNESS",this.valueAsNumber);});editorHighlightShowAll.addEventListener("click",function(){const checked=this.getAttribute("aria-pressed")==="true";this.setAttribute("aria-pressed",!checked);dispatchEvent("HIGHLIGHT_SHOW_ALL",!checked);});this.eventBus._on("annotationeditorparamschanged",evt=>{for(const[type,value]of evt.details){switch(type){case AnnotationEditorParamsType.FREETEXT_SIZE:editorFreeTextFontSize.value=value;break;case AnnotationEditorParamsType.FREETEXT_COLOR:editorFreeTextColor.value=value;break;case AnnotationEditorParamsType.INK_COLOR:editorInkColor.value=value;break;case AnnotationEditorParamsType.INK_THICKNESS:editorInkThickness.value=value;break;case AnnotationEditorParamsType.INK_OPACITY:editorInkOpacity.value=value;break;case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:editorFreeHighlightThickness.value=value;break;case AnnotationEditorParamsType.HIGHLIGHT_FREE:editorFreeHighlightThickness.disabled=!value;break;case AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL:editorHighlightShowAll.setAttribute("aria-pressed",value);break;}}});}
;// CONCATENATED MODULE: ./web/caret_browsing.js
var _CaretBrowsingMode;function caret_browsing_classPrivateMethodInitSpec(e,a){caret_browsing_checkPrivateRedeclaration(e,a),a.add(e);}function caret_browsing_classPrivateFieldInitSpec(e,t,a){caret_browsing_checkPrivateRedeclaration(e,t),t.set(e,a);}function caret_browsing_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function caret_browsing_classPrivateFieldGet(s,a){return s.get(caret_browsing_assertClassBrand(s,a));}function caret_browsing_classPrivateFieldSet(s,a,r){return s.set(caret_browsing_assertClassBrand(s,a),r),r;}function caret_browsing_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const PRECISION=1e-1;var _mainContainer=/*#__PURE__*/new WeakMap();var _toolBarHeight=/*#__PURE__*/new WeakMap();var _viewerContainer=/*#__PURE__*/new WeakMap();var _CaretBrowsingMode_brand=/*#__PURE__*/new WeakSet();class CaretBrowsingMode{constructor(mainContainer,viewerContainer,toolbarContainer){caret_browsing_classPrivateMethodInitSpec(this,_CaretBrowsingMode_brand);caret_browsing_classPrivateFieldInitSpec(this,_mainContainer,void 0);caret_browsing_classPrivateFieldInitSpec(this,_toolBarHeight,void 0);caret_browsing_classPrivateFieldInitSpec(this,_viewerContainer,void 0);caret_browsing_classPrivateFieldSet(_mainContainer,this,mainContainer);caret_browsing_classPrivateFieldSet(_viewerContainer,this,viewerContainer);caret_browsing_classPrivateFieldSet(_toolBarHeight,this,toolbarContainer?.getBoundingClientRect().height??0);}moveCaret(isUp,select){const selection=document.getSelection();if(selection.rangeCount===0){return;}const{focusNode}=selection;const focusElement=focusNode.nodeType!==Node.ELEMENT_NODE?focusNode.parentElement:focusNode;const root=focusElement.closest(".textLayer");if(!root){return;}const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);walker.currentNode=focusNode;const focusRect=focusElement.getBoundingClientRect();let newLineElement=null;const nodeIterator=(isUp?walker.previousSibling:walker.nextSibling).bind(walker);while(nodeIterator()){const element=walker.currentNode.parentElement;if(!caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_isOnSameLine).call(this,focusRect,element.getBoundingClientRect())){newLineElement=element;break;}}if(!newLineElement){const node=caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_getNodeOnNextPage).call(this,root,isUp);if(!node){return;}if(select){const lastNode=(isUp?walker.firstChild():walker.lastChild())||focusNode;selection.extend(lastNode,isUp?0:lastNode.length);const range=document.createRange();range.setStart(node,isUp?node.length:0);range.setEnd(node,isUp?node.length:0);selection.addRange(range);return;}const[caretX]=caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_getCaretPosition).call(this,selection,isUp);const{parentElement}=node;caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_setCaretPosition).call(this,select,selection,parentElement,parentElement.getBoundingClientRect(),caretX);return;}const[caretX,caretY]=caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_getCaretPosition).call(this,selection,isUp);const newLineElementRect=newLineElement.getBoundingClientRect();if(caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_isUnderOver).call(this,newLineElementRect,caretX,caretY,isUp)){caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_setCaretPosition).call(this,select,selection,newLineElement,newLineElementRect,caretX);return;}while(nodeIterator()){const element=walker.currentNode.parentElement;const elementRect=element.getBoundingClientRect();if(!caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_isOnSameLine).call(this,newLineElementRect,elementRect)){break;}if(caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_isUnderOver).call(this,elementRect,caretX,caretY,isUp)){caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_setCaretPosition).call(this,select,selection,element,elementRect,caretX);return;}}caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_setCaretPosition).call(this,select,selection,newLineElement,newLineElementRect,caretX);}}_CaretBrowsingMode=CaretBrowsingMode;function _isOnSameLine(rect1,rect2){const top1=rect1.y;const bot1=rect1.bottom;const mid1=rect1.y+rect1.height/2;const top2=rect2.y;const bot2=rect2.bottom;const mid2=rect2.y+rect2.height/2;return top1<=mid2&&mid2<=bot1||top2<=mid1&&mid1<=bot2;}function _isUnderOver(rect,x,y,isUp){const midY=rect.y+rect.height/2;return(isUp?y>=midY:y<=midY)&&rect.x-PRECISION<=x&&x<=rect.right+PRECISION;}function _isVisible(rect){return rect.top>=caret_browsing_classPrivateFieldGet(_toolBarHeight,this)&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth);}function _getCaretPosition(selection,isUp){const{focusNode,focusOffset}=selection;const range=document.createRange();range.setStart(focusNode,focusOffset);range.setEnd(focusNode,focusOffset);const rect=range.getBoundingClientRect();return[rect.x,isUp?rect.top:rect.bottom];}function _caretPositionFromPoint(x,y){if(!document.caretPositionFromPoint){const{startContainer:offsetNode,startOffset:offset}=document.caretRangeFromPoint(x,y);return{offsetNode,offset};}return document.caretPositionFromPoint(x,y);}function _setCaretPositionHelper(selection,caretX,select,element,rect){rect||=element.getBoundingClientRect();if(caretX<=rect.x+PRECISION){if(select){selection.extend(element.firstChild,0);}else{selection.setPosition(element.firstChild,0);}return;}if(rect.right-PRECISION<=caretX){const{lastChild}=element;if(select){selection.extend(lastChild,lastChild.length);}else{selection.setPosition(lastChild,lastChild.length);}return;}const midY=rect.y+rect.height/2;let caretPosition=_caretPositionFromPoint.call(_CaretBrowsingMode,caretX,midY);let parentElement=caretPosition.offsetNode?.parentElement;if(parentElement&&parentElement!==element){const elementsAtPoint=document.elementsFromPoint(caretX,midY);const savedVisibilities=[];for(const el of elementsAtPoint){if(el===element){break;}const{style}=el;savedVisibilities.push([el,style.visibility]);style.visibility="hidden";}caretPosition=_caretPositionFromPoint.call(_CaretBrowsingMode,caretX,midY);parentElement=caretPosition.offsetNode?.parentElement;for(const[el,visibility]of savedVisibilities){el.style.visibility=visibility;}}if(parentElement!==element){if(select){selection.extend(element.firstChild,0);}else{selection.setPosition(element.firstChild,0);}return;}if(select){selection.extend(caretPosition.offsetNode,caretPosition.offset);}else{selection.setPosition(caretPosition.offsetNode,caretPosition.offset);}}function _setCaretPosition(select,selection,newLineElement,newLineElementRect,caretX){if(caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_isVisible).call(this,newLineElementRect)){caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_setCaretPositionHelper).call(this,selection,caretX,select,newLineElement,newLineElementRect);return;}caret_browsing_classPrivateFieldGet(_mainContainer,this).addEventListener("scrollend",caret_browsing_assertClassBrand(_CaretBrowsingMode_brand,this,_setCaretPositionHelper).bind(this,selection,caretX,select,newLineElement,null),{once:true});newLineElement.scrollIntoView();}function _getNodeOnNextPage(textLayer,isUp){while(true){const page=textLayer.closest(".page");const pageNumber=parseInt(page.getAttribute("data-page-number"));const nextPage=isUp?pageNumber-1:pageNumber+1;textLayer=caret_browsing_classPrivateFieldGet(_viewerContainer,this).querySelector(`.page[data-page-number="${nextPage}"] .textLayer`);if(!textLayer){return null;}const walker=document.createTreeWalker(textLayer,NodeFilter.SHOW_TEXT);const node=isUp?walker.lastChild():walker.firstChild();if(node){return node;}}}
;// CONCATENATED MODULE: ./web/download_manager.js
function download_manager_classPrivateFieldInitSpec(e,t,a){download_manager_checkPrivateRedeclaration(e,t),t.set(e,a);}function download_manager_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function download_manager_classPrivateFieldGet(s,a){return s.get(download_manager_assertClassBrand(s,a));}function download_manager_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}function download(blobUrl,filename){const a=document.createElement("a");if(!a.click){throw new Error('DownloadManager: "a.click()" is not supported.');}a.href=blobUrl;a.target="_parent";if("download"in a){a.download=filename;}(document.body||document.documentElement).append(a);a.click();a.remove();}var _openBlobUrls=/*#__PURE__*/new WeakMap();class DownloadManager{constructor(){download_manager_classPrivateFieldInitSpec(this,_openBlobUrls,new WeakMap());}downloadUrl(url,filename,_options){if(!createValidAbsoluteUrl(url,"http://example.com")){globalThis.ngxConsole.error(`downloadUrl - not a valid URL: ${url}`);return;}download(url+"#pdfjs.action=download",filename);}downloadData(data,filename,contentType){const blobUrl=URL.createObjectURL(new Blob([data],{type:contentType}));download(blobUrl,filename);}openOrDownloadData(data,filename){let dest=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;const isPdfData=isPdfFile(filename);const contentType=isPdfData?"application/pdf":"";if(isPdfData){let blobUrl=download_manager_classPrivateFieldGet(_openBlobUrls,this).get(data);if(!blobUrl){blobUrl=URL.createObjectURL(new Blob([data],{type:contentType}));download_manager_classPrivateFieldGet(_openBlobUrls,this).set(data,blobUrl);}try{window.open(blobUrl);return true;}catch(ex){globalThis.ngxConsole.error(`openOrDownloadData: ${ex}`);URL.revokeObjectURL(blobUrl);download_manager_classPrivateFieldGet(_openBlobUrls,this).delete(data);}}this.downloadData(data,filename,contentType);return false;}download(blob,url,filename,_options){const blobUrl=URL.createObjectURL(blob);download(blobUrl,filename);}}
;// CONCATENATED MODULE: ./web/overlay_manager.js
function overlay_manager_classPrivateFieldInitSpec(e,t,a){overlay_manager_checkPrivateRedeclaration(e,t),t.set(e,a);}function overlay_manager_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function overlay_manager_classPrivateFieldSet(s,a,r){return s.set(overlay_manager_assertClassBrand(s,a),r),r;}function overlay_manager_classPrivateFieldGet(s,a){return s.get(overlay_manager_assertClassBrand(s,a));}function overlay_manager_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _overlays=/*#__PURE__*/new WeakMap();var _active=/*#__PURE__*/new WeakMap();class OverlayManager{constructor(){overlay_manager_classPrivateFieldInitSpec(this,_overlays,new WeakMap());overlay_manager_classPrivateFieldInitSpec(this,_active,null);}get active(){return overlay_manager_classPrivateFieldGet(_active,this);}async register(dialog){let canForceClose=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(typeof dialog!=="object"){throw new Error("Not enough parameters.");}else if(overlay_manager_classPrivateFieldGet(_overlays,this).has(dialog)){throw new Error("The overlay is already registered.");}overlay_manager_classPrivateFieldGet(_overlays,this).set(dialog,{canForceClose});dialog.addEventListener("cancel",evt=>{overlay_manager_classPrivateFieldSet(_active,this,null);});}async open(dialog){if(!overlay_manager_classPrivateFieldGet(_overlays,this).has(dialog)){throw new Error("The overlay does not exist.");}else if(overlay_manager_classPrivateFieldGet(_active,this)){if(overlay_manager_classPrivateFieldGet(_active,this)===dialog){throw new Error("The overlay is already active.");}else if(overlay_manager_classPrivateFieldGet(_overlays,this).get(dialog).canForceClose){await this.close();}else{throw new Error("Another overlay is currently active.");}}overlay_manager_classPrivateFieldSet(_active,this,dialog);dialog.showModal();dialog.classList.remove("hidden");}async close(){let dialog=arguments.length>0&&arguments[0]!==undefined?arguments[0]:overlay_manager_classPrivateFieldGet(_active,this);if(!overlay_manager_classPrivateFieldGet(_overlays,this).has(dialog)){throw new Error("The overlay does not exist.");}else if(!overlay_manager_classPrivateFieldGet(_active,this)){throw new Error("The overlay is currently not active.");}else if(overlay_manager_classPrivateFieldGet(_active,this)!==dialog){throw new Error("Another overlay is currently active.");}dialog.close();overlay_manager_classPrivateFieldSet(_active,this,null);}}
;// CONCATENATED MODULE: ./web/password_prompt.js
function password_prompt_classPrivateMethodInitSpec(e,a){password_prompt_checkPrivateRedeclaration(e,a),a.add(e);}function password_prompt_classPrivateFieldInitSpec(e,t,a){password_prompt_checkPrivateRedeclaration(e,t),t.set(e,a);}function password_prompt_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function password_prompt_classPrivateFieldSet(s,a,r){return s.set(password_prompt_assertClassBrand(s,a),r),r;}function password_prompt_classPrivateFieldGet(s,a){return s.get(password_prompt_assertClassBrand(s,a));}function password_prompt_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _activeCapability=/*#__PURE__*/new WeakMap();var _updateCallback=/*#__PURE__*/new WeakMap();var _reason=/*#__PURE__*/new WeakMap();var _PasswordPrompt_brand=/*#__PURE__*/new WeakSet();class PasswordPrompt{constructor(options,overlayManager){let isViewerEmbedded=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;password_prompt_classPrivateMethodInitSpec(this,_PasswordPrompt_brand);password_prompt_classPrivateFieldInitSpec(this,_activeCapability,null);password_prompt_classPrivateFieldInitSpec(this,_updateCallback,null);password_prompt_classPrivateFieldInitSpec(this,_reason,null);this.dialog=options.dialog;this.label=options.label;this.input=options.input;this.submitButton=options.submitButton;this.cancelButton=options.cancelButton;this.overlayManager=overlayManager;this._isViewerEmbedded=isViewerEmbedded;this.submitButton.addEventListener("click",password_prompt_assertClassBrand(_PasswordPrompt_brand,this,_verify).bind(this));this.cancelButton.addEventListener("click",this.close.bind(this));this.input.addEventListener("keydown",e=>{if(e.keyCode===13){password_prompt_assertClassBrand(_PasswordPrompt_brand,this,_verify).call(this);}});this.overlayManager.register(this.dialog,true);this.dialog.addEventListener("close",password_prompt_assertClassBrand(_PasswordPrompt_brand,this,_cancel).bind(this));}async open(){await password_prompt_classPrivateFieldGet(_activeCapability,this)?.promise;password_prompt_classPrivateFieldSet(_activeCapability,this,Promise.withResolvers());try{await this.overlayManager.open(this.dialog);this.input.type="password";this.input.focus();}catch(ex){password_prompt_classPrivateFieldGet(_activeCapability,this).resolve();throw ex;}const passwordIncorrect=password_prompt_classPrivateFieldGet(_reason,this)===PasswordResponses.INCORRECT_PASSWORD;if(!this._isViewerEmbedded||passwordIncorrect){this.input.focus();}this.label.setAttribute("data-l10n-id",`pdfjs-password-${passwordIncorrect?"invalid":"label"}`);}async close(){if(this.overlayManager.active===this.dialog){this.overlayManager.close(this.dialog);this.input.value="";this.input.type="hidden";}}async setUpdateCallback(updateCallback,reason){if(password_prompt_classPrivateFieldGet(_activeCapability,this)){await password_prompt_classPrivateFieldGet(_activeCapability,this).promise;}password_prompt_classPrivateFieldSet(_updateCallback,this,updateCallback);password_prompt_classPrivateFieldSet(_reason,this,reason);}}function _verify(){const password=this.input.value;if(password?.length>0){password_prompt_assertClassBrand(_PasswordPrompt_brand,this,_invokeCallback).call(this,password);}}function _cancel(){password_prompt_assertClassBrand(_PasswordPrompt_brand,this,_invokeCallback).call(this,new Error("PasswordPrompt cancelled."));password_prompt_classPrivateFieldGet(_activeCapability,this).resolve();}function _invokeCallback(password){if(!password_prompt_classPrivateFieldGet(_updateCallback,this)){return;}this.close();this.input.value="";password_prompt_classPrivateFieldGet(_updateCallback,this).call(this,password);password_prompt_classPrivateFieldSet(_updateCallback,this,null);}
;// CONCATENATED MODULE: ./web/base_tree_viewer.js
const TREEITEM_OFFSET_TOP=-100;const TREEITEM_SELECTED_CLASS="selected";class BaseTreeViewer{constructor(options){if(this.constructor===BaseTreeViewer){throw new Error("Cannot initialize BaseTreeViewer.");}this.container=options.container;this.eventBus=options.eventBus;this._l10n=options.l10n;this.reset();}reset(){this._pdfDocument=null;this._lastToggleIsShow=true;this._currentTreeItem=null;this.container.textContent="";this.container.classList.remove("treeWithDeepNesting");}_dispatchEvent(count){throw new Error("Not implemented: _dispatchEvent");}_bindLink(element,params){throw new Error("Not implemented: _bindLink");}_normalizeTextContent(str){return removeNullCharacters(str,true)||"\u2013";}_addToggleButton(div){let hidden=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;const toggler=document.createElement("div");toggler.className="treeItemToggler";if(hidden){toggler.classList.add("treeItemsHidden");}toggler.onclick=evt=>{evt.stopPropagation();toggler.classList.toggle("treeItemsHidden");if(evt.shiftKey){const shouldShowAll=!toggler.classList.contains("treeItemsHidden");this._toggleTreeItem(div,shouldShowAll);}};div.prepend(toggler);}_toggleTreeItem(root){let show=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;this._l10n.pause();this._lastToggleIsShow=show;for(const toggler of root.querySelectorAll(".treeItemToggler")){toggler.classList.toggle("treeItemsHidden",!show);}this._l10n.resume();}_toggleAllTreeItems(){this._toggleTreeItem(this.container,!this._lastToggleIsShow);}_finishRendering(fragment,count){let hasAnyNesting=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(hasAnyNesting){this.container.classList.add("treeWithDeepNesting");this._lastToggleIsShow=!fragment.querySelector(".treeItemsHidden");}this._l10n.pause();this.container.append(fragment);this._l10n.resume();this._dispatchEvent(count);}render(params){throw new Error("Not implemented: render");}_updateCurrentTreeItem(){let treeItem=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(this._currentTreeItem){this._currentTreeItem.classList.remove(TREEITEM_SELECTED_CLASS);this._currentTreeItem=null;}if(treeItem){treeItem.classList.add(TREEITEM_SELECTED_CLASS);this._currentTreeItem=treeItem;}}_scrollToCurrentTreeItem(treeItem){if(!treeItem){return;}this._l10n.pause();let currentNode=treeItem.parentNode;while(currentNode&&currentNode!==this.container){if(currentNode.classList.contains("treeItem")){const toggler=currentNode.firstElementChild;toggler?.classList.remove("treeItemsHidden");}currentNode=currentNode.parentNode;}this._l10n.resume();this._updateCurrentTreeItem(treeItem);this.container.scrollTo(treeItem.offsetLeft,treeItem.offsetTop+TREEITEM_OFFSET_TOP);}}
;// CONCATENATED MODULE: ./web/pdf_attachment_viewer.js
function pdf_attachment_viewer_classPrivateMethodInitSpec(e,a){pdf_attachment_viewer_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_attachment_viewer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_attachment_viewer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _PDFAttachmentViewer_brand=/*#__PURE__*/new WeakSet();class PDFAttachmentViewer extends BaseTreeViewer{constructor(options){super(options);pdf_attachment_viewer_classPrivateMethodInitSpec(this,_PDFAttachmentViewer_brand);this.downloadManager=options.downloadManager;this.eventBus._on("fileattachmentannotation",pdf_attachment_viewer_assertClassBrand(_PDFAttachmentViewer_brand,this,_appendAttachment).bind(this));}reset(){let keepRenderedCapability=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;super.reset();this._attachments=null;if(!keepRenderedCapability){this._renderedCapability=Promise.withResolvers();}this._pendingDispatchEvent=false;}async _dispatchEvent(attachmentsCount){this._renderedCapability.resolve();if(attachmentsCount===0&&!this._pendingDispatchEvent){this._pendingDispatchEvent=true;await waitOnEventOrTimeout({target:this.eventBus,name:"annotationlayerrendered",delay:1000});if(!this._pendingDispatchEvent){return;}}this._pendingDispatchEvent=false;this.eventBus.dispatch("attachmentsloaded",{source:this,attachmentsCount});}_bindLink(element,_ref){let{content,description,filename}=_ref;if(description){element.title=description;}element.onclick=()=>{this.downloadManager.openOrDownloadData(content,filename);return false;};}render(_ref2){let{attachments,keepRenderedCapability=false}=_ref2;if(this._attachments){this.reset(keepRenderedCapability);}this._attachments=attachments||null;if(!attachments){this._dispatchEvent(0);return;}const fragment=document.createDocumentFragment();let attachmentsCount=0;for(const name in attachments){const item=attachments[name];const div=document.createElement("div");div.className="treeItem";const element=document.createElement("a");this._bindLink(element,item);element.textContent=this._normalizeTextContent(item.filename);div.append(element);fragment.append(div);attachmentsCount++;}this._finishRendering(fragment,attachmentsCount);}}function _appendAttachment(item){const renderedPromise=this._renderedCapability.promise;renderedPromise.then(()=>{if(renderedPromise!==this._renderedCapability.promise){return;}const attachments=this._attachments||Object.create(null);for(const name in attachments){if(item.filename===name){return;}}attachments[item.filename]=item;this.render({attachments,keepRenderedCapability:true});});}
;// CONCATENATED MODULE: ./web/grab_to_pan.js
function grab_to_pan_classPrivateMethodInitSpec(e,a){grab_to_pan_checkPrivateRedeclaration(e,a),a.add(e);}function grab_to_pan_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function grab_to_pan_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const CSS_CLASS_GRAB="grab-to-pan-grab";var _GrabToPan_brand=/*#__PURE__*/new WeakSet();class GrabToPan{constructor(_ref){let{element}=_ref;grab_to_pan_classPrivateMethodInitSpec(this,_GrabToPan_brand);this.element=element;this.document=element.ownerDocument;this.activate=this.activate.bind(this);this.deactivate=this.deactivate.bind(this);this.toggle=this.toggle.bind(this);this._onMouseDown=grab_to_pan_assertClassBrand(_GrabToPan_brand,this,_onMouseDown).bind(this);this._onMouseMove=grab_to_pan_assertClassBrand(_GrabToPan_brand,this,_onMouseMove).bind(this);this._endPan=grab_to_pan_assertClassBrand(_GrabToPan_brand,this,_endPan).bind(this);const overlay=this.overlay=document.createElement("div");overlay.className="grab-to-pan-grabbing";}activate(){if(!this.active){this.active=true;this.element.addEventListener("mousedown",this._onMouseDown);this.element.classList.add(CSS_CLASS_GRAB);}}deactivate(){if(this.active){this.active=false;this.element.removeEventListener("mousedown",this._onMouseDown);this._endPan();this.element.classList.remove(CSS_CLASS_GRAB);}}toggle(){if(this.active){this.deactivate();}else{this.activate();}}ignoreTarget(node){if(document.querySelector(".stf__item")){return true;}return node.matches("a[href], a[href] *, input, textarea, button, button *, select, option");}}function _onMouseDown(event){if(event.button!==0||this.ignoreTarget(event.target)){return;}if(event.originalTarget){try{event.originalTarget.tagName;}catch{return;}}this.scrollLeftStart=this.element.scrollLeft;this.scrollTopStart=this.element.scrollTop;this.clientXStart=event.clientX;this.clientYStart=event.clientY;if(isOverPerfectScrollbar(this.clientXStart,this.clientYStart,"ps__rail-x")){return;}if(isOverPerfectScrollbar(this.clientXStart,this.clientYStart,"ps__rail-y")){return;}this.document.addEventListener("mousemove",this._onMouseMove,true);this.document.addEventListener("mouseup",this._endPan,true);this.element.addEventListener("scroll",this._endPan,true);event.preventDefault();event.stopPropagation();const focusedElement=document.activeElement;if(focusedElement&&!focusedElement.contains(event.target)){focusedElement.blur();}}function _onMouseMove(event){this.element.removeEventListener("scroll",this._endPan,true);if(!(event.buttons&1)){this._endPan();return;}const xDiff=event.clientX-this.clientXStart;const yDiff=event.clientY-this.clientYStart;this.element.scrollTo({top:this.scrollTopStart-yDiff,left:this.scrollLeftStart-xDiff,behavior:"instant"});if(!this.overlay.parentNode){document.body.append(this.overlay);}}function _endPan(){this.element.removeEventListener("scroll",this._endPan,true);this.document.removeEventListener("mousemove",this._onMouseMove,true);this.document.removeEventListener("mouseup",this._endPan,true);this.overlay.remove();}function isOverPerfectScrollbar(x,y,divName){const perfectScrollbar=document.getElementsByClassName(divName);if(perfectScrollbar&&perfectScrollbar.length===1){var{top,right,bottom,left}=perfectScrollbar[0].getBoundingClientRect();if(y>=top&&y<=bottom){if(x<=right&&x>=left){return true;}}}return false;}
;// CONCATENATED MODULE: ./web/pdf_cursor_tools.js
function pdf_cursor_tools_classPrivateMethodInitSpec(e,a){pdf_cursor_tools_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_cursor_tools_classPrivateFieldInitSpec(e,t,a){pdf_cursor_tools_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_cursor_tools_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_cursor_tools_classPrivateFieldSet(s,a,r){return s.set(pdf_cursor_tools_assertClassBrand(s,a),r),r;}function pdf_cursor_tools_classPrivateFieldGet(s,a){return s.get(pdf_cursor_tools_assertClassBrand(s,a));}function pdf_cursor_tools_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var pdf_cursor_tools_active=/*#__PURE__*/new WeakMap();var _prevActive=/*#__PURE__*/new WeakMap();var _PDFCursorTools_brand=/*#__PURE__*/new WeakSet();class PDFCursorTools{constructor(_ref){let{container,eventBus,cursorToolOnLoad=CursorTool.SELECT}=_ref;pdf_cursor_tools_classPrivateMethodInitSpec(this,_PDFCursorTools_brand);pdf_cursor_tools_classPrivateFieldInitSpec(this,pdf_cursor_tools_active,CursorTool.SELECT);pdf_cursor_tools_classPrivateFieldInitSpec(this,_prevActive,null);this.container=container;this.eventBus=eventBus;pdf_cursor_tools_assertClassBrand(_PDFCursorTools_brand,this,_addEventListeners).call(this);Promise.resolve().then(()=>{this.switchTool(cursorToolOnLoad);});}get activeTool(){return pdf_cursor_tools_classPrivateFieldGet(pdf_cursor_tools_active,this);}switchTool(tool){if(pdf_cursor_tools_classPrivateFieldGet(_prevActive,this)!==null){return;}if(tool===pdf_cursor_tools_classPrivateFieldGet(pdf_cursor_tools_active,this)){return;}const disableActiveTool=()=>{switch(pdf_cursor_tools_classPrivateFieldGet(pdf_cursor_tools_active,this)){case CursorTool.SELECT:break;case CursorTool.HAND:this._handTool.deactivate();break;case CursorTool.ZOOM:}};switch(tool){case CursorTool.SELECT:disableActiveTool();break;case CursorTool.HAND:disableActiveTool();this._handTool.activate();break;case CursorTool.ZOOM:default:globalThis.ngxConsole.error(`switchTool: "${tool}" is an unsupported value.`);return;}pdf_cursor_tools_classPrivateFieldSet(pdf_cursor_tools_active,this,tool);this.eventBus.dispatch("cursortoolchanged",{source:this,tool});}get _handTool(){return shadow(this,"_handTool",new GrabToPan({element:this.container}));}}function _addEventListeners(){this.eventBus._on("switchcursortool",evt=>{if(!evt.reset){this.switchTool(evt.tool);}else if(pdf_cursor_tools_classPrivateFieldGet(_prevActive,this)!==null){annotationEditorMode=AnnotationEditorType.NONE;presentationModeState=PresentationModeState.NORMAL;enableActive();}});let annotationEditorMode=AnnotationEditorType.NONE,presentationModeState=PresentationModeState.NORMAL;const disableActive=()=>{const prevActive=pdf_cursor_tools_classPrivateFieldGet(pdf_cursor_tools_active,this);this.switchTool(CursorTool.SELECT);pdf_cursor_tools_classPrivateFieldGet(_prevActive,this)??pdf_cursor_tools_classPrivateFieldSet(_prevActive,this,prevActive);};const enableActive=()=>{const prevActive=pdf_cursor_tools_classPrivateFieldGet(_prevActive,this);if(prevActive!==null&&annotationEditorMode===AnnotationEditorType.NONE&&presentationModeState===PresentationModeState.NORMAL){pdf_cursor_tools_classPrivateFieldSet(_prevActive,this,null);this.switchTool(prevActive);}};this.eventBus._on("annotationeditormodechanged",_ref2=>{let{mode}=_ref2;annotationEditorMode=mode;if(mode===AnnotationEditorType.NONE){enableActive();}else{disableActive();}});this.eventBus._on("presentationmodechanged",_ref3=>{let{state}=_ref3;presentationModeState=state;if(state===PresentationModeState.NORMAL){enableActive();}else if(state===PresentationModeState.FULLSCREEN){disableActive();}});}
;// CONCATENATED MODULE: ./web/pdf_document_properties.js
function pdf_document_properties_classPrivateMethodInitSpec(e,a){pdf_document_properties_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_document_properties_classPrivateFieldInitSpec(e,t,a){pdf_document_properties_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_document_properties_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_document_properties_classPrivateFieldSet(s,a,r){return s.set(pdf_document_properties_assertClassBrand(s,a),r),r;}function pdf_document_properties_classPrivateFieldGet(s,a){return s.get(pdf_document_properties_assertClassBrand(s,a));}function pdf_document_properties_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DEFAULT_FIELD_CONTENT="-";const NON_METRIC_LOCALES=["en-us","en-lr","my"];const US_PAGE_NAMES={"8.5x11":"letter","8.5x14":"legal"};const METRIC_PAGE_NAMES={"297x420":"a-three","210x297":"a-four"};function getPageName(size,isPortrait,pageNames){const width=isPortrait?size.width:size.height;const height=isPortrait?size.height:size.width;return pageNames[`${width}x${height}`];}var _fieldData=/*#__PURE__*/new WeakMap();var _PDFDocumentProperties_brand=/*#__PURE__*/new WeakSet();class PDFDocumentProperties{constructor(_ref,overlayManager,eventBus,l10n,fileNameLookup){let{dialog,fields,closeButton}=_ref;pdf_document_properties_classPrivateMethodInitSpec(this,_PDFDocumentProperties_brand);pdf_document_properties_classPrivateFieldInitSpec(this,_fieldData,null);this.dialog=dialog;this.fields=fields;this.overlayManager=overlayManager;this.l10n=l10n;this._fileNameLookup=fileNameLookup;this.eventBus=eventBus;pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_reset).call(this);closeButton.addEventListener("click",this.close.bind(this));this.overlayManager.register(this.dialog);eventBus._on("pagechanging",evt=>{this._currentPageNumber=evt.pageNumber;});eventBus._on("rotationchanging",evt=>{this._pagesRotation=evt.pagesRotation;});this._isNonMetricLocale=NON_METRIC_LOCALES.includes(l10n.getLanguage());}async open(){await Promise.all([this.overlayManager.open(this.dialog),this._dataAvailableCapability.promise]);this.eventBus.dispatch("propertiesdialogopen",this);const currentPageNumber=this._currentPageNumber;const pagesRotation=this._pagesRotation;if(pdf_document_properties_classPrivateFieldGet(_fieldData,this)&&currentPageNumber===pdf_document_properties_classPrivateFieldGet(_fieldData,this)._currentPageNumber&&pagesRotation===pdf_document_properties_classPrivateFieldGet(_fieldData,this)._pagesRotation){pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_updateUI).call(this);return;}const{info,contentLength}=await this.pdfDocument.getMetadata();const[fileName,fileSize,creationDate,modificationDate,pageSize,isLinearized]=await Promise.all([this._fileNameLookup(),pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_parseFileSize).call(this,contentLength),pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_parseDate).call(this,info.CreationDate),pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_parseDate).call(this,info.ModDate),this.pdfDocument.getPage(currentPageNumber).then(pdfPage=>{return pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_parsePageSize).call(this,getPageSizeInches(pdfPage),pagesRotation);}),pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_parseLinearization).call(this,info.IsLinearized)]);pdf_document_properties_classPrivateFieldSet(_fieldData,this,Object.freeze({fileName,fileSize,title:info.Title,author:info.Author,subject:info.Subject,keywords:info.Keywords,creationDate,modificationDate,creator:info.Creator,producer:info.Producer,version:info.PDFFormatVersion,pageCount:this.pdfDocument.numPages,pageSize,linearized:isLinearized,_currentPageNumber:currentPageNumber,_pagesRotation:pagesRotation}));pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_updateUI).call(this);const{length}=await this.pdfDocument.getDownloadInfo();if(contentLength===length){return;}const data=Object.assign(Object.create(null),pdf_document_properties_classPrivateFieldGet(_fieldData,this));data.fileSize=await pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_parseFileSize).call(this,length);pdf_document_properties_classPrivateFieldSet(_fieldData,this,Object.freeze(data));pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_updateUI).call(this);}async close(){this.overlayManager.close(this.dialog);this.eventBus.dispatch("propertiesdialogclose",this);}setDocument(pdfDocument){if(this.pdfDocument){pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_reset).call(this);pdf_document_properties_assertClassBrand(_PDFDocumentProperties_brand,this,_updateUI).call(this,true);}if(!pdfDocument){return;}this.pdfDocument=pdfDocument;this._dataAvailableCapability.resolve();}}function _reset(){this.pdfDocument=null;pdf_document_properties_classPrivateFieldSet(_fieldData,this,null);this._dataAvailableCapability=Promise.withResolvers();this._currentPageNumber=1;this._pagesRotation=0;}function _updateUI(){let reset=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(reset||!pdf_document_properties_classPrivateFieldGet(_fieldData,this)){for(const id in this.fields){this.fields[id].textContent=DEFAULT_FIELD_CONTENT;}return;}if(this.overlayManager.active!==this.dialog){return;}for(const id in this.fields){const content=pdf_document_properties_classPrivateFieldGet(_fieldData,this)[id];this.fields[id].textContent=content||content===0?content:DEFAULT_FIELD_CONTENT;}}async function _parseFileSize(){let fileSize=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;const kb=fileSize/1024,mb=kb/1024;if(!kb){return undefined;}return this.l10n.get(`pdfjs-document-properties-${mb>=1?"mb":"kb"}`,{size_mb:mb>=1&&(+mb.toPrecision(3)).toLocaleString(),size_kb:mb<1&&(+kb.toPrecision(3)).toLocaleString(),size_b:fileSize.toLocaleString()});}async function _parsePageSize(pageSizeInches,pagesRotation){if(!pageSizeInches){return undefined;}if(pagesRotation%180!==0){pageSizeInches={width:pageSizeInches.height,height:pageSizeInches.width};}const isPortrait=isPortraitOrientation(pageSizeInches);let sizeInches={width:Math.round(pageSizeInches.width*100)/100,height:Math.round(pageSizeInches.height*100)/100};let sizeMillimeters={width:Math.round(pageSizeInches.width*25.4*10)/10,height:Math.round(pageSizeInches.height*25.4*10)/10};let rawName=getPageName(sizeInches,isPortrait,US_PAGE_NAMES)||getPageName(sizeMillimeters,isPortrait,METRIC_PAGE_NAMES);if(!rawName&&!(Number.isInteger(sizeMillimeters.width)&&Number.isInteger(sizeMillimeters.height))){const exactMillimeters={width:pageSizeInches.width*25.4,height:pageSizeInches.height*25.4};const intMillimeters={width:Math.round(sizeMillimeters.width),height:Math.round(sizeMillimeters.height)};if(Math.abs(exactMillimeters.width-intMillimeters.width)<0.1&&Math.abs(exactMillimeters.height-intMillimeters.height)<0.1){rawName=getPageName(intMillimeters,isPortrait,METRIC_PAGE_NAMES);if(rawName){sizeInches={width:Math.round(intMillimeters.width/25.4*100)/100,height:Math.round(intMillimeters.height/25.4*100)/100};sizeMillimeters=intMillimeters;}}}const[{width,height},unit,name,orientation]=await Promise.all([this._isNonMetricLocale?sizeInches:sizeMillimeters,this.l10n.get(`pdfjs-document-properties-page-size-unit-${this._isNonMetricLocale?"inches":"millimeters"}`),rawName&&this.l10n.get(`pdfjs-document-properties-page-size-name-${rawName}`),this.l10n.get(`pdfjs-document-properties-page-size-orientation-${isPortrait?"portrait":"landscape"}`)]);return this.l10n.get(`pdfjs-document-properties-page-size-dimension-${name?"name-":""}string`,{width:width.toLocaleString(),height:height.toLocaleString(),unit,name,orientation});}async function _parseDate(inputDate){const dateObject=PDFDateString.toDateObject(inputDate);if(!dateObject){return undefined;}return this.l10n.get("pdfjs-document-properties-date-string",{date:dateObject.toLocaleDateString(),time:dateObject.toLocaleTimeString()});}function _parseLinearization(isLinearized){return this.l10n.get(`pdfjs-document-properties-linearized-${isLinearized?"yes":"no"}`);}
;// CONCATENATED MODULE: ./web/pdf_find_utils.js
const CharacterType={SPACE:0,ALPHA_LETTER:1,PUNCT:2,HAN_LETTER:3,KATAKANA_LETTER:4,HIRAGANA_LETTER:5,HALFWIDTH_KATAKANA_LETTER:6,THAI_LETTER:7};function isAlphabeticalScript(charCode){return charCode<0x2e80;}function isAscii(charCode){return(charCode&0xff80)===0;}function isAsciiAlpha(charCode){return charCode>=0x61&&charCode<=0x7a||charCode>=0x41&&charCode<=0x5a;}function isAsciiDigit(charCode){return charCode>=0x30&&charCode<=0x39;}function isAsciiSpace(charCode){return charCode===0x20||charCode===0x09||charCode===0x0d||charCode===0x0a;}function isHan(charCode){return charCode>=0x3400&&charCode<=0x9fff||charCode>=0xf900&&charCode<=0xfaff;}function isKatakana(charCode){return charCode>=0x30a0&&charCode<=0x30ff;}function isHiragana(charCode){return charCode>=0x3040&&charCode<=0x309f;}function isHalfwidthKatakana(charCode){return charCode>=0xff60&&charCode<=0xff9f;}function isThai(charCode){return(charCode&0xff80)===0x0e00;}function getCharacterType(charCode){if(isAlphabeticalScript(charCode)){if(isAscii(charCode)){if(isAsciiSpace(charCode)){return CharacterType.SPACE;}else if(isAsciiAlpha(charCode)||isAsciiDigit(charCode)||charCode===0x5f){return CharacterType.ALPHA_LETTER;}return CharacterType.PUNCT;}else if(isThai(charCode)){return CharacterType.THAI_LETTER;}else if(charCode===0xa0){return CharacterType.SPACE;}return CharacterType.ALPHA_LETTER;}if(isHan(charCode)){return CharacterType.HAN_LETTER;}else if(isKatakana(charCode)){return CharacterType.KATAKANA_LETTER;}else if(isHiragana(charCode)){return CharacterType.HIRAGANA_LETTER;}else if(isHalfwidthKatakana(charCode)){return CharacterType.HALFWIDTH_KATAKANA_LETTER;}return CharacterType.ALPHA_LETTER;}let NormalizeWithNFKC;function getNormalizeWithNFKC(){NormalizeWithNFKC||=` ¨ª¯²-µ¸-º¼-¾Ĳ-ĳĿ-ŀŉſǄ-ǌǱ-ǳʰ-ʸ˘-˝ˠ-ˤʹͺ;΄-΅·ϐ-ϖϰ-ϲϴ-ϵϹևٵ-ٸक़-य़ড়-ঢ়য়ਲ਼ਸ਼ਖ਼-ਜ਼ਫ਼ଡ଼-ଢ଼ำຳໜ-ໝ༌གྷཌྷདྷབྷཛྷཀྵჼᴬ-ᴮᴰ-ᴺᴼ-ᵍᵏ-ᵪᵸᶛ-ᶿẚ-ẛάέήίόύώΆ᾽-῁ΈΉ῍-῏ΐΊ῝-῟ΰΎ῭-`ΌΏ´-῾ - ‑‗․-… ″-‴‶-‷‼‾⁇-⁉⁗ ⁰-ⁱ⁴-₎ₐ-ₜ₨℀-℃℅-ℇ℉-ℓℕ-№ℙ-ℝ℠-™ℤΩℨK-ℭℯ-ℱℳ-ℹ℻-⅀ⅅ-ⅉ⅐-ⅿ↉∬-∭∯-∰〈-〉①-⓪⨌⩴-⩶⫝̸ⱼ-ⱽⵯ⺟⻳⼀-⿕　〶〸-〺゛-゜ゟヿㄱ-ㆎ㆒-㆟㈀-㈞㈠-㉇㉐-㉾㊀-㏿ꚜ-ꚝꝰꟲ-ꟴꟸ-ꟹꭜ-ꭟꭩ豈-嗀塚晴凞-羽蘒諸逸-都飯-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-﷼︐-︙︰-﹄﹇-﹒﹔-﹦﹨-﹫ﹰ-ﹲﹴﹶ-ﻼ！-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￦`;return NormalizeWithNFKC;}
;// CONCATENATED MODULE: ./web/pdf_find_controller.js
function pdf_find_controller_classPrivateMethodInitSpec(e,a){pdf_find_controller_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_find_controller_classPrivateFieldInitSpec(e,t,a){pdf_find_controller_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_find_controller_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function _classPrivateGetter(s,r,a){return a(pdf_find_controller_assertClassBrand(s,r));}function pdf_find_controller_classPrivateFieldGet(s,a){return s.get(pdf_find_controller_assertClassBrand(s,a));}function pdf_find_controller_classPrivateFieldSet(s,a,r){return s.set(pdf_find_controller_assertClassBrand(s,a),r),r;}function pdf_find_controller_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const FindState={FOUND:0,NOT_FOUND:1,WRAPPED:2,PENDING:3};const FIND_TIMEOUT=250;const MATCH_SCROLL_OFFSET_TOP=-50;const MATCH_SCROLL_OFFSET_LEFT=-400;const CHARACTERS_TO_NORMALIZE={"\u2010":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u00BC":"1/4","\u00BD":"1/2","\u00BE":"3/4"};const DIACRITICS_EXCEPTION=new Set([0x3099,0x309a,0x094d,0x09cd,0x0a4d,0x0acd,0x0b4d,0x0bcd,0x0c4d,0x0ccd,0x0d3b,0x0d3c,0x0d4d,0x0dca,0x0e3a,0x0eba,0x0f84,0x1039,0x103a,0x1714,0x1734,0x17d2,0x1a60,0x1b44,0x1baa,0x1bab,0x1bf2,0x1bf3,0x2d7f,0xa806,0xa82c,0xa8c4,0xa953,0xa9c0,0xaaf6,0xabed,0x0c56,0x0f71,0x0f72,0x0f7a,0x0f7b,0x0f7c,0x0f7d,0x0f80,0x0f74]);let DIACRITICS_EXCEPTION_STR;const DIACRITICS_REG_EXP=/\p{M}+/gu;const SPECIAL_CHARS_REG_EXP=/([.*+?^${}()|[\]\\])|(\p{P})|(\s+)|(\p{M})|(\p{L})/gu;const NOT_DIACRITIC_FROM_END_REG_EXP=/([^\p{M}])\p{M}*$/u;const NOT_DIACRITIC_FROM_START_REG_EXP=/^\p{M}*([^\p{M}])/u;const SYLLABLES_REG_EXP=/[\uAC00-\uD7AF\uFA6C\uFACF-\uFAD1\uFAD5-\uFAD7]+/g;const SYLLABLES_LENGTHS=new Map();const FIRST_CHAR_SYLLABLES_REG_EXP="[\\u1100-\\u1112\\ud7a4-\\ud7af\\ud84a\\ud84c\\ud850\\ud854\\ud857\\ud85f]";const NFKC_CHARS_TO_NORMALIZE=new Map();let noSyllablesRegExp=null;let withSyllablesRegExp=null;function normalize(text){const syllablePositions=[];let m;while((m=SYLLABLES_REG_EXP.exec(text))!==null){let{index}=m;for(const char of m[0]){let len=SYLLABLES_LENGTHS.get(char);if(!len){len=char.normalize("NFD").length;SYLLABLES_LENGTHS.set(char,len);}syllablePositions.push([len,index++]);}}let normalizationRegex;if(syllablePositions.length===0&&noSyllablesRegExp){normalizationRegex=noSyllablesRegExp;}else if(syllablePositions.length>0&&withSyllablesRegExp){normalizationRegex=withSyllablesRegExp;}else{const replace=Object.keys(CHARACTERS_TO_NORMALIZE).join("");const toNormalizeWithNFKC=getNormalizeWithNFKC();const CJK="(?:\\p{Ideographic}|[\u3040-\u30FF])";const HKDiacritics="(?:\u3099|\u309A)";const regexp=`([${replace}])|([${toNormalizeWithNFKC}])|(${HKDiacritics}\\n)|(\\p{M}+(?:-\\n)?)|(\\S-\\n)|(${CJK}\\n)|(\\n)`;if(syllablePositions.length===0){normalizationRegex=noSyllablesRegExp=new RegExp(regexp+"|(\\u0000)","gum");}else{normalizationRegex=withSyllablesRegExp=new RegExp(regexp+`|(${FIRST_CHAR_SYLLABLES_REG_EXP})`,"gum");}}const rawDiacriticsPositions=[];while((m=DIACRITICS_REG_EXP.exec(text))!==null){rawDiacriticsPositions.push([m[0].length,m.index]);}let normalized=text.normalize("NFD");const positions=[[0,0]];let rawDiacriticsIndex=0;let syllableIndex=0;let shift=0;let shiftOrigin=0;let eol=0;let hasDiacritics=false;normalized=normalized.replace(normalizationRegex,(match,p1,p2,p3,p4,p5,p6,p7,p8,i)=>{i-=shiftOrigin;if(p1){const replacement=CHARACTERS_TO_NORMALIZE[p1];const jj=replacement.length;for(let j=1;j<jj;j++){positions.push([i-shift+j,shift-j]);}shift-=jj-1;return replacement;}if(p2){let replacement=NFKC_CHARS_TO_NORMALIZE.get(p2);if(!replacement){replacement=p2.normalize("NFKC");NFKC_CHARS_TO_NORMALIZE.set(p2,replacement);}const jj=replacement.length;for(let j=1;j<jj;j++){positions.push([i-shift+j,shift-j]);}shift-=jj-1;return replacement;}if(p3){hasDiacritics=true;if(i+eol===rawDiacriticsPositions[rawDiacriticsIndex]?.[1]){++rawDiacriticsIndex;}else{positions.push([i-1-shift+1,shift-1]);shift-=1;shiftOrigin+=1;}positions.push([i-shift+1,shift]);shiftOrigin+=1;eol+=1;return p3.charAt(0);}if(p4){const hasTrailingDashEOL=p4.endsWith("\n");const len=hasTrailingDashEOL?p4.length-2:p4.length;hasDiacritics=true;let jj=len;if(i+eol===rawDiacriticsPositions[rawDiacriticsIndex]?.[1]){jj-=rawDiacriticsPositions[rawDiacriticsIndex][0];++rawDiacriticsIndex;}for(let j=1;j<=jj;j++){positions.push([i-1-shift+j,shift-j]);}shift-=jj;shiftOrigin+=jj;if(hasTrailingDashEOL){i+=len-1;positions.push([i-shift+1,1+shift]);shift+=1;shiftOrigin+=1;eol+=1;return p4.slice(0,len);}return p4;}if(p5){const len=p5.length-2;positions.push([i-shift+len,1+shift]);shift+=1;shiftOrigin+=1;eol+=1;return p5.slice(0,-2);}if(p6){const len=p6.length-1;positions.push([i-shift+len,shift]);shiftOrigin+=1;eol+=1;return p6.slice(0,-1);}if(p7){positions.push([i-shift+1,shift-1]);shift-=1;shiftOrigin+=1;eol+=1;return" ";}if(i+eol===syllablePositions[syllableIndex]?.[1]){const newCharLen=syllablePositions[syllableIndex][0]-1;++syllableIndex;for(let j=1;j<=newCharLen;j++){positions.push([i-(shift-j),shift-j]);}shift-=newCharLen;shiftOrigin+=newCharLen;}return p8;});positions.push([normalized.length,shift]);return[normalized,positions,hasDiacritics];}function getOriginalIndex(diffs,pos,len){if(!diffs){return[pos,len];}const start=pos;const end=pos+len-1;let i=binarySearchFirstItem(diffs,x=>x[0]>=start);if(diffs[i][0]>start){--i;}let j=binarySearchFirstItem(diffs,x=>x[0]>=end,i);if(diffs[j][0]>end){--j;}const oldStart=start+diffs[i][1];const oldEnd=end+diffs[j][1];const oldLen=oldEnd+1-oldStart;return[oldStart,oldLen];}var _state=/*#__PURE__*/new WeakMap();var _updateMatchesCountOnProgress=/*#__PURE__*/new WeakMap();var _visitedPagesCount=/*#__PURE__*/new WeakMap();var _PDFFindController_brand=/*#__PURE__*/new WeakSet();class PDFFindController{constructor(_ref){let{linkService:_linkService,eventBus,updateMatchesCountOnProgress=true,pageViewMode}=_ref;pdf_find_controller_classPrivateMethodInitSpec(this,_PDFFindController_brand);pdf_find_controller_classPrivateFieldInitSpec(this,_state,null);pdf_find_controller_classPrivateFieldInitSpec(this,_updateMatchesCountOnProgress,true);pdf_find_controller_classPrivateFieldInitSpec(this,_visitedPagesCount,0);this._linkService=_linkService;this._eventBus=eventBus;pdf_find_controller_classPrivateFieldSet(_updateMatchesCountOnProgress,this,updateMatchesCountOnProgress);this._pageViewMode=pageViewMode;this.onIsPageVisible=null;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_reset).call(this);eventBus._on("find",pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_onFind).bind(this));eventBus._on("findbarclose",pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_onFindBarClose).bind(this));}get highlightMatches(){return this._highlightMatches;}get pageMatches(){return this._pageMatches;}get pageMatchesLength(){return this._pageMatchesLength;}get selected(){return this._selected;}get state(){return pdf_find_controller_classPrivateFieldGet(_state,this);}setDocument(pdfDocument){if(this._pdfDocument){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_reset).call(this);}if(!pdfDocument){return;}this._pdfDocument=pdfDocument;this._firstPageCapability.resolve();}scrollMatchIntoView(_ref2){let{element=null,selectedLeft=0,pageIndex=-1,matchIndex=-1}=_ref2;if(!this._scrollMatches||!element){return;}else if(matchIndex===-1||matchIndex!==this._selected.matchIdx){return;}else if(pageIndex===-1||pageIndex!==this._selected.pageIdx){return;}this._scrollMatches=false;const spot={top:MATCH_SCROLL_OFFSET_TOP,left:selectedLeft+MATCH_SCROLL_OFFSET_LEFT};scrollIntoView(element,spot,true,this._pageViewMode==='infinite-scroll');}_calculateRegExpMatch(query,entireWord,pageIndex,pageContent){const matches=this._pageMatches[pageIndex]=[];const matchesLength=this._pageMatchesLength[pageIndex]=[];if(!query){return;}const diffs=this._pageDiffs[pageIndex];let match;while((match=query.exec(pageContent))!==null){if(entireWord&&!pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_isEntireWord).call(this,pageContent,match.index,match[0].length)){continue;}const[matchPos,matchLen]=getOriginalIndex(diffs,match.index,match[0].length);if(matchLen){matches.push(matchPos);matchesLength.push(matchLen);}}}_convertToRegExpString(query,hasDiacritics){const{matchDiacritics}=pdf_find_controller_classPrivateFieldGet(_state,this);let isUnicode=false;query=query.replaceAll(SPECIAL_CHARS_REG_EXP,(match,p1,p2,p3,p4,p5)=>{if(p1){return`[ ]*\\${p1}[ ]*`;}if(p2){return`[ ]*${p2}[ ]*`;}if(p3){return"[ ]+";}if(matchDiacritics){return p4||p5;}if(p4){return DIACRITICS_EXCEPTION.has(p4.charCodeAt(0))?p4:"";}if(hasDiacritics){isUnicode=true;return`${p5}\\p{M}*`;}return p5;});const trailingSpaces="[ ]*";if(query.endsWith(trailingSpaces)){query=query.slice(0,query.length-trailingSpaces.length);}if(matchDiacritics){if(hasDiacritics){DIACRITICS_EXCEPTION_STR||=String.fromCharCode(...DIACRITICS_EXCEPTION);isUnicode=true;query=`${query}(?=[${DIACRITICS_EXCEPTION_STR}]|[^\\p{M}]|$)`;}}return[isUnicode,query];}_calculateMatch(pageIndex){var _this$visitedPagesCou;let query=_classPrivateGetter(_PDFFindController_brand,this,_get_query);if(query.length===0){return;}const{caseSensitive,entireWord}=pdf_find_controller_classPrivateFieldGet(_state,this);const pageContent=this._pageContents[pageIndex];const hasDiacritics=this._hasDiacritics[pageIndex];let isUnicode=false;if(typeof query==="string"){[isUnicode,query]=this._convertToRegExpString(query,hasDiacritics);}else{query=query.sort().reverse().map(q=>{const[isUnicodePart,queryPart]=this._convertToRegExpString(q,hasDiacritics);isUnicode||=isUnicodePart;return`(${queryPart})`;}).join("|");}const flags=`g${isUnicode?"u":""}${caseSensitive?"":"i"}`;query=query?new RegExp(query,flags):null;this._calculateRegExpMatch(query,entireWord,pageIndex,pageContent);if(pdf_find_controller_classPrivateFieldGet(_state,this).highlightAll){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updatePage).call(this,pageIndex);}if(this._resumePageIdx===pageIndex){this._resumePageIdx=null;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextPageMatch).call(this);}const pageMatchesCount=this._pageMatches[pageIndex].length;this._matchesCountTotal+=pageMatchesCount;if(pdf_find_controller_classPrivateFieldGet(_updateMatchesCountOnProgress,this)){if(pageMatchesCount>0){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateUIResultsCount).call(this);}}else if(pdf_find_controller_classPrivateFieldSet(_visitedPagesCount,this,(_this$visitedPagesCou=pdf_find_controller_classPrivateFieldGet(_visitedPagesCount,this),++_this$visitedPagesCou))===this._linkService.pagesCount){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateUIResultsCount).call(this);}}}function _onFind(state){if(!state){return;}const pdfDocument=this._pdfDocument;const{type}=state;if(pdf_find_controller_classPrivateFieldGet(_state,this)===null||pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_shouldDirtyMatch).call(this,state)){this._dirtyMatch=true;}pdf_find_controller_classPrivateFieldSet(_state,this,state);if(type!=="highlightallchange"){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_updateUIState).call(this,FindState.PENDING);}else{const hasMatches=this._pageMatches.some(matches=>matches.length>0);const emptyQuery=!this.state?.query;const reportAsFound=emptyQuery||hasMatches;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_updateUIState).call(this,reportAsFound?FindState.FOUND:FindState.NOT_FOUND);}this._firstPageCapability.promise.then(()=>{if(!this._pdfDocument||pdfDocument&&this._pdfDocument!==pdfDocument){return;}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_extractText).call(this);const findbarClosed=!this._highlightMatches;const pendingTimeout=!!this._findTimeout;if(this._findTimeout){clearTimeout(this._findTimeout);this._findTimeout=null;}if(!type){this._findTimeout=setTimeout(()=>{pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextMatch).call(this);this._findTimeout=null;},FIND_TIMEOUT);}else if(this._dirtyMatch){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextMatch).call(this);}else if(type==="again"){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextMatch).call(this);if(findbarClosed&&pdf_find_controller_classPrivateFieldGet(_state,this).highlightAll){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateAllPages).call(this);}}else if(type==="highlightallchange"){if(pendingTimeout){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextMatch).call(this);}else{this._highlightMatches=true;}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateAllPages).call(this);}else{pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextMatch).call(this);}});}function pdf_find_controller_reset(){this._highlightMatches=false;this._scrollMatches=false;this._pdfDocument=null;this._pageMatches=[];this._pageMatchesLength=[];pdf_find_controller_classPrivateFieldSet(_visitedPagesCount,this,0);pdf_find_controller_classPrivateFieldSet(_state,this,null);this._selected={pageIdx:-1,matchIdx:-1};this._offset={pageIdx:null,matchIdx:null,wrapped:false};this._extractTextPromises=[];this._pageContents=[];this._pageDiffs=[];this._hasDiacritics=[];this._matchesCountTotal=0;this._pagesToSearch=null;this._pendingFindMatches=new Set();this._resumePageIdx=null;this._dirtyMatch=false;clearTimeout(this._findTimeout);this._findTimeout=null;this._firstPageCapability=Promise.withResolvers();}function _get_query(_this){const{query}=pdf_find_controller_classPrivateFieldGet(_state,_this);if(typeof query==="string"){if(query!==_this._rawQuery){_this._rawQuery=query;[_this._normalizedQuery]=normalize(query);}return _this._normalizedQuery;}return(query||[]).filter(q=>!!q).map(q=>normalize(q)[0]);}function _shouldDirtyMatch(state){const newQuery=state.query,prevQuery=pdf_find_controller_classPrivateFieldGet(_state,this).query;const newType=typeof newQuery,prevType=typeof prevQuery;if(newType!==prevType){return true;}if(newType==="string"){if(newQuery!==prevQuery){return true;}}else if(JSON.stringify(newQuery)!==JSON.stringify(prevQuery)){return true;}switch(state.type){case"again":const pageNumber=this._selected.pageIdx+1;const linkService=this._linkService;return pageNumber>=1&&pageNumber<=linkService.pagesCount&&pageNumber!==linkService.page&&!(this.onIsPageVisible?.(pageNumber)??true);case"highlightallchange":return false;}return true;}function _isEntireWord(content,startIdx,length){let match=content.slice(0,startIdx).match(NOT_DIACRITIC_FROM_END_REG_EXP);if(match){const first=content.charCodeAt(startIdx);const limit=match[1].charCodeAt(0);if(getCharacterType(first)===getCharacterType(limit)){return false;}}match=content.slice(startIdx+length).match(NOT_DIACRITIC_FROM_START_REG_EXP);if(match){const last=content.charCodeAt(startIdx+length-1);const limit=match[1].charCodeAt(0);if(getCharacterType(last)===getCharacterType(limit)){return false;}}return true;}function _extractText(){if(this._extractTextPromises.length>0){return;}let deferred=Promise.resolve();const textOptions={disableNormalization:true};for(let i=0,ii=this._linkService.pagesCount;i<ii;i++){const{promise,resolve}=Promise.withResolvers();this._extractTextPromises[i]=promise;deferred=deferred.then(()=>{return this._pdfDocument.getPage(i+1).then(pdfPage=>pdfPage.getTextContent(textOptions)).then(textContent=>{const strBuf=[];for(const textItem of textContent.items){strBuf.push(textItem.str);if(textItem.hasEOL){strBuf.push("\n");}}[this._pageContents[i],this._pageDiffs[i],this._hasDiacritics[i]]=normalize(strBuf.join(""));resolve();},reason=>{console.error(`Unable to get text content for page ${i+1}`,reason);this._pageContents[i]="";this._pageDiffs[i]=null;this._hasDiacritics[i]=false;resolve();});});}}function _updatePage(index){if(this._scrollMatches&&this._selected.pageIdx===index){this._linkService.page=index+1;}this._eventBus.dispatch("updatetextlayermatches",{source:this,pageIndex:index});}function _updateAllPages(){this._eventBus.dispatch("updatetextlayermatches",{source:this,pageIndex:-1});}function _nextMatch(){const previous=pdf_find_controller_classPrivateFieldGet(_state,this).findPrevious;const currentPageIndex=this._linkService.page-1;const numPages=this._linkService.pagesCount;this._highlightMatches=true;if(this._dirtyMatch){this._dirtyMatch=false;this._selected.pageIdx=this._selected.matchIdx=-1;this._offset.pageIdx=currentPageIndex;this._offset.matchIdx=null;this._offset.wrapped=false;this._resumePageIdx=null;this._pageMatches.length=0;this._pageMatchesLength.length=0;pdf_find_controller_classPrivateFieldSet(_visitedPagesCount,this,0);this._matchesCountTotal=0;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateAllPages).call(this);for(let i=0;i<numPages;i++){if(this._pendingFindMatches.has(i)){continue;}this._pendingFindMatches.add(i);this._extractTextPromises[i].then(()=>{this._pendingFindMatches.delete(i);this._calculateMatch(i);});}}const query=_classPrivateGetter(_PDFFindController_brand,this,_get_query);if(query.length===0){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_updateUIState).call(this,FindState.FOUND);return;}if(this._resumePageIdx){return;}const offset=this._offset;this._pagesToSearch=numPages;if(offset.matchIdx!==null){const numPageMatches=this._pageMatches[offset.pageIdx].length;if(!previous&&offset.matchIdx+1<numPageMatches||previous&&offset.matchIdx>0){offset.matchIdx=previous?offset.matchIdx-1:offset.matchIdx+1;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateMatch).call(this,true);return;}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_advanceOffsetPage).call(this,previous);}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_nextPageMatch).call(this);}function _matchesReady(matches){const offset=this._offset;const numMatches=matches.length;const previous=pdf_find_controller_classPrivateFieldGet(_state,this).findPrevious;if(numMatches){offset.matchIdx=previous?numMatches-1:0;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateMatch).call(this,true);return true;}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_advanceOffsetPage).call(this,previous);if(offset.wrapped){offset.matchIdx=null;if(this._pagesToSearch<0){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateMatch).call(this,false);return true;}}return false;}function _nextPageMatch(){if(this._resumePageIdx!==null){console.error("There can only be one pending page.");}let matches=null;do{const pageIdx=this._offset.pageIdx;matches=this._pageMatches[pageIdx];if(!matches){this._resumePageIdx=pageIdx;break;}}while(!pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_matchesReady).call(this,matches));}function _advanceOffsetPage(previous){const offset=this._offset;const numPages=this._linkService.pagesCount;offset.pageIdx=previous?offset.pageIdx-1:offset.pageIdx+1;offset.matchIdx=null;this._pagesToSearch--;if(offset.pageIdx>=numPages||offset.pageIdx<0){offset.pageIdx=previous?numPages-1:0;offset.wrapped=true;}}function _updateMatch(){let found=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;let state=FindState.NOT_FOUND;const wrapped=this._offset.wrapped;this._offset.wrapped=false;if(found){const previousPage=this._selected.pageIdx;this._selected.pageIdx=this._offset.pageIdx;this._selected.matchIdx=this._offset.matchIdx;state=wrapped?FindState.WRAPPED:FindState.FOUND;if(previousPage!==-1&&previousPage!==this._selected.pageIdx){pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updatePage).call(this,previousPage);}}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_updateUIState).call(this,state,pdf_find_controller_classPrivateFieldGet(_state,this).findPrevious);if(this._selected.pageIdx!==-1){this._scrollMatches=true;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updatePage).call(this,this._selected.pageIdx);}}function _onFindBarClose(evt){const pdfDocument=this._pdfDocument;this._firstPageCapability.promise.then(()=>{if(!this._pdfDocument||pdfDocument&&this._pdfDocument!==pdfDocument){return;}if(this._findTimeout){clearTimeout(this._findTimeout);this._findTimeout=null;}if(this._resumePageIdx){this._resumePageIdx=null;this._dirtyMatch=true;}pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,pdf_find_controller_updateUIState).call(this,FindState.FOUND);this._highlightMatches=false;pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_updateAllPages).call(this);});}function _requestMatchesCount(){const{pageIdx,matchIdx}=this._selected;let current=0,total=this._matchesCountTotal;if(matchIdx!==-1){for(let i=0;i<pageIdx;i++){current+=this._pageMatches[i]?.length||0;}current+=matchIdx+1;}if(current<1||current>total){current=total=0;}return{current,total};}function _updateUIResultsCount(){this._eventBus.dispatch("updatefindmatchescount",{source:this,matchesCount:pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_requestMatchesCount).call(this)});}function pdf_find_controller_updateUIState(state){let previous=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(!pdf_find_controller_classPrivateFieldGet(_updateMatchesCountOnProgress,this)&&(pdf_find_controller_classPrivateFieldGet(_visitedPagesCount,this)!==this._linkService.pagesCount||state===FindState.PENDING)){return;}this._eventBus.dispatch("updatefindcontrolstate",{source:this,state,previous,matchesCount:pdf_find_controller_assertClassBrand(_PDFFindController_brand,this,_requestMatchesCount).call(this),rawQuery:pdf_find_controller_classPrivateFieldGet(_state,this)?.query??null});}
;// CONCATENATED MODULE: ./web/pdf_find_bar.js
function pdf_find_bar_classPrivateMethodInitSpec(e,a){pdf_find_bar_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_find_bar_classPrivateFieldInitSpec(e,t,a){pdf_find_bar_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_find_bar_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_find_bar_classPrivateFieldGet(s,a){return s.get(pdf_find_bar_assertClassBrand(s,a));}function pdf_find_bar_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const MATCHES_COUNT_LIMIT=1000;var _resizeObserver=/*#__PURE__*/new WeakMap();var _PDFFindBar_brand=/*#__PURE__*/new WeakSet();class PDFFindBar{constructor(options,eventBus){pdf_find_bar_classPrivateMethodInitSpec(this,_PDFFindBar_brand);pdf_find_bar_classPrivateFieldInitSpec(this,_resizeObserver,new ResizeObserver(pdf_find_bar_assertClassBrand(_PDFFindBar_brand,this,_resizeObserverCallback).bind(this)));this.opened=false;this.bar=options.bar;this.toggleButton=options.toggleButton;this.findField=options.findField;this.highlightAll=options.highlightAllCheckbox;this.currentPage=options.findCurrentPageCheckbox;this.pageRange=options.findPageRangeField;this.caseSensitive=options.caseSensitiveCheckbox;this.matchDiacritics=options.matchDiacriticsCheckbox;this.entireWord=options.entireWordCheckbox;this.findMsg=options.findMsg;this.findResultsCount=options.findResultsCount;this.findPreviousButton=options.findPreviousButton;this.findNextButton=options.findNextButton;this.eventBus=eventBus;this.toggleButton.addEventListener("click",()=>{this.toggle();});this.findField.addEventListener("input",()=>{this.dispatchEvent("");});this.bar.addEventListener("keydown",e=>{switch(e.keyCode){case 13:if(e.target===this.findField){this.dispatchEvent("again",e.shiftKey);}break;case 27:this.close();break;}});this.findPreviousButton.addEventListener("click",()=>{this.dispatchEvent("again",true);});this.findNextButton.addEventListener("click",()=>{this.dispatchEvent("again",false);});this.highlightAll.addEventListener("click",()=>{this.dispatchEvent("highlightallchange");});this.caseSensitive.addEventListener("click",()=>{this.dispatchEvent("casesensitivitychange");});this.entireWord.addEventListener("click",()=>{this.dispatchEvent("entirewordchange");});this.matchDiacritics?.addEventListener("click",()=>{this.dispatchEvent("diacriticmatchingchange");});}reset(){this.updateUIState();}dispatchEvent(type){let findPrev=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;this.eventBus.dispatch("find",{source:this,type,query:this.findField.value,caseSensitive:this.caseSensitive.checked,entireWord:this.entireWord.checked,highlightAll:this.highlightAll.checked,findPrevious:findPrev,matchDiacritics:this.matchDiacritics.checked});}updateUIState(state,previous,matchesCount){const{findField,findMsg}=this;let findMsgId="",status="";switch(state){case FindState.FOUND:break;case FindState.PENDING:status="pending";break;case FindState.NOT_FOUND:findMsgId="pdfjs-find-not-found";status="notFound";break;case FindState.WRAPPED:findMsgId=`pdfjs-find-reached-${previous?"top":"bottom"}`;break;}findField.setAttribute("data-status",status);findField.setAttribute("aria-invalid",state===FindState.NOT_FOUND);findMsg.setAttribute("data-status",status);if(findMsgId){findMsg.setAttribute("data-l10n-id",findMsgId);}else{findMsg.removeAttribute("data-l10n-id");findMsg.textContent="";}this.updateResultsCount(matchesCount);}updateResultsCount(){let{current=0,total=0}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};const{findResultsCount}=this;if(total>0){const limit=MATCHES_COUNT_LIMIT;findResultsCount.setAttribute("data-l10n-id",`pdfjs-find-match-count${total>limit?"-limit":""}`);findResultsCount.setAttribute("data-l10n-args",JSON.stringify({limit,current,total}));}else{findResultsCount.removeAttribute("data-l10n-id");findResultsCount.textContent="";}}open(){if(!this.opened){pdf_find_bar_classPrivateFieldGet(_resizeObserver,this).observe(this.bar.parentNode);pdf_find_bar_classPrivateFieldGet(_resizeObserver,this).observe(this.bar);this.opened=true;toggleExpandedBtn(this.toggleButton,true,this.bar);}this.findField.select();this.findField.focus();this.dispatchEvent("");this.eventBus.dispatch("findbaropen",{source:this});}close(){if(!this.opened){return;}pdf_find_bar_classPrivateFieldGet(_resizeObserver,this).disconnect();this.opened=false;toggleExpandedBtn(this.toggleButton,false,this.bar);this.eventBus.dispatch("findbarclose",{source:this});}toggle(){if(this.opened){this.close();}else{this.open();}}}function _resizeObserverCallback(entries){const{bar}=this;bar.classList.remove("wrapContainers");const findbarHeight=bar.clientHeight;const inputContainerHeight=bar.firstElementChild.clientHeight;if(findbarHeight>inputContainerHeight){bar.classList.add("wrapContainers");}}
;// CONCATENATED MODULE: ./web/pdf_history.js
function pdf_history_classPrivateMethodInitSpec(e,a){pdf_history_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_history_classPrivateFieldInitSpec(e,t,a){pdf_history_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_history_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_history_classPrivateFieldSet(s,a,r){return s.set(pdf_history_assertClassBrand(s,a),r),r;}function pdf_history_classPrivateFieldGet(s,a){return s.get(pdf_history_assertClassBrand(s,a));}function pdf_history_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const HASH_CHANGE_TIMEOUT=1000;const POSITION_UPDATED_THRESHOLD=50;const UPDATE_VIEWAREA_TIMEOUT=1000;function getCurrentHash(){return document.location.hash;}var _eventAbortController=/*#__PURE__*/new WeakMap();var _PDFHistory_brand=/*#__PURE__*/new WeakSet();class PDFHistory{constructor(_ref){let{linkService,eventBus}=_ref;pdf_history_classPrivateMethodInitSpec(this,_PDFHistory_brand);pdf_history_classPrivateFieldInitSpec(this,_eventAbortController,null);this.linkService=linkService;this.eventBus=eventBus;this._initialized=false;this._fingerprint="";this.reset();this.eventBus._on("pagesinit",()=>{this._isPagesLoaded=false;this.eventBus._on("pagesloaded",evt=>{this._isPagesLoaded=!!evt.pagesCount;},{once:true});});}initialize(_ref2){let{fingerprint,resetHistory=false,updateUrl=false}=_ref2;if(!fingerprint||typeof fingerprint!=="string"){globalThis.ngxConsole.error('PDFHistory.initialize: The "fingerprint" must be a non-empty string.');return;}if(this._initialized){this.reset();}const reInitialized=this._fingerprint!==""&&this._fingerprint!==fingerprint;this._fingerprint=fingerprint;this._updateUrl=updateUrl===true;this._initialized=true;pdf_history_assertClassBrand(_PDFHistory_brand,this,_bindEvents).call(this);const state=window.history.state;this._popStateInProgress=false;this._blockHashChange=0;this._currentHash=getCurrentHash();this._numPositionUpdates=0;this._uid=this._maxUid=0;this._destination=null;this._position=null;if(!pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidState).call(this,state,true)||resetHistory){const{hash,page,rotation}=pdf_history_assertClassBrand(_PDFHistory_brand,this,_parseCurrentHash).call(this,true);if(!hash||reInitialized||resetHistory){pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,null,true);return;}pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,{hash,page,rotation},true);return;}const destination=state.destination;pdf_history_assertClassBrand(_PDFHistory_brand,this,_updateInternalState).call(this,destination,state.uid,true);if(destination.rotation!==undefined){this._initialRotation=destination.rotation;}if(destination.dest){this._initialBookmark=JSON.stringify(destination.dest);this._destination.page=null;}else if(destination.hash){this._initialBookmark=destination.hash;}else if(destination.page){this._initialBookmark=`page=${destination.page}`;}}reset(){if(this._initialized){pdf_history_assertClassBrand(_PDFHistory_brand,this,_pageHide).call(this);this._initialized=false;pdf_history_assertClassBrand(_PDFHistory_brand,this,_unbindEvents).call(this);}if(this._updateViewareaTimeout){clearTimeout(this._updateViewareaTimeout);this._updateViewareaTimeout=null;}this._initialBookmark=null;this._initialRotation=null;}push(_ref3){let{namedDest=null,explicitDest,pageNumber}=_ref3;if(!this._initialized){return;}if(namedDest&&typeof namedDest!=="string"){globalThis.ngxConsole.error("PDFHistory.push: "+`"${namedDest}" is not a valid namedDest parameter.`);return;}else if(!Array.isArray(explicitDest)){globalThis.ngxConsole.error("PDFHistory.push: "+`"${explicitDest}" is not a valid explicitDest parameter.`);return;}else if(!pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidPage).call(this,pageNumber)){if(pageNumber!==null||this._destination){globalThis.ngxConsole.error("PDFHistory.push: "+`"${pageNumber}" is not a valid pageNumber parameter.`);return;}}const hash=namedDest||JSON.stringify(explicitDest);if(!hash){return;}let forceReplace=false;if(this._destination&&(isDestHashesEqual(this._destination.hash,hash)||isDestArraysEqual(this._destination.dest,explicitDest))){if(this._destination.page){return;}forceReplace=true;}if(this._popStateInProgress&&!forceReplace){return;}pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,{dest:explicitDest,hash,page:pageNumber,rotation:this.linkService.rotation},forceReplace);if(!this._popStateInProgress){this._popStateInProgress=true;Promise.resolve().then(()=>{this._popStateInProgress=false;});}}pushPage(pageNumber){if(!this._initialized){return;}if(!pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidPage).call(this,pageNumber)){globalThis.ngxConsole.error(`PDFHistory.pushPage: "${pageNumber}" is not a valid page number.`);return;}if(this._destination?.page===pageNumber){return;}if(this._popStateInProgress){return;}pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,{dest:null,hash:`page=${pageNumber}`,page:pageNumber,rotation:this.linkService.rotation});if(!this._popStateInProgress){this._popStateInProgress=true;Promise.resolve().then(()=>{this._popStateInProgress=false;});}}pushCurrentPosition(){if(!this._initialized||this._popStateInProgress){return;}pdf_history_assertClassBrand(_PDFHistory_brand,this,_tryPushCurrentPosition).call(this);}back(){if(!this._initialized||this._popStateInProgress){return;}const state=window.history.state;if(pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidState).call(this,state)&&state.uid>0){window.history.back();}}forward(){if(!this._initialized||this._popStateInProgress){return;}const state=window.history.state;if(pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidState).call(this,state)&&state.uid<this._maxUid){window.history.forward();}}get popStateInProgress(){return this._initialized&&(this._popStateInProgress||this._blockHashChange>0);}get initialBookmark(){return this._initialized?this._initialBookmark:null;}get initialRotation(){return this._initialized?this._initialRotation:null;}}function _pushOrReplaceState(destination){let forceReplace=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;const shouldReplace=forceReplace||!this._destination;const newState={fingerprint:this._fingerprint,uid:shouldReplace?this._uid:this._uid+1,destination};pdf_history_assertClassBrand(_PDFHistory_brand,this,_updateInternalState).call(this,destination,newState.uid);let newUrl;if(this._updateUrl&&destination?.hash){const baseUrl=document.location.href.split("#",1)[0];if(!baseUrl.startsWith("file://")){newUrl=`${baseUrl}#${destination.hash}`;}}if(shouldReplace){window.history.replaceState(newState,"",newUrl);}else{window.history.pushState(newState,"",newUrl);}}function _tryPushCurrentPosition(){let temporary=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(!this._position){return;}let position=this._position;if(temporary){position=Object.assign(Object.create(null),this._position);position.temporary=true;}if(!this._destination){pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,position);return;}if(this._destination.temporary){pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,position,true);return;}if(this._destination.hash===position.hash){return;}if(!this._destination.page&&(POSITION_UPDATED_THRESHOLD<=0||this._numPositionUpdates<=POSITION_UPDATED_THRESHOLD)){return;}let forceReplace=false;if(this._destination.page>=position.first&&this._destination.page<=position.page){if(this._destination.dest!==undefined||!this._destination.first){return;}forceReplace=true;}pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,position,forceReplace);}function _isValidPage(val){return Number.isInteger(val)&&val>0&&val<=this.linkService.pagesCount;}function _isValidState(state){let checkReload=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(!state){return false;}if(state.fingerprint!==this._fingerprint){if(checkReload){if(typeof state.fingerprint!=="string"||state.fingerprint.length!==this._fingerprint.length){return false;}const[perfEntry]=performance.getEntriesByType("navigation");if(perfEntry?.type!=="reload"){return false;}}else{return false;}}if(!Number.isInteger(state.uid)||state.uid<0){return false;}if(state.destination===null||typeof state.destination!=="object"){return false;}return true;}function _updateInternalState(destination,uid){let removeTemporary=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(this._updateViewareaTimeout){clearTimeout(this._updateViewareaTimeout);this._updateViewareaTimeout=null;}if(removeTemporary&&destination?.temporary){delete destination.temporary;}this._destination=destination;this._uid=uid;this._maxUid=Math.max(this._maxUid,uid);this._numPositionUpdates=0;}function _parseCurrentHash(){let checkNameddest=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;const hash=unescape(getCurrentHash()).substring(1);const params=parseQueryString(hash);const nameddest=params.get("nameddest")||"";let page=params.get("page")|0;if(!pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidPage).call(this,page)||checkNameddest&&nameddest.length>0){page=null;}return{hash,page,rotation:this.linkService.rotation};}function _updateViewarea(_ref4){let{location}=_ref4;if(this._updateViewareaTimeout){clearTimeout(this._updateViewareaTimeout);this._updateViewareaTimeout=null;}this._position={hash:location.pdfOpenParams.substring(1),page:this.linkService.page,first:location.pageNumber,rotation:location.rotation};if(this._popStateInProgress){return;}if(POSITION_UPDATED_THRESHOLD>0&&this._isPagesLoaded&&this._destination&&!this._destination.page){this._numPositionUpdates++;}if(UPDATE_VIEWAREA_TIMEOUT>0){this._updateViewareaTimeout=setTimeout(()=>{if(!this._popStateInProgress){pdf_history_assertClassBrand(_PDFHistory_brand,this,_tryPushCurrentPosition).call(this,true);}this._updateViewareaTimeout=null;},UPDATE_VIEWAREA_TIMEOUT);}}function _popState(_ref5){let{state}=_ref5;const newHash=getCurrentHash(),hashChanged=this._currentHash!==newHash;this._currentHash=newHash;if(!state){this._uid++;const{hash,page,rotation}=pdf_history_assertClassBrand(_PDFHistory_brand,this,_parseCurrentHash).call(this);pdf_history_assertClassBrand(_PDFHistory_brand,this,_pushOrReplaceState).call(this,{hash,page,rotation},true);return;}if(!pdf_history_assertClassBrand(_PDFHistory_brand,this,_isValidState).call(this,state)){return;}this._popStateInProgress=true;if(hashChanged){this._blockHashChange++;waitOnEventOrTimeout({target:window,name:"hashchange",delay:HASH_CHANGE_TIMEOUT}).then(()=>{this._blockHashChange--;});}const destination=state.destination;pdf_history_assertClassBrand(_PDFHistory_brand,this,_updateInternalState).call(this,destination,state.uid,true);if(isValidRotation(destination.rotation)){this.linkService.rotation=destination.rotation;}if(destination.dest){this.linkService.goToDestination(destination.dest);}else if(destination.hash){if(this.linkService.setHash){this.linkService.setHash(destination.hash);}}else if(destination.page){this.linkService.page=destination.page;}Promise.resolve().then(()=>{this._popStateInProgress=false;});}function _pageHide(){if(!this._destination||this._destination.temporary){pdf_history_assertClassBrand(_PDFHistory_brand,this,_tryPushCurrentPosition).call(this);}}function _bindEvents(){if(pdf_history_classPrivateFieldGet(_eventAbortController,this)){return;}pdf_history_classPrivateFieldSet(_eventAbortController,this,new AbortController());const{signal}=pdf_history_classPrivateFieldGet(_eventAbortController,this);this.eventBus._on("updateviewarea",pdf_history_assertClassBrand(_PDFHistory_brand,this,_updateViewarea).bind(this),{signal});window.addEventListener("popstate",pdf_history_assertClassBrand(_PDFHistory_brand,this,_popState).bind(this),{signal});window.addEventListener("pagehide",pdf_history_assertClassBrand(_PDFHistory_brand,this,_pageHide).bind(this),{signal});}function _unbindEvents(){pdf_history_classPrivateFieldGet(_eventAbortController,this)?.abort();pdf_history_classPrivateFieldSet(_eventAbortController,this,null);}function isDestHashesEqual(destHash,pushHash){if(typeof destHash!=="string"||typeof pushHash!=="string"){return false;}if(destHash===pushHash){return true;}const nameddest=parseQueryString(destHash).get("nameddest");if(nameddest===pushHash){return true;}return false;}function isDestArraysEqual(firstDest,secondDest){function isEntryEqual(first,second){if(typeof first!==typeof second){return false;}if(Array.isArray(first)||Array.isArray(second)){return false;}if(first!==null&&typeof first==="object"&&second!==null){if(Object.keys(first).length!==Object.keys(second).length){return false;}for(const key in first){if(!isEntryEqual(first[key],second[key])){return false;}}return true;}return first===second||Number.isNaN(first)&&Number.isNaN(second);}if(!(Array.isArray(firstDest)&&Array.isArray(secondDest))){return false;}if(firstDest.length!==secondDest.length){return false;}for(let i=0,ii=firstDest.length;i<ii;i++){if(!isEntryEqual(firstDest[i],secondDest[i])){return false;}}return true;}
;// CONCATENATED MODULE: ./web/pdf_layer_viewer.js
function pdf_layer_viewer_classPrivateMethodInitSpec(e,a){pdf_layer_viewer_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_layer_viewer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_layer_viewer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _PDFLayerViewer_brand=/*#__PURE__*/new WeakSet();class PDFLayerViewer extends BaseTreeViewer{constructor(options){super(options);pdf_layer_viewer_classPrivateMethodInitSpec(this,_PDFLayerViewer_brand);this.eventBus._on("optionalcontentconfigchanged",evt=>{pdf_layer_viewer_assertClassBrand(_PDFLayerViewer_brand,this,_updateLayers).call(this,evt.promise);});this.eventBus._on("resetlayers",()=>{pdf_layer_viewer_assertClassBrand(_PDFLayerViewer_brand,this,_updateLayers).call(this);});this.eventBus._on("togglelayerstree",this._toggleAllTreeItems.bind(this));}reset(){super.reset();this._optionalContentConfig=null;this._optionalContentHash=null;}_dispatchEvent(layersCount){this.eventBus.dispatch("layersloaded",{source:this,layersCount});}_bindLink(element,_ref){let{groupId,input}=_ref;const setVisibility=()=>{this._optionalContentConfig.setVisibility(groupId,input.checked);this._optionalContentHash=this._optionalContentConfig.getHash();this.eventBus.dispatch("optionalcontentconfig",{source:this,promise:Promise.resolve(this._optionalContentConfig)});};element.onclick=evt=>{if(evt.target===input){setVisibility();return true;}else if(evt.target!==element){return true;}input.checked=!input.checked;setVisibility();return false;};}async _setNestedName(element,_ref2){let{name=null}=_ref2;if(typeof name==="string"){element.textContent=this._normalizeTextContent(name);return;}element.textContent=await this._l10n.get("pdfjs-additional-layers");element.style.fontStyle="italic";}_addToggleButton(div,_ref3){let{name=null}=_ref3;super._addToggleButton(div,name===null);}_toggleAllTreeItems(){if(!this._optionalContentConfig){return;}super._toggleAllTreeItems();}render(_ref4){let{optionalContentConfig,pdfDocument}=_ref4;if(this._optionalContentConfig){this.reset();}this._optionalContentConfig=optionalContentConfig||null;this._pdfDocument=pdfDocument||null;const groups=optionalContentConfig?.getOrder();if(!groups){this._dispatchEvent(0);return;}this._optionalContentHash=optionalContentConfig.getHash();const fragment=document.createDocumentFragment(),queue=[{parent:fragment,groups}];let layersCount=0,hasAnyNesting=false;while(queue.length>0){const levelData=queue.shift();for(const groupId of levelData.groups){const div=document.createElement("div");div.className="treeItem";const element=document.createElement("a");div.append(element);if(typeof groupId==="object"){hasAnyNesting=true;this._addToggleButton(div,groupId);this._setNestedName(element,groupId);const itemsDiv=document.createElement("div");itemsDiv.className="treeItems";div.append(itemsDiv);queue.push({parent:itemsDiv,groups:groupId.order});}else{const group=optionalContentConfig.getGroup(groupId);const input=document.createElement("input");this._bindLink(element,{groupId,input});input.type="checkbox";input.checked=group.visible;const label=document.createElement("label");label.textContent=this._normalizeTextContent(group.name);label.append(input);element.append(label);layersCount++;}levelData.parent.append(div);}}this._finishRendering(fragment,layersCount,hasAnyNesting);}}async function _updateLayers(){let promise=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(!this._optionalContentConfig){return;}const pdfDocument=this._pdfDocument;const optionalContentConfig=await(promise||pdfDocument.getOptionalContentConfig({intent:"display"}));if(pdfDocument!==this._pdfDocument){return;}if(promise){if(optionalContentConfig.getHash()===this._optionalContentHash){return;}}else{this.eventBus.dispatch("optionalcontentconfig",{source:this,promise:Promise.resolve(optionalContentConfig)});}this.render({optionalContentConfig,pdfDocument:this._pdfDocument});}
;// CONCATENATED MODULE: ./web/pdf_outline_viewer.js
class PDFOutlineViewer extends BaseTreeViewer{constructor(options){super(options);this.linkService=options.linkService;this.downloadManager=options.downloadManager;this.eventBus._on("toggleoutlinetree",this._toggleAllTreeItems.bind(this));this.eventBus._on("currentoutlineitem",this._currentOutlineItem.bind(this));this.eventBus._on("pagechanging",evt=>{this._currentPageNumber=evt.pageNumber;});this.eventBus._on("pagesloaded",evt=>{this._isPagesLoaded=!!evt.pagesCount;this._currentOutlineItemCapability?.resolve(this._isPagesLoaded);});this.eventBus._on("sidebarviewchanged",evt=>{this._sidebarView=evt.view;});}reset(){super.reset();this._outline=null;this._pageNumberToDestHashCapability=null;this._currentPageNumber=1;this._isPagesLoaded=null;this._currentOutlineItemCapability?.resolve(false);this._currentOutlineItemCapability=null;}_dispatchEvent(outlineCount){this._currentOutlineItemCapability=Promise.withResolvers();if(outlineCount===0||this._pdfDocument?.loadingParams.disableAutoFetch){this._currentOutlineItemCapability.resolve(false);}else if(this._isPagesLoaded!==null){this._currentOutlineItemCapability.resolve(this._isPagesLoaded);}this.eventBus.dispatch("outlineloaded",{source:this,outlineCount,currentOutlineItemPromise:this._currentOutlineItemCapability.promise});}_bindLink(element,_ref){let{url,newWindow,action,attachment,dest,setOCGState}=_ref;const{linkService}=this;if(url){linkService.addLinkAttributes(element,url,newWindow);return;}if(action){element.href=linkService.getAnchorUrl("");element.onclick=()=>{linkService.executeNamedAction(action);return false;};return;}if(attachment){element.href=linkService.getAnchorUrl("");element.onclick=()=>{this.downloadManager.openOrDownloadData(attachment.content,attachment.filename);return false;};return;}if(setOCGState){element.href=linkService.getAnchorUrl("");element.onclick=()=>{linkService.executeSetOCGState(setOCGState);return false;};return;}element.href=linkService.getDestinationHash(dest);element.onclick=evt=>{this._updateCurrentTreeItem(evt.target.parentNode);if(dest){linkService.goToDestination(dest);}return false;};}_setStyles(element,_ref2){let{bold,italic}=_ref2;if(bold){element.style.fontWeight="bold";}if(italic){element.style.fontStyle="italic";}}_addToggleButton(div,_ref3){let{count,items}=_ref3;let hidden=false;if(count<0){let totalCount=items.length;if(totalCount>0){const queue=[...items];while(queue.length>0){const{count:nestedCount,items:nestedItems}=queue.shift();if(nestedCount>0&&nestedItems.length>0){totalCount+=nestedItems.length;queue.push(...nestedItems);}}}if(Math.abs(count)===totalCount){hidden=true;}}super._addToggleButton(div,hidden);}_toggleAllTreeItems(){if(!this._outline){return;}super._toggleAllTreeItems();}render(_ref4){let{outline,pdfDocument}=_ref4;if(this._outline){this.reset();}this._outline=outline||null;this._pdfDocument=pdfDocument||null;if(!outline){this._dispatchEvent(0);return;}const fragment=document.createDocumentFragment();const queue=[{parent:fragment,items:outline}];let outlineCount=0,hasAnyNesting=false;while(queue.length>0){const levelData=queue.shift();for(const item of levelData.items){const div=document.createElement("div");div.className="treeItem";const element=document.createElement("a");this._bindLink(element,item);this._setStyles(element,item);element.textContent=this._normalizeTextContent(item.title);div.append(element);if(item.items.length>0){hasAnyNesting=true;this._addToggleButton(div,item);const itemsDiv=document.createElement("div");itemsDiv.className="treeItems";div.append(itemsDiv);queue.push({parent:itemsDiv,items:item.items});}levelData.parent.append(div);outlineCount++;}}this._finishRendering(fragment,outlineCount,hasAnyNesting);}async _currentOutlineItem(){if(!this._isPagesLoaded){throw new Error("_currentOutlineItem: All pages have not been loaded.");}if(!this._outline||!this._pdfDocument){return;}const pageNumberToDestHash=await this._getPageNumberToDestHash(this._pdfDocument);if(!pageNumberToDestHash){return;}this._updateCurrentTreeItem(null);if(this._sidebarView!==SidebarView.OUTLINE){return;}for(let i=this._currentPageNumber;i>0;i--){const destHash=pageNumberToDestHash.get(i);if(!destHash){continue;}const linkElement=this.container.querySelector(`a[href="${destHash}"]`);if(!linkElement){continue;}this._scrollToCurrentTreeItem(linkElement.parentNode);break;}}async _getPageNumberToDestHash(pdfDocument){if(this._pageNumberToDestHashCapability){return this._pageNumberToDestHashCapability.promise;}this._pageNumberToDestHashCapability=Promise.withResolvers();const pageNumberToDestHash=new Map(),pageNumberNesting=new Map();const queue=[{nesting:0,items:this._outline}];while(queue.length>0){const levelData=queue.shift(),currentNesting=levelData.nesting;for(const{dest,items}of levelData.items){let explicitDest,pageNumber;if(typeof dest==="string"){explicitDest=await pdfDocument.getDestination(dest);if(pdfDocument!==this._pdfDocument){return null;}}else{explicitDest=dest;}if(Array.isArray(explicitDest)){const[destRef]=explicitDest;if(destRef&&typeof destRef==="object"){pageNumber=pdfDocument.cachedPageNumber(destRef);}else if(Number.isInteger(destRef)){pageNumber=destRef+1;}if(Number.isInteger(pageNumber)&&(!pageNumberToDestHash.has(pageNumber)||currentNesting>pageNumberNesting.get(pageNumber))){const destHash=this.linkService.getDestinationHash(dest);pageNumberToDestHash.set(pageNumber,destHash);pageNumberNesting.set(pageNumber,currentNesting);}}if(items.length>0){queue.push({nesting:currentNesting+1,items});}}}this._pageNumberToDestHashCapability.resolve(pageNumberToDestHash.size>0?pageNumberToDestHash:null);return this._pageNumberToDestHashCapability.promise;}}
;// CONCATENATED MODULE: ./web/pdf_presentation_mode.js
function pdf_presentation_mode_classPrivateMethodInitSpec(e,a){pdf_presentation_mode_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_presentation_mode_classPrivateFieldInitSpec(e,t,a){pdf_presentation_mode_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_presentation_mode_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_presentation_mode_classPrivateFieldGet(s,a){return s.get(pdf_presentation_mode_assertClassBrand(s,a));}function pdf_presentation_mode_classPrivateFieldSet(s,a,r){return s.set(pdf_presentation_mode_assertClassBrand(s,a),r),r;}function pdf_presentation_mode_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DELAY_BEFORE_HIDING_CONTROLS=3000;const ACTIVE_SELECTOR="pdfPresentationMode";const CONTROLS_SELECTOR="pdfPresentationModeControls";const MOUSE_SCROLL_COOLDOWN_TIME=50;const PAGE_SWITCH_THRESHOLD=0.1;const SWIPE_MIN_DISTANCE_THRESHOLD=50;const SWIPE_ANGLE_THRESHOLD=Math.PI/6;var pdf_presentation_mode_state=/*#__PURE__*/new WeakMap();var _args=/*#__PURE__*/new WeakMap();var _fullscreenChangeAbortController=/*#__PURE__*/new WeakMap();var _windowAbortController=/*#__PURE__*/new WeakMap();var _PDFPresentationMode_brand=/*#__PURE__*/new WeakSet();class PDFPresentationMode{constructor(_ref){let{container,pdfViewer,eventBus}=_ref;pdf_presentation_mode_classPrivateMethodInitSpec(this,_PDFPresentationMode_brand);pdf_presentation_mode_classPrivateFieldInitSpec(this,pdf_presentation_mode_state,PresentationModeState.UNKNOWN);pdf_presentation_mode_classPrivateFieldInitSpec(this,_args,null);pdf_presentation_mode_classPrivateFieldInitSpec(this,_fullscreenChangeAbortController,null);pdf_presentation_mode_classPrivateFieldInitSpec(this,_windowAbortController,null);this.container=container;this.pdfViewer=pdfViewer;this.eventBus=eventBus;this.contextMenuOpen=false;this.mouseScrollTimeStamp=0;this.mouseScrollDelta=0;this.touchSwipeState=null;}async request(){const{container,pdfViewer}=this;if(this.active||!pdfViewer.pagesCount||!container.requestFullscreen){return false;}pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_addFullscreenChangeListeners).call(this);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_notifyStateChange).call(this,PresentationModeState.CHANGING);const promise=container.requestFullscreen();pdf_presentation_mode_classPrivateFieldSet(_args,this,{pageNumber:pdfViewer.currentPageNumber,scaleValue:pdfViewer.currentScaleValue,scrollMode:pdfViewer.scrollMode,spreadMode:null,annotationEditorMode:null});if(pdfViewer.spreadMode!==SpreadMode.NONE&&!(pdfViewer.pageViewsReady&&pdfViewer.hasEqualPageSizes)){console.warn("Ignoring Spread modes when entering PresentationMode, "+"since the document may contain varying page sizes.");pdf_presentation_mode_classPrivateFieldGet(_args,this).spreadMode=pdfViewer.spreadMode;}if(pdfViewer.annotationEditorMode!==AnnotationEditorType.DISABLE){pdf_presentation_mode_classPrivateFieldGet(_args,this).annotationEditorMode=pdfViewer.annotationEditorMode;}try{await promise;pdfViewer.focus();return true;}catch{pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_removeFullscreenChangeListeners).call(this);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_notifyStateChange).call(this,PresentationModeState.NORMAL);}return false;}get active(){return pdf_presentation_mode_classPrivateFieldGet(pdf_presentation_mode_state,this)===PresentationModeState.CHANGING||pdf_presentation_mode_classPrivateFieldGet(pdf_presentation_mode_state,this)===PresentationModeState.FULLSCREEN;}_prepareFullscreenMode(){const domElement=document.getElementsByClassName("zoom")[0].parentElement;const parent=domElement.parentElement;this.ngxContainer=parent;for(let i=0;i<parent.childElementCount;i++){if(parent.children.item(i)===domElement){this.ngxContainerIndex=i;}}parent.removeChild(domElement);document.body.append(domElement);const siblings=document.body.children;for(let i=0;i<siblings.length;i++){const s=siblings.item(i);if(s!==domElement&&s instanceof HTMLElement){s.classList.add("hidden-by-fullscreen");}}document.getElementById("sidebarContainer").classList.add("hidden-by-fullscreen");document.getElementsByClassName("toolbar")[0].classList.add("hidden-by-fullscreen");}_tidyUpFullscreenMode(){if(this.ngxContainer){const domElement=document.getElementsByClassName("zoom")[0].parentElement;document.body.removeChild(domElement);if(this.ngxContainerIndex>=this.ngxContainer.childElementCount){this.ngxContainer.append(domElement);}else{this.ngxContainer.insertBefore(domElement,this.ngxContainer.children.item(this.ngxContainerIndex));}this.ngxContainer=undefined;const siblings=document.body.children;for(let i=0;i<siblings.length;i++){const s=siblings.item(i);if(s!==domElement&&s instanceof HTMLElement){if(s.classList.contains("hidden-by-fullscreen")){s.classList.remove("hidden-by-fullscreen");}}}document.getElementById("sidebarContainer").classList.remove("hidden-by-fullscreen");document.getElementsByClassName("toolbar")[0].classList.remove("hidden-by-fullscreen");}}}function _mouseWheel(evt){if(!this.active){return;}evt.preventDefault();const delta=normalizeWheelEventDelta(evt);const currentTime=Date.now();const storedTime=this.mouseScrollTimeStamp;if(currentTime>storedTime&&currentTime-storedTime<MOUSE_SCROLL_COOLDOWN_TIME){return;}if(this.mouseScrollDelta>0&&delta<0||this.mouseScrollDelta<0&&delta>0){pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_resetMouseScrollState).call(this);}this.mouseScrollDelta+=delta;if(Math.abs(this.mouseScrollDelta)>=PAGE_SWITCH_THRESHOLD){const totalDelta=this.mouseScrollDelta;pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_resetMouseScrollState).call(this);const success=totalDelta>0?this.pdfViewer.previousPage():this.pdfViewer.nextPage();if(success){this.mouseScrollTimeStamp=currentTime;}}}function _notifyStateChange(state){pdf_presentation_mode_classPrivateFieldSet(pdf_presentation_mode_state,this,state);this.eventBus.dispatch("presentationmodechanged",{source:this,state});}function _enter(){pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_notifyStateChange).call(this,PresentationModeState.FULLSCREEN);this.container.classList.add(ACTIVE_SELECTOR);setTimeout(()=>{this.pdfViewer.scrollMode=ScrollMode.PAGE;if(pdf_presentation_mode_classPrivateFieldGet(_args,this).spreadMode!==null){this.pdfViewer.spreadMode=SpreadMode.NONE;}this.pdfViewer.currentPageNumber=pdf_presentation_mode_classPrivateFieldGet(_args,this).pageNumber;this.pdfViewer.currentScaleValue="page-fit";if(pdf_presentation_mode_classPrivateFieldGet(_args,this).annotationEditorMode!==null){this.pdfViewer.annotationEditorMode={mode:AnnotationEditorType.NONE};}},0);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_addWindowListeners).call(this);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_showControls).call(this);this.contextMenuOpen=false;document.getSelection().empty();}function _exit(){const pageNumber=this.pdfViewer.currentPageNumber;this.container.classList.remove(ACTIVE_SELECTOR);setTimeout(()=>{pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_removeFullscreenChangeListeners).call(this);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_notifyStateChange).call(this,PresentationModeState.NORMAL);this.pdfViewer.scrollMode=pdf_presentation_mode_classPrivateFieldGet(_args,this).scrollMode;if(pdf_presentation_mode_classPrivateFieldGet(_args,this).spreadMode!==null){this.pdfViewer.spreadMode=pdf_presentation_mode_classPrivateFieldGet(_args,this).spreadMode;}this.pdfViewer.currentScaleValue=pdf_presentation_mode_classPrivateFieldGet(_args,this).scaleValue;this.pdfViewer.currentPageNumber=pageNumber;if(pdf_presentation_mode_classPrivateFieldGet(_args,this).annotationEditorMode!==null){this.pdfViewer.annotationEditorMode={mode:pdf_presentation_mode_classPrivateFieldGet(_args,this).annotationEditorMode};}pdf_presentation_mode_classPrivateFieldSet(_args,this,null);},0);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_removeWindowListeners).call(this);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_hideControls).call(this);pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_resetMouseScrollState).call(this);this.contextMenuOpen=false;}function _mouseDown(evt){if(this.contextMenuOpen){this.contextMenuOpen=false;evt.preventDefault();return;}if(evt.button!==0){return;}if(evt.target.href&&evt.target.parentNode?.hasAttribute("data-internal-link")){return;}evt.preventDefault();if(evt.shiftKey){this.pdfViewer.previousPage();}else{this.pdfViewer.nextPage();}}function _contextMenu(){this.contextMenuOpen=true;}function _showControls(){if(this.controlsTimeout){clearTimeout(this.controlsTimeout);}else{this.container.classList.add(CONTROLS_SELECTOR);}this.controlsTimeout=setTimeout(()=>{this.container.classList.remove(CONTROLS_SELECTOR);delete this.controlsTimeout;},DELAY_BEFORE_HIDING_CONTROLS);}function _hideControls(){if(!this.controlsTimeout){return;}clearTimeout(this.controlsTimeout);this.container.classList.remove(CONTROLS_SELECTOR);delete this.controlsTimeout;}function _resetMouseScrollState(){this.mouseScrollTimeStamp=0;this.mouseScrollDelta=0;}function _touchSwipe(evt){if(!this.active){return;}if(evt.touches.length>1){this.touchSwipeState=null;return;}switch(evt.type){case"touchstart":this.touchSwipeState={startX:evt.touches[0].pageX,startY:evt.touches[0].pageY,endX:evt.touches[0].pageX,endY:evt.touches[0].pageY};break;case"touchmove":if(this.touchSwipeState===null){return;}this.touchSwipeState.endX=evt.touches[0].pageX;this.touchSwipeState.endY=evt.touches[0].pageY;evt.preventDefault();break;case"touchend":if(this.touchSwipeState===null){return;}let delta=0;const dx=this.touchSwipeState.endX-this.touchSwipeState.startX;const dy=this.touchSwipeState.endY-this.touchSwipeState.startY;const absAngle=Math.abs(Math.atan2(dy,dx));if(Math.abs(dx)>SWIPE_MIN_DISTANCE_THRESHOLD&&(absAngle<=SWIPE_ANGLE_THRESHOLD||absAngle>=Math.PI-SWIPE_ANGLE_THRESHOLD)){delta=dx;}else if(Math.abs(dy)>SWIPE_MIN_DISTANCE_THRESHOLD&&Math.abs(absAngle-Math.PI/2)<=SWIPE_ANGLE_THRESHOLD){delta=dy;}if(delta>0){this.pdfViewer.previousPage();}else if(delta<0){this.pdfViewer.nextPage();}break;}}function _addWindowListeners(){if(pdf_presentation_mode_classPrivateFieldGet(_windowAbortController,this)){return;}pdf_presentation_mode_classPrivateFieldSet(_windowAbortController,this,new AbortController());const{signal}=pdf_presentation_mode_classPrivateFieldGet(_windowAbortController,this);const touchSwipeBind=pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_touchSwipe).bind(this);window.addEventListener("mousemove",pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_showControls).bind(this),{signal});window.addEventListener("mousedown",pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_mouseDown).bind(this),{signal});window.addEventListener("wheel",pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_mouseWheel).bind(this),{passive:false,signal});window.addEventListener("keydown",pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_resetMouseScrollState).bind(this),{signal});window.addEventListener("contextmenu",pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_contextMenu).bind(this),{signal});window.addEventListener("touchstart",touchSwipeBind,{signal});window.addEventListener("touchmove",touchSwipeBind,{signal});window.addEventListener("touchend",touchSwipeBind,{signal});}function _removeWindowListeners(){pdf_presentation_mode_classPrivateFieldGet(_windowAbortController,this)?.abort();pdf_presentation_mode_classPrivateFieldSet(_windowAbortController,this,null);}function _addFullscreenChangeListeners(){if(pdf_presentation_mode_classPrivateFieldGet(_fullscreenChangeAbortController,this)){return;}pdf_presentation_mode_classPrivateFieldSet(_fullscreenChangeAbortController,this,new AbortController());window.addEventListener("fullscreenchange",()=>{if(document.fullscreenElement){pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_enter).call(this);}else{pdf_presentation_mode_assertClassBrand(_PDFPresentationMode_brand,this,_exit).call(this);}},{signal:pdf_presentation_mode_classPrivateFieldGet(_fullscreenChangeAbortController,this).signal});}function _removeFullscreenChangeListeners(){pdf_presentation_mode_classPrivateFieldGet(_fullscreenChangeAbortController,this)?.abort();pdf_presentation_mode_classPrivateFieldSet(_fullscreenChangeAbortController,this,null);}
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.every.js
var esnext_iterator_every = __webpack_require__(3215);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.self.js
var web_self = __webpack_require__(3611);
;// CONCATENATED MODULE: ./node_modules/canvas-size/dist/canvas-size.esm.js
function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_x,_r,_arr=[],_n=!0,_d=!1;try{if(_x=(_i=_i.call(arr)).next,0===i){if(Object(_i)!==_i)return;_n=!1;}else for(;!(_n=(_s=_x.call(_i)).done)&&(_arr.push(_s.value),_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err;}finally{try{if(!_n&&null!=_i.return&&(_r=_i.return(),Object(_r)!==_r))return;}finally{if(_d)throw _e;}}return _arr;}}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;})),keys.push.apply(keys,symbols);}return keys;}function _objectSpread2(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){canvas_size_esm_defineProperty(target,key,source[key]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}return target;}function canvas_size_esm_defineProperty(obj,key,value){key=canvas_size_esm_toPropertyKey(key);if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}function _objectWithoutPropertiesLoose(source,excluded){if(source==null)return{};var target={};var sourceKeys=Object.keys(source);var key,i;for(i=0;i<sourceKeys.length;i++){key=sourceKeys[i];if(excluded.indexOf(key)>=0)continue;target[key]=source[key];}return target;}function _objectWithoutProperties(source,excluded){if(source==null)return{};var target=_objectWithoutPropertiesLoose(source,excluded);var key,i;if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++){key=sourceSymbolKeys[i];if(excluded.indexOf(key)>=0)continue;if(!Object.prototype.propertyIsEnumerable.call(source,key))continue;target[key]=source[key];}}return target;}function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_unsupportedIterableToArray(arr,i)||_nonIterableRest();}function _toConsumableArray(arr){return _arrayWithoutHoles(arr)||_iterableToArray(arr)||_unsupportedIterableToArray(arr)||_nonIterableSpread();}function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr);}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr;}function _iterableToArray(iter){if(typeof Symbol!=="undefined"&&iter[Symbol.iterator]!=null||iter["@@iterator"]!=null)return Array.from(iter);}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen);}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2;}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function canvas_size_esm_toPrimitive(input,hint){if(typeof input!=="object"||input===null)return input;var prim=input[Symbol.toPrimitive];if(prim!==undefined){var res=prim.call(input,hint||"default");if(typeof res!=="object")return res;throw new TypeError("@@toPrimitive must return a primitive value.");}return(hint==="string"?String:Number)(input);}function canvas_size_esm_toPropertyKey(arg){var key=canvas_size_esm_toPrimitive(arg,"string");return typeof key==="symbol"?key:String(key);}function canvasTest(settings){var size=settings.sizes.shift();var width=Math.max(Math.ceil(size[0]),1);var height=Math.max(Math.ceil(size[1]),1);var fill=[width-1,height-1,1,1];var job=Date.now();var isWorker=typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope;var cropCvs,testCvs;if(isWorker){cropCvs=new OffscreenCanvas(1,1);testCvs=new OffscreenCanvas(width,height);}else{cropCvs=document.createElement("canvas");cropCvs.width=1;cropCvs.height=1;testCvs=document.createElement("canvas");testCvs.width=width;testCvs.height=height;}var cropCtx=cropCvs.getContext("2d");var testCtx=testCvs.getContext("2d");if(testCtx){testCtx.fillRect.apply(testCtx,fill);cropCtx.drawImage(testCvs,width-1,height-1,1,1,0,0,1,1);}var isTestPass=cropCtx&&cropCtx.getImageData(0,0,1,1).data[3]!==0;var benchmark=Date.now()-job;[cropCvs,testCvs].forEach(function(cvs){cvs.height=0;cvs.width=0;});if(isWorker){postMessage({width:width,height:height,benchmark:benchmark,isTestPass:isTestPass});if(!isTestPass&&settings.sizes.length){canvasTest(settings);}}else if(isTestPass){settings.onSuccess(width,height,benchmark);}else{settings.onError(width,height,benchmark);if(settings.sizes.length){canvasTest(settings);}}return isTestPass;}var testSizes={area:[16384,14188,11402,11180,10836,8192,4096,1],height:[8388607,65535,32767,16384,8192,4096,1],width:[4194303,65535,32767,16384,8192,4096,1]};var _excluded=["onError","onSuccess"];var defaults={max:null,min:1,sizes:[],step:1024,usePromise:false,useWorker:false,onError:Function.prototype,onSuccess:Function.prototype};var workerJobs={};function createSizesArray(settings){var isArea=settings.width===settings.height;var isWidth=settings.height===1;var isHeight=settings.width===1;var sizes=[];if(!settings.width||!settings.height){settings.sizes.forEach(function(testSize){var width=isArea||isWidth?testSize:1;var height=isArea||isHeight?testSize:1;sizes.push([width,height]);});}else{var testMin=settings.min||defaults.min;var testStep=settings.step||defaults.step;var testSize=Math.max(settings.width,settings.height);while(testSize>=testMin){var width=isArea||isWidth?testSize:1;var height=isArea||isHeight?testSize:1;sizes.push([width,height]);testSize-=testStep;}}return sizes;}function handleMethod(settings){var hasCanvasSupport=window&&"HTMLCanvasElement"in window;var hasOffscreenCanvasSupport=window&&"OffscreenCanvas"in window;var jobID=Date.now();var _onError=settings.onError,_onSuccess=settings.onSuccess,settingsWithoutCallbacks=_objectWithoutProperties(settings,_excluded);var worker=null;if(!hasCanvasSupport){return false;}if(settings.useWorker&&hasOffscreenCanvasSupport){var js="\n            var canvasTest = ".concat(canvasTest.toString(),";\n            onmessage = function(e) {\n                canvasTest(e.data);\n            };\n        ");var blob=new Blob([js],{type:"application/javascript"});var blobURL=URL.createObjectURL(blob);worker=new Worker(blobURL);URL.revokeObjectURL(blobURL);worker.onmessage=function(e){var _e$data=e.data,width=_e$data.width,height=_e$data.height,benchmark=_e$data.benchmark,isTestPass=_e$data.isTestPass;if(isTestPass){workerJobs[jobID].onSuccess(width,height,benchmark);delete workerJobs[jobID];}else{workerJobs[jobID].onError(width,height,benchmark);}};}if(settings.usePromise){return new Promise(function(resolve,reject){var promiseSettings=_objectSpread2(_objectSpread2({},settings),{},{onError:function onError(width,height,benchmark){var isLastTest;if(settings.sizes.length===0){isLastTest=true;}else{var _settings$sizes$slice=settings.sizes.slice(-1),_settings$sizes$slice2=_slicedToArray(_settings$sizes$slice,1),_settings$sizes$slice3=_slicedToArray(_settings$sizes$slice2[0],2),lastWidth=_settings$sizes$slice3[0],lastHeight=_settings$sizes$slice3[1];isLastTest=width===lastWidth&&height===lastHeight;}_onError(width,height,benchmark);if(isLastTest){reject({width:width,height:height,benchmark:benchmark});}},onSuccess:function onSuccess(width,height,benchmark){_onSuccess(width,height,benchmark);resolve({width:width,height:height,benchmark:benchmark});}});if(worker){var onError=promiseSettings.onError,onSuccess=promiseSettings.onSuccess;workerJobs[jobID]={onError:onError,onSuccess:onSuccess};worker.postMessage(settingsWithoutCallbacks);}else{canvasTest(promiseSettings);}});}else{if(worker){workerJobs[jobID]={onError:_onError,onSuccess:_onSuccess};worker.postMessage(settingsWithoutCallbacks);}else{return canvasTest(settings);}}}var canvasSize={maxArea:function maxArea(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var sizes=createSizesArray({width:options.max,height:options.max,min:options.min,step:options.step,sizes:_toConsumableArray(testSizes.area)});var settings=_objectSpread2(_objectSpread2(_objectSpread2({},defaults),options),{},{sizes:sizes});return handleMethod(settings);},maxHeight:function maxHeight(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var sizes=createSizesArray({width:1,height:options.max,min:options.min,step:options.step,sizes:_toConsumableArray(testSizes.height)});var settings=_objectSpread2(_objectSpread2(_objectSpread2({},defaults),options),{},{sizes:sizes});return handleMethod(settings);},maxWidth:function maxWidth(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var sizes=createSizesArray({width:options.max,height:1,min:options.min,step:options.step,sizes:_toConsumableArray(testSizes.width)});var settings=_objectSpread2(_objectSpread2(_objectSpread2({},defaults),options),{},{sizes:sizes});return handleMethod(settings);},test:function test(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var settings=_objectSpread2(_objectSpread2({},defaults),options);settings.sizes=_toConsumableArray(settings.sizes);if(settings.width&&settings.height){settings.sizes=[[settings.width,settings.height]];}return handleMethod(settings);}};
;// CONCATENATED MODULE: ./web/xfa_layer_builder.js
class XfaLayerBuilder{constructor(_ref){let{pdfPage,annotationStorage=null,linkService,xfaHtml=null}=_ref;this.pdfPage=pdfPage;this.annotationStorage=annotationStorage;this.linkService=linkService;this.xfaHtml=xfaHtml;this.div=null;this._cancelled=false;}async render(viewport){let intent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"display";if(intent==="print"){const parameters={viewport:viewport.clone({dontFlip:true}),div:this.div,xfaHtml:this.xfaHtml,annotationStorage:this.annotationStorage,linkService:this.linkService,intent};this.div=document.createElement("div");parameters.div=this.div;return XfaLayer.render(parameters);}const xfaHtml=await this.pdfPage.getXfa();if(this._cancelled||!xfaHtml){return{textDivs:[]};}const parameters={viewport:viewport.clone({dontFlip:true}),div:this.div,xfaHtml,annotationStorage:this.annotationStorage,linkService:this.linkService,intent};if(this.div){return XfaLayer.update(parameters);}this.div=document.createElement("div");parameters.div=this.div;return XfaLayer.render(parameters);}cancel(){this._cancelled=true;}hide(){if(!this.div){return;}this.div.hidden=true;}}
;// CONCATENATED MODULE: ./web/print_utils.js
function getXfaHtmlForPrinting(printContainer,pdfDocument){const xfaHtml=pdfDocument.allXfaHtml;const linkService=new SimpleLinkService();const scale=Math.round(PixelsPerInch.PDF_TO_CSS_UNITS*100)/100;for(const xfaPage of xfaHtml.children){const page=document.createElement("div");page.className="xfaPrintedPage";printContainer.append(page);const builder=new XfaLayerBuilder({pdfPage:null,annotationStorage:pdfDocument.annotationStorage,linkService,xfaHtml:xfaPage});const viewport=getXfaPageViewport(xfaPage,{scale});builder.render(viewport,"print");page.append(builder.div);}}
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
;// CONCATENATED MODULE: ./src/shared/util.js
var _Util;function util_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const isNodeJS=typeof process==="object"&&process+""==="[object process]"&&!process.versions.nw&&!(process.versions.electron&&process.type&&process.type!=="browser");const IDENTITY_MATRIX=(/* unused pure expression or super */ null && ([1,0,0,1,0,0]));const FONT_IDENTITY_MATRIX=(/* unused pure expression or super */ null && ([0.001,0,0,0.001,0,0]));const MAX_IMAGE_SIZE_TO_CACHE=10e6;const LINE_FACTOR=1.35;const LINE_DESCENT_FACTOR=0.35;const BASELINE_FACTOR=LINE_DESCENT_FACTOR/LINE_FACTOR;const RenderingIntentFlag={ANY:0x01,DISPLAY:0x02,PRINT:0x04,SAVE:0x08,ANNOTATIONS_FORMS:0x10,ANNOTATIONS_STORAGE:0x20,ANNOTATIONS_DISABLE:0x40,OPLIST:0x100};const util_AnnotationMode={DISABLE:0,ENABLE:1,ENABLE_FORMS:2,ENABLE_STORAGE:3};const AnnotationEditorPrefix="pdfjs_internal_editor_";const util_AnnotationEditorType={DISABLE:-1,NONE:0,FREETEXT:3,HIGHLIGHT:9,STAMP:13,INK:15};const util_AnnotationEditorParamsType={RESIZE:1,CREATE:2,FREETEXT_SIZE:11,FREETEXT_COLOR:12,FREETEXT_OPACITY:13,INK_COLOR:21,INK_THICKNESS:22,INK_OPACITY:23,HIGHLIGHT_COLOR:31,HIGHLIGHT_DEFAULT_COLOR:32,HIGHLIGHT_THICKNESS:33,HIGHLIGHT_FREE:34,HIGHLIGHT_SHOW_ALL:35};const util_PermissionFlag={PRINT:0x04,MODIFY_CONTENTS:0x08,COPY:0x10,MODIFY_ANNOTATIONS:0x20,FILL_INTERACTIVE_FORMS:0x100,COPY_FOR_ACCESSIBILITY:0x200,ASSEMBLE:0x400,PRINT_HIGH_QUALITY:0x800};const TextRenderingMode={FILL:0,STROKE:1,FILL_STROKE:2,INVISIBLE:3,FILL_ADD_TO_PATH:4,STROKE_ADD_TO_PATH:5,FILL_STROKE_ADD_TO_PATH:6,ADD_TO_PATH:7,FILL_STROKE_MASK:3,ADD_TO_PATH_FLAG:4};const util_ImageKind={GRAYSCALE_1BPP:1,RGB_24BPP:2,RGBA_32BPP:3};const AnnotationType={TEXT:1,LINK:2,FREETEXT:3,LINE:4,SQUARE:5,CIRCLE:6,POLYGON:7,POLYLINE:8,HIGHLIGHT:9,UNDERLINE:10,SQUIGGLY:11,STRIKEOUT:12,STAMP:13,CARET:14,INK:15,POPUP:16,FILEATTACHMENT:17,SOUND:18,MOVIE:19,WIDGET:20,SCREEN:21,PRINTERMARK:22,TRAPNET:23,WATERMARK:24,THREED:25,REDACT:26};const AnnotationReplyType={GROUP:"Group",REPLY:"R"};const AnnotationFlag={INVISIBLE:0x01,HIDDEN:0x02,PRINT:0x04,NOZOOM:0x08,NOROTATE:0x10,NOVIEW:0x20,READONLY:0x40,LOCKED:0x80,TOGGLENOVIEW:0x100,LOCKEDCONTENTS:0x200};const AnnotationFieldFlag={READONLY:0x0000001,REQUIRED:0x0000002,NOEXPORT:0x0000004,MULTILINE:0x0001000,PASSWORD:0x0002000,NOTOGGLETOOFF:0x0004000,RADIO:0x0008000,PUSHBUTTON:0x0010000,COMBO:0x0020000,EDIT:0x0040000,SORT:0x0080000,FILESELECT:0x0100000,MULTISELECT:0x0200000,DONOTSPELLCHECK:0x0400000,DONOTSCROLL:0x0800000,COMB:0x1000000,RICHTEXT:0x2000000,RADIOSINUNISON:0x2000000,COMMITONSELCHANGE:0x4000000};const AnnotationBorderStyleType={SOLID:1,DASHED:2,BEVELED:3,INSET:4,UNDERLINE:5};const AnnotationActionEventType={E:"Mouse Enter",X:"Mouse Exit",D:"Mouse Down",U:"Mouse Up",Fo:"Focus",Bl:"Blur",PO:"PageOpen",PC:"PageClose",PV:"PageVisible",PI:"PageInvisible",K:"Keystroke",F:"Format",V:"Validate",C:"Calculate"};const DocumentActionEventType={WC:"WillClose",WS:"WillSave",DS:"DidSave",WP:"WillPrint",DP:"DidPrint"};const PageActionEventType={O:"PageOpen",C:"PageClose"};const util_VerbosityLevel={ERRORS:0,WARNINGS:1,INFOS:5};const util_CMapCompressionType={NONE:0,BINARY:1};const util_OPS={dependency:1,setLineWidth:2,setLineCap:3,setLineJoin:4,setMiterLimit:5,setDash:6,setRenderingIntent:7,setFlatness:8,setGState:9,save:10,restore:11,transform:12,moveTo:13,lineTo:14,curveTo:15,curveTo2:16,curveTo3:17,closePath:18,rectangle:19,stroke:20,closeStroke:21,fill:22,eoFill:23,fillStroke:24,eoFillStroke:25,closeFillStroke:26,closeEOFillStroke:27,endPath:28,clip:29,eoClip:30,beginText:31,endText:32,setCharSpacing:33,setWordSpacing:34,setHScale:35,setLeading:36,setFont:37,setTextRenderingMode:38,setTextRise:39,moveText:40,setLeadingMoveText:41,setTextMatrix:42,nextLine:43,showText:44,showSpacedText:45,nextLineShowText:46,nextLineSetSpacingShowText:47,setCharWidth:48,setCharWidthAndBounds:49,setStrokeColorSpace:50,setFillColorSpace:51,setStrokeColor:52,setStrokeColorN:53,setFillColor:54,setFillColorN:55,setStrokeGray:56,setFillGray:57,setStrokeRGBColor:58,setFillRGBColor:59,setStrokeCMYKColor:60,setFillCMYKColor:61,shadingFill:62,beginInlineImage:63,beginImageData:64,endInlineImage:65,paintXObject:66,markPoint:67,markPointProps:68,beginMarkedContent:69,beginMarkedContentProps:70,endMarkedContent:71,beginCompat:72,endCompat:73,paintFormXObjectBegin:74,paintFormXObjectEnd:75,beginGroup:76,endGroup:77,beginAnnotation:80,endAnnotation:81,paintImageMaskXObject:83,paintImageMaskXObjectGroup:84,paintImageXObject:85,paintInlineImageXObject:86,paintInlineImageXObjectGroup:87,paintImageXObjectRepeat:88,paintImageMaskXObjectRepeat:89,paintSolidColorImageMask:90,constructPath:91};const util_PasswordResponses={NEED_PASSWORD:1,INCORRECT_PASSWORD:2};let verbosity=util_VerbosityLevel.WARNINGS;function setVerbosityLevel(level){if(Number.isInteger(level)){verbosity=level;}}function getVerbosityLevel(){return verbosity;}function info(msg){if(verbosity>=util_VerbosityLevel.INFOS){if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope){console.log(`Info: ${msg}`);}else if(Window&&globalThis.ngxConsole){globalThis.ngxConsole.log(`Info: ${msg}`);}else{console.log(`Info: ${msg}`);}}}function warn(msg){if(verbosity>=util_VerbosityLevel.WARNINGS){if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope){console.log(`Warning: ${msg}`);}else if(Window&&globalThis.ngxConsole){globalThis.ngxConsole.log(`Warning: ${msg}`);}else{console.log(`Warning: ${msg}`);}}}function unreachable(msg){throw new Error(msg);}function assert(cond,msg){if(!cond){unreachable(msg);}}function _isValidProtocol(url){switch(url?.protocol){case"http:":case"https:":case"ftp:":case"mailto:":case"tel:":case"capacitor":return true;default:return false;}}function util_createValidAbsoluteUrl(url){let baseUrl=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;if(!url){return null;}try{if(options&&typeof url==="string"){if(options.addDefaultProtocol&&url.startsWith("www.")){const dots=url.match(/\./g);if(dots?.length>=2){url=`http://${url}`;}}if(options.tryConvertEncoding){try{url=stringToUTF8String(url);}catch{}}}const absoluteUrl=baseUrl?new URL(url,baseUrl):new URL(url);if(_isValidProtocol(absoluteUrl)){return absoluteUrl;}}catch{}return null;}function util_shadow(obj,prop,value){let nonSerializable=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;Object.defineProperty(obj,prop,{value,enumerable:!nonSerializable,configurable:true,writable:false});return value;}const BaseException=function BaseExceptionClosure(){function BaseException(message,name){if(this.constructor===BaseException){unreachable("Cannot initialize BaseException.");}this.message=message;this.name=name;}BaseException.prototype=new Error();BaseException.constructor=BaseException;return BaseException;}();class PasswordException extends BaseException{constructor(msg,code){super(msg,"PasswordException");this.code=code;}}class UnknownErrorException extends BaseException{constructor(msg,details){super(msg,"UnknownErrorException");this.details=details;}}class util_InvalidPDFException extends BaseException{constructor(msg){super(msg,"InvalidPDFException");}}class util_MissingPDFException extends BaseException{constructor(msg){super(msg,"MissingPDFException");}}class util_UnexpectedResponseException extends BaseException{constructor(msg,status){super(msg,"UnexpectedResponseException");this.status=status;}}class FormatError extends BaseException{constructor(msg){super(msg,"FormatError");}}class util_AbortException extends BaseException{constructor(msg){super(msg,"AbortException");}}function bytesToString(bytes){if(typeof bytes!=="object"||bytes?.length===undefined){unreachable("Invalid argument for bytesToString");}const length=bytes.length;const MAX_ARGUMENT_COUNT=8192;if(length<MAX_ARGUMENT_COUNT){return String.fromCharCode.apply(null,bytes);}const strBuf=[];for(let i=0;i<length;i+=MAX_ARGUMENT_COUNT){const chunkEnd=Math.min(i+MAX_ARGUMENT_COUNT,length);const chunk=bytes.subarray(i,chunkEnd);strBuf.push(String.fromCharCode.apply(null,chunk));}return strBuf.join("");}function stringToBytes(str){if(typeof str!=="string"){unreachable("Invalid argument for stringToBytes");}const length=str.length;const bytes=new Uint8Array(length);for(let i=0;i<length;++i){bytes[i]=str.charCodeAt(i)&0xff;}return bytes;}function string32(value){return String.fromCharCode(value>>24&0xff,value>>16&0xff,value>>8&0xff,value&0xff);}function objectSize(obj){return Object.keys(obj).length;}function objectFromMap(map){const obj=Object.create(null);for(const[key,value]of map){obj[key]=value;}return obj;}function isLittleEndian(){const buffer8=new Uint8Array(4);buffer8[0]=1;const view32=new Uint32Array(buffer8.buffer,0,1);return view32[0]===1;}function isEvalSupported(){try{new Function("");return true;}catch{return false;}}class util_FeatureTest{static get isLittleEndian(){return util_shadow(this,"isLittleEndian",isLittleEndian());}static get isEvalSupported(){return util_shadow(this,"isEvalSupported",isEvalSupported());}static get isOffscreenCanvasSupported(){return util_shadow(this,"isOffscreenCanvasSupported",typeof OffscreenCanvas!=="undefined");}static get platform(){if(typeof navigator!=="undefined"&&typeof navigator?.platform==="string"){return util_shadow(this,"platform",{isMac:navigator.platform.includes("Mac")});}return util_shadow(this,"platform",{isMac:false});}static get isCSSRoundSupported(){return util_shadow(this,"isCSSRoundSupported",globalThis.CSS?.supports?.("width: round(1.5px, 1px)"));}}const hexNumbers=Array.from(Array(256).keys(),n=>n.toString(16).padStart(2,"0"));class util_Util{static makeHexColor(r,g,b){return`#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;}static scaleMinMax(transform,minMax){let temp;if(transform[0]){if(transform[0]<0){temp=minMax[0];minMax[0]=minMax[2];minMax[2]=temp;}minMax[0]*=transform[0];minMax[2]*=transform[0];if(transform[3]<0){temp=minMax[1];minMax[1]=minMax[3];minMax[3]=temp;}minMax[1]*=transform[3];minMax[3]*=transform[3];}else{temp=minMax[0];minMax[0]=minMax[1];minMax[1]=temp;temp=minMax[2];minMax[2]=minMax[3];minMax[3]=temp;if(transform[1]<0){temp=minMax[1];minMax[1]=minMax[3];minMax[3]=temp;}minMax[1]*=transform[1];minMax[3]*=transform[1];if(transform[2]<0){temp=minMax[0];minMax[0]=minMax[2];minMax[2]=temp;}minMax[0]*=transform[2];minMax[2]*=transform[2];}minMax[0]+=transform[4];minMax[1]+=transform[5];minMax[2]+=transform[4];minMax[3]+=transform[5];}static transform(m1,m2){return[m1[0]*m2[0]+m1[2]*m2[1],m1[1]*m2[0]+m1[3]*m2[1],m1[0]*m2[2]+m1[2]*m2[3],m1[1]*m2[2]+m1[3]*m2[3],m1[0]*m2[4]+m1[2]*m2[5]+m1[4],m1[1]*m2[4]+m1[3]*m2[5]+m1[5]];}static applyTransform(p,m){const xt=p[0]*m[0]+p[1]*m[2]+m[4];const yt=p[0]*m[1]+p[1]*m[3]+m[5];return[xt,yt];}static applyInverseTransform(p,m){const d=m[0]*m[3]-m[1]*m[2];const xt=(p[0]*m[3]-p[1]*m[2]+m[2]*m[5]-m[4]*m[3])/d;const yt=(-p[0]*m[1]+p[1]*m[0]+m[4]*m[1]-m[5]*m[0])/d;return[xt,yt];}static getAxialAlignedBoundingBox(r,m){const p1=this.applyTransform(r,m);const p2=this.applyTransform(r.slice(2,4),m);const p3=this.applyTransform([r[0],r[3]],m);const p4=this.applyTransform([r[2],r[1]],m);return[Math.min(p1[0],p2[0],p3[0],p4[0]),Math.min(p1[1],p2[1],p3[1],p4[1]),Math.max(p1[0],p2[0],p3[0],p4[0]),Math.max(p1[1],p2[1],p3[1],p4[1])];}static inverseTransform(m){const d=m[0]*m[3]-m[1]*m[2];return[m[3]/d,-m[1]/d,-m[2]/d,m[0]/d,(m[2]*m[5]-m[4]*m[3])/d,(m[4]*m[1]-m[5]*m[0])/d];}static singularValueDecompose2dScale(m){const transpose=[m[0],m[2],m[1],m[3]];const a=m[0]*transpose[0]+m[1]*transpose[2];const b=m[0]*transpose[1]+m[1]*transpose[3];const c=m[2]*transpose[0]+m[3]*transpose[2];const d=m[2]*transpose[1]+m[3]*transpose[3];const first=(a+d)/2;const second=Math.sqrt((a+d)**2-4*(a*d-c*b))/2;const sx=first+second||1;const sy=first-second||1;return[Math.sqrt(sx),Math.sqrt(sy)];}static normalizeRect(rect){const r=rect.slice(0);if(rect[0]>rect[2]){r[0]=rect[2];r[2]=rect[0];}if(rect[1]>rect[3]){r[1]=rect[3];r[3]=rect[1];}return r;}static intersect(rect1,rect2){const xLow=Math.max(Math.min(rect1[0],rect1[2]),Math.min(rect2[0],rect2[2]));const xHigh=Math.min(Math.max(rect1[0],rect1[2]),Math.max(rect2[0],rect2[2]));if(xLow>xHigh){return null;}const yLow=Math.max(Math.min(rect1[1],rect1[3]),Math.min(rect2[1],rect2[3]));const yHigh=Math.min(Math.max(rect1[1],rect1[3]),Math.max(rect2[1],rect2[3]));if(yLow>yHigh){return null;}return[xLow,yLow,xHigh,yHigh];}static bezierBoundingBox(x0,y0,x1,y1,x2,y2,x3,y3,minMax){if(minMax){minMax[0]=Math.min(minMax[0],x0,x3);minMax[1]=Math.min(minMax[1],y0,y3);minMax[2]=Math.max(minMax[2],x0,x3);minMax[3]=Math.max(minMax[3],y0,y3);}else{minMax=[Math.min(x0,x3),Math.min(y0,y3),Math.max(x0,x3),Math.max(y0,y3)];}util_assertClassBrand(util_Util,this,_getExtremum).call(this,x0,x1,x2,x3,y0,y1,y2,y3,3*(-x0+3*(x1-x2)+x3),6*(x0-2*x1+x2),3*(x1-x0),minMax);util_assertClassBrand(util_Util,this,_getExtremum).call(this,x0,x1,x2,x3,y0,y1,y2,y3,3*(-y0+3*(y1-y2)+y3),6*(y0-2*y1+y2),3*(y1-y0),minMax);return minMax;}}_Util=util_Util;function _getExtremumOnCurve(x0,x1,x2,x3,y0,y1,y2,y3,t,minMax){if(t<=0||t>=1){return;}const mt=1-t;const tt=t*t;const ttt=tt*t;const x=mt*(mt*(mt*x0+3*t*x1)+3*tt*x2)+ttt*x3;const y=mt*(mt*(mt*y0+3*t*y1)+3*tt*y2)+ttt*y3;minMax[0]=Math.min(minMax[0],x);minMax[1]=Math.min(minMax[1],y);minMax[2]=Math.max(minMax[2],x);minMax[3]=Math.max(minMax[3],y);}function _getExtremum(x0,x1,x2,x3,y0,y1,y2,y3,a,b,c,minMax){if(Math.abs(a)<1e-12){if(Math.abs(b)>=1e-12){util_assertClassBrand(_Util,this,_getExtremumOnCurve).call(this,x0,x1,x2,x3,y0,y1,y2,y3,-c/b,minMax);}return;}const delta=b**2-4*c*a;if(delta<0){return;}const sqrtDelta=Math.sqrt(delta);const a2=2*a;util_assertClassBrand(_Util,this,_getExtremumOnCurve).call(this,x0,x1,x2,x3,y0,y1,y2,y3,(-b+sqrtDelta)/a2,minMax);util_assertClassBrand(_Util,this,_getExtremumOnCurve).call(this,x0,x1,x2,x3,y0,y1,y2,y3,(-b-sqrtDelta)/a2,minMax);}const PDFStringTranslateTable=(/* unused pure expression or super */ null && ([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x2d8,0x2c7,0x2c6,0x2d9,0x2dd,0x2db,0x2da,0x2dc,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x2022,0x2020,0x2021,0x2026,0x2014,0x2013,0x192,0x2044,0x2039,0x203a,0x2212,0x2030,0x201e,0x201c,0x201d,0x2018,0x2019,0x201a,0x2122,0xfb01,0xfb02,0x141,0x152,0x160,0x178,0x17d,0x131,0x142,0x153,0x161,0x17e,0,0x20ac]));function stringToPDFString(str){if(str[0]>="\xEF"){let encoding;if(str[0]==="\xFE"&&str[1]==="\xFF"){encoding="utf-16be";if(str.length%2===1){str=str.slice(0,-1);}}else if(str[0]==="\xFF"&&str[1]==="\xFE"){encoding="utf-16le";if(str.length%2===1){str=str.slice(0,-1);}}else if(str[0]==="\xEF"&&str[1]==="\xBB"&&str[2]==="\xBF"){encoding="utf-8";}if(encoding){try{const decoder=new TextDecoder(encoding,{fatal:true});const buffer=stringToBytes(str);const decoded=decoder.decode(buffer);if(!decoded.includes("\x1b")){return decoded;}return decoded.replaceAll(/\x1b[^\x1b]*(?:\x1b|$)/g,"");}catch(ex){warn(`stringToPDFString: "${ex}".`);}}}const strBuf=[];for(let i=0,ii=str.length;i<ii;i++){const charCode=str.charCodeAt(i);if(charCode===0x1b){while(++i<ii&&str.charCodeAt(i)!==0x1b){}continue;}const code=PDFStringTranslateTable[charCode];strBuf.push(code?String.fromCharCode(code):str.charAt(i));}return strBuf.join("");}function stringToUTF8String(str){return decodeURIComponent(escape(str));}function utf8StringToString(str){return unescape(encodeURIComponent(str));}function isArrayEqual(arr1,arr2){if(arr1.length!==arr2.length){return false;}for(let i=0,ii=arr1.length;i<ii;i++){if(arr1[i]!==arr2[i]){return false;}}return true;}function getModificationDate(){let date=arguments.length>0&&arguments[0]!==undefined?arguments[0]:new Date();const buffer=[date.getUTCFullYear().toString(),(date.getUTCMonth()+1).toString().padStart(2,"0"),date.getUTCDate().toString().padStart(2,"0"),date.getUTCHours().toString().padStart(2,"0"),date.getUTCMinutes().toString().padStart(2,"0"),date.getUTCSeconds().toString().padStart(2,"0")];return buffer.join("");}let NormalizeRegex=null;let NormalizationMap=null;function util_normalizeUnicode(str){if(!NormalizeRegex){NormalizeRegex=/([\u00a0\u00b5\u037e\u0eb3\u2000-\u200a\u202f\u2126\ufb00-\ufb04\ufb06\ufb20-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufba1\ufba4-\ufba9\ufbae-\ufbb1\ufbd3-\ufbdc\ufbde-\ufbe7\ufbea-\ufbf8\ufbfc-\ufbfd\ufc00-\ufc5d\ufc64-\ufcf1\ufcf5-\ufd3d\ufd88\ufdf4\ufdfa-\ufdfb\ufe71\ufe77\ufe79\ufe7b\ufe7d]+)|(\ufb05+)/gu;NormalizationMap=new Map([["ﬅ","ſt"]]);}return str.replaceAll(NormalizeRegex,(_,p1,p2)=>p1?p1.normalize("NFKC"):NormalizationMap.get(p2));}function getUuid(){if(typeof crypto!=="undefined"&&typeof crypto?.randomUUID==="function"){return crypto.randomUUID();}const buf=new Uint8Array(32);if(typeof crypto!=="undefined"&&typeof crypto?.getRandomValues==="function"){crypto.getRandomValues(buf);}else{for(let i=0;i<32;i++){buf[i]=Math.floor(Math.random()*255);}}return bytesToString(buf);}const AnnotationPrefix="pdfjs_internal_id_";const FontRenderOps={BEZIER_CURVE_TO:0,MOVE_TO:1,LINE_TO:2,QUADRATIC_CURVE_TO:3,RESTORE:4,SAVE:5,SCALE:6,TRANSFORM:7,TRANSLATE:8};
;// CONCATENATED MODULE: ./web/pdf_print_service.js
let activeService=null;let dialog=null;let overlayManager=null;let viewerApp={initialized:false};function renderPage(activeServiceOnEntry,pdfDocument,pageNumber,size,printResolution,optionalContentConfigPromise,printAnnotationStoragePromise){const scratchCanvas=activeService.scratchCanvas;let PRINT_UNITS=printResolution/PixelsPerInch.PDF;let scale=1;const canvasWidth=Math.floor(size.width*PRINT_UNITS);const canvasHeight=Math.floor(size.height*PRINT_UNITS);if(canvasWidth>=4096||canvasHeight>=4096){if(!canvasSize.test({width:canvasWidth,height:canvasHeight})){const max=determineMaxDimensions();scale=Math.min(max/canvasWidth,max/canvasHeight)*0.95;}warn("Page "+pageNumber+": Reduced the [printResolution] to "+Math.floor(printResolution*scale)+" because the browser can't render larger canvases. If you see blank page in the print preview, reduce [printResolution] manually to a lower value.");}PRINT_UNITS*=scale;scratchCanvas.width=Math.floor(size.width*PRINT_UNITS);scratchCanvas.height=Math.floor(size.height*PRINT_UNITS);const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const ctx=scratchCanvas.getContext("2d",options);ctx.save();ctx.fillStyle="rgb(255, 255, 255)";ctx.fillRect(0,0,scratchCanvas.width,scratchCanvas.height);ctx.restore();return Promise.all([pdfDocument.getPage(pageNumber),printAnnotationStoragePromise]).then(function(_ref){let[pdfPage,printAnnotationStorage]=_ref;const renderContext={canvasContext:ctx,transform:[PRINT_UNITS,0,0,PRINT_UNITS,0,0],viewport:pdfPage.getViewport({scale:1,rotation:size.rotation}),intent:"print",annotationMode:AnnotationMode.ENABLE_STORAGE,optionalContentConfigPromise,printAnnotationStorage};const renderTask=pdfPage.render(renderContext);return renderTask.promise.catch(reason=>{if(!(reason instanceof RenderingCancelledException)){console.error(reason);}throw reason;});});}function determineMaxDimensions(){const checklist=[4096,8192,10836,11180,11402,14188,16384];for(let width of checklist){if(!canvasSize.test({width:width+1,height:width+1})){return width;}}return 16384;}class PDFPrintService{constructor(_ref2){let{pdfDocument,pagesOverview,printContainer,printResolution,printAnnotationStoragePromise=null,eventBus}=_ref2;this.pdfDocument=pdfDocument;this.pagesOverview=pagesOverview;this.printContainer=printContainer;this._printResolution=printResolution||150;this._optionalContentConfigPromise=pdfDocument.getOptionalContentConfig({intent:"print"});this._printAnnotationStoragePromise=printAnnotationStoragePromise||Promise.resolve();this.currentPage=-1;this.scratchCanvas=document.createElement("canvas");this.eventBus=eventBus;}layout(){this.throwIfInactive();const body=document.querySelector("body");body.setAttribute("data-pdfjsprinting",true);const html=document.querySelector("html");html.setAttribute("data-pdfjsprinting",true);const{width,height}=this.pagesOverview[0];const hasEqualPageSizes=this.pagesOverview.every(size=>size.width===width&&size.height===height);if(!hasEqualPageSizes){globalThis.ngxConsole.warn("Not all pages have the same size. The printed result may be incorrect!");}this.pageStyleSheet=document.createElement("style");this.pageStyleSheet.textContent=`@page { size: ${width}pt ${height}pt;}`;body.append(this.pageStyleSheet);}destroy(){if(activeService!==this){return;}this.printContainer.textContent="";const body=document.querySelector("body");body.removeAttribute("data-pdfjsprinting");const html=document.querySelector("html");html.removeAttribute("data-pdfjsprinting");if(this.pageStyleSheet){this.pageStyleSheet.remove();this.pageStyleSheet=null;}this.scratchCanvas.width=this.scratchCanvas.height=0;this.scratchCanvas=null;activeService=null;ensureOverlay().then(function(){if(overlayManager.active===dialog){overlayManager.close(dialog);}});}renderPages(){if(this.pdfDocument.isPureXfa){getXfaHtmlForPrinting(this.printContainer,this.pdfDocument);return Promise.resolve();}const pageCount=this.pagesOverview.length;const renderNextPage=(resolve,reject)=>{this.throwIfInactive();while(true){++this.currentPage;if(this.currentPage>=pageCount){break;}if(!window.isInPDFPrintRange||window.isInPDFPrintRange(this.currentPage)){break;}}if(this.currentPage>=pageCount){renderProgress(window.filteredPageCount|pageCount,window.filteredPageCount|pageCount,this.eventBus);resolve();return;}const index=this.currentPage;renderProgress(index,window.filteredPageCount|pageCount,this.eventBus);renderPage(this,this.pdfDocument,index+1,this.pagesOverview[index],this._printResolution,this._optionalContentConfigPromise,this._printAnnotationStoragePromise).then(this.useRenderedPage.bind(this)).then(function(){renderNextPage(resolve,reject);},reject);};return new Promise(renderNextPage);}useRenderedPage(){this.throwIfInactive();const img=document.createElement("img");const scratchCanvas=this.scratchCanvas;if("toBlob"in scratchCanvas){scratchCanvas.toBlob(function(blob){img.src=URL.createObjectURL(blob);});}else{img.src=scratchCanvas.toDataURL();}const wrapper=document.createElement("div");wrapper.className="printedPage";wrapper.append(img);this.printContainer.append(wrapper);return new Promise(function(resolve,reject){img.onload=resolve;img.onerror=reject;});}performPrint(){this.throwIfInactive();return new Promise(resolve=>{setTimeout(()=>{if(!this.active){resolve();return;}print.call(window);const isIOS=navigator.platform&&["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document;setTimeout(resolve,isIOS?1500:20);},0);});}get active(){return this===activeService;}throwIfInactive(){if(!this.active){throw new Error("This print request was cancelled or completed.");}}}const print=window.print;window.printPDF=function printPdf(){if(!PDFViewerApplication.enablePrint){return;}if(activeService){globalThis.ngxConsole.warn("Ignored window.printPDF() because of a pending print job.");return;}ensureOverlay().then(function(){if(activeService){overlayManager.open(dialog);}});try{dispatchEvent("beforeprint");}finally{if(!activeService){globalThis.ngxConsole.error("Expected print service to be initialized.");ensureOverlay().then(function(){if(overlayManager.active===dialog){overlayManager.close(dialog);}});return;}const activeServiceOnEntry=activeService;activeService.renderPages().then(function(){const progressIndicator=document.getElementById("printServiceDialog");if(progressIndicator){progressIndicator.classList.add("hidden");}return activeServiceOnEntry.performPrint();}).catch(function(){}).then(function(){if(activeServiceOnEntry.active){abort();}});}};function dispatchEvent(eventType){const event=new CustomEvent(eventType,{bubbles:false,cancelable:false,detail:"custom"});window.dispatchEvent(event);}function abort(){if(activeService){activeService.destroy();dispatchEvent("afterprint");}}function renderProgress(index,total,eventBus){dialog=document.getElementById("printServiceDialog");const progress=Math.round(100*index/total);const progressBar=dialog.querySelector("progress");const progressPerc=dialog.querySelector(".relative-progress");progressBar.value=progress;progressPerc.setAttribute("data-l10n-args",JSON.stringify({progress}));eventBus.dispatch("progress",{source:this,type:"print",total,page:index,percent:100*index/total});}window.addEventListener("keydown",function(event){if(event.keyCode===80&&(event.ctrlKey||event.metaKey)&&!event.altKey&&(!event.shiftKey||window.chrome||window.opera)){window.print();event.preventDefault();event.stopImmediatePropagation();}},true);if("onbeforeprint"in window){const stopPropagationIfNeeded=function(event){if(event.detail!=="custom"){event.stopImmediatePropagation();}};window.addEventListener("beforeprint",stopPropagationIfNeeded);window.addEventListener("afterprint",stopPropagationIfNeeded);}let overlayPromise;function ensureOverlay(){if(!overlayPromise){overlayManager=viewerApp.overlayManager;if(!overlayManager){throw new Error("The overlay manager has not yet been initialized.");}dialog=document.getElementById("printServiceDialog");overlayPromise=overlayManager.register(dialog,true);document.getElementById("printCancel").onclick=abort;dialog.addEventListener("close",abort);}return overlayPromise;}class PDFPrintServiceFactory{static initGlobals(app){viewerApp=app;}static get supportsPrinting(){return shadow(this,"supportsPrinting",true);}static createPrintService(params){if(activeService){throw new Error("The print service is created and active.");}return activeService=new PDFPrintService(params);}}
;// CONCATENATED MODULE: ./web/pdf_rendering_queue.js
const CLEANUP_TIMEOUT=30000;class PDFRenderingQueue{constructor(){this.pdfViewer=null;this.pdfThumbnailViewer=null;this.onIdle=null;this.highestPriorityPage=null;this.idleTimeout=null;this.printing=false;this.isThumbnailViewEnabled=false;Object.defineProperty(this,"hasViewer",{value:()=>!!this.pdfViewer});}setViewer(pdfViewer){this.pdfViewer=pdfViewer;}setThumbnailViewer(pdfThumbnailViewer){this.pdfThumbnailViewer=pdfThumbnailViewer;}isHighestPriority(view){return this.highestPriorityPage===view.renderingId;}renderHighestPriority(currentlyVisiblePages){if(this.idleTimeout){clearTimeout(this.idleTimeout);this.idleTimeout=null;}if(this.pdfViewer.forceRendering(currentlyVisiblePages)){return;}if(this.isThumbnailViewEnabled&&this.pdfThumbnailViewer?.forceRendering()){return;}if(this.printing){return;}if(this.onIdle){this.idleTimeout=setTimeout(this.onIdle.bind(this),CLEANUP_TIMEOUT);}}getHighestPriority(visible,views,scrolledDown){let preRenderExtra=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;const visibleViews=visible.views,numVisible=visibleViews.length;if(numVisible===0){return null;}for(let i=0;i<numVisible;i++){const view=visibleViews[i].view;if(!this.isViewFinished(view)){return view;}}const firstId=visible.first.id,lastId=visible.last.id;if(lastId-firstId+1>numVisible){const visibleIds=visible.ids;for(let i=1,ii=lastId-firstId;i<ii;i++){const holeId=scrolledDown?firstId+i:lastId-i;if(visibleIds.has(holeId)){continue;}const holeView=views[holeId-1];if(!this.isViewFinished(holeView)){return holeView;}}}let preRenderIndex=scrolledDown?lastId:firstId-2;let preRenderView=views[preRenderIndex];if(preRenderView&&!this.isViewFinished(preRenderView)){return preRenderView;}if(preRenderExtra){preRenderIndex+=scrolledDown?1:-1;preRenderView=views[preRenderIndex];if(preRenderView&&!this.isViewFinished(preRenderView)){return preRenderView;}}return null;}isViewFinished(view){return view.renderingState===RenderingStates.FINISHED;}renderView(view){switch(view.renderingState){case RenderingStates.FINISHED:return false;case RenderingStates.PAUSED:this.highestPriorityPage=view.renderingId;view.resume();break;case RenderingStates.RUNNING:this.highestPriorityPage=view.renderingId;break;case RenderingStates.INITIAL:this.highestPriorityPage=view.renderingId;view.draw().finally(()=>{this.renderHighestPriority();}).catch(reason=>{if(reason instanceof RenderingCancelledException){return;}globalThis.ngxConsole.error(`renderView: "${reason}"`);});break;}return true;}}
;// CONCATENATED MODULE: ./web/pdf_scripting_manager.js
function pdf_scripting_manager_classPrivateMethodInitSpec(e,a){pdf_scripting_manager_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_scripting_manager_classPrivateFieldInitSpec(e,t,a){pdf_scripting_manager_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_scripting_manager_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_scripting_manager_classPrivateFieldGet(s,a){return s.get(pdf_scripting_manager_assertClassBrand(s,a));}function pdf_scripting_manager_classPrivateFieldSet(s,a,r){return s.set(pdf_scripting_manager_assertClassBrand(s,a),r),r;}function pdf_scripting_manager_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _closeCapability=/*#__PURE__*/new WeakMap();var _destroyCapability=/*#__PURE__*/new WeakMap();var _docProperties=/*#__PURE__*/new WeakMap();var pdf_scripting_manager_eventAbortController=/*#__PURE__*/new WeakMap();var pdf_scripting_manager_eventBus=/*#__PURE__*/new WeakMap();var _externalServices=/*#__PURE__*/new WeakMap();var _pdfDocument=/*#__PURE__*/new WeakMap();var _pdfViewer=/*#__PURE__*/new WeakMap();var _ready=/*#__PURE__*/new WeakMap();var _scripting=/*#__PURE__*/new WeakMap();var _willPrintCapability=/*#__PURE__*/new WeakMap();var _PDFScriptingManager_brand=/*#__PURE__*/new WeakSet();class PDFScriptingManager{constructor(_ref){let{eventBus,externalServices=null,docProperties=null}=_ref;pdf_scripting_manager_classPrivateMethodInitSpec(this,_PDFScriptingManager_brand);pdf_scripting_manager_classPrivateFieldInitSpec(this,_closeCapability,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_destroyCapability,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_docProperties,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,pdf_scripting_manager_eventAbortController,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,pdf_scripting_manager_eventBus,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_externalServices,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_pdfDocument,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_pdfViewer,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_ready,false);pdf_scripting_manager_classPrivateFieldInitSpec(this,_scripting,null);pdf_scripting_manager_classPrivateFieldInitSpec(this,_willPrintCapability,null);pdf_scripting_manager_classPrivateFieldSet(pdf_scripting_manager_eventBus,this,eventBus);pdf_scripting_manager_classPrivateFieldSet(_externalServices,this,externalServices);pdf_scripting_manager_classPrivateFieldSet(_docProperties,this,docProperties);}setViewer(pdfViewer){pdf_scripting_manager_classPrivateFieldSet(_pdfViewer,this,pdfViewer);}async setDocument(pdfDocument){if(pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)){await pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_destroyScripting).call(this);}pdf_scripting_manager_classPrivateFieldSet(_pdfDocument,this,pdfDocument);if(!pdfDocument){return;}const[objects,calculationOrder,docActions]=await Promise.all([pdfDocument.getFieldObjects(),pdfDocument.getCalculationOrderIds(),pdfDocument.getJSActions()]);if(!objects&&!docActions){await pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_destroyScripting).call(this);return;}if(pdfDocument!==pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)){return;}try{pdf_scripting_manager_classPrivateFieldSet(_scripting,this,pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_initScripting).call(this));}catch(error){globalThis.ngxConsole.error(`setDocument: "${error.message}".`);await pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_destroyScripting).call(this);return;}const eventBus=pdf_scripting_manager_classPrivateFieldGet(pdf_scripting_manager_eventBus,this);pdf_scripting_manager_classPrivateFieldSet(pdf_scripting_manager_eventAbortController,this,new AbortController());const{signal}=pdf_scripting_manager_classPrivateFieldGet(pdf_scripting_manager_eventAbortController,this);eventBus._on("updatefromsandbox",event=>{if(event?.source===window){pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_updateFromSandbox).call(this,event.detail);}},{signal});eventBus._on("dispatcheventinsandbox",event=>{pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox(event.detail);},{signal});eventBus._on("pagechanging",_ref2=>{let{pageNumber,previous}=_ref2;if(pageNumber===previous){return;}pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_dispatchPageClose).call(this,previous);pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_dispatchPageOpen).call(this,pageNumber);},{signal});eventBus._on("pagerendered",_ref3=>{let{pageNumber}=_ref3;if(!this._pageOpenPending.has(pageNumber)){return;}if(pageNumber!==pdf_scripting_manager_classPrivateFieldGet(_pdfViewer,this).currentPageNumber){return;}pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_dispatchPageOpen).call(this,pageNumber);},{signal});eventBus._on("pagesdestroy",async()=>{await pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_dispatchPageClose).call(this,pdf_scripting_manager_classPrivateFieldGet(_pdfViewer,this).currentPageNumber);await pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"doc",name:"WillClose"});pdf_scripting_manager_classPrivateFieldGet(_closeCapability,this)?.resolve();},{signal});try{const docProperties=await pdf_scripting_manager_classPrivateFieldGet(_docProperties,this).call(this,pdfDocument);if(pdfDocument!==pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)){return;}await pdf_scripting_manager_classPrivateFieldGet(_scripting,this).createSandbox({objects,calculationOrder,appInfo:{platform:navigator.platform,language:navigator.language},docInfo:{...docProperties,actions:docActions}});eventBus.dispatch("sandboxcreated",{source:this});}catch(error){globalThis.ngxConsole.error(`setDocument: "${error.message}".`);await pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_destroyScripting).call(this);return;}await pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"doc",name:"Open"});await pdf_scripting_manager_assertClassBrand(_PDFScriptingManager_brand,this,_dispatchPageOpen).call(this,pdf_scripting_manager_classPrivateFieldGet(_pdfViewer,this).currentPageNumber,true);Promise.resolve().then(()=>{if(pdfDocument===pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)){pdf_scripting_manager_classPrivateFieldSet(_ready,this,true);}});}async dispatchWillSave(){return pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"doc",name:"WillSave"});}async dispatchDidSave(){return pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"doc",name:"DidSave"});}async dispatchWillPrint(){if(!pdf_scripting_manager_classPrivateFieldGet(_scripting,this)){return;}await pdf_scripting_manager_classPrivateFieldGet(_willPrintCapability,this)?.promise;pdf_scripting_manager_classPrivateFieldSet(_willPrintCapability,this,Promise.withResolvers());try{await pdf_scripting_manager_classPrivateFieldGet(_scripting,this).dispatchEventInSandbox({id:"doc",name:"WillPrint"});}catch(ex){pdf_scripting_manager_classPrivateFieldGet(_willPrintCapability,this).resolve();pdf_scripting_manager_classPrivateFieldSet(_willPrintCapability,this,null);throw ex;}await pdf_scripting_manager_classPrivateFieldGet(_willPrintCapability,this).promise;}async dispatchDidPrint(){return pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"doc",name:"DidPrint"});}get destroyPromise(){return pdf_scripting_manager_classPrivateFieldGet(_destroyCapability,this)?.promise||null;}get ready(){return pdf_scripting_manager_classPrivateFieldGet(_ready,this);}get _pageOpenPending(){return shadow(this,"_pageOpenPending",new Set());}get _visitedPages(){return shadow(this,"_visitedPages",new Map());}}async function _updateFromSandbox(detail){const pdfViewer=pdf_scripting_manager_classPrivateFieldGet(_pdfViewer,this);const isInPresentationMode=pdfViewer.isInPresentationMode||pdfViewer.isChangingPresentationMode;const{id,siblings,command,value}=detail;if(!id){switch(command){case"clear":globalThis.ngxConsole.clear();break;case"error":globalThis.ngxConsole.error(value);break;case"layout":if(!isInPresentationMode){const modes=apiPageLayoutToViewerModes(value);pdfViewer.spreadMode=modes.spreadMode;}break;case"page-num":pdfViewer.currentPageNumber=value+1;break;case"print":await pdfViewer.pagesPromise;pdf_scripting_manager_classPrivateFieldGet(pdf_scripting_manager_eventBus,this).dispatch("print",{source:this});break;case"println":globalThis.ngxConsole.log(value);break;case"zoom":if(!isInPresentationMode){pdfViewer.currentScaleValue=value;}break;case"SaveAs":pdf_scripting_manager_classPrivateFieldGet(pdf_scripting_manager_eventBus,this).dispatch("download",{source:this});break;case"FirstPage":pdfViewer.currentPageNumber=1;break;case"LastPage":pdfViewer.currentPageNumber=pdfViewer.pagesCount;break;case"NextPage":pdfViewer.nextPage();break;case"PrevPage":pdfViewer.previousPage();break;case"ZoomViewIn":if(!isInPresentationMode){pdfViewer.increaseScale();}break;case"ZoomViewOut":if(!isInPresentationMode){pdfViewer.decreaseScale();}break;case"WillPrintFinished":pdf_scripting_manager_classPrivateFieldGet(_willPrintCapability,this)?.resolve();pdf_scripting_manager_classPrivateFieldSet(_willPrintCapability,this,null);break;}return;}if(isInPresentationMode&&detail.focus){return;}delete detail.id;delete detail.siblings;const ids=siblings?[id,...siblings]:[id];for(const elementId of ids){const element=document.querySelector(`[data-element-id="${elementId}"]`);if(element){element.dispatchEvent(new CustomEvent("updatefromsandbox",{detail}));}else{pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)?.annotationStorage.setValue(elementId,detail);}}}async function _dispatchPageOpen(pageNumber){let initialize=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;const pdfDocument=pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this),visitedPages=this._visitedPages;if(initialize){pdf_scripting_manager_classPrivateFieldSet(_closeCapability,this,Promise.withResolvers());}if(!pdf_scripting_manager_classPrivateFieldGet(_closeCapability,this)){return;}const pageView=pdf_scripting_manager_classPrivateFieldGet(_pdfViewer,this).getPageView(pageNumber-1);if(pageView?.renderingState!==RenderingStates.FINISHED){this._pageOpenPending.add(pageNumber);return;}this._pageOpenPending.delete(pageNumber);const actionsPromise=(async()=>{const actions=await(!visitedPages.has(pageNumber)?pageView.pdfPage?.getJSActions():null);if(pdfDocument!==pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)){return;}await pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"page",name:"PageOpen",pageNumber,actions});})();visitedPages.set(pageNumber,actionsPromise);}async function _dispatchPageClose(pageNumber){const pdfDocument=pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this),visitedPages=this._visitedPages;if(!pdf_scripting_manager_classPrivateFieldGet(_closeCapability,this)){return;}if(this._pageOpenPending.has(pageNumber)){return;}const actionsPromise=visitedPages.get(pageNumber);if(!actionsPromise){return;}visitedPages.set(pageNumber,null);await actionsPromise;if(pdfDocument!==pdf_scripting_manager_classPrivateFieldGet(_pdfDocument,this)){return;}await pdf_scripting_manager_classPrivateFieldGet(_scripting,this)?.dispatchEventInSandbox({id:"page",name:"PageClose",pageNumber});}function _initScripting(){pdf_scripting_manager_classPrivateFieldSet(_destroyCapability,this,Promise.withResolvers());if(pdf_scripting_manager_classPrivateFieldGet(_scripting,this)){throw new Error("#initScripting: Scripting already exists.");}return pdf_scripting_manager_classPrivateFieldGet(_externalServices,this).createScripting();}async function _destroyScripting(){if(!pdf_scripting_manager_classPrivateFieldGet(_scripting,this)){pdf_scripting_manager_classPrivateFieldSet(_pdfDocument,this,null);pdf_scripting_manager_classPrivateFieldGet(_destroyCapability,this)?.resolve();return;}if(pdf_scripting_manager_classPrivateFieldGet(_closeCapability,this)){await Promise.race([pdf_scripting_manager_classPrivateFieldGet(_closeCapability,this).promise,new Promise(resolve=>{setTimeout(resolve,1000);})]).catch(()=>{});pdf_scripting_manager_classPrivateFieldSet(_closeCapability,this,null);}pdf_scripting_manager_classPrivateFieldSet(_pdfDocument,this,null);try{await pdf_scripting_manager_classPrivateFieldGet(_scripting,this).destroySandbox();}catch{}pdf_scripting_manager_classPrivateFieldGet(_willPrintCapability,this)?.reject(new Error("Scripting destroyed."));pdf_scripting_manager_classPrivateFieldSet(_willPrintCapability,this,null);pdf_scripting_manager_classPrivateFieldGet(pdf_scripting_manager_eventAbortController,this)?.abort();pdf_scripting_manager_classPrivateFieldSet(pdf_scripting_manager_eventAbortController,this,null);this._pageOpenPending.clear();this._visitedPages.clear();pdf_scripting_manager_classPrivateFieldSet(_scripting,this,null);pdf_scripting_manager_classPrivateFieldSet(_ready,this,false);pdf_scripting_manager_classPrivateFieldGet(_destroyCapability,this)?.resolve();}
;// CONCATENATED MODULE: ./web/pdf_sidebar.js
function pdf_sidebar_classPrivateMethodInitSpec(e,a){pdf_sidebar_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_sidebar_classPrivateFieldInitSpec(e,t,a){pdf_sidebar_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_sidebar_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_sidebar_classPrivateFieldGet(s,a){return s.get(pdf_sidebar_assertClassBrand(s,a));}function pdf_sidebar_classPrivateFieldSet(s,a,r){return s.set(pdf_sidebar_assertClassBrand(s,a),r),r;}function pdf_sidebar_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const SIDEBAR_WIDTH_VAR="--sidebar-width";const SIDEBAR_MIN_WIDTH=200;const SIDEBAR_RESIZING_CLASS="sidebarResizing";const UI_NOTIFICATION_CLASS="pdfSidebarNotification";var pdf_sidebar_isRTL=/*#__PURE__*/new WeakMap();var _mouseMoveBound=/*#__PURE__*/new WeakMap();var _mouseUpBound=/*#__PURE__*/new WeakMap();var _outerContainerWidth=/*#__PURE__*/new WeakMap();var _width=/*#__PURE__*/new WeakMap();var _PDFSidebar_brand=/*#__PURE__*/new WeakSet();class PDFSidebar{constructor(_ref){let{elements,eventBus,l10n}=_ref;pdf_sidebar_classPrivateMethodInitSpec(this,_PDFSidebar_brand);pdf_sidebar_classPrivateFieldInitSpec(this,pdf_sidebar_isRTL,false);pdf_sidebar_classPrivateFieldInitSpec(this,_mouseMoveBound,pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_mouseMove).bind(this));pdf_sidebar_classPrivateFieldInitSpec(this,_mouseUpBound,pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_mouseUp).bind(this));pdf_sidebar_classPrivateFieldInitSpec(this,_outerContainerWidth,null);pdf_sidebar_classPrivateFieldInitSpec(this,_width,null);this.isOpen=false;this.active=SidebarView.THUMBS;this.isInitialViewSet=false;this.isInitialEventDispatched=false;this.onToggled=null;this.onUpdateThumbnails=null;this.outerContainer=elements.outerContainer;this.sidebarContainer=elements.sidebarContainer;this.toggleButton=elements.toggleButton;this.resizer=elements.resizer;this.thumbnailButton=elements.thumbnailButton;this.outlineButton=elements.outlineButton;this.attachmentsButton=elements.attachmentsButton;this.layersButton=elements.layersButton;this.thumbnailView=elements.thumbnailView;this.outlineView=elements.outlineView;this.attachmentsView=elements.attachmentsView;this.layersView=elements.layersView;this._currentOutlineItemButton=elements.currentOutlineItemButton;this.eventBus=eventBus;pdf_sidebar_classPrivateFieldSet(pdf_sidebar_isRTL,this,l10n.getDirection()==="rtl");pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,pdf_sidebar_addEventListeners).call(this);}reset(){this.isInitialViewSet=false;this.isInitialEventDispatched=false;pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_hideUINotification).call(this,true);this.switchView(SidebarView.THUMBS);this.outlineButton.disabled=false;this.attachmentsButton.disabled=false;this.layersButton.disabled=false;this.outlineButton.hidden=false;this.attachmentsButton.hidden=false;this.layersButton.hidden=false;this._currentOutlineItemButton.disabled=true;}get visibleView(){return this.isOpen?this.active:SidebarView.NONE;}setInitialView(){let view=arguments.length>0&&arguments[0]!==undefined?arguments[0]:SidebarView.NONE;if(this.isInitialViewSet){return;}this.isInitialViewSet=true;if(view===SidebarView.NONE||view===SidebarView.UNKNOWN){pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_dispatchEvent).call(this);return;}this.switchView(view,true);if(!this.isInitialEventDispatched){pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_dispatchEvent).call(this);}}switchView(view){let forceOpen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;const isViewChanged=view!==this.active;let forceRendering=false;switch(view){case SidebarView.NONE:if(this.isOpen){this.close();}return;case SidebarView.THUMBS:if(this.isOpen&&isViewChanged){forceRendering=true;}break;case SidebarView.OUTLINE:if(this.outlineButton.disabled){return;}break;case SidebarView.ATTACHMENTS:if(this.attachmentsButton.disabled){return;}break;case SidebarView.LAYERS:if(this.layersButton.disabled){return;}break;default:globalThis.ngxConsole.error(`PDFSidebar.switchView: "${view}" is not a valid view.`);return;}this.active=view;toggleCheckedBtn(this.thumbnailButton,view===SidebarView.THUMBS,this.thumbnailView);toggleCheckedBtn(this.outlineButton,view===SidebarView.OUTLINE,this.outlineView);toggleCheckedBtn(this.attachmentsButton,view===SidebarView.ATTACHMENTS,this.attachmentsView);toggleCheckedBtn(this.layersButton,view===SidebarView.LAYERS,this.layersView);if(forceOpen&&!this.isOpen){this.open();return;}if(forceRendering){this.onUpdateThumbnails();this.onToggled();}if(isViewChanged){pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_dispatchEvent).call(this);}}open(){if(this.isOpen){return;}this.isOpen=true;toggleExpandedBtn(this.toggleButton,true);this.outerContainer.classList.add("sidebarMoving","sidebarOpen");if(this.active===SidebarView.THUMBS){this.onUpdateThumbnails();}this.onToggled();pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_dispatchEvent).call(this);pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_hideUINotification).call(this);}close(){let evt=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(!this.isOpen){return;}this.isOpen=false;toggleExpandedBtn(this.toggleButton,false);this.outerContainer.classList.add("sidebarMoving");this.outerContainer.classList.remove("sidebarOpen");this.onToggled();pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_dispatchEvent).call(this);if(evt?.detail>0){this.toggleButton.blur();}}toggle(){let evt=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(this.isOpen){this.close(evt);}else{this.open();}}get outerContainerWidth(){return pdf_sidebar_classPrivateFieldGet(_outerContainerWidth,this)||pdf_sidebar_classPrivateFieldSet(_outerContainerWidth,this,this.outerContainer.clientWidth);}}function _dispatchEvent(){if(this.isInitialViewSet){this.isInitialEventDispatched||=true;}this.eventBus.dispatch("sidebarviewchanged",{source:this,view:this.visibleView});}function _showUINotification(){this.toggleButton.setAttribute("data-l10n-id","pdfjs-toggle-sidebar-notification-button");if(!this.isOpen){this.toggleButton.classList.add(UI_NOTIFICATION_CLASS);}}function _hideUINotification(){let reset=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(this.isOpen||reset){this.toggleButton.classList.remove(UI_NOTIFICATION_CLASS);}if(reset){this.toggleButton.setAttribute("data-l10n-id","pdfjs-toggle-sidebar-button");}}function pdf_sidebar_addEventListeners(){this.sidebarContainer.addEventListener("transitionend",evt=>{if(evt.target===this.sidebarContainer){this.outerContainer.classList.remove("sidebarMoving");this.eventBus.dispatch("resize",{source:this});}});this.toggleButton.addEventListener("click",evt=>{this.toggle(evt);});this.thumbnailButton.addEventListener("click",()=>{this.switchView(SidebarView.THUMBS);});this.outlineButton.addEventListener("click",()=>{this.switchView(SidebarView.OUTLINE);});this.outlineButton.addEventListener("dblclick",()=>{this.eventBus.dispatch("toggleoutlinetree",{source:this});});this.attachmentsButton.addEventListener("click",()=>{this.switchView(SidebarView.ATTACHMENTS);});this.layersButton.addEventListener("click",()=>{this.switchView(SidebarView.LAYERS);});this.layersButton.addEventListener("dblclick",()=>{this.eventBus.dispatch("resetlayers",{source:this});});this._currentOutlineItemButton.addEventListener("click",()=>{this.eventBus.dispatch("currentoutlineitem",{source:this});});const onTreeLoaded=(count,button,view)=>{button.disabled=!count;button.hidden=!count;if(count){pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_showUINotification).call(this);}else if(this.active===view){this.switchView(SidebarView.THUMBS);}};this.eventBus._on("outlineloaded",evt=>{onTreeLoaded(evt.outlineCount,this.outlineButton,SidebarView.OUTLINE);if(evt.enableCurrentOutlineItemButton){if(evt.currentOutlineItemPromise){evt.currentOutlineItemPromise.then(enabled=>{if(!this.isInitialViewSet){return;}this._currentOutlineItemButton.disabled=!enabled;});}}});this.eventBus._on("attachmentsloaded",evt=>{onTreeLoaded(evt.attachmentsCount,this.attachmentsButton,SidebarView.ATTACHMENTS);});this.eventBus._on("layersloaded",evt=>{onTreeLoaded(evt.layersCount,this.layersButton,SidebarView.LAYERS);});this.eventBus._on("presentationmodechanged",evt=>{if(evt.state===PresentationModeState.NORMAL&&this.visibleView===SidebarView.THUMBS){this.onUpdateThumbnails();}});this.resizer.addEventListener("mousedown",evt=>{if(evt.button!==0){return;}this.outerContainer.classList.add(SIDEBAR_RESIZING_CLASS);window.addEventListener("mousemove",pdf_sidebar_classPrivateFieldGet(_mouseMoveBound,this));window.addEventListener("mouseup",pdf_sidebar_classPrivateFieldGet(_mouseUpBound,this));});this.eventBus._on("resize",evt=>{if(evt.source!==window){return;}pdf_sidebar_classPrivateFieldSet(_outerContainerWidth,this,null);if(!pdf_sidebar_classPrivateFieldGet(_width,this)){return;}if(!this.isOpen){pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_updateWidth).call(this,pdf_sidebar_classPrivateFieldGet(_width,this));return;}this.outerContainer.classList.add(SIDEBAR_RESIZING_CLASS);const updated=pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_updateWidth).call(this,pdf_sidebar_classPrivateFieldGet(_width,this));Promise.resolve().then(()=>{this.outerContainer.classList.remove(SIDEBAR_RESIZING_CLASS);if(updated){this.eventBus.dispatch("resize",{source:this});}});});}function _updateWidth(){let width=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;const maxWidth=Math.floor(this.outerContainerWidth/2);if(width>maxWidth){width=maxWidth;}if(width<SIDEBAR_MIN_WIDTH){width=SIDEBAR_MIN_WIDTH;}if(width===pdf_sidebar_classPrivateFieldGet(_width,this)){return false;}pdf_sidebar_classPrivateFieldSet(_width,this,width);docStyle.setProperty(SIDEBAR_WIDTH_VAR,`${width}px`);return true;}function _mouseMove(evt){let width=evt.clientX;if(pdf_sidebar_classPrivateFieldGet(pdf_sidebar_isRTL,this)){width=this.outerContainerWidth-width;}pdf_sidebar_assertClassBrand(_PDFSidebar_brand,this,_updateWidth).call(this,width);}function _mouseUp(evt){this.outerContainer.classList.remove(SIDEBAR_RESIZING_CLASS);this.eventBus.dispatch("resize",{source:this});window.removeEventListener("mousemove",pdf_sidebar_classPrivateFieldGet(_mouseMoveBound,this));window.removeEventListener("mouseup",pdf_sidebar_classPrivateFieldGet(_mouseUpBound,this));}
;// CONCATENATED MODULE: ./web/pdf_thumbnail_view.js
function pdf_thumbnail_view_classPrivateMethodInitSpec(e,a){pdf_thumbnail_view_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_thumbnail_view_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_thumbnail_view_classPrivateGetter(s,r,a){return a(pdf_thumbnail_view_assertClassBrand(s,r));}function pdf_thumbnail_view_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DRAW_UPSCALE_FACTOR=2;const MAX_NUM_SCALING_STEPS=3;const THUMBNAIL_WIDTH=98;class TempImageFactory{static getCanvas(width,height){const tempCanvas=pdf_thumbnail_view_assertClassBrand(TempImageFactory,this,_tempCanvas)._||(_tempCanvas._=pdf_thumbnail_view_assertClassBrand(TempImageFactory,this,document.createElement("canvas")));tempCanvas.width=width;tempCanvas.height=height;const options1=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true,alpha:false}:{alpha:false};const options2=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const ctx=tempCanvas.getContext("2d",options1);ctx.save();ctx.fillStyle="rgb(255, 255, 255)";ctx.fillRect(0,0,width,height);ctx.restore();return[tempCanvas,tempCanvas.getContext("2d",options2)];}static destroyCanvas(){const tempCanvas=pdf_thumbnail_view_assertClassBrand(TempImageFactory,this,_tempCanvas)._;if(tempCanvas){tempCanvas.width=0;tempCanvas.height=0;}_tempCanvas._=pdf_thumbnail_view_assertClassBrand(TempImageFactory,this,null);}}var _tempCanvas={_:null};var _PDFThumbnailView_brand=/*#__PURE__*/new WeakSet();class PDFThumbnailView{constructor(_ref){let{container,eventBus,id,defaultViewport,optionalContentConfigPromise,linkService,renderingQueue,pageColors}=_ref;pdf_thumbnail_view_classPrivateMethodInitSpec(this,_PDFThumbnailView_brand);this.id=id;this.renderingId="thumbnail"+id;this.pageLabel=null;this.pdfPage=null;this.rotation=0;this.viewport=defaultViewport;this.pdfPageRotate=defaultViewport.rotation;this._optionalContentConfigPromise=optionalContentConfigPromise||null;this.pageColors=pageColors||null;this.eventBus=eventBus;this.linkService=linkService;this.renderingQueue=renderingQueue;this.eventBus=eventBus;this.renderTask=null;this.renderingState=RenderingStates.INITIAL;this.resume=null;if(window.pdfThumbnailGenerator){this._placeholderImg=window.pdfThumbnailGenerator(this,linkService,id,container,pdf_thumbnail_view_classPrivateGetter(_PDFThumbnailView_brand,this,_get_pageL10nArgs));}else{this.createThumbnail(this,linkService,id,container,pdf_thumbnail_view_classPrivateGetter(_PDFThumbnailView_brand,this,_get_pageL10nArgs));}}createThumbnail(pdfThumbnailView,linkService,id,container,pageL10nArgs){const anchor=document.createElement("a");anchor.href=linkService.getAnchorUrl("#page="+id);anchor.setAttribute("data-l10n-id","pdfjs-thumb-page-title");anchor.setAttribute("data-l10n-args",pdf_thumbnail_view_classPrivateGetter(_PDFThumbnailView_brand,this,_get_pageL10nArgs));anchor.onclick=function(){linkService.goToPage(id);return false;};this.anchor=anchor;const div=document.createElement("div");div.className="thumbnail";div.setAttribute("data-page-number",this.id);this.div=div;pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_updateDims).call(this);const img=document.createElement("div");img.className="thumbnailImage";this._placeholderImg=img;div.append(img);anchor.append(div);container.append(anchor);}setPdfPage(pdfPage){this.pdfPage=pdfPage;this.pdfPageRotate=pdfPage.rotate;const totalRotation=(this.rotation+this.pdfPageRotate)%360;this.viewport=pdfPage.getViewport({scale:1,rotation:totalRotation});this.reset();}reset(){this.cancelRendering();this.renderingState=RenderingStates.INITIAL;this.div.removeAttribute("data-loaded");this.image?.replaceWith(this._placeholderImg);pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_updateDims).call(this);if(this.image){this.image.removeAttribute("src");delete this.image;}}update(_ref2){let{rotation=null}=_ref2;if(typeof rotation==="number"){this.rotation=rotation;}const totalRotation=(this.rotation+this.pdfPageRotate)%360;this.viewport=this.viewport.clone({scale:1,rotation:totalRotation});this.reset();}cancelRendering(){if(this.renderTask){this.renderTask.cancel();this.renderTask=null;}this.resume=null;}async draw(){if(this.renderingState!==RenderingStates.INITIAL){globalThis.ngxConsole.error("Must be in new state before drawing");return undefined;}const{pdfPage}=this;if(!pdfPage){this.renderingState=RenderingStates.FINISHED;throw new Error("pdfPage is not loaded");}this.renderingState=RenderingStates.RUNNING;const{ctx,canvas,transform}=pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_getPageDrawContext).call(this,DRAW_UPSCALE_FACTOR);const drawViewport=this.viewport.clone({scale:DRAW_UPSCALE_FACTOR*this.scale});const renderContinueCallback=cont=>{if(!this.renderingQueue.isHighestPriority(this)){this.renderingState=RenderingStates.PAUSED;this.resume=()=>{this.renderingState=RenderingStates.RUNNING;cont();};return;}cont();};const renderContext={canvasContext:ctx,transform,viewport:drawViewport,optionalContentConfigPromise:this._optionalContentConfigPromise,pageColors:this.pageColors};const renderTask=this.renderTask=pdfPage.render(renderContext);renderTask.onContinue=renderContinueCallback;const resultPromise=renderTask.promise.then(()=>pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_finishRenderTask).call(this,renderTask,canvas),error=>pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_finishRenderTask).call(this,renderTask,canvas,error));resultPromise.finally(()=>{canvas.width=0;canvas.height=0;this.eventBus.dispatch("thumbnailrendered",{source:this,pageNumber:this.id,pdfPage:this.pdfPage});});return resultPromise;}setImage(pageView){if(this.renderingState!==RenderingStates.INITIAL){return;}const{thumbnailCanvas:canvas,pdfPage,scale}=pageView;if(!canvas){return;}if(!this.pdfPage){this.setPdfPage(pdfPage);}if(scale<this.scale){return;}this.renderingState=RenderingStates.FINISHED;pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_convertCanvasToImage).call(this,canvas);}setPageLabel(label){this.pageLabel=typeof label==="string"?label:null;this.anchor.setAttribute("data-l10n-args",pdf_thumbnail_view_classPrivateGetter(_PDFThumbnailView_brand,this,_get_pageL10nArgs));if(this.renderingState!==RenderingStates.FINISHED){return;}this.image?.setAttribute("data-l10n-args",pdf_thumbnail_view_classPrivateGetter(_PDFThumbnailView_brand,this,_get_pageL10nArgs));}}function _updateDims(){const{width,height}=this.viewport;const ratio=width/height;this.canvasWidth=THUMBNAIL_WIDTH;this.canvasHeight=this.canvasWidth/ratio|0;this.scale=this.canvasWidth/width;const{style}=this.div;style.setProperty("--thumbnail-width",`${this.canvasWidth}px`);style.setProperty("--thumbnail-height",`${this.canvasHeight}px`);}function _getPageDrawContext(){let upscaleFactor=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;const canvas=document.createElement("canvas");const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true,alpha:false}:{alpha:false};const ctx=canvas.getContext("2d",options);const outputScale=new OutputScale();canvas.width=upscaleFactor*this.canvasWidth*outputScale.sx|0;canvas.height=upscaleFactor*this.canvasHeight*outputScale.sy|0;const transform=outputScale.scaled?[outputScale.sx,0,0,outputScale.sy,0,0]:null;return{ctx,canvas,transform};}function _convertCanvasToImage(canvas){if(this.renderingState!==RenderingStates.FINISHED){throw new Error("#convertCanvasToImage: Rendering has not finished.");}const reducedCanvas=pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_reduceImage).call(this,canvas);const image=document.createElement("img");image.className="thumbnailImage";image.setAttribute("data-l10n-id","pdfjs-thumb-page-canvas");image.setAttribute("data-l10n-args",pdf_thumbnail_view_classPrivateGetter(_PDFThumbnailView_brand,this,_get_pageL10nArgs));image.src=reducedCanvas.toDataURL();this.image=image;this.div.setAttribute("data-loaded",true);this._placeholderImg.replaceWith(image);reducedCanvas.width=0;reducedCanvas.height=0;}async function _finishRenderTask(renderTask,canvas){let error=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;if(renderTask===this.renderTask){this.renderTask=null;}if(error instanceof RenderingCancelledException){return;}this.renderingState=RenderingStates.FINISHED;pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_convertCanvasToImage).call(this,canvas);if(error){throw error;}this.eventBus.dispatch("thumbnailRendered",this.id);}function _reduceImage(img){const{ctx,canvas}=pdf_thumbnail_view_assertClassBrand(_PDFThumbnailView_brand,this,_getPageDrawContext).call(this);if(img.width<=2*canvas.width){ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);return canvas;}let reducedWidth=canvas.width<<MAX_NUM_SCALING_STEPS;let reducedHeight=canvas.height<<MAX_NUM_SCALING_STEPS;const[reducedImage,reducedImageCtx]=TempImageFactory.getCanvas(reducedWidth,reducedHeight);while(reducedWidth>img.width||reducedHeight>img.height){reducedWidth>>=1;reducedHeight>>=1;}reducedImageCtx.drawImage(img,0,0,img.width,img.height,0,0,reducedWidth,reducedHeight);while(reducedWidth>2*canvas.width){reducedImageCtx.drawImage(reducedImage,0,0,reducedWidth,reducedHeight,0,0,reducedWidth>>1,reducedHeight>>1);reducedWidth>>=1;reducedHeight>>=1;}ctx.drawImage(reducedImage,0,0,reducedWidth,reducedHeight,0,0,canvas.width,canvas.height);return canvas;}function _get_pageL10nArgs(_this){return JSON.stringify({page:_this.pageLabel??_this.id});}
;// CONCATENATED MODULE: ./web/pdf_thumbnail_viewer.js
function pdf_thumbnail_viewer_classPrivateMethodInitSpec(e,a){pdf_thumbnail_viewer_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_thumbnail_viewer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_thumbnail_viewer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const THUMBNAIL_SCROLL_MARGIN=-19;const THUMBNAIL_SELECTED_CLASS="selected";var _PDFThumbnailViewer_brand=/*#__PURE__*/new WeakSet();class PDFThumbnailViewer{constructor(_ref){let{container,eventBus,linkService,renderingQueue,pageColors}=_ref;pdf_thumbnail_viewer_classPrivateMethodInitSpec(this,_PDFThumbnailViewer_brand);this.container=container;this.eventBus=eventBus;this.linkService=linkService;this.renderingQueue=renderingQueue;this.pageColors=pageColors||null;this.scroll=watchScroll(this.container,pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_scrollUpdated).bind(this));pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_resetView).call(this);}getThumbnail(index){return this._thumbnails[index];}scrollThumbnailIntoView(pageNumber){if(!this.pdfDocument){return;}const thumbnailView=this._thumbnails[pageNumber-1];if(!thumbnailView){globalThis.ngxConsole.error('scrollThumbnailIntoView: Invalid "pageNumber" parameter.');return;}if(pageNumber!==this._currentPageNumber){const prevThumbnailView=this._thumbnails[this._currentPageNumber-1];prevThumbnailView.div.classList.remove(THUMBNAIL_SELECTED_CLASS);thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);}const{first,last,views}=pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_getVisibleThumbs).call(this);if(views.length>0){let shouldScroll=false;if(pageNumber<=first.id||pageNumber>=last.id){shouldScroll=true;}else{for(const{id,percent}of views){if(id!==pageNumber){continue;}shouldScroll=percent<100;break;}}if(shouldScroll){scrollIntoView(thumbnailView.div,{top:THUMBNAIL_SCROLL_MARGIN});}}this._currentPageNumber=pageNumber;}get pagesRotation(){return this._pagesRotation;}set pagesRotation(rotation){if(!isValidRotation(rotation)){throw new Error("Invalid thumbnails rotation angle.");}if(!this.pdfDocument){return;}if(this._pagesRotation===rotation){return;}this._pagesRotation=rotation;const updateArgs={rotation};for(const thumbnail of this._thumbnails){thumbnail.update(updateArgs);}}cleanup(){for(const thumbnail of this._thumbnails){if(thumbnail.renderingState!==RenderingStates.FINISHED){thumbnail.reset();}}TempImageFactory.destroyCanvas();}setDocument(pdfDocument){this.initialized=false;if(this.pdfDocument){pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_cancelRendering).call(this);pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_resetView).call(this);}this.pdfDocument=pdfDocument;if(!pdfDocument){return;}if(this.initialized){return;}this.initialized=true;const firstPagePromise=pdfDocument.getPage(1);const optionalContentConfigPromise=pdfDocument.getOptionalContentConfig({intent:"display"});firstPagePromise.then(firstPdfPage=>{const pagesCount=pdfDocument.numPages;const viewport=firstPdfPage.getViewport({scale:1});for(let pageNum=1;pageNum<=pagesCount;++pageNum){const thumbnail=new PDFThumbnailView({container:this.container,eventBus:this.eventBus,id:pageNum,defaultViewport:viewport.clone(),optionalContentConfigPromise,linkService:this.linkService,renderingQueue:this.renderingQueue,pageColors:this.pageColors,eventBus:this.eventBus});this._thumbnails.push(thumbnail);}this._thumbnails[0]?.setPdfPage(firstPdfPage);const thumbnailView=this._thumbnails[this._currentPageNumber-1];thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);}).catch(reason=>{globalThis.ngxConsole.error("Unable to initialize thumbnail viewer",reason);});}setPageLabels(labels){if(!this.pdfDocument){return;}if(!labels){this._pageLabels=null;}else if(!(Array.isArray(labels)&&this.pdfDocument.numPages===labels.length)){this._pageLabels=null;globalThis.ngxConsole.error("PDFThumbnailViewer_setPageLabels: Invalid page labels.");}else{this._pageLabels=labels;}for(let i=0,ii=this._thumbnails.length;i<ii;i++){this._thumbnails[i].setPageLabel(this._pageLabels?.[i]??null);}}forceRendering(){const visibleThumbs=pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_getVisibleThumbs).call(this);const scrollAhead=pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_getScrollAhead).call(this,visibleThumbs);const thumbView=this.renderingQueue.getHighestPriority(visibleThumbs,this._thumbnails,scrollAhead);if(thumbView){pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_ensurePdfPageLoaded).call(this,thumbView).then(()=>{this.renderingQueue.renderView(thumbView);});return true;}return false;}stopRendering(){pdf_thumbnail_viewer_assertClassBrand(_PDFThumbnailViewer_brand,this,_cancelRendering).call(this);}}function _scrollUpdated(){this.renderingQueue.renderHighestPriority();}function _getVisibleThumbs(){return getVisibleElements({scrollEl:this.container,views:this._thumbnails});}function _resetView(){this._thumbnails=[];this._currentPageNumber=1;this._pageLabels=null;this._pagesRotation=0;this.container.textContent="";}function _cancelRendering(){for(const thumbnail of this._thumbnails){thumbnail.cancelRendering();}}async function _ensurePdfPageLoaded(thumbView){if(thumbView.pdfPage){return thumbView.pdfPage;}try{const pdfPage=await this.pdfDocument.getPage(thumbView.id);if(!thumbView.pdfPage){thumbView.setPdfPage(pdfPage);}return pdfPage;}catch(reason){globalThis.ngxConsole.error("Unable to get page for thumb view",reason);return null;}}function _getScrollAhead(visible){if(visible.first?.id===1){return true;}else if(visible.last?.id===this._thumbnails.length){return false;}return this.scroll.down;}
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.iterator.find.js
var esnext_iterator_find = __webpack_require__(2577);
;// CONCATENATED MODULE: ./web/page-flip.module.js
class Page{constructor(render,density){this.state={angle:0,area:[],position:{x:0,y:0},hardAngle:0,hardDrawingAngle:0};this.createdDensity=density;this.nowDrawingDensity=this.createdDensity;this.render=render;}setDensity(density){this.createdDensity=density;this.nowDrawingDensity=density;}setDrawingDensity(density){this.nowDrawingDensity=density;}setPosition(pagePos){this.state.position=pagePos;}setAngle(angle){this.state.angle=angle;}setArea(area){this.state.area=area;}setHardDrawingAngle(angle){this.state.hardDrawingAngle=angle;}setHardAngle(angle){this.state.hardAngle=angle;this.state.hardDrawingAngle=angle;}setOrientation(orientation){this.orientation=orientation;}getDrawingDensity(){return this.nowDrawingDensity;}getDensity(){return this.createdDensity;}getHardAngle(){return this.state.hardAngle;}}class ImagePage extends Page{constructor(render,href,density){super(render,density);this.image=null;this.isLoad=false;this.loadingAngle=0;this.image=new Image();this.image.src=href;}draw(tempDensity){const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const ctx=canvas.getContext("2d",options);const pagePos=this.render.convertToGlobal(this.state.position);const pageWidth=this.render.getRect().pageWidth;const pageHeight=this.render.getRect().height;ctx.save();ctx.translate(pagePos.x,pagePos.y);ctx.beginPath();for(let p of this.state.area){if(p!==null){p=this.render.convertToGlobal(p);ctx.lineTo(p.x-pagePos.x,p.y-pagePos.y);}}ctx.rotate(this.state.angle);ctx.clip();if(!this.isLoad){this.drawLoader(ctx,{x:0,y:0},pageWidth,pageHeight);}else{ctx.drawImage(this.image,0,0,pageWidth,pageHeight);}ctx.restore();}simpleDraw(orient){const rect=this.render.getRect();const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const ctx=canvas.getContext("2d",options);const pageWidth=rect.pageWidth;const pageHeight=rect.height;const x=orient===1?rect.left+rect.pageWidth:rect.left;const y=rect.top;if(!this.isLoad){this.drawLoader(ctx,{x,y},pageWidth,pageHeight);}else{ctx.drawImage(this.image,x,y,pageWidth,pageHeight);}}drawLoader(ctx,shiftPos,pageWidth,pageHeight){ctx.beginPath();ctx.strokeStyle='rgb(200, 200, 200)';ctx.fillStyle='rgb(255, 255, 255)';ctx.lineWidth=1;ctx.rect(shiftPos.x+1,shiftPos.y+1,pageWidth-1,pageHeight-1);ctx.stroke();ctx.fill();const middlePoint={x:shiftPos.x+pageWidth/2,y:shiftPos.y+pageHeight/2};ctx.beginPath();ctx.lineWidth=10;ctx.arc(middlePoint.x,middlePoint.y,20,this.loadingAngle,3*Math.PI/2+this.loadingAngle);ctx.stroke();ctx.closePath();this.loadingAngle+=0.07;if(this.loadingAngle>=2*Math.PI){this.loadingAngle=0;}}load(){if(!this.isLoad)this.image.onload=()=>{this.isLoad=true;};}newTemporaryCopy(){return this;}getTemporaryCopy(){return this;}hideTemporaryCopy(){}}class PageCollection{constructor(app,render){this.pages=[];this.currentPageIndex=0;this.currentSpreadIndex=0;this.landscapeSpread=[];this.portraitSpread=[];this.render=render;this.app=app;this.currentPageIndex=0;this.isShowCover=this.app.getSettings().showCover;}destroy(){this.pages=[];}createSpread(){this.landscapeSpread=[];this.portraitSpread=[];for(let i=0;i<this.pages.length;i++){this.portraitSpread.push([i]);}let start=0;if(this.isShowCover){this.pages[0].setDensity("hard");this.landscapeSpread.push([start]);start++;}for(let i=start;i<this.pages.length;i+=2){if(i<this.pages.length-1)this.landscapeSpread.push([i,i+1]);else{this.landscapeSpread.push([i]);this.pages[i].setDensity("hard");}}}getSpread(){return this.render.getOrientation()==="landscape"?this.landscapeSpread:this.portraitSpread;}getSpreadIndexByPage(pageNum){const spread=this.getSpread();for(let i=0;i<spread.length;i++)if(pageNum===spread[i][0]||pageNum===spread[i][1])return i;return null;}getPageCount(){return this.pages.length;}getPages(){return this.pages;}getPage(pageIndex){if(pageIndex>=0&&pageIndex<this.pages.length){return this.pages[pageIndex];}throw new Error('Invalid page number');}nextBy(current){const idx=this.pages.indexOf(current);if(idx<this.pages.length-1)return this.pages[idx+1];return null;}prevBy(current){const idx=this.pages.indexOf(current);if(idx>0)return this.pages[idx-1];return null;}getFlippingPage(direction){const current=this.currentSpreadIndex;if(this.render.getOrientation()==="portrait"){return direction===0?this.pages[current].newTemporaryCopy():this.pages[current-1];}else{const spread=direction===0?this.getSpread()[current+1]:this.getSpread()[current-1];if(spread.length===1)return this.pages[spread[0]];return direction===0?this.pages[spread[0]]:this.pages[spread[1]];}}getBottomPage(direction){const current=this.currentSpreadIndex;if(this.render.getOrientation()==="portrait"){return direction===0?this.pages[current+1]:this.pages[current-1];}else{const spread=direction===0?this.getSpread()[current+1]:this.getSpread()[current-1];if(spread.length===1)return this.pages[spread[0]];return direction===0?this.pages[spread[1]]:this.pages[spread[0]];}}showNext(){if(this.currentSpreadIndex<this.getSpread().length){this.currentSpreadIndex++;this.showSpread();}}showPrev(){if(this.currentSpreadIndex>0){this.currentSpreadIndex--;this.showSpread();}}getCurrentPageIndex(){return this.currentPageIndex;}show(){let pageNum=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(pageNum===null)pageNum=this.currentPageIndex;if(pageNum<0||pageNum>=this.pages.length)return;const spreadIndex=this.getSpreadIndexByPage(pageNum);if(spreadIndex!==null){this.currentSpreadIndex=spreadIndex;this.showSpread();}}getCurrentSpreadIndex(){return this.currentSpreadIndex;}setCurrentSpreadIndex(newIndex){if(newIndex>=0&&newIndex<this.getSpread().length){this.currentSpreadIndex=newIndex;}else{throw new Error('Invalid page');}}showSpread(){const spread=this.getSpread()[this.currentSpreadIndex];if(spread.length===2){this.render.setLeftPage(this.pages[spread[0]]);this.render.setRightPage(this.pages[spread[1]]);}else{if(this.render.getOrientation()==="landscape"){if(spread[0]===this.pages.length-1){this.render.setLeftPage(this.pages[spread[0]]);this.render.setRightPage(null);}else{this.render.setLeftPage(null);this.render.setRightPage(this.pages[spread[0]]);}}else{this.render.setLeftPage(null);this.render.setRightPage(this.pages[spread[0]]);}}this.currentPageIndex=spread[0];this.app.updatePageIndex(this.currentPageIndex);}}class ImagePageCollection extends PageCollection{constructor(app,render,imagesHref){super(app,render);this.imagesHref=imagesHref;}load(){for(const href of this.imagesHref){const page=new ImagePage(this.render,href,"soft");page.load();this.pages.push(page);}this.createSpread();}}class Helper{static GetDistanceBetweenTwoPoint(point1,point2){if(point1===null||point2===null){return Infinity;}return Math.sqrt(Math.pow(point2.x-point1.x,2)+Math.pow(point2.y-point1.y,2));}static GetSegmentLength(segment){return Helper.GetDistanceBetweenTwoPoint(segment[0],segment[1]);}static GetAngleBetweenTwoLine(line1,line2){const A1=line1[0].y-line1[1].y;const A2=line2[0].y-line2[1].y;const B1=line1[1].x-line1[0].x;const B2=line2[1].x-line2[0].x;return Math.acos((A1*A2+B1*B2)/(Math.sqrt(A1*A1+B1*B1)*Math.sqrt(A2*A2+B2*B2)));}static PointInRect(rect,pos){if(pos===null){return null;}if(pos.x>=rect.left&&pos.x<=rect.width+rect.left&&pos.y>=rect.top&&pos.y<=rect.top+rect.height){return pos;}return null;}static GetRotatedPoint(transformedPoint,startPoint,angle){return{x:transformedPoint.x*Math.cos(angle)+transformedPoint.y*Math.sin(angle)+startPoint.x,y:transformedPoint.y*Math.cos(angle)-transformedPoint.x*Math.sin(angle)+startPoint.y};}static LimitPointToCircle(startPoint,radius,limitedPoint){if(Helper.GetDistanceBetweenTwoPoint(startPoint,limitedPoint)<=radius){return limitedPoint;}const a=startPoint.x;const b=startPoint.y;const n=limitedPoint.x;const m=limitedPoint.y;let x=Math.sqrt(Math.pow(radius,2)*Math.pow(a-n,2)/(Math.pow(a-n,2)+Math.pow(b-m,2)))+a;if(limitedPoint.x<0){x*=-1;}let y=(x-a)*(b-m)/(a-n)+b;if(a-n+b===0){y=radius;}return{x,y};}static GetIntersectBetweenTwoSegment(rectBorder,one,two){return Helper.PointInRect(rectBorder,Helper.GetIntersectBeetwenTwoLine(one,two));}static GetIntersectBeetwenTwoLine(one,two){const A1=one[0].y-one[1].y;const A2=two[0].y-two[1].y;const B1=one[1].x-one[0].x;const B2=two[1].x-two[0].x;const C1=one[0].x*one[1].y-one[1].x*one[0].y;const C2=two[0].x*two[1].y-two[1].x*two[0].y;const det1=A1*C2-A2*C1;const det2=B1*C2-B2*C1;const x=-((C1*B2-C2*B1)/(A1*B2-A2*B1));const y=-((A1*C2-A2*C1)/(A1*B2-A2*B1));if(isFinite(x)&&isFinite(y)){return{x,y};}else{if(Math.abs(det1-det2)<0.1)throw new Error('Segment included');}return null;}static GetCordsFromTwoPoint(pointOne,pointTwo){const sizeX=Math.abs(pointOne.x-pointTwo.x);const sizeY=Math.abs(pointOne.y-pointTwo.y);const lengthLine=Math.max(sizeX,sizeY);const result=[pointOne];function getCord(c1,c2,size,length,index){if(c2>c1){return c1+index*(size/length);}else if(c2<c1){return c1-index*(size/length);}return c1;}for(let i=1;i<=lengthLine;i+=1){result.push({x:getCord(pointOne.x,pointTwo.x,sizeX,lengthLine,i),y:getCord(pointOne.y,pointTwo.y,sizeY,lengthLine,i)});}return result;}}class HTMLPage extends Page{constructor(render,element,density){super(render,density);this.copiedElement=null;this.temporaryCopy=null;this.isLoad=false;this.element=element;this.element.classList.add('stf__item');this.element.classList.add('--'+density);}newTemporaryCopy(){if(this.nowDrawingDensity==="hard"){return this;}if(this.temporaryCopy===null){this.copiedElement=this.element.cloneNode(true);this.element.parentElement.appendChild(this.copiedElement);this.temporaryCopy=new HTMLPage(this.render,this.copiedElement,this.nowDrawingDensity);}return this.getTemporaryCopy();}getTemporaryCopy(){return this.temporaryCopy;}hideTemporaryCopy(){if(this.temporaryCopy!==null){this.copiedElement.remove();this.copiedElement=null;this.temporaryCopy=null;}}draw(tempDensity){const density=tempDensity?tempDensity:this.nowDrawingDensity;const pagePos=this.render.convertToGlobal(this.state.position);const pageWidth=this.render.getRect().pageWidth;const pageHeight=this.render.getRect().height;this.element.classList.remove('--simple');const commonStyle=`
            position: absolute;
            display: block;
            z-index: ${this.element.style.zIndex};
            left: 0;
            top: 0;
            width: ${pageWidth}px;
            height: ${pageHeight}px;
        `;density==="hard"?this.drawHard(commonStyle):this.drawSoft(pagePos,commonStyle);}drawHard(){let commonStyle=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';const pos=this.render.getRect().left+this.render.getRect().width/2;const angle=this.state.hardDrawingAngle;const newStyle=commonStyle+`
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                clip-path: none;
                -webkit-clip-path: none;
            `+(this.orientation===0?`transform-origin: ${this.render.getRect().pageWidth}px 0;
                   transform: translate3d(0, 0, 0) rotateY(${angle}deg);`:`transform-origin: 0 0;
                   transform: translate3d(${pos}px, 0, 0) rotateY(${angle}deg);`);this.element.style.cssText=newStyle;}drawSoft(position){let commonStyle=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';let polygon='polygon( ';for(const p of this.state.area){if(p!==null){let g=this.render.getDirection()===1?{x:-p.x+this.state.position.x,y:p.y-this.state.position.y}:{x:p.x-this.state.position.x,y:p.y-this.state.position.y};g=Helper.GetRotatedPoint(g,{x:0,y:0},this.state.angle);polygon+=g.x+'px '+g.y+'px, ';}}polygon=polygon.slice(0,-2);polygon+=')';const newStyle=commonStyle+`transform-origin: 0 0; clip-path: ${polygon}; -webkit-clip-path: ${polygon};`+(this.render.isSafari()&&this.state.angle===0?`transform: translate(${position.x}px, ${position.y}px);`:`transform: translate3d(${position.x}px, ${position.y}px, 0) rotate(${this.state.angle}rad);`);this.element.style.cssText=newStyle;}simpleDraw(orient){const rect=this.render.getRect();const pageWidth=rect.pageWidth;const pageHeight=rect.height;const x=orient===1?rect.left+rect.pageWidth:rect.left;const y=rect.top;this.element.classList.add('--simple');this.element.style.cssText=`
            position: absolute;
            display: block;
            height: ${pageHeight}px;
            left: ${x}px;
            top: ${y}px;
            width: ${pageWidth}px;
            z-index: ${this.render.getSettings().startZIndex+1};`;}getElement(){return this.element;}load(){this.isLoad=true;}setOrientation(orientation){super.setOrientation(orientation);this.element.classList.remove('--left','--right');this.element.classList.add(orientation===1?'--right':'--left');}setDrawingDensity(density){this.element.classList.remove('--soft','--hard');this.element.classList.add('--'+density);super.setDrawingDensity(density);}}class HTMLPageCollection extends PageCollection{constructor(app,render,element,items){super(app,render);this.element=element;this.pagesElement=items;}load(){for(const pageElement of this.pagesElement){const page=new HTMLPage(this.render,pageElement,pageElement.dataset['density']==='hard'?"hard":"soft");page.load();this.pages.push(page);}this.createSpread();}}class FlipCalculation{constructor(direction,corner,pageWidth,pageHeight){this.direction=direction;this.corner=corner;this.topIntersectPoint=null;this.sideIntersectPoint=null;this.bottomIntersectPoint=null;this.pageWidth=parseInt(pageWidth,10);this.pageHeight=parseInt(pageHeight,10);}calc(localPos){try{this.position=this.calcAngleAndPosition(localPos);this.calculateIntersectPoint(this.position);return true;}catch(e){return false;}}getFlippingClipArea(){const result=[];let clipBottom=false;result.push(this.rect.topLeft);result.push(this.topIntersectPoint);if(this.sideIntersectPoint===null){clipBottom=true;}else{result.push(this.sideIntersectPoint);if(this.bottomIntersectPoint===null)clipBottom=false;}result.push(this.bottomIntersectPoint);if(clipBottom||this.corner==="bottom"){result.push(this.rect.bottomLeft);}return result;}getBottomClipArea(){const result=[];result.push(this.topIntersectPoint);if(this.corner==="top"){result.push({x:this.pageWidth,y:0});}else{if(this.topIntersectPoint!==null){result.push({x:this.pageWidth,y:0});}result.push({x:this.pageWidth,y:this.pageHeight});}if(this.sideIntersectPoint!==null){if(Helper.GetDistanceBetweenTwoPoint(this.sideIntersectPoint,this.topIntersectPoint)>=10)result.push(this.sideIntersectPoint);}else{if(this.corner==="top"){result.push({x:this.pageWidth,y:this.pageHeight});}}result.push(this.bottomIntersectPoint);result.push(this.topIntersectPoint);return result;}getAngle(){if(this.direction===0){return-this.angle;}return this.angle;}getRect(){return this.rect;}getPosition(){return this.position;}getActiveCorner(){if(this.direction===0){return this.rect.topLeft;}return this.rect.topRight;}getDirection(){return this.direction;}getFlippingProgress(){return Math.abs((this.position.x-this.pageWidth)/(2*this.pageWidth)*100);}getCorner(){return this.corner;}getBottomPagePosition(){if(this.direction===1){return{x:this.pageWidth,y:0};}return{x:0,y:0};}getShadowStartPoint(){if(this.corner==="top"){return this.topIntersectPoint;}else{if(this.sideIntersectPoint!==null)return this.sideIntersectPoint;return this.topIntersectPoint;}}getShadowAngle(){const angle=Helper.GetAngleBetweenTwoLine(this.getSegmentToShadowLine(),[{x:0,y:0},{x:this.pageWidth,y:0}]);if(this.direction===0){return angle;}return Math.PI-angle;}calcAngleAndPosition(pos){let result=pos;this.updateAngleAndGeometry(result);if(this.corner==="top"){result=this.checkPositionAtCenterLine(result,{x:0,y:0},{x:0,y:this.pageHeight});}else{result=this.checkPositionAtCenterLine(result,{x:0,y:this.pageHeight},{x:0,y:0});}if(Math.abs(result.x-this.pageWidth)<1&&Math.abs(result.y)<1){throw new Error('Point is too small');}return result;}updateAngleAndGeometry(pos){this.angle=this.calculateAngle(pos);this.rect=this.getPageRect(pos);}calculateAngle(pos){const left=this.pageWidth-pos.x+1;const top=this.corner==="bottom"?this.pageHeight-pos.y:pos.y;let angle=2*Math.acos(left/Math.sqrt(top*top+left*left));if(top<0)angle=-angle;const da=Math.PI-angle;if(!isFinite(angle)||da>=0&&da<0.003)throw new Error('The G point is too small');if(this.corner==="bottom")angle=-angle;return angle;}getPageRect(localPos){if(this.corner==="top"){return this.getRectFromBasePoint([{x:0,y:0},{x:this.pageWidth,y:0},{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}],localPos);}return this.getRectFromBasePoint([{x:0,y:-this.pageHeight},{x:this.pageWidth,y:-this.pageHeight},{x:0,y:0},{x:this.pageWidth,y:0}],localPos);}getRectFromBasePoint(points,localPos){return{topLeft:this.getRotatedPoint(points[0],localPos),topRight:this.getRotatedPoint(points[1],localPos),bottomLeft:this.getRotatedPoint(points[2],localPos),bottomRight:this.getRotatedPoint(points[3],localPos)};}getRotatedPoint(transformedPoint,startPoint){return{x:transformedPoint.x*Math.cos(this.angle)+transformedPoint.y*Math.sin(this.angle)+startPoint.x,y:transformedPoint.y*Math.cos(this.angle)-transformedPoint.x*Math.sin(this.angle)+startPoint.y};}calculateIntersectPoint(pos){const boundRect={left:-1,top:-1,width:this.pageWidth+2,height:this.pageHeight+2};if(this.corner==="top"){this.topIntersectPoint=Helper.GetIntersectBetweenTwoSegment(boundRect,[pos,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]);this.sideIntersectPoint=Helper.GetIntersectBetweenTwoSegment(boundRect,[pos,this.rect.bottomLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]);this.bottomIntersectPoint=Helper.GetIntersectBetweenTwoSegment(boundRect,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}]);}else{this.topIntersectPoint=Helper.GetIntersectBetweenTwoSegment(boundRect,[this.rect.topLeft,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]);this.sideIntersectPoint=Helper.GetIntersectBetweenTwoSegment(boundRect,[pos,this.rect.topLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]);this.bottomIntersectPoint=Helper.GetIntersectBetweenTwoSegment(boundRect,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}]);}}checkPositionAtCenterLine(checkedPos,centerOne,centerTwo){let result=checkedPos;const tmp=Helper.LimitPointToCircle(centerOne,this.pageWidth,result);if(result!==tmp){result=tmp;this.updateAngleAndGeometry(result);}const rad=Math.sqrt(Math.pow(this.pageWidth,2)+Math.pow(this.pageHeight,2));let checkPointOne=this.rect.bottomRight;let checkPointTwo=this.rect.topLeft;if(this.corner==="bottom"){checkPointOne=this.rect.topRight;checkPointTwo=this.rect.bottomLeft;}if(checkPointOne.x<=0){const bottomPoint=Helper.LimitPointToCircle(centerTwo,rad,checkPointTwo);if(bottomPoint!==result){result=bottomPoint;this.updateAngleAndGeometry(result);}}return result;}getSegmentToShadowLine(){const first=this.getShadowStartPoint();const second=first!==this.sideIntersectPoint&&this.sideIntersectPoint!==null?this.sideIntersectPoint:this.bottomIntersectPoint;return[first,second];}}class Flip{constructor(render,app){this.flippingPage=null;this.bottomPage=null;this.calc=null;this.state="read";this.render=render;this.app=app;}fold(globalPos){this.setState("user_fold");if(this.calc===null)this.start(globalPos);this.do(this.render.convertToPage(globalPos));}flip(globalPos){if(this.app.getSettings().disableFlipByClick&&!this.isPointOnCorners(globalPos))return;if(this.calc!==null)this.render.finishAnimation();if(!this.start(globalPos))return;const rect=this.getBoundsRect();this.setState("flipping");const topMargins=rect.height/10;const yStart=this.calc.getCorner()==="bottom"?rect.height-topMargins:topMargins;const yDest=this.calc.getCorner()==="bottom"?rect.height:0;this.calc.calc({x:rect.pageWidth-topMargins,y:yStart});this.animateFlippingTo({x:rect.pageWidth-topMargins,y:yStart},{x:-rect.pageWidth,y:yDest},true);}start(globalPos){this.reset();const bookPos=this.render.convertToBook(globalPos);const rect=this.getBoundsRect();const direction=this.getDirectionByPoint(bookPos);const flipCorner=bookPos.y>=rect.height/2?"bottom":"top";if(!this.checkDirection(direction))return false;try{this.flippingPage=this.app.getPageCollection().getFlippingPage(direction);this.bottomPage=this.app.getPageCollection().getBottomPage(direction);if(this.render.getOrientation()==="landscape"){if(direction===1){const nextPage=this.app.getPageCollection().nextBy(this.flippingPage);if(nextPage!==null){if(this.flippingPage.getDensity()!==nextPage.getDensity()){this.flippingPage.setDrawingDensity("hard");nextPage.setDrawingDensity("hard");}}}else{const prevPage=this.app.getPageCollection().prevBy(this.flippingPage);if(prevPage!==null){if(this.flippingPage.getDensity()!==prevPage.getDensity()){this.flippingPage.setDrawingDensity("hard");prevPage.setDrawingDensity("hard");}}}}this.render.setDirection(direction);this.calc=new FlipCalculation(direction,flipCorner,rect.pageWidth.toString(10),rect.height.toString(10));return true;}catch(e){return false;}}do(pagePos){if(this.calc===null)return;if(this.calc.calc(pagePos)){const progress=this.calc.getFlippingProgress();this.bottomPage.setArea(this.calc.getBottomClipArea());this.bottomPage.setPosition(this.calc.getBottomPagePosition());this.bottomPage.setAngle(0);this.bottomPage.setHardAngle(0);this.flippingPage.setArea(this.calc.getFlippingClipArea());this.flippingPage.setPosition(this.calc.getActiveCorner());this.flippingPage.setAngle(this.calc.getAngle());if(this.calc.getDirection()===0){this.flippingPage.setHardAngle(90*(200-progress*2)/100);}else{this.flippingPage.setHardAngle(-90*(200-progress*2)/100);}this.render.setPageRect(this.calc.getRect());this.render.setBottomPage(this.bottomPage);this.render.setFlippingPage(this.flippingPage);this.render.setShadowData(this.calc.getShadowStartPoint(),this.calc.getShadowAngle(),progress,this.calc.getDirection());}}flipToPage(page,corner){const current=this.app.getPageCollection().getCurrentSpreadIndex();const next=this.app.getPageCollection().getSpreadIndexByPage(page);try{if(next>current){this.app.getPageCollection().setCurrentSpreadIndex(next-1);this.flipNext(corner);}if(next<current){this.app.getPageCollection().setCurrentSpreadIndex(next+1);this.flipPrev(corner);}}catch(e){}}flipNext(corner){this.flip({x:this.render.getRect().left+this.render.getRect().pageWidth*2-10,y:corner==="top"?1:this.render.getRect().height-2});}flipPrev(corner){this.flip({x:10,y:corner==="top"?1:this.render.getRect().height-2});}stopMove(){if(this.calc===null)return;const pos=this.calc.getPosition();const rect=this.getBoundsRect();const y=this.calc.getCorner()==="bottom"?rect.height:0;if(pos.x<=0)this.animateFlippingTo(pos,{x:-rect.pageWidth,y},true);else this.animateFlippingTo(pos,{x:rect.pageWidth,y},false);}showCorner(globalPos){if(!this.checkState("read","fold_corner"))return;const rect=this.getBoundsRect();const pageWidth=rect.pageWidth;if(this.isPointOnCorners(globalPos)){if(this.calc===null){if(!this.start(globalPos))return;this.setState("fold_corner");this.calc.calc({x:pageWidth-1,y:1});const fixedCornerSize=50;const yStart=this.calc.getCorner()==="bottom"?rect.height-1:1;const yDest=this.calc.getCorner()==="bottom"?rect.height-fixedCornerSize:fixedCornerSize;this.animateFlippingTo({x:pageWidth-1,y:yStart},{x:pageWidth-fixedCornerSize,y:yDest},false,false);}else{this.do(this.render.convertToPage(globalPos));}}else{this.setState("read");this.render.finishAnimation();this.stopMove();}}animateFlippingTo(start,dest,isTurned){let needReset=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;const points=Helper.GetCordsFromTwoPoint(start,dest);const frames=[];for(const p of points)frames.push(()=>this.do(p));const duration=this.getAnimationDuration(points.length);this.render.startAnimation(frames,duration,()=>{if(!this.calc)return;if(isTurned){if(this.calc.getDirection()===1)this.app.turnToPrevPage();else this.app.turnToNextPage();}if(needReset){this.render.setBottomPage(null);this.render.setFlippingPage(null);this.render.clearShadow();this.setState("read");this.reset();}});}getCalculation(){return this.calc;}getState(){return this.state;}setState(newState){if(this.state!==newState){this.app.updateState(newState);this.state=newState;}}getDirectionByPoint(touchPos){const rect=this.getBoundsRect();if(this.render.getOrientation()==="portrait"){if(touchPos.x-rect.pageWidth<=rect.width/5){return 1;}}else if(touchPos.x<rect.width/2){return 1;}return 0;}getAnimationDuration(size){const defaultTime=this.app.getSettings().flippingTime;if(size>=1000)return defaultTime;return size/1000*defaultTime;}checkDirection(direction){if(direction===0)return this.app.getCurrentPageIndex()<this.app.getPageCount()-1;return this.app.getCurrentPageIndex()>=1;}reset(){this.calc=null;this.flippingPage=null;this.bottomPage=null;}getBoundsRect(){return this.render.getRect();}checkState(){for(var _len=arguments.length,states=new Array(_len),_key=0;_key<_len;_key++){states[_key]=arguments[_key];}for(const state of states){if(this.state===state)return true;}return false;}isPointOnCorners(globalPos){const rect=this.getBoundsRect();const pageWidth=rect.pageWidth;const operatingDistance=Math.sqrt(Math.pow(pageWidth,2)+Math.pow(rect.height,2))/5;const bookPos=this.render.convertToBook(globalPos);return bookPos.x>0&&bookPos.y>0&&bookPos.x<rect.width&&bookPos.y<rect.height&&(bookPos.x<operatingDistance||bookPos.x>rect.width-operatingDistance)&&(bookPos.y<operatingDistance||bookPos.y>rect.height-operatingDistance);}}class Render{constructor(app,setting){this.leftPage=null;this.rightPage=null;this.flippingPage=null;this.bottomPage=null;this.direction=null;this.orientation=null;this.shadow=null;this.animation=null;this.pageRect=null;this.boundsRect=null;this.timer=0;this.safari=false;this.setting=setting;this.app=app;const regex=new RegExp('Version\\/[\\d\\.]+.*Safari/');this.safari=regex.exec(window.navigator.userAgent)!==null;this.ngxZone=setting.ngxZone;}render(timer){if(this.animation!==null){const frameIndex=Math.round((timer-this.animation.startedAt)/this.animation.durationFrame);if(frameIndex<this.animation.frames.length){this.animation.frames[frameIndex]();}else{this.animation.onAnimateEnd();this.animation=null;}}this.timer=timer;this.drawFrame();}start(){this.update();const loop=timer=>{this.ngxZone?.runOutsideAngular(()=>{this.render(timer);requestAnimationFrame(loop);});};this.ngxZone?.runOutsideAngular(()=>{requestAnimationFrame(loop);});}startAnimation(frames,duration,onAnimateEnd){this.finishAnimation();this.animation={frames,duration,durationFrame:duration/frames.length,onAnimateEnd,startedAt:this.timer};}finishAnimation(){if(this.animation!==null){this.animation.frames[this.animation.frames.length-1]();if(this.animation.onAnimateEnd!==null){this.animation.onAnimateEnd();}}this.animation=null;}update(){this.boundsRect=null;const orientation=this.calculateBoundsRect();if(this.orientation!==orientation){this.orientation=orientation;this.app.updateOrientation(orientation);}}calculateBoundsRect(){let orientation="landscape";const blockWidth=this.getBlockWidth();const middlePoint={x:blockWidth/2,y:this.getBlockHeight()/2};const ratio=this.setting.width/this.setting.height;let pageWidth=this.setting.width;let pageHeight=this.setting.height;let left=middlePoint.x-pageWidth;if(this.setting.size==="stretch"){if(blockWidth<this.setting.minWidth*2&&this.app.getSettings().usePortrait)orientation="portrait";pageWidth=orientation==="portrait"?this.getBlockWidth():this.getBlockWidth()/2;if(pageWidth>this.setting.maxWidth)pageWidth=this.setting.maxWidth;pageHeight=pageWidth/ratio;if(pageHeight>this.getBlockHeight()){pageHeight=this.getBlockHeight();pageWidth=pageHeight*ratio;}left=orientation==="portrait"?middlePoint.x-pageWidth/2-pageWidth:middlePoint.x-pageWidth;}else{if(blockWidth<pageWidth*2){if(this.app.getSettings().usePortrait){orientation="portrait";left=middlePoint.x-pageWidth/2-pageWidth;}}}this.boundsRect={left,top:middlePoint.y-pageHeight/2,width:pageWidth*2,height:pageHeight,pageWidth:pageWidth};return orientation;}setShadowData(pos,angle,progress,direction){if(!this.app.getSettings().drawShadow)return;const maxShadowOpacity=100*this.getSettings().maxShadowOpacity;this.shadow={pos,angle,width:this.getRect().pageWidth*3/4*progress/100,opacity:(100-progress)*maxShadowOpacity/100/100,direction,progress:progress*2};}clearShadow(){this.shadow=null;}getBlockWidth(){return this.app.getUI().getDistElement().offsetWidth;}getBlockHeight(){return this.app.getUI().getDistElement().offsetHeight;}getDirection(){return this.direction;}getRect(){if(this.boundsRect===null)this.calculateBoundsRect();return this.boundsRect;}getSettings(){return this.app.getSettings();}getOrientation(){return this.orientation;}setPageRect(pageRect){this.pageRect=pageRect;}setDirection(direction){this.direction=direction;}setRightPage(page){if(page!==null)page.setOrientation(1);this.rightPage=page;}setLeftPage(page){if(page!==null)page.setOrientation(0);this.leftPage=page;}setBottomPage(page){if(page!==null)page.setOrientation(this.direction===1?0:1);this.bottomPage=page;}setFlippingPage(page){if(page!==null)page.setOrientation(this.direction===0&&this.orientation!=="portrait"?0:1);this.flippingPage=page;}convertToBook(pos){const rect=this.getRect();return{x:pos.x-rect.left,y:pos.y-rect.top};}isSafari(){return this.safari;}convertToPage(pos,direction){if(!direction)direction=this.direction;const rect=this.getRect();const x=direction===0?pos.x-rect.left-rect.width/2:rect.width/2-pos.x+rect.left;return{x,y:pos.y-rect.top};}convertToGlobal(pos,direction){if(!direction)direction=this.direction;if(pos==null)return null;const rect=this.getRect();const x=direction===0?pos.x+rect.left+rect.width/2:rect.width/2-pos.x+rect.left;return{x,y:pos.y+rect.top};}convertRectToGlobal(rect,direction){if(!direction)direction=this.direction;return{topLeft:this.convertToGlobal(rect.topLeft,direction),topRight:this.convertToGlobal(rect.topRight,direction),bottomLeft:this.convertToGlobal(rect.bottomLeft,direction),bottomRight:this.convertToGlobal(rect.bottomRight,direction)};}}class CanvasRender extends Render{constructor(app,setting,inCanvas){super(app,setting);this.canvas=inCanvas;const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true}:undefined;const ctx=canvas.getContext("2d",options);}getContext(){return this.ctx;}reload(){}drawFrame(){this.clear();if(this.orientation!=="portrait")if(this.leftPage!=null)this.leftPage.simpleDraw(0);if(this.rightPage!=null)this.rightPage.simpleDraw(1);if(this.bottomPage!=null)this.bottomPage.draw();this.drawBookShadow();if(this.flippingPage!=null)this.flippingPage.draw();if(this.shadow!=null){this.drawOuterShadow();this.drawInnerShadow();}const rect=this.getRect();if(this.orientation==="portrait"){this.ctx.beginPath();this.ctx.rect(rect.left+rect.pageWidth,rect.top,rect.width,rect.height);this.ctx.clip();}}drawBookShadow(){const rect=this.getRect();this.ctx.save();this.ctx.beginPath();const shadowSize=rect.width/20;this.ctx.rect(rect.left,rect.top,rect.width,rect.height);const shadowPos={x:rect.left+rect.width/2-shadowSize/2,y:0};this.ctx.translate(shadowPos.x,shadowPos.y);const outerGradient=this.ctx.createLinearGradient(0,0,shadowSize,0);outerGradient.addColorStop(0,'rgba(0, 0, 0, 0)');outerGradient.addColorStop(0.4,'rgba(0, 0, 0, 0.2)');outerGradient.addColorStop(0.49,'rgba(0, 0, 0, 0.1)');outerGradient.addColorStop(0.5,'rgba(0, 0, 0, 0.5)');outerGradient.addColorStop(0.51,'rgba(0, 0, 0, 0.4)');outerGradient.addColorStop(1,'rgba(0, 0, 0, 0)');this.ctx.clip();this.ctx.fillStyle=outerGradient;this.ctx.fillRect(0,0,shadowSize,rect.height*2);this.ctx.restore();}drawOuterShadow(){const rect=this.getRect();this.ctx.save();this.ctx.beginPath();this.ctx.rect(rect.left,rect.top,rect.width,rect.height);const shadowPos=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y});this.ctx.translate(shadowPos.x,shadowPos.y);this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);const outerGradient=this.ctx.createLinearGradient(0,0,this.shadow.width,0);if(this.shadow.direction===0){this.ctx.translate(0,-100);outerGradient.addColorStop(0,'rgba(0, 0, 0, '+this.shadow.opacity+')');outerGradient.addColorStop(1,'rgba(0, 0, 0, 0)');}else{this.ctx.translate(-this.shadow.width,-100);outerGradient.addColorStop(0,'rgba(0, 0, 0, 0)');outerGradient.addColorStop(1,'rgba(0, 0, 0, '+this.shadow.opacity+')');}this.ctx.clip();this.ctx.fillStyle=outerGradient;this.ctx.fillRect(0,0,this.shadow.width,rect.height*2);this.ctx.restore();}drawInnerShadow(){const rect=this.getRect();this.ctx.save();this.ctx.beginPath();const shadowPos=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y});const pageRect=this.convertRectToGlobal(this.pageRect);this.ctx.moveTo(pageRect.topLeft.x,pageRect.topLeft.y);this.ctx.lineTo(pageRect.topRight.x,pageRect.topRight.y);this.ctx.lineTo(pageRect.bottomRight.x,pageRect.bottomRight.y);this.ctx.lineTo(pageRect.bottomLeft.x,pageRect.bottomLeft.y);this.ctx.translate(shadowPos.x,shadowPos.y);this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);const isw=this.shadow.width*3/4;const innerGradient=this.ctx.createLinearGradient(0,0,isw,0);if(this.shadow.direction===0){this.ctx.translate(-isw,-100);innerGradient.addColorStop(1,'rgba(0, 0, 0, '+this.shadow.opacity+')');innerGradient.addColorStop(0.9,'rgba(0, 0, 0, 0.05)');innerGradient.addColorStop(0.7,'rgba(0, 0, 0, '+this.shadow.opacity+')');innerGradient.addColorStop(0,'rgba(0, 0, 0, 0)');}else{this.ctx.translate(0,-100);innerGradient.addColorStop(0,'rgba(0, 0, 0, '+this.shadow.opacity+')');innerGradient.addColorStop(0.1,'rgba(0, 0, 0, 0.05)');innerGradient.addColorStop(0.3,'rgba(0, 0, 0, '+this.shadow.opacity+')');innerGradient.addColorStop(1,'rgba(0, 0, 0, 0)');}this.ctx.clip();this.ctx.fillStyle=innerGradient;this.ctx.fillRect(0,0,isw,rect.height*2);this.ctx.restore();}clear(){this.ctx.fillStyle='white';this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);}}class UI{constructor(inBlock,app,setting){this.touchPoint=null;this.swipeTimeout=250;this.onResize=()=>{this.update();};this.onMouseDown=e=>{if(this.checkTarget(e.target)){const pos=this.getMousePos(e.clientX,e.clientY);this.app.startUserTouch(pos);e.preventDefault();}};this.onTouchStart=e=>{if(this.checkTarget(e.target)){if(e.changedTouches.length>0){const t=e.changedTouches[0];const pos=this.getMousePos(t.clientX,t.clientY);this.touchPoint={point:pos,time:Date.now()};setTimeout(()=>{if(this.touchPoint!==null){this.app.startUserTouch(pos);}},this.swipeTimeout);if(!this.app.getSettings().mobileScrollSupport)e.preventDefault();}}};this.onMouseUp=e=>{const pos=this.getMousePos(e.clientX,e.clientY);this.app.userStop(pos);};this.onMouseMove=e=>{const pos=this.getMousePos(e.clientX,e.clientY);this.app.userMove(pos,false);};this.onTouchMove=e=>{if(e.changedTouches.length>0){const t=e.changedTouches[0];const pos=this.getMousePos(t.clientX,t.clientY);if(this.app.getSettings().mobileScrollSupport){if(this.touchPoint!==null){if(Math.abs(this.touchPoint.point.x-pos.x)>10||this.app.getState()!=="read"){if(e.cancelable)this.app.userMove(pos,true);}}if(this.app.getState()!=="read"){e.preventDefault();}}else{this.app.userMove(pos,true);}}};this.onTouchEnd=e=>{if(e.changedTouches.length>0){const t=e.changedTouches[0];const pos=this.getMousePos(t.clientX,t.clientY);let isSwipe=false;if(this.touchPoint!==null){const dx=pos.x-this.touchPoint.point.x;const distY=Math.abs(pos.y-this.touchPoint.point.y);if(Math.abs(dx)>this.swipeDistance&&distY<this.swipeDistance*2&&Date.now()-this.touchPoint.time<this.swipeTimeout){if(dx>0){this.app.flipPrev(this.touchPoint.point.y<this.app.getRender().getRect().height/2?"top":"bottom");}else{this.app.flipNext(this.touchPoint.point.y<this.app.getRender().getRect().height/2?"top":"bottom");}isSwipe=true;}this.touchPoint=null;}this.app.userStop(pos,isSwipe);}};this.parentElement=inBlock;inBlock.classList.add('stf__parent');inBlock.insertAdjacentHTML('afterbegin','<div class="stf__wrapper"></div>');this.wrapper=inBlock.querySelector('.stf__wrapper');this.app=app;const k=this.app.getSettings().usePortrait?1:2;inBlock.style.minWidth=setting.minWidth*k+'px';inBlock.style.minHeight=setting.minHeight+'px';if(setting.size==="fixed"){inBlock.style.minWidth=setting.width*k+'px';inBlock.style.minHeight=setting.height+'px';}if(setting.autoSize){inBlock.style.width='100%';inBlock.style.maxWidth=setting.maxWidth*2+'px';}inBlock.style.display='block';window.addEventListener('resize',this.onResize,false);this.swipeDistance=setting.swipeDistance;}destroy(){if(this.app.getSettings().useMouseEvents)this.removeHandlers();this.distElement.remove();this.wrapper.remove();}getDistElement(){return this.distElement;}getWrapper(){return this.wrapper;}setOrientationStyle(orientation){this.wrapper.classList.remove('--portrait','--landscape');if(orientation==="portrait"){if(this.app.getSettings().autoSize)this.wrapper.style.paddingBottom=this.app.getSettings().height/this.app.getSettings().width*100+'%';this.wrapper.classList.add('--portrait');}else{if(this.app.getSettings().autoSize)this.wrapper.style.paddingBottom=this.app.getSettings().height/(this.app.getSettings().width*2)*100+'%';this.wrapper.classList.add('--landscape');}this.update();}removeHandlers(){window.removeEventListener('resize',this.onResize);this.distElement.removeEventListener('mousedown',this.onMouseDown);this.distElement.removeEventListener('touchstart',this.onTouchStart);window.removeEventListener('mousemove',this.onMouseMove);window.removeEventListener('touchmove',this.onTouchMove);window.removeEventListener('mouseup',this.onMouseUp);window.removeEventListener('touchend',this.onTouchEnd);}setHandlers(){window.addEventListener('resize',this.onResize,false);if(!this.app.getSettings().useMouseEvents)return;this.distElement.addEventListener('mousedown',this.onMouseDown);this.distElement.addEventListener('touchstart',this.onTouchStart);window.addEventListener('mousemove',this.onMouseMove);window.addEventListener('touchmove',this.onTouchMove,{passive:!this.app.getSettings().mobileScrollSupport});window.addEventListener('mouseup',this.onMouseUp);window.addEventListener('touchend',this.onTouchEnd);}getMousePos(x,y){const rect=this.distElement.getBoundingClientRect();return{x:x-rect.left,y:y-rect.top};}checkTarget(targer){if(!this.app.getSettings().clickEventForward)return true;if(['a','button'].includes(targer.tagName.toLowerCase())){return false;}return true;}}class HTMLUI extends UI{constructor(inBlock,app,setting,items){super(inBlock,app,setting);this.wrapper.insertAdjacentHTML('afterbegin','<div class="stf__block"></div>');this.distElement=inBlock.querySelector('.stf__block');this.items=items;for(const item of items){this.distElement.appendChild(item);}this.setHandlers();}clear(){for(const item of this.items){this.parentElement.appendChild(item);}}updateItems(items){this.removeHandlers();this.distElement.innerHTML='';for(const item of items){this.distElement.appendChild(item);}this.items=items;this.setHandlers();}update(){this.app.getRender().update();}}class CanvasUI extends UI{constructor(inBlock,app,setting){super(inBlock,app,setting);this.wrapper.innerHTML='<canvas class="stf__canvas"></canvas>';this.canvas=inBlock.querySelectorAll('canvas')[0];this.distElement=this.canvas;this.resizeCanvas();this.setHandlers();}resizeCanvas(){const cs=getComputedStyle(this.canvas);const width=parseInt(cs.getPropertyValue('width'),10);const height=parseInt(cs.getPropertyValue('height'),10);this.canvas.width=width;this.canvas.height=height;}getCanvas(){return this.canvas;}update(){this.resizeCanvas();this.app.getRender().update();}}class EventObject{constructor(){this.events=new Map();}on(eventName,callback){if(!this.events.has(eventName)){this.events.set(eventName,[callback]);}else{this.events.get(eventName).push(callback);}return this;}off(event){this.events.delete(event);}trigger(eventName,app){let data=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;if(!this.events.has(eventName))return;for(const callback of this.events.get(eventName)){callback({data,object:app});}}}class HTMLRender extends Render{constructor(app,setting,element){super(app,setting);this.outerShadow=null;this.innerShadow=null;this.hardShadow=null;this.hardInnerShadow=null;this.element=element;this.createShadows();}createShadows(){this.element.insertAdjacentHTML('beforeend',`<div class="stf__outerShadow"></div>
             <div class="stf__innerShadow"></div>
             <div class="stf__hardShadow"></div>
             <div class="stf__hardInnerShadow"></div>`);this.outerShadow=this.element.querySelector('.stf__outerShadow');this.innerShadow=this.element.querySelector('.stf__innerShadow');this.hardShadow=this.element.querySelector('.stf__hardShadow');this.hardInnerShadow=this.element.querySelector('.stf__hardInnerShadow');}clearShadow(){super.clearShadow();this.outerShadow.style.cssText='display: none';this.innerShadow.style.cssText='display: none';this.hardShadow.style.cssText='display: none';this.hardInnerShadow.style.cssText='display: none';}reload(){const testShadow=this.element.querySelector('.stf__outerShadow');if(!testShadow){this.createShadows();}}drawHardInnerShadow(){const rect=this.getRect();const progress=this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress;let innerShadowSize=(100-progress)*(2.5*rect.pageWidth)/100+20;if(innerShadowSize>rect.pageWidth)innerShadowSize=rect.pageWidth;let newStyle=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+5).toString(10)};
            width: ${innerShadowSize}px;
            height: ${rect.height}px;
            background: linear-gradient(to right,
                rgba(0, 0, 0, ${this.shadow.opacity*progress/100}) 5%,
                rgba(0, 0, 0, 0) 100%);
            left: ${rect.left+rect.width/2}px;
            transform-origin: 0 0;
        `;newStyle+=this.getDirection()===0&&this.shadow.progress>100||this.getDirection()===1&&this.shadow.progress<=100?`transform: translate3d(0, 0, 0);`:`transform: translate3d(0, 0, 0) rotateY(180deg);`;this.hardInnerShadow.style.cssText=newStyle;}drawHardOuterShadow(){const rect=this.getRect();const progress=this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress;let shadowSize=(100-progress)*(2.5*rect.pageWidth)/100+20;if(shadowSize>rect.pageWidth)shadowSize=rect.pageWidth;let newStyle=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+4).toString(10)};
            width: ${shadowSize}px;
            height: ${rect.height}px;
            background: linear-gradient(to left, rgba(0, 0, 0, ${this.shadow.opacity}) 5%, rgba(0, 0, 0, 0) 100%);
            left: ${rect.left+rect.width/2}px;
            transform-origin: 0 0;
        `;newStyle+=this.getDirection()===0&&this.shadow.progress>100||this.getDirection()===1&&this.shadow.progress<=100?`transform: translate3d(0, 0, 0) rotateY(180deg);`:`transform: translate3d(0, 0, 0);`;this.hardShadow.style.cssText=newStyle;}drawInnerShadow(){const rect=this.getRect();const innerShadowSize=this.shadow.width*3/4;const shadowTranslate=this.getDirection()===0?innerShadowSize:0;const shadowDirection=this.getDirection()===0?'to left':'to right';const shadowPos=this.convertToGlobal(this.shadow.pos);const angle=this.shadow.angle+3*Math.PI/2;const clip=[this.pageRect.topLeft,this.pageRect.topRight,this.pageRect.bottomRight,this.pageRect.bottomLeft];let polygon='polygon( ';for(const p of clip){let g=this.getDirection()===1?{x:-p.x+this.shadow.pos.x,y:p.y-this.shadow.pos.y}:{x:p.x-this.shadow.pos.x,y:p.y-this.shadow.pos.y};g=Helper.GetRotatedPoint(g,{x:shadowTranslate,y:100},angle);polygon+=g.x+'px '+g.y+'px, ';}polygon=polygon.slice(0,-2);polygon+=')';const newStyle=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+10).toString(10)};
            width: ${innerShadowSize}px;
            height: ${rect.height*2}px;
            background: linear-gradient(${shadowDirection},
                rgba(0, 0, 0, ${this.shadow.opacity}) 5%,
                rgba(0, 0, 0, 0.05) 15%,
                rgba(0, 0, 0, ${this.shadow.opacity}) 35%,
                rgba(0, 0, 0, 0) 100%);
            transform-origin: ${shadowTranslate}px 100px;
            transform: translate3d(${shadowPos.x-shadowTranslate}px, ${shadowPos.y-100}px, 0) rotate(${angle}rad);
            clip-path: ${polygon};
            -webkit-clip-path: ${polygon};
        `;this.innerShadow.style.cssText=newStyle;}drawOuterShadow(){const rect=this.getRect();const shadowPos=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y});const angle=this.shadow.angle+3*Math.PI/2;const shadowTranslate=this.getDirection()===1?this.shadow.width:0;const shadowDirection=this.getDirection()===0?'to right':'to left';const clip=[{x:0,y:0},{x:rect.pageWidth,y:0},{x:rect.pageWidth,y:rect.height},{x:0,y:rect.height}];let polygon='polygon( ';for(const p of clip){if(p!==null){let g=this.getDirection()===1?{x:-p.x+this.shadow.pos.x,y:p.y-this.shadow.pos.y}:{x:p.x-this.shadow.pos.x,y:p.y-this.shadow.pos.y};g=Helper.GetRotatedPoint(g,{x:shadowTranslate,y:100},angle);polygon+=g.x+'px '+g.y+'px, ';}}polygon=polygon.slice(0,-2);polygon+=')';const newStyle=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+10).toString(10)};
            width: ${this.shadow.width}px;
            height: ${rect.height*2}px;
            background: linear-gradient(${shadowDirection}, rgba(0, 0, 0, ${this.shadow.opacity}), rgba(0, 0, 0, 0));
            transform-origin: ${shadowTranslate}px 100px;
            transform: translate3d(${shadowPos.x-shadowTranslate}px, ${shadowPos.y-100}px, 0) rotate(${angle}rad);
            clip-path: ${polygon};
            -webkit-clip-path: ${polygon};
        `;this.outerShadow.style.cssText=newStyle;}drawLeftPage(){if(this.orientation==="portrait"||this.leftPage===null)return;if(this.direction===1&&this.flippingPage!==null&&this.flippingPage.getDrawingDensity()==="hard"){const angle=this.flippingPage.getHardAngle();if(angle<-90){this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10);this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle());this.leftPage.draw(this.flippingPage.getDrawingDensity());}else{this.leftPage.getElement().style.display="none";}}else{this.leftPage.simpleDraw(0);}}drawRightPage(){if(this.rightPage===null)return;if(this.direction===0&&this.flippingPage!==null&&this.flippingPage.getDrawingDensity()==="hard"){const angle=this.flippingPage.getHardAngle();if(angle>90){this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10);this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle());this.rightPage.draw(this.flippingPage.getDrawingDensity());}else{this.rightPage.getElement().style.display="none";}}else{this.rightPage.simpleDraw(1);}}drawBottomPage(){if(this.bottomPage===null)return;const tempDensity=this.flippingPage!=null?this.flippingPage.getDrawingDensity():null;if(!(this.orientation==="portrait"&&this.direction===1)){this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10);this.bottomPage.draw(tempDensity);}}drawFrame(){if(this.flippingPage!==null){if(this.flippingPage.getHardAngle()===this.lastAngle){return;}this.lastAngle=this.flippingPage.getHardAngle();}else{this.lastAngle=-1234;}this.clear();this.drawLeftPage();this.drawRightPage();this.drawBottomPage();if(this.flippingPage!=null){const angle=this.flippingPage.state.hardDrawingAngle;if(angle<=90){this.flippingPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10);this.flippingPage.draw();}else{this.flippingPage.getElement().style.display="none";}}if(this.shadow!=null&&this.flippingPage!==null){if(this.flippingPage.getDrawingDensity()==="soft"){this.drawOuterShadow();this.drawInnerShadow();}else{this.drawHardOuterShadow();this.drawHardInnerShadow();}}}clear(){for(const page of this.app.getPageCollection().getPages()){if(page!==this.leftPage&&page!==this.rightPage&&page!==this.flippingPage&&page!==this.bottomPage){const style=page.getElement().style;if(style.display!=='none'){style.cssText='display: none';}}if(page.getTemporaryCopy()!==this.flippingPage){page.hideTemporaryCopy();}}}update(){super.update();if(this.rightPage!==null){this.rightPage.setOrientation(1);}if(this.leftPage!==null){this.leftPage.setOrientation(0);}}}class Settings{constructor(){this._default={startPage:0,size:"fixed",width:0,height:0,minWidth:0,maxWidth:0,minHeight:0,maxHeight:0,drawShadow:true,flippingTime:1000,usePortrait:true,startZIndex:0,autoSize:true,maxShadowOpacity:1,showCover:false,mobileScrollSupport:true,swipeDistance:30,clickEventForward:true,useMouseEvents:true,showPageCorners:true,disableFlipByClick:false};}getSettings(userSetting){const result=this._default;Object.assign(result,userSetting);if(result.size!=="stretch"&&result.size!=="fixed")throw new Error('Invalid size type. Available only "fixed" and "stretch" value');if(result.width<=0||result.height<=0)throw new Error('Invalid width or height');if(result.flippingTime<=0)throw new Error('Invalid flipping time');if(result.size==="stretch"){if(result.minWidth<=0)result.minWidth=100;if(result.maxWidth<result.minWidth)result.maxWidth=2000;if(result.minHeight<=0)result.minHeight=100;if(result.maxHeight<result.minHeight)result.maxHeight=2000;}else{result.minWidth=result.width;result.maxWidth=result.width;result.minHeight=result.height;result.maxHeight=result.height;}return result;}}function styleInject(css,ref){if(ref===void 0)ref={};var insertAt=ref.insertAt;if(!css||typeof document==='undefined'){return;}var head=document.head||document.getElementsByTagName('head')[0];var style=document.createElement('style');style.type='text/css';if(insertAt==='top'){if(head.firstChild){head.insertBefore(style,head.firstChild);}else{head.appendChild(style);}}else{head.appendChild(style);}if(style.styleSheet){style.styleSheet.cssText=css;}else{style.appendChild(document.createTextNode(css));}}var css_248z=".stf__parent {\n  position: relative;\n  display: block;\n  box-sizing: border-box;\n  transform: translateZ(0);\n\n  -ms-touch-action: pan-y;\n  touch-action: pan-y;\n}\n\n.sft__wrapper {\n  position: relative;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.stf__parent canvas {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n}\n\n.stf__block {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  perspective: 2000px;\n}\n\n.stf__item {\n  display: none;\n  position: absolute;\n  transform-style: preserve-3d;\n}\n\n.stf__outerShadow {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n\n.stf__innerShadow {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n\n.stf__hardShadow {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n\n.stf__hardInnerShadow {\n  position: absolute;\n  left: 0;\n  top: 0;\n}";styleInject(css_248z);class PageFlip extends EventObject{constructor(inBlock,setting){super();this.isUserTouch=false;this.isUserMove=false;this.setting=null;this.pages=null;this.setting=new Settings().getSettings(setting);this.block=inBlock;}destroy(){this.render.ngxZone=undefined;this.ui.destroy();this.render=undefined;}update(){this.render.update();this.pages.show();}loadFromImages(imagesHref){this.ui=new CanvasUI(this.block,this,this.setting);const canvas=this.ui.getCanvas();this.render=new CanvasRender(this,this.setting,canvas);this.flipController=new Flip(this.render,this);this.pages=new ImagePageCollection(this,this.render,imagesHref);this.pages.load();this.render.start();this.pages.show(this.setting.startPage);setTimeout(()=>{this.ui.update();this.trigger('init',this,{page:this.setting.startPage,mode:this.render.getOrientation()});},1);}loadFromHTML(items){this.ui=new HTMLUI(this.block,this,this.setting,items);this.render=new HTMLRender(this,this.setting,this.ui.getDistElement());this.flipController=new Flip(this.render,this);this.pages=new HTMLPageCollection(this,this.render,this.ui.getDistElement(),items);this.pages.load();this.render.start();this.pages.show(this.setting.startPage);setTimeout(()=>{this.ui.update();this.trigger('init',this,{page:this.setting.startPage,mode:this.render.getOrientation()});},1);}updateFromImages(imagesHref){const current=this.pages.getCurrentPageIndex();this.pages.destroy();this.pages=new ImagePageCollection(this,this.render,imagesHref);this.pages.load();this.pages.show(current);this.trigger('update',this,{page:current,mode:this.render.getOrientation()});}updateFromHtml(items){const current=this.pages.getCurrentPageIndex();this.pages.destroy();this.pages=new HTMLPageCollection(this,this.render,this.ui.getDistElement(),items);this.pages.load();this.ui.updateItems(items);this.render.reload();this.pages.show(current);this.trigger('update',this,{page:current,mode:this.render.getOrientation()});}clear(){this.pages.destroy();this.ui.clear();}turnToPrevPage(){this.pages.showPrev();}turnToNextPage(){this.pages.showNext();}turnToPage(page){this.pages.show(page);}flipNext(){let corner=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"top";this.flipController.flipNext(corner);}flipPrev(){let corner=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"top";this.flipController.flipPrev(corner);}flip(page){let corner=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"top";this.flipController.flipToPage(page,corner);}updateState(newState){this.trigger('changeState',this,newState);}updatePageIndex(newPage){this.trigger('flip',this,newPage);}updateOrientation(newOrientation){this.ui.setOrientationStyle(newOrientation);this.update();this.trigger('changeOrientation',this,newOrientation);}getPageCount(){return this.pages.getPageCount();}getCurrentPageIndex(){return this.pages.getCurrentPageIndex();}getPage(pageIndex){return this.pages.getPage(pageIndex);}getRender(){return this.render;}getFlipController(){return this.flipController;}getOrientation(){return this.render.getOrientation();}getBoundsRect(){return this.render.getRect();}getSettings(){return this.setting;}getUI(){return this.ui;}getState(){return this.flipController.getState();}getPageCollection(){return this.pages;}startUserTouch(pos){this.mousePosition=pos;this.isUserTouch=true;this.isUserMove=false;}userMove(pos,isTouch){if(!this.isUserTouch&&!isTouch&&this.setting.showPageCorners){this.flipController.showCorner(pos);}else if(this.isUserTouch){if(Helper.GetDistanceBetweenTwoPoint(this.mousePosition,pos)>5){this.isUserMove=true;this.flipController.fold(pos);}}}userStop(pos){let isSwipe=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(this.isUserTouch){this.isUserTouch=false;if(!isSwipe){if(!this.isUserMove)this.flipController.flip(pos);else this.flipController.stopMove();}}}}
;// CONCATENATED MODULE: ./web/annotation_editor_layer_builder.js
function annotation_editor_layer_builder_classPrivateFieldInitSpec(e,t,a){annotation_editor_layer_builder_checkPrivateRedeclaration(e,t),t.set(e,a);}function annotation_editor_layer_builder_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function annotation_editor_layer_builder_classPrivateFieldGet(s,a){return s.get(annotation_editor_layer_builder_assertClassBrand(s,a));}function annotation_editor_layer_builder_classPrivateFieldSet(s,a,r){return s.set(annotation_editor_layer_builder_assertClassBrand(s,a),r),r;}function annotation_editor_layer_builder_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _annotationLayer=/*#__PURE__*/new WeakMap();var _drawLayer=/*#__PURE__*/new WeakMap();var _onAppend=/*#__PURE__*/new WeakMap();var _textLayer=/*#__PURE__*/new WeakMap();var annotation_editor_layer_builder_uiManager=/*#__PURE__*/new WeakMap();class AnnotationEditorLayerBuilder{constructor(options){annotation_editor_layer_builder_classPrivateFieldInitSpec(this,_annotationLayer,null);annotation_editor_layer_builder_classPrivateFieldInitSpec(this,_drawLayer,null);annotation_editor_layer_builder_classPrivateFieldInitSpec(this,_onAppend,null);annotation_editor_layer_builder_classPrivateFieldInitSpec(this,_textLayer,null);annotation_editor_layer_builder_classPrivateFieldInitSpec(this,annotation_editor_layer_builder_uiManager,void 0);this.pdfPage=options.pdfPage;this.accessibilityManager=options.accessibilityManager;this.l10n=options.l10n;this.l10n||=new genericl10n_GenericL10n();this.annotationEditorLayer=null;this.div=null;this._cancelled=false;annotation_editor_layer_builder_classPrivateFieldSet(annotation_editor_layer_builder_uiManager,this,options.uiManager);annotation_editor_layer_builder_classPrivateFieldSet(_annotationLayer,this,options.annotationLayer||null);annotation_editor_layer_builder_classPrivateFieldSet(_textLayer,this,options.textLayer||null);annotation_editor_layer_builder_classPrivateFieldSet(_drawLayer,this,options.drawLayer||null);annotation_editor_layer_builder_classPrivateFieldSet(_onAppend,this,options.onAppend||null);this.eventBus=options.eventBus;}async render(viewport){let intent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"display";if(intent!=="display"){return;}if(this._cancelled){return;}const clonedViewport=viewport.clone({dontFlip:true});if(this.div){this.annotationEditorLayer.update({viewport:clonedViewport});this.show();return;}const div=this.div=document.createElement("div");div.className="annotationEditorLayer";div.hidden=true;div.dir=annotation_editor_layer_builder_classPrivateFieldGet(annotation_editor_layer_builder_uiManager,this).direction;annotation_editor_layer_builder_classPrivateFieldGet(_onAppend,this)?.call(this,div);this.annotationEditorLayer=new AnnotationEditorLayer({uiManager:annotation_editor_layer_builder_classPrivateFieldGet(annotation_editor_layer_builder_uiManager,this),div,accessibilityManager:this.accessibilityManager,pageIndex:this.pdfPage.pageNumber-1,l10n:this.l10n,viewport:clonedViewport,annotationLayer:annotation_editor_layer_builder_classPrivateFieldGet(_annotationLayer,this),textLayer:annotation_editor_layer_builder_classPrivateFieldGet(_textLayer,this),drawLayer:annotation_editor_layer_builder_classPrivateFieldGet(_drawLayer,this),eventBus:this.eventBus});const parameters={viewport:clonedViewport,div,annotations:null,intent};this.annotationEditorLayer.render(parameters);this.show();}cancel(){this._cancelled=true;if(!this.div){return;}this.annotationEditorLayer.destroy();}hide(){if(!this.div){return;}this.div.hidden=true;}show(){if(!this.div||this.annotationEditorLayer.isInvisible){return;}this.div.hidden=false;}}
;// CONCATENATED MODULE: ./web/annotation_layer_builder.js
function annotation_layer_builder_classPrivateMethodInitSpec(e,a){annotation_layer_builder_checkPrivateRedeclaration(e,a),a.add(e);}function annotation_layer_builder_classPrivateFieldInitSpec(e,t,a){annotation_layer_builder_checkPrivateRedeclaration(e,t),t.set(e,a);}function annotation_layer_builder_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function annotation_layer_builder_classPrivateFieldGet(s,a){return s.get(annotation_layer_builder_assertClassBrand(s,a));}function annotation_layer_builder_classPrivateFieldSet(s,a,r){return s.set(annotation_layer_builder_assertClassBrand(s,a),r),r;}function annotation_layer_builder_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var annotation_layer_builder_onAppend=/*#__PURE__*/new WeakMap();var annotation_layer_builder_eventAbortController=/*#__PURE__*/new WeakMap();var _AnnotationLayerBuilder_brand=/*#__PURE__*/new WeakSet();class AnnotationLayerBuilder{constructor(_ref){let{pdfPage,linkService,downloadManager,annotationStorage=null,imageResourcesPath="",renderForms=true,enableScripting=false,hasJSActionsPromise=null,fieldObjectsPromise=null,annotationCanvasMap=null,accessibilityManager=null,annotationEditorUIManager=null,onAppend=null}=_ref;annotation_layer_builder_classPrivateMethodInitSpec(this,_AnnotationLayerBuilder_brand);annotation_layer_builder_classPrivateFieldInitSpec(this,annotation_layer_builder_onAppend,null);annotation_layer_builder_classPrivateFieldInitSpec(this,annotation_layer_builder_eventAbortController,null);this.pdfPage=pdfPage;this.linkService=linkService;this.downloadManager=downloadManager;this.imageResourcesPath=imageResourcesPath;this.renderForms=renderForms;this.annotationStorage=annotationStorage;this.enableScripting=enableScripting;this._hasJSActionsPromise=hasJSActionsPromise||Promise.resolve(false);this._fieldObjectsPromise=fieldObjectsPromise||Promise.resolve(null);this._annotationCanvasMap=annotationCanvasMap;this._accessibilityManager=accessibilityManager;this._annotationEditorUIManager=annotationEditorUIManager;annotation_layer_builder_classPrivateFieldSet(annotation_layer_builder_onAppend,this,onAppend);this.annotationLayer=null;this.div=null;this._cancelled=false;this._eventBus=linkService.eventBus;}async render(viewport){let intent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"display";if(this.div){if(this._cancelled||!this.annotationLayer){return;}this.annotationLayer.update({viewport:viewport.clone({dontFlip:true})});return;}const[annotations,hasJSActions,fieldObjects]=await Promise.all([this.pdfPage.getAnnotations({intent}),this._hasJSActionsPromise,this._fieldObjectsPromise]);if(this._cancelled){return;}const div=this.div=document.createElement("div");div.className="annotationLayer";annotation_layer_builder_classPrivateFieldGet(annotation_layer_builder_onAppend,this)?.call(this,div);if(annotations.length===0){this.hide();return;}this.annotationLayer=new AnnotationLayer({div,accessibilityManager:this._accessibilityManager,annotationCanvasMap:this._annotationCanvasMap,annotationEditorUIManager:this._annotationEditorUIManager,page:this.pdfPage,viewport:viewport.clone({dontFlip:true})});await this.annotationLayer.render({annotations,imageResourcesPath:this.imageResourcesPath,renderForms:this.renderForms,linkService:this.linkService,downloadManager:this.downloadManager,annotationStorage:this.annotationStorage,enableScripting:this.enableScripting,hasJSActions,fieldObjects});if(this.linkService.isInPresentationMode){annotation_layer_builder_assertClassBrand(_AnnotationLayerBuilder_brand,this,_updatePresentationModeState).call(this,PresentationModeState.FULLSCREEN);}if(!annotation_layer_builder_classPrivateFieldGet(annotation_layer_builder_eventAbortController,this)){annotation_layer_builder_classPrivateFieldSet(annotation_layer_builder_eventAbortController,this,new AbortController());this._eventBus?._on("presentationmodechanged",evt=>{annotation_layer_builder_assertClassBrand(_AnnotationLayerBuilder_brand,this,_updatePresentationModeState).call(this,evt.state);},{signal:annotation_layer_builder_classPrivateFieldGet(annotation_layer_builder_eventAbortController,this).signal});}}cancel(){this._cancelled=true;annotation_layer_builder_classPrivateFieldGet(annotation_layer_builder_eventAbortController,this)?.abort();annotation_layer_builder_classPrivateFieldSet(annotation_layer_builder_eventAbortController,this,null);}hide(){if(!this.div){return;}if(!document.querySelector("[data-pdfjsprinting=true]")){this.div.hidden=true;}}}function _updatePresentationModeState(state){if(!this.div){return;}let disableFormElements=false;switch(state){case PresentationModeState.FULLSCREEN:disableFormElements=true;break;case PresentationModeState.NORMAL:break;default:return;}for(const section of this.div.childNodes){if(section.hasAttribute("data-internal-link")){continue;}section.inert=disableFormElements;}}
;// CONCATENATED MODULE: ./web/draw_layer_builder.js
function draw_layer_builder_classPrivateFieldInitSpec(e,t,a){draw_layer_builder_checkPrivateRedeclaration(e,t),t.set(e,a);}function draw_layer_builder_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function draw_layer_builder_classPrivateFieldSet(s,a,r){return s.set(draw_layer_builder_assertClassBrand(s,a),r),r;}function draw_layer_builder_classPrivateFieldGet(s,a){return s.get(draw_layer_builder_assertClassBrand(s,a));}function draw_layer_builder_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var draw_layer_builder_drawLayer=/*#__PURE__*/new WeakMap();class DrawLayerBuilder{constructor(options){draw_layer_builder_classPrivateFieldInitSpec(this,draw_layer_builder_drawLayer,null);this.pageIndex=options.pageIndex;}async render(){let intent=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"display";if(intent!=="display"||draw_layer_builder_classPrivateFieldGet(draw_layer_builder_drawLayer,this)||this._cancelled){return;}draw_layer_builder_classPrivateFieldSet(draw_layer_builder_drawLayer,this,new DrawLayer({pageIndex:this.pageIndex}));}cancel(){this._cancelled=true;if(!draw_layer_builder_classPrivateFieldGet(draw_layer_builder_drawLayer,this)){return;}draw_layer_builder_classPrivateFieldGet(draw_layer_builder_drawLayer,this).destroy();draw_layer_builder_classPrivateFieldSet(draw_layer_builder_drawLayer,this,null);}setParent(parent){draw_layer_builder_classPrivateFieldGet(draw_layer_builder_drawLayer,this)?.setParent(parent);}getDrawLayer(){return draw_layer_builder_classPrivateFieldGet(draw_layer_builder_drawLayer,this);}}
;// CONCATENATED MODULE: ./web/struct_tree_layer_builder.js
function struct_tree_layer_builder_classPrivateMethodInitSpec(e,a){struct_tree_layer_builder_checkPrivateRedeclaration(e,a),a.add(e);}function struct_tree_layer_builder_classPrivateFieldInitSpec(e,t,a){struct_tree_layer_builder_checkPrivateRedeclaration(e,t),t.set(e,a);}function struct_tree_layer_builder_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function struct_tree_layer_builder_classPrivateFieldSet(s,a,r){return s.set(struct_tree_layer_builder_assertClassBrand(s,a),r),r;}function struct_tree_layer_builder_classPrivateFieldGet(s,a){return s.get(struct_tree_layer_builder_assertClassBrand(s,a));}function struct_tree_layer_builder_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const PDF_ROLE_TO_HTML_ROLE={Document:null,DocumentFragment:null,Part:"group",Sect:"group",Div:"group",Aside:"note",NonStruct:"none",P:null,H:"heading",Title:null,FENote:"note",Sub:"group",Lbl:null,Span:null,Em:null,Strong:null,Link:"link",Annot:"note",Form:"form",Ruby:null,RB:null,RT:null,RP:null,Warichu:null,WT:null,WP:null,L:"list",LI:"listitem",LBody:null,Table:"table",TR:"row",TH:"columnheader",TD:"cell",THead:"columnheader",TBody:null,TFoot:null,Caption:null,Figure:"figure",Formula:null,Artifact:null};const HEADING_PATTERN=/^H(\d+)$/;var _treeDom=/*#__PURE__*/new WeakMap();var _StructTreeLayerBuilder_brand=/*#__PURE__*/new WeakSet();class StructTreeLayerBuilder{constructor(){struct_tree_layer_builder_classPrivateMethodInitSpec(this,_StructTreeLayerBuilder_brand);struct_tree_layer_builder_classPrivateFieldInitSpec(this,_treeDom,undefined);}get renderingDone(){return struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this)!==undefined;}render(structTree){if(struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this)!==undefined){return struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this);}const treeDom=struct_tree_layer_builder_assertClassBrand(_StructTreeLayerBuilder_brand,this,_walk).call(this,structTree);treeDom?.classList.add("structTree");return struct_tree_layer_builder_classPrivateFieldSet(_treeDom,this,treeDom);}hide(){if(struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this)&&!struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this).hidden){struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this).hidden=true;}}show(){if(struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this)?.hidden){struct_tree_layer_builder_classPrivateFieldGet(_treeDom,this).hidden=false;}}}function _setAttributes(structElement,htmlElement){const{alt,id,lang}=structElement;if(alt!==undefined){htmlElement.setAttribute("aria-label",removeNullCharacters(alt));}if(id!==undefined){htmlElement.setAttribute("aria-owns",id);}if(lang!==undefined){htmlElement.setAttribute("lang",removeNullCharacters(lang,true));}}function _walk(node){if(!node){return null;}const element=document.createElement("span");if("role"in node){const{role}=node;const match=role.match(HEADING_PATTERN);if(match){element.setAttribute("role","heading");element.setAttribute("aria-level",match[1]);}else if(PDF_ROLE_TO_HTML_ROLE[role]){element.setAttribute("role",PDF_ROLE_TO_HTML_ROLE[role]);}}struct_tree_layer_builder_assertClassBrand(_StructTreeLayerBuilder_brand,this,_setAttributes).call(this,node,element);if(node.children){if(node.children.length===1&&"id"in node.children[0]){struct_tree_layer_builder_assertClassBrand(_StructTreeLayerBuilder_brand,this,_setAttributes).call(this,node.children[0],element);}else{for(const kid of node.children){element.append(struct_tree_layer_builder_assertClassBrand(_StructTreeLayerBuilder_brand,this,_walk).call(this,kid));}}}return element;}
;// CONCATENATED MODULE: ./web/text_accessibility.js
function text_accessibility_classPrivateMethodInitSpec(e,a){text_accessibility_checkPrivateRedeclaration(e,a),a.add(e);}function text_accessibility_classPrivateFieldInitSpec(e,t,a){text_accessibility_checkPrivateRedeclaration(e,t),t.set(e,a);}function text_accessibility_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function text_accessibility_classPrivateFieldGet(s,a){return s.get(text_accessibility_assertClassBrand(s,a));}function text_accessibility_classPrivateFieldSet(s,a,r){return s.set(text_accessibility_assertClassBrand(s,a),r),r;}function text_accessibility_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _enabled=/*#__PURE__*/new WeakMap();var _textChildren=/*#__PURE__*/new WeakMap();var _textNodes=/*#__PURE__*/new WeakMap();var _waitingElements=/*#__PURE__*/new WeakMap();var _TextAccessibilityManager_brand=/*#__PURE__*/new WeakSet();class TextAccessibilityManager{constructor(){text_accessibility_classPrivateMethodInitSpec(this,_TextAccessibilityManager_brand);text_accessibility_classPrivateFieldInitSpec(this,_enabled,false);text_accessibility_classPrivateFieldInitSpec(this,_textChildren,null);text_accessibility_classPrivateFieldInitSpec(this,_textNodes,new Map());text_accessibility_classPrivateFieldInitSpec(this,_waitingElements,new Map());}setTextMapping(textDivs){text_accessibility_classPrivateFieldSet(_textChildren,this,textDivs);}enable(){if(text_accessibility_classPrivateFieldGet(_enabled,this)){throw new Error("TextAccessibilityManager is already enabled.");}if(!text_accessibility_classPrivateFieldGet(_textChildren,this)){throw new Error("Text divs and strings have not been set.");}text_accessibility_classPrivateFieldSet(_enabled,this,true);text_accessibility_classPrivateFieldSet(_textChildren,this,text_accessibility_classPrivateFieldGet(_textChildren,this).slice());text_accessibility_classPrivateFieldGet(_textChildren,this).sort(_compareElementPositions);if(text_accessibility_classPrivateFieldGet(_textNodes,this).size>0){const textChildren=text_accessibility_classPrivateFieldGet(_textChildren,this);for(const[id,nodeIndex]of text_accessibility_classPrivateFieldGet(_textNodes,this)){const element=document.getElementById(id);if(!element){text_accessibility_classPrivateFieldGet(_textNodes,this).delete(id);continue;}text_accessibility_assertClassBrand(_TextAccessibilityManager_brand,this,_addIdToAriaOwns).call(this,id,textChildren[nodeIndex]);}}for(const[element,isRemovable]of text_accessibility_classPrivateFieldGet(_waitingElements,this)){this.addPointerInTextLayer(element,isRemovable);}text_accessibility_classPrivateFieldGet(_waitingElements,this).clear();}disable(){if(!text_accessibility_classPrivateFieldGet(_enabled,this)){return;}text_accessibility_classPrivateFieldGet(_waitingElements,this).clear();text_accessibility_classPrivateFieldSet(_textChildren,this,null);text_accessibility_classPrivateFieldSet(_enabled,this,false);}removePointerInTextLayer(element){if(!text_accessibility_classPrivateFieldGet(_enabled,this)){text_accessibility_classPrivateFieldGet(_waitingElements,this).delete(element);return;}const children=text_accessibility_classPrivateFieldGet(_textChildren,this);if(!children||children.length===0){return;}const{id}=element;const nodeIndex=text_accessibility_classPrivateFieldGet(_textNodes,this).get(id);if(nodeIndex===undefined){return;}const node=children[nodeIndex];text_accessibility_classPrivateFieldGet(_textNodes,this).delete(id);let owns=node.getAttribute("aria-owns");if(owns?.includes(id)){owns=owns.split(" ").filter(x=>x!==id).join(" ");if(owns){node.setAttribute("aria-owns",owns);}else{node.removeAttribute("aria-owns");node.setAttribute("role","presentation");}}}addPointerInTextLayer(element,isRemovable){const{id}=element;if(!id){return null;}if(!text_accessibility_classPrivateFieldGet(_enabled,this)){text_accessibility_classPrivateFieldGet(_waitingElements,this).set(element,isRemovable);return null;}if(isRemovable){this.removePointerInTextLayer(element);}const children=text_accessibility_classPrivateFieldGet(_textChildren,this);if(!children||children.length===0){return null;}const index=binarySearchFirstItem(children,node=>_compareElementPositions.call(TextAccessibilityManager,element,node)<0);const nodeIndex=Math.max(0,index-1);const child=children[nodeIndex];text_accessibility_assertClassBrand(_TextAccessibilityManager_brand,this,_addIdToAriaOwns).call(this,id,child);text_accessibility_classPrivateFieldGet(_textNodes,this).set(id,nodeIndex);const parent=child.parentNode;return parent?.classList.contains("markedContent")?parent.id:null;}moveElementInDOM(container,element,contentElement,isRemovable){const id=this.addPointerInTextLayer(contentElement,isRemovable);if(!container.hasChildNodes()){container.append(element);return id;}const children=Array.from(container.childNodes).filter(node=>node!==element);if(children.length===0){return id;}const elementToCompare=contentElement||element;const index=binarySearchFirstItem(children,node=>_compareElementPositions.call(TextAccessibilityManager,elementToCompare,node)<0);if(index===0){children[0].before(element);}else{children[index-1].after(element);}return id;}}function _compareElementPositions(e1,e2){const rect1=e1.getBoundingClientRect();const rect2=e2.getBoundingClientRect();if(rect1.width===0&&rect1.height===0){return+1;}if(rect2.width===0&&rect2.height===0){return-1;}const top1=rect1.y;const bot1=rect1.y+rect1.height;const mid1=rect1.y+rect1.height/2;const top2=rect2.y;const bot2=rect2.y+rect2.height;const mid2=rect2.y+rect2.height/2;if(mid1<=top2&&mid2>=bot1){return-1;}if(mid2<=top1&&mid1>=bot2){return+1;}const centerX1=rect1.x+rect1.width/2;const centerX2=rect2.x+rect2.width/2;return centerX1-centerX2;}function _addIdToAriaOwns(id,node){const owns=node.getAttribute("aria-owns");if(!owns?.includes(id)){node.setAttribute("aria-owns",owns?`${owns} ${id}`:id);}node.removeAttribute("role");}
;// CONCATENATED MODULE: ./web/text_highlighter.js
function text_highlighter_classPrivateFieldInitSpec(e,t,a){text_highlighter_checkPrivateRedeclaration(e,t),t.set(e,a);}function text_highlighter_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function text_highlighter_classPrivateFieldSet(s,a,r){return s.set(text_highlighter_assertClassBrand(s,a),r),r;}function text_highlighter_classPrivateFieldGet(s,a){return s.get(text_highlighter_assertClassBrand(s,a));}function text_highlighter_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var text_highlighter_eventAbortController=/*#__PURE__*/new WeakMap();class TextHighlighter{constructor(_ref){let{findController,eventBus,pageIndex}=_ref;text_highlighter_classPrivateFieldInitSpec(this,text_highlighter_eventAbortController,null);this.findController=findController;this.matches=[];this.eventBus=eventBus;this.pageIdx=pageIndex;this.textDivs=null;this.textContentItemsStr=null;this.enabled=false;}setTextMapping(divs,texts){this.textDivs=divs;this.textContentItemsStr=texts;}enable(){if(!this.textDivs||!this.textContentItemsStr){throw new Error("Text divs and strings have not been set.");}if(this.enabled){return;}this.enabled=true;if(!text_highlighter_classPrivateFieldGet(text_highlighter_eventAbortController,this)){text_highlighter_classPrivateFieldSet(text_highlighter_eventAbortController,this,new AbortController());this.eventBus._on("updatetextlayermatches",evt=>{if(evt.pageIndex===this.pageIdx||evt.pageIndex===-1){this._updateMatches();}},{signal:text_highlighter_classPrivateFieldGet(text_highlighter_eventAbortController,this).signal});}this._updateMatches();}disable(){if(!this.enabled){return;}this.enabled=false;text_highlighter_classPrivateFieldGet(text_highlighter_eventAbortController,this)?.abort();text_highlighter_classPrivateFieldSet(text_highlighter_eventAbortController,this,null);this._updateMatches(true);}_convertMatches(matches,matchesLength){if(!matches){return[];}const{textContentItemsStr}=this;let i=0,iIndex=0;const end=textContentItemsStr.length-1;const result=[];for(let m=0,mm=matches.length;m<mm;m++){let matchIdx=matches[m];while(i!==end&&matchIdx>=iIndex+textContentItemsStr[i].length){iIndex+=textContentItemsStr[i].length;i++;}if(i===textContentItemsStr.length){globalThis.ngxConsole.error("Could not find a matching mapping");}const match={begin:{divIdx:i,offset:matchIdx-iIndex}};matchIdx+=matchesLength[m];while(i!==end&&matchIdx>iIndex+textContentItemsStr[i].length){iIndex+=textContentItemsStr[i].length;i++;}match.end={divIdx:i,offset:matchIdx-iIndex};result.push(match);}return result;}_renderMatches(matches){if(matches.length===0){return;}const{findController,pageIdx}=this;const{textContentItemsStr,textDivs}=this;const isSelectedPage=pageIdx===findController.selected.pageIdx;const selectedMatchIdx=findController.selected.matchIdx;const highlightAll=findController.state.highlightAll;let prevEnd=null;const infinity={divIdx:-1,offset:undefined};function beginText(begin,className){const divIdx=begin.divIdx;textDivs[divIdx].textContent="";return appendTextToDiv(divIdx,0,begin.offset,className);}function appendTextToDiv(divIdx,fromOffset,toOffset,className){let div=textDivs[divIdx];if(div.nodeType===Node.TEXT_NODE){const span=document.createElement("span");div.before(span);span.append(div);textDivs[divIdx]=span;div=span;}const content=textContentItemsStr[divIdx].substring(fromOffset,toOffset);const node=document.createTextNode(content);if(className){const span=document.createElement("span");span.className=`${className} appended`;span.append(node);div.append(span);return className.includes("selected")?span.offsetLeft:0;}div.append(node);return 0;}let i0=selectedMatchIdx,i1=i0+1;if(highlightAll){i0=0;i1=matches.length;}else if(!isSelectedPage){return;}let lastDivIdx=-1;let lastOffset=-1;for(let i=i0;i<i1;i++){const match=matches[i];const begin=match.begin;if(begin.divIdx===lastDivIdx&&begin.offset===lastOffset){continue;}lastDivIdx=begin.divIdx;lastOffset=begin.offset;const end=match.end;const isSelected=isSelectedPage&&i===selectedMatchIdx;const highlightSuffix=isSelected?" selected":"";let selectedLeft=0;if(!prevEnd||begin.divIdx!==prevEnd.divIdx){if(prevEnd!==null){appendTextToDiv(prevEnd.divIdx,prevEnd.offset,infinity.offset);}beginText(begin);}else{appendTextToDiv(prevEnd.divIdx,prevEnd.offset,begin.offset);}if(begin.divIdx===end.divIdx){selectedLeft=appendTextToDiv(begin.divIdx,begin.offset,end.offset,"highlight"+highlightSuffix);}else{selectedLeft=appendTextToDiv(begin.divIdx,begin.offset,infinity.offset,"highlight begin"+highlightSuffix);for(let n0=begin.divIdx+1,n1=end.divIdx;n0<n1;n0++){textDivs[n0].className="highlight middle"+highlightSuffix;}beginText(end,"highlight end"+highlightSuffix);}prevEnd=end;if(isSelected){findController.scrollMatchIntoView({element:textDivs[begin.divIdx],selectedLeft,pageIndex:pageIdx,matchIndex:selectedMatchIdx});}}if(prevEnd){appendTextToDiv(prevEnd.divIdx,prevEnd.offset,infinity.offset);}}_updateMatches(){let reset=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(!this.enabled&&!reset){return;}const{findController,matches,pageIdx}=this;const{textContentItemsStr,textDivs}=this;let clearedUntilDivIdx=-1;for(const match of matches){const begin=Math.max(clearedUntilDivIdx,match.begin.divIdx);for(let n=begin,end=match.end.divIdx;n<=end;n++){const div=textDivs[n];div.textContent=textContentItemsStr[n];div.className="";}clearedUntilDivIdx=match.end.divIdx+1;}if(!findController?.highlightMatches||reset){return;}const pageMatches=findController.pageMatches[pageIdx]||null;const pageMatchesLength=findController.pageMatchesLength[pageIdx]||null;this.matches=this._convertMatches(pageMatches,pageMatchesLength);this._renderMatches(this.matches);}}
;// CONCATENATED MODULE: ./web/text_layer_builder.js
var _TextLayerBuilder;function text_layer_builder_classPrivateMethodInitSpec(e,a){text_layer_builder_checkPrivateRedeclaration(e,a),a.add(e);}function text_layer_builder_classPrivateFieldInitSpec(e,t,a){text_layer_builder_checkPrivateRedeclaration(e,t),t.set(e,a);}function text_layer_builder_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function text_layer_builder_classPrivateFieldGet(s,a){return s.get(text_layer_builder_assertClassBrand(s,a));}function text_layer_builder_classPrivateFieldSet(s,a,r){return s.set(text_layer_builder_assertClassBrand(s,a),r),r;}function text_layer_builder_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _enablePermissions=/*#__PURE__*/new WeakMap();var text_layer_builder_onAppend=/*#__PURE__*/new WeakMap();var _renderingDone=/*#__PURE__*/new WeakMap();var text_layer_builder_textLayer=/*#__PURE__*/new WeakMap();var _TextLayerBuilder_brand=/*#__PURE__*/new WeakSet();class TextLayerBuilder{constructor(_ref){let{pdfPage,highlighter=null,accessibilityManager=null,enablePermissions=false,onAppend=null}=_ref;text_layer_builder_classPrivateMethodInitSpec(this,_TextLayerBuilder_brand);text_layer_builder_classPrivateFieldInitSpec(this,_enablePermissions,false);text_layer_builder_classPrivateFieldInitSpec(this,text_layer_builder_onAppend,null);text_layer_builder_classPrivateFieldInitSpec(this,_renderingDone,false);text_layer_builder_classPrivateFieldInitSpec(this,text_layer_builder_textLayer,null);this.pdfPage=pdfPage;this.highlighter=highlighter;this.accessibilityManager=accessibilityManager;text_layer_builder_classPrivateFieldSet(_enablePermissions,this,enablePermissions===true);text_layer_builder_classPrivateFieldSet(text_layer_builder_onAppend,this,onAppend);this.div=document.createElement("div");this.div.tabIndex=0;this.div.className="textLayer";}async render(viewport){let textContentParams=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;if(text_layer_builder_classPrivateFieldGet(_renderingDone,this)&&text_layer_builder_classPrivateFieldGet(text_layer_builder_textLayer,this)){text_layer_builder_classPrivateFieldGet(text_layer_builder_textLayer,this).update({viewport,onBefore:this.hide.bind(this)});this.show();return;}this.cancel();text_layer_builder_classPrivateFieldSet(text_layer_builder_textLayer,this,new TextLayer({textContentSource:this.pdfPage.streamTextContent(textContentParams||{includeMarkedContent:true,disableNormalization:true}),container:this.div,viewport}));const{textDivs,textContentItemsStr}=text_layer_builder_classPrivateFieldGet(text_layer_builder_textLayer,this);this.highlighter?.setTextMapping(textDivs,textContentItemsStr);this.accessibilityManager?.setTextMapping(textDivs);await text_layer_builder_classPrivateFieldGet(text_layer_builder_textLayer,this).render();text_layer_builder_assertClassBrand(_TextLayerBuilder_brand,this,_finishRendering).call(this);text_layer_builder_classPrivateFieldGet(text_layer_builder_onAppend,this)?.call(this,this.div);this.highlighter?.enable();this.accessibilityManager?.enable();}hide(){if(!this.div.hidden&&text_layer_builder_classPrivateFieldGet(_renderingDone,this)){this.highlighter?.disable();this.div.hidden=true;}}show(){if(this.div.hidden&&text_layer_builder_classPrivateFieldGet(_renderingDone,this)){this.div.hidden=false;this.highlighter?.enable();}}cancel(){text_layer_builder_classPrivateFieldGet(text_layer_builder_textLayer,this)?.cancel();text_layer_builder_classPrivateFieldSet(text_layer_builder_textLayer,this,null);this.highlighter?.disable();this.accessibilityManager?.disable();_removeGlobalSelectionListener.call(TextLayerBuilder,this.div);}}_TextLayerBuilder=TextLayerBuilder;function _finishRendering(){text_layer_builder_classPrivateFieldSet(_renderingDone,this,true);const endOfContent=document.createElement("div");endOfContent.className="endOfContent";this.div.append(endOfContent);text_layer_builder_assertClassBrand(_TextLayerBuilder_brand,this,_bindMouse).call(this,endOfContent);}function _bindMouse(end){const{div}=this;div.addEventListener("mousedown",evt=>{end.classList.add("active");});div.addEventListener("copy",event=>{if(!text_layer_builder_classPrivateFieldGet(_enablePermissions,this)){const selection=document.getSelection();event.clipboardData.setData("text/plain",removeNullCharacters(normalizeUnicode(selection.toString())));}event.preventDefault();event.stopPropagation();});_textLayers._.set(div,end);_enableGlobalSelectionListener.call(_TextLayerBuilder);}function _removeGlobalSelectionListener(textLayerDiv){text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.delete(textLayerDiv);if(text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.size===0){text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_selectionChangeAbortController)._?.abort();_selectionChangeAbortController._=text_layer_builder_assertClassBrand(_TextLayerBuilder,this,null);}}function _enableGlobalSelectionListener(){if(text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_selectionChangeAbortController)._){return;}_selectionChangeAbortController._=text_layer_builder_assertClassBrand(_TextLayerBuilder,this,new AbortController());const{signal}=text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_selectionChangeAbortController)._;const reset=(end,textLayer)=>{textLayer.append(end);end.style.width="";end.style.height="";end.classList.remove("active");};document.addEventListener("pointerup",()=>{text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.forEach(reset);},{signal});var isFirefox,prevRange;document.addEventListener("selectionchange",()=>{const selection=document.getSelection();if(selection.rangeCount===0){text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.forEach(reset);return;}if(text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.size===0){return;}const activeTextLayers=new Set();for(let i=0;i<selection.rangeCount;i++){const range=selection.getRangeAt(i);for(const textLayerDiv of text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.keys()){if(!activeTextLayers.has(textLayerDiv)&&range.intersectsNode(textLayerDiv)){activeTextLayers.add(textLayerDiv);}}}for(const[textLayerDiv,endDiv]of text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._){if(activeTextLayers.has(textLayerDiv)){endDiv.classList.add("active");}else{reset(endDiv,textLayerDiv);}}isFirefox??=getComputedStyle(text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.values().next().value).getPropertyValue("-moz-user-select")==="none";if(isFirefox){return;}const range=selection.getRangeAt(0);const modifyStart=prevRange&&(range.compareBoundaryPoints(Range.END_TO_END,prevRange)===0||range.compareBoundaryPoints(Range.START_TO_END,prevRange)===0);let anchor=modifyStart?range.startContainer:range.endContainer;if(anchor.nodeType===Node.TEXT_NODE){anchor=anchor.parentNode;}const parentTextLayer=anchor.parentElement.closest(".textLayer");const endDiv=text_layer_builder_assertClassBrand(_TextLayerBuilder,this,_textLayers)._.get(parentTextLayer);if(endDiv){endDiv.style.width=parentTextLayer.style.width;endDiv.style.height=parentTextLayer.style.height;anchor.parentElement.insertBefore(endDiv,modifyStart?anchor:anchor.nextSibling);}prevRange=range.cloneRange();},{signal});}var _textLayers={_:new Map()};var _selectionChangeAbortController={_:null};
;// CONCATENATED MODULE: ./web/pdf_page_view.js
function pdf_page_view_classPrivateMethodInitSpec(e,a){pdf_page_view_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_page_view_classPrivateFieldInitSpec(e,t,a){pdf_page_view_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_page_view_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_page_view_classPrivateFieldGet(s,a){return s.get(pdf_page_view_assertClassBrand(s,a));}function pdf_page_view_classPrivateFieldSet(s,a,r){return s.set(pdf_page_view_assertClassBrand(s,a),r),r;}function pdf_page_view_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DEFAULT_LAYER_PROPERTIES=null;const LAYERS_ORDER=new Map([["canvasWrapper",0],["textLayer",1],["annotationLayer",2],["annotationEditorLayer",3],["xfaLayer",3]]);var _annotationMode=/*#__PURE__*/new WeakMap();var _hasRestrictedScaling=/*#__PURE__*/new WeakMap();var _layerProperties=/*#__PURE__*/new WeakMap();var _loadingId=/*#__PURE__*/new WeakMap();var _previousRotation=/*#__PURE__*/new WeakMap();var _renderError=/*#__PURE__*/new WeakMap();var _renderingState=/*#__PURE__*/new WeakMap();var _textLayerMode=/*#__PURE__*/new WeakMap();var _useThumbnailCanvas=/*#__PURE__*/new WeakMap();var _viewportMap=/*#__PURE__*/new WeakMap();var _layers=/*#__PURE__*/new WeakMap();var _PDFPageView_brand=/*#__PURE__*/new WeakSet();class PDFPageView{constructor(options){pdf_page_view_classPrivateMethodInitSpec(this,_PDFPageView_brand);pdf_page_view_classPrivateFieldInitSpec(this,_annotationMode,AnnotationMode.ENABLE_FORMS);pdf_page_view_classPrivateFieldInitSpec(this,_hasRestrictedScaling,false);pdf_page_view_classPrivateFieldInitSpec(this,_layerProperties,null);pdf_page_view_classPrivateFieldInitSpec(this,_loadingId,null);pdf_page_view_classPrivateFieldInitSpec(this,_previousRotation,null);pdf_page_view_classPrivateFieldInitSpec(this,_renderError,null);pdf_page_view_classPrivateFieldInitSpec(this,_renderingState,RenderingStates.INITIAL);pdf_page_view_classPrivateFieldInitSpec(this,_textLayerMode,TextLayerMode.ENABLE);pdf_page_view_classPrivateFieldInitSpec(this,_useThumbnailCanvas,{directDrawing:true,initialOptionalContent:true,regularAnnotations:true});pdf_page_view_classPrivateFieldInitSpec(this,_viewportMap,new WeakMap());pdf_page_view_classPrivateFieldInitSpec(this,_layers,[null,null,null,null]);const container=options.container;const defaultViewport=options.defaultViewport;this.id=options.id;this.renderingId="page"+this.id;pdf_page_view_classPrivateFieldSet(_layerProperties,this,options.layerProperties||DEFAULT_LAYER_PROPERTIES);this.pdfPage=null;this.pageLabel=null;this.rotation=0;this.scale=options.scale||DEFAULT_SCALE;this.viewport=defaultViewport;this.pdfPageRotate=defaultViewport.rotation;this._optionalContentConfigPromise=options.optionalContentConfigPromise||null;pdf_page_view_classPrivateFieldSet(_textLayerMode,this,options.textLayerMode??TextLayerMode.ENABLE);pdf_page_view_classPrivateFieldSet(_annotationMode,this,options.annotationMode??AnnotationMode.ENABLE_FORMS);this.imageResourcesPath=options.imageResourcesPath||"";this.maxCanvasPixels=options.maxCanvasPixels??AppOptions.get("maxCanvasPixels");this.pageColors=options.pageColors||null;this.eventBus=options.eventBus;this.renderingQueue=options.renderingQueue;this.l10n=options.l10n;this.l10n||=new genericl10n_GenericL10n();this.renderTask=null;this.resume=null;this._isStandalone=!this.renderingQueue?.hasViewer();this._container=container;this._annotationCanvasMap=null;this.annotationLayer=null;this.annotationEditorLayer=null;this.textLayer=null;this.zoomLayer=null;this.xfaLayer=null;this.structTreeLayer=null;this.drawLayer=null;const _div=document.createElement("div");_div.className="page";_div.setAttribute("data-page-number",this.id);_div.setAttribute("role","region");_div.setAttribute("data-l10n-id","pdfjs-page-landmark");_div.setAttribute("data-l10n-args",JSON.stringify({page:this.id}));this.div=_div;pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_setDimensions).call(this);container?.append(_div);if(this._isStandalone){container?.style.setProperty("--scale-factor",this.scale*PixelsPerInch.PDF_TO_CSS_UNITS);const{optionalContentConfigPromise}=options;if(optionalContentConfigPromise){optionalContentConfigPromise.then(optionalContentConfig=>{if(optionalContentConfigPromise!==this._optionalContentConfigPromise){return;}pdf_page_view_classPrivateFieldGet(_useThumbnailCanvas,this).initialOptionalContent=optionalContentConfig.hasInitialVisibility;});}if(!options.l10n){this.l10n.translate(this.div);}}}get renderingState(){return pdf_page_view_classPrivateFieldGet(_renderingState,this);}set renderingState(state){if(state===pdf_page_view_classPrivateFieldGet(_renderingState,this)){return;}pdf_page_view_classPrivateFieldSet(_renderingState,this,state);if(pdf_page_view_classPrivateFieldGet(_loadingId,this)){clearTimeout(pdf_page_view_classPrivateFieldGet(_loadingId,this));pdf_page_view_classPrivateFieldSet(_loadingId,this,null);}switch(state){case RenderingStates.PAUSED:this.div.classList.remove("loading");break;case RenderingStates.RUNNING:this.div.classList.add("loadingIcon");pdf_page_view_classPrivateFieldSet(_loadingId,this,setTimeout(()=>{this.div.classList.add("loading");pdf_page_view_classPrivateFieldSet(_loadingId,this,null);},0));break;case RenderingStates.INITIAL:case RenderingStates.FINISHED:this.div.classList.remove("loadingIcon","loading");break;}}setPdfPage(pdfPage){if(this._isStandalone&&(this.pageColors?.foreground==="CanvasText"||this.pageColors?.background==="Canvas")){this._container?.style.setProperty("--hcm-highlight-filter",pdfPage.filterFactory.addHighlightHCMFilter("highlight","CanvasText","Canvas","HighlightText","Highlight"));this._container?.style.setProperty("--hcm-highlight-selected-filter",pdfPage.filterFactory.addHighlightHCMFilter("highlight_selected","CanvasText","Canvas","HighlightText","Highlight"));}this.pdfPage=pdfPage;this.pdfPageRotate=pdfPage.rotate;const totalRotation=(this.rotation+this.pdfPageRotate)%360;this.viewport=pdfPage.getViewport({scale:this.scale*PixelsPerInch.PDF_TO_CSS_UNITS,rotation:totalRotation});pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_setDimensions).call(this);this.reset();}destroy(){this.reset();this.pdfPage?.cleanup();}get _textHighlighter(){return shadow(this,"_textHighlighter",new TextHighlighter({pageIndex:this.id-1,eventBus:this.eventBus,findController:pdf_page_view_classPrivateFieldGet(_layerProperties,this).findController}));}_resetZoomLayer(){let removeFromDOM=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(!this.zoomLayer){return;}const zoomLayerCanvas=this.zoomLayer.firstChild;pdf_page_view_classPrivateFieldGet(_viewportMap,this).delete(zoomLayerCanvas);zoomLayerCanvas.width=0;zoomLayerCanvas.height=0;if(removeFromDOM){this.zoomLayer.remove();}this.zoomLayer=null;}reset(){let{keepZoomLayer=false,keepAnnotationLayer=false,keepAnnotationEditorLayer=false,keepXfaLayer=false,keepTextLayer=false}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};this.cancelRendering({keepAnnotationLayer,keepAnnotationEditorLayer,keepXfaLayer,keepTextLayer});this.renderingState=RenderingStates.INITIAL;const div=this.div;const childNodes=div.childNodes,zoomLayerNode=keepZoomLayer&&this.zoomLayer||null,annotationLayerNode=keepAnnotationLayer&&this.annotationLayer?.div||null,annotationEditorLayerNode=keepAnnotationEditorLayer&&this.annotationEditorLayer?.div||null,xfaLayerNode=keepXfaLayer&&this.xfaLayer?.div||null,textLayerNode=keepTextLayer&&this.textLayer?.div||null;for(let i=childNodes.length-1;i>=0;i--){const node=childNodes[i];switch(node){case zoomLayerNode:case annotationLayerNode:case annotationEditorLayerNode:case xfaLayerNode:case textLayerNode:continue;}node.remove();const layerIndex=pdf_page_view_classPrivateFieldGet(_layers,this).indexOf(node);if(layerIndex>=0){pdf_page_view_classPrivateFieldGet(_layers,this)[layerIndex]=null;}}div.removeAttribute("data-loaded");if(annotationLayerNode){this.annotationLayer.hide();}if(annotationEditorLayerNode){this.annotationEditorLayer.hide();}if(xfaLayerNode){this.xfaLayer.hide();}if(textLayerNode){this.textLayer.hide();}this.structTreeLayer?.hide();if(!zoomLayerNode){if(this.canvas){pdf_page_view_classPrivateFieldGet(_viewportMap,this).delete(this.canvas);this.canvas.width=0;this.canvas.height=0;delete this.canvas;}this._resetZoomLayer();}}update(_ref){let{scale=0,rotation=null,optionalContentConfigPromise=null,drawingDelay=-1}=_ref;this.scale=scale||this.scale;if(typeof rotation==="number"){this.rotation=rotation;}if(optionalContentConfigPromise instanceof Promise){this._optionalContentConfigPromise=optionalContentConfigPromise;optionalContentConfigPromise.then(optionalContentConfig=>{if(optionalContentConfigPromise!==this._optionalContentConfigPromise){return;}pdf_page_view_classPrivateFieldGet(_useThumbnailCanvas,this).initialOptionalContent=optionalContentConfig.hasInitialVisibility;});}pdf_page_view_classPrivateFieldGet(_useThumbnailCanvas,this).directDrawing=true;const totalRotation=(this.rotation+this.pdfPageRotate)%360;this.viewport=this.viewport.clone({scale:this.scale*PixelsPerInch.PDF_TO_CSS_UNITS,rotation:totalRotation});pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_setDimensions).call(this);if(this._isStandalone){this._container?.style.setProperty("--scale-factor",this.viewport.scale);}if(this.canvas){let onlyCssZoom=false;if(pdf_page_view_classPrivateFieldGet(_hasRestrictedScaling,this)){if(this.maxCanvasPixels===0){onlyCssZoom=true;}else if(this.maxCanvasPixels>0){const{width,height}=this.viewport;const{sx,sy}=this.outputScale;onlyCssZoom=(Math.floor(width)*sx|0)*(Math.floor(height)*sy|0)>this.maxCanvasPixels;}}const postponeDrawing=drawingDelay>=0&&drawingDelay<1000;if(postponeDrawing||onlyCssZoom){if(postponeDrawing&&!onlyCssZoom&&this.renderingState!==RenderingStates.FINISHED){this.cancelRendering({keepZoomLayer:true,keepAnnotationLayer:true,keepAnnotationEditorLayer:true,keepXfaLayer:true,keepTextLayer:true,cancelExtraDelay:drawingDelay});this.renderingState=RenderingStates.FINISHED;pdf_page_view_classPrivateFieldGet(_useThumbnailCanvas,this).directDrawing=false;}this.cssTransform({target:this.canvas,redrawAnnotationLayer:true,redrawAnnotationEditorLayer:true,redrawXfaLayer:true,redrawTextLayer:!postponeDrawing,hideTextLayer:postponeDrawing});if(postponeDrawing){return;}this.eventBus.dispatch("pagerendered",{source:this,pageNumber:this.id,cssTransform:true,timestamp:performance.now(),error:pdf_page_view_classPrivateFieldGet(_renderError,this)});return;}if(!this.zoomLayer&&!this.canvas.hidden){this.zoomLayer=this.canvas.parentNode;this.zoomLayer.style.position="absolute";}}if(this.zoomLayer){this.cssTransform({target:this.zoomLayer.firstChild});}this.reset({keepZoomLayer:true,keepAnnotationLayer:true,keepAnnotationEditorLayer:true,keepXfaLayer:true,keepTextLayer:true});}cancelRendering(){let{keepAnnotationLayer=false,keepAnnotationEditorLayer=false,keepXfaLayer=false,keepTextLayer=false,cancelExtraDelay=0}=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(this.renderTask){this.renderTask.cancel(cancelExtraDelay);this.renderTask=null;}this.resume=null;if(this.textLayer&&(!keepTextLayer||!this.textLayer.div)){this.textLayer.cancel();this.textLayer=null;}if(this.structTreeLayer&&!this.textLayer){this.structTreeLayer=null;}if(this.annotationLayer&&(!keepAnnotationLayer||!this.annotationLayer.div)){this.annotationLayer.cancel();this.annotationLayer=null;this._annotationCanvasMap=null;}if(this.annotationEditorLayer&&(!keepAnnotationEditorLayer||!this.annotationEditorLayer.div)){if(this.drawLayer){this.drawLayer.cancel();this.drawLayer=null;}this.annotationEditorLayer.cancel();this.annotationEditorLayer=null;}if(this.xfaLayer&&(!keepXfaLayer||!this.xfaLayer.div)){this.xfaLayer.cancel();this.xfaLayer=null;this._textHighlighter?.disable();}}cssTransform(_ref2){let{target,redrawAnnotationLayer=false,redrawAnnotationEditorLayer=false,redrawXfaLayer=false,redrawTextLayer=false,hideTextLayer=false}=_ref2;if(!target.hasAttribute("zooming")){target.setAttribute("zooming",true);const{style}=target;style.width=style.height="";}const originalViewport=pdf_page_view_classPrivateFieldGet(_viewportMap,this).get(target);if(this.viewport!==originalViewport){const relativeRotation=this.viewport.rotation-originalViewport.rotation;const absRotation=Math.abs(relativeRotation);let scaleX=1,scaleY=1;if(absRotation===90||absRotation===270){const{width,height}=this.viewport;scaleX=height/width;scaleY=width/height;}target.style.transform=`rotate(${relativeRotation}deg) scale(${scaleX}, ${scaleY})`;}if(redrawAnnotationLayer&&this.annotationLayer){pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderAnnotationLayer).call(this);}if(redrawAnnotationEditorLayer&&this.annotationEditorLayer){if(this.drawLayer){pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderDrawLayer).call(this);}pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderAnnotationEditorLayer).call(this);}if(redrawXfaLayer&&this.xfaLayer){pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderXfaLayer).call(this);}if(this.textLayer){if(hideTextLayer){this.textLayer.hide();this.structTreeLayer?.hide();}else if(redrawTextLayer){pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderTextLayer).call(this);}}}get width(){return this.viewport.width;}get height(){return this.viewport.height;}getPagePoint(x,y){return this.viewport.convertToPdfPoint(x,y);}async draw(){if(this.renderingState!==RenderingStates.INITIAL){globalThis.ngxConsole.error("Must be in new state before drawing");this.reset();}const{div,l10n,pageColors,pdfPage,viewport}=this;if(!pdfPage){this.renderingState=RenderingStates.FINISHED;throw new Error("pdfPage is not loaded");}this.renderingState=RenderingStates.RUNNING;const canvasWrapper=document.createElement("div");canvasWrapper.classList.add("canvasWrapper");pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_addLayer).call(this,canvasWrapper,"canvasWrapper");if(!this.textLayer&&pdf_page_view_classPrivateFieldGet(_textLayerMode,this)!==TextLayerMode.DISABLE&&!pdfPage.isPureXfa){this._accessibilityManager||=new TextAccessibilityManager();this.textLayer=new TextLayerBuilder({pdfPage,highlighter:this._textHighlighter,accessibilityManager:this._accessibilityManager,enablePermissions:pdf_page_view_classPrivateFieldGet(_textLayerMode,this)===TextLayerMode.ENABLE_PERMISSIONS,onAppend:textLayerDiv=>{this.l10n.pause();pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_addLayer).call(this,textLayerDiv,"textLayer");this.l10n.resume();}});}if(!this.annotationLayer&&pdf_page_view_classPrivateFieldGet(_annotationMode,this)!==AnnotationMode.DISABLE){const{annotationStorage,annotationEditorUIManager,downloadManager,enableScripting,fieldObjectsPromise,hasJSActionsPromise,linkService}=pdf_page_view_classPrivateFieldGet(_layerProperties,this);this._annotationCanvasMap||=new Map();this.annotationLayer=new AnnotationLayerBuilder({pdfPage,annotationStorage,imageResourcesPath:this.imageResourcesPath,renderForms:pdf_page_view_classPrivateFieldGet(_annotationMode,this)===AnnotationMode.ENABLE_FORMS,linkService,downloadManager,enableScripting,hasJSActionsPromise,fieldObjectsPromise,annotationCanvasMap:this._annotationCanvasMap,accessibilityManager:this._accessibilityManager,annotationEditorUIManager,onAppend:annotationLayerDiv=>{pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_addLayer).call(this,annotationLayerDiv,"annotationLayer");}});}const renderContinueCallback=cont=>{showCanvas?.(false);if(this.renderingQueue&&!this.renderingQueue.isHighestPriority(this)){this.renderingState=RenderingStates.PAUSED;this.resume=()=>{this.renderingState=RenderingStates.RUNNING;cont();};return;}cont();};let{width,height}=viewport;const canvas=document.createElement("canvas");canvas.setAttribute("role","presentation");canvas.hidden=true;const hasHCM=!!(pageColors?.background&&pageColors?.foreground);let showCanvas=isLastShow=>{if(!hasHCM||isLastShow){canvas.hidden=false;showCanvas=null;}};canvasWrapper.append(canvas);this.canvas=canvas;const options=window.pdfDefaultOptions.activateWillReadFrequentlyFlag?{willReadFrequently:true,alpha:false}:{alpha:false};const ctx=canvas.getContext("2d",options);const outputScale=this.outputScale=new OutputScale();if(this.maxCanvasPixels===0){const invScale=1/this.scale;outputScale.sx*=invScale;outputScale.sy*=invScale;pdf_page_view_classPrivateFieldSet(_hasRestrictedScaling,this,true);}else if(this.maxCanvasPixels>0){const pixelsInViewport=width*height;const maxScale=Math.sqrt(this.maxCanvasPixels/pixelsInViewport);if(outputScale.sx>maxScale||outputScale.sy>maxScale){outputScale.sx=maxScale;outputScale.sy=maxScale;pdf_page_view_classPrivateFieldSet(_hasRestrictedScaling,this,true);}else{pdf_page_view_classPrivateFieldSet(_hasRestrictedScaling,this,false);}}const sfx=approximateFraction(outputScale.sx);const sfy=approximateFraction(outputScale.sy);width=roundToDivide(width*outputScale.sx,sfx[0]);height=roundToDivide(height*outputScale.sy,sfy[0]);let divisor=1;if(width>=4096||height>=4096){if(!!this.maxWidth||!canvasSize.test({width,height})){const max=this.determineMaxDimensions();divisor=Math.max(width/max,height/max);if(divisor>1){const newScale=Math.floor(100*this.scale/divisor)/100;divisor=this.scale/newScale;viewport.width/=divisor;viewport.height/=divisor;warn(`Page ${this.id}: Reduced the maximum zoom to ${newScale} because the browser can't render larger canvases.`);}else{divisor=1;}}}canvas.width=roundToDivide(viewport.width*outputScale.sx,sfx[0]);canvas.height=roundToDivide(viewport.height*outputScale.sy,sfy[0]);const{style}=canvas;style.width=roundToDivide(viewport.width,sfx[1])+"px";style.height=roundToDivide(viewport.height,sfy[1])+"px";pdf_page_view_classPrivateFieldGet(_viewportMap,this).set(canvas,viewport);const transform=outputScale.scaled?[outputScale.sx,0,0,outputScale.sy,0,0]:null;const renderContext={canvasContext:ctx,transform,viewport,annotationMode:pdf_page_view_classPrivateFieldGet(_annotationMode,this),optionalContentConfigPromise:this._optionalContentConfigPromise,annotationCanvasMap:this._annotationCanvasMap,pageColors};const renderTask=this.renderTask=pdfPage.render(renderContext);renderTask.onContinue=renderContinueCallback;const resultPromise=renderTask.promise.then(async()=>{showCanvas?.(true);await pdf_page_view_assertClassBrand(_PDFPageView_brand,this,pdf_page_view_finishRenderTask).call(this,renderTask);pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderTextLayer).call(this);if(this.annotationLayer){await pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderAnnotationLayer).call(this);}const{annotationEditorUIManager}=pdf_page_view_classPrivateFieldGet(_layerProperties,this);if(!annotationEditorUIManager){return;}this.drawLayer||=new DrawLayerBuilder({pageIndex:this.id});await pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderDrawLayer).call(this);this.drawLayer.setParent(canvasWrapper);if(!this.annotationEditorLayer){this.annotationEditorLayer=new AnnotationEditorLayerBuilder({uiManager:annotationEditorUIManager,pdfPage,l10n,accessibilityManager:this._accessibilityManager,annotationLayer:this.annotationLayer?.annotationLayer,textLayer:this.textLayer,drawLayer:this.drawLayer.getDrawLayer(),onAppend:annotationEditorLayerDiv=>{pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_addLayer).call(this,annotationEditorLayerDiv,"annotationEditorLayer");},eventBus:this.eventBus});}pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderAnnotationEditorLayer).call(this);},error=>{if(!(error instanceof RenderingCancelledException)){showCanvas?.(true);}return pdf_page_view_assertClassBrand(_PDFPageView_brand,this,pdf_page_view_finishRenderTask).call(this,renderTask,error);});if(pdfPage.isPureXfa){if(!this.xfaLayer){const{annotationStorage,linkService}=pdf_page_view_classPrivateFieldGet(_layerProperties,this);this.xfaLayer=new XfaLayerBuilder({pdfPage,annotationStorage,linkService});}pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderXfaLayer).call(this);}div.setAttribute("data-loaded",true);this.eventBus.dispatch("pagerender",{source:this,pageNumber:this.id});return resultPromise;}setPageLabel(label){this.pageLabel=typeof label==="string"?label:null;this.div.setAttribute("data-l10n-args",JSON.stringify({page:this.pageLabel??this.id}));if(this.pageLabel!==null){this.div.setAttribute("data-page-label",this.pageLabel);}else{this.div.removeAttribute("data-page-label");}}determineMaxDimensions(){if(this.maxWidth){return this.maxWidth;}const checklist=[4096,8192,10836,11180,11402,14188,16384];for(const width of checklist){if(!canvasSize.test({width:width+1,height:width+1})){this.maxWidth=width;return this.maxWidth;}}return 16384;}get thumbnailCanvas(){const{directDrawing,initialOptionalContent,regularAnnotations}=pdf_page_view_classPrivateFieldGet(_useThumbnailCanvas,this);return directDrawing&&initialOptionalContent&&regularAnnotations?this.canvas:null;}}function _addLayer(div,name){const pos=LAYERS_ORDER.get(name);const oldDiv=pdf_page_view_classPrivateFieldGet(_layers,this)[pos];pdf_page_view_classPrivateFieldGet(_layers,this)[pos]=div;if(oldDiv){oldDiv.replaceWith(div);return;}for(let i=pos-1;i>=0;i--){const layer=pdf_page_view_classPrivateFieldGet(_layers,this)[i];if(layer){layer.after(div);return;}}this.div.prepend(div);}function _setDimensions(){const{viewport}=this;if(this.pdfPage){if(pdf_page_view_classPrivateFieldGet(_previousRotation,this)===viewport.rotation){return;}pdf_page_view_classPrivateFieldSet(_previousRotation,this,viewport.rotation);}setLayerDimensions(this.div,viewport,true,false);}function _dispatchLayerRendered(name,error){this.eventBus.dispatch(name,{source:this,pageNumber:this.id,error});}async function _renderAnnotationLayer(){let error=null;try{await this.annotationLayer.render(this.viewport,"display");}catch(ex){console.error(`#renderAnnotationLayer: "${ex}".`);error=ex;}finally{pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_dispatchLayerRendered).call(this,"annotationlayerrendered",error);}}async function _renderAnnotationEditorLayer(){let error=null;try{await this.annotationEditorLayer.render(this.viewport,"display");}catch(ex){console.error(`#renderAnnotationEditorLayer: "${ex}".`);error=ex;}finally{pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_dispatchLayerRendered).call(this,"annotationeditorlayerrendered",error);}}async function _renderDrawLayer(){try{await this.drawLayer.render("display");}catch(ex){console.error(`#renderDrawLayer: "${ex}".`);}}async function _renderXfaLayer(){let error=null;try{const result=await this.xfaLayer.render(this.viewport,"display");if(result?.textDivs&&this._textHighlighter){pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_buildXfaTextContentItems).call(this,result.textDivs);}}catch(ex){console.error(`#renderXfaLayer: "${ex}".`);error=ex;}finally{if(this.xfaLayer?.div){this.l10n.pause();pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_addLayer).call(this,this.xfaLayer.div,"xfaLayer");this.l10n.resume();}pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_dispatchLayerRendered).call(this,"xfalayerrendered",error);}}async function _renderTextLayer(){if(!this.textLayer){return;}let error=null;try{await this.textLayer.render(this.viewport);}catch(ex){if(ex instanceof AbortException){return;}console.error(`#renderTextLayer: "${ex}".`);error=ex;}pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_dispatchLayerRendered).call(this,"textlayerrendered",error);pdf_page_view_assertClassBrand(_PDFPageView_brand,this,_renderStructTreeLayer).call(this);}async function _renderStructTreeLayer(){if(!this.textLayer){return;}this.structTreeLayer||=new StructTreeLayerBuilder();const tree=await(!this.structTreeLayer.renderingDone?this.pdfPage.getStructTree():null);const treeDom=this.structTreeLayer?.render(tree);if(treeDom){this.l10n.pause();this.canvas?.append(treeDom);this.l10n.resume();}this.structTreeLayer?.show();}async function _buildXfaTextContentItems(textDivs){const text=await this.pdfPage.getTextContent();const items=[];for(const item of text.items){items.push(item.str);}this._textHighlighter.setTextMapping(textDivs,items);this._textHighlighter.enable();}async function pdf_page_view_finishRenderTask(renderTask){let error=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;if(renderTask===this.renderTask){this.renderTask=null;}if(error instanceof RenderingCancelledException){pdf_page_view_classPrivateFieldSet(_renderError,this,null);return;}pdf_page_view_classPrivateFieldSet(_renderError,this,error);this.renderingState=RenderingStates.FINISHED;this._resetZoomLayer(true);pdf_page_view_classPrivateFieldGet(_useThumbnailCanvas,this).regularAnnotations=!renderTask.separateAnnots;this.eventBus.dispatch("pagerendered",{source:this,pageNumber:this.id,cssTransform:false,timestamp:performance.now(),error:pdf_page_view_classPrivateFieldGet(_renderError,this)});if(error){throw error;}}
;// CONCATENATED MODULE: ./web/pdf_viewer.js
function pdf_viewer_classPrivateGetter(s,r,a){return a(pdf_viewer_assertClassBrand(s,r));}function pdf_viewer_classPrivateMethodInitSpec(e,a){pdf_viewer_checkPrivateRedeclaration(e,a),a.add(e);}function pdf_viewer_classPrivateFieldInitSpec(e,t,a){pdf_viewer_checkPrivateRedeclaration(e,t),t.set(e,a);}function pdf_viewer_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function pdf_viewer_classPrivateFieldGet(s,a){return s.get(pdf_viewer_assertClassBrand(s,a));}function pdf_viewer_classPrivateFieldSet(s,a,r){return s.set(pdf_viewer_assertClassBrand(s,a),r),r;}function pdf_viewer_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}const DEFAULT_CACHE_SIZE=10;const PagesCountLimit={FORCE_SCROLL_MODE_PAGE:15000,FORCE_LAZY_PAGE_INIT:7500,PAUSE_EAGER_PAGE_INIT:250};function isValidAnnotationEditorMode(mode){return Object.values(AnnotationEditorType).includes(mode)&&mode!==AnnotationEditorType.DISABLE;}var _buf=/*#__PURE__*/new WeakMap();var _size=/*#__PURE__*/new WeakMap();var _PDFPageViewBuffer_brand=/*#__PURE__*/new WeakSet();class PDFPageViewBuffer{constructor(size){pdf_viewer_classPrivateMethodInitSpec(this,_PDFPageViewBuffer_brand);pdf_viewer_classPrivateFieldInitSpec(this,_buf,new Set());pdf_viewer_classPrivateFieldInitSpec(this,_size,0);pdf_viewer_classPrivateFieldSet(_size,this,size);}push(view){const buf=pdf_viewer_classPrivateFieldGet(_buf,this);if(buf.has(view)){buf.delete(view);}buf.add(view);if(buf.size>pdf_viewer_classPrivateFieldGet(_size,this)){pdf_viewer_assertClassBrand(_PDFPageViewBuffer_brand,this,_destroyFirstView).call(this);}}resize(newSize){let idsToKeep=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;pdf_viewer_classPrivateFieldSet(_size,this,newSize);const buf=pdf_viewer_classPrivateFieldGet(_buf,this);if(idsToKeep){const ii=buf.size;let i=1;for(const view of buf){if(idsToKeep.has(view.id)){buf.delete(view);buf.add(view);}if(++i>ii){break;}}}while(buf.size>pdf_viewer_classPrivateFieldGet(_size,this)){pdf_viewer_assertClassBrand(_PDFPageViewBuffer_brand,this,_destroyFirstView).call(this);}}has(view){return pdf_viewer_classPrivateFieldGet(_buf,this).has(view);}[Symbol.iterator](){return pdf_viewer_classPrivateFieldGet(_buf,this).keys();}}function _destroyFirstView(){const firstView=pdf_viewer_classPrivateFieldGet(_buf,this).keys().next().value;firstView?.destroy();pdf_viewer_classPrivateFieldGet(_buf,this).delete(firstView);}var _buffer=/*#__PURE__*/new WeakMap();var _altTextManager=/*#__PURE__*/new WeakMap();var _annotationEditorHighlightColors=/*#__PURE__*/new WeakMap();var _annotationEditorMode=/*#__PURE__*/new WeakMap();var _annotationEditorUIManager=/*#__PURE__*/new WeakMap();var pdf_viewer_annotationMode=/*#__PURE__*/new WeakMap();var _containerTopLeft=/*#__PURE__*/new WeakMap();var _enableHighlightFloatingButton=/*#__PURE__*/new WeakMap();var pdf_viewer_enablePermissions=/*#__PURE__*/new WeakMap();var pdf_viewer_eventAbortController=/*#__PURE__*/new WeakMap();var _mlManager=/*#__PURE__*/new WeakMap();var _getAllTextInProgress=/*#__PURE__*/new WeakMap();var _hiddenCopyElement=/*#__PURE__*/new WeakMap();var _interruptCopyCondition=/*#__PURE__*/new WeakMap();var _previousContainerHeight=/*#__PURE__*/new WeakMap();var pdf_viewer_resizeObserver=/*#__PURE__*/new WeakMap();var _scrollModePageState=/*#__PURE__*/new WeakMap();var _scaleTimeoutId=/*#__PURE__*/new WeakMap();var pdf_viewer_textLayerMode=/*#__PURE__*/new WeakMap();var _outerScrollContainer=/*#__PURE__*/new WeakMap();var _pageViewMode=/*#__PURE__*/new WeakMap();var _PDFViewer_brand=/*#__PURE__*/new WeakSet();class PDFViewer{constructor(_options){pdf_viewer_classPrivateMethodInitSpec(this,_PDFViewer_brand);pdf_viewer_classPrivateFieldInitSpec(this,_buffer,null);pdf_viewer_classPrivateFieldInitSpec(this,_altTextManager,null);pdf_viewer_classPrivateFieldInitSpec(this,_annotationEditorHighlightColors,null);pdf_viewer_classPrivateFieldInitSpec(this,_annotationEditorMode,AnnotationEditorType.NONE);pdf_viewer_classPrivateFieldInitSpec(this,_annotationEditorUIManager,null);pdf_viewer_classPrivateFieldInitSpec(this,pdf_viewer_annotationMode,AnnotationMode.ENABLE_FORMS);pdf_viewer_classPrivateFieldInitSpec(this,_containerTopLeft,null);pdf_viewer_classPrivateFieldInitSpec(this,_enableHighlightFloatingButton,false);pdf_viewer_classPrivateFieldInitSpec(this,pdf_viewer_enablePermissions,false);pdf_viewer_classPrivateFieldInitSpec(this,pdf_viewer_eventAbortController,null);pdf_viewer_classPrivateFieldInitSpec(this,_mlManager,null);pdf_viewer_classPrivateFieldInitSpec(this,_getAllTextInProgress,false);pdf_viewer_classPrivateFieldInitSpec(this,_hiddenCopyElement,null);pdf_viewer_classPrivateFieldInitSpec(this,_interruptCopyCondition,false);pdf_viewer_classPrivateFieldInitSpec(this,_previousContainerHeight,0);pdf_viewer_classPrivateFieldInitSpec(this,pdf_viewer_resizeObserver,new ResizeObserver(pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_resizeObserverCallback).bind(this)));pdf_viewer_classPrivateFieldInitSpec(this,_scrollModePageState,null);pdf_viewer_classPrivateFieldInitSpec(this,_scaleTimeoutId,null);pdf_viewer_classPrivateFieldInitSpec(this,pdf_viewer_textLayerMode,TextLayerMode.ENABLE);pdf_viewer_classPrivateFieldInitSpec(this,_outerScrollContainer,undefined);pdf_viewer_classPrivateFieldInitSpec(this,_pageViewMode,"multiple");const viewerVersion="4.3.659";if(version!==viewerVersion){throw new Error(`The API version "${version}" does not match the Viewer version "${viewerVersion}".`);}this.container=_options.container;this.viewer=_options.viewer||_options.container.firstElementChild;this.pageViewMode=_options.pageViewMode||"multiple";if(this.container?.tagName!=="DIV"||this.viewer?.tagName!=="DIV"){throw new Error("Invalid `container` and/or `viewer` option.");}if(this.container.offsetParent&&getComputedStyle(this.container).position!=="absolute"){throw new Error("The `container` must be absolutely positioned.");}pdf_viewer_classPrivateFieldGet(pdf_viewer_resizeObserver,this).observe(this.container);this.eventBus=_options.eventBus;this.linkService=_options.linkService||new SimpleLinkService();this.downloadManager=_options.downloadManager||null;this.findController=_options.findController||null;pdf_viewer_classPrivateFieldSet(_altTextManager,this,_options.altTextManager||null);if(this.findController){this.findController.onIsPageVisible=pageNumber=>this._getVisiblePages().ids.has(pageNumber);}this._scriptingManager=_options.scriptingManager||null;pdf_viewer_classPrivateFieldSet(pdf_viewer_textLayerMode,this,_options.textLayerMode??TextLayerMode.ENABLE);pdf_viewer_classPrivateFieldSet(pdf_viewer_annotationMode,this,_options.annotationMode??AnnotationMode.ENABLE_FORMS);pdf_viewer_classPrivateFieldSet(_annotationEditorMode,this,_options.annotationEditorMode??AnnotationEditorType.NONE);pdf_viewer_classPrivateFieldSet(_annotationEditorHighlightColors,this,_options.annotationEditorHighlightColors||null);pdf_viewer_classPrivateFieldSet(_enableHighlightFloatingButton,this,_options.enableHighlightFloatingButton===true);this.imageResourcesPath=_options.imageResourcesPath||"";this.enablePrintAutoRotate=_options.enablePrintAutoRotate||false;this.removePageBorders=_options.removePageBorders||false;this.maxCanvasPixels=_options.maxCanvasPixels;this.l10n=_options.l10n;this.l10n||=new genericl10n_GenericL10n();pdf_viewer_classPrivateFieldSet(pdf_viewer_enablePermissions,this,_options.enablePermissions||false);this.pageColors=_options.pageColors||null;pdf_viewer_classPrivateFieldSet(_mlManager,this,_options.mlManager||null);this.defaultRenderingQueue=!_options.renderingQueue;if(this.defaultRenderingQueue){this.renderingQueue=new PDFRenderingQueue();this.renderingQueue.setViewer(this);}else{this.renderingQueue=_options.renderingQueue;}this.scroll=watchScroll(this.container,this._scrollUpdate.bind(this));this.presentationModeState=PresentationModeState.UNKNOWN;this._resetView();if(this.removePageBorders){this.viewer.classList.add("removePageBorders");}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_updateContainerHeightCss).call(this);this.eventBus._on("thumbnailrendered",_ref=>{let{pageNumber,pdfPage}=_ref;const pageView=this._pages[pageNumber-1];if(!pdf_viewer_classPrivateFieldGet(_buffer,this).has(pageView)){pdfPage?.cleanup();}});if(!_options.l10n){this.l10n.translate(this.container);}}get pageViewMode(){return pdf_viewer_classPrivateFieldGet(_pageViewMode,this);}set pageViewMode(viewMode){if(pdf_viewer_classPrivateFieldGet(_pageViewMode,this)!==viewMode){pdf_viewer_classPrivateFieldSet(_pageViewMode,this,viewMode);if(!pdf_viewer_classPrivateFieldGet(_outerScrollContainer,this)&&viewMode==="infinite-scroll"){pdf_viewer_classPrivateFieldSet(_outerScrollContainer,this,pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_findParentWithScrollbar).call(this,this.container.offsetParent));if(pdf_viewer_classPrivateFieldGet(_outerScrollContainer,this)){watchScroll(pdf_viewer_classPrivateFieldGet(_outerScrollContainer,this),this._scrollUpdate.bind(this));}}}}get pagesCount(){return this._pages.length;}getPageView(index){return this._pages[index];}getCachedPageViews(){return new Set(pdf_viewer_classPrivateFieldGet(_buffer,this));}get pageViewsReady(){return this._pages.every(pageView=>pageView?.pdfPage);}get renderForms(){return pdf_viewer_classPrivateFieldGet(pdf_viewer_annotationMode,this)===AnnotationMode.ENABLE_FORMS;}get enableScripting(){return!!this._scriptingManager;}get currentPageNumber(){return this._currentPageNumber;}set currentPageNumber(val){if(!Number.isInteger(val)){throw new Error("Invalid page number.");}if(!this.pdfDocument){return;}const flip=Math.abs(this._currentPageNumber-val)<=2;if(!this._setCurrentPageNumber(val,true)){globalThis.ngxConsole.error(`currentPageNumber: "${val}" is not a valid page.`);}if(this.pageFlip){if(flip){this.pageFlip.flip(val-1);}else{this.pageFlip.turnToPage(val-1);}this.ensureAdjacentPagesAreLoaded();}}hidePagesDependingOnpageViewMode(){if(this.pageViewMode==="book"){if(!this.pageFlip){setTimeout(()=>{if(!this.pageFlip){const page1=this._pages[0].div;const htmlParentElement=page1.parentElement;const viewer=htmlParentElement.parentElement;viewer.style.width=2*page1.clientWidth+"px";viewer.style.overflow="hidden";viewer.style.marginLeft="auto";viewer.style.marginRight="auto";this.pageFlip=new PageFlip(htmlParentElement,{width:page1.clientWidth,height:page1.clientHeight,showCover:true,size:"fixed",ngxZone:globalThis.ngxZone});this.pageFlip.loadFromHTML(document.querySelectorAll(".page"));this.pageFlip.on("flip",e=>{if(this._currentPageNumber!==e.data+1){this._setCurrentPageNumber(e.data+1,false);}});}},100);}}}async _setCurrentPageNumber(val){let resetCurrentPageView=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(this._currentPageNumber===val){if(resetCurrentPageView){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_resetCurrentPageView).call(this);}return true;}if(!(0<val&&val<=this.pagesCount)){return false;}const previous=this._currentPageNumber;this._currentPageNumber=val;this.hidePagesDependingOnpageViewMode();if(this.pageViewMode==="book"||this.pageViewMode==="infinite-scroll"){const pageView=this._pages[this.currentPageNumber-1];if(pageView.div.parentElement.classList.contains("spread")){pageView.div.parentElement.childNodes.forEach(async div=>{const pageNumber=Number(div.getAttribute("data-page-number"));const pv=this._pages[pageNumber-1];await pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_ensurePdfPageLoaded).call(this,pv);this.renderingQueue.renderView(pv);div.style.display="inline-block";});}else{await pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_ensurePdfPageLoaded).call(this,pageView);this.renderingQueue.renderView(pageView);if(pdf_viewer_classPrivateFieldGet(_pageViewMode,this)==="book"){this.ensureAdjacentPagesAreLoaded();}}}this.eventBus.dispatch("pagechanging",{source:this,pageNumber:val,pageLabel:this._pageLabels?.[val-1]??null,previous});if(resetCurrentPageView){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_resetCurrentPageView).call(this);}return true;}addPageToRenderQueue(){let pageIndex=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;if(pageIndex>=0&&pageIndex<=this._pages.length-1){const pageView=this._pages[pageIndex];const isLoading=pageView.renderingState===RenderingStates.INITIAL;if(isLoading){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_ensurePdfPageLoaded).call(this,pageView).then(()=>{this.renderingQueue.renderView(pageView);});return true;}}return false;}async ensureAdjacentPagesAreLoaded(){const advances=[0,1,-1,2,-2,-3];let offset=0;if(this.currentPageNumber%2===1){offset=-1;}let renderAsynchronously=false;for(const advance of advances){const pageIndex=this.currentPageNumber+advance+offset;if(pageIndex>=0&&pageIndex<this._pages.length){try{const pageView=this._pages[pageIndex];await pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_ensurePdfPageLoaded).call(this,pageView);const isAlreadyRendering=this._pages.some(pv=>pv.renderingState===RenderingStates.RUNNING||pv.renderingState===RenderingStates.PAUSED);if(isAlreadyRendering||renderAsynchronously){const loader=()=>this.adjacentPagesRenderer(loader,pageIndex);this.eventBus._on("pagerendered",loader);this.eventBus._on("thumbnailRendered",loader);}else{renderAsynchronously=this.adjacentPagesRenderer(null,pageIndex);}}catch(exception){console.log("Exception during pre-rendering page %s",pageIndex,exception);}}}}adjacentPagesRenderer(self,pageIndex){const isAlreadyRendering=this._pages.find(pageView=>pageView.renderingState===RenderingStates.RUNNING);if(isAlreadyRendering){return true;}const pausedRendering=this._pages.find(pageView=>pageView.renderingState===RenderingStates.PAUSED);if(pausedRendering){this.renderingQueue.renderView(pausedRendering);return true;}if(self){this.eventBus._off("pagerendered",self);this.eventBus._off("thumbnailRendered",self);}if(pageIndex>=0&&pageIndex<this._pages.length){const pageView=this._pages[pageIndex];const needsToBeRendered=pageView.renderingState===RenderingStates.INITIAL;if(needsToBeRendered){this.renderingQueue.renderView(pageView);return true;}}return false;}get currentPageLabel(){return this._pageLabels?.[this._currentPageNumber-1]??null;}set currentPageLabel(val){if(!this.pdfDocument){return;}let page=val|0;if(this._pageLabels){const i=this._pageLabels.indexOf(val);if(i>=0){page=i+1;}}if(!this._setCurrentPageNumber(page,true)){globalThis.ngxConsole.error(`currentPageLabel: "${val}" is not a valid page.`);}}get currentScale(){return this._currentScale!==UNKNOWN_SCALE?this._currentScale:DEFAULT_SCALE;}set currentScale(val){if(isNaN(val)){throw new Error("Invalid numeric scale.");}if(!this.pdfDocument){return;}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,val,{noScroll:false});}get currentScaleValue(){return this._currentScaleValue;}set currentScaleValue(val){if(!this.pdfDocument){return;}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,val,{noScroll:false});}get pagesRotation(){return this._pagesRotation;}set pagesRotation(rotation){if(!isValidRotation(rotation)){throw new Error("Invalid pages rotation angle.");}if(!this.pdfDocument){return;}rotation%=360;if(rotation<0){rotation+=360;}if(this._pagesRotation===rotation){return;}this._pagesRotation=rotation;const pageNumber=this._currentPageNumber;this.refresh(true,{rotation});if(this._currentScaleValue){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,this._currentScaleValue,{noScroll:true});}this.eventBus.dispatch("rotationchanging",{source:this,pagesRotation:rotation,pageNumber});if(this.defaultRenderingQueue){this.update();}}get firstPagePromise(){return this.pdfDocument?this._firstPageCapability.promise:null;}get onePageRendered(){return this.pdfDocument?this._onePageRenderedCapability.promise:null;}get pagesPromise(){return this.pdfDocument?this._pagesCapability.promise:null;}get _layerProperties(){const self=this;return shadow(this,"_layerProperties",{get annotationEditorUIManager(){return pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,self);},get annotationStorage(){return self.pdfDocument?.annotationStorage;},get downloadManager(){return self.downloadManager;},get enableScripting(){return!!self._scriptingManager;},get fieldObjectsPromise(){return self.pdfDocument?.getFieldObjects();},get findController(){return self.findController;},get hasJSActionsPromise(){return self.pdfDocument?.hasJSActions();},get linkService(){return self.linkService;}});}async getAllText(){const texts=[];const buffer=[];for(let pageNum=1,pagesCount=this.pdfDocument.numPages;pageNum<=pagesCount;++pageNum){if(pdf_viewer_classPrivateFieldGet(_interruptCopyCondition,this)){return null;}buffer.length=0;const page=await this.pdfDocument.getPage(pageNum);const{items}=await page.getTextContent();for(const item of items){if(item.str){buffer.push(item.str);}if(item.hasEOL){buffer.push("\n");}}texts.push(removeNullCharacters(buffer.join("")));}return texts.join("\n");}setDocument(pdfDocument){if(this.pdfDocument){this.eventBus.dispatch("pagesdestroy",{source:this});this._cancelRendering();this._resetView();this.findController?.setDocument(null);this._scriptingManager?.setDocument(null);if(pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this)){pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this).destroy();pdf_viewer_classPrivateFieldSet(_annotationEditorUIManager,this,null);}}this.pdfDocument=pdfDocument;if(!pdfDocument){return;}const pagesCount=pdfDocument.numPages;const firstPagePromise=pdfDocument.getPage(1);const optionalContentConfigPromise=pdfDocument.getOptionalContentConfig({intent:"display"});const permissionsPromise=pdf_viewer_classPrivateFieldGet(pdf_viewer_enablePermissions,this)?pdfDocument.getPermissions():Promise.resolve();const{eventBus,pageColors,viewer}=this;pdf_viewer_classPrivateFieldSet(pdf_viewer_eventAbortController,this,new AbortController());const{signal}=pdf_viewer_classPrivateFieldGet(pdf_viewer_eventAbortController,this);if(pagesCount>PagesCountLimit.FORCE_SCROLL_MODE_PAGE){console.warn("Forcing PAGE-scrolling for performance reasons, given the length of the document.");const mode=this._scrollMode=ScrollMode.PAGE;eventBus.dispatch("scrollmodechanged",{source:this,mode});}this._pagesCapability.promise.then(()=>{eventBus.dispatch("pagesloaded",{source:this,pagesCount});},()=>{});const onBeforeDraw=evt=>{const pageView=this._pages[evt.pageNumber-1];if(!pageView){return;}pdf_viewer_classPrivateFieldGet(_buffer,this).push(pageView);};eventBus._on("pagerender",onBeforeDraw,{signal});const onAfterDraw=evt=>{if(evt.cssTransform){return;}this._onePageRenderedCapability.resolve({timestamp:evt.timestamp});eventBus._off("pagerendered",onAfterDraw);};eventBus._on("pagerendered",onAfterDraw,{signal});Promise.all([firstPagePromise,permissionsPromise]).then(_ref2=>{let[firstPdfPage,permissions]=_ref2;if(pdfDocument!==this.pdfDocument){return;}this._firstPageCapability.resolve(firstPdfPage);this._optionalContentConfigPromise=optionalContentConfigPromise;const{annotationEditorMode,annotationMode,textLayerMode}=pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_initializePermissions).call(this,permissions);if(textLayerMode!==TextLayerMode.DISABLE){const element=pdf_viewer_classPrivateFieldSet(_hiddenCopyElement,this,document.createElement("div"));element.id="hiddenCopyElement";viewer.before(element);}if(annotationEditorMode!==AnnotationEditorType.DISABLE){const mode=annotationEditorMode;if(pdfDocument.isPureXfa){console.warn("Warning: XFA-editing is not implemented.");}else if(isValidAnnotationEditorMode(mode)){pdf_viewer_classPrivateFieldSet(_annotationEditorUIManager,this,new AnnotationEditorUIManager(this.container,viewer,pdf_viewer_classPrivateFieldGet(_altTextManager,this),eventBus,pdfDocument,pageColors,pdf_viewer_classPrivateFieldGet(_annotationEditorHighlightColors,this),pdf_viewer_classPrivateFieldGet(_enableHighlightFloatingButton,this),pdf_viewer_classPrivateFieldGet(_mlManager,this)));eventBus.dispatch("annotationeditoruimanager",{source:this,uiManager:pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this)});if(mode!==AnnotationEditorType.NONE){pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this).updateMode(mode);}}else{console.error(`Invalid AnnotationEditor mode: ${mode}`);}}const viewerElement=this._scrollMode===ScrollMode.PAGE?null:viewer;const scale=this.currentScale;const viewport=firstPdfPage.getViewport({scale:scale*PixelsPerInch.PDF_TO_CSS_UNITS});viewer.style.setProperty("--scale-factor",viewport.scale);if(pageColors?.foreground==="CanvasText"||pageColors?.background==="Canvas"){viewer.style.setProperty("--hcm-highlight-filter",pdfDocument.filterFactory.addHighlightHCMFilter("highlight","CanvasText","Canvas","HighlightText","Highlight"));viewer.style.setProperty("--hcm-highlight-selected-filter",pdfDocument.filterFactory.addHighlightHCMFilter("highlight_selected","CanvasText","Canvas","HighlightText","ButtonText"));}for(let pageNum=1;pageNum<=pagesCount;++pageNum){const pageView=new PDFPageView({container:viewerElement,eventBus,id:pageNum,scale,defaultViewport:viewport.clone(),optionalContentConfigPromise,renderingQueue:this.renderingQueue,textLayerMode,annotationMode,imageResourcesPath:this.imageResourcesPath,maxCanvasPixels:this.maxCanvasPixels,pageColors,l10n:this.l10n,layerProperties:this._layerProperties});this._pages.push(pageView);}this._pages[0]?.setPdfPage(firstPdfPage);if(this._scrollMode===ScrollMode.PAGE){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_ensurePageViewVisible).call(this);}else if(this._spreadMode!==SpreadMode.NONE){this._updateSpreadMode();}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_onePageRenderedOrForceFetch).call(this,signal).then(async()=>{if(pdfDocument!==this.pdfDocument){return;}this.findController?.setDocument(pdfDocument);this._scriptingManager?.setDocument(pdfDocument);if(pdf_viewer_classPrivateFieldGet(_hiddenCopyElement,this)){document.addEventListener("copy",pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_copyCallback).bind(this,textLayerMode),{signal});}if(pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this)){eventBus.dispatch("annotationeditormodechanged",{source:this,mode:pdf_viewer_classPrivateFieldGet(_annotationEditorMode,this)});}if(pdfDocument.loadingParams.disableAutoFetch||pagesCount>PagesCountLimit.FORCE_LAZY_PAGE_INIT){this._pagesCapability.resolve();return;}let getPagesLeft=pagesCount-1;if(getPagesLeft<=0){this._pagesCapability.resolve();return;}if(pdf_viewer_classPrivateFieldGet(_pageViewMode,this)==="book"){await this.ensureAdjacentPagesAreLoaded();}for(let pageNum=2;pageNum<=pagesCount;++pageNum){const promise=pdfDocument.getPage(pageNum).then(pdfPage=>{const pageView=this._pages[pageNum-1];if(!pageView.pdfPage){pageView.setPdfPage(pdfPage);}if(--getPagesLeft===0){this._pagesCapability.resolve();}},reason=>{console.error(`Unable to get page ${pageNum} to initialize viewer`,reason);if(--getPagesLeft===0){this._pagesCapability.resolve();}});if(pageNum%PagesCountLimit.PAUSE_EAGER_PAGE_INIT===0){await promise;}}});this.hidePagesDependingOnpageViewMode();eventBus.dispatch("pagesinit",{source:this});pdfDocument.getMetadata().then(_ref3=>{let{info}=_ref3;if(pdfDocument!==this.pdfDocument){return;}if(info.Language){viewer.lang=info.Language;}});if(this.defaultRenderingQueue){this.update();}}).catch(reason=>{globalThis.ngxConsole.error("Unable to initialize viewer",reason);this._pagesCapability.reject(reason);});}setPageLabels(labels){if(!this.pdfDocument){return;}if(!labels){this._pageLabels=null;}else if(!(Array.isArray(labels)&&this.pdfDocument.numPages===labels.length)){this._pageLabels=null;globalThis.ngxConsole.error(`setPageLabels: Invalid page labels.`);}else{this._pageLabels=labels;}for(let i=0,ii=this._pages.length;i<ii;i++){this._pages[i].setPageLabel(this._pageLabels?.[i]??null);}}_resetView(){this._pages=[];this._currentPageNumber=1;this._currentScale=UNKNOWN_SCALE;this._currentScaleValue=null;this._pageLabels=null;const bufferSize=Number(PDFViewerApplicationOptions.get("defaultCacheSize"))||DEFAULT_CACHE_SIZE;pdf_viewer_classPrivateFieldSet(_buffer,this,new PDFPageViewBuffer(bufferSize));this._location=null;this._pagesRotation=0;this._optionalContentConfigPromise=null;this._firstPageCapability=Promise.withResolvers();this._onePageRenderedCapability=Promise.withResolvers();this._pagesCapability=Promise.withResolvers();this._scrollMode=ScrollMode.VERTICAL;this._previousScrollMode=ScrollMode.UNKNOWN;this._spreadMode=SpreadMode.NONE;pdf_viewer_classPrivateFieldSet(_scrollModePageState,this,{previousPageNumber:1,scrollDown:true,pages:[]});pdf_viewer_classPrivateFieldGet(pdf_viewer_eventAbortController,this)?.abort();pdf_viewer_classPrivateFieldSet(pdf_viewer_eventAbortController,this,null);this.viewer.textContent="";this._updateScrollMode();this.viewer.removeAttribute("lang");pdf_viewer_classPrivateFieldGet(_hiddenCopyElement,this)?.remove();pdf_viewer_classPrivateFieldSet(_hiddenCopyElement,this,null);}_scrollUpdate(){if(this.pagesCount===0){return;}this.update();}scrollPagePosIntoView(pageNumber,pageSpot){const pageDiv=this._pages[pageNumber-1].div;if(pageSpot){const targetPageSpot={...pageSpot};if(typeof targetPageSpot.top==="string"){if(targetPageSpot.top.endsWith("%")){const percent=Number(targetPageSpot.top.replace("%",""));const viewerHeight=this.viewer.querySelector(".page")?.clientHeight;let height=pageDiv.clientHeight??viewerHeight;const visibleWindowHeight=this.viewer.parentElement.clientHeight;height=Math.max(0,height-visibleWindowHeight);targetPageSpot.top=percent*height/100;}}if(typeof targetPageSpot.left==="string"){if(targetPageSpot.left.endsWith("%")){const percent=Number(targetPageSpot.left.replace("%",""));const viewerWidth=this.viewer.querySelector(".page")?.clientWidth;const width=pageDiv.clientWidth??viewerWidth;targetPageSpot.left=percent*width/100;}}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_scrollIntoView).call(this,{div:pageDiv,id:pageNumber},targetPageSpot);}else{pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_scrollIntoView).call(this,{div:pageDiv,id:pageNumber});}}pageLabelToPageNumber(label){if(!this._pageLabels){return null;}const i=this._pageLabels.indexOf(label);if(i<0){return null;}return i+1;}scrollPageIntoView(_ref4){let{pageNumber,destArray=null,allowNegativeOffset=false,ignoreDestinationZoom=false}=_ref4;if(!this.pdfDocument){return;}const pageView=Number.isInteger(pageNumber)&&this._pages[pageNumber-1];if(!pageView){console.error(`scrollPageIntoView: "${pageNumber}" is not a valid pageNumber parameter.`);return;}if(this.isInPresentationMode||!destArray){this._setCurrentPageNumber(pageNumber,true);return;}let x=0,y=0;let width=0,height=0,widthScale,heightScale;const changeOrientation=pageView.rotation%180!==0;const pageWidth=(changeOrientation?pageView.height:pageView.width)/pageView.scale/PixelsPerInch.PDF_TO_CSS_UNITS;const pageHeight=(changeOrientation?pageView.width:pageView.height)/pageView.scale/PixelsPerInch.PDF_TO_CSS_UNITS;let scale=0;switch(destArray[1].name){case"XYZ":x=destArray[2];y=destArray[3];scale=destArray[4];x=x!==null?x:0;y=y!==null?y:pageHeight;break;case"Fit":case"FitB":scale="page-fit";break;case"FitH":case"FitBH":y=destArray[2];scale="page-width";if(y===null&&this._location){x=this._location.left;y=this._location.top;}else if(typeof y!=="number"||y<0){y=pageHeight;}break;case"FitV":case"FitBV":x=destArray[2];width=pageWidth;height=pageHeight;scale="page-height";break;case"FitR":x=destArray[2];y=destArray[3];width=destArray[4]-x;height=destArray[5]-y;let hPadding=SCROLLBAR_PADDING,vPadding=VERTICAL_PADDING;if(this.removePageBorders){hPadding=vPadding=0;}widthScale=(this.container.clientWidth-hPadding)/width/PixelsPerInch.PDF_TO_CSS_UNITS;heightScale=(this.container.clientHeight-vPadding)/height/PixelsPerInch.PDF_TO_CSS_UNITS;scale=Math.min(Math.abs(widthScale),Math.abs(heightScale));break;default:console.error(`scrollPageIntoView: "${destArray[1].name}" is not a valid destination type.`);return;}if(!ignoreDestinationZoom){if(scale&&scale!==this._currentScale){this.currentScaleValue=scale;}else if(this._currentScale===UNKNOWN_SCALE){this.currentScaleValue=DEFAULT_SCALE_VALUE;}}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_ensurePdfPageLoaded).call(this,pageView).then(()=>{this.renderingQueue.renderView(pageView);if(this.pageViewMode==="single"){if(this.currentPageNumber!==pageNumber){this.currentPageNumber=pageNumber;}}});if(scale==="page-fit"&&!destArray[4]){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_scrollIntoView).call(this,pageView);return;}const boundingRect=[pageView.viewport.convertToViewportPoint(x,y),pageView.viewport.convertToViewportPoint(x+width,y+height)];let left=Math.min(boundingRect[0][0],boundingRect[1][0]);let top=Math.min(boundingRect[0][1],boundingRect[1][1]);if(!allowNegativeOffset){left=Math.max(left,0);top=Math.max(top,0);}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_scrollIntoView).call(this,pageView,{left,top});}_updateLocation(firstPage){const currentScale=this._currentScale;const currentScaleValue=this._currentScaleValue;const normalizedScaleValue=parseFloat(currentScaleValue)===currentScale?Math.round(currentScale*10000)/100:currentScaleValue;const pageNumber=firstPage.id;const currentPageView=this._pages[pageNumber-1];const container=this.container;const topLeft=currentPageView.getPagePoint(container.scrollLeft-firstPage.x,container.scrollTop-firstPage.y);const intLeft=Math.round(topLeft[0]);const intTop=Math.round(topLeft[1]);let pdfOpenParams=`#page=${pageNumber}`;if(!this.isInPresentationMode){pdfOpenParams+=`&zoom=${normalizedScaleValue},${intLeft},${intTop}`;}this._location={pageNumber,scale:normalizedScaleValue,top:intTop,left:intLeft,rotation:this._pagesRotation,pdfOpenParams};}update(){let noScroll=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;if(this.scrollMode===ScrollMode.PAGE){this.viewer.classList.add("singlePageView");}else{this.viewer.classList.remove("singlePageView");}const visible=this._getVisiblePages();const visiblePages=visible.views,numVisiblePages=visiblePages.length;if(numVisiblePages===0){return;}const bufferSize=Number(PDFViewerApplicationOptions.get("defaultCacheSize"))||DEFAULT_CACHE_SIZE;const newCacheSize=Math.max(bufferSize,2*numVisiblePages+1);pdf_viewer_classPrivateFieldGet(_buffer,this).resize(newCacheSize,visible.ids);this.renderingQueue.renderHighestPriority(visible);const isSimpleLayout=this._spreadMode===SpreadMode.NONE&&(this._scrollMode===ScrollMode.PAGE||this._scrollMode===ScrollMode.VERTICAL);const currentId=this._currentPageNumber;let stillFullyVisible=false;for(const page of visiblePages){if(page.percent<100){break;}if(page.id===currentId&&isSimpleLayout){stillFullyVisible=true;break;}}if(this.scrollMode!==ScrollMode.PAGE&&!noScroll){this._setCurrentPageNumber(stillFullyVisible?currentId:visiblePages[0].id);this._updateLocation(visible.first);this.eventBus.dispatch("updateviewarea",{source:this,location:this._location});}this.hidePagesDependingOnpageViewMode();}containsElement(element){return this.container.contains(element);}focus(){this.container.focus();}get _isContainerRtl(){return getComputedStyle(this.container).direction==="rtl";}get isInPresentationMode(){return this.presentationModeState===PresentationModeState.FULLSCREEN;}get isChangingPresentationMode(){return this.presentationModeState===PresentationModeState.CHANGING;}get isHorizontalScrollbarEnabled(){return this.isInPresentationMode?false:this.container.scrollWidth>this.container.clientWidth;}get isVerticalScrollbarEnabled(){return this.isInPresentationMode?false:this.container.scrollHeight>this.container.clientHeight;}_getVisiblePages(){const views=this._scrollMode===ScrollMode.PAGE?pdf_viewer_classPrivateFieldGet(_scrollModePageState,this).pages:this._pages,horizontal=this._scrollMode===ScrollMode.HORIZONTAL,rtl=horizontal&&this._isContainerRtl;return getVisibleElements({scrollEl:this.container,views,sortByVisibility:true,horizontal,rtl});}cleanup(){for(const pageView of this._pages){if(pageView.renderingState!==RenderingStates.FINISHED){pageView.reset();}}}_cancelRendering(){for(const pageView of this._pages){pageView.cancelRendering();}}forceRendering(currentlyVisiblePages){const visiblePages=currentlyVisiblePages||this._getVisiblePages();const scrollAhead=pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_getScrollAhead).call(this,visiblePages);const preRenderExtra=this._spreadMode!==SpreadMode.NONE&&this._scrollMode!==ScrollMode.HORIZONTAL;const pageView=this.renderingQueue.getHighestPriority(visiblePages,this._pages,scrollAhead,preRenderExtra);if(pageView){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,pdf_viewer_ensurePdfPageLoaded).call(this,pageView).then(()=>{this.renderingQueue.renderView(pageView);});return true;}return false;}get hasEqualPageSizes(){const firstPageView=this._pages[0];for(let i=1,ii=this._pages.length;i<ii;++i){const pageView=this._pages[i];if(pageView.width!==firstPageView.width||pageView.height!==firstPageView.height){return false;}}return true;}getPagesOverview(){let initialOrientation;return this._pages.map(pageView=>{const viewport=pageView.pdfPage.getViewport({scale:1});const orientation=isPortraitOrientation(viewport);if(initialOrientation===undefined){initialOrientation=orientation;}else if(this.enablePrintAutoRotate&&orientation!==initialOrientation){return{width:viewport.height,height:viewport.width,rotation:(viewport.rotation-90)%360};}return{width:viewport.width,height:viewport.height,rotation:viewport.rotation};});}get optionalContentConfigPromise(){if(!this.pdfDocument){return Promise.resolve(null);}if(!this._optionalContentConfigPromise){console.error("optionalContentConfigPromise: Not initialized yet.");return this.pdfDocument.getOptionalContentConfig({intent:"display"});}return this._optionalContentConfigPromise;}set optionalContentConfigPromise(promise){if(!(promise instanceof Promise)){throw new Error(`Invalid optionalContentConfigPromise: ${promise}`);}if(!this.pdfDocument){return;}if(!this._optionalContentConfigPromise){return;}this._optionalContentConfigPromise=promise;this.refresh(false,{optionalContentConfigPromise:promise});this.eventBus.dispatch("optionalcontentconfigchanged",{source:this,promise});}get scrollMode(){return this._scrollMode;}set scrollMode(mode){if(this._scrollMode===mode){return;}if(!isValidScrollMode(mode)){throw new Error(`Invalid scroll mode: ${mode}`);}if(this.pagesCount>PagesCountLimit.FORCE_SCROLL_MODE_PAGE){return;}this._previousScrollMode=this._scrollMode;this._scrollMode=mode;this.eventBus.dispatch("scrollmodechanged",{source:this,mode});this._updateScrollMode(this._currentPageNumber);}_updateScrollMode(){let pageNumber=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;const scrollMode=this._scrollMode,viewer=this.viewer;viewer.classList.toggle("scrollHorizontal",scrollMode===ScrollMode.HORIZONTAL);viewer.classList.toggle("scrollWrapped",scrollMode===ScrollMode.WRAPPED);if(!this.pdfDocument||!pageNumber){return;}if(scrollMode===ScrollMode.PAGE){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_ensurePageViewVisible).call(this);}else if(this._previousScrollMode===ScrollMode.PAGE){this._updateSpreadMode();}if(this._currentScaleValue&&isNaN(this._currentScaleValue)){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,this._currentScaleValue,{noScroll:true});}this._setCurrentPageNumber(pageNumber,true);this.update();}get spreadMode(){return this._spreadMode;}set spreadMode(mode){if(this._spreadMode===mode){return;}if(!isValidSpreadMode(mode)){throw new Error(`Invalid spread mode: ${mode}`);}this._spreadMode=mode;this.eventBus.dispatch("spreadmodechanged",{source:this,mode});this._updateSpreadMode(this._currentPageNumber);}_updateSpreadMode(){let pageNumber=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(!this.pdfDocument){return;}const viewer=this.viewer,pages=this._pages;if(this._scrollMode===ScrollMode.PAGE){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_ensurePageViewVisible).call(this);}else{viewer.textContent="";if(this._spreadMode===SpreadMode.NONE){for(const pageView of this._pages){viewer.append(pageView.div);}}else{const parity=this._spreadMode-1;let spread=null;for(let i=0,ii=pages.length;i<ii;++i){if(spread===null){spread=document.createElement("div");spread.className="spread";viewer.append(spread);}else if(i%2===parity){spread=spread.cloneNode(false);viewer.append(spread);}spread.append(pages[i].div);}}}this.hidePagesDependingOnpageViewMode();if(!pageNumber){return;}if(this._currentScaleValue&&isNaN(this._currentScaleValue)){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,this._currentScaleValue,{noScroll:true});}this._setCurrentPageNumber(pageNumber,true);this.update();}_getPageAdvance(currentPageNumber){let previous=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(this.pageViewMode==="book"){return 2;}switch(this._scrollMode){case ScrollMode.WRAPPED:{const{views}=this._getVisiblePages(),pageLayout=new Map();for(const{id,y,percent,widthPercent}of views){if(percent===0||widthPercent<100){continue;}let yArray=pageLayout.get(y);if(!yArray){pageLayout.set(y,yArray||=[]);}yArray.push(id);}for(const yArray of pageLayout.values()){const currentIndex=yArray.indexOf(currentPageNumber);if(currentIndex===-1){continue;}const numPages=yArray.length;if(numPages===1){break;}if(previous){for(let i=currentIndex-1,ii=0;i>=ii;i--){const currentId=yArray[i],expectedId=yArray[i+1]-1;if(currentId<expectedId){return currentPageNumber-expectedId;}}}else{for(let i=currentIndex+1,ii=numPages;i<ii;i++){const currentId=yArray[i],expectedId=yArray[i-1]+1;if(currentId>expectedId){return expectedId-currentPageNumber;}}}if(previous){const firstId=yArray[0];if(firstId<currentPageNumber){return currentPageNumber-firstId+1;}}else{const lastId=yArray[numPages-1];if(lastId>currentPageNumber){return lastId-currentPageNumber+1;}}break;}break;}case ScrollMode.HORIZONTAL:{break;}case ScrollMode.PAGE:case ScrollMode.VERTICAL:{if(this._spreadMode===SpreadMode.NONE){break;}const parity=this._spreadMode-1;if(previous&&currentPageNumber%2!==parity){break;}else if(!previous&&currentPageNumber%2===parity){break;}const{views}=this._getVisiblePages(),expectedId=previous?currentPageNumber-1:currentPageNumber+1;for(const{id,percent,widthPercent}of views){if(id!==expectedId){continue;}if(percent>0&&widthPercent===100){return 2;}break;}break;}}return 1;}nextPage(){const currentPageNumber=this._currentPageNumber,pagesCount=this.pagesCount;if(currentPageNumber>=pagesCount){return false;}const advance=this._getPageAdvance(currentPageNumber,false)||1;this.currentPageNumber=Math.min(currentPageNumber+advance,pagesCount);return true;}previousPage(){const currentPageNumber=this._currentPageNumber;if(currentPageNumber<=1){return false;}const advance=this._getPageAdvance(currentPageNumber,true)||1;this.currentPageNumber=Math.max(currentPageNumber-advance,1);return true;}updateScale(_ref5){let{drawingDelay,scaleFactor=null,steps=null,origin}=_ref5;if(steps===null&&scaleFactor===null){throw new Error("Invalid updateScale options: either `steps` or `scaleFactor` must be provided.");}if(!this.pdfDocument){return;}let newScale=this._currentScale;if(scaleFactor>0&&scaleFactor!==1){newScale=Math.round(newScale*scaleFactor*100)/100;}else if(steps){const delta=steps>0?DEFAULT_SCALE_DELTA:1/DEFAULT_SCALE_DELTA;const round=steps>0?Math.ceil:Math.floor;steps=Math.abs(steps);do{newScale=round((newScale*delta).toFixed(2)*10)/10;}while(--steps>0);}let minScale=Number(PDFViewerApplicationOptions.get("minZoom"));if(!minScale){minScale=MIN_SCALE;}newScale=Math.max(minScale,newScale);let maxScale=Number(PDFViewerApplicationOptions.get("maxZoom"));if(!maxScale){maxScale=MAX_SCALE;}newScale=Math.min(maxScale,newScale);pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,newScale,{noScroll:false,drawingDelay,origin});}increaseScale(){let options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};this.updateScale({...options,steps:options.steps??1});}decreaseScale(){let options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};this.updateScale({...options,steps:-(options.steps??1)});}get containerTopLeft(){return pdf_viewer_classPrivateFieldGet(_containerTopLeft,this)||pdf_viewer_classPrivateFieldSet(_containerTopLeft,this,[this.container.offsetTop,this.container.offsetLeft]);}get annotationEditorMode(){return pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this)?pdf_viewer_classPrivateFieldGet(_annotationEditorMode,this):AnnotationEditorType.DISABLE;}set annotationEditorMode(_ref6){let{mode,editId=null,isFromKeyboard=false}=_ref6;if(!pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this)){throw new Error(`The AnnotationEditor is not enabled.`);}if(pdf_viewer_classPrivateFieldGet(_annotationEditorMode,this)===mode){return;}if(!isValidAnnotationEditorMode(mode)){throw new Error(`Invalid AnnotationEditor mode: ${mode}`);}if(!this.pdfDocument){return;}pdf_viewer_classPrivateFieldSet(_annotationEditorMode,this,mode);this.eventBus.dispatch("annotationeditormodechanged",{source:this,mode});pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this).updateMode(mode,editId,isFromKeyboard);}set annotationEditorParams(_ref7){let{type,value}=_ref7;if(!pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this)){throw new Error(`The AnnotationEditor is not enabled.`);}pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this).updateParams(type,value);}refresh(){let noUpdate=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;let updateArgs=arguments.length>1&&arguments[1]!==undefined?arguments[1]:Object.create(null);if(!this.pdfDocument){return;}for(const pageView of this._pages){pageView.update(updateArgs);}if(pdf_viewer_classPrivateFieldGet(_scaleTimeoutId,this)!==null){clearTimeout(pdf_viewer_classPrivateFieldGet(_scaleTimeoutId,this));pdf_viewer_classPrivateFieldSet(_scaleTimeoutId,this,null);}if(!noUpdate){this.update();}}getSerializedAnnotations(){const rawAnnotations=this.pdfDocument.annotationStorage.getAll();if(rawAnnotations){const annotations=Object.values(rawAnnotations);return annotations.filter(a=>a.serialize).map(a=>a.serialize()).filter(a=>a?.annotationType!==undefined);}return null;}addEditorAnnotation(data){if(!Array.isArray(data)){data=[data];}pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this).addSerializedEditor(data,true,true,false);}removeEditorAnnotations(){let filter=arguments.length>0&&arguments[0]!==undefined?arguments[0]:()=>true;pdf_viewer_classPrivateFieldGet(_annotationEditorUIManager,this).removeEditors(filter);}destroyBookMode(){if(this.pageFlip){this.pageFlip.destroy();this.pageFlip=null;}}stopRendering(){this._cancelRendering();}}function _findParentWithScrollbar(element){while(element){if(element.scrollHeight>element.clientHeight||element.scrollWidth>element.clientWidth){return element;}element=element.parentElement;}return null;}function _initializePermissions(permissions){const params={annotationEditorMode:pdf_viewer_classPrivateFieldGet(_annotationEditorMode,this),annotationMode:pdf_viewer_classPrivateFieldGet(pdf_viewer_annotationMode,this),textLayerMode:pdf_viewer_classPrivateFieldGet(pdf_viewer_textLayerMode,this)};if(!permissions){return params;}if(!permissions.includes(PermissionFlag.COPY)&&pdf_viewer_classPrivateFieldGet(pdf_viewer_textLayerMode,this)===TextLayerMode.ENABLE){params.textLayerMode=TextLayerMode.ENABLE_PERMISSIONS;}if(!permissions.includes(PermissionFlag.MODIFY_CONTENTS)){params.annotationEditorMode=AnnotationEditorType.DISABLE;}if(!permissions.includes(PermissionFlag.MODIFY_ANNOTATIONS)&&!permissions.includes(PermissionFlag.FILL_INTERACTIVE_FORMS)&&pdf_viewer_classPrivateFieldGet(pdf_viewer_annotationMode,this)===AnnotationMode.ENABLE_FORMS){params.annotationMode=AnnotationMode.ENABLE;}return params;}async function _onePageRenderedOrForceFetch(signal){if(document.visibilityState==="hidden"||!this.container.offsetParent||this._getVisiblePages().views.length===0){return;}const hiddenCapability=Promise.withResolvers();function onVisibilityChange(){if(document.visibilityState==="hidden"){hiddenCapability.resolve();}}document.addEventListener("visibilitychange",onVisibilityChange,{signal});await Promise.race([this._onePageRenderedCapability.promise,hiddenCapability.promise]);document.removeEventListener("visibilitychange",onVisibilityChange);}function _copyCallback(textLayerMode,event){const selection=document.getSelection();const{focusNode,anchorNode}=selection;if(anchorNode&&focusNode&&selection.containsNode(pdf_viewer_classPrivateFieldGet(_hiddenCopyElement,this))){if(pdf_viewer_classPrivateFieldGet(_getAllTextInProgress,this)||textLayerMode===TextLayerMode.ENABLE_PERMISSIONS){event.preventDefault();event.stopPropagation();return;}pdf_viewer_classPrivateFieldSet(_getAllTextInProgress,this,true);const savedCursor=this.container.style.cursor;this.container.style.cursor="wait";const interruptCopy=ev=>pdf_viewer_classPrivateFieldSet(_interruptCopyCondition,this,ev.key==="Escape");window.addEventListener("keydown",interruptCopy);this.getAllText().then(async text=>{if(text!==null){await navigator.clipboard.writeText(text);}}).catch(reason=>{console.warn(`Something goes wrong when extracting the text: ${reason.message}`);}).finally(()=>{pdf_viewer_classPrivateFieldSet(_getAllTextInProgress,this,false);pdf_viewer_classPrivateFieldSet(_interruptCopyCondition,this,false);window.removeEventListener("keydown",interruptCopy);this.container.style.cursor=savedCursor;});event.preventDefault();event.stopPropagation();}}function _ensurePageViewVisible(){if(this._scrollMode!==ScrollMode.PAGE){throw new Error("#ensurePageViewVisible: Invalid scrollMode value.");}const pageNumber=this._currentPageNumber,state=pdf_viewer_classPrivateFieldGet(_scrollModePageState,this),viewer=this.viewer;viewer.textContent="";state.pages.length=0;if(this._spreadMode===SpreadMode.NONE&&!this.isInPresentationMode){const pageView=this._pages[pageNumber-1];viewer.append(pageView.div);state.pages.push(pageView);}else{const pageIndexSet=new Set(),parity=this._spreadMode-1;if(parity===-1){pageIndexSet.add(pageNumber-1);}else if(pageNumber%2!==parity){pageIndexSet.add(pageNumber-1);pageIndexSet.add(pageNumber);}else{pageIndexSet.add(pageNumber-2);pageIndexSet.add(pageNumber-1);}const spread=document.createElement("div");spread.className="spread";if(this.isInPresentationMode){const dummyPage=document.createElement("div");dummyPage.className="dummyPage";spread.append(dummyPage);}for(const i of pageIndexSet){const pageView=this._pages[i];if(!pageView){continue;}spread.append(pageView.div);state.pages.push(pageView);}viewer.append(spread);}state.scrollDown=pageNumber>=state.previousPageNumber;state.previousPageNumber=pageNumber;}function _scrollIntoView(pageView){let pageSpot=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;if(!pageView){return;}const{div,id}=pageView;if(this._currentPageNumber!==id){this._setCurrentPageNumber(id);}if(this._scrollMode===ScrollMode.PAGE){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_ensurePageViewVisible).call(this);this.update();}if(!pageSpot&&!this.isInPresentationMode){const left=div.offsetLeft+div.clientLeft,right=left+div.clientWidth;const{scrollLeft,clientWidth}=this.container;if(this._scrollMode===ScrollMode.HORIZONTAL||left<scrollLeft||right>scrollLeft+clientWidth){pageSpot={left:0,top:0};}}scrollIntoView(div,pageSpot,false,this.pageViewMode==="infinite-scroll");if(!this._currentScaleValue&&this._location){this._location=null;}}function _isSameScale(newScale){return newScale===this._currentScale||Math.abs(newScale-this._currentScale)<1e-15;}function _setScaleUpdatePages(newScale,newValue,_ref8){let{noScroll=false,preset=false,drawingDelay=-1,origin=null}=_ref8;const previousScale=isNaN(Number(this.currentScale))?undefined:Number(this.currentScale);const previousScaleValue=this.currentScaleValue;this._currentScaleValue=newValue.toString();if(pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_isSameScale).call(this,newScale)){if(preset){this.eventBus.dispatch("scalechanging",{source:this,scale:newScale,presetValue:newValue,previousScale,previousPresetValue:previousScaleValue,noScroll});}return;}this.viewer.style.setProperty("--scale-factor",newScale*PixelsPerInch.PDF_TO_CSS_UNITS);const postponeDrawing=drawingDelay>=0&&drawingDelay<1000;this.refresh(true,{scale:newScale,drawingDelay:postponeDrawing?drawingDelay:-1});if(postponeDrawing){pdf_viewer_classPrivateFieldSet(_scaleTimeoutId,this,setTimeout(()=>{pdf_viewer_classPrivateFieldSet(_scaleTimeoutId,this,null);this.refresh();},drawingDelay));}this._currentScale=newScale;if(!noScroll){let page=this._currentPageNumber,dest;if(this._location&&!(this.isInPresentationMode||this.isChangingPresentationMode)){page=this._location.pageNumber;dest=[null,{name:"XYZ"},this._location.left,this._location.top,null];}this.scrollPageIntoView({pageNumber:page,destArray:dest,allowNegativeOffset:true});if(Array.isArray(origin)){const scaleDiff=newScale/previousScale-1;const[top,left]=this.containerTopLeft;this.container.scrollLeft+=(origin[0]-left)*scaleDiff;this.container.scrollTop+=(origin[1]-top)*scaleDiff;}}this.eventBus.dispatch("scalechanging",{source:this,scale:newScale,presetValue:preset?newValue:undefined,previousScale,previousPresetValue:previousScaleValue,noScroll});if(this.defaultRenderingQueue){this.update();}}function _get_pageWidthScaleFactor(_this){if(_this._spreadMode!==SpreadMode.NONE&&_this._scrollMode!==ScrollMode.HORIZONTAL){return 2;}return 1;}function _setScale(value,options){if(!value){value="auto";}let scale=parseFloat(value);if(this._currentScale===scale){return;}if(scale>0){options.preset=false;pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScaleUpdatePages).call(this,scale,value,options);}else{const currentPage=this._pages[this._currentPageNumber-1];if(!currentPage){return;}let hPadding=SCROLLBAR_PADDING,vPadding=VERTICAL_PADDING;if(this.isInPresentationMode){hPadding=vPadding=4;if(this._spreadMode!==SpreadMode.NONE){hPadding*=2;}}else if(this.removePageBorders){hPadding=vPadding=0;}else if(this._scrollMode===ScrollMode.HORIZONTAL){[hPadding,vPadding]=[vPadding,hPadding];}const pageWidthScale=(this.container.clientWidth-hPadding)/currentPage.width*currentPage.scale/pdf_viewer_classPrivateGetter(_PDFViewer_brand,this,_get_pageWidthScaleFactor);const pageHeightScale=(this.container.clientHeight-vPadding)/currentPage.height*currentPage.scale;switch(value){case"page-actual":scale=1;break;case"page-width":scale=pageWidthScale;break;case"page-height":scale=pageHeightScale;break;case"page-fit":scale=Math.min(pageWidthScale,pageHeightScale);break;case"auto":const horizontalScale=isPortraitOrientation(currentPage)?pageWidthScale:Math.min(pageHeightScale,pageWidthScale);scale=Math.min(MAX_AUTO_SCALE,horizontalScale);break;default:globalThis.ngxConsole.error(`#setScale: "${value}" is an unknown zoom value.`);return;}options.preset=true;pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScaleUpdatePages).call(this,scale,value,options);}}function _resetCurrentPageView(){const pageView=this._pages[this._currentPageNumber-1];if(this.isInPresentationMode){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_setScale).call(this,this._currentScaleValue,{noScroll:true});}pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_scrollIntoView).call(this,pageView);}async function pdf_viewer_ensurePdfPageLoaded(pageView){if(pageView.pdfPage){return pageView.pdfPage;}try{const pdfPage=await this.pdfDocument.getPage(pageView.id);if(!pageView.pdfPage){pageView.setPdfPage(pdfPage);}return pdfPage;}catch(reason){console.error("Unable to get page for page view",reason);return null;}}function pdf_viewer_getScrollAhead(visible){if(visible.first?.id===1){return true;}else if(visible.last?.id===this.pagesCount){return false;}switch(this._scrollMode){case ScrollMode.PAGE:return pdf_viewer_classPrivateFieldGet(_scrollModePageState,this).scrollDown;case ScrollMode.HORIZONTAL:return this.scroll.right;}return this.scroll.down;}function _updateContainerHeightCss(){let height=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.container.clientHeight;if(height!==pdf_viewer_classPrivateFieldGet(_previousContainerHeight,this)){pdf_viewer_classPrivateFieldSet(_previousContainerHeight,this,height);docStyle.setProperty("--viewer-container-height",`${height}px`);}}function pdf_viewer_resizeObserverCallback(entries){for(const entry of entries){if(entry.target===this.container){pdf_viewer_assertClassBrand(_PDFViewer_brand,this,_updateContainerHeightCss).call(this,Math.floor(entry.borderBoxSize[0].blockSize));pdf_viewer_classPrivateFieldSet(_containerTopLeft,this,null);break;}}}
;// CONCATENATED MODULE: ./web/secondary_toolbar.js
function secondary_toolbar_classPrivateMethodInitSpec(e,a){secondary_toolbar_checkPrivateRedeclaration(e,a),a.add(e);}function secondary_toolbar_classPrivateFieldInitSpec(e,t,a){secondary_toolbar_checkPrivateRedeclaration(e,t),t.set(e,a);}function secondary_toolbar_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function secondary_toolbar_classPrivateFieldGet(s,a){return s.get(secondary_toolbar_assertClassBrand(s,a));}function secondary_toolbar_classPrivateFieldSet(s,a,r){return s.set(secondary_toolbar_assertClassBrand(s,a),r),r;}function secondary_toolbar_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var _opts=/*#__PURE__*/new WeakMap();var _SecondaryToolbar_brand=/*#__PURE__*/new WeakSet();class SecondaryToolbar{constructor(options,_eventBus){secondary_toolbar_classPrivateMethodInitSpec(this,_SecondaryToolbar_brand);secondary_toolbar_classPrivateFieldInitSpec(this,_opts,void 0);secondary_toolbar_classPrivateFieldSet(_opts,this,options);const _buttons=[{element:options.presentationModeButton,eventName:"presentationmode",close:true},{element:options.printButton,eventName:"print",close:true},{element:options.downloadButton,eventName:"download",close:true},{element:options.viewBookmarkButton,eventName:null,close:true},{element:options.firstPageButton,eventName:"firstpage",close:true},{element:options.lastPageButton,eventName:"lastpage",close:true},{element:options.pageRotateCwButton,eventName:"rotatecw",close:false},{element:options.pageRotateCcwButton,eventName:"rotateccw",close:false},{element:options.cursorSelectToolButton,eventName:"switchcursortool",eventDetails:{tool:CursorTool.SELECT},close:true},{element:options.cursorHandToolButton,eventName:"switchcursortool",eventDetails:{tool:CursorTool.HAND},close:true},{element:options.scrollPageButton,eventName:"switchscrollmode",eventDetails:{mode:ScrollMode.PAGE},close:true},{element:options.scrollVerticalButton,eventName:"switchscrollmode",eventDetails:{mode:ScrollMode.VERTICAL},close:true},{element:options.scrollHorizontalButton,eventName:"switchscrollmode",eventDetails:{mode:ScrollMode.HORIZONTAL},close:true},{element:options.scrollWrappedButton,eventName:"switchscrollmode",eventDetails:{mode:ScrollMode.WRAPPED},close:true},{element:options.spreadNoneButton,eventName:"switchspreadmode",eventDetails:{mode:SpreadMode.NONE},close:true},{element:options.spreadOddButton,eventName:"switchspreadmode",eventDetails:{mode:SpreadMode.ODD},close:true},{element:options.spreadEvenButton,eventName:"switchspreadmode",eventDetails:{mode:SpreadMode.EVEN},close:true},{element:options.documentPropertiesButton,eventName:"documentproperties",close:true}];_buttons.push({element:options.openFileButton,eventName:"openfile",close:true});this.eventBus=_eventBus;this.opened=false;secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,secondary_toolbar_bindListeners).call(this,_buttons);this.reset();}get isOpen(){return this.opened;}setPageNumber(pageNumber){this.pageNumber=pageNumber;secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,secondary_toolbar_updateUIState).call(this);}setPagesCount(pagesCount){this.pagesCount=pagesCount;secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,secondary_toolbar_updateUIState).call(this);}reset(){this.pageNumber=0;this.pagesCount=0;secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,secondary_toolbar_updateUIState).call(this);this.eventBus.dispatch("switchcursortool",{source:this,reset:true});secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,_scrollModeChanged).call(this,{mode:ScrollMode.VERTICAL});secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,_spreadModeChanged).call(this,{mode:SpreadMode.NONE});}open(){if(this.opened){return;}this.opened=true;const{toggleButton,toolbar}=secondary_toolbar_classPrivateFieldGet(_opts,this);toggleExpandedBtn(toggleButton,true,toolbar);}close(){if(!this.opened){return;}this.opened=false;const{toggleButton,toolbar}=secondary_toolbar_classPrivateFieldGet(_opts,this);toggleExpandedBtn(toggleButton,false,toolbar);}toggle(){if(this.opened){this.close();}else{this.open();}}}function secondary_toolbar_updateUIState(){const{firstPageButton,lastPageButton,pageRotateCwButton,pageRotateCcwButton}=secondary_toolbar_classPrivateFieldGet(_opts,this);firstPageButton.disabled=this.pageNumber<=1;lastPageButton.disabled=this.pageNumber>=this.pagesCount;pageRotateCwButton.disabled=this.pagesCount===0;pageRotateCcwButton.disabled=this.pagesCount===0;}function secondary_toolbar_bindListeners(buttons){const{eventBus}=this;const{toggleButton}=secondary_toolbar_classPrivateFieldGet(_opts,this);toggleButton.addEventListener("click",this.toggle.bind(this));for(const{element,eventName,close,eventDetails}of buttons){element.addEventListener("click",evt=>{if(eventName!==null){eventBus.dispatch(eventName,{source:this,...eventDetails});}if(close){this.close();}eventBus.dispatch("reporttelemetry",{source:this,details:{type:"buttons",data:{id:element.id}}});});}eventBus._on("cursortoolchanged",secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,_cursorToolChanged).bind(this));eventBus._on("scrollmodechanged",secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,_scrollModeChanged).bind(this));eventBus._on("spreadmodechanged",secondary_toolbar_assertClassBrand(_SecondaryToolbar_brand,this,_spreadModeChanged).bind(this));}function _cursorToolChanged(_ref){let{tool}=_ref;const{cursorSelectToolButton,cursorHandToolButton}=secondary_toolbar_classPrivateFieldGet(_opts,this);toggleCheckedBtn(cursorSelectToolButton,tool===CursorTool.SELECT);toggleCheckedBtn(cursorHandToolButton,tool===CursorTool.HAND);}function _scrollModeChanged(_ref2){let{mode}=_ref2;const{scrollPageButton,scrollVerticalButton,scrollHorizontalButton,scrollWrappedButton,spreadNoneButton,spreadOddButton,spreadEvenButton}=secondary_toolbar_classPrivateFieldGet(_opts,this);toggleCheckedBtn(scrollPageButton,mode===ScrollMode.PAGE);toggleCheckedBtn(scrollVerticalButton,mode===ScrollMode.VERTICAL);toggleCheckedBtn(scrollHorizontalButton,mode===ScrollMode.HORIZONTAL);toggleCheckedBtn(scrollWrappedButton,mode===ScrollMode.WRAPPED);const forceScrollModePage=this.pagesCount>PagesCountLimit.FORCE_SCROLL_MODE_PAGE;scrollPageButton.disabled=forceScrollModePage;scrollVerticalButton.disabled=forceScrollModePage;scrollHorizontalButton.disabled=forceScrollModePage;scrollWrappedButton.disabled=forceScrollModePage;const isHorizontal=mode===ScrollMode.HORIZONTAL;spreadNoneButton.disabled=isHorizontal;spreadOddButton.disabled=isHorizontal;spreadEvenButton.disabled=isHorizontal;}function _spreadModeChanged(_ref3){let{mode}=_ref3;const{spreadNoneButton,spreadOddButton,spreadEvenButton}=secondary_toolbar_classPrivateFieldGet(_opts,this);toggleCheckedBtn(spreadNoneButton,mode===SpreadMode.NONE);toggleCheckedBtn(spreadOddButton,mode===SpreadMode.ODD);toggleCheckedBtn(spreadEvenButton,mode===SpreadMode.EVEN);}
;// CONCATENATED MODULE: ./web/toolbar.js
function toolbar_classPrivateMethodInitSpec(e,a){toolbar_checkPrivateRedeclaration(e,a),a.add(e);}function toolbar_classPrivateFieldInitSpec(e,t,a){toolbar_checkPrivateRedeclaration(e,t),t.set(e,a);}function toolbar_checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object");}function toolbar_classPrivateFieldGet(s,a){return s.get(toolbar_assertClassBrand(s,a));}function toolbar_classPrivateFieldSet(s,a,r){return s.set(toolbar_assertClassBrand(s,a),r),r;}function toolbar_assertClassBrand(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object");}var toolbar_opts=/*#__PURE__*/new WeakMap();var _Toolbar_brand=/*#__PURE__*/new WeakSet();class Toolbar{constructor(options,_eventBus){toolbar_classPrivateMethodInitSpec(this,_Toolbar_brand);toolbar_classPrivateFieldInitSpec(this,toolbar_opts,void 0);toolbar_classPrivateFieldSet(toolbar_opts,this,options);this.eventBus=_eventBus;const _buttons=[{element:options.previous,eventName:"previouspage"},{element:options.next,eventName:"nextpage"},{element:options.zoomIn,eventName:"zoomin"},{element:options.zoomOut,eventName:"zoomout"},{element:options.print,eventName:"print"},{element:options.presentationModeButton,eventName:"presentationmode"},{element:options.download,eventName:"download"},{element:options.editorFreeTextButton,eventName:"switchannotationeditormode",eventDetails:{get mode(){const{classList}=options.editorFreeTextButton;return classList.contains("toggled")?AnnotationEditorType.NONE:AnnotationEditorType.FREETEXT;}}},{element:options.editorHighlightButton,eventName:"switchannotationeditormode",eventDetails:{get mode(){const{classList}=options.editorHighlightButton;return classList.contains("toggled")?AnnotationEditorType.NONE:AnnotationEditorType.HIGHLIGHT;}}},{element:options.editorInkButton,eventName:"switchannotationeditormode",eventDetails:{get mode(){const{classList}=options.editorInkButton;return classList.contains("toggled")?AnnotationEditorType.NONE:AnnotationEditorType.INK;}}},{element:options.editorStampButton,eventName:"switchannotationeditormode",eventDetails:{get mode(){const{classList}=options.editorStampButton;return classList.contains("toggled")?AnnotationEditorType.NONE:AnnotationEditorType.STAMP;}}}];toolbar_assertClassBrand(_Toolbar_brand,this,toolbar_bindListeners).call(this,_buttons);if(options.editorHighlightColorPicker){_eventBus._on("annotationeditoruimanager",_ref=>{let{uiManager}=_ref;toolbar_assertClassBrand(_Toolbar_brand,this,_setAnnotationEditorUIManager).call(this,uiManager,options.editorHighlightColorPicker);},{once:true});}_eventBus._on("showannotationeditorui",_ref2=>{let{mode}=_ref2;switch(mode){case AnnotationEditorType.HIGHLIGHT:options.editorHighlightButton.click();break;}});this.reset();}setPageNumber(pageNumber,pageLabel){this.pageNumber=pageNumber;this.pageLabel=pageLabel;toolbar_assertClassBrand(_Toolbar_brand,this,toolbar_updateUIState).call(this,false);}setPagesCount(pagesCount,hasPageLabels){this.pagesCount=pagesCount;this.hasPageLabels=hasPageLabels;toolbar_assertClassBrand(_Toolbar_brand,this,toolbar_updateUIState).call(this,true);}setPageScale(pageScaleValue,pageScale){this.pageScaleValue=(pageScaleValue||pageScale).toString();this.pageScale=pageScale;toolbar_assertClassBrand(_Toolbar_brand,this,toolbar_updateUIState).call(this,false);}reset(){this.pageNumber=0;this.pageLabel=null;this.hasPageLabels=false;this.pagesCount=0;const defaultZoomOption=PDFViewerApplicationOptions.get('defaultZoomValue');if(defaultZoomOption){this.pageScaleValue=defaultZoomOption;if(!!Number(defaultZoomOption)){this.pageScale=Number(defaultZoomOption);}}else{this.pageScaleValue=DEFAULT_SCALE_VALUE;this.pageScale=DEFAULT_SCALE;}toolbar_assertClassBrand(_Toolbar_brand,this,toolbar_updateUIState).call(this,true);this.updateLoadingIndicatorState();toolbar_assertClassBrand(_Toolbar_brand,this,_editorModeChanged).call(this,{mode:AnnotationEditorType.DISABLE});}updateLoadingIndicatorState(){let loading=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;const{pageNumber}=toolbar_classPrivateFieldGet(toolbar_opts,this);pageNumber.classList.toggle("loading",loading);}}function _setAnnotationEditorUIManager(uiManager,parentContainer){const colorPicker=new ColorPicker({uiManager});uiManager.setMainHighlightColorPicker(colorPicker);parentContainer.append(colorPicker.renderMainDropdown());}function toolbar_bindListeners(buttons){const{eventBus}=this;const{pageNumber,scaleSelect}=toolbar_classPrivateFieldGet(toolbar_opts,this);const self=this;for(const{element,eventName,eventDetails}of buttons){element.addEventListener("click",evt=>{if(eventName!==null){eventBus.dispatch(eventName,{source:this,...eventDetails,isFromKeyboard:evt.detail===0});}});}pageNumber.addEventListener("click",function(){this.select();});pageNumber.addEventListener("change",function(){eventBus.dispatch("pagenumberchanged",{source:self,value:this.value});});scaleSelect.addEventListener("change",function(){if(this.value==="custom"){return;}eventBus.dispatch("scalechanged",{source:self,value:this.value});});scaleSelect.addEventListener("click",function(_ref3){let{target}=_ref3;if(this.value===self.pageScaleValue&&target.tagName.toUpperCase()==="OPTION"){this.blur();}});scaleSelect.oncontextmenu=noContextMenu;eventBus._on("annotationeditormodechanged",toolbar_assertClassBrand(_Toolbar_brand,this,_editorModeChanged).bind(this));}function _editorModeChanged(_ref4){let{mode}=_ref4;const{editorFreeTextButton,editorFreeTextParamsToolbar,editorHighlightButton,editorHighlightParamsToolbar,editorInkButton,editorInkParamsToolbar,editorStampButton,editorStampParamsToolbar}=toolbar_classPrivateFieldGet(toolbar_opts,this);toggleCheckedBtn(editorFreeTextButton,mode===AnnotationEditorType.FREETEXT,editorFreeTextParamsToolbar);toggleCheckedBtn(editorHighlightButton,mode===AnnotationEditorType.HIGHLIGHT,editorHighlightParamsToolbar);toggleCheckedBtn(editorInkButton,mode===AnnotationEditorType.INK,editorInkParamsToolbar);toggleCheckedBtn(editorStampButton,mode===AnnotationEditorType.STAMP,editorStampParamsToolbar);const isDisable=mode===AnnotationEditorType.DISABLE;editorFreeTextButton.disabled=isDisable;editorHighlightButton.disabled=isDisable;editorInkButton.disabled=isDisable;editorStampButton.disabled=isDisable;}function toolbar_updateUIState(){let resetNumPages=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;const{pageNumber,pagesCount,pageScaleValue,pageScale}=this;const opts=toolbar_classPrivateFieldGet(toolbar_opts,this);if(resetNumPages){if(this.hasPageLabels){opts.pageNumber.type="text";opts.numPages.setAttribute("data-l10n-id","pdfjs-page-of-pages");}else{opts.pageNumber.type="number";opts.numPages.setAttribute("data-l10n-id","pdfjs-of-pages");opts.numPages.setAttribute("data-l10n-args",JSON.stringify({pagesCount}));}opts.pageNumber.max=pagesCount;}if(this.hasPageLabels){opts.pageNumber.value=this.pageLabel;opts.numPages.setAttribute("data-l10n-args",JSON.stringify({pageNumber,pagesCount}));}else{opts.pageNumber.value=pageNumber;}opts.previous.disabled=pageNumber<=1;opts.next.disabled=pageNumber>=pagesCount;opts.zoomOut.disabled=pageScale<=MIN_SCALE;opts.zoomIn.disabled=pageScale>=MAX_SCALE;let predefinedValueFound=false;if(opts.scaleSelect.options){for(const option of opts.scaleSelect.options){if(option.value!==pageScaleValue){option.selected=false;continue;}option.selected=true;predefinedValueFound=true;}}if(!predefinedValueFound){opts.customScaleOption.selected=true;opts.customScaleOption.setAttribute("data-l10n-args",JSON.stringify({scale:Math.round(pageScale*10000)/100}));}this.eventBus.dispatch("updateuistate",{source:this,widget:"Toolbar",pageNumber,pagesCount,pageScaleValue,pageScale});}
;// CONCATENATED MODULE: ./web/view_history.js
const DEFAULT_VIEW_HISTORY_CACHE_SIZE=20;class ViewHistory{constructor(fingerprint){let cacheSize=arguments.length>1&&arguments[1]!==undefined?arguments[1]:DEFAULT_VIEW_HISTORY_CACHE_SIZE;this.fingerprint=fingerprint;this.cacheSize=cacheSize;this._initializedPromise=this._readFromStorage().then(databaseStr=>{const database=JSON.parse(databaseStr||"{}");let index=-1;if(!Array.isArray(database.files)){database.files=[];}else{while(database.files.length>=this.cacheSize){database.files.shift();}for(let i=0,ii=database.files.length;i<ii;i++){const branch=database.files[i];if(branch.fingerprint===this.fingerprint){index=i;break;}}}if(index===-1){index=database.files.push({fingerprint:this.fingerprint})-1;}this.file=database.files[index];this.database=database;});}async _writeToStorage(){if(AppOptions.get("disableHistory")){return;}const databaseStr=JSON.stringify(this.database);try{localStorage.setItem("pdfjs.history",databaseStr);}catch(safariSecurityException){}}async _readFromStorage(){if(AppOptions.get("disableHistory")){return undefined;}try{return localStorage.getItem("pdfjs.history");}catch(safariSecurityException){return undefined;}}async set(name,val){await this._initializedPromise;this.file[name]=val;return this._writeToStorage();}async setMultiple(properties){await this._initializedPromise;for(const name in properties){this.file[name]=properties[name];}return this._writeToStorage();}async get(name,defaultValue){await this._initializedPromise;const val=this.file[name];return val!==undefined?val:defaultValue;}async getMultiple(properties){await this._initializedPromise;const values=Object.create(null);for(const name in properties){const val=this.file[name];values[name]=val!==undefined?val:properties[name];}return values;}}
;// CONCATENATED MODULE: ./web/app.js
const FORCE_PAGES_LOADED_TIMEOUT=10;const WHEEL_ZOOM_DISABLED_TIMEOUT=1000;const ViewOnLoad={UNKNOWN:-1,PREVIOUS:0,INITIAL:1};const app_PDFViewerApplication={initialBookmark:document.location.hash.substring(1),_initializedCapability:{...Promise.withResolvers(),settled:false},appConfig:null,pdfDocument:null,pdfLoadingTask:null,printService:null,pdfViewer:null,pdfThumbnailViewer:null,pdfRenderingQueue:null,pdfPresentationMode:null,pdfDocumentProperties:null,pdfLinkService:null,pdfHistory:null,pdfSidebar:null,pdfOutlineViewer:null,pdfAttachmentViewer:null,pdfLayerViewer:null,pdfCursorTools:null,pdfScriptingManager:null,store:null,downloadManager:null,overlayManager:null,preferences:null,toolbar:null,secondaryToolbar:null,eventBus:null,l10n:null,annotationEditorParams:null,isInitialViewSet:false,downloadComplete:false,isViewerEmbedded:window.parent!==window,url:"",baseUrl:"",_downloadUrl:"",_eventBusAbortController:null,_windowAbortController:null,documentInfo:null,metadata:null,_contentDispositionFilename:null,_contentLength:null,_saveInProgress:false,_wheelUnusedTicks:0,_wheelUnusedFactor:1,_touchUnusedTicks:0,_touchUnusedFactor:1,_PDFBug:null,_hasAnnotationEditors:false,_title:document.title,_printAnnotationStoragePromise:null,_touchInfo:null,_isCtrlKeyDown:false,_nimbusDataPromise:null,_caretBrowsing:null,_isScrolling:false,async initialize(appConfig){let l10nPromise;this.appConfig=appConfig;try{await this.preferences.initializedPromise;}catch(ex){console.error(`initialize: "${ex.message}".`);}if(AppOptions.get("pdfBugEnabled")){await this._parseHashParams();}let mode;switch(AppOptions.get("viewerCssTheme")){case 1:mode="is-light";break;case 2:mode="is-dark";break;}if(mode){document.documentElement.classList.add(mode);}l10nPromise=this.externalServices.createL10n();this.l10n=await l10nPromise;document.getElementsByTagName("html")[0].dir=this.l10n.getDirection();this.l10n.translate(appConfig.appContainer||document.documentElement);if(this.isViewerEmbedded&&AppOptions.get("externalLinkTarget")===LinkTarget.NONE){AppOptions.set("externalLinkTarget",LinkTarget.TOP);}await this._initializeViewerComponents();this.bindEvents();this.bindWindowEvents();this._initializedCapability.settled=true;this._initializedCapability.resolve();this.initializeLoadingBar();},async _parseHashParams(){const hash=document.location.hash.substring(1);if(!hash){return;}const{mainContainer,viewerContainer}=this.appConfig,params=parseQueryString(hash);const loadPDFBug=async()=>{if(this._PDFBug){return;}const{PDFBug}=await import(/*webpackIgnore: true*/AppOptions.get("debuggerSrc"));this._PDFBug=PDFBug;};if(params.get("disableworker")==="true"){try{GlobalWorkerOptions.workerSrc||=AppOptions.get("workerSrc");await import(/*webpackIgnore: true*/PDFWorker.workerSrc);}catch(ex){console.error(`_parseHashParams: "${ex.message}".`);}}if(params.has("disablerange")){AppOptions.set("disableRange",params.get("disablerange")==="true");}if(params.has("disablestream")){AppOptions.set("disableStream",params.get("disablestream")==="true");}if(params.has("disableautofetch")){AppOptions.set("disableAutoFetch",params.get("disableautofetch")==="true");}if(params.has("disablefontface")){AppOptions.set("disableFontFace",params.get("disablefontface")==="true");}if(params.has("disablehistory")){AppOptions.set("disableHistory",params.get("disablehistory")==="true");}if(params.has("verbosity")){AppOptions.set("verbosity",params.get("verbosity")|0);}if(params.has("textlayer")){switch(params.get("textlayer")){case"off":AppOptions.set("textLayerMode",TextLayerMode.DISABLE);break;case"visible":case"shadow":case"hover":viewerContainer.classList.add(`textLayer-${params.get("textlayer")}`);try{await loadPDFBug();this._PDFBug.loadCSS();}catch(ex){console.error(`_parseHashParams: "${ex.message}".`);}break;}}if(params.has("pdfbug")){AppOptions.setAll({pdfBug:true,fontExtraProperties:true});const enabled=params.get("pdfbug").split(",");try{await loadPDFBug();this._PDFBug.init(mainContainer,enabled);}catch(ex){console.error(`_parseHashParams: "${ex.message}".`);}}if(params.has("locale")){AppOptions.set("locale",params.get("locale"));}},async _initializeViewerComponents(){const{appConfig,externalServices,l10n}=this;const eventBus=AppOptions.get("isInAutomation")?new AutomationEventBus():new EventBus();this.eventBus=eventBus;this.overlayManager=new OverlayManager();const pdfRenderingQueue=new PDFRenderingQueue();pdfRenderingQueue.onIdle=this._cleanup.bind(this);this.pdfRenderingQueue=pdfRenderingQueue;const pdfLinkService=new PDFLinkService({eventBus,externalLinkTarget:AppOptions.get("externalLinkTarget"),externalLinkRel:AppOptions.get("externalLinkRel"),ignoreDestinationZoom:AppOptions.get("ignoreDestinationZoom")});this.pdfLinkService=pdfLinkService;const downloadManager=this.downloadManager=new DownloadManager();const findController=new PDFFindController({linkService:pdfLinkService,eventBus,pageViewMode:AppOptions.get("pageViewMode"),updateMatchesCountOnProgress:true});this.findController=findController;const pdfScriptingManager=new PDFScriptingManager({eventBus,externalServices,docProperties:this._scriptingDocProperties.bind(this)});this.pdfScriptingManager=pdfScriptingManager;const container=appConfig.mainContainer,viewer=appConfig.viewerContainer;const annotationEditorMode=AppOptions.get("annotationEditorMode");const pageColors=AppOptions.get("forcePageColors")||window.matchMedia("(forced-colors: active)").matches?{background:AppOptions.get("pageColorsBackground"),foreground:AppOptions.get("pageColorsForeground")}:null;const altTextManager=appConfig.altTextDialog?new AltTextManager(appConfig.altTextDialog,container,this.overlayManager,eventBus):null;const pdfViewer=new PDFViewer({container,viewer,eventBus,renderingQueue:pdfRenderingQueue,linkService:pdfLinkService,downloadManager,altTextManager,findController,scriptingManager:AppOptions.get("enableScripting")&&pdfScriptingManager,l10n,textLayerMode:AppOptions.get("textLayerMode"),annotationMode:AppOptions.get("annotationMode"),annotationEditorMode,annotationEditorHighlightColors:AppOptions.get("highlightEditorColors"),enableHighlightFloatingButton:AppOptions.get("enableHighlightFloatingButton"),imageResourcesPath:AppOptions.get("imageResourcesPath"),removePageBorders:AppOptions.get("removePageBorders"),enablePrintAutoRotate:AppOptions.get("enablePrintAutoRotate"),maxCanvasPixels:AppOptions.get("maxCanvasPixels"),pageViewMode:AppOptions.get("pageViewMode"),enablePermissions:AppOptions.get("enablePermissions"),pageColors,mlManager:this.mlManager});this.pdfViewer=pdfViewer;pdfRenderingQueue.setViewer(pdfViewer);pdfLinkService.setViewer(pdfViewer);pdfScriptingManager.setViewer(pdfViewer);if(appConfig.sidebar?.thumbnailView){this.pdfThumbnailViewer=new PDFThumbnailViewer({container:appConfig.sidebar.thumbnailView,eventBus,renderingQueue:pdfRenderingQueue,linkService:pdfLinkService,pageColors});pdfRenderingQueue.setThumbnailViewer(this.pdfThumbnailViewer);}if(!this.isViewerEmbedded&&!AppOptions.get("disableHistory")){this.pdfHistory=new PDFHistory({linkService:pdfLinkService,eventBus});pdfLinkService.setHistory(this.pdfHistory);}if(!this.supportsIntegratedFind&&appConfig.findBar){this.findBar=new PDFFindBar(appConfig.findBar,eventBus);}if(appConfig.annotationEditorParams){if(annotationEditorMode!==AnnotationEditorType.DISABLE){if(AppOptions.get("enableStampEditor")){appConfig.toolbar?.editorStampButton?.classList.remove("hidden");}const editorHighlightButton=appConfig.toolbar?.editorHighlightButton;if(editorHighlightButton&&AppOptions.get("enableHighlightEditor")){editorHighlightButton.hidden=false;}this.annotationEditorParams=new AnnotationEditorParams(appConfig.annotationEditorParams,eventBus);}else{for(const id of["editorModeButtons","editorModeSeparator"]){document.getElementById(id)?.classList.add("hidden");}}}if(appConfig.documentProperties){this.pdfDocumentProperties=new PDFDocumentProperties(appConfig.documentProperties,this.overlayManager,eventBus,l10n,()=>this._docFilename);}if(appConfig.secondaryToolbar?.cursorHandToolButton){this.pdfCursorTools=new PDFCursorTools({container,eventBus,cursorToolOnLoad:AppOptions.get("cursorToolOnLoad")});}if(appConfig.toolbar){this.toolbar=new Toolbar(appConfig.toolbar,eventBus);}if(appConfig.secondaryToolbar){this.secondaryToolbar=new SecondaryToolbar(appConfig.secondaryToolbar,eventBus);}if(this.supportsFullscreen&&(appConfig.toolbar?.presentationModeButton||appConfig.secondaryToolbar?.presentationModeButton)){this.pdfPresentationMode=new PDFPresentationMode({container,pdfViewer,eventBus});}const prompt=AppOptions.get("passwordPrompt");if(!prompt){if(appConfig.passwordOverlay){this.passwordPrompt=new PasswordPrompt(appConfig.passwordOverlay,this.overlayManager,this.isViewerEmbedded);}}else{this.passwordPrompt=prompt;}if(appConfig.sidebar?.outlineView){this.pdfOutlineViewer=new PDFOutlineViewer({container:appConfig.sidebar.outlineView,eventBus,l10n,linkService:pdfLinkService,downloadManager});}if(appConfig.sidebar?.attachmentsView){this.pdfAttachmentViewer=new PDFAttachmentViewer({container:appConfig.sidebar.attachmentsView,eventBus,l10n,downloadManager});}if(appConfig.sidebar?.layersView){this.pdfLayerViewer=new PDFLayerViewer({container:appConfig.sidebar.layersView,eventBus,l10n});}if(appConfig.sidebar){this.pdfSidebar=new PDFSidebar({elements:appConfig.sidebar,eventBus,l10n});this.pdfSidebar.onToggled=this.forceRendering.bind(this);this.pdfSidebar.onUpdateThumbnails=()=>{for(const pageView of pdfViewer.getCachedPageViews()){if(pageView.renderingState===RenderingStates.FINISHED){this.pdfThumbnailViewer.getThumbnail(pageView.id-1)?.setImage(pageView);}}this.pdfThumbnailViewer.scrollThumbnailIntoView(pdfViewer.currentPageNumber);};}},async run(config){this.preferences=new Preferences();await this.initialize(config);const{appConfig,eventBus}=this;let file;const queryString=document.location.search.substring(1);const params=parseQueryString(queryString);file=params.get("file")??AppOptions.get("defaultUrl");validateFileURL(file);const fileInput=this._openFileInput=document.createElement("input");fileInput.id="fileInput";fileInput.className="ngx-extended-pdf-viewer-file-input";fileInput.hidden=true;fileInput.type="file";fileInput.value=null;fileInput.accept=".pdf,application/pdf";document.body.append(fileInput);fileInput.addEventListener("change",function(evt){const{files}=evt.target;if(!files||files.length===0){return;}eventBus.dispatch("fileinputchange",{source:this,fileInput:evt.target});});appConfig.mainContainer.addEventListener("dragover",function(evt){if(AppOptions.get("enableDragAndDrop")){evt.preventDefault();evt.dataTransfer.dropEffect=evt.dataTransfer.effectAllowed==="copy"?"copy":"move";}});appConfig.mainContainer.addEventListener("drop",function(evt){evt.preventDefault();const{files}=evt.dataTransfer;if(!files||files.length===0){return;}eventBus.dispatch("fileinputchange",{source:this,fileInput:evt.dataTransfer,dropEvent:evt});});if(!AppOptions.get("supportsDocumentFonts")){AppOptions.set("disableFontFace",true);this.l10n.get("pdfjs-web-fonts-disabled").then(msg=>{console.warn(msg);});}if(!this.supportsPrinting){appConfig.toolbar?.print?.classList.add("hidden");appConfig.secondaryToolbar?.printButton.classList.add("hidden");}if(!this.supportsFullscreen){appConfig.toolbar.presentationModeButton.classList.add("hidden");appConfig.secondaryToolbar?.presentationModeButton.classList.add("hidden");}if(this.supportsIntegratedFind){appConfig.toolbar?.viewFind?.classList.add("hidden");}if(file){this.open({url:file});}else{this._hideViewBookmark();}const event=new CustomEvent("webviewerinitialized",{bubbles:true,cancelable:true,detail:{source:window}});try{document.dispatchEvent(event);}catch(ex){console.error(`webviewerinitialized: ${ex}`);parent.document.dispatchEvent(event);}},get externalServices(){return shadow(this,"externalServices",new ExternalServices());},get mlManager(){return shadow(this,"mlManager",AppOptions.get("enableML")===true?new MLManager():null);},get initialized(){return this._initializedCapability.settled;},get initializedPromise(){return this._initializedCapability.promise;},updateZoom(steps,scaleFactor,origin){if(this.pdfViewer.isInPresentationMode){return;}this.pdfViewer.updateScale({drawingDelay:AppOptions.get("defaultZoomDelay"),steps,scaleFactor,origin});},zoomIn(){this.updateZoom(1);},zoomOut(){this.updateZoom(-1);},zoomReset(){if(this.pdfViewer.isInPresentationMode){return;}this.pdfViewer.currentScaleValue=DEFAULT_SCALE_VALUE;},get pagesCount(){return this.pdfDocument?this.pdfDocument.numPages:0;},get page(){return this.pdfViewer.currentPageNumber;},set page(val){this.pdfViewer.currentPageNumber=val;},get supportsPrinting(){return PDFPrintServiceFactory.supportsPrinting;},get supportsFullscreen(){return shadow(this,"supportsFullscreen",document.fullscreenEnabled);},get supportsPinchToZoom(){return shadow(this,"supportsPinchToZoom",AppOptions.get("supportsPinchToZoom"));},get supportsIntegratedFind(){return shadow(this,"supportsIntegratedFind",AppOptions.get("supportsIntegratedFind"));},initializeLoadingBar(){const barElement=document.getElementById("loadingBar");const bar=barElement?new ProgressBar(barElement):null;bar?.hide();return shadow(this,"loadingBar",bar);},get supportsMouseWheelZoomCtrlKey(){return shadow(this,"supportsMouseWheelZoomCtrlKey",AppOptions.get("supportsMouseWheelZoomCtrlKey"));},get supportsMouseWheelZoomMetaKey(){return shadow(this,"supportsMouseWheelZoomMetaKey",AppOptions.get("supportsMouseWheelZoomMetaKey"));},get supportsCaretBrowsingMode(){return AppOptions.get("supportsCaretBrowsingMode");},moveCaret(isUp,select){this._caretBrowsing||=new CaretBrowsingMode(this.appConfig.mainContainer,this.appConfig.viewerContainer,this.appConfig.toolbar?.container);this._caretBrowsing.moveCaret(isUp,select);},setTitleUsingUrl(){let url=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";let downloadUrl=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;},setTitle(){let title=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this._title;this._title=title;if(this.isViewerEmbedded){return;}const editorIndicator=this._hasAnnotationEditors&&!this.pdfRenderingQueue.printing;document.title=`${editorIndicator?"* ":""}${title}`;},get _docFilename(){return this._contentDispositionFilename||pdfjs_getPdfFilenameFromUrl(this.url);},_hideViewBookmark(){if(!this.appConfig){return;}const{secondaryToolbar}=this.appConfig;secondaryToolbar?.viewBookmarkButton.classList.add("hidden");if(secondaryToolbar?.presentationModeButton.classList.contains("hidden")){document.getElementById("viewBookmarkSeparator")?.classList.add("hidden");}},async close(){this._unblockDocumentLoadEvent();this._hideViewBookmark();if(!this.pdfLoadingTask){return;}if(this.pdfDocument?.annotationStorage.size>0&&this._annotationStorageModified){try{await this.save();}catch{}}const promises=[];promises.push(this.pdfLoadingTask.destroy());this.pdfLoadingTask=null;if(this.pdfDocument){this.pdfDocument=null;this.pdfThumbnailViewer?.setDocument(null);this.pdfViewer.setDocument(null);this.pdfLinkService.setDocument(null);this.pdfDocumentProperties?.setDocument(null);}this.pdfLinkService.externalLinkEnabled=true;this.store=null;this.isInitialViewSet=false;this.downloadComplete=false;this.url="";this.baseUrl="";this._downloadUrl="";this.documentInfo=null;this.metadata=null;this._contentDispositionFilename=null;this._contentLength=null;this._saveInProgress=false;this._hasAnnotationEditors=false;promises.push(this.pdfScriptingManager.destroyPromise,this.passwordPrompt.close());this.setTitle();this.pdfSidebar?.reset();this.pdfOutlineViewer?.reset();this.pdfAttachmentViewer?.reset();this.pdfLayerViewer?.reset();this.pdfHistory?.reset();this.findBar?.reset();this.toolbar?.reset();this.secondaryToolbar?.reset();this._PDFBug?.cleanup();await Promise.all(promises);},async open(args){window.adjacentPagesLoader=undefined;this.pdfViewer?.destroyBookMode();window.ngxZone.runOutsideAngular(async()=>{if(this.pdfLoadingTask){await this.close();}const workerParams=AppOptions.getAll(OptionKind.WORKER);if(workerParams.workerSrc.constructor.name==="Function"){workerParams.workerSrc=workerParams.workerSrc();}Object.assign(GlobalWorkerOptions,workerParams);if(args.url){this.setTitleUsingUrl(args.originalUrl||args.url,args.url);}const apiParams=AppOptions.getAll(OptionKind.API);const loadingTask=getDocument({...apiParams,...args});this.pdfLoadingTask=loadingTask;loadingTask.onPassword=(updateCallback,reason)=>{if(this.isViewerEmbedded){this._unblockDocumentLoadEvent();}this.pdfLinkService.externalLinkEnabled=false;this.passwordPrompt.setUpdateCallback(updateCallback,reason);this.passwordPrompt.open();};loadingTask.onProgress=_ref=>{let{loaded,total}=_ref;this.progress(loaded/total);this.eventBus?.dispatch("progress",{source:this,type:"load",total,loaded,percent:100*loaded/total});};return loadingTask.promise.then(pdfDocument=>{if(globalThis.ServiceWorkerOptions){pdfDocument._transport.messageHandler.send('showUnverifiedSignatures',globalThis.ServiceWorkerOptions.showUnverifiedSignatures);}this.load(pdfDocument);},reason=>{if(loadingTask!==this.pdfLoadingTask){return undefined;}let key="pdfjs-loading-error";if(reason instanceof InvalidPDFException){key="pdfjs-invalid-file-error";}else if(reason instanceof MissingPDFException){key="pdfjs-missing-file-error";}else if(reason instanceof UnexpectedResponseException){key="pdfjs-unexpected-response-error";}if(app_PDFViewerApplication.onError){app_PDFViewerApplication.onError(reason);}return this._documentError(key,{message:reason.message}).then(()=>{throw reason;});});});},_ensureDownloadComplete(){if(this.pdfDocument&&this.downloadComplete){return;}throw new Error("PDF document not downloaded.");},async download(){let options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};const url=this._downloadUrl,filename=this._docFilename;try{this._ensureDownloadComplete();const data=await this.pdfDocument.getData();const blob=new Blob([data],{type:"application/pdf"});await this.downloadManager.download(blob,url,filename,options);}catch{await this.downloadManager.downloadUrl(url,filename,options);}},async save(){let options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(this._saveInProgress){return;}this._saveInProgress=true;await this.pdfScriptingManager.dispatchWillSave();const url=this._downloadUrl,filename=this._docFilename;try{this._ensureDownloadComplete();const data=await this.pdfDocument.saveDocument();const blob=new Blob([data],{type:"application/pdf"});await this.downloadManager.download(blob,url,filename,options);}catch(reason){globalThis.ngxConsole.error(`Error when saving the document: ${reason.message}`);await this.download(options);}finally{await this.pdfScriptingManager.dispatchDidSave();this._saveInProgress=false;}if(this._hasAnnotationEditors){this.externalServices.reportTelemetry({type:"editing",data:{type:"save",stats:this.pdfDocument?.annotationStorage.editorStats}});}},downloadOrSave(){let options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(this.pdfDocument?.annotationStorage.size>0){this.save(options);}else{this.download(options);}},async _exportWithAnnotations(){if(this._saveInProgress){throw new Error(`Already downloading`);}this._saveInProgress=true;await this.pdfScriptingManager.dispatchWillSave();try{this._ensureDownloadComplete();const data=await this.pdfDocument.saveDocument();const blob=new Blob([data],{type:"application/pdf"});return blob;}catch(reason){throw new Error(`Error when saving the document: ${reason.message}`);}finally{await this.pdfScriptingManager.dispatchDidSave();this._saveInProgress=false;}},async _exportWithoutAnnotations(){try{this._ensureDownloadComplete();const data=await this.pdfDocument.getData();const blob=new Blob([data],{type:"application/pdf"});return blob;}catch(reason){throw new Error(`Error when saving the document: ${reason.message}`);}},async export(){if(this.pdfDocument?.annotationStorage.size>0){return this._exportWithAnnotations();}return this._exportWithoutAnnotations();},openInExternalApp(){this.downloadOrSave({openInExternalApp:true});},async _documentError(key){let moreInfo=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;this._unblockDocumentLoadEvent();const message=await this._otherError(key||"pdfjs-loading-error",moreInfo);this.eventBus.dispatch("documenterror",{source:this,message,reason:moreInfo?.message??null});},async _otherError(key){let moreInfo=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;const message=await this.l10n.get(key);const moreInfoText=[`PDF.js v${version||"?"} (build: ${build||"?"})`];if(moreInfo){moreInfoText.push(`Message: ${moreInfo.message}`);if(moreInfo.stack){moreInfoText.push(`Stack: ${moreInfo.stack}`);}else{if(moreInfo.filename){moreInfoText.push(`File: ${moreInfo.filename}`);}if(moreInfo.lineNumber){moreInfoText.push(`Line: ${moreInfo.lineNumber}`);}}}console.error(`${message}\n\n${moreInfoText.join("\n")}`);return message;},progress(level){if(!this.loadingBar||this.downloadComplete){return;}const percent=Math.round(level*100);if(percent<=this.loadingBar.percent){return;}this.loadingBar.percent=percent;if(this.pdfDocument?.loadingParams.disableAutoFetch??AppOptions.get("disableAutoFetch")){this.loadingBar.setDisableAutoFetch();}},load(pdfDocument){this.pdfDocument=pdfDocument;pdfDocument.getDownloadInfo().then(_ref2=>{let{length}=_ref2;this._contentLength=length;this.downloadComplete=true;this.loadingBar?.hide();firstPagePromise.then(()=>{this.eventBus?.dispatch("documentloaded",{source:this});});});const pageLayoutPromise=pdfDocument.getPageLayout().catch(()=>{});const pageModePromise=pdfDocument.getPageMode().catch(()=>{});const openActionPromise=pdfDocument.getOpenAction().catch(()=>{});this.toolbar?.setPagesCount(pdfDocument.numPages,false);this.secondaryToolbar?.setPagesCount(pdfDocument.numPages);this.pdfLinkService.setDocument(pdfDocument);this.pdfDocumentProperties?.setDocument(pdfDocument);const pdfViewer=this.pdfViewer;pdfViewer.setDocument(pdfDocument);const{firstPagePromise,onePageRendered,pagesPromise}=pdfViewer;this.pdfThumbnailViewer?.setDocument(pdfDocument);const storedPromise=(this.store=new ViewHistory(pdfDocument.fingerprints[0])).getMultiple({page:null,zoom:DEFAULT_SCALE_VALUE,scrollLeft:"0",scrollTop:"0",rotation:null,sidebarView:SidebarView.UNKNOWN,scrollMode:ScrollMode.UNKNOWN,spreadMode:SpreadMode.UNKNOWN}).catch(()=>{});firstPagePromise.then(pdfPage=>{this.loadingBar?.setWidth(this.appConfig.viewerContainer);this._initializeAnnotationStorageCallbacks(pdfDocument);Promise.all([animationStarted,storedPromise,pageLayoutPromise,pageModePromise,openActionPromise]).then(async _ref3=>{let[timeStamp,stored,pageLayout,pageMode,openAction]=_ref3;const viewOnLoad=AppOptions.get("viewOnLoad");this._initializePdfHistory({fingerprint:pdfDocument.fingerprints[0],viewOnLoad,initialDest:openAction?.dest});const initialBookmark=this.initialBookmark;const zoom=AppOptions.get("defaultZoomValue");let hash=zoom?`zoom=${zoom}`:null;let rotation=null;let sidebarView=AppOptions.get("sidebarViewOnLoad");let scrollMode=AppOptions.get("scrollModeOnLoad");let spreadMode=AppOptions.get("spreadModeOnLoad");if(stored?.page&&viewOnLoad!==ViewOnLoad.INITIAL){hash=`page=${stored.page}&zoom=${zoom||stored.zoom},`+`${stored.scrollLeft},${stored.scrollTop}`;rotation=parseInt(stored.rotation,10);if(sidebarView===SidebarView.UNKNOWN){sidebarView=stored.sidebarView|0;}if(scrollMode===ScrollMode.UNKNOWN){scrollMode=stored.scrollMode|0;}if(spreadMode===SpreadMode.UNKNOWN){spreadMode=stored.spreadMode|0;}}if(pageMode&&sidebarView===SidebarView.UNKNOWN){sidebarView=apiPageModeToSidebarView(pageMode);}if(pageLayout&&scrollMode===ScrollMode.UNKNOWN&&spreadMode===SpreadMode.UNKNOWN){const modes=apiPageLayoutToViewerModes(pageLayout);spreadMode=modes.spreadMode;}this.setInitialView(hash,{rotation,sidebarView,scrollMode,spreadMode});this.eventBus.dispatch("documentinit",{source:this});if(!this.isViewerEmbedded){pdfViewer.focus();}await Promise.race([pagesPromise,new Promise(resolve=>{setTimeout(resolve,FORCE_PAGES_LOADED_TIMEOUT);})]);if(!initialBookmark&&!hash){return;}if(pdfViewer.hasEqualPageSizes){return;}this.initialBookmark=initialBookmark;pdfViewer.currentScaleValue=pdfViewer.currentScaleValue;this.setInitialView(hash);}).catch(()=>{this.setInitialView();}).then(function(){pdfViewer.update();});});pagesPromise.then(()=>{this._unblockDocumentLoadEvent();this._initializeAutoPrint(pdfDocument,openActionPromise);},reason=>{if(app_PDFViewerApplication.onError){app_PDFViewerApplication.onError(reason);}this._documentError("pdfjs-loading-error",{message:reason.message});});onePageRendered.then(data=>{this.externalServices.reportTelemetry({type:"pageInfo",timestamp:data.timestamp});if(this.pdfOutlineViewer){pdfDocument.getOutline().then(outline=>{if(pdfDocument!==this.pdfDocument){return;}this.pdfOutlineViewer.render({outline,pdfDocument});});}if(this.pdfAttachmentViewer){pdfDocument.getAttachments().then(attachments=>{if(pdfDocument!==this.pdfDocument){return;}this.pdfAttachmentViewer.render({attachments});});}if(this.pdfLayerViewer){pdfViewer.optionalContentConfigPromise.then(optionalContentConfig=>{if(pdfDocument!==this.pdfDocument){return;}this.pdfLayerViewer.render({optionalContentConfig,pdfDocument});});}});this._initializePageLabels(pdfDocument);this._initializeMetadata(pdfDocument);},async _scriptingDocProperties(pdfDocument){if(!this.documentInfo){await new Promise(resolve=>{this.eventBus._on("metadataloaded",resolve,{once:true});});if(pdfDocument!==this.pdfDocument){return null;}}if(!this._contentLength){await new Promise(resolve=>{this.eventBus._on("documentloaded",resolve,{once:true});});if(pdfDocument!==this.pdfDocument){return null;}}return{...this.documentInfo,baseURL:this.baseUrl,filesize:this._contentLength,filename:this._docFilename,metadata:this.metadata?.getRaw(),authors:this.metadata?.get("dc:creator"),numPages:this.pagesCount,URL:this.url};},async _initializeAutoPrint(pdfDocument,openActionPromise){const[openAction,jsActions]=await Promise.all([openActionPromise,this.pdfViewer.enableScripting?null:pdfDocument.getJSActions()]);if(pdfDocument!==this.pdfDocument){return;}let triggerAutoPrint=openAction?.action==="Print";if(jsActions){globalThis.ngxConsole.warn("Warning: JavaScript support is not enabled");for(const name in jsActions){if(triggerAutoPrint){break;}switch(name){case"WillClose":case"WillSave":case"DidSave":case"WillPrint":case"DidPrint":continue;}triggerAutoPrint=jsActions[name].some(js=>AutoPrintRegExp.test(js));}}if(triggerAutoPrint){this.triggerPrinting();}},async _initializeMetadata(pdfDocument){const{info,metadata,contentDispositionFilename,contentLength}=await pdfDocument.getMetadata();if(pdfDocument!==this.pdfDocument){return;}this.documentInfo=info;this.metadata=metadata;this._contentDispositionFilename??=contentDispositionFilename;this._contentLength??=contentLength;const options=window.PDFViewerApplicationOptions;if(!options||options.get("verbosity")>0){globalThis.ngxConsole.log(`PDF ${pdfDocument.fingerprints[0]} [${info.PDFFormatVersion} `+`${(info.Producer||"-").trim()} / ${(info.Creator||"-").trim()}] `+`(PDF.js: ${version||"?"} [${build||"?"}])  modified by ngx-extended-pdf-viewer ${ngxExtendedPdfViewerVersion}`);}let pdfTitle=info.Title;const metadataTitle=metadata?.get("dc:title");if(metadataTitle){if(metadataTitle!=="Untitled"&&!/[\uFFF0-\uFFFF]/g.test(metadataTitle)){pdfTitle=metadataTitle;}}if(pdfTitle){this.setTitle(`${pdfTitle} - ${this._contentDispositionFilename||this._title}`);}else if(this._contentDispositionFilename){this.setTitle(this._contentDispositionFilename);}if(info.IsXFAPresent&&!info.IsAcroFormPresent&&!pdfDocument.isPureXfa){if(pdfDocument.loadingParams.enableXfa){globalThis.ngxConsole.warn("Warning: XFA Foreground documents are not supported");}else{globalThis.ngxConsole.warn("Warning: XFA support is not enabled");}}else if((info.IsAcroFormPresent||info.IsXFAPresent)&&!this.pdfViewer.renderForms){console.warn("Warning: Interactive form support is not enabled");}if(info.IsSignaturesPresent){console.warn("Warning: Digital signatures validation is not supported");}this.eventBus.dispatch("metadataloaded",{source:this});},async _initializePageLabels(pdfDocument){const labels=await pdfDocument.getPageLabels();if(pdfDocument!==this.pdfDocument){return;}if(!labels||AppOptions.get("disablePageLabels")){return;}const numLabels=labels.length;let standardLabels=0,emptyLabels=0;for(let i=0;i<numLabels;i++){const label=labels[i];if(label===(i+1).toString()){standardLabels++;}else if(label===""){emptyLabels++;}else{break;}}if(standardLabels>=numLabels||emptyLabels>=numLabels){return;}const{pdfViewer,pdfThumbnailViewer,toolbar}=this;pdfViewer.setPageLabels(labels);pdfThumbnailViewer?.setPageLabels(labels);toolbar?.setPagesCount(numLabels,true);toolbar?.setPageNumber(pdfViewer.currentPageNumber,pdfViewer.currentPageLabel);},_initializePdfHistory(_ref4){let{fingerprint,viewOnLoad,initialDest=null}=_ref4;if(!this.pdfHistory){return;}this.pdfHistory.initialize({fingerprint,resetHistory:viewOnLoad===ViewOnLoad.INITIAL,updateUrl:AppOptions.get("historyUpdateUrl")});if(this.pdfHistory.initialBookmark){this.initialBookmark=this.pdfHistory.initialBookmark;this.initialRotation=this.pdfHistory.initialRotation;}if(initialDest&&!this.initialBookmark&&viewOnLoad===ViewOnLoad.UNKNOWN){this.initialBookmark=JSON.stringify(initialDest);this.pdfHistory.push({explicitDest:initialDest,pageNumber:null});}},_initializeAnnotationStorageCallbacks(pdfDocument){if(pdfDocument!==this.pdfDocument){return;}const{annotationStorage}=pdfDocument;annotationStorage.onSetModified=()=>{window.addEventListener("beforeunload",beforeUnload);this._annotationStorageModified=true;};annotationStorage.onResetModified=()=>{window.removeEventListener("beforeunload",beforeUnload);delete this._annotationStorageModified;};annotationStorage.onAnnotationEditor=typeStr=>{this._hasAnnotationEditors=!!typeStr;this.setTitle();};},setInitialView(storedHash){let{rotation,sidebarView,scrollMode,spreadMode}=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};const setRotation=angle=>{if(isValidRotation(angle)){this.pdfViewer.pagesRotation=angle;}};const setViewerModes=(scroll,spread)=>{if(isValidScrollMode(scroll)){this.pdfViewer.scrollMode=scroll;}if(isValidSpreadMode(spread)){this.pdfViewer.spreadMode=spread;}};this.isInitialViewSet=true;this.pdfSidebar?.setInitialView(sidebarView);setViewerModes(scrollMode,spreadMode);if(this.initialBookmark){setRotation(this.initialRotation);delete this.initialRotation;if(this.pdfLinkService.setHash){this.pdfLinkService.setHash(this.initialBookmark);}this.initialBookmark=null;}else if(storedHash){setRotation(rotation);if(this.pdfLinkService.setHash){this.pdfLinkService.setHash(storedHash);}}this.toolbar?.setPageNumber(this.pdfViewer.currentPageNumber,this.pdfViewer.currentPageLabel);this.secondaryToolbar?.setPageNumber(this.pdfViewer.currentPageNumber);if(!this.pdfViewer.currentScaleValue){const defaultZoomOption=PDFViewerApplicationOptions.get('defaultZoomValue');if(defaultZoomOption){this.pdfViewer.currentScaleValue=defaultZoomOption;}}},_cleanup(){if(!this.pdfDocument){return;}this.pdfViewer.cleanup();this.pdfThumbnailViewer?.cleanup();this.pdfDocument.cleanup(AppOptions.get("fontExtraProperties"));},forceRendering(){this.pdfRenderingQueue.printing=!!this.printService;this.pdfRenderingQueue.isThumbnailViewEnabled=this.pdfSidebar?.visibleView===SidebarView.THUMBS;this.pdfRenderingQueue.renderHighestPriority();},beforePrint(){this._printAnnotationStoragePromise=this.pdfScriptingManager.dispatchWillPrint().catch(()=>{}).then(()=>this.pdfDocument?.annotationStorage.print);if(this.printService){return;}if(!this.supportsPrinting){this._otherError("pdfjs-printing-not-supported");return;}if(!this.pdfViewer.pageViewsReady){this.l10n.get("pdfjs-printing-not-ready").then(msg=>{window.alert(msg);});return;}this.printService=PDFPrintServiceFactory.createPrintService({pdfDocument:this.pdfDocument,pagesOverview:this.pdfViewer.getPagesOverview(),printContainer:this.appConfig.printContainer,printResolution:AppOptions.get("printResolution"),printAnnotationStoragePromise:this._printAnnotationStoragePromise,eventBus:this.pdfViewer.eventBus});this.forceRendering();this.setTitle();this.printService.layout();if(this._hasAnnotationEditors){this.externalServices.reportTelemetry({type:"editing",data:{type:"print",stats:this.pdfDocument?.annotationStorage.editorStats}});}},afterPrint(){if(this._printAnnotationStoragePromise){this._printAnnotationStoragePromise.then(()=>{this.pdfScriptingManager.dispatchDidPrint();});this._printAnnotationStoragePromise=null;}if(this.printService){this.printService.destroy();this.printService=null;this.pdfDocument?.annotationStorage.resetModified();}this.forceRendering();this.setTitle();},rotatePages(delta){this.pdfViewer.pagesRotation+=delta;},requestPresentationMode(){this.pdfPresentationMode?.request();},triggerPrinting(){if(!this.supportsPrinting){return;}window.printPDF();},bindEvents(){if(this._eventBusAbortController){return;}this._eventBusAbortController=new AbortController();const{eventBus,_eventBusAbortController:{signal}}=this;eventBus._on("resize",webViewerResize,{signal});eventBus._on("hashchange",webViewerHashchange,{signal});eventBus._on("beforeprint",this.beforePrint.bind(this),{signal});eventBus._on("afterprint",this.afterPrint.bind(this),{signal});eventBus._on("pagerender",webViewerPageRender,{signal});eventBus._on("pagerendered",webViewerPageRendered,{signal});eventBus._on("updateviewarea",webViewerUpdateViewarea,{signal});eventBus._on("pagechanging",webViewerPageChanging,{signal});eventBus._on("scalechanging",webViewerScaleChanging,{signal});eventBus._on("rotationchanging",webViewerRotationChanging,{signal});eventBus._on("sidebarviewchanged",webViewerSidebarViewChanged,{signal});eventBus._on("pagemode",webViewerPageMode,{signal});eventBus._on("namedaction",webViewerNamedAction,{signal});eventBus._on("presentationmodechanged",webViewerPresentationModeChanged,{signal});eventBus._on("presentationmode",webViewerPresentationMode,{signal});eventBus._on("switchannotationeditormode",webViewerSwitchAnnotationEditorMode,{signal});eventBus._on("switchannotationeditorparams",webViewerSwitchAnnotationEditorParams,{signal});eventBus._on("print",webViewerPrint,{signal});eventBus._on("download",webViewerDownload,{signal});eventBus._on("firstpage",webViewerFirstPage,{signal});eventBus._on("lastpage",webViewerLastPage,{signal});eventBus._on("nextpage",webViewerNextPage,{signal});eventBus._on("previouspage",webViewerPreviousPage,{signal});eventBus._on("zoomin",webViewerZoomIn,{signal});eventBus._on("zoomout",webViewerZoomOut,{signal});eventBus._on("zoomreset",webViewerZoomReset,{signal});eventBus._on("pagenumberchanged",webViewerPageNumberChanged,{signal});eventBus._on("scalechanged",webViewerScaleChanged,{signal});eventBus._on("rotatecw",webViewerRotateCw,{signal});eventBus._on("rotateccw",webViewerRotateCcw,{signal});eventBus._on("optionalcontentconfig",webViewerOptionalContentConfig,{signal});eventBus._on("switchscrollmode",webViewerSwitchScrollMode,{signal});eventBus._on("scrollmodechanged",webViewerScrollModeChanged,{signal});eventBus._on("switchspreadmode",webViewerSwitchSpreadMode,{signal});eventBus._on("spreadmodechanged",webViewerSpreadModeChanged,{signal});eventBus._on("documentproperties",webViewerDocumentProperties,{signal});eventBus._on("findfromurlhash",webViewerFindFromUrlHash,{signal});eventBus._on("updatefindmatchescount",webViewerUpdateFindMatchesCount,{signal});eventBus._on("updatefindcontrolstate",webViewerUpdateFindControlState,{signal});eventBus._on("fileinputchange",webViewerFileInputChange,{signal});eventBus._on("openfile",webViewerOpenFile,{signal});},bindWindowEvents(){if(this._windowAbortController){return;}this._windowAbortController=new AbortController();const{eventBus,appConfig:{mainContainer},_windowAbortController:{signal}}=this;function addWindowResolutionChange(){let evt=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;if(evt){webViewerResolutionChange(evt);}const mediaQueryList=window.matchMedia(`(resolution: ${window.devicePixelRatio||1}dppx)`);mediaQueryList.addEventListener("change",addWindowResolutionChange,{once:true,signal});}addWindowResolutionChange();window.addEventListener("visibilitychange",webViewerVisibilityChange,{signal});const viewerContainer=document.getElementById("viewerContainer");viewerContainer?.addEventListener("wheel",webViewerWheel,{passive:false,signal});mainContainer?.addEventListener("touchstart",webViewerTouchStart,{passive:false,signal});mainContainer?.addEventListener("touchmove",webViewerTouchMove,{passive:false,signal});mainContainer?.addEventListener("touchend",webViewerTouchEnd,{passive:false,signal});window.addEventListener("click",webViewerClick,{signal});window.addEventListener("keydown",webViewerKeyDown,{signal});window.addEventListener("keyup",webViewerKeyUp,{signal});window.addEventListener("resize",()=>{eventBus.dispatch("resize",{source:window});},{signal});window.addEventListener("hashchange",()=>{eventBus.dispatch("hashchange",{source:window,hash:document.location.hash.substring(1)});},{signal});window.addEventListener("beforeprint",()=>{eventBus.dispatch("beforeprint",{source:window});},{signal});window.addEventListener("afterprint",()=>{eventBus.dispatch("afterprint",{source:window});},{signal});window.addEventListener("updatefromsandbox",event=>{eventBus.dispatch("updatefromsandbox",{source:window,detail:event.detail});},{signal});if(!("onscrollend"in document.documentElement)){return;}({scrollTop:this._lastScrollTop,scrollLeft:this._lastScrollLeft}=mainContainer);const scrollend=()=>{({scrollTop:this._lastScrollTop,scrollLeft:this._lastScrollLeft}=mainContainer);this._isScrolling=false;mainContainer.addEventListener("scroll",scroll,{passive:true,signal});mainContainer.removeEventListener("scrollend",scrollend);mainContainer.removeEventListener("blur",scrollend);};const scroll=()=>{if(this._isCtrlKeyDown){return;}if(this._lastScrollTop===mainContainer.scrollTop&&this._lastScrollLeft===mainContainer.scrollLeft){return;}mainContainer.removeEventListener("scroll",scroll,{passive:true});this._isScrolling=true;mainContainer.addEventListener("scrollend",scrollend,{signal});mainContainer.addEventListener("blur",scrollend,{signal});};mainContainer.addEventListener("scroll",scroll,{passive:true,signal});},unbindEvents(){this._eventBusAbortController?.abort();this._eventBusAbortController=null;},unbindWindowEvents(){this._windowAbortController?.abort();this._windowAbortController=null;},_accumulateTicks(ticks,prop){if(this[prop]>0&&ticks<0||this[prop]<0&&ticks>0){this[prop]=0;}this[prop]+=ticks;const wholeTicks=Math.trunc(this[prop]);this[prop]-=wholeTicks;return wholeTicks;},_accumulateFactor(previousScale,factor,prop){if(factor===1){return 1;}if(this[prop]>1&&factor<1||this[prop]<1&&factor>1){this[prop]=1;}const newFactor=Math.floor(previousScale*factor*this[prop]*100)/(100*previousScale);this[prop]=factor/newFactor;return newFactor;},_unblockDocumentLoadEvent(){document.blockUnblockOnload?.(false);this._unblockDocumentLoadEvent=()=>{};},get scriptingReady(){return this.pdfScriptingManager.ready;}};initCom(app_PDFViewerApplication);{PDFPrintServiceFactory.initGlobals(app_PDFViewerApplication);}{const HOSTED_VIEWER_ORIGINS=["null","http://mozilla.github.io","https://mozilla.github.io"];var validateFileURL=function(file){if(!file){return;}try{const viewerOrigin=new URL(window.location.href).origin||"null";if(HOSTED_VIEWER_ORIGINS.includes(viewerOrigin)){return;}const fileOrigin=new URL(file,window.location.href).origin;if(fileOrigin!==viewerOrigin){throw new Error("file origin does not match viewer's");}}catch(ex){if(app_PDFViewerApplication.onError){app_PDFViewerApplication.onError(ex);}app_PDFViewerApplication._documentError("pdfjs-loading-error",{message:ex.message});throw ex;}};}function webViewerPageRender(_ref5){let{pageNumber}=_ref5;if(pageNumber===app_PDFViewerApplication.page){app_PDFViewerApplication.toolbar?.updateLoadingIndicatorState(true);}}function webViewerPageRendered(_ref6){let{pageNumber,error}=_ref6;if(pageNumber===app_PDFViewerApplication.page){app_PDFViewerApplication.toolbar?.updateLoadingIndicatorState(false);}if(app_PDFViewerApplication.pdfSidebar?.visibleView===SidebarView.THUMBS){const pageView=app_PDFViewerApplication.pdfViewer.getPageView(pageNumber-1);const thumbnailView=app_PDFViewerApplication.pdfThumbnailViewer?.getThumbnail(pageNumber-1);if(pageView){thumbnailView?.setImage(pageView);}}if(error){app_PDFViewerApplication._otherError("pdfjs-rendering-error",error);}}function webViewerPageMode(_ref7){let{mode}=_ref7;let view;switch(mode){case"thumbs":view=SidebarView.THUMBS;break;case"bookmarks":case"outline":view=SidebarView.OUTLINE;break;case"attachments":view=SidebarView.ATTACHMENTS;break;case"layers":view=SidebarView.LAYERS;break;case"none":view=SidebarView.NONE;break;default:globalThis.ngxConsole.error('Invalid "pagemode" hash parameter: '+mode);return;}app_PDFViewerApplication.pdfSidebar?.switchView(view,true);}function webViewerNamedAction(evt){switch(evt.action){case"GoToPage":app_PDFViewerApplication.appConfig.toolbar?.pageNumber.select();break;case"Find":if(!app_PDFViewerApplication.supportsIntegratedFind){app_PDFViewerApplication.findBar?.toggle();}break;case"Print":app_PDFViewerApplication.triggerPrinting();break;case"SaveAs":app_PDFViewerApplication.downloadOrSave();break;}}function webViewerPresentationModeChanged(evt){app_PDFViewerApplication.pdfViewer.presentationModeState=evt.state;}function webViewerSidebarViewChanged(_ref8){let{view}=_ref8;app_PDFViewerApplication.pdfRenderingQueue.isThumbnailViewEnabled=view===SidebarView.THUMBS;if(app_PDFViewerApplication.isInitialViewSet){app_PDFViewerApplication.store?.set("sidebarView",view).catch(()=>{});}}function webViewerUpdateViewarea(_ref9){let{location}=_ref9;if(app_PDFViewerApplication.isInitialViewSet){const settings={};if(location.pageNumber!==undefined||location.pageNumber!==null){settings.page=location.pageNumber;}if(location.scale){settings.zoom=location.scale;}if(location.left){settings.scrollLeft=location.left;}if(location.top){settings.scrollTop=location.top;}if(location.rotation!==undefined||location.rotation!==null){settings.rotation=location.rotation;}app_PDFViewerApplication.store?.setMultiple(settings).catch(()=>{});}if(app_PDFViewerApplication.appConfig.secondaryToolbar){const href=app_PDFViewerApplication.pdfLinkService.getAnchorUrl(location.pdfOpenParams);app_PDFViewerApplication.appConfig.secondaryToolbar.viewBookmarkButton.href=href;}}function webViewerScrollModeChanged(evt){if(app_PDFViewerApplication.isInitialViewSet&&!app_PDFViewerApplication.pdfViewer.isInPresentationMode){app_PDFViewerApplication.store?.set("scrollMode",evt.mode).catch(()=>{});}}function webViewerSpreadModeChanged(evt){if(app_PDFViewerApplication.isInitialViewSet&&!app_PDFViewerApplication.pdfViewer.isInPresentationMode){app_PDFViewerApplication.store?.set("spreadMode",evt.mode).catch(()=>{});}}function webViewerResize(){const{pdfDocument,pdfViewer,pdfRenderingQueue}=app_PDFViewerApplication;if(pdfRenderingQueue.printing&&window.matchMedia("print").matches){return;}if(!pdfDocument){return;}const currentScaleValue=pdfViewer.currentScaleValue;if(currentScaleValue==="auto"||currentScaleValue==="page-fit"||currentScaleValue==="page-width"){pdfViewer.currentScaleValue=currentScaleValue;}pdfViewer.update();}function webViewerHashchange(evt){const hash=evt.hash;if(!hash){return;}if(!app_PDFViewerApplication.isInitialViewSet){app_PDFViewerApplication.initialBookmark=hash;}else if(!app_PDFViewerApplication.pdfHistory?.popStateInProgress){if(app_PDFViewerApplication.pdfLinkService.setHash){app_PDFViewerApplication.pdfLinkService.setHash(hash);}}}{var webViewerFileInputChange=function(evt){if(app_PDFViewerApplication.pdfViewer?.isInPresentationMode){return;}const file=evt.fileInput.files[0];app_PDFViewerApplication.open({url:URL.createObjectURL(file),originalUrl:file.name});if(globalThis.setNgxExtendedPdfViewerSource){globalThis.setNgxExtendedPdfViewerSource(file.name??URL.createObjectURL(file));}};var webViewerOpenFile=function(evt){app_PDFViewerApplication._openFileInput?.click();};}function webViewerPresentationMode(){app_PDFViewerApplication.requestPresentationMode();}function webViewerSwitchAnnotationEditorMode(evt){app_PDFViewerApplication.pdfViewer.annotationEditorMode=evt;}function webViewerSwitchAnnotationEditorParams(evt){app_PDFViewerApplication.pdfViewer.annotationEditorParams=evt;}function webViewerPrint(){app_PDFViewerApplication.triggerPrinting();}function webViewerDownload(){app_PDFViewerApplication.downloadOrSave();}function webViewerFirstPage(){app_PDFViewerApplication.page=1;}function webViewerLastPage(){app_PDFViewerApplication.page=app_PDFViewerApplication.pagesCount;}function webViewerNextPage(){app_PDFViewerApplication.pdfViewer.nextPage();}function webViewerPreviousPage(){app_PDFViewerApplication.pdfViewer.previousPage();}function webViewerZoomIn(){app_PDFViewerApplication.zoomIn();}function webViewerZoomOut(){app_PDFViewerApplication.zoomOut();}function webViewerZoomReset(){app_PDFViewerApplication.zoomReset();}function webViewerPageNumberChanged(evt){const pdfViewer=app_PDFViewerApplication.pdfViewer;if(evt.value!==""){app_PDFViewerApplication.pdfLinkService.goToPage(evt.value);}if(evt.value!==pdfViewer.currentPageNumber.toString()&&evt.value!==pdfViewer.currentPageLabel){app_PDFViewerApplication.toolbar?.setPageNumber(pdfViewer.currentPageNumber,pdfViewer.currentPageLabel);}}function webViewerScaleChanged(evt){app_PDFViewerApplication.pdfViewer.currentScaleValue=evt.value;}function webViewerRotateCw(){app_PDFViewerApplication.rotatePages(90);}function webViewerRotateCcw(){app_PDFViewerApplication.rotatePages(-90);}function webViewerOptionalContentConfig(evt){app_PDFViewerApplication.pdfViewer.optionalContentConfigPromise=evt.promise;}function webViewerSwitchScrollMode(evt){app_PDFViewerApplication.pdfViewer.scrollMode=evt.mode;}function webViewerSwitchSpreadMode(evt){app_PDFViewerApplication.pdfViewer.spreadMode=evt.mode;}function webViewerDocumentProperties(){app_PDFViewerApplication.pdfDocumentProperties?.open();}function webViewerFindFromUrlHash(evt){app_PDFViewerApplication.eventBus.dispatch("find",{source:evt.source,type:"",query:evt.query,caseSensitive:false,entireWord:false,highlightAll:true,findPrevious:false,matchDiacritics:true});}function webViewerUpdateFindMatchesCount(_ref10){let{matchesCount}=_ref10;if(app_PDFViewerApplication.supportsIntegratedFind){app_PDFViewerApplication.externalServices.updateFindMatchesCount(matchesCount);}else{app_PDFViewerApplication.findBar?.updateResultsCount(matchesCount);}}function webViewerUpdateFindControlState(_ref11){let{state,previous,matchesCount,rawQuery}=_ref11;if(app_PDFViewerApplication.supportsIntegratedFind){app_PDFViewerApplication.externalServices.updateFindControlState({result:state,findPrevious:previous,matchesCount,rawQuery});}else{app_PDFViewerApplication.findBar?.updateUIState(state,previous,matchesCount);}}function webViewerScaleChanging(evt){app_PDFViewerApplication.toolbar?.setPageScale(evt.presetValue,evt.scale);app_PDFViewerApplication.pdfViewer.update(evt.noScroll);}function webViewerRotationChanging(evt){if(app_PDFViewerApplication.pdfThumbnailViewer){app_PDFViewerApplication.pdfThumbnailViewer.pagesRotation=evt.pagesRotation;}app_PDFViewerApplication.forceRendering();app_PDFViewerApplication.pdfViewer.currentPageNumber=evt.pageNumber;}function webViewerPageChanging(_ref12){let{pageNumber,pageLabel}=_ref12;app_PDFViewerApplication.toolbar?.setPageNumber(pageNumber,pageLabel);app_PDFViewerApplication.secondaryToolbar?.setPageNumber(pageNumber);if(app_PDFViewerApplication.pdfSidebar?.visibleView===SidebarView.THUMBS){app_PDFViewerApplication.pdfThumbnailViewer?.scrollThumbnailIntoView(pageNumber);}const currentPage=app_PDFViewerApplication.pdfViewer.getPageView(pageNumber-1);app_PDFViewerApplication.toolbar?.updateLoadingIndicatorState(currentPage?.renderingState===RenderingStates.RUNNING);const pageNumberInput=document.getElementById("pageNumber");if(pageNumberInput){const pageScrollEvent=new CustomEvent("page-change");pageNumberInput.dispatchEvent(pageScrollEvent);}}function webViewerResolutionChange(evt){app_PDFViewerApplication.pdfViewer.refresh();}function webViewerVisibilityChange(evt){if(document.visibilityState==="visible"){setZoomDisabledTimeout();}}let zoomDisabledTimeout=null;function setZoomDisabledTimeout(){if(zoomDisabledTimeout){clearTimeout(zoomDisabledTimeout);}zoomDisabledTimeout=setTimeout(function(){zoomDisabledTimeout=null;},WHEEL_ZOOM_DISABLED_TIMEOUT);}function webViewerWheel(evt){const element=document.getElementById("viewerContainer");const hover=element.parentNode.querySelector(":hover");if(hover!==element){return;}const{pdfViewer,supportsMouseWheelZoomCtrlKey,supportsMouseWheelZoomMetaKey,supportsPinchToZoom}=app_PDFViewerApplication;if(pdfViewer.isInPresentationMode){return;}const cmd=(evt.ctrlKey?1:0)|(evt.altKey?2:0)|(evt.shiftKey?4:0)|(evt.metaKey?8:0);if(window.isKeyIgnored&&window.isKeyIgnored(cmd,"WHEEL")){return;}const deltaMode=evt.deltaMode;let scaleFactor=Math.exp(-evt.deltaY/100);const isBuiltInMac=false;const isPinchToZoom=evt.ctrlKey&&!app_PDFViewerApplication._isCtrlKeyDown&&deltaMode===WheelEvent.DOM_DELTA_PIXEL&&evt.deltaX===0&&(Math.abs(scaleFactor-1)<0.05||isBuiltInMac)&&evt.deltaZ===0;const origin=[evt.clientX,evt.clientY];if(isPinchToZoom||evt.ctrlKey&&supportsMouseWheelZoomCtrlKey||evt.metaKey&&supportsMouseWheelZoomMetaKey){evt.preventDefault();if(app_PDFViewerApplication._isScrolling||zoomDisabledTimeout||document.visibilityState==="hidden"||app_PDFViewerApplication.overlayManager.active){return;}if(isPinchToZoom&&supportsPinchToZoom){scaleFactor=app_PDFViewerApplication._accumulateFactor(pdfViewer.currentScale,scaleFactor,"_wheelUnusedFactor");app_PDFViewerApplication.updateZoom(null,scaleFactor,origin);}else{const delta=normalizeWheelEventDirection(evt);let ticks=0;if(deltaMode===WheelEvent.DOM_DELTA_LINE||deltaMode===WheelEvent.DOM_DELTA_PAGE){if(Math.abs(delta)>=1){ticks=Math.sign(delta);}else{ticks=app_PDFViewerApplication._accumulateTicks(delta,"_wheelUnusedTicks");}}else{const PIXELS_PER_LINE_SCALE=30;ticks=app_PDFViewerApplication._accumulateTicks(delta/PIXELS_PER_LINE_SCALE,"_wheelUnusedTicks");}app_PDFViewerApplication.updateZoom(ticks,null,origin);}}}function webViewerTouchStart(evt){if(app_PDFViewerApplication.pdfViewer.isInPresentationMode||evt.touches.length<2){return;}evt.preventDefault();if(evt.touches.length!==2||app_PDFViewerApplication.overlayManager.active){app_PDFViewerApplication._touchInfo=null;return;}let[touch0,touch1]=evt.touches;if(touch0.identifier>touch1.identifier){[touch0,touch1]=[touch1,touch0];}app_PDFViewerApplication._touchInfo={touch0X:touch0.pageX,touch0Y:touch0.pageY,touch1X:touch1.pageX,touch1Y:touch1.pageY};}function webViewerTouchMove(evt){if(!app_PDFViewerApplication._touchInfo||evt.touches.length!==2){return;}const{pdfViewer,_touchInfo,supportsPinchToZoom}=app_PDFViewerApplication;let[touch0,touch1]=evt.touches;if(touch0.identifier>touch1.identifier){[touch0,touch1]=[touch1,touch0];}const{pageX:page0X,pageY:page0Y}=touch0;const{pageX:page1X,pageY:page1Y}=touch1;const{touch0X:pTouch0X,touch0Y:pTouch0Y,touch1X:pTouch1X,touch1Y:pTouch1Y}=_touchInfo;if(Math.abs(pTouch0X-page0X)<=1&&Math.abs(pTouch0Y-page0Y)<=1&&Math.abs(pTouch1X-page1X)<=1&&Math.abs(pTouch1Y-page1Y)<=1){return;}_touchInfo.touch0X=page0X;_touchInfo.touch0Y=page0Y;_touchInfo.touch1X=page1X;_touchInfo.touch1Y=page1Y;if(pTouch0X===page0X&&pTouch0Y===page0Y){const v1X=pTouch1X-page0X;const v1Y=pTouch1Y-page0Y;const v2X=page1X-page0X;const v2Y=page1Y-page0Y;const det=v1X*v2Y-v1Y*v2X;if(Math.abs(det)>0.02*Math.hypot(v1X,v1Y)*Math.hypot(v2X,v2Y)){return;}}else if(pTouch1X===page1X&&pTouch1Y===page1Y){const v1X=pTouch0X-page1X;const v1Y=pTouch0Y-page1Y;const v2X=page0X-page1X;const v2Y=page0Y-page1Y;const det=v1X*v2Y-v1Y*v2X;if(Math.abs(det)>0.02*Math.hypot(v1X,v1Y)*Math.hypot(v2X,v2Y)){return;}}else{const diff0X=page0X-pTouch0X;const diff1X=page1X-pTouch1X;const diff0Y=page0Y-pTouch0Y;const diff1Y=page1Y-pTouch1Y;const dotProduct=diff0X*diff1X+diff0Y*diff1Y;if(dotProduct>=0){return;}}evt.preventDefault();const origin=[(page0X+page1X)/2,(page0Y+page1Y)/2];const distance=Math.hypot(page0X-page1X,page0Y-page1Y)||1;const pDistance=Math.hypot(pTouch0X-pTouch1X,pTouch0Y-pTouch1Y)||1;if(supportsPinchToZoom){const newScaleFactor=app_PDFViewerApplication._accumulateFactor(pdfViewer.currentScale,distance/pDistance,"_touchUnusedFactor");app_PDFViewerApplication.updateZoom(null,newScaleFactor,origin);}else{const PIXELS_PER_LINE_SCALE=30;const ticks=app_PDFViewerApplication._accumulateTicks((distance-pDistance)/PIXELS_PER_LINE_SCALE,"_touchUnusedTicks");app_PDFViewerApplication.updateZoom(ticks,null,origin);}}function webViewerTouchEnd(evt){if(!app_PDFViewerApplication._touchInfo){return;}evt.preventDefault();app_PDFViewerApplication._touchInfo=null;app_PDFViewerApplication._touchUnusedTicks=0;app_PDFViewerApplication._touchUnusedFactor=1;}function webViewerClick(evt){if(!app_PDFViewerApplication.secondaryToolbar?.isOpen){return;}const appConfig=app_PDFViewerApplication.appConfig;if(app_PDFViewerApplication.pdfViewer.containsElement(evt.target)||appConfig.toolbar?.container.contains(evt.target)&&evt.target!==appConfig.secondaryToolbar?.toggleButton){if(evt.target&&evt.target.parentElement===appConfig.secondaryToolbar.toggleButton){return;}if(evt.target&&evt.target.parentElement&&evt.target.parentElement.parentElement===appConfig.secondaryToolbar.toggleButton){return;}app_PDFViewerApplication.secondaryToolbar.close();}}function webViewerKeyUp(evt){if(evt.key==="Control"){app_PDFViewerApplication._isCtrlKeyDown=false;}}function webViewerKeyDown(evt){app_PDFViewerApplication._isCtrlKeyDown=evt.key==="Control";if(app_PDFViewerApplication.overlayManager.active){return;}const{eventBus,pdfViewer}=app_PDFViewerApplication;const isViewerInPresentationMode=pdfViewer.isInPresentationMode;let handled=false,ensureViewerFocused=false;const cmd=(evt.ctrlKey?1:0)|(evt.altKey?2:0)|(evt.shiftKey?4:0)|(evt.metaKey?8:0);if(window.isKeyIgnored&&window.isKeyIgnored(cmd,evt.keyCode)){return;}if(cmd===1||cmd===8||cmd===5||cmd===12){switch(evt.keyCode){case 70:if(!app_PDFViewerApplication.supportsIntegratedFind&&!evt.shiftKey){app_PDFViewerApplication.findBar?.open();handled=true;}break;case 71:if(!app_PDFViewerApplication.supportsIntegratedFind){const{state}=app_PDFViewerApplication.findController;if(state){const newState={source:window,type:"again",findPrevious:cmd===5||cmd===12};eventBus.dispatch("find",{...state,...newState});}handled=true;}break;case 61:case 107:case 187:case 171:app_PDFViewerApplication.zoomIn();handled=true;break;case 173:case 109:case 189:app_PDFViewerApplication.zoomOut();handled=true;break;case 48:case 96:if(!isViewerInPresentationMode){setTimeout(function(){app_PDFViewerApplication.zoomReset();});handled=false;}break;case 38:if(isViewerInPresentationMode||app_PDFViewerApplication.page>1){app_PDFViewerApplication.page=1;handled=true;ensureViewerFocused=true;}break;case 40:if(isViewerInPresentationMode||app_PDFViewerApplication.page<app_PDFViewerApplication.pagesCount){app_PDFViewerApplication.page=app_PDFViewerApplication.pagesCount;handled=true;ensureViewerFocused=true;}break;}}if(cmd===1||cmd===8){switch(evt.keyCode){case 83:eventBus.dispatch("download",{source:window});handled=true;break;case 79:{eventBus.dispatch("openfile",{source:window});handled=true;}break;}}if(cmd===3||cmd===10){switch(evt.keyCode){case 80:app_PDFViewerApplication.requestPresentationMode();handled=true;app_PDFViewerApplication.externalServices.reportTelemetry({type:"buttons",data:{id:"presentationModeKeyboard"}});break;case 71:if(app_PDFViewerApplication.appConfig.toolbar){app_PDFViewerApplication.appConfig.toolbar.pageNumber.select();handled=true;}break;}}if(handled){if(ensureViewerFocused&&!isViewerInPresentationMode){pdfViewer.focus();}evt.preventDefault();return;}const curElement=getActiveOrFocusedElement();const curElementTagName=curElement?.tagName.toUpperCase();if(curElementTagName==="INPUT"||curElementTagName==="TEXTAREA"||curElementTagName==="SELECT"||curElementTagName==="BUTTON"&&(evt.keyCode===13||evt.keyCode===32)||curElement?.isContentEditable){if(evt.keyCode!==27){return;}}if(cmd===0){let turnPage=0,turnOnlyIfPageFit=false;switch(evt.keyCode){case 38:if(app_PDFViewerApplication.supportsCaretBrowsingMode){app_PDFViewerApplication.moveCaret(true,false);handled=true;break;}case 33:if(pdfViewer.isVerticalScrollbarEnabled){turnOnlyIfPageFit=true;}turnPage=-1;break;case 8:if(!isViewerInPresentationMode){turnOnlyIfPageFit=true;}turnPage=-1;break;case 37:if(app_PDFViewerApplication.supportsCaretBrowsingMode){return;}if(pdfViewer.isHorizontalScrollbarEnabled){turnOnlyIfPageFit=true;}case 75:case 80:turnPage=-1;break;case 27:if(app_PDFViewerApplication.secondaryToolbar?.isOpen){app_PDFViewerApplication.secondaryToolbar.close();handled=true;}if(!app_PDFViewerApplication.supportsIntegratedFind&&app_PDFViewerApplication.findBar?.opened){app_PDFViewerApplication.findBar.close();handled=true;}break;case 40:if(app_PDFViewerApplication.supportsCaretBrowsingMode){app_PDFViewerApplication.moveCaret(false,false);handled=true;break;}case 34:if(pdfViewer.isVerticalScrollbarEnabled){turnOnlyIfPageFit=true;}turnPage=1;break;case 13:case 32:if(!isViewerInPresentationMode){turnOnlyIfPageFit=true;}turnPage=1;break;case 39:if(app_PDFViewerApplication.supportsCaretBrowsingMode){return;}if(pdfViewer.isHorizontalScrollbarEnabled){turnOnlyIfPageFit=true;}case 74:case 78:turnPage=1;break;case 36:if(isViewerInPresentationMode||app_PDFViewerApplication.page>1){app_PDFViewerApplication.page=1;handled=true;ensureViewerFocused=true;}break;case 35:if(isViewerInPresentationMode||app_PDFViewerApplication.page<app_PDFViewerApplication.pagesCount){app_PDFViewerApplication.page=app_PDFViewerApplication.pagesCount;handled=true;ensureViewerFocused=true;}break;case 83:app_PDFViewerApplication.pdfCursorTools?.switchTool(CursorTool.SELECT);break;case 72:app_PDFViewerApplication.pdfCursorTools?.switchTool(CursorTool.HAND);break;case 82:app_PDFViewerApplication.rotatePages(90);break;case 115:app_PDFViewerApplication.pdfSidebar?.toggle();break;}if(turnPage!==0&&(!turnOnlyIfPageFit||pdfViewer.currentScaleValue==="page-fit")){if(turnPage>0){pdfViewer.nextPage();}else{pdfViewer.previousPage();}handled=true;}}if(cmd===4){switch(evt.keyCode){case 13:case 32:if(!isViewerInPresentationMode&&pdfViewer.currentScaleValue!=="page-fit"){break;}pdfViewer.previousPage();handled=true;break;case 38:app_PDFViewerApplication.moveCaret(true,true);handled=true;break;case 40:app_PDFViewerApplication.moveCaret(false,true);handled=true;break;case 82:app_PDFViewerApplication.rotatePages(-90);break;}}if(ensureViewerFocused&&!pdfViewer.containsElement(curElement)){pdfViewer.focus();}if(handled){evt.preventDefault();}}function beforeUnload(evt){evt.preventDefault();evt.returnValue="";return false;}function webViewerAnnotationEditorStatesChanged(data){app_PDFViewerApplication.externalServices.updateEditorStates(data);}function webViewerReportTelemetry(_ref13){let{details}=_ref13;app_PDFViewerApplication.externalServices.reportTelemetry(details);}
;// CONCATENATED MODULE: ./web/viewer.js
const pdfjsVersion="4.3.659";const pdfjsBuild="ba0b24810";const AppConstants={LinkTarget: LinkTarget,RenderingStates: RenderingStates,ScrollMode: ScrollMode,SpreadMode: SpreadMode};window.PDFViewerApplication=app_PDFViewerApplication;window.PDFViewerApplicationConstants=AppConstants;window.PDFViewerApplicationOptions=AppOptions;if(!HTMLCollection.prototype[Symbol.iterator]){HTMLCollection.prototype[Symbol.iterator]=Array.prototype[Symbol.iterator];}(function(){if(typeof window.CustomEvent==="function"){return;}function CustomEvent(event,params){params=params||{bubbles:false,cancelable:false,detail:null};const evt=document.createEvent("CustomEvent");evt.initCustomEvent(event,params.bubbles,params.cancelable,params.detail);return evt;}window.CustomEvent=CustomEvent;})();function getViewerConfiguration(){return{appContainer:document.body,mainContainer:document.getElementById("viewerContainer"),viewerContainer:document.getElementById("viewer"),toolbar:{container:document.getElementById("toolbarViewer"),numPages:document.getElementById("numPages"),pageNumber:document.getElementById("pageNumber"),scaleSelect:document.getElementById("scaleSelect"),customScaleOption:document.getElementById("customScaleOption"),previous:document.getElementById("previous"),next:document.getElementById("next"),zoomIn:document.getElementById("zoomIn"),zoomOut:document.getElementById("zoomOut"),viewFind:document.getElementById("viewFind"),print:document.getElementById("print"),editorFreeTextButton:document.getElementById("editorFreeText"),editorFreeTextParamsToolbar:document.getElementById("editorFreeTextParamsToolbar"),editorHighlightButton:document.getElementById("editorHighlight"),editorHighlightParamsToolbar:document.getElementById("editorHighlightParamsToolbar"),editorHighlightColorPicker:document.getElementById("editorHighlightColorPicker"),editorInkButton:document.getElementById("editorInk"),editorInkParamsToolbar:document.getElementById("editorInkParamsToolbar"),editorStampButton:document.getElementById("editorStamp"),presentationModeButton:document.getElementById("presentationMode"),editorStampParamsToolbar:document.getElementById("editorStampParamsToolbar"),download:document.getElementById("download")},secondaryToolbar:{toolbar:document.getElementById("secondaryToolbar"),toggleButton:document.getElementById("secondaryToolbarToggle"),presentationModeButton:document.getElementById("secondaryPresentationMode"),openFileButton:document.getElementById("secondaryOpenFile"),printButton:document.getElementById("secondaryPrint"),downloadButton:document.getElementById("secondaryDownload"),viewBookmarkButton:document.getElementById("viewBookmark"),firstPageButton:document.getElementById("firstPage"),lastPageButton:document.getElementById("lastPage"),pageRotateCwButton:document.getElementById("pageRotateCw"),pageRotateCcwButton:document.getElementById("pageRotateCcw"),cursorSelectToolButton:document.getElementById("cursorSelectTool"),cursorHandToolButton:document.getElementById("cursorHandTool"),scrollPageButton:document.getElementById("scrollPage"),scrollVerticalButton:document.getElementById("scrollVertical"),scrollHorizontalButton:document.getElementById("scrollHorizontal"),scrollWrappedButton:document.getElementById("scrollWrapped"),spreadNoneButton:document.getElementById("spreadNone"),spreadOddButton:document.getElementById("spreadOdd"),spreadEvenButton:document.getElementById("spreadEven"),documentPropertiesButton:document.getElementById("documentProperties")},sidebar:{outerContainer:document.getElementById("outerContainer"),sidebarContainer:document.getElementById("sidebarContainer"),toggleButton:document.getElementById("sidebarToggle"),resizer:document.getElementById("sidebarResizer"),thumbnailButton:document.getElementById("viewThumbnail"),outlineButton:document.getElementById("viewOutline"),attachmentsButton:document.getElementById("viewAttachments"),layersButton:document.getElementById("viewLayers"),thumbnailView:document.getElementById("thumbnailView"),outlineView:document.getElementById("outlineView"),attachmentsView:document.getElementById("attachmentsView"),layersView:document.getElementById("layersView"),currentOutlineItemButton:document.getElementById("currentOutlineItem")},findBar:{bar:document.getElementById("findbar"),toggleButton:document.getElementById("viewFind"),findField:document.getElementById("findInput"),highlightAllCheckbox:document.getElementById("findHighlightAll"),caseSensitiveCheckbox:document.getElementById("findMatchCase"),matchDiacriticsCheckbox:document.getElementById("findMatchDiacritics"),entireWordCheckbox:document.getElementById("findEntireWord"),findMsg:document.getElementById("findMsg"),findResultsCount:document.getElementById("findResultsCount"),findPreviousButton:document.getElementById("findPrevious"),findNextButton:document.getElementById("findNext")},passwordOverlay:{dialog:document.getElementById("passwordDialog"),label:document.getElementById("passwordText"),input:document.getElementById("password"),submitButton:document.getElementById("passwordSubmit"),cancelButton:document.getElementById("passwordCancel")},documentProperties:{dialog:document.getElementById("documentPropertiesDialog"),closeButton:document.getElementById("documentPropertiesClose"),fields:{fileName:document.getElementById("fileNameField"),fileSize:document.getElementById("fileSizeField"),title:document.getElementById("titleField"),author:document.getElementById("authorField"),subject:document.getElementById("subjectField"),keywords:document.getElementById("keywordsField"),creationDate:document.getElementById("creationDateField"),modificationDate:document.getElementById("modificationDateField"),creator:document.getElementById("creatorField"),producer:document.getElementById("producerField"),version:document.getElementById("versionField"),pageCount:document.getElementById("pageCountField"),pageSize:document.getElementById("pageSizeField"),linearized:document.getElementById("linearizedField")}},altTextDialog:{dialog:document.getElementById("altTextDialog"),optionDescription:document.getElementById("descriptionButton"),optionDecorative:document.getElementById("decorativeButton"),textarea:document.getElementById("descriptionTextarea"),cancelButton:document.getElementById("altTextCancel"),saveButton:document.getElementById("altTextSave")},annotationEditorParams:{editorFreeTextFontSize:document.getElementById("editorFreeTextFontSize"),editorFreeTextColor:document.getElementById("editorFreeTextColor"),editorInkColor:document.getElementById("editorInkColor"),editorInkThickness:document.getElementById("editorInkThickness"),editorInkOpacity:document.getElementById("editorInkOpacity"),editorStampAddImage:document.getElementById("editorStampAddImage"),editorFreeHighlightThickness:document.getElementById("editorFreeHighlightThickness"),editorHighlightShowAll:document.getElementById("editorHighlightShowAll")},printContainer:document.getElementById("printContainer")};}function webViewerLoad(){const config=getViewerConfiguration();const event=new CustomEvent("webviewerloaded",{bubbles:true,cancelable:true,detail:{source:window}});try{document.dispatchEvent(event);}catch(ex){console.error(`webviewerloaded: ${ex}`);parent.document.dispatchEvent(event);}app_PDFViewerApplication.run(config);}document.blockUnblockOnload?.(true);
})();

var __webpack_exports__PDFViewerApplication = __webpack_exports__.PDFViewerApplication;
var __webpack_exports__PDFViewerApplicationConstants = __webpack_exports__.PDFViewerApplicationConstants;
var __webpack_exports__PDFViewerApplicationOptions = __webpack_exports__.PDFViewerApplicationOptions;
var __webpack_exports__webViewerLoad = __webpack_exports__.webViewerLoad;
export { __webpack_exports__PDFViewerApplication as PDFViewerApplication, __webpack_exports__PDFViewerApplicationConstants as PDFViewerApplicationConstants, __webpack_exports__PDFViewerApplicationOptions as PDFViewerApplicationOptions, __webpack_exports__webViewerLoad as webViewerLoad };
