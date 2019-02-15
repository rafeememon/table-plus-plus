import { ISortAdapter, ITableModel, SortHandler } from "./types";
export declare class SortAdapter<K extends keyof R, R extends Record<K, V>, V = R[K]> implements ISortAdapter {
    private model;
    private handler;
    constructor(model: ITableModel<K, R, V>, handler: SortHandler);
    handleHeaderClick: (_event: MouseEvent, headerIndex: number) => void;
}
export declare function sortBy<T>(elements: T[], getSortValue: (element: T) => any, ascending: boolean): T[];
