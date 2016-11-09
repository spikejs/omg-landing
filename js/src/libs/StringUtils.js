export function randomString(prefix, postfix) {
    return (prefix || '') + Math.abs((Math.random() * 9e9) | 0).toString(36) + (postfix || '');
}