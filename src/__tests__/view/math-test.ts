import { expandWidths, sum, union } from "../../view/math";

describe("sum", () => {

    test("sums the numbers", () => {
        expect(sum([1, 2, 3])).toEqual(6);
    });

});

describe("expandWidths", () => {

    test("doesn't change the widths if they fill the container", () => {
        expect(expandWidths([1, 2, 3], 5)).toEqual([1, 2, 3]);
        expect(expandWidths([1, 2, 3], 6)).toEqual([1, 2, 3]);
    });

    test("scales the widths to fit the container", () => {
        expect(expandWidths([1, 2, 3], 12)).toEqual([2, 4, 6]);
    });

    test("adds extra width to fit the container", () => {
        expect(expandWidths([1, 2, 3], 7)).toEqual([1, 2, 4]);
    });

    test("doesn't reduce any width to fit the container", () => {
        const widths = [1.1, 2.2, 3.3];
        const containerWidth = 7;
        const result = expandWidths(widths, containerWidth);
        expect(sum(result)).toEqual(7);
        for (let index = 0; index < widths.length; index++) {
            expect(result[index]).toBeGreaterThanOrEqual(widths[index]);
        }
    });

});

describe("union", () => {

    test("unions the sets", () => {
        const set1 = new Set([1, 2]);
        const set2 = new Set([2, 3]);
        const expected = new Set([1, 2, 3]);
        expect(union(set1, set2)).toEqual(expected);
    });

});
