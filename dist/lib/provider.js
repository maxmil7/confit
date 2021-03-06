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

var minimist = _interopRequire(require("minimist"));

var debuglog = _interopRequire(require("debuglog"));

var Common = _interopRequire(require("./common.js"));

var debug = debuglog("confit");

module.exports = {

    argv: function argv() {
        var result = {};
        var args = minimist(process.argv.slice(2));

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _core.$for.getIterator(_core.Object.keys(args)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                if (key === "_") {
                    // Since the '_' args are standalone,
                    // just set keys with null values.
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _core.$for.getIterator(args._), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var prop = _step2.value;

                            result[prop] = null;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                                _iterator2["return"]();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else {
                    result[key] = args[key];
                }
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

        return result;
    },

    env: function env(ignore) {
        var result = {};

        // process.env is not a normal object, so we
        // need to map values.
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _core.$for.getIterator(_core.Object.keys(process.env)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var env = _step.value;

                //env:env is decided by process.env.NODE_ENV.
                //Not allowing process.env.env to override the env:env value.
                if (ignore.indexOf(env) < 0) {
                    result[env] = process.env[env];
                }
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

        return result;
    },

    convenience: function convenience() {
        var nodeEnv, env;

        nodeEnv = process.env.NODE_ENV || "development";
        env = {};

        debug("NODE_ENV set to " + nodeEnv);

        // Normalize env and set convenience values.
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _core.$for.getIterator(_core.Object.keys(Common.env)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var current = _step.value;

                var match = Common.env[current].test(nodeEnv);
                nodeEnv = match ? current : nodeEnv;
                env[current] = match;
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

        debug("env:env set to " + nodeEnv);

        // Set (or re-set) env:{nodeEnv} value in case
        // NODE_ENV was not one of our predetermined env
        // keys (so `config.get('env:blah')` will be true).
        env[nodeEnv] = true;
        env.env = nodeEnv;
        return { env: env };
    }
};
//# sourceMappingURL=provider.js.map