import { replaceWith } from "../dom";

function createDiv() {
    return document.createElement("div");
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
