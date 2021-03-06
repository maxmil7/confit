"use strict";

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2016 PayPal                                                 │
 │                                                                            │
 │  Licensed under the Apache License, Version 2.0 (the "License");           │
 │  you may not use this file except in compliance with the License.          │
 │  You may obtain a copy of the License at                                   │
 │                                                                            │
 │    http://www.apache.org/licenses/LICENSE-2.0                              │
 │                                                                            │
 │  Unless required by applicable law or agreed to in writing, software       │
 │  distributed under the License is distributed on an "AS IS" BASIS,         │
 │  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │  See the License for the specific language governing permissions and       │
 │  limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/

var Path = _interopRequire(require("path"));

var Thing = _interopRequire(require("core-util-is"));

module.exports = {

    env: {
        development: /^dev/i,
        test: /^test/i,
        staging: /^stag/i,
        production: /^prod/i
    },

    isAbsolute: function isAbsolute(path) {
        if (Thing.isString(path)) {
            path = Path.normalize(path);
            return path === Path.resolve(path);
        }
        return false;
    },

    merge: function merge(src, dest) {
        // NOTE: Do not merge arrays and only merge objects into objects.
        if (!Thing.isArray(src) && Thing.isObject(src) && Thing.isObject(dest)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _core.$for.getIterator(_core.Object.getOwnPropertyNames(src)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var prop = _step.value;

                    var descriptor = _core.Object.getOwnPropertyDescriptor(src, prop);
                    descriptor.value = this.merge(descriptor.value, dest[prop]);
                    Object.defineProperty(dest, prop, descriptor);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return dest;
        }

        return src;
    }

};
//# sourceMappingURL=common.js.map