import { ITableSectionView, ITableView, IViewConfig } from "../types";
export declare class TableView<K extends keyof R, R extends Record<K, V>, V = R[K]> implements ITableView {
    element: HTMLTableElement;
    headerView: ITableSectionView;
    bodyView: ITableSectionView;
    constructor(config: IViewConfig<K, R, V>);
    initialize(): void;
    destroy(): void;
}
