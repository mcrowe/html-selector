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

  const selectors = selectorStrings.map(string => ({
    string,
    selector: Selector.make(string)
  }))


  const nonIdSelectors = selectors.filter(s => !s.selector.id)
  const tagSelectors = nonIdSelectors.filter(s => !s.selector.class)

  const activeStates = new Set<IState>()

  let isSkipped = false

  const parser = new htmlparser.Parser({

    onopentag(name: string, attr: any) {
      if (name == 'script' || name == 'style') {
        isSkipped = true
        return
      }

      if (activeStates.size > 0) { // performance optimization
        for (const state of activeStates) {
          if (state.level > 0) {
            state.level += 1
          }

          if (state.level > 0) {
            state.body += Tag.toString(name, attr)
          }
        }
      }

      let selectorsToCheck
      if (!attr.id) {
        selectorsToCheck = !attr.class ? tagSelectors : nonIdSelectors
      } else {
        selectorsToCheck = selectors
      }

      for (let i = 0; i < selectorsToCheck.length; i++) {

        if (Selector.isMatch(selectorsToCheck[i].selector, name, attr)) {
          const key = selectorsToCheck[i].string

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
      if (isSkipped) {
        return
      }

      // performance optimization
      if (activeStates.size == 0) {
        return
      }

      for (const state of activeStates) {
        state.body += text
      }
    },

    onclosetag(name: string) {
      if (isSkipped && (name == 'script' || name == 'style')) {
        isSkipped = false
      }

      // performance optimization
      if (activeStates.size == 0) {
        return
      }

      for (const state of activeStates) {
        state.body += Tag.toString(name, {}, true)
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