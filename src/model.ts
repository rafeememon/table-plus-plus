import { sortBy } from "./sort";
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

export function getSortableValue<R>(row: R, column: IColumn<R>) {
    const { key, getSortValue, getSortableText } = column;
    if (getSortValue) {
        return getSortValue(row);
    } else if (getSortableText) {
        return getSortableText(row);
    } else if (key in row) {
        return row[key as keyof R];
    } else {
        return null;
    }
}

export class TableModel<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> implements ITableModel<K, R, V> {

    public keyField: K;
    public columns: Array<IColumn<R>>;
    public selection: Set<V>;
    public sort: ISort | undefined;
    public sortedRows: R[];

    private rows: R[];
    private rowListeners: Array<RowEventListener<R>> = [];
    private columnListeners: Array<ColumnEventListener<R>> = [];
    private selectionListeners: Array<SelectionEventListener<V>> = [];
    private sortListeners: SortEventListener[] = [];

    public constructor(config: ITableConfig<K, R, V>) {
        this.keyField = config.keyField;
        this.rows = config.rows;
        this.columns = config.columns;
        this.selection = config.selection || new Set();
        this.sort = config.sort;
        this.sortedRows = this.sortRows();
    }

    public setRows(newRows: R[]) {
        const oldRows = this.rows;
        this.rows = newRows;
        this.sortedRows = this.sortRows();
        for (const listener of this.rowListeners) {
            listener(newRows, oldRows);
        }
    }

    public setColumns(newColumns: Array<IColumn<R>>) {
        const oldColumns = this.columns;
        this.columns = newColumns;

        const { sort } = this;
        if (sort) {
            const oldSortColumn = oldColumns.find((c) => c.key === sort.key);
            const newSortColumn = newColumns.find((c) => c.key === sort.key);
            if (oldSortColumn !== newSortColumn) {
                this.sortedRows = this.sortRows();
            }
        }

        for (const listener of this.columnListeners) {
            listener(newColumns, oldColumns);
        }
    }

    public setSelection(newSelection: Set<V>) {
        const oldSelection = this.selection;
        this.selection = newSelection;
        for (const listener of this.selectionListeners) {
            listener(newSelection, oldSelection);
        }
    }

    public setSort(newSort: ISort | undefined) {
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

    public isSelected(row: R) {
        return this.selection.has(row[this.keyField]);
    }

    public addRowListener(listener: RowEventListener<R>) {
        this.rowListeners.push(listener);
    }

    public addColumnListener(listener: ColumnEventListener<R>) {
        this.columnListeners.push(listener);
    }

    public addSelectionListener(listener: SelectionEventListener<V>) {
        this.selectionListeners.push(listener);
    }

    public addSortListener(listener: SortEventListener) {
        this.sortListeners.push(listener);
    }

    public removeRowListener(listener: RowEventListener<R>) {
        removeFromArray(this.rowListeners, listener);
    }

    public removeColumnListener(listener: ColumnEventListener<R>) {
        removeFromArray(this.columnListeners, listener);
    }

    public removeSelectionListener(listener: SelectionEventListener<V>) {
        removeFromArray(this.selectionListeners, listener);
    }

    public removeSortListener(listener: SortEventListener) {
        removeFromArray(this.sortListeners, listener);
    }

    public destroy() {
        this.rowListeners = [];
        this.columnListeners = [];
        this.selectionListeners = [];
        this.sortListeners = [];
    }

    private sortRows(): R[] {
        const { rows, columns, sort } = this;
        if (!sort) {
            return rows;
        }
        const { key } = sort;
        const column = columns.find((c) => c.key === key);
        if (!column) {
            return rows;
        }

        return sortBy(rows, (row) => getSortableValue(row, column), sort.ascending);
    }

}
