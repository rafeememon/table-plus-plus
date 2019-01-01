"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function expandWidths(widths, containerWidth) {
    var widthSum = sum(widths);
    if (widthSum >= containerWidth) {
        return widths;
    }
    var scale = containerWidth / widthSum;
    var scaledWidths = [];
    var scaledSum = 0;
    for (var index = 0; index < widths.length; index++) {
        var scaledWidth = void 0;
        if (index === widths.length - 1) {
            scaledWidth = containerWidth - scaledSum;
        }
        else {
            var width = widths[index];
            scaledWidth = Math.max(Math.floor(scale * width), width);
        }
        scaledWidths.push(scaledWidth);
        scaledSum += scaledWidth;
    }
    return scaledWidths;
}
exports.expandWidths = expandWidths;
function sum(nums) {
    var result = 0;
    for (var _i = 0, nums_1 = nums; _i < nums_1.length; _i++) {
        var num = nums_1[_i];
        result += num;
    }
    return result;
}
exports.sum = sum;
function union(set1, set2) {
    var all = new Set(set1);
    set2.forEach(function (el) { return all.add(el); });
    return all;
}
exports.union = union;
