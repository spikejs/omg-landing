if ( typeof Symbol !== 'undefined' && Symbol.iterator ) {
    if ( typeof NodeList !== 'undefined' && !NodeList.prototype[Symbol.iterator] ) {
        NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    }
}


