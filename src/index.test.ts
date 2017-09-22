import test from 'ava'
import * as fs from 'fs'
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


test('select performance', t => {
  const html = fs.readFileSync(__dirname + '/../fixtures/big.html', {encoding: 'utf8'})

  const selectors = [
    '#SalesRank',
    '#prodDetails',
    '#actualPriceValue',
    '#priceblock_ourprice',
    '#priceblock_saleprice',
    '#priceBlock',
    '#buyNewSection',
    '#priceblock_dealprice',
    '#prerderDelaySection',
    '#mocaSubtotal',
    '#tmmSwatches',
    '#mediaTab_content_landing',
    '#unqualifiedBuyBox',
    '#averageCustomerReviews',
    '.reviewCountTextLinkedHistogram',
    '#merchant-info',
    '#availability_feature_div',
    '#mocaBBSoldByAndShipsFrom',
    '#olp_feature_div',
    '#moreBuyingChoices_feature_div',
    '#usedbuyBox',
    'a.a-link-normal.contributorNameID',
    '.author'
  ]

  const t0 = Date.now()

  for (let i = 0; i < 10; i++) {
    select(html, keyMap(selectors))
  }

  const dt = Date.now() - t0

  t.is(
    dt < 750,
    true,
    `Expected to select in less than 750ms, but took ${dt}ms.`
  )

})


function keyMap(values: string[]) {
  const res = {}

  for (let value of values) {
    res[value] = value
  }

  return res
}