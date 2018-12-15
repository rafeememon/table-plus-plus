export function getClickedHeaderIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const th = findParentElementOfType(event.target, "TH");
        if (th) {
            return getChildIndex(th);
        }
    }
    return null;
}

export function getClickedRowIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const tr = findParentElementOfType(event.target, "TR");
        if (tr && tr.parentElement && tr.parentElement.tagName === "TBODY") {
            return getChildIndex(tr);
        }
    }
    return null;
}

function findParentElementOfType(element: Element | null, tagName: string) {
    let e: Element | null = element;
    while (e && e.tagName !== tagName) {
        e = e.parentElement;
    }
    return e;
}

function getChildIndex(element: Node) {
    let e: Node | null = element;
    let count = 0;
    while (e && e.previousSibling) {
        e = e.previousSibling;
        count++;
    }
    return count;
}
