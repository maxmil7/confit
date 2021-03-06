"use strict";

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

module.exports = confit;
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

var caller = _interopRequire(require("caller"));

var Thing = _interopRequire(require("core-util-is"));

var Factory = _interopRequire(require("./lib/factory"));

function confit() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    if (Thing.isString(options)) {
        options = { basedir: options };
    }

    // ¯\_(ツ)_/¯ ... still normalizing
    options.defaults = options.defaults || "config.json";
    options.basedir = options.basedir || Path.dirname(caller());
    options.protocols = options.protocols || {};

    return new Factory(options);
}
//# sourceMappingURL=index.js.map