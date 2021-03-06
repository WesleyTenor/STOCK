﻿(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++) s(r[o]); return s })({
    1: [function (require, module, exports) {
        (function (process) {
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             * All rights reserved.
             *
             * This source code is licensed under the BSD-style license found in the
             * LICENSE file in the root directory of this source tree. An additional grant
             * of patent rights can be found in the PATENTS file in the same directory.
             *
             */

            'use strict';

            /**
             * Use invariant() to assert state which your program assumes to be true.
             *
             * Provide sprintf-style format (only %s is supported) and arguments
             * to provide information about what broke and what you were
             * expecting.
             *
             * The invariant message will be stripped in production, but the invariant
             * will remain to ensure logic does not differ in production.
             */

            var validateFormat = function validateFormat(format) { };

            if (process.env.NODE_ENV !== 'production') {
                validateFormat = function validateFormat(format) {
                    if (format === undefined) {
                        throw new Error('invariant requires an error message argument');
                    }
                };
            }

            function invariant(condition, format, a, b, c, d, e, f) {
                validateFormat(format);

                if (!condition) {
                    var error;
                    if (format === undefined) {
                        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
                    } else {
                        var args = [a, b, c, d, e, f];
                        var argIndex = 0;
                        error = new Error(format.replace(/%s/g, function () {
                            return args[argIndex++];
                        }));
                        error.name = 'Invariant Violation';
                    }

                    error.framesToPop = 1; // we don't care about invariant's own frame
                    throw error;
                }
            }

            module.exports = invariant;
        }).call(this, require('_process'))
    }, { "_process": 5 }], 2: [function (require, module, exports) {
        /**
         * Copyright (c) 2014-2015, Facebook, Inc.
         * All rights reserved.
         *
         * This source code is licensed under the BSD-style license found in the
         * LICENSE file in the root directory of this source tree. An additional grant
         * of patent rights can be found in the PATENTS file in the same directory.
         */

        module.exports.Dispatcher = require('./lib/Dispatcher');

    }, { "./lib/Dispatcher": 3 }], 3: [function (require, module, exports) {
        (function (process) {
            /**
             * Copyright (c) 2014-2015, Facebook, Inc.
             * All rights reserved.
             *
             * This source code is licensed under the BSD-style license found in the
             * LICENSE file in the root directory of this source tree. An additional grant
             * of patent rights can be found in the PATENTS file in the same directory.
             *
             * @providesModule Dispatcher
             * 
             * @preventMunge
             */

            'use strict';

            exports.__esModule = true;

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

            var invariant = require('fbjs/lib/invariant');

            var _prefix = 'ID_';

            /**
             * Dispatcher is used to broadcast payloads to registered callbacks. This is
             * different from generic pub-sub systems in two ways:
             *
             *   1) Callbacks are not subscribed to particular events. Every payload is
             *      dispatched to every registered callback.
             *   2) Callbacks can be deferred in whole or part until other callbacks have
             *      been executed.
             *
             * For example, consider this hypothetical flight destination form, which
             * selects a default city when a country is selected:
             *
             *   var flightDispatcher = new Dispatcher();
             *
             *   // Keeps track of which country is selected
             *   var CountryStore = {country: null};
             *
             *   // Keeps track of which city is selected
             *   var CityStore = {city: null};
             *
             *   // Keeps track of the base flight price of the selected city
             *   var FlightPriceStore = {price: null}
             *
             * When a user changes the selected city, we dispatch the payload:
             *
             *   flightDispatcher.dispatch({
             *     actionType: 'city-update',
             *     selectedCity: 'paris'
             *   });
             *
             * This payload is digested by `CityStore`:
             *
             *   flightDispatcher.register(function(payload) {
             *     if (payload.actionType === 'city-update') {
             *       CityStore.city = payload.selectedCity;
             *     }
             *   });
             *
             * When the user selects a country, we dispatch the payload:
             *
             *   flightDispatcher.dispatch({
             *     actionType: 'country-update',
             *     selectedCountry: 'australia'
             *   });
             *
             * This payload is digested by both stores:
             *
             *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
             *     if (payload.actionType === 'country-update') {
             *       CountryStore.country = payload.selectedCountry;
             *     }
             *   });
             *
             * When the callback to update `CountryStore` is registered, we save a reference
             * to the returned token. Using this token with `waitFor()`, we can guarantee
             * that `CountryStore` is updated before the callback that updates `CityStore`
             * needs to query its data.
             *
             *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
             *     if (payload.actionType === 'country-update') {
             *       // `CountryStore.country` may not be updated.
             *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
             *       // `CountryStore.country` is now guaranteed to be updated.
             *
             *       // Select the default city for the new country
             *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
             *     }
             *   });
             *
             * The usage of `waitFor()` can be chained, for example:
             *
             *   FlightPriceStore.dispatchToken =
             *     flightDispatcher.register(function(payload) {
             *       switch (payload.actionType) {
             *         case 'country-update':
             *         case 'city-update':
             *           flightDispatcher.waitFor([CityStore.dispatchToken]);
             *           FlightPriceStore.price =
             *             getFlightPriceStore(CountryStore.country, CityStore.city);
             *           break;
             *     }
             *   });
             *
             * The `country-update` payload will be guaranteed to invoke the stores'
             * registered callbacks in order: `CountryStore`, `CityStore`, then
             * `FlightPriceStore`.
             */

            var Dispatcher = (function () {
                function Dispatcher() {
                    _classCallCheck(this, Dispatcher);

                    this._callbacks = {};
                    this._isDispatching = false;
                    this._isHandled = {};
                    this._isPending = {};
                    this._lastID = 1;
                }

                /**
                 * Registers a callback to be invoked with every dispatched payload. Returns
                 * a token that can be used with `waitFor()`.
                 */

                Dispatcher.prototype.register = function register(callback) {
                    var id = _prefix + this._lastID++;
                    this._callbacks[id] = callback;
                    return id;
                };

                /**
                 * Removes a callback based on its token.
                 */

                Dispatcher.prototype.unregister = function unregister(id) {
                    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
                    delete this._callbacks[id];
                };

                /**
                 * Waits for the callbacks specified to be invoked before continuing execution
                 * of the current callback. This method should only be used by a callback in
                 * response to a dispatched payload.
                 */

                Dispatcher.prototype.waitFor = function waitFor(ids) {
                    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
                    for (var ii = 0; ii < ids.length; ii++) {
                        var id = ids[ii];
                        if (this._isPending[id]) {
                            !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
                            continue;
                        }
                        !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
                        this._invokeCallback(id);
                    }
                };

                /**
                 * Dispatches a payload to all registered callbacks.
                 */

                Dispatcher.prototype.dispatch = function dispatch(payload) {
                    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
                    this._startDispatching(payload);
                    try {
                        for (var id in this._callbacks) {
                            if (this._isPending[id]) {
                                continue;
                            }
                            this._invokeCallback(id);
                        }
                    } finally {
                        this._stopDispatching();
                    }
                };

                /**
                 * Is this Dispatcher currently dispatching.
                 */

                Dispatcher.prototype.isDispatching = function isDispatching() {
                    return this._isDispatching;
                };

                /**
                 * Call the callback stored with the given id. Also do some internal
                 * bookkeeping.
                 *
                 * @internal
                 */

                Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
                    this._isPending[id] = true;
                    this._callbacks[id](this._pendingPayload);
                    this._isHandled[id] = true;
                };

                /**
                 * Set up bookkeeping needed when dispatching.
                 *
                 * @internal
                 */

                Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
                    for (var id in this._callbacks) {
                        this._isPending[id] = false;
                        this._isHandled[id] = false;
                    }
                    this._pendingPayload = payload;
                    this._isDispatching = true;
                };

                /**
                 * Clear bookkeeping used for dispatching.
                 *
                 * @internal
                 */

                Dispatcher.prototype._stopDispatching = function _stopDispatching() {
                    delete this._pendingPayload;
                    this._isDispatching = false;
                };

                return Dispatcher;
            })();

            module.exports = Dispatcher;
        }).call(this, require('_process'))
    }, { "_process": 5, "fbjs/lib/invariant": 1 }], 4: [function (require, module, exports) {

        angular.module('facebookFlux', []);

        angular.module('facebookFlux')
          .service('Dispatcher', function () {
              var Dispatcher = require('flux').Dispatcher;
              return new Dispatcher();
          });

    }, { "flux": 2 }], 5: [function (require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        }())
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }


        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }



        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() { }

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) { return [] }

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () { return '/' };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () { return 0; };

    }, {}]
}, {}, [4]);
