import { ITableView, IViewConfig, ObjectWithKey } from "../types";
export declare class FixedTableView<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ITableView {
    element: HTMLElement;
    private headerElement;
    private headerTable;
    private bodyElement;
    private headerView;
    private bodyView;
    private domObserver;
    constructor(config: IViewConfig<Key, Row, KeyType>);
    initialize(): void;
    destroy(): void;
    private handleMutation;
    private handleResize;
    private updateWidths;
    private getScrollbarWidth;
    private updateScroll;
    private scrollSelectedIntoView;
}
