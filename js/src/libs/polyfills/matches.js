"use strict";

import {randomString} from '../StringUtils';

if ( typeof Element !== 'undefined' && !Element.prototype.matches ) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector || proto.msMatchesSelector ||
        proto.oMatchesSelector || proto.webkitMatchesSelector;

    if ( !proto.matches ) {
        proto.matches = function(selector) {
            let randomClass = this.__randomClass || randomString('rc');
            this.__randomClass = randomClass;

            this.classList.add(randomClass);

            selector = selector.trim() + '.' + randomClass;

            for ( let el of document.querySelectorAll(selector) ) {
                if ( el === this ) {
                    return true;
                }
            }

            return false;
        }
    }
}