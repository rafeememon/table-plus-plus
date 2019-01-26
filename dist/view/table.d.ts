import { ITableSectionView, ITableView, IViewConfig, ObjectWithKey } from "../types";
export declare class TableView<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> implements ITableView {
    element: HTMLTableElement;
    headerView: ITableSectionView;
    bodyView: ITableSectionView;
    constructor(config: IViewConfig<K, R, V>);
    initialize(): void;
    destroy(): void;
}
