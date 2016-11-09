//cubic-bezier timing function

function createTimingFunction(q, w, e, r) {
    console.log(123);
    function b(d, g, i, h) {
        this.b = {x:d, y:g};
        this.c = {x:i, y:h};
    }
    function c(d, g, i) {
        var h = 3 * g, g = 3 * (i - g) - h;
        return (((1 - h - g) * d + g) * d + h) * d;
    }
    b.prototype.get = function(d) {
        var g = this;
        if (0 == d || 1 == d) {
            return {x:d, y:d};
        }
        if (!(0 < d) || !(1 > d)) {
            throw new RangeError;
        }
        return {x:c(d, g.b.x, g.c.x), y:c(d, g.b.y, g.c.y)};
    };
    return new b(q, w, e, r);
}

const cubicBezier = createTimingFunction(1, 1, 1, 1);

export default cubicBezier;
