import { renderChildNodes } from "../dom";

function createDiv() {
    return document.createElement("div");
}

function expectChildNodes(parent: HTMLElement, children: HTMLElement[]) {
    expect(parent.childNodes.length).toBe(children.length);
    for (let index = 0; index < children.length; index++) {
        expect(parent.childNodes[index]).toBe(children[index]);
    }
}

describe("renderChildNodes", () => {

    let container: HTMLElement;

    beforeEach(() => {
        container = createDiv();
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    test("renders nothing with no child nodes", () => {
        renderChildNodes(container, []);
        expectChildNodes(container, []);
    });

    test("renders the only child node", () => {
        const child = createDiv();
        renderChildNodes(container, [child]);
        expectChildNodes(container, [child]);
    });

    test("removes the only child node", () => {
        const child = createDiv();
        renderChildNodes(container, [child]);
        renderChildNodes(container, []);
        expectChildNodes(container, []);
    });

    test("removes the first child node", () => {
        const child1 = createDiv();
        const child2 = createDiv();
        renderChildNodes(container, [child1, child2]);
        renderChildNodes(container, [child2]);
        expectChildNodes(container, [child2]);
    });

    test("removes the last child node", () => {
        const child1 = createDiv();
        const child2 = createDiv();
        renderChildNodes(container, [child1, child2]);
        renderChildNodes(container, [child1]);
        expectChildNodes(container, [child1]);
    });

    test("replaces one child node", () => {
        const child1 = createDiv();
        const child2 = createDiv();
        const child3 = createDiv();
        renderChildNodes(container, [child1, child2]);
        renderChildNodes(container, [child1, child3]);
        expectChildNodes(container, [child1, child3]);
    });

    test("reorders child nodes", () => {
        const child1 = createDiv();
        const child2 = createDiv();
        renderChildNodes(container, [child1, child2]);
        renderChildNodes(container, [child2, child1]);
        expectChildNodes(container, [child2, child1]);
    });

});
