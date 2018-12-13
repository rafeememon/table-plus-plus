import { ISortAdapter, ITableModel, ObjectWithKey, SortHandler } from "./types";

export class SortAdapter<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ISortAdapter {

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private handler: SortHandler<Row>,
    ) {}

    public handleHeaderClick = (_event: MouseEvent, headerIndex: number) => {
        const { columns, sort } = this.model;
        const { key } = columns[headerIndex];
        const ascending = sort != null && sort.key === key ? !sort.ascending : true;
        this.handler({ key, ascending });
    }

}
