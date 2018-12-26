"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sort_1 = require("./sort");
function removeFromArray(elements, element) {
    var index = elements.indexOf(element);
    if (index >= 0) {
        elements.splice(index, 1);
    }
}
var TableModel = /** @class */ (function () {
    function TableModel(config) {
        this.rowListeners = [];
        this.columnListeners = [];
        this.selectionListeners = [];
        this.sortListeners = [];
        this.keyField = config.keyField;
        this.rows = config.rows;
        this.columns = config.columns;
        this.selection = config.selection || new Set();
        this.sort = config.sort;
        this.sortedRows = this.sortRows();
    }
    TableModel.prototype.setRows = function (newRows) {
        var oldRows = this.rows;
        this.rows = newRows;
        this.sortedRows = this.sortRows();
        for (var _i = 0, _a = this.rowListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(newRows, oldRows);
        }
    };
    TableModel.prototype.setColumns = function (newColumns) {
        var oldColumns = this.columns;
        this.columns = newColumns;
        var sort = this.sort;
        if (sort) {
            var oldSortColumn = oldColumns.find(function (c) { return c.key === sort.key; });
            var newSortColumn = newColumns.find(function (c) { return c.key === sort.key; });
            if (oldSortColumn !== newSortColumn) {
                this.sortedRows = this.sortRows();
            }
        }
        for (var _i = 0, _a = this.columnListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(newColumns, oldColumns);
        }
    };
    TableModel.prototype.setSelection = function (newSelection) {
        var oldSelection = this.selection;
        this.selection = newSelection;
        for (var _i = 0, _a = this.selectionListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(newSelection, oldSelection);
        }
    };
    TableModel.prototype.setSort = function (newSort) {
        var oldSort = this.sort;
        this.sort = newSort;
        if (oldSort && newSort && oldSort.key === newSort.key && oldSort.ascending !== newSort.ascending) {
            this.sortedRows.reverse();
        }
        else {
            this.sortedRows = this.sortRows();
        }
        for (var _i = 0, _a = this.sortListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(newSort, oldSort);
        }
    };
    TableModel.prototype.isSelected = function (row) {
        return this.selection.has(row[this.keyField]);
    };
    TableModel.prototype.addRowListener = function (listener) {
        this.rowListeners.push(listener);
    };
    TableModel.prototype.addColumnListener = function (listener) {
        this.columnListeners.push(listener);
    };
    TableModel.prototype.addSelectionListener = function (listener) {
        this.selectionListeners.push(listener);
    };
    TableModel.prototype.addSortListener = function (listener) {
        this.sortListeners.push(listener);
    };
    TableModel.prototype.removeRowListener = function (listener) {
        removeFromArray(this.rowListeners, listener);
    };
    TableModel.prototype.removeColumnListener = function (listener) {
        removeFromArray(this.columnListeners, listener);
    };
    TableModel.prototype.removeSelectionListener = function (listener) {
        removeFromArray(this.selectionListeners, listener);
    };
    TableModel.prototype.removeSortListener = function (listener) {
        removeFromArray(this.sortListeners, listener);
    };
    TableModel.prototype.destroy = function () {
        this.rowListeners = [];
        this.columnListeners = [];
        this.selectionListeners = [];
        this.sortListeners = [];
    };
    TableModel.prototype.sortRows = function () {
        var _a = this, rows = _a.rows, columns = _a.columns, sort = _a.sort;
        if (!sort) {
            return rows;
        }
        var key = sort.key;
        var column = columns.find(function (c) { return c.key === key; });
        if (!column) {
            return rows;
        }
        return sort_1.sortBy(rows, function (row) {
            return column.getSortValue ? column.getSortValue(row)
                : column.getData ? column.getData(row) : row[key];
        }, sort.ascending);
    };
    return TableModel;
}());
exports.TableModel = TableModel;
