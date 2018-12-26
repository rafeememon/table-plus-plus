"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("./dom");
var events_1 = require("./events");
var SELECTED_ATTRIBUTE = "data-selected";
var SORT_ARROW_CLASSNAME = "sort-arrow";
function union(set1, set2) {
    var all = new Set(set1);
    set2.forEach(function (el) { return all.add(el); });
    return all;
}
var TableView = /** @class */ (function () {
    function TableView(config) {
        var _this = this;
        this.headerElements = new Map();
        this.rowElements = new Map();
        this.handleRowsChanged = function () {
            _this.renderTbody();
        };
        this.handleColumnsChanged = function () {
            _this.rowElements.clear();
            _this.renderThead();
            _this.renderTbody();
        };
        this.handleSelectionChanged = function (newSelection, oldSelection) {
            var _a = _this.model, keyField = _a.keyField, sortedRows = _a.sortedRows;
            var keysToUpdate = union(newSelection, oldSelection);
            for (var _i = 0, sortedRows_1 = sortedRows; _i < sortedRows_1.length; _i++) {
                var row = sortedRows_1[_i];
                if (keysToUpdate.has(row[keyField])) {
                    _this.decorateRowElement(row);
                }
            }
        };
        this.handleSortChanged = function (newSort, oldSort) {
            var keys = new Set();
            if (newSort) {
                keys.add(newSort.key);
            }
            if (oldSort) {
                keys.add(oldSort.key);
            }
            keys.forEach(function (key) {
                var column = _this.model.columns.find(function (c) { return c.key === key; });
                if (column) {
                    _this.decorateHeaderElement(column);
                }
            });
            _this.renderTbody();
        };
        this.handleClick = function (event) {
            var rowIndex = events_1.getClickedRowIndex(event);
            if (rowIndex != null) {
                _this.rowClickHandler(event, rowIndex);
                return;
            }
            var headerIndex = events_1.getClickedHeaderIndex(event);
            if (headerIndex != null) {
                _this.headerClickHandler(event, headerIndex);
                return;
            }
        };
        this.model = config.model;
        this.rowClickHandler = config.onClickRow;
        this.headerClickHandler = config.onClickHeader;
        this.element = document.createElement("table");
        var theadElement = document.createElement("thead");
        this.theadTrElement = document.createElement("tr");
        this.tbodyElement = document.createElement("tbody");
        theadElement.appendChild(this.theadTrElement);
        this.element.appendChild(theadElement);
        this.element.appendChild(this.tbodyElement);
        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.model.addSortListener(this.handleSortChanged);
        this.element.addEventListener("click", this.handleClick);
        this.renderThead();
        this.renderTbody();
    }
    TableView.prototype.destroy = function () {
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.model.removeSortListener(this.handleSortChanged);
        this.element.removeEventListener("click", this.handleClick);
    };
    TableView.prototype.renderThead = function () {
        var _this = this;
        var removedColumns = new Set(this.headerElements.keys());
        var headerElementList = [];
        for (var _i = 0, _a = this.model.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            var headerElement = this.headerElements.get(column);
            if (!headerElement) {
                headerElement = this.createHeaderElement(column);
                this.headerElements.set(column, headerElement);
            }
            this.decorateHeaderElement(column, headerElement);
            headerElementList.push(headerElement);
            removedColumns.delete(column);
        }
        removedColumns.forEach(function (removedColumn) {
            _this.headerElements.delete(removedColumn);
        });
        dom_1.renderChildNodes(this.theadTrElement, headerElementList);
    };
    TableView.prototype.createHeaderElement = function (column) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(column.label));
        return th;
    };
    TableView.prototype.renderTbody = function () {
        var _this = this;
        var removedRows = new Set(this.rowElements.keys());
        var rowElementList = [];
        for (var _i = 0, _a = this.model.sortedRows; _i < _a.length; _i++) {
            var row = _a[_i];
            var rowElement = this.rowElements.get(row);
            if (!rowElement) {
                rowElement = this.createRowElement(row);
                this.rowElements.set(row, rowElement);
            }
            this.decorateRowElement(row, rowElement);
            rowElementList.push(rowElement);
            removedRows.delete(row);
        }
        removedRows.forEach(function (removedRow) {
            _this.rowElements.delete(removedRow);
        });
        dom_1.renderChildNodes(this.tbodyElement, rowElementList);
    };
    TableView.prototype.createRowElement = function (row) {
        var tr = document.createElement("tr");
        for (var _i = 0, _a = this.model.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            var td = document.createElement("td");
            var content = column.renderData ? column.renderData(row) :
                column.getData ? column.getData(row) : String(row[column.key]);
            var contentNode = typeof content === "string" ? document.createTextNode(content) : content;
            td.appendChild(contentNode);
            tr.appendChild(td);
        }
        return tr;
    };
    TableView.prototype.decorateRowElement = function (row, tr) {
        if (tr === void 0) { tr = this.rowElements.get(row); }
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
    TableView.prototype.decorateHeaderElement = function (column, th) {
        if (th === void 0) { th = this.headerElements.get(column); }
        if (!th) {
            return;
        }
        var sort = this.model.sort;
        var oldArrow = th.getElementsByClassName(SORT_ARROW_CLASSNAME).item(0);
        if (sort && sort.key === column.key) {
            var arrow = document.createElement("span");
            arrow.classList.add(SORT_ARROW_CLASSNAME);
            arrow.appendChild(document.createTextNode(sort.ascending ? " ↑" : " ↓"));
            if (oldArrow) {
                th.replaceChild(arrow, oldArrow);
            }
            else {
                th.appendChild(arrow);
            }
        }
        else if (oldArrow) {
            oldArrow.remove();
        }
    };
    return TableView;
}());
exports.TableView = TableView;
