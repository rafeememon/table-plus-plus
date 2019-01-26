import { HeaderClickHandler, ITableModel, ITableSectionView, ObjectWithKey } from "../types";
export declare const SORT_ARROW_CLASSNAME = "tpp-sort-arrow";
export declare class TableHeaderView<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> implements ITableSectionView {
    private model;
    private clickHandler;
    element: HTMLTableSectionElement;
    private thElements;
    constructor(model: ITableModel<K, R, V>, clickHandler: HeaderClickHandler);
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
