import { IColumn, ITableModel, ITableSectionView, ObjectWithKey, RowClickHandler } from "../types";
import { findParentElementOfType, getChildIndex, replaceWith } from "./dom";
import { union } from "./math";

const SELECTED_ATTRIBUTE = "data-selected";

function getClickedRowIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const tr = findParentElementOfType(event.target, "TR");
        return tr && getChildIndex(tr);
    } else {
        return null;
    }
}

function getClickedColumnIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const td = findParentElementOfType(event.target, "TD");
        return td && getChildIndex(td);
    } else {
        return null;
    }
}

export function renderCellContent<R>(row: R, column: IColumn<R>) {
    const textNode = document.createTextNode(getCellText(row, column));
    if (column.getHref) {
        const link = document.createElement("a");
        link.href = column.getHref(row);
        link.appendChild(textNode);
        return link;
    } else {
        return textNode;
    }
}

export function getCellText<R>(row: R, column: IColumn<R>): string {
    const { key, getText, getSortableText } = column;
    if (getText) {
        return getText(row);
    } else if (getSortableText) {
        return getSortableText(row);
    } else if (key in row) {
        const value = row[key as keyof R];
        return value != null ? String(value) : "";
    } else {
        return "";
    }
}

export class TableBodyView<K extends keyof R, R extends ObjectWithKey<K, V>, V = R[K]> implements ITableSectionView {
    public element: HTMLTableSectionElement;
    private trElements: Map<R, HTMLTableRowElement> = new Map();

    public constructor(private model: ITableModel<K, R, V>, private clickHandler: RowClickHandler) {
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
    };

    private handleColumnsChanged = () => {
        this.trElements.clear();
        this.rerender();
    };

    private handleSelectionChanged = (newSelection: Set<V>, oldSelection: Set<V>) => {
        const { keyField, sortedRows } = this.model;
        const keysToUpdate = union(newSelection, oldSelection);
        for (const row of sortedRows) {
            if (keysToUpdate.has(row[keyField])) {
                this.decorateTrElement(row);
            }
        }
    };

    private handleSortChanged = () => {
        this.rerender();
    };

    private handleClick = (event: MouseEvent) => {
        const rowIndex = getClickedRowIndex(event);
        const columnIndex = getClickedColumnIndex(event);
        if (rowIndex == null || columnIndex == null) {
            return;
        }

        const column = this.model.columns[columnIndex];
        if (column.onClick) {
            column.onClick(this.model.sortedRows[rowIndex]);
        } else {
            this.clickHandler(event, rowIndex);
        }
    };

    private rerender() {
        const newElement = this.createTbodyElement();
        this.destroyTbodyElement(this.element);
        replaceWith(this.element, newElement);
        this.element = newElement;
    }

    private createTbodyElement() {
        const tbody = document.createElement("tbody");
        const newTrElements = new Map<R, HTMLTableRowElement>();

        for (const row of this.model.sortedRows) {
            const oldTr = this.trElements.get(row);
            const newTr = oldTr ? (oldTr.cloneNode(true) as HTMLTableRowElement) : this.createTrElement(row);
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

    private createTrElement(row: R) {
        const tr = document.createElement("tr");
        for (const column of this.model.columns) {
            const td = document.createElement("td");
            td.style.boxSizing = "border-box";
            td.setAttribute("data-column-key", column.key);
            td.appendChild(renderCellContent(row, column));
            tr.appendChild(td);
        }
        return tr;
    }

    private decorateTrElement(row: R, tr = this.trElements.get(row)) {
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
