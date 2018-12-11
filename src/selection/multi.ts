import { ISelectionAdapter, ITableModel, ObjectWithKey, SelectionHandler } from "../types";

function findIndex<T>(elements: T[], fn: (element: T) => boolean) {
    for (let index = 0; index < elements.length; index++) {
        if (fn(elements[index])) {
            return index;
        }
    }
    return null;
}

export class MultiSelectionAdapter<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ISelectionAdapter {

    private anchorKey: KeyType | undefined;

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private handler: SelectionHandler<KeyType>,
    ) {}

    public handleRowClick = (event: MouseEvent, rowIndex: number) => {
        if (event.getModifierState("Shift")) {
            this.handleShiftRowClick(rowIndex);
        } else if (event.getModifierState("Control")) {
            this.handleControlRowClick(rowIndex);
        } else {
            this.handleNormalRowClick(rowIndex);
        }
    }

    private handleNormalRowClick(rowIndex: number) {
        const { rows, keyField } = this.model;
        this.anchorKey = rows[rowIndex][keyField];
        this.handler(new Set([this.anchorKey]));
    }

    private handleShiftRowClick(rowIndex: number) {
        if (this.anchorKey !== undefined) {
            const { rows, keyField } = this.model;
            const anchorIndex = findIndex(rows, (r) => r[keyField] === this.anchorKey);
            if (anchorIndex != null) {
                const newSelection = new Set<KeyType>();
                const min = Math.min(rowIndex, anchorIndex);
                const max = Math.max(rowIndex, anchorIndex);
                for (let index = min; index <= max; index++) {
                    newSelection.add(rows[index][keyField]);
                }
                this.handler(newSelection);
            } else {
                this.handleNormalRowClick(rowIndex);
            }
        } else {
            this.handleNormalRowClick(rowIndex);
        }
    }

    private handleControlRowClick(rowIndex: number) {
        const { rows, keyField, selection } = this.model;
        this.anchorKey = rows[rowIndex][keyField];
        const newSelection = new Set(selection);
        if (newSelection.has(this.anchorKey)) {
            newSelection.delete(this.anchorKey);
        } else {
            newSelection.add(this.anchorKey);
        }
        this.handler(newSelection);
    }

}
