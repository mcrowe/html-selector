"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function make(selectorString) {
    let type = 'tag';
    const result = {};
    for (let c of selectorString) {
        if (c == '#') {
            type = 'id';
            continue;
        }
        if (c == '.') {
            type = 'class';
            continue;
        }
        if (!result[type]) {
            result[type] = '';
        }
        result[type] += c;
    }
    return result;
}
exports.make = make;
function isMatch(selector, tag) {
    if (selector.id && selector.id != tag.attr.id) {
        return false;
    }
    if (selector.class && selector.class != tag.attr.class) {
        return false;
    }
    if (selector.tag && selector.tag != tag.name) {
        return false;
    }
    return true;
}
exports.isMatch = isMatch;
