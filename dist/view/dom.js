"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replaceWith(oldChild, newChild) {
    var parentNode = oldChild.parentNode;
    if (parentNode) {
        parentNode.replaceChild(newChild, oldChild);
    }
}
exports.replaceWith = replaceWith;
function findParentElementOfType(element, tagName) {
    var e = element;
    while (e && e.tagName !== tagName) {
        e = e.parentElement;
    }
    return e;
}
exports.findParentElementOfType = findParentElementOfType;
function getChildIndex(element) {
    var e = element;
    var count = 0;
    while (e && e.previousSibling) {
        e = e.previousSibling;
        count++;
    }
    return count;
}
exports.getChildIndex = getChildIndex;
function removeAllChildren(node) {
    while (node.lastChild) {
        node.removeChild(node.lastChild);
    }
}
exports.removeAllChildren = removeAllChildren;
function applyStyles(element, styles) {
    for (var key in styles) { // tslint:disable-line:forin
        var value = styles[key];
        if (value != null) {
            element.style[key] = value;
        }
    }
}
exports.applyStyles = applyStyles;
