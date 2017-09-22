import test from 'ava'
import { select } from './index'


test('select', t => {
  const html = `<body><div></div><div id="rank">def<span>abc</span></div><div><section id="rank">toy<img class="my-image" src="hello" /> 123 </section></div></body>`

  const result = select(html, {
    rank: '#rank',
    span: 'span',
    image: '.my-image'
  })

  t.deepEqual(result, {
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
  })
})


test('select with complex selectors', t => {
  const html = `<div id="one" class="green">A</div><div id="one" class="blue"></div><span id="two" class="red"></span>`

  const result = select(html, {
    a: 'div#one.green',
    b: '#one.blue',
    c: 'span.red'
  })

  t.deepEqual(result, {
    a: [
      '<div id="one" class="green">A</div>'
    ],
    b: [
      '<div id="one" class="blue"></div>'
    ],
    c: [
      '<span id="two" class="red"></span>'
    ]
  })
})