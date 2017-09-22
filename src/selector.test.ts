import test from 'ava'
import { parse, isMatch } from './selector'
import * as Tag from './tag'


test('parse', t => {

  t.deepEqual(
    parse('span'),
    {
      tag: 'span'
    }
  )

  t.deepEqual(
    parse('#span'),
    {
      id: 'span'
    }
  )

  t.deepEqual(
    parse('span#one.blue'),
    {
      tag: 'span',
      id: 'one',
      class: 'blue'
    }
  )
})



test('isMatch', t => {

  t.is(
    isMatch(
      '.blue',
      Tag.make('div', {class: 'blue'})
    ),
    true
  )

  t.is(
    isMatch(
      'span#one',
      Tag.make('div', {id: 'one'})
    ),
    false
  )

  t.is(
    isMatch(
      '#one.green',
      Tag.make('div', {id: 'one', class: 'green'})
    ),
    true
  )

})