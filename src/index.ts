import * as htmlparser from 'htmlparser2'
import * as Selector from './selector'
import * as Tag from './tag'


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


export function select(html: string, selectorStrings: string[]): IMap<string[]> {

  const map: IMap<IState[]> = {}

  const selectors = selectorStrings.map(Selector.make)

  const activeStates = new Set<IState>()

  const nSelectors = selectors.length

  const parser = new htmlparser.Parser({

    onopentag(name: string, attr: any) {
      // const tag = Tag.make(name, attr)

      for (const state of activeStates) {
        if (state.level > 0) {
          state.level += 1
        }

        if (state.level > 0) {
          state.body += Tag.toString(name, attr)
        }
      }

      for (let i = 0; i < nSelectors; i++) {
        if (Selector.isMatch(selectors[i], name, attr)) {
          const key = selectorStrings[i]

          if (!map[key]) {
            map[key] = []
          }

          const state = {
            level: 1,
            body: Tag.toString(name, attr)
          }
          map[key].push(state)

          activeStates.add(state)
        }
      }

    },

    ontext(text: string) {
      for (const state of activeStates) {
        state.body += text
      }
    },

    onclosetag(name: string) {
      for (const state of activeStates) {
        // const tag = Tag.make(name, {}, true)
        state.body += Tag.toString(name, {})
        state.level -= 1

        if (state.level < 1) {
          activeStates.delete(state)
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