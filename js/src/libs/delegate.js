export default function delegate(e, f) {
    return function(c, b, a) {
        for (a = c.target;a && !1 !== b && a != this;a = a.parentElement) {
            a.matchesSelector(e) && (b = f.call(a, c));
        }
        return b;
    };
}