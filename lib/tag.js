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
function toString(tag) {
    let str = '';
    if (tag.isClosing) {
        str += '</';
    }
    else {
        str += '<';
    }
    str += tag.name;
    for (let key in tag.attr) {
        str += ` ${key}="${tag.attr[key]}"`;
    }
    str += '>';
    return str;
}
exports.toString = toString;
