import { ITableView, IViewConfig, ObjectWithKey } from "../types";
export declare class FixedTableView<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> implements ITableView {
    element: HTMLElement;
    private headerElement;
    private headerTable;
    private bodyElement;
    private headerView;
    private bodyView;
    private domObserver;
    constructor(config: IViewConfig<K, R, V>);
    initialize(): void;
    destroy(): void;
    private handleMutation;
    private handleResize;
    private updateWidths;
    private getScrollbarWidth;
    private updateScroll;
    private scrollSelectedIntoView;
}
