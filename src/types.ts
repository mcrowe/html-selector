export interface ISelector {
  tag?: string
  id?: string
  class?: string
}


export interface ITag {
  name: string
  attr: any
  isClosing: boolean
}


export type IAttributes = any