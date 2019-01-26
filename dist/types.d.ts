export declare type ObjectWithKey<K extends string | number | symbol, V> = {
    [T in K]: V;
};
export interface IColumn<R> {
    key: string;
    label?: string;
    getText?(row: R): string;
    getSortValue?(row: R): any;
    getSortableText?(row: R): string;
    getHref?(row: R): string;
    onClick?(row: R): void;
}
export interface ISort {
    key: string;
    ascending: boolean;
}
export interface ITableConfig<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> {
    keyField: K;
    rows: R[];
    columns: Array<IColumn<R>>;
    selection?: Set<V>;
    sort?: ISort;
}
export declare type RowEventListener<R> = (newRows: R[], oldRows: R[]) => void;
export declare type ColumnEventListener<R> = (newColumns: Array<IColumn<R>>, oldColumns: Array<IColumn<R>>) => void;
export declare type SelectionEventListener<V> = (newSelection: Set<V>, oldSelection: Set<V>) => void;
export declare type SortEventListener = (newSort: ISort | undefined, oldSort: ISort | undefined) => void;
export interface ITableModel<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> {
    readonly keyField: K;
    readonly columns: Array<IColumn<R>>;
    readonly selection: Set<V>;
    readonly sort: ISort | undefined;
    readonly sortedRows: R[];
    setRows(newRows: R[]): void;
    setColumns(newColumns: Array<IColumn<R>>): void;
    setSelection(newSelection: Set<V>): void;
    setSort(newSort: ISort | undefined): void;
    isSelected(row: R): boolean;
    addRowListener(listener: RowEventListener<R>): void;
    addColumnListener(listener: ColumnEventListener<R>): void;
    addSelectionListener(listener: SelectionEventListener<V>): void;
    addSortListener(listener: SortEventListener): void;
    removeRowListener(listener: RowEventListener<R>): void;
    removeColumnListener(listener: ColumnEventListener<R>): void;
    removeSelectionListener(listener: SelectionEventListener<V>): void;
    removeSortListener(listener: SortEventListener): void;
    destroy(): void;
}
export declare type RowClickHandler = (event: MouseEvent, rowIndex: number) => void;
export declare type HeaderClickHandler = (event: MouseEvent, headerIndex: number) => void;
export interface IViewConfig<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> {
    model: ITableModel<K, R, V>;
    onClickRow: RowClickHandler;
    onClickHeader: HeaderClickHandler;
}
export interface ITableView {
    readonly element: HTMLElement;
    initialize(): void;
    destroy(): void;
}
export interface ITableSectionView {
    readonly element: HTMLElement;
    destroy(): void;
}
export declare type SelectionMode = "none" | "single" | "multi";
export declare type SelectionHandler<V> = (newSelection: Set<V>) => void;
export interface ISelectionAdapter {
    handleRowClick: RowClickHandler;
}
export declare type SortHandler = (newSort: ISort) => void;
export interface ISortAdapter {
    handleHeaderClick: HeaderClickHandler;
}
