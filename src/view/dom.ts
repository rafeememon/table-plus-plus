export function replaceWith(oldChild: ChildNode, newChild: ChildNode) {
    const { parentNode } = oldChild;
    if (parentNode) {
        parentNode.replaceChild(newChild, oldChild);
    }
}

export function findParentElementOfType(element: Element | null, tagName: string) {
    let e: Element | null = element;
    while (e && e.tagName !== tagName) {
        e = e.parentElement;
    }
    return e;
}

export function findParentElementWithClassName(element: Element | null, className: string) {
    let e: Element | null = element;
    while (e && !e.classList.contains(className)) {
        e = e.parentElement;
    }
    return e;
}

export function getChildIndex(element: Node) {
    let e: Node | null = element;
    let count = 0;
    while (e && e.previousSibling) {
        e = e.previousSibling;
        count++;
    }
    return count;
}

type TableDisplay = "table" | "table-header-group" | "table-row-group" | "table-row" | "table-cell";

export function createTableDiv(display: TableDisplay) {
    const div = document.createElement("div");
    div.style.display = display;
    return div;
}

export function applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    for (const key in styles) { // tslint:disable-line:forin
        const value = styles[key];
        if (value != null) {
            element.style[key] = value;
        }
    }
}
