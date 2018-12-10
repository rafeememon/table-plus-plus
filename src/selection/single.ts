import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";

export class SingleSelectionAdapter<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ISelectionAdapter {

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private handler: SelectionHandler<KeyType>,
    ) {}

    public handleRowClick = (_event: MouseEvent, rowIndex: number) => {
        const { model } = this;
        const key = model.getRows()[rowIndex][model.getKeyField()];
        const newSelection = new Set<KeyType>();
        if (!model.getSelection().has(key)) {
            newSelection.add(key);
        }
        this.handler(newSelection);
    }

}
