import { ITableModel, ITableSectionView, ObjectWithKey, RowClickHandler } from "../types";
import { findParentElementOfType, getChildIndex, replaceWith } from "./dom";

const SELECTED_ATTRIBUTE = "data-selected";

function union<T>(set1: Set<T>, set2: Set<T>) {
    const all = new Set(set1);
    set2.forEach((el) => all.add(el));
    return all;
}

function getClickedRowIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const tr = findParentElementOfType(event.target, "TR");
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

    public element: HTMLTableSectionElement;
    private trElements: Map<Row, HTMLTableRowElement> = new Map();

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private clickHandler: RowClickHandler,
    ) {
        this.element = this.createTbodyElement();
        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.model.addSortListener(this.handleSortChanged);
    }

    public destroy() {
        this.destroyTbodyElement(this.element);
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.model.removeSortListener(this.handleSortChanged);
    }

    private handleRowsChanged = () => {
        this.rerender();
    }

    private handleColumnsChanged = () => {
        this.trElements.clear();
        this.rerender();
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
        this.rerender();
    }

    private handleClick = (event: MouseEvent) => {
        const rowIndex = getClickedRowIndex(event);
        if (rowIndex != null) {
            this.clickHandler(event, rowIndex);
        }
    }

    private rerender() {
        const newElement = this.createTbodyElement();
        this.destroyTbodyElement(this.element);
        replaceWith(this.element, newElement);
        this.element = newElement;
    }

    private createTbodyElement() {
        const tbody = document.createElement("tbody");
        const newTrElements = new Map<Row, HTMLTableRowElement>();

        for (const row of this.model.sortedRows) {
            const oldTr = this.trElements.get(row);
            const newTr = oldTr ? oldTr.cloneNode(true) as HTMLTableRowElement : this.createTrElement(row);
            this.decorateTrElement(row, newTr);
            tbody.appendChild(newTr);
            newTrElements.set(row, newTr);
        }

        this.trElements = newTrElements;
        tbody.addEventListener("click", this.handleClick);
        return tbody;
    }

    private destroyTbodyElement(tbody: HTMLTableSectionElement) {
        tbody.removeEventListener("click", this.handleClick);
    }

    private createTrElement(row: Row) {
        const tr = document.createElement("tr");
        for (const column of this.model.columns) {
            const td = document.createElement("td");
            td.style.boxSizing = "border-box";
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
