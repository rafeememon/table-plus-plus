import { ITableView, IViewConfig, ObjectWithKey } from "../types";
export declare class TableView<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ITableView {
    element: HTMLTableElement;
    private headerView;
    private bodyView;
    constructor(config: IViewConfig<Key, Row, KeyType>);
    initialize(): void;
    destroy(): void;
}
