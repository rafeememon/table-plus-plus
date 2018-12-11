import {
    ColumnEventListener,
    IColumn,
    ITableConfig,
    ITableModel,
    ObjectWithKey,
    RowEventListener,
    SelectionEventListener,
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
    public rows: Row[];
    public columns: Array<IColumn<Row>>;
    public selection: Set<KeyType>;

    private rowListeners: Array<RowEventListener<Row>> = [];
    private columnListeners: Array<ColumnEventListener<Row>> = [];
    private selectionListeners: Array<SelectionEventListener<KeyType>> = [];

    public constructor(config: ITableConfig<Key, Row, KeyType>) {
        this.keyField = config.keyField;
        this.rows = config.rows;
        this.columns = config.columns;
        this.selection = config.selection;
    }

    public setRows(newRows: Row[]) {
        const oldRows = this.rows;
        this.rows = newRows;
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

    public removeRowListener(listener: RowEventListener<Row>) {
        removeFromArray(this.rowListeners, listener);
    }

    public removeColumnListener(listener: ColumnEventListener<Row>) {
        removeFromArray(this.columnListeners, listener);
    }

    public removeSelectionListener(listener: SelectionEventListener<KeyType>) {
        removeFromArray(this.selectionListeners, listener);
    }

    public destroy() {
        this.rowListeners = [];
        this.columnListeners = [];
        this.selectionListeners = [];
    }

}
