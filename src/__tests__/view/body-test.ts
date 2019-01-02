import { ITableModel, ITableSectionView, TableModel } from "../..";
import { renderCellContent, TableBodyView } from "../../view/body";
import { ITestRow, TEST_COLUMNS, TEST_COLUMNS_2, TEST_ROWS, TEST_ROWS_2 } from "./test-data";

export function getBodyTd(view: ITableSectionView, rowIndex: number, columnIndex: number) {
    const td = getBodyTr(view, rowIndex).childNodes[columnIndex] as HTMLElement;
    expect(td.tagName).toEqual("TD");
    return td;
}

function getBodyTr(view: ITableSectionView, rowIndex: number) {
    const tr = view.element.childNodes[rowIndex] as HTMLElement;
    expect(tr.tagName).toEqual("TR");
    return tr;
}

function expectTextNode(node: Node, expectedText: string) {
    expect(node).toEqual(document.createTextNode(expectedText));
}

describe("TableBodyView", () => {

    let model: ITableModel<"id", ITestRow, number>;
    let view: TableBodyView<"id", ITestRow, number>;
    let clickedIndex: number | null = null;

    beforeEach(() => {
        model = new TableModel({
            keyField: "id",
            rows: TEST_ROWS,
            columns: TEST_COLUMNS,
        });
        view = new TableBodyView(model, (_, index) => {
            clickedIndex = index;
        });
    });

    test("renders the body", () => {
        validateElement();
    });

    test("updates the body when the rows change", () => {
        model.setRows(TEST_ROWS_2);
        validateElement();
    });

    test("updates the body when the columns change", () => {
        model.setColumns(TEST_COLUMNS_2);
        validateElement();
    });

    test("updates the body when a selection is added", () => {
        model.setSelection(new Set([TEST_ROWS[0].id]));
        validateElement();
    });

    test("updates the body when the selection is removed", () => {
        model.setSelection(new Set([TEST_ROWS[0].id]));
        model.setSelection(new Set());
        validateElement();
    });

    test("updates the body when the selection changes", () => {
        model.setSelection(new Set([TEST_ROWS[0].id]));
        model.setSelection(new Set([TEST_ROWS[1].id]));
        validateElement();
    });

    test("updates the body when the sort changes", () => {
        model.setSort({ key: "id", ascending: false });
        validateElement();
    });

    test("detects the correct clicked row", () => {
        for (let index = 0; index < model.sortedRows.length; index++) {
            getBodyTd(view, index, 0).click();
            expect(clickedIndex).toEqual(index);
        }
    });

    function validateElement() {
        const { sortedRows, columns, selection } = model;
        expect(view.element.tagName).toEqual("TBODY");

        for (let rowIndex = 0; rowIndex < sortedRows.length; rowIndex++) {
            const row = sortedRows[rowIndex];

            const expectedDataSelected = selection.has(row.id) ? "true" : null;
            expect(getBodyTr(view, rowIndex).getAttribute("data-selected")).toEqual(expectedDataSelected);

            for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                const expected = renderCellContent(row, columns[columnIndex]);
                const actual = getBodyTd(view, rowIndex, columnIndex).childNodes[0];
                expect(actual).toEqual(expected);
            }
        }
    }

});

describe("renderCellContent", () => {

    test("renders the value directly by default", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
        });
        expectTextNode(node, "string");
    });

    test("renders an empty text node for null", () => {
        const node = renderCellContent({
            field: null,
        }, {
            key: "field",
            label: "field",
        });
        expectTextNode(node, "");
    });

    test("renders the text returned by renderData", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
            renderData() {
                return "rendered";
            },
            getData() {
                return "get data";
            },
        });
        expectTextNode(node, "rendered");
    });

    test("renders the node returned by renderData", () => {
        const div = document.createElement("div");
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
            renderData() {
                return div;
            },
            getData() {
                return "get data";
            },
        });
        expect(node).toBe(div);
    });

    test("renders the text returned by getData", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
            getData() {
                return "get data";
            },
        });
        expectTextNode(node, "get data");
    });

});
