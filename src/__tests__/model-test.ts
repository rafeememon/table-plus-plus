import { getSortableValue, TableModel } from "../model";
import { sortBy } from "../sort";
import { IColumn, ISort, ITableModel } from "../types";

import { FOURTEENERS, IMountain, MOUNTAIN_COLUMNS, ULTRAS } from "../__demo__/mountains";

describe("getSortableValue", () => {

    test("returns the value directly by default", () => {
        const value = getSortableValue({
            field: "string",
        }, {
            key: "field",
            label: "field",
        });
        expect(value).toEqual("string");
    });

    test("returns null for a nonexistent value", () => {
        const value = getSortableValue({}, {
            key: "field",
            label: "field",
        });
        expect(value).toEqual(null);
    });

    test("returns the value given by getSortValue", () => {
        const value = getSortableValue({
            field: "string",
        }, {
            key: "field",
            label: "field",
            getSortValue() {
                return "returned by getSortValue";
            },
            getSortableText() {
                return "returned by getSortableText";
            },
        });
        expect(value).toEqual("returned by getSortValue");
    });

    test("returns the value given by getSortableText", () => {
        const value = getSortableValue({
            field: "string",
        }, {
            key: "field",
            label: "field",
            getSortableText() {
                return "returned by getSortableText";
            },
        });
        expect(value).toEqual("returned by getSortableText");
    });

});

describe("Table model", () => {

    let model: ITableModel<"name", IMountain>;

    beforeEach(() => {
        model = new TableModel({
            keyField: "name",
            rows: FOURTEENERS,
            columns: MOUNTAIN_COLUMNS,
            selection: new Set(),
            sort: {
                key: "prominenceFt",
                ascending: true,
            },
        });
    });

    test("sorted rows are initialized", () => {
        const expectedRows = sortBy(FOURTEENERS, (m) => m.prominenceFt, true);
        expect(model.sortedRows).toEqual(expectedRows);
    });

    test("sorted rows are updated when rows change", () => {
        model.setRows(ULTRAS);
        const expectedRows = sortBy(ULTRAS, (m) => m.prominenceFt, true);
        expect(model.sortedRows).toEqual(expectedRows);
    });

    test("sorted rows are updated when sort changes", () => {
        model.setSort({
            key: "elevationFt",
            ascending: false,
        });
        const expectedRows = sortBy(FOURTEENERS, (m) => m.elevationFt, false);
        expect(model.sortedRows).toEqual(expectedRows);
    });

    test("sorted rows are updated when columns change", () => {
        function getSortValue({prominenceFt}: IMountain) {
            return -prominenceFt;
        }
        model.setColumns([
            {
                key: "prominenceFt",
                label: "Prominence",
                getSortValue,
            },
        ]);
        const expectedRows = sortBy(FOURTEENERS, getSortValue, true);
        expect(model.sortedRows).toEqual(expectedRows);
    });

    test("selection state is consistent", () => {
        const mountain1 = FOURTEENERS[0];
        const mountain2 = FOURTEENERS[1];
        expect(model.isSelected(mountain1)).toBe(false);
        expect(model.isSelected(mountain2)).toBe(false);
        model.setSelection(new Set([mountain1.name]));
        expect(model.selection).toEqual(new Set([mountain1.name]));
        expect(model.isSelected(mountain1)).toBe(true);
        expect(model.isSelected(mountain2)).toBe(false);
        model.setSelection(new Set());
        expect(model.selection).toEqual(new Set());
        expect(model.isSelected(mountain1)).toBe(false);
        expect(model.isSelected(mountain2)).toBe(false);
    });

    test("row listener is called when rows are updated", () => {
        const listener = jest.fn();
        model.addRowListener(listener);
        model.setRows(ULTRAS);
        model.removeRowListener(listener);
        model.setRows(FOURTEENERS);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(ULTRAS, FOURTEENERS);
    });

    test("column listener is called when columns are updated", () => {
        const newColumns: Array<IColumn<IMountain>> = [
            {
                key: "prominenceFt",
                label: "Prominence",
            },
        ];
        const listener = jest.fn();
        model.addColumnListener(listener);
        model.setColumns(newColumns);
        model.removeColumnListener(listener);
        model.setColumns(MOUNTAIN_COLUMNS);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(newColumns, MOUNTAIN_COLUMNS);
    });

    test("selection listener is called when selection is updated", () => {
        const selection1 = new Set([FOURTEENERS[0].name]);
        const selection2 = new Set([FOURTEENERS[1].name]);
        const listener = jest.fn();
        model.addSelectionListener(listener);
        model.setSelection(selection1);
        model.removeSelectionListener(listener);
        model.setSelection(selection2);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(selection1, new Set());
    });

    test("sort listener is called when sort is updated", () => {
        const oldSort = model.sort;
        const newSort: ISort = {
            key: "elevationFt",
            ascending: false,
        };
        const listener = jest.fn();
        model.addSortListener(listener);
        model.setSort(newSort);
        model.removeSortListener(listener);
        model.setSort(oldSort);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(newSort, oldSort);
    });

    test("listeners are removed when model is destroyed", () => {
        const rowListener = jest.fn();
        const columnListener = jest.fn();
        const selectionListener = jest.fn();
        const sortListener = jest.fn();

        model.addRowListener(rowListener);
        model.addColumnListener(columnListener);
        model.addSelectionListener(selectionListener);
        model.addSortListener(sortListener);

        model.destroy();
        model.setRows(ULTRAS);
        model.setColumns([MOUNTAIN_COLUMNS[0]]);
        model.setSelection(new Set([ULTRAS[0].name]));
        model.setSort({ key: "elevationFt", ascending: false });

        expect(rowListener).not.toHaveBeenCalled();
        expect(columnListener).not.toHaveBeenCalled();
        expect(selectionListener).not.toHaveBeenCalled();
        expect(sortListener).not.toHaveBeenCalled();
    });

});
