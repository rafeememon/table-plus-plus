import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";
export declare class MultiSelectionAdapter<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> implements ISelectionAdapter {
    private model;
    private handler;
    private anchorKey;
    constructor(model: ITableModel<K, R, V>, handler: SelectionHandler<V>);
    handleRowClick: (event: MouseEvent, rowIndex: number) => void;
    private handleNormalRowClick;
    private handleShiftRowClick;
    private handleControlRowClick;
}
