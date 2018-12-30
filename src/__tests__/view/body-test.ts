import { renderCellContent } from "../../view/body";

function expectTextNode(node: Node, expectedText: string) {
    expect(node).toBeInstanceOf(Text);
    expect(node.textContent).toEqual(expectedText);
}

describe("renderCellContent", () => {

    test("renders the value directly by default", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
        });
        expectTextNode(node, "string");
    });

    test("renders an empty text node for null", () => {
        const node = renderCellContent({
            field: null,
        }, {
            key: "field",
            label: "field",
        });
        expectTextNode(node, "");
    });

    test("renders the text returned by renderData", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
            renderData() {
                return "rendered";
            },
            getData() {
                return "get data";
            },
        });
        expectTextNode(node, "rendered");
    });

    test("renders the node returned by renderData", () => {
        const div = document.createElement("div");
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
            renderData() {
                return div;
            },
            getData() {
                return "get data";
            },
        });
        expect(node).toBe(div);
    });

    test("renders the text returned by getData", () => {
        const node = renderCellContent({
            field: "string",
        }, {
            key: "field",
            label: "field",
            getData() {
                return "get data";
            },
        });
        expectTextNode(node, "get data");
    });

});
