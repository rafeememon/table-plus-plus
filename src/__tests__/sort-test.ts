import { sortBy } from "../sort";

function getSortValue(element: string) {
    return element.length;
}

const ELEMENTS_UNSORTED = ["bb", "aaa", "c"];
const ELEMENTS_SORTED = ["c", "bb", "aaa"];

describe("sortBy", () => {

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
