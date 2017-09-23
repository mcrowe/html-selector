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
    const selectors = selectorStrings.map(Selector.make);
    const activeStates = new Set();
    const nSelectors = selectors.length;
    const parser = new htmlparser.Parser({
        onopentag(name, attr) {
            const tag = Tag.make(name, attr);
            for (const state of activeStates) {
                if (state.level > 0) {
                    state.level += 1;
                }
                if (state.level > 0) {
                    state.body += Tag.toString(tag);
                }
            }
            for (let i = 0; i < nSelectors; i++) {
                if (Selector.isMatch(selectors[i], tag)) {
                    const key = selectorStrings[i];
                    if (!map[key]) {
                        map[key] = [];
                    }
                    const state = {
                        level: 1,
                        body: Tag.toString(tag)
                    };
                    map[key].push(state);
                    activeStates.add(state);
                }
            }
        },
        ontext(text) {
            for (const state of activeStates) {
                state.body += text;
            }
        },
        onclosetag(name) {
            for (const state of activeStates) {
                const tag = Tag.make(name, {}, true);
                state.body += Tag.toString(tag);
                state.level -= 1;
                if (state.level < 1) {
                    activeStates.delete(state);
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
