# html-selector

Select chunks of html documents using css selectors. This can be much more performant than alternatives like [cheerio](https://github.com/cheeriojs/cheerio) because it grabs all the chunks on a single pass through the document, and doesn't need to produce a virtual document in memory for later querying.

## Usage

> npm install @mcrowe/html-selector --save

```js
import HtmlSelector from '@mcrowe/html-selector'

const html = `<body><div></div><div id="rank">def<span>abc</span></div><div><section id="rank">toy<img class="my-image" src="hello" /> 123 </section></div></body>`

const result = select(html, {
  rank: '#rank',
  span: 'span',
  image: '.my-image'
})

// =>

{
  rank: [
    '<div id="rank">def<span>abc</span></div>',
    '<section id="rank">toy<img class="my-image" src="hello"></img> 123 </section>'
  ],
  span: [
    '<span>abc</span>'
  ],
  image: [
    '<img class="my-image" src="hello"></img>'
  ]
}
```

See `src/index.test.ts` for more examples.

## Development

Install npm modules:

> npm install

Run tests:

> npm test

## Release

Release a new version:

> bin/release.sh

This will publish a new version to npm, as well as push a new tag up to github.
