import { IColumn, ObjectWithKey } from "../../types";

export type ColumnWidths = Map<IColumn<{}>, number>;

export type ColumnWidthEventListener = (newColumnWidths: ColumnWidths, oldColumnWidths: ColumnWidths) => void;

export interface ISheetModel<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K]
> {
    readonly columnWidths: ColumnWidths;
    addColumnWidthListener(listener: ColumnWidthEventListener): void;
    removeColumnWidthListener(listener: ColumnWidthEventListener): void;
    destroy(): void;
}
