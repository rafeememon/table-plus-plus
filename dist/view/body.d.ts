import { IColumn, ITableModel, ITableSectionView, ObjectWithKey, RowClickHandler } from "../types";
export declare function renderCellContent<Row>(row: Row, column: IColumn<Row>): Node;
export declare class TableBodyView<Key extends keyof Row, Row extends ObjectWithKey<Key, KeyType>, KeyType = Row[Key]> implements ITableSectionView {
    private model;
    private clickHandler;
    element: HTMLTableSectionElement;
    private trElements;
    constructor(model: ITableModel<Key, Row, KeyType>, clickHandler: RowClickHandler);
    destroy(): void;
    private handleRowsChanged;
    private handleColumnsChanged;
    private handleSelectionChanged;
    private handleSortChanged;
    private handleClick;
    private rerender;
    private createTbodyElement;
    private destroyTbodyElement;
    private createTrElement;
    private decorateTrElement;
}
