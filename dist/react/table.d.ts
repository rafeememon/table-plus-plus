import * as React from "react";
import { IColumn, ISort, SelectionMode } from "..";
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
export declare class Table<K extends keyof R, R extends Record<K, V>, V = R[K]> extends React.PureComponent<ITableProps<K, R, V>> {
    private model;
    private view;
    constructor(props: ITableProps<K, R, V>, context?: any);
    componentWillUnmount(): void;
    componentDidUpdate(oldProps: ITableProps<K, R, V>): void;
    render(): JSX.Element;
    private handleRef;
    private handleSelect;
    private handleSort;
}
