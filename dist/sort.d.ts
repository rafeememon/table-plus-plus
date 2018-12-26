import { ISortAdapter, ITableModel, ObjectWithKey, SortHandler } from "./types";
export declare class SortAdapter<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ISortAdapter {
    private model;
    private handler;
    constructor(model: ITableModel<Key, Row, KeyType>, handler: SortHandler<Row>);
    handleHeaderClick: (_event: MouseEvent, headerIndex: number) => void;
}
export declare function sortBy<T>(elements: T[], getSortValue: (element: T) => any, ascending: boolean): T[];
