export interface IState {
    level: number;
    body: string;
}
export interface IMap<T> {
    [key: string]: T;
}
export declare function select(html: string, selectors: IMap<string>): IMap<string[]>;
