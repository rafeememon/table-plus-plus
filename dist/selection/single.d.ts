import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";
export declare class SingleSelectionAdapter<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ISelectionAdapter {
    private model;
    private handler;
    constructor(model: ITableModel<Key, Row, KeyType>, handler: SelectionHandler<KeyType>);
    handleRowClick: (_event: MouseEvent, rowIndex: number) => void;
}
