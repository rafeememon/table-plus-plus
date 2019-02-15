import { TableModel } from "../../model";
import { SingleSelectionAdapter } from "../../selection/single";
import { ITableModel } from "../../types";
import { createMouseEvent } from "../events";

import { FOURTEENERS, IMountain, MOUNTAIN_COLUMNS } from "../../__demo__/mountains";

describe("Single selection adapter", () => {
    let model: ITableModel<"name", IMountain>;
    let adapter: SingleSelectionAdapter<"name", IMountain>;

    beforeEach(() => {
        model = new TableModel({
            keyField: "name",
            rows: FOURTEENERS,
            columns: MOUNTAIN_COLUMNS
        });
        adapter = new SingleSelectionAdapter(model, newSelection => {
            model.setSelection(newSelection);
        });
    });

    test("selects the clicked row", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        expect(model.selection).toEqual(new Set([FOURTEENERS[0].name]));
    });

    test("selects the second clicked row", () => {
        adapter.handleRowClick(createMouseEvent(), 0);
        adapter.handleRowClick(createMouseEvent(), 1);
        expect(model.selection).toEqual(new Set([FOURTEENERS[1].name]));
    });

    test("deselects the clicked row", () => {
        model.setSelection(new Set([FOURTEENERS[0].name]));
        adapter.handleRowClick(createMouseEvent(), 0);
        expect(model.selection).toEqual(new Set([]));
    });
});
