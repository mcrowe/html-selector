"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function make(name, attr, isClosing = false) {
    return {
        name,
        attr,
        isClosing
    };
}
exports.make = make;
function toString(name, attr, isClosing = false) {
    let str = '';
    if (isClosing) {
        str += '</';
    }
    else {
        str += '<';
    }
    str += name;
    for (let key in attr) {
        str += ` ${key}="${attr[key]}"`;
    }
    str += '>';
    return str;
}
exports.toString = toString;
