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
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> implements ISelectionAdapter {

    private anchorKey: V | undefined;

    public constructor(
        private model: ITableModel<K, R, V>,
        private handler: SelectionHandler<V>,
    ) {}

    public handleRowClick = (event: MouseEvent, rowIndex: number) => {
        if (event.getModifierState("Shift")) {
            this.handleShiftRowClick(rowIndex);
        } else if (event.getModifierState("Control") || event.getModifierState("Meta")) {
            this.handleControlRowClick(rowIndex);
        } else {
            this.handleNormalRowClick(rowIndex);
        }
    }

    private handleNormalRowClick(rowIndex: number) {
        const { sortedRows, keyField } = this.model;
        this.anchorKey = sortedRows[rowIndex][keyField];
        this.handler(new Set([this.anchorKey]));
    }

    private handleShiftRowClick(rowIndex: number) {
        if (this.anchorKey !== undefined) {
            const { sortedRows, keyField } = this.model;
            const anchorIndex = findIndex(sortedRows, (r) => r[keyField] === this.anchorKey);
            if (anchorIndex != null) {
                const newSelection = new Set<V>();
                const min = Math.min(rowIndex, anchorIndex);
                const max = Math.max(rowIndex, anchorIndex);
                for (let index = min; index <= max; index++) {
                    newSelection.add(sortedRows[index][keyField]);
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
        const { sortedRows, keyField, selection } = this.model;
        this.anchorKey = sortedRows[rowIndex][keyField];
        const newSelection = new Set(selection);
        if (newSelection.has(this.anchorKey)) {
            newSelection.delete(this.anchorKey);
        } else {
            newSelection.add(this.anchorKey);
        }
        this.handler(newSelection);
    }

}
