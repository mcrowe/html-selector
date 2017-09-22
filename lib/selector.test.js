"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const selector_1 = require("./selector");
const Tag = require("./tag");
ava_1.default('parse', t => {
    t.deepEqual(selector_1.parse('span'), {
        tag: 'span'
    });
    t.deepEqual(selector_1.parse('#span'), {
        id: 'span'
    });
    t.deepEqual(selector_1.parse('span#one.blue'), {
        tag: 'span',
        id: 'one',
        class: 'blue'
    });
});
ava_1.default('isMatch', t => {
    t.is(selector_1.isMatch('.blue', Tag.make('div', { class: 'blue' })), true);
    t.is(selector_1.isMatch('span#one', Tag.make('div', { id: 'one' })), false);
    t.is(selector_1.isMatch('#one.green', Tag.make('div', { id: 'one', class: 'green' })), true);
});
