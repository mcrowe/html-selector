import * as htmlparser from 'htmlparser2'


export interface IState {
  level: number
  body: string
}


export interface IMap<T> {
  [key: string]: T
}


type IAttributes = any


const OPTIONS = {
  decodeEntities: true
}


export function select(html: string, selectors: IMap<string>): IMap<string[]> {

  const map: IMap<IState[]> = {}

  const parser = new htmlparser.Parser({

    onopentag(name: string, attr: any) {
      for (let key in map) {
        for (let state of map[key]) {
          if (state.level > 0) {
            state.level += 1
          }

          if (state.level > 0) {
            state.body += makeTag(name, attr, false)
          }
        }
      }

      for (let key in selectors) {
        if (isSelectorMatch(selectors[key], name, attr)) {
          if (!map[key]) {
            map[key] = []
          }

          const state = {
            level: 1,
            body: makeTag(name, attr, false)
          }
          map[key].push(state)
        }
      }

    },

    ontext(text: string) {
      for (let key in map) {
        for (let state of map[key]) {
          if (state.level > 0) {
            state.body += text
          }
        }
      }
    },

    onclosetag(name: string) {
      for (let key in map) {
        for (let state of map[key]) {
          state.level -= 1

          if (state.level >= 0) {
            state.body += makeTag(name, {}, true)
          }
        }
      }
    }

  }, OPTIONS)

  parser.write(html)
  parser.end()

  const res: { [name: string]: string[] } = {}

  for (let key in map) {
    res[key] = map[key].map(v => v.body)
  }

  return res
}


function isSelectorMatch(selector: string, name: string, attr: IAttributes): boolean {
  if (selector[0] == '#') {
    const id = selector.slice(1)
    return id == attr.id
  }

  if (selector[0] == '.') {
    const className = selector.slice(1)
    return className == attr.class
  }

  return name == selector
}


function makeTag(name: string, attr: IAttributes, isClosing: boolean): string {
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