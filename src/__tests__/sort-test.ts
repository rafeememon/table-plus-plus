import { TableModel } from "../model";
import { SortAdapter, sortBy } from "../sort";
import { ITableModel } from "../types";
import { createMouseEvent } from "./events";

import { FOURTEENERS, IMountain, MOUNTAIN_COLUMNS } from "../__demo__/mountains";

describe("Sort adapter", () => {

    let model: ITableModel<"name", IMountain>;
    let adapter: SortAdapter<"name", IMountain>;

    beforeEach(() => {
        model = new TableModel({
            keyField: "name",
            rows: FOURTEENERS,
            columns: MOUNTAIN_COLUMNS,
        });
        adapter = new SortAdapter(model, (newSort) => {
            model.setSort(newSort);
        });
    });

    test("sorts ascending by the clicked header with no sort", () => {
        adapter.handleHeaderClick(createMouseEvent(), 0);
        expect(model.sort).toEqual({ key: MOUNTAIN_COLUMNS[0].key, ascending: true });
    });

    test("sorts descending by the clicked header if already sorted ascending", () => {
        model.setSort({ key: MOUNTAIN_COLUMNS[0].key, ascending: true });
        adapter.handleHeaderClick(createMouseEvent(), 0);
        expect(model.sort).toEqual({ key: MOUNTAIN_COLUMNS[0].key, ascending: false });
    });

    test("sorts ascending by the clicked header if already sorted descending", () => {
        model.setSort({ key: MOUNTAIN_COLUMNS[0].key, ascending: false });
        adapter.handleHeaderClick(createMouseEvent(), 0);
        expect(model.sort).toEqual({ key: MOUNTAIN_COLUMNS[0].key, ascending: true });
    });

});

describe("sortBy", () => {

    function getSortValue(element: string) {
        return element.length;
    }

    const ELEMENTS_UNSORTED = ["bb", "aaa", "c"];
    const ELEMENTS_SORTED = ["c", "bb", "aaa"];

    test("sorts ascending", () => {
        const result = sortBy(ELEMENTS_UNSORTED, getSortValue, true);
        expect(result).toEqual(ELEMENTS_SORTED);
        expect(result).not.toBe(ELEMENTS_UNSORTED);
    });

    test("sorts descending", () => {
        const result = sortBy(ELEMENTS_UNSORTED, getSortValue, false);
        expect(result).toEqual(ELEMENTS_SORTED.slice().reverse());
        expect(result).not.toBe(ELEMENTS_UNSORTED);
    });

});
