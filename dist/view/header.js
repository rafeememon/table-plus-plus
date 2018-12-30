"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("./dom");
var SORT_ARROW_CLASSNAME = "tpp-sort-arrow";
function getClickedHeaderIndex(event) {
    if (event.target instanceof Element) {
        var th = dom_1.findParentElementOfType(event.target, "TH");
        return th && dom_1.getChildIndex(th);
    }
    else {
        return null;
    }
}
var TableHeaderView = /** @class */ (function () {
    function TableHeaderView(model, clickHandler) {
        var _this = this;
        this.model = model;
        this.clickHandler = clickHandler;
        this.thElements = new Map();
        this.handleColumnsChanged = function () {
            _this.rerender();
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
                    _this.decorateThElement(column);
                }
            });
        };
        this.handleClick = function (event) {
            var headerIndex = getClickedHeaderIndex(event);
            if (headerIndex != null) {
                _this.clickHandler(event, headerIndex);
            }
        };
        this.element = this.createTheadElement();
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSortListener(this.handleSortChanged);
    }
    TableHeaderView.prototype.destroy = function () {
        this.destroyTheadElement(this.element);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSortListener(this.handleSortChanged);
    };
    TableHeaderView.prototype.rerender = function () {
        var newElement = this.createTheadElement();
        this.destroyTheadElement(this.element);
        dom_1.replaceWith(this.element, newElement);
        this.element = newElement;
    };
    TableHeaderView.prototype.createTheadElement = function () {
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        var newThElements = new Map();
        for (var _i = 0, _a = this.model.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            var oldTh = this.thElements.get(column);
            var newTh = oldTh ? oldTh.cloneNode(true) : this.createThElement(column);
            this.decorateThElement(column, newTh);
            tr.appendChild(newTh);
            newThElements.set(column, newTh);
        }
        this.thElements = newThElements;
        thead.appendChild(tr);
        thead.addEventListener("click", this.handleClick);
        return thead;
    };
    TableHeaderView.prototype.destroyTheadElement = function (thead) {
        thead.removeEventListener("click", this.handleClick);
    };
    TableHeaderView.prototype.createThElement = function (column) {
        var th = document.createElement("th");
        th.style.boxSizing = "border-box";
        th.appendChild(document.createTextNode(column.label));
        return th;
    };
    TableHeaderView.prototype.decorateThElement = function (column, th) {
        if (th === void 0) { th = this.thElements.get(column); }
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
            th.removeChild(oldArrow);
        }
    };
    return TableHeaderView;
}());
exports.TableHeaderView = TableHeaderView;
