import * as React from "react";
import { ITableModel, ITableView, ObjectWithKey } from "../types";
interface ICellContentProps<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> {
    model: ITableModel<Key, Row, KeyType>;
    view: ITableView;
}
interface ICellContentState {
    portals: React.ReactPortal[];
}
export declare class CellContent<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> extends React.PureComponent<ICellContentProps<Key, Row, KeyType>, ICellContentState> {
    state: ICellContentState;
    private domObserver?;
    private tbodyElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactPortal[];
    private handleMutation;
    private createPortals;
}
export {};
