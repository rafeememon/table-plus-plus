import { ITableModel, ObjectWithKey, RowClickHandler } from "../../types";
import { getCellText, renderCellContent } from "../body";
import { applyStyles, getParentElementAttribute } from "../dom";
import { expandWidths } from "../math";
import { getDerivedFont, TextMeasurer } from "./text-measurer";

type RowRange = [number, number]; // start and end inclusive

const ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    overflow: "auto",
    userSelect: "none",
};

const ROW_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
    position: "relative",
    width: "auto",
};

const OVERSCAN = 10;

const ROW_CLASS_NAME = "tpp-sheet-row";
const CELL_CLASS_NAME = "tpp-sheet-cell";
const ROW_INDEX_ATTRIBUTE = "data-row-index";
const COLUMN_INDEX_ATTRIBUTE = "data-column-index";
const COLUMN_KEY_ATTRIBUTE = "data-column-key";
const SELECTED_ATTRIBUTE = "data-selected";

function getClickedRowIndex(event: MouseEvent) {
    return event.target instanceof Element
        ? parseIntOptional(getParentElementAttribute(event.target, ROW_INDEX_ATTRIBUTE))
        : null;
}

function getClickedColumnIndex(event: MouseEvent) {
    return event.target instanceof Element
        ? parseIntOptional(getParentElementAttribute(event.target, COLUMN_INDEX_ATTRIBUTE))
        : null;
}

function parseIntOptional(text: string | null) {
    return text ? parseInt(text, 10) : null;
}

export class SheetBodyView<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> {

    public element: HTMLElement;

    private rowContainer: HTMLElement;
    private rowElements: Map<R, HTMLElement> = new Map();
    private rowHeight = 18.5;
    // private rowHeight = 1;
    private textMeasurer: TextMeasurer | null = null;
    private columnWidths: number[] = [];
    private lastRange?: RowRange;

    public constructor(
        private model: ITableModel<K, R, V>,
        private clickHandler: RowClickHandler,
    ) {
        this.element = document.createElement("div");
        applyStyles(this.element, ELEMENT_STYLES);
        this.element.addEventListener("scroll", this.handleScroll, false);

        this.rowContainer = document.createElement("div");
        applyStyles(this.rowContainer, ROW_CONTAINER_STYLES);
        this.element.appendChild(this.rowContainer);
    }

