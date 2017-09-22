"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser = require("htmlparser2");
const Selector = require("./selector");
const Tag = require("./tag");
const OPTIONS = {
    decodeEntities: true
};
function select(html, selectorStrings) {
    const map = {};
    const selectors = {};
    for (let key in selectorStrings) {
        selectors[key] = Selector.make(selectorStrings[key]);
    }
    const parser = new htmlparser.Parser({
        onopentag(name, attr) {
            const tag = Tag.make(name, attr);
            for (let key in map) {
                for (let state of map[key]) {
                    if (state.level > 0) {
                        state.level += 1;
                    }
                    if (state.level > 0) {
                        state.body += Tag.toString(tag);
                    }
                }
            }
            for (let key in selectors) {
                if (Selector.isMatch(selectors[key], tag)) {
                    if (!map[key]) {
                        map[key] = [];
                    }
                    const state = {
                        level: 1,
                        body: Tag.toString(tag)
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
                        const tag = Tag.make(name, {}, true);
                        state.body += Tag.toString(tag);
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
