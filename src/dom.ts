export function renderChildNodes(parent: HTMLElement, children: HTMLElement[]) {
    let index = 0;
    for (const child of children) {
        appendOrReplaceChild(parent, child, index++);
    }
    trimChildNodes(parent, children.length);
}

function appendOrReplaceChild(parent: HTMLElement, child: HTMLElement, index: number) {
    if (index < parent.childElementCount) {
        // Replace existing child
        const childToReplace = parent.childNodes[index];
        parent.replaceChild(child, childToReplace);
    } else if (index === parent.childElementCount) {
        // Append next child
        parent.appendChild(child);
    } else {
        // Append out of bounds, invariant violated
        throw new Error("child index out of bounds");
    }
}

function trimChildNodes(parent: HTMLElement, trimTo: number) {
    while (parent.childElementCount > trimTo) {
        parent.removeChild(parent.lastChild!);
    }
}
