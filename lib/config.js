/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2015 eBay Software Foundation                               │
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
import Immutable from 'immutable';
import Thing from 'core-util-is';


// currently allows traversal into non-objects !!!

export default class Config {
    constructor(data) {
        this._stack = []; // currently unbounded
        this._store = Immutable.fromJS(data);
    }

    get(key) {
        var obj, value;

        if (Thing.isString(key) && key.length) {

            key = key.split(':');
            obj = this._store;

            if ( (value = obj.getIn(key)) &&
                 Immutable.Iterable.isIterable(value) ) {
                value = value.toJS();
            }

            return value;
        }

        return undefined;
    }

    set(key, value) {
        var obj, prop;

        if (Thing.isString(key) && key.length) {

            key = key.split(':');
            obj = this._store;

            if (value && (Array.isArray(value) || value.constructor === Object)) {
                value = Immutable.fromJS(value);
            }

            try {
                this._stack.unshift(obj);
                this._store = obj.setIn(key, value);
            } catch(e) {
                if (e.message === 'invalid keyPath') {
                  return undefined;
                } else {
                  throw e;
                }
            }

            return (value.toJS && value.toJS()) || value;
        }

        return undefined;
    }

    use(obj) {
        this._stack.unshift(this._store);
        this._store = this._store.mergeDeep(obj);
    }

    merge(config) {
        this.use(config._store);
    }
}
