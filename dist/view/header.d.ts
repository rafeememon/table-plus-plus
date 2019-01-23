import { HeaderClickHandler, ITableModel, ITableSectionView, ObjectWithKey } from "../types";
export declare const SORT_ARROW_CLASSNAME = "tpp-sort-arrow";
export declare class TableHeaderView<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ITableSectionView {
    private model;
    private clickHandler;
    element: HTMLTableSectionElement;
    private thElements;
    constructor(model: ITableModel<Key, Row, KeyType>, clickHandler: HeaderClickHandler);
    destroy(): void;
    private handleColumnsChanged;
    private handleSortChanged;
    private handleClick;
    private rerender;
    private createTheadElement;
    private destroyTheadElement;
    private createThElement;
    private decorateThElement;
}
