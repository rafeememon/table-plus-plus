import { IColumn, ITableModel, ITableSectionView, RowClickHandler } from "../types";
export declare function renderCellContent<R>(row: R, column: IColumn<R>): Text | HTMLAnchorElement;
export declare function getCellText<R>(row: R, column: IColumn<R>): string;
export declare class TableBodyView<K extends keyof R, R extends Record<K, V>, V = R[K]> implements ITableSectionView {
    private model;
    private clickHandler;
    element: HTMLTableSectionElement;
    private trElements;
    constructor(model: ITableModel<K, R, V>, clickHandler: RowClickHandler);
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
