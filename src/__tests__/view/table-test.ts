import { ITableModel, TableModel, TableView } from "../..";
import { getBodyTd } from "./body-test";
import { getHeaderTh } from "./header-test";
import { ITestRow, TEST_COLUMNS, TEST_COLUMNS_2, TEST_ROWS } from "./test-data";

describe("TableView", () => {

    let model: ITableModel<"id", ITestRow, number>;
    let view: TableView<"id", ITestRow, number>;
    let clickedHeaderIndex: number | null = null;
    let clickedRowIndex: number | null = null;

    beforeEach(() => {
        model = new TableModel({
            keyField: "id",
            rows: TEST_ROWS,
            columns: TEST_COLUMNS,
        });
        view = new TableView({
            model,
            onClickHeader(_, index) {
                clickedHeaderIndex = index;
            },
            onClickRow(_, index) {
                clickedRowIndex = index;
            },
        });
    });

    test("renders the table", () => {
        validateElement();
    });

    test("updates the table", () => {
        model.setColumns(TEST_COLUMNS_2);
        validateElement();
    });

    test("detects the correct clicked header", () => {
        for (let index = 0; index < model.columns.length; index++) {
            getHeaderTh(view.headerView, index).click();
            expect(clickedHeaderIndex).toEqual(index);
        }
    });

    test("detects the correct clicked row", () => {
        for (let index = 0; index < model.columns.length; index++) {
            getBodyTd(view.bodyView, index, 0).click();
            expect(clickedRowIndex).toEqual(index);
        }
    });

    function validateElement() {
        expect(view.element.tagName).toEqual("TABLE");
        expect(view.element.childNodes.length).toEqual(2);
        expect(view.element.childNodes[0]).toBe(view.headerView.element);
        expect(view.element.childNodes[1]).toBe(view.bodyView.element);
    }

});
