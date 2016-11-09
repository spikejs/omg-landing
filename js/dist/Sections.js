/* test */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sections = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scopeSelector = require('./libs/scopeSelector');

var _scopeSelector2 = _interopRequireDefault(_scopeSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasElementsFromPoint = typeof document.elementsFromPoint === 'function';

var defaultRoot = document;
var defaultSectionDescriptor = {
    onCreate: function onCreate() {},
    onActive: function onActive(isActive) {},
    onScroll: function onScroll(scrollTop) {},
    onResize: function onResize() {}
};

var Section = function () {
    function Section(element) {
        var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRoot;
        var sectionDescriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : void 0;

        _classCallCheck(this, Section);

        if (typeof element === 'string') {
            element = root.querySelector(element);
        }

        Object.assign(this, defaultSectionDescriptor, sectionDescriptor);

        this.el = element;

        this.resetProp();

        this.onCreate();

        this._isInited = false;
    }

    _createClass(Section, [{
        key: 'resetProp',
        value: function resetProp() {
            this.detectId();
        }
    }, {
        key: 'detectId',
        value: function detectId() {
            var sectionId = this.el.getAttribute('data-id');
            if (!sectionId) {
                var linkEl = this.el.querySelector((0, _scopeSelector2.default)(':scope > a[name]', this.el));
                if (linkEl) {
                    sectionId = linkEl.getAttribute('name');
                }
            }

            this.id = sectionId || null;
        }
    }, {
        key: 'setActive',
        value: function setActive(isActive) {
            if (!this._isInited) {
                this._isInited = true;
            }

            this.isActive = !!isActive;

            this.onActive(this.isActive);

            if (this.isActive) {
                this.el.classList.add('active');
            } else {
                this.el.classList.remove('active');
            }
        }
    }, {
        key: 'onScroll',
        value: function onScroll(scrollTop) {
            this.onScroll(scrollTop);
        }
    }, {
        key: 'offsetTop',
        get: function get() {
            return this.el.offsetTop;
        }
    }, {
        key: 'offsetHeight',
        get: function get() {
            return this.el.offsetHeight;
        }
    }, {
        key: 'offsetBottom',
        get: function get() {
            return this.offsetTop + this.offsetHeight;
        }
    }]);

    return Section;
}();

var Sections = exports.Sections = function () {
    function Sections(element) {
        var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultRoot;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            sectionSelector = _ref.sectionSelector,
            _ref$scrollingElement = _ref.scrollingElement,
            scrollingElement = _ref$scrollingElement === undefined ? null : _ref$scrollingElement;

        var sectionsDescriptors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Sections);

        this.root = root;

        if (typeof element === 'string') {
            element = root.querySelector(element);
        }

        this.reset(element);

        this.sectionSelector = (0, _scopeSelector2.default)(sectionSelector, element);
        this.sectionsDescriptors = sectionsDescriptors;
        this.scrollingElement = scrollingElement || document.scrollingElement;

        this.initSections();
        this.initEvents();
        this.detectCurrentSection();
    }

    _createClass(Sections, [{
        key: 'getScrollTop',
        value: function getScrollTop() {
            return this.scrollingElement.scrollTop;
        }
    }, {
        key: 'reset',
        value: function reset(element) {
            this.el = element;
            this.sections = [];
        }
    }, {
        key: '_getSectionDescriptor',
        value: function _getSectionDescriptor(el) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.sectionsDescriptors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var sectionDescriptorKey = _step.value;

                    if (el.matches(sectionDescriptorKey)) {
                        return this.sectionsDescriptors[sectionDescriptorKey] || void 0;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return void 0;
        }
    }, {
        key: 'initSections',
        value: function initSections() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.root.querySelectorAll(this.sectionSelector)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var el = _step2.value;

                    this.sections.push(new Section(el, this.root, this._getSectionDescriptor(el)));
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: 'getSectionByScrollTop',
        value: function getSectionByScrollTop() {
            var scrollTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getScrollTop();

            var delta = this.documentContainerHeight * 20 / 100; // 20%;

            scrollTop += delta;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.sections[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var section = _step3.value;

                    if (scrollTop >= section.offsetTop && scrollTop <= section.offsetBottom) {
                        section.currentPercentTop = Math.max(scrollTop - delta - section.offsetTop, 0) * 100 / section.offsetHeight /* / 100*/;
                        section.currentRelativeTop = scrollTop;
                        //console.log('section.currentRelativeTop', section.currentRelativeTop, '| section.currentPercentTop', section.currentPercentTop, '| section.offsetTop', section.offsetTop, '| scrollTop - delta', scrollTop - delta);
                        return section;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return null;
        }
    }, {
        key: 'detectCurrentSection',
        value: function detectCurrentSection() {
            var scrollTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getScrollTop();

            var currentSection = this.getSectionByScrollTop(scrollTop);

            if (this.currentSection !== currentSection) {
                if (this.currentSection) {
                    this.currentSection.setActive(false);
                }

                this.currentSection = currentSection;

                if (currentSection) {
                    this.currentSection.setActive(true);

                    this.currentSection.onScroll(scrollTop);
                }
            }
        }
    }, {
        key: '_onScroll',
        value: function _onScroll() {
            var scrollTop = this.getScrollTop();
            if (this.currentSection) {
                this.currentSection.onScroll(scrollTop);
            }

            this.detectCurrentSection(scrollTop);
        }
    }, {
        key: '_onResize',
        value: function _onResize() {
            if (this.currentSection) {
                this.currentSection.onResize();
            }

            this._onScroll();
        }
    }, {
        key: 'initEvents',
        value: function initEvents() {
            this._onScroll = this._onScroll.bind(this);
            this._onResize = this._onResize.bind(this);

            //TODO:: почему-то это не работает в Chromium
            // this.scrollingElement.addEventListener('scroll', this._onScroll);
            //TODO:: почему-то это не работает в FireFox
            //this.scrollingElement.onscroll = this._onScroll;

            document.addEventListener('scroll', this._onScroll);

            window.addEventListener('resize', this._onResize);
        }
    }, {
        key: 'documentContainerHeight',
        get: function get() {
            return document.documentElement.clientHeight;
        }
    }], [{
        key: 'setDefaultRoot',
        value: function setDefaultRoot(root) {
            defaultRoot = root;
        }
    }]);

    return Sections;
}();

},{"./libs/scopeSelector":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.randomString = randomString;
function randomString(prefix, postfix) {
    return (prefix || '') + Math.abs(Math.random() * 9e9 | 0).toString(36) + (postfix || '');
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = replaceScopeSelector;

var _StringUtils = require('./StringUtils');

var _contentLoaded = require('content-loaded');

var _contentLoaded2 = _interopRequireDefault(_contentLoaded);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scopePseudoSelectorBrowserSupport = false;

var uid = 0;
var prefix = (0, _StringUtils.randomString)('rel');

function getRandomElementId() {
    return (0, _StringUtils.randomString)(prefix, '_' + ++uid);
}

function replaceScopeSelector(selector, element) {
    if (!element) {
        return selector;
    }
    if (scopePseudoSelectorBrowserSupport) {
        return selector;
    }

    return selector.replace(/(^|\s|,):scope/g, function () {
        if (!element.id) {
            element.id = getRandomElementId();
        }

        return '#' + element.id;
    });
}

(0, _contentLoaded2.default)(function () {
    var testElementId = (0, _StringUtils.randomString)(prefix, '_00');
    var innerElementId = (0, _StringUtils.randomString)(prefix, '_01');
    var innerClass = (0, _StringUtils.randomString)('cl');

    try {
        document.documentElement.insertAdjacentHTML('afterbegin', '<span id="' + testElementId + '" style="display:none"><span id="' + innerElementId + '" class="' + innerClass + '"></span></span>');

        var testElement = document.getElementById(testElementId);
        var innerElement = document.getElementById(innerElementId);
        if (testElement && innerElement) {
            if (testElement.querySelector(':scope > .' + innerClass) === innerElement) {
                scopePseudoSelectorBrowserSupport = true;
            }
        }
    } catch (e) {}
});

},{"./StringUtils":2,"content-loaded":4}],4:[function(require,module,exports){
module.exports = function() {
    return new Promise(function(resolve) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            return resolve();
        }

        document.addEventListener('DOMContentLoaded', function listener() {
            document.removeEventListener('DOMContentLoaded', listener);
            resolve();
        });
    });
};

},{}]},{},[1]);
