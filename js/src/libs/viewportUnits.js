let _isSupported = void 0;
function isSupported() {
    if ( _isSupported !== void 0 ) {
        return _isSupported;
    }

    // http://caniuse.com/#feat=viewport-units
    if ( typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ) {
        _isSupported = CSS.supports('height', '1vmin');
    }
    else {
        _isSupported = false;
    }

    return _isSupported;
}

let _isSupportedVmax = void 0;
function isSupportedVmax() {
    if ( _isSupportedVmax !== void 0 ) {
        return _isSupportedVmax;
    }

    // http://caniuse.com/#feat=viewport-units
    // IE and EDGE:: Partial support refers to not supporting the "vmax" unit.
    if ( typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ) {
        _isSupportedVmax = CSS.supports('height', '1vmax');
    }
    else {
        _isSupportedVmax = false;
    }

    return _isSupportedVmax;
}

function getScreenWidth() {
    return window.innerWidth;
}
function getScreenHeight() {
    return window.innerHeight;
}
function isScreenPortrait() {
    return getScreenHeight() > getScreenWidth();
}

function calcVW(unitValue, returnAsPx) {
    let value =  unitValue * (getScreenWidth() / 100);

    if ( returnAsPx ) {
        return pxString(value);
    }
    return value;
}

function calcVH(unitValue, returnAsPx) {
    let value = unitValue * (getScreenHeight() / 100);

    if ( returnAsPx ) {
        return pxString(value);
    }
    return value;
}

function calcVMin(unitValue, returnAsPx) {
    let screenHeight = getScreenHeight();
    let screenWidth = getScreenWidth();
    let value;

    if ( screenHeight < screenWidth ) {
        value = unitValue * (screenHeight / 100);
    }
    else {
        value = unitValue * (screenWidth / 100);
    }

    if ( returnAsPx ) {
        return pxString(value);
    }
    return value;
}

function calcVMax(unitValue, returnAsPx) {
    let screenHeight = getScreenHeight();
    let screenWidth = getScreenWidth();
    let value;

    if ( screenHeight > screenWidth ) {
        value = unitValue * (screenHeight / 100);
    }
    else {
        value = unitValue * (screenWidth / 100);
    }

    if ( returnAsPx ) {
        return pxString(value);
    }
    return value;
}

function calc(unitValueString, returnAsPx) {
    let unitValue = parseFloat(unitValueString);

    if ( isNaN(unitValue) ) {
        return;
    }

    if ( /vw$/.test(unitValueString) ) {
        return calcVW(unitValue, returnAsPx);
    }

    if ( /vh$/.test(unitValueString) ) {
        return calcVH(unitValue, returnAsPx);
    }

    if ( /vmin$/.test(unitValueString) ) {
        return calcVMin(unitValue, returnAsPx);
    }

    if ( /vmax$/.test(unitValueString) ) {
        return calcVMax(unitValue, returnAsPx);
    }
}

function pxString(number) {
    if ( typeof number !== 'number' ) {
        number = parseFloat(number);
    }

    // Обрезаем лишние знаки после запятой
    let floatNumber = Number(number.toFixed(6));

    return floatNumber + 'px';
}

export default {
    getScreenWidth,
    getScreenHeight,
    isScreenPortrait,
    isSupported,
    isSupportedVmax,
    calcVW,
    calcVH,
    calcVMin,
    calcVMax,
    calc,
    pxString,
}