import * as React from "react";
import { ISort, ObjectWithKey, SelectionMode } from "..";
import { IReactColumn } from "./types";
export interface ITableProps<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> {
    keyField: Key;
    rows: Row[];
    columns: Array<IReactColumn<Row>>;
    selection?: Set<KeyType>;
    selectionMode?: SelectionMode;
    sort?: ISort<Row>;
    fixed?: boolean;
    className?: string;
    onSelect?(newSelection: Set<KeyType>): void;
    onSort?(newSort: ISort<Row>): void;
}
export declare class Table<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> extends React.PureComponent<ITableProps<Key, Row, KeyType>> {
    private model;
    private view;
    constructor(props: ITableProps<Key, Row, KeyType>, context?: any);
    componentWillUnmount(): void;
    componentDidUpdate(oldProps: ITableProps<Key, Row, KeyType>): void;
    render(): JSX.Element;
    private handleRef;
    private handleSelect;
    private handleSort;
}
