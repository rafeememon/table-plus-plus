import { ITableModel, ITableSectionView, TableModel } from "../..";
import { getCellText, renderCellContent, TableBodyView } from "../../view/body";
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
        clickedIndex = null;
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

    test("detects the correct clicked cell", () => {
        let clickedId: number | null = null;
        model.setColumns([
            {
                key: "id",
                onClick({id}) {
                    clickedId = id;
                },
            },
        ]);
        for (let index = 0; index < model.sortedRows.length; index++) {
            getBodyTd(view, index, 0).click();
            expect(clickedId).toEqual(model.sortedRows[index].id);
            expect(clickedIndex).toBeNull();
            clickedId = null;
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

describe("getCellText", () => {

    test("returns the value directly by default", () => {
        const text = getCellText({
            field: "string",
        }, {
            key: "field",
        });
        expect(text).toEqual("string");
    });

    test("returns an empty string for null", () => {
        const text = getCellText({
            field: null,
        }, {
            key: "field",
        });
        expect(text).toEqual("");
    });

    test("returns an empty string for a nonexistent value", () => {
        const text = getCellText({}, {
            key: "field",
        });
        expect(text).toEqual("");
    });

    test("returns the text given by getText", () => {
        const text = getCellText({
            field: "string",
        }, {
            key: "field",
            getText() {
                return "returned by getText";
            },
            getSortableText() {
                return "returned by getSortableText";
            },
        });
        expect(text).toEqual("returned by getText");
    });

    test("returns the text given by getSortableText", () => {
        const text = getCellText({
            field: "string",
        }, {
            key: "field",
            getSortableText() {
                return "returned by getSortableText";
            },
        });
        expect(text).toEqual("returned by getSortableText");
    });

});

describe("renderCellContent", () => {

    test("renders the value", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
        });
        expect(node).toEqual(document.createTextNode("string"));
    });

    test("renders a link", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            getHref() {
                return "http://www.example.com";
            },
        });
        const expected = document.createElement("a");
        expected.href = "http://www.example.com";
        expected.appendChild(document.createTextNode("string"));
        expect(node).toEqual(expected);
    });

});
