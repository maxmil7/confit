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

var Path = _interopRequire(require("path"));

var shush = _interopRequire(require("shush"));

var debuglog = _interopRequire(require("debuglog"));

var Thing = _interopRequire(require("core-util-is"));

var Config = _interopRequire(require("./config"));

var Common = _interopRequire(require("./common"));

var Handlers = _interopRequire(require("./handlers"));

var Provider = _interopRequire(require("./provider"));

var debug = debuglog("confit");

var Factory = (function () {
    function Factory(_ref) {
        var _this = this;

        var basedir = _ref.basedir;
        var _ref$protocols = _ref.protocols;
        var protocols = _ref$protocols === undefined ? {} : _ref$protocols;
        var _ref$defaults = _ref.defaults;
        var defaults = _ref$defaults === undefined ? "config.json" : _ref$defaults;
        var _ref$envignore = _ref.envignore;
        var envignore = _ref$envignore === undefined ? [] : _ref$envignore;

        _classCallCheck(this, Factory);

        this.envignore = envignore.push("env");
        this.basedir = basedir;
        this.protocols = protocols;
        this.promise = _core.Promise.resolve({}).then(function (store) {
            return Common.merge(Provider.convenience(), store);
        }).then(Factory.conditional(function (store) {
            var file = Path.join(_this.basedir, defaults);
            return Handlers.resolveImport(shush(file), _this.basedir).then(function (data) {
                return Common.merge(data, store);
            });
        })).then(Factory.conditional(function (store) {
            var file = Path.join(_this.basedir, "" + store.env.env + ".json");
            return Handlers.resolveImport(shush(file), _this.basedir).then(function (data) {
                return Common.merge(shush(file), store);
            });
        })).then(function (store) {
            return Common.merge(Provider.env(envignore), store);
        }).then(function (store) {
            return Common.merge(Provider.argv(), store);
        });
    }

    _createClass(Factory, {
        addDefault: {
            value: function addDefault(obj) {
                this._add(obj, function (store, data) {
                    return Common.merge(store, data);
                });
                return this;
            }
        },
        addOverride: {
            value: function addOverride(obj) {
                this._add(obj, function (store, data) {
                    return Common.merge(data, store);
                });
                return this;
            }
        },
        create: {
            value: function create(cb) {
                var _this = this;

                this.promise.then(function (store) {
                    return Handlers.resolveImport(store, _this.basedir);
                }).then(function (store) {
                    return Handlers.resolveCustom(store, _this.protocols);
                }).then(function (store) {
                    return Handlers.resolveConfig(store);
                }).then(function (store) {
                    return cb(null, new Config(store));
                }, cb);
            }
        },
        _add: {
            value: function _add(obj, fn) {
                var data = this._resolveFile(obj);
                var handler = Handlers.resolveImport(data, this.basedir);
                this.promise = this.promise.then(function (store) {
                    return handler.then(function (data) {
                        return fn(store, data);
                    });
                });
            }
        },
        _resolveFile: {
            value: function _resolveFile(path) {
                if (Thing.isString(path)) {
                    var file = Common.isAbsolute(path) ? path : Path.join(this.basedir, path);
                    return shush(file);
                }
                return path;
            }
        }
    }, {
        conditional: {
            value: function conditional(fn) {
                return function (store) {
                    try {
                        return fn(store);
                    } catch (err) {
                        if (err.code && err.code === "MODULE_NOT_FOUND") {
                            debug("WARNING: " + err.message);
                            return store;
                        }
                        throw err;
                    }
                };
            }
        }
    });

    return Factory;
})();

module.exports = Factory;
//# sourceMappingURL=factory.js.map