    public initialize() {
        // this.initializeMeasurements();
        this.updateContainerHeight();
        this.updateColumnWidths();
        this.updateVisibleRows();

        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSortListener(this.handleSortChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.element.addEventListener("scroll", this.handleScroll, { passive: true });
        this.rowContainer.addEventListener("click", this.handleClick);
    }

    public destroy() {
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSortListener(this.handleSortChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.element.removeEventListener("scroll", this.handleScroll);
        this.rowContainer.removeEventListener("click", this.handleClick);
    }

    private handleRowsChanged = () => {
        this.updateContainerHeight();
        this.updateColumnWidths();
        this.removeAllRows();
        this.updateVisibleRows();
    }

    private handleColumnsChanged = () => {
        this.removeAllRows();
        this.updateVisibleRows();
    }

    private handleSortChanged = () => {
        this.removeAllRows();
        this.updateVisibleRows();
    }

    private handleSelectionChanged = (newSelection: Set<V>, oldSelection: Set<V>) => {
        const { lastRange } = this;
        if (!lastRange) {
            return;
        }
        const { keyField, sortedRows } = this.model;
        const [start, end] = lastRange;
        for (let k = start; k <= end; k++) {
            const row = sortedRows[k];
            const key = row[keyField];
            if (newSelection.has(key) || oldSelection.has(key)) {
                this.decorateRowElement(row);
            }
        }
    }

    private handleScroll = () => {
        this.updateVisibleRows();
    }

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
    }

    private updateContainerHeight() {
        this.rowContainer.style.height = `${this.rowHeight * this.model.sortedRows.length}px`;
    }

    private updateVisibleRows() {
        const currentRange = this.computeVisibleRowRange();
        const [currentStart, currentEnd] = currentRange;
        if (this.lastRange && this.lastRange[0] === currentStart && this.lastRange[1] === currentEnd) {
            return;
        }

        window.requestAnimationFrame(() => {
            const { sortedRows } = this.model;
            const [lastStart, lastEnd] = this.lastRange || [Infinity, -Infinity];
            const removedRowElements = [];

        // Remove newly-hidden rows
            for (let k = lastStart; k <= lastEnd; k++) {
            if (k < currentStart || k > currentEnd) {
                const row = sortedRows[k];
                const el = this.rowElements.get(row);
                if (el) {
                    this.rowElements.delete(row);
                    // this.rowContainer.removeChild(el);
                    removedRowElements.push(el);
                }
            }
        }

        // Add newly-visible rows
            for (let k = currentStart; k <= currentEnd; k++) {
            if (k < lastStart || k > lastEnd) {
                const row = sortedRows[k];
                let el = removedRowElements.pop();
                if (el) {
                    this.reuseRowElement(row, k, el);
                } else {
                    console.log("CREATE");
                    el = this.createRowElement(row, k);
                    this.rowContainer.appendChild(el);
                }
                this.rowElements.set(row, el);
            }
        }

            for (const el of removedRowElements) {
            this.rowContainer.removeChild(el);
        }

            this.lastRange = currentRange;
        });
    }

    private removeAllRows() {
        this.rowElements.forEach((el) => this.rowContainer.removeChild(el));
        this.rowElements = new Map();
        this.lastRange = undefined;
    }

    private computeVisibleRowRange(): RowRange {
        const min = this.getFirstVisibleRowIndex();
        const max = min + this.getNumVisibleRows();
        const start = Math.max(0, min - OVERSCAN);
        const end = Math.min(this.model.sortedRows.length - 1, max + OVERSCAN);
        return [start, end];
    }

    private createRowElement(row: R, index: number) {
        const { columns } = this.model;
        const rowEl = document.createElement("div");
        rowEl.classList.add(ROW_CLASS_NAME);
        rowEl.setAttribute(ROW_INDEX_ATTRIBUTE, `${index}`);
        rowEl.style.position = "absolute";
        rowEl.style.display = "flex";
        rowEl.style.top = `${index * this.rowHeight}px`;

        let totalWidth = 0;

        for (let k = 0; k < columns.length; k++) {
            const column = columns[k];
            const cellEl = document.createElement("div");
            cellEl.classList.add(CELL_CLASS_NAME);
            cellEl.setAttribute(COLUMN_KEY_ATTRIBUTE, column.key);
            cellEl.setAttribute(COLUMN_INDEX_ATTRIBUTE, `${k}`);
            cellEl.style.flex = `0 1 ${this.columnWidths[k]}px`;
            cellEl.style.overflow = "hidden";
            cellEl.style.whiteSpace = "nowrap";
            cellEl.appendChild(renderCellContent(row, column));
            rowEl.appendChild(cellEl);
            totalWidth += this.columnWidths[k];
        }

        rowEl.style.width = `${totalWidth}px`;

        this.decorateRowElement(row, rowEl);

        return rowEl;
    }

    private reuseRowElement(row: R, index: number, rowEl: HTMLElement) {
        const { columns } = this.model;
        rowEl.setAttribute(ROW_INDEX_ATTRIBUTE, `${index}`);
        rowEl.style.top = `${index * this.rowHeight}px`;
        for (let k = 0; k < columns.length; k++) {
            const column = columns[k];
            const cellEl = rowEl.childNodes[k];
            /*
            while (cellEl.lastChild) {
                cellEl.removeChild(cellEl.lastChild);
            }
            cellEl.appendChild(renderCellContent(row, column));
            */
            cellEl.replaceChild(renderCellContent(row, column), cellEl.lastChild!);
        }

        this.decorateRowElement(row, rowEl);
    }

    private decorateRowElement(row: R, rowEl = this.rowElements.get(row)) {
        if (!rowEl) {
            return;
        }

        if (this.model.isSelected(row)) {
            rowEl.setAttribute(SELECTED_ATTRIBUTE, "true");
        } else {
            rowEl.removeAttribute(SELECTED_ATTRIBUTE);
        }
    }

    private getFirstVisibleRowIndex() {
        return Math.floor(this.element.scrollTop / this.rowHeight);
    }

    private getNumVisibleRows() {
        return Math.ceil(this.element.clientHeight / this.rowHeight) + 1;
    }

    private updateColumnWidths() {
        this.columnWidths = expandWidths(this.getColumnWidths(), this.element.clientWidth);
    }

    private getColumnWidths() {
        const { columns, sortedRows } = this.model;
        return columns.map((column) => {
            const widths = sortedRows.map((row) => this.measureWidth(getCellText(row, column)));
            return Math.max(...widths);
        });
    }

    private measureWidth(text: string) {
        if (!this.textMeasurer) {
            const font = getDerivedFont(this.rowContainer);
            this.textMeasurer = new TextMeasurer(font);
        }
        return this.textMeasurer.measureWidth(text);
    }

}
