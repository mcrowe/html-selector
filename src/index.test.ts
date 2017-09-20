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