"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("./dom");
var math_1 = require("./math");
var SELECTED_ATTRIBUTE = "data-selected";
function getClickedRowIndex(event) {
    if (event.target instanceof Element) {
        var tr = dom_1.findParentElementOfType(event.target, "TR");
        return tr && dom_1.getChildIndex(tr);
    }
    else {
        return null;
    }
}
function getClickedColumnIndex(event) {
    if (event.target instanceof Element) {
        var td = dom_1.findParentElementOfType(event.target, "TD");
        return td && dom_1.getChildIndex(td);
    }
    else {
        return null;
    }
}
function renderCellContent(row, column) {
    var textNode = document.createTextNode(getCellText(row, column));
    if (column.getHref) {
        var link = document.createElement("a");
        link.href = column.getHref(row);
        link.appendChild(textNode);
        return link;
    }
    else {
        return textNode;
    }
}
exports.renderCellContent = renderCellContent;
function getCellText(row, column) {
    var key = column.key, getText = column.getText, getSortableText = column.getSortableText;
    if (getText) {
        return getText(row);
    }
    else if (getSortableText) {
        return getSortableText(row);
    }
    else if (key in row) {
        var value = row[key];
        return value != null ? String(value) : "";
    }
    else {
        return "";
    }
}
exports.getCellText = getCellText;
var TableBodyView = /** @class */ (function () {
    function TableBodyView(model, clickHandler) {
        var _this = this;
        this.model = model;
        this.clickHandler = clickHandler;
        this.trElements = new Map();
        this.handleRowsChanged = function () {
            _this.rerender();
        };
        this.handleColumnsChanged = function () {
            _this.trElements.clear();
            _this.rerender();
        };
        this.handleSelectionChanged = function (newSelection, oldSelection) {
            var _a = _this.model, keyField = _a.keyField, sortedRows = _a.sortedRows;
            var keysToUpdate = math_1.union(newSelection, oldSelection);
            for (var _i = 0, sortedRows_1 = sortedRows; _i < sortedRows_1.length; _i++) {
                var row = sortedRows_1[_i];
                if (keysToUpdate.has(row[keyField])) {
                    _this.decorateTrElement(row);
                }
            }
        };
        this.handleSortChanged = function () {
            _this.rerender();
        };
        this.handleClick = function (event) {
            var rowIndex = getClickedRowIndex(event);
            var columnIndex = getClickedColumnIndex(event);
            if (rowIndex == null || columnIndex == null) {
                return;
            }
            var column = _this.model.columns[columnIndex];
            if (column.onClick) {
                column.onClick(_this.model.sortedRows[rowIndex]);
            }
            else {
                _this.clickHandler(event, rowIndex);
            }
        };
        this.element = this.createTbodyElement();
        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.model.addSortListener(this.handleSortChanged);
    }
    TableBodyView.prototype.destroy = function () {
        this.destroyTbodyElement(this.element);
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.model.removeSortListener(this.handleSortChanged);
    };
    TableBodyView.prototype.rerender = function () {
        var newElement = this.createTbodyElement();
        this.destroyTbodyElement(this.element);
        dom_1.replaceWith(this.element, newElement);
        this.element = newElement;
    };
    TableBodyView.prototype.createTbodyElement = function () {
        var tbody = document.createElement("tbody");
        var newTrElements = new Map();
        for (var _i = 0, _a = this.model.sortedRows; _i < _a.length; _i++) {
            var row = _a[_i];
            var oldTr = this.trElements.get(row);
            var newTr = oldTr ? oldTr.cloneNode(true) : this.createTrElement(row);
            this.decorateTrElement(row, newTr);
            tbody.appendChild(newTr);
            newTrElements.set(row, newTr);
        }
        this.trElements = newTrElements;
        tbody.addEventListener("click", this.handleClick);
        return tbody;
    };
    TableBodyView.prototype.destroyTbodyElement = function (tbody) {
        tbody.removeEventListener("click", this.handleClick);
    };
    TableBodyView.prototype.createTrElement = function (row) {
        var tr = document.createElement("tr");
        for (var _i = 0, _a = this.model.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            var td = document.createElement("td");
            td.style.boxSizing = "border-box";
            td.setAttribute("data-column-key", column.key);
            td.appendChild(renderCellContent(row, column));
            tr.appendChild(td);
        }
        return tr;
    };
    TableBodyView.prototype.decorateTrElement = function (row, tr) {
        if (tr === void 0) { tr = this.trElements.get(row); }
        if (!tr) {
            return;
        }
        if (this.model.isSelected(row)) {
            tr.setAttribute(SELECTED_ATTRIBUTE, "true");
        }
        else {
            tr.removeAttribute(SELECTED_ATTRIBUTE);
        }
    };
    return TableBodyView;
}());
exports.TableBodyView = TableBodyView;
