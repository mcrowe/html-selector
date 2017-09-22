export interface IMap<T> {
    [key: string]: T;
}
export declare function select(html: string, selectorStrings: IMap<string>): IMap<string[]>;
