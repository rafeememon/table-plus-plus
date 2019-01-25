export type ObjectWithKey<K extends string | number | symbol, V> = { [T in K]: V };

export interface IColumn<Row> {
    key: keyof Row;
    label: string;
    // Used for displaying only; overrides getSortableText if both specified.
    getText?(row: Row): string;
    // Used for sorting only; overrides getSortableText if both specified.
    getSortValue?(row: Row): any;
    // Used for both displaying and sorting.
    getSortableText?(row: Row): string;
    // If specified, renders a link.
    getHref?(row: Row): string;
    // If specified, skips the default row click handler.
    onClick?(row: Row): void;
}

export interface ISort<Row> {
    key: keyof Row;
    ascending: boolean;
}

export interface ITableConfig<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    keyField: Key;
    rows: Row[];
    columns: Array<IColumn<Row>>;
    selection?: Set<KeyType>;
    sort?: ISort<Row>;
}

export type RowEventListener<Row> = (newRows: Row[], oldRows: Row[]) => void;
export type ColumnEventListener<Row> = (newColumns: Array<IColumn<Row>>, oldColumns: Array<IColumn<Row>>) => void;
export type SelectionEventListener<KeyType> = (newSelection: Set<KeyType>, oldSelection: Set<KeyType>) => void;
export type SortEventListener<Row> = (newSort: ISort<Row> | undefined, oldSort: ISort<Row> | undefined) => void;

export interface ITableModel<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    readonly keyField: Key;
    readonly columns: Array<IColumn<Row>>;
    readonly selection: Set<KeyType>;
    readonly sort: ISort<Row> | undefined;
    readonly sortedRows: Row[];
    setRows(newRows: Row[]): void;
    setColumns(newColumns: Array<IColumn<Row>>): void;
    setSelection(newSelection: Set<KeyType>): void;
    setSort(newSort: ISort<Row> | undefined): void;
    isSelected(row: Row): boolean;
    addRowListener(listener: RowEventListener<Row>): void;
    addColumnListener(listener: ColumnEventListener<Row>): void;
    addSelectionListener(listener: SelectionEventListener<KeyType>): void;
    addSortListener(listener: SortEventListener<Row>): void;
    removeRowListener(listener: RowEventListener<Row>): void;
    removeColumnListener(listener: ColumnEventListener<Row>): void;
    removeSelectionListener(listener: SelectionEventListener<KeyType>): void;
    removeSortListener(listener: SortEventListener<Row>): void;
    destroy(): void;
}

export type RowClickHandler = (event: MouseEvent, rowIndex: number) => void;
export type HeaderClickHandler = (event: MouseEvent, headerIndex: number) => void;

export interface IViewConfig<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    model: ITableModel<Key, Row, KeyType>;
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

export type SelectionMode = "none" | "single" | "multi";

export type SelectionHandler<KeyType> = (newSelection: Set<KeyType>) => void;

export interface ISelectionAdapter {
    handleRowClick: RowClickHandler;
}

export type SortHandler<Row> = (newSort: ISort<Row>) => void;

export interface ISortAdapter {
    handleHeaderClick: HeaderClickHandler;
}
