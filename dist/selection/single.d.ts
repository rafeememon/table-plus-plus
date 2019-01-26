import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";
export declare class SingleSelectionAdapter<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> implements ISelectionAdapter {
    private model;
    private handler;
    constructor(model: ITableModel<K, R, V>, handler: SelectionHandler<V>);
    handleRowClick: (_event: MouseEvent, rowIndex: number) => void;
}
