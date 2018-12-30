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
var __1 = require("..");
function createSelectionAdapter(mode, model, handler) {
    switch (mode) {
        case "single":
            return new __1.SingleSelectionAdapter(model, handler);
        case "multi":
            return new __1.MultiSelectionAdapter(model, handler);
        default:
            return __1.NOOP_SELECTION_ADAPTER;
    }
}
var Table = /** @class */ (function (_super) {
    __extends(Table, _super);
    function Table(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.handleRef = function (element) {
            if (element) {
                element.appendChild(_this.view.element);
                _this.view.initialize();
            }
        };
        _this.handleSelect = function (newSelection) {
            var onSelect = _this.props.onSelect;
            if (onSelect) {
                onSelect(newSelection);
            }
        };
        _this.handleSort = function (newSort) {
            var onSort = _this.props.onSort;
            if (onSort) {
                onSort(newSort);
            }
            else if (!("sort" in _this.props)) {
                _this.model.setSort(newSort);
            }
        };
        _this.model = new __1.TableModel({
            keyField: props.keyField,
            rows: props.rows,
            columns: props.columns,
            selection: props.selection,
            sort: props.sort,
        });
        var selectionAdapter = createSelectionAdapter(props.selectionMode, _this.model, _this.handleSelect);
        var sortAdapter = new __1.SortAdapter(_this.model, _this.handleSort);
        var config = {
            model: _this.model,
            onClickRow: selectionAdapter.handleRowClick,
            onClickHeader: sortAdapter.handleHeaderClick,
        };
        _this.view = props.fixed ? new __1.FixedTableView(config) : new __1.TableView(config);
        return _this;
    }
    Table.prototype.componentWillUnmount = function () {
        this.model.destroy();
        this.view.destroy();
    };
    Table.prototype.componentDidUpdate = function (oldProps) {
        var _a = this.props, keyField = _a.keyField, rows = _a.rows, columns = _a.columns, selection = _a.selection, selectionMode = _a.selectionMode, sort = _a.sort, fixed = _a.fixed;
        if (keyField !== oldProps.keyField) {
            throw new Error("changing key field not supported");
        }
        if (rows !== oldProps.rows) {
            this.model.setRows(rows);
        }
        if (columns !== oldProps.columns) {
            this.model.setColumns(columns);
        }
        if (selection !== oldProps.selection) {
            this.model.setSelection(selection || new Set());
        }
        if (selectionMode !== oldProps.selectionMode) {
            throw new Error("changing selection mode not supported");
        }
        if (sort !== oldProps.sort) {
            this.model.setSort(sort);
        }
        if (fixed !== oldProps.fixed) {
            throw new Error("changing fixed mode not supported");
        }
    };
    Table.prototype.render = function () {
        return React.createElement("div", { ref: this.handleRef });
    };
    return Table;
}(React.PureComponent));
exports.Table = Table;
