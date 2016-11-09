import {randomString} from './StringUtils';
import contentLoaded from 'content-loaded';

let scopePseudoSelectorBrowserSupport = false;

let uid = 0;
const prefix = randomString('rel');

function getRandomElementId() {
    return randomString(prefix, '_' + (++uid));
}

export default function replaceScopeSelector(selector, element) {
    if ( !element ) {
        return selector;
    }
    if ( scopePseudoSelectorBrowserSupport ) {
        return selector;
    }

    return selector.replace(/(^|\s|,):scope/g, function() {
        if ( !element.id ) {
            element.id = getRandomElementId();
        }

        return '#' + element.id;
    });
}

contentLoaded(function() {
    let testElementId = randomString(prefix, '_00');
    let innerElementId = randomString(prefix, '_01');
    let innerClass = randomString('cl');

    try {
        document.documentElement.insertAdjacentHTML('afterbegin', `<span id="${testElementId}" style="display:none"><span id="${innerElementId}" class="${innerClass}"></span></span>`);

        let testElement = document.getElementById(testElementId);
        let innerElement = document.getElementById(innerElementId);
        if ( testElement && innerElement ) {
            if ( testElement.querySelector(`:scope > .${innerClass}`) === innerElement ) {
                scopePseudoSelectorBrowserSupport = true;
            }
        }
    }
    catch(e){}
});