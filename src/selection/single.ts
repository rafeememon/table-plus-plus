import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";

export class SingleSelectionAdapter<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]>
    implements ISelectionAdapter {
    public constructor(private model: ITableModel<K, R, V>, private handler: SelectionHandler<V>) {}

    public handleRowClick = (_event: MouseEvent, rowIndex: number) => {
        const { sortedRows, keyField, selection } = this.model;
        const key = sortedRows[rowIndex][keyField];
        const newSelection = new Set<V>();
        if (!selection.has(key)) {
            newSelection.add(key);
        }
        this.handler(newSelection);
    };
}
