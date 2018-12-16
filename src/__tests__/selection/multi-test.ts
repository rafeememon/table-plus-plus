import { TableModel } from "../../model";
import { MultiSelectionAdapter } from "../../selection/multi";
import { ITableModel } from "../../types";
import { createMouseEvent } from "../events";

import { FOURTEENERS, IMountain, MOUNTAIN_COLUMNS } from "../../__demo__/mountains";

describe("Multi selection adapter", () => {

    let model: ITableModel<"name", IMountain>;
    let adapter: MultiSelectionAdapter<"name", IMountain>;

    function getKeys(start: number, end = start) {
        return new Set(model.sortedRows.slice(start, end + 1).map((m) => m.name));
    }

    beforeEach(() => {
        model = new TableModel({
            keyField: "name",
            rows: FOURTEENERS,
            columns: MOUNTAIN_COLUMNS,
            sort: {
                key: "name",
                ascending: true,
            },
        });
        adapter = new MultiSelectionAdapter(model, (newSelection) => {
            model.setSelection(newSelection);
        });
    });

    test("selects the clicked row", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        expect(model.selection).toEqual(getKeys(0));
    });

    test("keeps the clicked row selected on the second click", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent(), 0);
        expect(model.selection).toEqual(getKeys(0));
    });

    test("selects the second clicked row", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent(), 1);
        expect(model.selection).toEqual(getKeys(1));
    });

    test("selects the row on shift click", () => {
        adapter.handleRowClick(createMouseEvent("SHIFT"), 0);
        expect(model.selection).toEqual(getKeys(0));
    });

    test("selects a range on shift click", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent("SHIFT"), 2);
        expect(model.selection).toEqual(getKeys(0, 2));
    });

    test("selects a range on shift click in reverse", () => {
        adapter.handleRowClick(createMouseEvent(), 2);
        adapter.handleRowClick(createMouseEvent("SHIFT"), 0);
        expect(model.selection).toEqual(getKeys(0, 2));
    });

    test("selects a range on the second shift click", () => {
        adapter.handleRowClick(createMouseEvent(), 1);
        adapter.handleRowClick(createMouseEvent("SHIFT"), 2);
        adapter.handleRowClick(createMouseEvent("SHIFT"), 0);
        expect(model.selection).toEqual(getKeys(0, 1));
    });

    test("selects a range on shift click after sorting", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        model.setSort({ key: "name", ascending: false });
        const lastIndex = model.sortedRows.length - 1;
        adapter.handleRowClick(createMouseEvent("SHIFT"), lastIndex - 1);
        expect(model.selection).toEqual(getKeys(lastIndex - 1, lastIndex));
    });

    test("selects the clicked row on control click", () => {
        adapter.handleRowClick(createMouseEvent("CONTROL"), 0);
        expect(model.selection).toEqual(getKeys(0));
    });

    test("deselects the clicked row on control click", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent("CONTROL"), 0);
        expect(model.selection).toEqual(new Set());
    });

    test("selects multiple rows on control click", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent("CONTROL"), 1);
        expect(model.selection).toEqual(getKeys(0, 1));
    });

    test("deselects the clicked row on control click with others selected", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent("CONTROL"), 1);
        adapter.handleRowClick(createMouseEvent("CONTROL"), 1);
        expect(model.selection).toEqual(getKeys(0));
    });

    test("selects a range on shift click after control click", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent("CONTROL"), 1);
        adapter.handleRowClick(createMouseEvent("SHIFT"), 2);
        expect(model.selection).toEqual(getKeys(1, 2));
    });

});
