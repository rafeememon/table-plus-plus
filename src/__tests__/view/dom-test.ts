import { applyStyles, findParentElementOfType, getChildIndex, replaceWith } from "../../view/dom";

function createDiv() {
    return document.createElement("div");
}

function createSpan() {
    return document.createElement("span");
}

describe("replaceWith", () => {

    test("replaces the child node", () => {
        const parent = createDiv();
        const child1 = createDiv();
        const child2 = createDiv();
        parent.appendChild(child1);
        replaceWith(child1, child2);
        expect(parent.childNodes.length).toBe(1);
        expect(parent.childNodes[0]).toBe(child2);
    });

    test("does nothing if there is no parent node", () => {
        const child1 = createDiv();
        const child2 = createDiv();
        replaceWith(child1, child2);
    });

});

describe("findParentElementOfType", () => {

    test("returns the element if it is the correct type", () => {
        const parent = createDiv();
        const child = createDiv();
        parent.appendChild(child);
        expect(findParentElementOfType(child, "DIV")).toBe(child);
    });

    test("returns the parent element of the correct type if it exists", () => {
        const parent = createDiv();
        const child = createSpan();
        parent.appendChild(child);
        expect(findParentElementOfType(child, "DIV")).toBe(parent);
    });

    test("returns null if the parent element doesn't exist", () => {
        const parent = createDiv();
        const child = createDiv();
        parent.appendChild(child);
        expect(findParentElementOfType(child, "SPAN")).toBeNull();
    });

});

describe("getChildIndex", () => {

    test("returns 0 for a root node", () => {
        const node = createDiv();
        expect(getChildIndex(node)).toBe(0);
    });

    test("returns the correct indices for child nodes", () => {
        const parent = createDiv();
        const child1 = createDiv();
        const child2 = createDiv();
        const child3 = createDiv();
        parent.appendChild(child1);
        parent.appendChild(child2);
        parent.appendChild(child3);
        expect(getChildIndex(child1)).toBe(0);
        expect(getChildIndex(child2)).toBe(1);
        expect(getChildIndex(child3)).toBe(2);
    });

});

describe("applyStyles", () => {

    test("applys styles", () => {
        const styles: Partial<CSSStyleDeclaration> = {
            backgroundColor: "blue",
            color: "red",
        };
        const div = createDiv();
        applyStyles(div, styles);
        for (const key in styles) { // tslint:disable-line:forin
            expect(div.style[key]).toEqual(styles[key]);
        }
    });

});
