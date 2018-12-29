import { ITableModel, ITableSectionView, ObjectWithKey, RowClickHandler } from "../types";
import { createTableDiv, findParentElementWithClassName, getChildIndex, replaceWith } from "./dom";

const BODY_ROW_CLASSNAME = "tpp-body-row";
const BODY_CELL_CLASSNAME = "tpp-body-cell";
const SELECTED_ATTRIBUTE = "data-selected";

function union<T>(set1: Set<T>, set2: Set<T>) {
    const all = new Set(set1);
    set2.forEach((el) => all.add(el));
    return all;
}

function getClickedRowIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const tr = findParentElementWithClassName(event.target, BODY_ROW_CLASSNAME);
        return tr && getChildIndex(tr);
    } else {
        return null;
    }
}

export class TableBodyView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableSectionView {

    public element: HTMLElement;
    private rowElements: Map<Row, HTMLElement> = new Map();

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private clickHandler: RowClickHandler,
    ) {
        this.element = this.createRowGroup();
        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.model.addSortListener(this.handleSortChanged);
    }

    public destroy() {
        this.destroyRowGroup(this.element);
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.model.removeSortListener(this.handleSortChanged);
    }

    private handleRowsChanged = () => {
        this.rerender();
    }

    private handleColumnsChanged = () => {
        this.rowElements.clear();
        this.rerender();
    }

    private handleSelectionChanged = (newSelection: Set<KeyType>, oldSelection: Set<KeyType>) => {
        const { keyField, sortedRows } = this.model;
        const keysToUpdate = union(newSelection, oldSelection);
        for (const row of sortedRows) {
            if (keysToUpdate.has(row[keyField])) {
                this.decorateRowElement(row);
            }
        }
    }

    private handleSortChanged = () => {
        this.rerender();
    }

    private handleClick = (event: MouseEvent) => {
        const rowIndex = getClickedRowIndex(event);
        if (rowIndex != null) {
            this.clickHandler(event, rowIndex);
        }
    }

    private rerender() {
        const newElement = this.createRowGroup();
        this.destroyRowGroup(this.element);
        replaceWith(this.element, newElement);
        this.element = newElement;
    }

    private createRowGroup() {
        const group = createTableDiv("table-row-group");
        const newRowElements = new Map<Row, HTMLElement>();

        for (const row of this.model.sortedRows) {
            const oldRow = this.rowElements.get(row);
            const newRow = oldRow ? oldRow.cloneNode(true) as HTMLElement : this.createRowElement(row);
            this.decorateRowElement(row, newRow);
            group.appendChild(newRow);
            newRowElements.set(row, newRow);
        }

        this.rowElements = newRowElements;
        group.addEventListener("click", this.handleClick);
        return group;
    }

    private destroyRowGroup(group: HTMLElement) {
        group.removeEventListener("click", this.handleClick);
    }

    private createRowElement(row: Row) {
        const rowElement = createTableDiv("table-row");
        rowElement.classList.add(BODY_ROW_CLASSNAME);
        for (const column of this.model.columns) {
            const cellElement = createTableDiv("table-cell");
            cellElement.classList.add(BODY_CELL_CLASSNAME);
            const content = column.renderData ? column.renderData(row) :
                column.getData ? column.getData(row) : String(row[column.key]);
            const contentNode = typeof content === "string" ? document.createTextNode(content) : content;
            cellElement.appendChild(contentNode);
            rowElement.appendChild(cellElement);
        }
        return rowElement;
    }

    private decorateRowElement(row: Row, rowElement = this.rowElements.get(row)) {
        if (!rowElement) {
            return;
        }

        if (this.model.isSelected(row)) {
            rowElement.setAttribute(SELECTED_ATTRIBUTE, "true");
        } else {
            rowElement.removeAttribute(SELECTED_ATTRIBUTE);
        }
    }

}
