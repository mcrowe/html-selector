import {
  ITag,
  IAttributes
} from './types'


export function make(name: string, attr: IAttributes, isClosing: boolean = false): ITag {
  return {
    name,
    attr,
    isClosing
  }
}


export function toString(tag: ITag): string {
  let str = ''

  if (tag.isClosing) {
    str += '</'
  } else {
    str += '<'
  }

  str += tag.name

  for (let key in tag.attr) {
    str += ` ${key}="${tag.attr[key]}"`
  }

  str += '>'

  return str
}