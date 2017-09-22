import {
  ISelector,
  ITag
} from './types'


export function parse(selector: string): ISelector {
  let type = 'tag'

  const result: ISelector = {}

  for (let c of selector) {

    if (c == '#') {
      type = 'id'
      continue
    }

    if (c == '.') {
      type = 'class'
      continue
    }

    if (!result[type]) {
      result[type] = ''
    }

    result[type] += c
  }

  return result
}


export function isMatch(selector: string, tag: ITag): boolean {
  const sel = parse(selector)

  if (sel.id && sel.id != tag.attr.id) {
    return false
  }

  if (sel.class && sel.class != tag.attr.class) {
    return false
  }

  if (sel.tag && sel.tag != tag.name) {
    return false
  }

  return true

}