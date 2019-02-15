import * as React from "react";
import {
    FixedTableView,
    IColumn,
    ISort,
    ITableModel,
    ITableView,
    IViewConfig,
    MultiSelectionAdapter,
    NOOP_SELECTION_ADAPTER,
    SelectionHandler,
    SelectionMode,
    SingleSelectionAdapter,
    SortAdapter,
    TableModel,
    TableView
} from "..";

function createSelectionAdapter<K extends keyof R, R extends Record<K, V>, V = R[K]>(
    mode: SelectionMode | undefined,
    model: ITableModel<K, R, V>,
    handler: SelectionHandler<V>
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

export interface ITableProps<K extends keyof R, R extends Record<K, V>, V = R[K]> {
    keyField: K;
    rows: R[];
    columns: Array<IColumn<R>>;
    selection?: Set<V>;
    selectionMode?: SelectionMode;
    sort?: ISort;
    fixed?: boolean;
    className?: string;
    onSelect?(newSelection: Set<V>): void;
    onSort?(newSort: ISort): void;
}

export class Table<K extends keyof R, R extends Record<K, V>, V = R[K]> extends React.PureComponent<
    ITableProps<K, R, V>
> {
    private model: ITableModel<K, R, V>;
    private view: ITableView;

    public constructor(props: ITableProps<K, R, V>, context?: any) {
        super(props, context);
        this.model = new TableModel({
            keyField: props.keyField,
            rows: props.rows,
            columns: props.columns,
            selection: props.selection,
            sort: props.sort
        });
        const selectionAdapter = createSelectionAdapter(props.selectionMode, this.model, this.handleSelect);
        const sortAdapter = new SortAdapter(this.model, this.handleSort);
        const config: IViewConfig<K, R, V> = {
            model: this.model,
            onClickRow: selectionAdapter.handleRowClick,
            onClickHeader: sortAdapter.handleHeaderClick
        };
        this.view = props.fixed ? new FixedTableView(config) : new TableView(config);
    }

    public componentWillUnmount() {
        this.model.destroy();
        this.view.destroy();
    }

    public componentDidUpdate(oldProps: ITableProps<K, R, V>) {
        const { keyField, rows, columns, selection, selectionMode, sort, fixed } = this.props;
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
        if (fixed !== oldProps.fixed) {
            throw new Error("changing fixed mode not supported");
        }
    }

    public render() {
        return <div ref={this.handleRef} className={this.props.className} />;
    }

    private handleRef = (element: HTMLElement | null) => {
        if (element) {
            element.appendChild(this.view.element);
            this.view.initialize();
        }
    };

    private handleSelect = (newSelection: Set<V>) => {
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(newSelection);
        }
    };

    private handleSort = (newSort: ISort) => {
        const { onSort } = this.props;
        if (onSort) {
            onSort(newSort);
        } else if (!("sort" in this.props)) {
            this.model.setSort(newSort);
        }
    };
}
