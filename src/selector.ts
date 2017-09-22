import {
  ISelector,
  ITag
} from './types'


export function make(selectorString: string): ISelector {
  let type = 'tag'

  const result: ISelector = {}

  for (let c of selectorString) {

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


export function isMatch(selector: ISelector, tag: ITag): boolean {
  if (selector.id && selector.id != tag.attr.id) {
    return false
  }

  if (selector.class && selector.class != tag.attr.class) {
    return false
  }

  if (selector.tag && selector.tag != tag.name) {
    return false
  }

  return true
}