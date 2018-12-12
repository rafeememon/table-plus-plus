export type ObjectWithKey<K extends string | number | symbol, V> = { [T in K]: V };

export interface IColumn<Row> {
    key: keyof Row;
    label: string;
    // Get data for both display and sort ordering.
    getData?(row: Row): string;
    // Display data with no impact on sort ordering.
    displayData?(row: Row): string | Node;
}

export interface ITableConfig<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    keyField: Key;
    rows: Row[];
    columns: Array<IColumn<Row>>;
    selection: Set<KeyType>;
}

export type RowEventListener<Row> = (newRows: Row[], oldRows: Row[]) => void;
export type ColumnEventListener<Row> = (newColumns: Array<IColumn<Row>>, oldColumns: Array<IColumn<Row>>) => void;
export type SelectionEventListener<KeyType> = (newSelection: Set<KeyType>, oldSelection: Set<KeyType>) => void;

export interface ITableModel<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    readonly keyField: Key;
    readonly rows: Row[];
    readonly columns: Array<IColumn<Row>>;
    readonly selection: Set<KeyType>;
    setRows(newRows: Row[]): void;
    setColumns(newColumns: Array<IColumn<Row>>): void;
    setSelection(newSelection: Set<KeyType>): void;
    isSelected(row: Row): boolean;
    addRowListener(listener: RowEventListener<Row>): void;
    addColumnListener(listener: ColumnEventListener<Row>): void;
    addSelectionListener(listener: SelectionEventListener<KeyType>): void;
    removeRowListener(listener: RowEventListener<Row>): void;
    removeColumnListener(listener: ColumnEventListener<Row>): void;
    removeSelectionListener(listener: SelectionEventListener<KeyType>): void;
    destroy(): void;
}

export type RowClickHandler = (event: MouseEvent, rowIndex: number) => void;

export interface IViewConfig<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    model: ITableModel<Key, Row, KeyType>;
    onClickRow: RowClickHandler;
}

export interface ITableView {
    readonly element: HTMLElement;
    setRowClickHandler(handler: RowClickHandler): void;
    destroy(): void;
}

export type SelectionMode = "none" | "single" | "multi";

export type SelectionHandler<KeyType> = (newSelection: Set<KeyType>) => void;

export interface ISelectionAdapter {
    handleRowClick: RowClickHandler;
}
