import { ISelector, ITag } from './types';
export declare function make(selectorString: string): ISelector;
export declare function isMatch(selector: ISelector, tag: ITag): boolean;
