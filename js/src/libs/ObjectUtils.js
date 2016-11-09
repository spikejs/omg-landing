export function isCallbable(fun) {
    if ( !fun ) {
        return false;
    }

    return typeof fun === 'function';
}

export function extend(target, ...sources) {
    for ( let source of sources ) {
        if ( source !== void 0 && source !== null ) {
            for ( var prop in source ) if ( source.hasOwnProperty(prop) ) {
                target[prop] = source[prop];
            }
        }
    }

    return target;
}

export function mixin(target, ...sources) {
    for ( let source of sources ) {
        if ( source !== void 0 && source !== null ) {
            Object.defineProperties(target, Object.keys(source).reduce((descriptors, key) => {
                descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
                return descriptors;
            }, {}));
        }
    }

    return target;
}

var sInCloneState = Symbol('clonning');
/**
 * Функция для клонирование объекта
 * @param obj
 * @param options
 *    options.deep: true - клонировать внутренние объекты
 *    options.allowSelfLink: false - разрешить ссылаться на себя (циклическая ссылка)
 *    options.applyConstructor: false - применять конструктор для вновь клонированного объекта
 * @returns {*}
 */
export function clone(obj, options) {
    if ( obj === null || (typeof obj  !== 'object' && typeof obj  !== 'function') ) {
        return obj;
    }

    options = options || {};
    var deep = options.deep === void 0 ? true : !!options.deep;
    var allowSelfLink = options.allowSelfLink === void 0 ? false : !!options.allowSelfLink;
    var applyConstructor = options.applyConstructor === void 0 ? false : !!options.applyConstructor;

    if ( obj[sInCloneState] === true ) {
        if ( allowSelfLink ) {
            return obj;
        }
        else {
            throw new Error('Self-link while cloning is not allowed');
        }
    }

    var newObj;
    // TODO:: add Symbol.species support
    if ( obj instanceof Date ) {
        newObj = new Date(obj);
    }
    else if ( obj instanceof Array ) {
        newObj = new Array(obj.length);
    }
    else {
        newObj = Object.create(obj.__proto__);
        if ( applyConstructor ) {
            obj.constructor.call(newObj);
        }
    }

    for ( var i = 0, array = Object.keys(obj), len = array.length ; i < len ; i++ ) {
        var key = array[i];
        var value = obj[key];

        if ( deep && value && (typeof value === 'object' || typeof value === 'function') ) {
            obj[sInCloneState] = true;
            if ( !value[sInCloneState] ) {
                value = clone(value, options);
            }
            delete obj[sInCloneState];
        }

        newObj[key] = value;
    }

    return newObj;
}

export function purgeObject(obj) {
    if ( !obj || typeof obj !== 'object' ) {
        return obj;
    }

    for ( let propName of Object.keys(obj) ) {
        let prop = obj[propName];
        let type = typeof prop;

        if ( type === 'string' ) {
            obj[propName] = '';
        }
        else if ( type === 'object' ) {
            obj[propName] = null;
        }
        else if ( type === 'number' ) {
            // nothing
        }
        else if ( type === 'function' ) {
            obj[propName] = function(){};
        }
        else {
            obj[propName] = void 0;
        }
    }

    return obj;
}
