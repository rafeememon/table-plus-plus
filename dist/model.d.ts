import { ColumnEventListener, IColumn, ISort, ITableConfig, ITableModel, ObjectWithKey, RowEventListener, SelectionEventListener, SortEventListener } from "./types";
export declare class TableModel<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ITableModel<Key, Row, KeyType> {
    keyField: Key;
    columns: Array<IColumn<Row>>;
    selection: Set<KeyType>;
    sort: ISort<Row> | undefined;
    sortedRows: Row[];
    private rows;
    private rowListeners;
    private columnListeners;
    private selectionListeners;
    private sortListeners;
    constructor(config: ITableConfig<Key, Row, KeyType>);
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
    private sortRows;
}
