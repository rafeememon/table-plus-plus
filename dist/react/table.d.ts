import * as React from "react";
import { IColumn, ISort, ObjectWithKey, SelectionMode } from "..";
export interface ITableProps<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> {
    keyField: Key;
    rows: Row[];
    columns: Array<IColumn<Row>>;
    selection?: Set<KeyType>;
    selectionMode?: SelectionMode;
    sort?: ISort<Row>;
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
