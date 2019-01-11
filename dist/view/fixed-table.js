"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var erdMaker = require("element-resize-detector");
var body_1 = require("./body");
var dom_1 = require("./dom");
var header_1 = require("./header");
var math_1 = require("./math");
var erd = erdMaker({ callOnAdd: false });
var HEADER_ELEMENT_CLASSNAME = "tpp-fixed-table-header";
var BODY_ELEMENT_CLASSNAME = "tpp-fixed-table-body";
var ELEMENT_STYLES = {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    display: "flex",
    flexDirection: "column",
};
var HEADER_ELEMENT_STYLES = {
    flexShrink: "0",
    overflowX: "hidden",
    width: "100%",
};
var BODY_ELEMENT_STYLES = {
    flexGrow: "1",
    overflowY: "auto",
    width: "100%",
};
var FixedTableView = /** @class */ (function () {
    function FixedTableView(config) {
        var _this = this;
        this.handleMutation = function () {
            _this.updateWidths();
            _this.updateScroll();
        };
        this.handleResize = function () {
            _this.updateWidths();
        };
        this.updateScroll = function () {
            _this.headerElement.scrollLeft = _this.bodyElement.scrollLeft;
        };
        this.element = document.createElement("div");
        dom_1.applyStyles(this.element, ELEMENT_STYLES);
        this.headerView = new header_1.TableHeaderView(config.model, config.onClickHeader);
        this.headerElement = document.createElement("div");
        this.headerElement.classList.add(HEADER_ELEMENT_CLASSNAME);
        dom_1.applyStyles(this.headerElement, HEADER_ELEMENT_STYLES);
        this.headerTable = document.createElement("table");
        this.headerTable.appendChild(this.headerView.element);
        this.headerElement.appendChild(this.headerTable);
        this.element.appendChild(this.headerElement);
        this.bodyView = new body_1.TableBodyView(config.model, config.onClickRow);
        this.bodyElement = document.createElement("div");
        this.bodyElement.classList.add(BODY_ELEMENT_CLASSNAME);
        dom_1.applyStyles(this.bodyElement, BODY_ELEMENT_STYLES);
        var bodyTable = document.createElement("table");
        bodyTable.appendChild(this.bodyView.element);
        this.bodyElement.appendChild(bodyTable);
        this.element.appendChild(this.bodyElement);
        this.domObserver = new MutationObserver(this.handleMutation);
        this.domObserver.observe(this.element, { childList: true, subtree: true });
        this.bodyElement.addEventListener("scroll", this.updateScroll);
        erd.listenTo(this.element, this.handleResize);
        this.updateWidths();
        this.updateScroll();
    }
    FixedTableView.prototype.initialize = function () {
        this.updateWidths();
        this.updateScroll();
        this.scrollSelectedIntoView();
    };
    FixedTableView.prototype.destroy = function () {
        this.headerView.destroy();
        this.bodyView.destroy();
        this.domObserver.disconnect();
        this.bodyElement.removeEventListener("scroll", this.updateScroll);
        erd.uninstall(this.element);
    };
    FixedTableView.prototype.updateWidths = function () {
        var headerCells = this.headerView.element.querySelectorAll("tr:first-child th");
        var bodyCells = this.bodyView.element.querySelectorAll("tr:first-child td");
        var numCells = Math.min(headerCells.length, bodyCells.length);
        var widths = [];
        for (var index = 0; index < numCells; index++) {
            headerCells[index].style.minWidth = null;
            bodyCells[index].style.minWidth = null;
            var headerCellWidth = headerCells[index].getBoundingClientRect().width;
            var bodyCellWidth = bodyCells[index].getBoundingClientRect().width;
            widths.push(Math.max(headerCellWidth, bodyCellWidth));
        }
        var expandedWidths = math_1.expandWidths(widths, this.bodyElement.clientWidth);
        for (var index = 0; index < numCells; index++) {
            var width = expandedWidths[index] + "px";
            headerCells[index].style.minWidth = width;
            bodyCells[index].style.minWidth = width;
        }
        this.headerTable.style.paddingRight = this.getScrollbarWidth() + "px";
    };
    FixedTableView.prototype.getScrollbarWidth = function () {
        var _a = this.bodyElement, clientWidth = _a.clientWidth, offsetWidth = _a.offsetWidth;
        return offsetWidth - clientWidth;
    };
    FixedTableView.prototype.scrollSelectedIntoView = function () {
        var element = this.bodyView.element.querySelector("tr[data-selected]");
        if (element) {
            element.scrollIntoView({
                block: "center",
                inline: "start",
            });
        }
    };
    return FixedTableView;
}());
exports.FixedTableView = FixedTableView;
