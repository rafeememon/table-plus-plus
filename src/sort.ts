import { ISortAdapter, ITableModel, ObjectWithKey, SortHandler } from "./types";

export class SortAdapter<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> implements ISortAdapter {

    public constructor(
        private model: ITableModel<K, R, V>,
        private handler: SortHandler,
    ) {}

    public handleHeaderClick = (_event: MouseEvent, headerIndex: number) => {
        const { columns, sort } = this.model;
        const { key } = columns[headerIndex];
        const ascending = sort != null && sort.key === key ? !sort.ascending : true;
        this.handler({ key, ascending });
    }

}

export function sortBy<T>(elements: T[], getSortValue: (element: T) => any, ascending: boolean) {
    const sortValues = new Map<T, any>();
    for (const element of elements) {
        if (!sortValues.has(element)) {
            sortValues.set(element, getSortValue(element));
        }
    }

    const ascendingFactor = ascending ? 1 : -1;
    return elements.slice(0).sort((element1, element2) => {
        const value1 = sortValues.get(element1);
        const value2 = sortValues.get(element2);
        return value1 === value2 ? 0 : value1 < value2 ? -ascendingFactor : ascendingFactor;
    });
}
