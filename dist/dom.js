"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function renderChildNodes(parent, children) {
    var index = 0;
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        appendOrReplaceChild(parent, child, index++);
    }
    trimChildNodes(parent, children.length);
}
exports.renderChildNodes = renderChildNodes;
function appendOrReplaceChild(parent, child, index) {
    if (index < parent.childElementCount) {
        // Replace existing child
        var childToReplace = parent.childNodes[index];
        if (child !== childToReplace) {
            parent.replaceChild(child, childToReplace);
        }
    }
    else if (index === parent.childElementCount) {
        // Append next child
        parent.appendChild(child);
    }
    else {
        // Append out of bounds, invariant violated
        throw new Error("child index out of bounds");
    }
}
function trimChildNodes(parent, trimTo) {
    while (parent.childElementCount > trimTo) {
        parent.removeChild(parent.lastChild);
    }
}
