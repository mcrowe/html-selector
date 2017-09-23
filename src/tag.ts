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


export function toString(name: string, attr: IAttributes, isClosing: boolean = false): string {
  let str = ''

  if (isClosing) {
    str += '</'
  } else {
    str += '<'
  }

  str += name

  for (let key in attr) {
    str += ` ${key}="${attr[key]}"`
  }

  str += '>'

  return str
}