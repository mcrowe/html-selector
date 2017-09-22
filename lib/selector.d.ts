import { ISelector, ITag } from './types';
export declare function parse(selector: string): ISelector;
export declare function isMatch(selector: string, tag: ITag): boolean;
