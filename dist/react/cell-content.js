"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var dom_1 = require("../view/dom");
var CellContent = /** @class */ (function (_super) {
    __extends(CellContent, _super);
    function CellContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            portals: [],
        };
        _this.tbodyElement = null;
        _this.handleMutation = function () {
            var newTbodyElement = _this.props.view.element.querySelector("tbody");
            if (newTbodyElement !== _this.tbodyElement) {
                _this.createPortals();
                _this.tbodyElement = newTbodyElement;
            }
        };
        return _this;
    }
    CellContent.prototype.componentDidMount = function () {
        this.domObserver = new MutationObserver(this.handleMutation);
        this.domObserver.observe(this.props.view.element, { childList: true });
    };
    CellContent.prototype.componentWillUnmount = function () {
        if (this.domObserver) {
            this.domObserver.disconnect();
        }
    };
    CellContent.prototype.render = function () {
        return this.state.portals;
    };
    CellContent.prototype.createPortals = function () {
        var _a = this.props.model, columns = _a.columns, sortedRows = _a.sortedRows, keyField = _a.keyField;
        var rowElements = this.props.view.element.querySelectorAll("tbody tr");
        if (rowElements.length !== sortedRows.length) {
            throw new Error("invariant violated, lengths differ");
        }
        var portals = [];
        for (var rowIndex = 0; rowIndex < rowElements.length; rowIndex++) {
            var row = sortedRows[rowIndex];
            var rowKey = row[keyField];
            var rowElement = rowElements[rowIndex];
            for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                var column = columns[columnIndex];
                if (!column.reactRenderData) {
                    continue;
                }
                var child = column.reactRenderData(row);
                var container = rowElement.childNodes[columnIndex];
                var portalKey = JSON.stringify(rowKey) + ":" + column.key;
                dom_1.removeAllChildren(container);
                // FIXME: Content is recreated, not remounted, and component state is lost.
                // See: https://github.com/facebook/react/issues/13044
                portals.push(ReactDOM.createPortal(child, container, portalKey));
            }
        }
        this.setState({ portals: portals });
    };
    return CellContent;
}(React.PureComponent));
exports.CellContent = CellContent;
