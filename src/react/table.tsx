import * as React from "react";
import {
    IColumn,
    ISort,
    ITableModel,
    ITableView,
    MultiSelectionAdapter,
    NOOP_SELECTION_ADAPTER,
    ObjectWithKey,
    SelectionHandler,
    SelectionMode,
    SingleSelectionAdapter,
    SortAdapter,
    TableModel,
    TableView,
} from "..";

function createSelectionAdapter<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
>(
    mode: SelectionMode | undefined,
    model: ITableModel<Key, Row, KeyType>,
    handler: SelectionHandler<KeyType>,
) {
    switch (mode) {
        case "single":
            return new SingleSelectionAdapter(model, handler);
        case "multi":
            return new MultiSelectionAdapter(model, handler);
        default:
            return NOOP_SELECTION_ADAPTER;
    }
}

export interface ITableProps<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    keyField: Key;
    rows: Row[];
    columns: Array<IColumn<Row>>;
    selection?: Set<KeyType>;
    selectionMode?: SelectionMode;
    sort?: ISort<Row>;
    onSelect?(newSelection: Set<KeyType>): void;
    onSort?(newSort: ISort<Row>): void;
}

export class Table<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> extends React.PureComponent<ITableProps<Key, Row, KeyType>> {

    private model: ITableModel<Key, Row, KeyType>;
    private view: ITableView;

    public constructor(props: ITableProps<Key, Row, KeyType>, context?: any) {
        super(props, context);
        this.model = new TableModel({
            keyField: this.props.keyField,
            rows: this.props.rows,
            columns: this.props.columns,
            selection: this.props.selection || new Set(),
            sort: this.props.sort,
        });
        const selectionAdapter = createSelectionAdapter(this.props.selectionMode, this.model, this.handleSelect);
        const sortAdapter = new SortAdapter(this.model, this.handleSort);
        this.view = new TableView({
            model: this.model,
            onClickRow: selectionAdapter.handleRowClick,
            onClickHeader: sortAdapter.handleHeaderClick,
        });
    }

    public componentWillUnmount() {
        this.model.destroy();
        this.view.destroy();
    }

    public componentDidUpdate(oldProps: ITableProps<Key, Row, KeyType>) {
        const { keyField, rows, columns, selection, selectionMode, sort } = this.props;
        if (keyField !== oldProps.keyField) {
            throw new Error("changing key field not supported");
        }
        if (rows !== oldProps.rows) {
            this.model.setRows(rows);
        }
        if (columns !== oldProps.columns) {
            this.model.setColumns(columns);
        }
        if (selection !== oldProps.selection) {
            this.model.setSelection(selection || new Set());
        }
        if (selectionMode !== oldProps.selectionMode) {
            throw new Error("changing selection mode not supported");
        }
        if (sort !== oldProps.sort) {
            this.model.setSort(sort);
        }
    }

    public render() {
        return <div ref={this.handleRef} />;
    }

    private handleRef = (element: HTMLElement | null) => {
        if (element) {
            element.appendChild(this.view.element);
        }
    }

    private handleSelect = (newSelection: Set<KeyType>) => {
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(newSelection);
        }
    }

    private handleSort = (newSort: ISort<Row>) => {
        const { onSort } = this.props;
        if (onSort) {
            onSort(newSort);
        }
    }

}
