import { renderChildNodes } from "./dom";
import { getClickedRowIndex } from "./events";
import { ITableModel, ITableSectionView, ObjectWithKey, RowClickHandler } from "./types";

const SELECTED_ATTRIBUTE = "data-selected";

function union<T>(set1: Set<T>, set2: Set<T>) {
    const all = new Set(set1);
    set2.forEach((el) => all.add(el));
    return all;
}

export class TableBodyView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableSectionView {

    public element: HTMLTableSectionElement;
    private trElements: Map<Row, HTMLTableRowElement> = new Map();

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private clickHandler: RowClickHandler,
    ) {
        this.element = document.createElement("tbody");

        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.model.addSortListener(this.handleSortChanged);
        this.element.addEventListener("click", this.handleClick);

        this.render();
    }

    public destroy() {
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.model.removeSortListener(this.handleSortChanged);
        this.element.removeEventListener("click", this.handleClick);
    }

    private handleRowsChanged = () => {
        this.render();
    }

    private handleColumnsChanged = () => {
        this.trElements.clear();
        this.render();
    }

    private handleSelectionChanged = (newSelection: Set<KeyType>, oldSelection: Set<KeyType>) => {
        const { keyField, sortedRows } = this.model;
        const keysToUpdate = union(newSelection, oldSelection);
        for (const row of sortedRows) {
            if (keysToUpdate.has(row[keyField])) {
                this.decorateTrElement(row);
            }
        }
    }

    private handleSortChanged = () => {
        this.render();
    }

    private handleClick = (event: MouseEvent) => {
        const rowIndex = getClickedRowIndex(event);
        if (rowIndex != null) {
            this.clickHandler(event, rowIndex);
        }
    }

    private render() {
        const removedRows = new Set(this.trElements.keys());
        const rowElementList = [];

        for (const row of this.model.sortedRows) {
            let rowElement = this.trElements.get(row);
            if (!rowElement) {
                rowElement = this.createTrElement(row);
                this.trElements.set(row, rowElement);
            }
            this.decorateTrElement(row, rowElement);
            rowElementList.push(rowElement);
            removedRows.delete(row);
        }

        removedRows.forEach((removedRow) => {
            this.trElements.delete(removedRow);
        });

        renderChildNodes(this.element, rowElementList);
    }

    private createTrElement(row: Row) {
        const tr = document.createElement("tr");
        for (const column of this.model.columns) {
            const td = document.createElement("td");
            const content = column.renderData ? column.renderData(row) :
                column.getData ? column.getData(row) : String(row[column.key]);
            const contentNode = typeof content === "string" ? document.createTextNode(content) : content;
            td.appendChild(contentNode);
            tr.appendChild(td);
        }
        return tr;
    }

    private decorateTrElement(row: Row, tr = this.trElements.get(row)) {
        if (!tr) {
            return;
        }

        if (this.model.isSelected(row)) {
            tr.setAttribute(SELECTED_ATTRIBUTE, "true");
        } else {
            tr.removeAttribute(SELECTED_ATTRIBUTE);
        }
    }

}
