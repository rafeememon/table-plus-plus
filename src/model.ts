import {
    ColumnEventListener,
    IColumn,
    ISort,
    ITableConfig,
    ITableModel,
    ObjectWithKey,
    RowEventListener,
    SelectionEventListener,
    SortEventListener,
} from "./types";

function removeFromArray<T>(elements: T[], element: T) {
    const index = elements.indexOf(element);
    if (index >= 0) {
        elements.splice(index, 1);
    }
}

export class TableModel<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableModel<Key, Row, KeyType> {

    public keyField: Key;
    public columns: Array<IColumn<Row>>;
    public selection: Set<KeyType>;
    public sort: ISort<Row> | undefined;
    public sortedRows: Row[];

    private rows: Row[];
    private rowListeners: Array<RowEventListener<Row>> = [];
    private columnListeners: Array<ColumnEventListener<Row>> = [];
    private selectionListeners: Array<SelectionEventListener<KeyType>> = [];
    private sortListeners: Array<SortEventListener<Row>> = [];

    public constructor(config: ITableConfig<Key, Row, KeyType>) {
        this.keyField = config.keyField;
        this.rows = config.rows;
        this.columns = config.columns;
        this.selection = config.selection;
        this.sort = config.sort;
        this.sortedRows = this.sortRows();
    }

    public setRows(newRows: Row[]) {
        const oldRows = this.rows;
        this.rows = newRows;
        this.sortedRows = this.sortRows();
        for (const listener of this.rowListeners) {
            listener(newRows, oldRows);
        }
    }

    public setColumns(newColumns: Array<IColumn<Row>>) {
        const oldColumns = this.columns;
        this.columns = newColumns;
        for (const listener of this.columnListeners) {
            listener(newColumns, oldColumns);
        }
    }

    public setSelection(newSelection: Set<KeyType>) {
        const oldSelection = this.selection;
        this.selection = newSelection;
        for (const listener of this.selectionListeners) {
            listener(newSelection, oldSelection);
        }
    }

    public setSort(newSort: ISort<Row> | undefined) {
        const oldSort = this.sort;
        this.sort = newSort;

        if (oldSort && newSort && oldSort.key === newSort.key && oldSort.ascending !== newSort.ascending) {
            this.sortedRows.reverse();
        } else {
            this.sortedRows = this.sortRows();
        }

        for (const listener of this.sortListeners) {
            listener(newSort, oldSort);
        }
    }

    public isSelected(row: Row) {
        return this.selection.has(row[this.keyField]);
    }

    public addRowListener(listener: RowEventListener<Row>) {
        this.rowListeners.push(listener);
    }

    public addColumnListener(listener: ColumnEventListener<Row>) {
        this.columnListeners.push(listener);
    }

    public addSelectionListener(listener: SelectionEventListener<KeyType>) {
        this.selectionListeners.push(listener);
    }

    public addSortListener(listener: SortEventListener<Row>) {
        this.sortListeners.push(listener);
    }

    public removeRowListener(listener: RowEventListener<Row>) {
        removeFromArray(this.rowListeners, listener);
    }

    public removeColumnListener(listener: ColumnEventListener<Row>) {
        removeFromArray(this.columnListeners, listener);
    }

    public removeSelectionListener(listener: SelectionEventListener<KeyType>) {
        removeFromArray(this.selectionListeners, listener);
    }

    public removeSortListener(listener: SortEventListener<Row>) {
        removeFromArray(this.sortListeners, listener);
    }

    public destroy() {
        this.rowListeners = [];
        this.columnListeners = [];
        this.selectionListeners = [];
        this.sortListeners = [];
    }

    private sortRows(): Row[] {
        const { rows, columns, sort } = this;
        if (!sort) {
            return rows;
        }
        const { key } = sort;
        const column = columns.find((c) => c.key === key);
        if (!column) {
            return rows;
        }

        const sortValues = new Map<Row, any>();
        for (const row of rows) {
            const sortValue = column.getSortValue ? column.getSortValue(row)
                : column.getData ? column.getData(row) : row[key];
            sortValues.set(row, sortValue);
        }

        const ascendingFactor = sort.ascending ? 1 : -1;
        return rows.slice(0).sort((row1, row2) => {
            const value1 = sortValues.get(row1);
            const value2 = sortValues.get(row2);
            return value1 === value2 ? 0 : value1 < value2 ? -ascendingFactor : ascendingFactor;
        });
    }

}
