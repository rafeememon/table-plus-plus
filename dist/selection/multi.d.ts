import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";
export declare class MultiSelectionAdapter<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ISelectionAdapter {
    private model;
    private handler;
    private anchorKey;
    constructor(model: ITableModel<Key, Row, KeyType>, handler: SelectionHandler<KeyType>);
    handleRowClick: (event: MouseEvent, rowIndex: number) => void;
    private handleNormalRowClick;
    private handleShiftRowClick;
    private handleControlRowClick;
}
