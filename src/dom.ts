export function replaceWith(oldChild: ChildNode, newChild: ChildNode) {
    const { parentNode } = oldChild;
    if (parentNode) {
        parentNode.replaceChild(newChild, oldChild);
    }
}
