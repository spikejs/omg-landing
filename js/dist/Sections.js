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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcc3JjXFxTZWN0aW9ucy5qcyIsImpzXFxzcmNcXGxpYnNcXFN0cmluZ1V0aWxzLmpzIiwianNcXHNyY1xcbGlic1xcc2NvcGVTZWxlY3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb250ZW50LWxvYWRlZC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sdUJBQXVCLE9BQU8sU0FBUyxpQkFBaEIsS0FBc0MsVUFBbkU7O0FBRUEsSUFBSSxjQUFjLFFBQWxCO0FBQ0EsSUFBSSwyQkFBMkI7QUFDM0IsWUFEMkIsc0JBQ2pCLENBQUUsQ0FEZTtBQUUzQixZQUYyQixvQkFFbEIsUUFGa0IsRUFFVCxDQUFFLENBRk87QUFHM0IsWUFIMkIsb0JBR2xCLFNBSGtCLEVBR1IsQ0FBRSxDQUhNO0FBSTNCLFlBSjJCLHNCQUlqQixDQUFFO0FBSmUsQ0FBL0I7O0lBT00sTztBQUNGLHFCQUFZLE9BQVosRUFBcUU7QUFBQSxZQUFoRCxJQUFnRCx1RUFBekMsV0FBeUM7QUFBQSxZQUE1QixpQkFBNEIsdUVBQVIsS0FBSyxDQUFHOztBQUFBOztBQUNqRSxZQUFLLE9BQU8sT0FBUCxLQUFtQixRQUF4QixFQUFtQztBQUMvQixzQkFBVSxLQUFLLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBVjtBQUNIOztBQUVELGVBQU8sTUFBUCxDQUFjLElBQWQsRUFBb0Isd0JBQXBCLEVBQThDLGlCQUE5Qzs7QUFFQSxhQUFLLEVBQUwsR0FBVSxPQUFWOztBQUVBLGFBQUssU0FBTDs7QUFFQSxhQUFLLFFBQUw7O0FBRUEsYUFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0g7Ozs7b0NBY1c7QUFDUixpQkFBSyxRQUFMO0FBQ0g7OzttQ0FFVTtBQUNQLGdCQUFJLFlBQVksS0FBSyxFQUFMLENBQVEsWUFBUixDQUFxQixTQUFyQixDQUFoQjtBQUNBLGdCQUFL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TUFBeUQsWUFBOUQsRUFBNkU7QUFDekUsb0RBQW9DLElBQXBDO0FBQ0g7QUFDSjtBQUNKLEtBVkQsQ0FXQSxPQUFNLENBQU4sRUFBUSxDQUFFO0FBQ2IsQ0FqQkQ7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgc2NvcGVTZWxlY3RvciBmcm9tICcuL2xpYnMvc2NvcGVTZWxlY3Rvcic7XG5cbmNvbnN0IGhhc0VsZW1lbnRzRnJvbVBvaW50ID0gdHlwZW9mIGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50ID09PSAnZnVuY3Rpb24nO1xuXG5sZXQgZGVmYXVsdFJvb3QgPSBkb2N1bWVudDtcbmxldCBkZWZhdWx0U2VjdGlvbkRlc2NyaXB0b3IgPSB7XG4gICAgb25DcmVhdGUoKXt9LFxuICAgIG9uQWN0aXZlKGlzQWN0aXZlKXt9LFxuICAgIG9uU2Nyb2xsKHNjcm9sbFRvcCl7fSxcbiAgICBvblJlc2l6ZSgpe30sXG59O1xuXG5jbGFzcyBTZWN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCByb290ID0gZGVmYXVsdFJvb3QsIHNlY3Rpb25EZXNjcmlwdG9yID0gdm9pZCAwKSB7XG4gICAgICAgIGlmICggdHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgZWxlbWVudCA9IHJvb3QucXVlcnlTZWxlY3RvcihlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGVmYXVsdFNlY3Rpb25EZXNjcmlwdG9yLCBzZWN0aW9uRGVzY3JpcHRvcik7XG5cbiAgICAgICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5yZXNldFByb3AoKTtcblxuICAgICAgICB0aGlzLm9uQ3JlYXRlKCk7XG5cbiAgICAgICAgdGhpcy5faXNJbml0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgb2Zmc2V0VG9wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC5vZmZzZXRUb3A7XG4gICAgfVxuXG4gICAgZ2V0IG9mZnNldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwub2Zmc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIGdldCBvZmZzZXRCb3R0b20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZnNldFRvcCArIHRoaXMub2Zmc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIHJlc2V0UHJvcCgpIHtcbiAgICAgICAgdGhpcy5kZXRlY3RJZCgpO1xuICAgIH1cblxuICAgIGRldGVjdElkKCkge1xuICAgICAgICBsZXQgc2VjdGlvbklkID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgaWYgKCAhc2VjdGlvbklkICkge1xuICAgICAgICAgICAgbGV0IGxpbmtFbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihzY29wZVNlbGVjdG9yKCc6c2NvcGUgPiBhW25hbWVdJywgdGhpcy5lbCkpO1xuICAgICAgICAgICAgaWYgKCBsaW5rRWwgKSB7XG4gICAgICAgICAgICAgICAgc2VjdGlvbklkID0gbGlua0VsLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IHNlY3Rpb25JZCB8fCBudWxsO1xuICAgIH1cblxuICAgIHNldEFjdGl2ZShpc0FjdGl2ZSkge1xuICAgICAgICBpZiAoICF0aGlzLl9pc0luaXRlZCApIHtcbiAgICAgICAgICAgIHRoaXMuX2lzSW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhIWlzQWN0aXZlO1xuXG4gICAgICAgIHRoaXMub25BY3RpdmUodGhpcy5pc0FjdGl2ZSk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzQWN0aXZlICkge1xuICAgICAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNjcm9sbChzY3JvbGxUb3ApIHtcbiAgICAgICAgdGhpcy5vblNjcm9sbChzY3JvbGxUb3ApO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlY3Rpb25zIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCByb290ID0gZGVmYXVsdFJvb3QsIHtzZWN0aW9uU2VsZWN0b3IsIHNjcm9sbGluZ0VsZW1lbnQgPSBudWxsfSA9IHt9LCBzZWN0aW9uc0Rlc2NyaXB0b3JzID0ge30pIHtcbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcblxuICAgICAgICBpZiAoIHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSByb290LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2V0KGVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuc2VjdGlvblNlbGVjdG9yID0gc2NvcGVTZWxlY3RvcihzZWN0aW9uU2VsZWN0b3IsIGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnNlY3Rpb25zRGVzY3JpcHRvcnMgPSBzZWN0aW9uc0Rlc2NyaXB0b3JzO1xuICAgICAgICB0aGlzLnNjcm9sbGluZ0VsZW1lbnQgPSBzY3JvbGxpbmdFbGVtZW50IHx8IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5pbml0U2VjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XG4gICAgICAgIHRoaXMuZGV0ZWN0Q3VycmVudFNlY3Rpb24oKTtcbiAgICB9XG5cbiAgICBnZXQgZG9jdW1lbnRDb250YWluZXJIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIGdldFNjcm9sbFRvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgcmVzZXQoZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5zZWN0aW9ucyA9IFtdO1xuICAgIH1cblxuICAgIF9nZXRTZWN0aW9uRGVzY3JpcHRvcihlbCkge1xuICAgICAgICBmb3IgKCBsZXQgc2VjdGlvbkRlc2NyaXB0b3JLZXkgb2YgT2JqZWN0LmtleXModGhpcy5zZWN0aW9uc0Rlc2NyaXB0b3JzKSApIHtcbiAgICAgICAgICAgIGlmICggZWwubWF0Y2hlcyhzZWN0aW9uRGVzY3JpcHRvcktleSkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VjdGlvbnNEZXNjcmlwdG9yc1tzZWN0aW9uRGVzY3JpcHRvcktleV0gfHwgdm9pZCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG5cbiAgICBpbml0U2VjdGlvbnMoKSB7XG4gICAgICAgIGZvciAoIGxldCBlbCBvZiB0aGlzLnJvb3QucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlY3Rpb25TZWxlY3RvcikgKSB7XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25zLnB1c2gobmV3IFNlY3Rpb24oZWwsIHRoaXMucm9vdCwgdGhpcy5fZ2V0U2VjdGlvbkRlc2NyaXB0b3IoZWwpKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTZWN0aW9uQnlTY3JvbGxUb3Aoc2Nyb2xsVG9wID0gdGhpcy5nZXRTY3JvbGxUb3AoKSkge1xuICAgICAgICBsZXQgZGVsdGEgPSAodGhpcy5kb2N1bWVudENvbnRhaW5lckhlaWdodCAqIDIwKSAvIDEwMDsvLyAyMCU7XG5cbiAgICAgICAgc2Nyb2xsVG9wICs9IGRlbHRhO1xuXG4gICAgICAgIGZvciAoIGxldCBzZWN0aW9uIG9mIHRoaXMuc2VjdGlvbnMgKSB7XG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSBzZWN0aW9uLm9mZnNldFRvcCAmJiBzY3JvbGxUb3AgPD0gc2VjdGlvbi5vZmZzZXRCb3R0b20gKSB7XG4gICAgICAgICAgICAgICAgc2VjdGlvbi5jdXJyZW50UGVyY2VudFRvcCA9ICgoTWF0aC5tYXgoc2Nyb2xsVG9wIC0gZGVsdGEgLSBzZWN0aW9uLm9mZnNldFRvcCwgMCkgKiAxMDApIC8gc2VjdGlvbi5vZmZzZXRIZWlnaHQpLyogLyAxMDAqLztcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmN1cnJlbnRSZWxhdGl2ZVRvcCA9IHNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZWN0aW9uLmN1cnJlbnRSZWxhdGl2ZVRvcCcsIHNlY3Rpb24uY3VycmVudFJlbGF0aXZlVG9wLCAnfCBzZWN0aW9uLmN1cnJlbnRQZXJjZW50VG9wJywgc2VjdGlvbi5jdXJyZW50UGVyY2VudFRvcCwgJ3wgc2VjdGlvbi5vZmZzZXRUb3AnLCBzZWN0aW9uLm9mZnNldFRvcCwgJ3wgc2Nyb2xsVG9wIC0gZGVsdGEnLCBzY3JvbGxUb3AgLSBkZWx0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZGV0ZWN0Q3VycmVudFNlY3Rpb24oc2Nyb2xsVG9wID0gdGhpcy5nZXRTY3JvbGxUb3AoKSkge1xuICAgICAgICBsZXQgY3VycmVudFNlY3Rpb24gPSB0aGlzLmdldFNlY3Rpb25CeVNjcm9sbFRvcChzY3JvbGxUb3ApO1xuXG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50U2VjdGlvbiAhPT0gY3VycmVudFNlY3Rpb24gKSB7XG4gICAgICAgICAgICBpZiAoIHRoaXMuY3VycmVudFNlY3Rpb24gKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2VjdGlvbi5zZXRBY3RpdmUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gY3VycmVudFNlY3Rpb247XG5cbiAgICAgICAgICAgIGlmICggY3VycmVudFNlY3Rpb24gKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2VjdGlvbi5zZXRBY3RpdmUodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uLm9uU2Nyb2xsKHNjcm9sbFRvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TY3JvbGwoKSB7XG4gICAgICAgIGxldCBzY3JvbGxUb3AgPSB0aGlzLmdldFNjcm9sbFRvcCgpO1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudFNlY3Rpb24gKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uLm9uU2Nyb2xsKHNjcm9sbFRvcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRldGVjdEN1cnJlbnRTZWN0aW9uKHNjcm9sbFRvcCk7XG4gICAgfVxuXG4gICAgX29uUmVzaXplKCkge1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudFNlY3Rpb24gKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uLm9uUmVzaXplKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vblNjcm9sbCgpO1xuICAgIH1cblxuICAgIGluaXRFdmVudHMoKSB7XG4gICAgICAgIHRoaXMuX29uU2Nyb2xsID0gdGhpcy5fb25TY3JvbGwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8vVE9ETzo6INC/0L7Rh9C10LzRgy3RgtC+INGN0YLQviDQvdC1INGA0LDQsdC+0YLQsNC10YIg0LIgQ2hyb21pdW1cbiAgICAgICAgLy8gdGhpcy5zY3JvbGxpbmdFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuX29uU2Nyb2xsKTtcbiAgICAgICAgLy9UT0RPOjog0L/QvtGH0LXQvNGDLdGC0L4g0Y3RgtC+INC90LUg0YDQsNCx0L7RgtCw0LXRgiDQsiBGaXJlRm94XG4gICAgICAgIC8vdGhpcy5zY3JvbGxpbmdFbGVtZW50Lm9uc2Nyb2xsID0gdGhpcy5fb25TY3JvbGw7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fb25TY3JvbGwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldERlZmF1bHRSb290KHJvb3QpIHtcbiAgICAgICAgZGVmYXVsdFJvb3QgPSByb290O1xuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByYW5kb21TdHJpbmcocHJlZml4LCBwb3N0Zml4KSB7XG4gICAgcmV0dXJuIChwcmVmaXggfHwgJycpICsgTWF0aC5hYnMoKE1hdGgucmFuZG9tKCkgKiA5ZTkpIHwgMCkudG9TdHJpbmcoMzYpICsgKHBvc3RmaXggfHwgJycpO1xufSIsImltcG9ydCB7cmFuZG9tU3RyaW5nfSBmcm9tICcuL1N0cmluZ1V0aWxzJztcbmltcG9ydCBjb250ZW50TG9hZGVkIGZyb20gJ2NvbnRlbnQtbG9hZGVkJztcblxubGV0IHNjb3BlUHNldWRvU2VsZWN0b3JCcm93c2VyU3VwcG9ydCA9IGZhbHNlO1xuXG5sZXQgdWlkID0gMDtcbmNvbnN0IHByZWZpeCA9IHJhbmRvbVN0cmluZygncmVsJyk7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbUVsZW1lbnRJZCgpIHtcbiAgICByZXR1cm4gcmFuZG9tU3RyaW5nKHByZWZpeCwgJ18nICsgKCsrdWlkKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlcGxhY2VTY29wZVNlbGVjdG9yKHNlbGVjdG9yLCBlbGVtZW50KSB7XG4gICAgaWYgKCAhZWxlbWVudCApIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgICBpZiAoIHNjb3BlUHNldWRvU2VsZWN0b3JCcm93c2VyU3VwcG9ydCApIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKC8oXnxcXHN8LCk6c2NvcGUvZywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggIWVsZW1lbnQuaWQgKSB7XG4gICAgICAgICAgICBlbGVtZW50LmlkID0gZ2V0UmFuZG9tRWxlbWVudElkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJyMnICsgZWxlbWVudC5pZDtcbiAgICB9KTtcbn1cblxuY29udGVudExvYWRlZChmdW5jdGlvbigpIHtcbiAgICBsZXQgdGVzdEVsZW1lbnRJZCA9IHJhbmRvbVN0cmluZyhwcmVmaXgsICdfMDAnKTtcbiAgICBsZXQgaW5uZXJFbGVtZW50SWQgPSByYW5kb21TdHJpbmcocHJlZml4LCAnXzAxJyk7XG4gICAgbGV0IGlubmVyQ2xhc3MgPSByYW5kb21TdHJpbmcoJ2NsJyk7XG5cbiAgICB0cnkge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgYDxzcGFuIGlkPVwiJHt0ZXN0RWxlbWVudElkfVwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+PHNwYW4gaWQ9XCIke2lubmVyRWxlbWVudElkfVwiIGNsYXNzPVwiJHtpbm5lckNsYXNzfVwiPjwvc3Bhbj48L3NwYW4+YCk7XG5cbiAgICAgICAgbGV0IHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVzdEVsZW1lbnRJZCk7XG4gICAgICAgIGxldCBpbm5lckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbm5lckVsZW1lbnRJZCk7XG4gICAgICAgIGlmICggdGVzdEVsZW1lbnQgJiYgaW5uZXJFbGVtZW50ICkge1xuICAgICAgICAgICAgaWYgKCB0ZXN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKGA6c2NvcGUgPiAuJHtpbm5lckNsYXNzfWApID09PSBpbm5lckVsZW1lbnQgKSB7XG4gICAgICAgICAgICAgICAgc2NvcGVQc2V1ZG9TZWxlY3RvckJyb3dzZXJTdXBwb3J0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaChlKXt9XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnaW50ZXJhY3RpdmUnIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gbGlzdGVuZXIoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iXX0=
