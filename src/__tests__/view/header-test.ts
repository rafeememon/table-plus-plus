import { ITableModel, ITableSectionView, TableModel } from "../..";
import { TableHeaderView } from "../../view/header";
import { ITestRow, TEST_COLUMNS, TEST_COLUMNS_2, TEST_ROWS } from "./test-data";

export function getHeaderTh(view: ITableSectionView, index: number) {
    const tr = view.element.childNodes[0] as HTMLElement;
    expect(tr.tagName).toEqual("TR");
    const th = tr.childNodes[index] as HTMLElement;
    expect(th.tagName).toEqual("TH");
    return th;
}

describe("TableHeaderView", () => {

    let model: ITableModel<"id", ITestRow, number>;
    let view: TableHeaderView<"id", ITestRow, number>;
    let clickedIndex: number | null = null;

    beforeEach(() => {
        model = new TableModel({
            keyField: "id",
            rows: TEST_ROWS,
            columns: TEST_COLUMNS,
        });
        view = new TableHeaderView(model, (_, index) => {
            clickedIndex = index;
        });
    });

    test("renders the header", () => {
        validateElement();
    });

    test("updates the header when the columns change", () => {
        model.setColumns(TEST_COLUMNS_2);
        validateElement();
    });

    test("updates the header when a sort is added", () => {
        model.setSort({ key: "id", ascending: true });
        validateElement();
    });

    test("updates the header when the sort reverses", () => {
        model.setSort({ key: "id", ascending: true });
        model.setSort({ key: "id", ascending: false });
        validateElement();
    });

    test("updates the header when the sort switches columns", () => {
        model.setSort({ key: "id", ascending: true });
        model.setSort({ key: "name", ascending: true });
        validateElement();
    });

    test("detects the correct clicked header", () => {
        for (let index = 0; index < model.columns.length; index++) {
            getHeaderTh(view, index).click();
            expect(clickedIndex).toEqual(index);
        }
    });

    function validateElement() {
        const { columns, sort } = model;
        expect(view.element.tagName).toEqual("THEAD");

        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            let expectedHeader = column.label;
            if (sort && sort.key === column.key) {
                expectedHeader += sort.ascending ? " ↑" : " ↓";
            }
            expect(getHeaderTh(view, index).textContent).toEqual(expectedHeader);
        }
    }

});
