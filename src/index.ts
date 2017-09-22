import * as htmlparser from 'htmlparser2'
import * as Selector from './selector'
import * as Tag from './tag'
import {
  ISelector
} from './types'


export interface IMap<T> {
  [key: string]: T
}


interface IState {
  level: number
  body: string
}


const OPTIONS = {
  decodeEntities: true
}


export function select(html: string, selectorStrings: IMap<string>): IMap<string[]> {

  const map: IMap<IState[]> = {}

  const selectors: IMap<ISelector> = {}

  for (let key in selectorStrings) {
    selectors[key] = Selector.make(selectorStrings[key])
  }

  const parser = new htmlparser.Parser({

    onopentag(name: string, attr: any) {

      const tag = Tag.make(name, attr)

      for (let key in map) {
        for (let state of map[key]) {

          if (state.level > 0) {
            state.level += 1
          }

          if (state.level > 0) {
            state.body += Tag.toString(tag)
          }
        }
      }

      for (let key in selectors) {
        if (Selector.isMatch(selectors[key], tag)) {
          if (!map[key]) {
            map[key] = []
          }

          const state = {
            level: 1,
            body: Tag.toString(tag)
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
            const tag = Tag.make(name, {}, true)
            state.body += Tag.toString(tag)
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