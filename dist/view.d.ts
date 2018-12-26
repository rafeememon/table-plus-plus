import { ITableView, IViewConfig, ObjectWithKey } from "./types";
export declare class TableView<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ITableView {
    element: HTMLTableElement;
    private model;
    private rowClickHandler;
    private headerClickHandler;
    private theadTrElement;
    private tbodyElement;
    private headerElements;
    private rowElements;
    constructor(config: IViewConfig<Key, Row, KeyType>);
    destroy(): void;
    private handleRowsChanged;
    private handleColumnsChanged;
    private handleSelectionChanged;
    private handleSortChanged;
    private handleClick;
    private renderThead;
    private createHeaderElement;
    private renderTbody;
    private createRowElement;
    private decorateRowElement;
    private decorateHeaderElement;
}
