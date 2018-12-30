"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var body_1 = require("./body");
var header_1 = require("./header");
var TableView = /** @class */ (function () {
    function TableView(config) {
        this.headerView = new header_1.TableHeaderView(config.model, config.onClickHeader);
        this.bodyView = new body_1.TableBodyView(config.model, config.onClickRow);
        this.element = document.createElement("table");
        this.element.appendChild(this.headerView.element);
        this.element.appendChild(this.bodyView.element);
    }
    TableView.prototype.initialize = function () {
        // no-op
    };
    TableView.prototype.destroy = function () {
        this.headerView.destroy();
        this.bodyView.destroy();
    };
    return TableView;
}());
exports.TableView = TableView;
