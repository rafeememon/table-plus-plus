"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getClickedHeaderIndex(event) {
    if (event.target instanceof Element) {
        var th = findParentElementOfType(event.target, "TH");
        if (th) {
            return getChildIndex(th);
        }
    }
    return null;
}
exports.getClickedHeaderIndex = getClickedHeaderIndex;
function getClickedRowIndex(event) {
    if (event.target instanceof Element) {
        var tr = findParentElementOfType(event.target, "TR");
        if (tr && tr.parentElement && tr.parentElement.tagName === "TBODY") {
            return getChildIndex(tr);
        }
    }
    return null;
}
exports.getClickedRowIndex = getClickedRowIndex;
function findParentElementOfType(element, tagName) {
    var e = element;
    while (e && e.tagName !== tagName) {
        e = e.parentElement;
    }
    return e;
}
function getChildIndex(element) {
    var e = element;
    var count = 0;
    while (e && e.previousSibling) {
        e = e.previousSibling;
        count++;
    }
    return count;
}
