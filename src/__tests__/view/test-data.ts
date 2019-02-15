import { IColumn } from "../..";

export interface ITestRow {
    id: number;
    name: string;
}

export const TEST_COLUMNS: Array<IColumn<ITestRow>> = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "empty" }
];

export const TEST_COLUMNS_2: Array<IColumn<ITestRow>> = [
    { key: "name", label: "Name 2" },
    { key: "id", label: "ID 2" },
    { key: "empty" }
];

export const TEST_ROWS: ITestRow[] = [{ id: 1, name: "First" }, { id: 2, name: "Second" }];

export const TEST_ROWS_2: ITestRow[] = [{ id: 3, name: "Third" }, { id: 4, name: "Fourth" }];
