"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser = require("htmlparser2");
const OPTIONS = {
    decodeEntities: true
};
function select(html, selectors) {
    const map = {};
    const parser = new htmlparser.Parser({
        onopentag(name, attr) {
            for (let key in map) {
                for (let state of map[key]) {
                    if (state.level > 0) {
                        state.level += 1;
                    }
                    if (state.level > 0) {
                        state.body += makeTag(name, attr, false);
                    }
                }
            }
            for (let key in selectors) {
                if (isSelectorMatch(selectors[key], name, attr)) {
                    if (!map[key]) {
                        map[key] = [];
                    }
                    const state = {
                        level: 1,
                        body: makeTag(name, attr, false)
                    };
                    map[key].push(state);
                }
            }
        },
        ontext(text) {
            for (let key in map) {
                for (let state of map[key]) {
                    if (state.level > 0) {
                        state.body += text;
                    }
                }
            }
        },
        onclosetag(name) {
            for (let key in map) {
                for (let state of map[key]) {
                    state.level -= 1;
                    if (state.level >= 0) {
                        state.body += makeTag(name, {}, true);
                    }
                }
            }
        }
    }, OPTIONS);
    parser.write(html);
    parser.end();
    const res = {};
    for (let key in map) {
        res[key] = map[key].map(v => v.body);
    }
    return res;
}
exports.select = select;
function isSelectorMatch(selector, name, attr) {
    if (selector[0] == '#') {
        const id = selector.slice(1);
        return id == attr.id;
    }
    if (selector[0] == '.') {
        const className = selector.slice(1);
        return className == attr.class;
    }
    return name == selector;
}
function makeTag(name, attr, isClosing) {
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
