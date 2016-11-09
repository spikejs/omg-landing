export function debounce(func, ms, _this) {
    let isThisDefault = _this === void 0;
    let state = null;
    let COOLDOWN = 1;

    return function() {
        if ( state ) {
            return;
        }

        func.apply(isThisDefault ? this : _this, arguments);

        state = COOLDOWN;

        setTimeout(function() {
            state = null;
        }, ms);
    }

}