"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findIndex(elements, fn) {
    for (var index = 0; index < elements.length; index++) {
        if (fn(elements[index])) {
            return index;
        }
    }
    return null;
}
var MultiSelectionAdapter = /** @class */ (function () {
    function MultiSelectionAdapter(model, handler) {
        var _this = this;
        this.model = model;
        this.handler = handler;
        this.handleRowClick = function (event, rowIndex) {
            if (event.getModifierState("Shift")) {
                _this.handleShiftRowClick(rowIndex);
            }
            else if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                _this.handleControlRowClick(rowIndex);
            }
            else {
                _this.handleNormalRowClick(rowIndex);
            }
        };
    }
    MultiSelectionAdapter.prototype.handleNormalRowClick = function (rowIndex) {
        var _a = this.model, sortedRows = _a.sortedRows, keyField = _a.keyField;
        this.anchorKey = sortedRows[rowIndex][keyField];
        this.handler(new Set([this.anchorKey]));
    };
    MultiSelectionAdapter.prototype.handleShiftRowClick = function (rowIndex) {
        var _this = this;
        if (this.anchorKey !== undefined) {
            var _a = this.model, sortedRows = _a.sortedRows, keyField_1 = _a.keyField;
            var anchorIndex = findIndex(sortedRows, function (r) { return r[keyField_1] === _this.anchorKey; });
            if (anchorIndex != null) {
                var newSelection = new Set();
                var min = Math.min(rowIndex, anchorIndex);
                var max = Math.max(rowIndex, anchorIndex);
                for (var index = min; index <= max; index++) {
                    newSelection.add(sortedRows[index][keyField_1]);
                }
                this.handler(newSelection);
            }
            else {
                this.handleNormalRowClick(rowIndex);
            }
        }
        else {
            this.handleNormalRowClick(rowIndex);
        }
    };
    MultiSelectionAdapter.prototype.handleControlRowClick = function (rowIndex) {
        var _a = this.model, sortedRows = _a.sortedRows, keyField = _a.keyField, selection = _a.selection;
        this.anchorKey = sortedRows[rowIndex][keyField];
        var newSelection = new Set(selection);
        if (newSelection.has(this.anchorKey)) {
            newSelection.delete(this.anchorKey);
        }
        else {
            newSelection.add(this.anchorKey);
        }
        this.handler(newSelection);
    };
    return MultiSelectionAdapter;
}());
exports.MultiSelectionAdapter = MultiSelectionAdapter;
