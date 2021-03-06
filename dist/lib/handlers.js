"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

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

var shush = _interopRequire(require("shush"));

var async = _interopRequire(require("async"));

var Shortstop = _interopRequire(require("shortstop"));

var createPath = require("shortstop-handlers").path;

var Handlers = (function () {
    function Handlers() {
        _classCallCheck(this, Handlers);
    }

    _createClass(Handlers, null, {
        resolveConfig: {
            value: function resolveConfig(data) {
                return new _core.Promise(function (resolve, reject) {
                    var usedHandler = false;

                    var shorty = Shortstop.create();
                    shorty.use("config", function (key) {
                        usedHandler = true;

                        var keys = key.split(".");
                        var result = data;

                        while (result && keys.length) {
                            var prop = keys.shift();
                            if (!result.hasOwnProperty(prop)) {
                                return undefined;
                            }
                            result = result[prop];
                        }

                        return keys.length ? null : result;
                    });

                    async.doWhilst(function exec(cb) {
                        usedHandler = false;
                        shorty.resolve(data, function (err, result) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            data = result;
                            cb();
                        });
                    }, function test() {
                        return usedHandler;
                    }, function complete(err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                });
            }
        },
        resolveImport: {
            value: function resolveImport(data, basedir) {
                return new _core.Promise(function (resolve, reject) {
                    var path = createPath(basedir);
                    var shorty = Shortstop.create();

                    shorty.use("import", function (file, cb) {
                        try {
                            file = path(file);
                            return shorty.resolve(shush(file), cb);
                        } catch (err) {
                            cb(err);
                        }
                    });

                    shorty.resolve(data, function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                });
            }
        },
        resolveCustom: {
            value: function resolveCustom(data, protocols) {
                return new _core.Promise(function (resolve, reject) {
                    var shorty = Shortstop.create();

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = _core.$for.getIterator(_core.Object.keys(protocols)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var protocol = _step.value;

                            var impls = protocols[protocol];

                            if (Array.isArray(impls)) {
                                var _iteratorNormalCompletion2 = true;
                                var _didIteratorError2 = false;
                                var _iteratorError2 = undefined;

                                try {
                                    for (var _iterator2 = _core.$for.getIterator(impls), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                        var impl = _step2.value;

                                        shorty.use(protocol, impl);
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
                                shorty.use(protocol, impls);
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

                    shorty.resolve(data, function (err, data) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                });
            }
        }
    });

    return Handlers;
})();

module.exports = Handlers;
//# sourceMappingURL=handlers.js.map