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
    const selectors = selectorStrings.map(string => ({
        string,
        selector: Selector.make(string)
    }));
    const nonIdSelectors = selectors.filter(s => !s.selector.id);
    const tagSelectors = nonIdSelectors.filter(s => !s.selector.class);
    const activeStates = new Set();
    let isSkipped = false;
    const parser = new htmlparser.Parser({
        onopentag(name, attr) {
            if (name == 'script' || name == 'style') {
                isSkipped = true;
                return;
            }
            if (activeStates.size > 0) {
                for (const state of activeStates) {
                    if (state.level > 0) {
                        state.level += 1;
                    }
                    if (state.level > 0) {
                        state.body += Tag.toString(name, attr);
                    }
                }
            }
            let selectorsToCheck;
            if (!attr.id) {
                selectorsToCheck = !attr.class ? tagSelectors : nonIdSelectors;
            }
            else {
                selectorsToCheck = selectors;
            }
            for (let i = 0; i < selectorsToCheck.length; i++) {
                if (Selector.isMatch(selectorsToCheck[i].selector, name, attr)) {
                    const key = selectorsToCheck[i].string;
                    if (!map[key]) {
                        map[key] = [];
                    }
                    const state = {
                        level: 1,
                        body: Tag.toString(name, attr)
                    };
                    map[key].push(state);
                    activeStates.add(state);
                }
            }
        },
        ontext(text) {
            if (isSkipped) {
                return;
            }
            // performance optimization
            if (activeStates.size == 0) {
                return;
            }
            for (const state of activeStates) {
                state.body += text;
            }
        },
        onclosetag(name) {
            if (isSkipped && (name == 'script' || name == 'style')) {
                isSkipped = false;
            }
            // performance optimization
            if (activeStates.size == 0) {
                return;
            }
            for (const state of activeStates) {
                state.body += Tag.toString(name, {}, true);
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
