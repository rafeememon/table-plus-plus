"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SortAdapter = /** @class */ (function () {
    function SortAdapter(model, handler) {
        var _this = this;
        this.model = model;
        this.handler = handler;
        this.handleHeaderClick = function (_event, headerIndex) {
            var _a = _this.model, columns = _a.columns, sort = _a.sort;
            var key = columns[headerIndex].key;
            var ascending = sort != null && sort.key === key ? !sort.ascending : true;
            _this.handler({ key: key, ascending: ascending });
        };
    }
    return SortAdapter;
}());
exports.SortAdapter = SortAdapter;
function sortBy(elements, getSortValue, ascending) {
    var sortValues = new Map();
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        if (!sortValues.has(element)) {
            sortValues.set(element, getSortValue(element));
        }
    }
    var ascendingFactor = ascending ? 1 : -1;
    return elements.slice(0).sort(function (element1, element2) {
        var value1 = sortValues.get(element1);
        var value2 = sortValues.get(element2);
        return value1 === value2 ? 0 : value1 < value2 ? -ascendingFactor : ascendingFactor;
    });
}
exports.sortBy = sortBy;
