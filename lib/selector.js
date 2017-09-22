"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parse(selector) {
    let type = 'tag';
    const result = {};
    for (let c of selector) {
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
exports.parse = parse;
function isMatch(selector, tag) {
    const sel = parse(selector);
    if (sel.id && sel.id != tag.attr.id) {
        return false;
    }
    if (sel.class && sel.class != tag.attr.class) {
        return false;
    }
    if (sel.tag && sel.tag != tag.name) {
        return false;
    }
    return true;
}
exports.isMatch = isMatch;
