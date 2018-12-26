"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingleSelectionAdapter = /** @class */ (function () {
    function SingleSelectionAdapter(model, handler) {
        var _this = this;
        this.model = model;
        this.handler = handler;
        this.handleRowClick = function (_event, rowIndex) {
            var _a = _this.model, sortedRows = _a.sortedRows, keyField = _a.keyField, selection = _a.selection;
            var key = sortedRows[rowIndex][keyField];
            var newSelection = new Set();
            if (!selection.has(key)) {
                newSelection.add(key);
            }
            _this.handler(newSelection);
        };
    }
    return SingleSelectionAdapter;
}());
exports.SingleSelectionAdapter = SingleSelectionAdapter;
