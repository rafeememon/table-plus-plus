import { ITableModel, ObjectWithKey } from "../../types";
import { getCellText, renderCellContent } from "../body";
import { applyStyles } from "../dom";
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
};

const ROW_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
    position: "relative",
    width: "auto",
};

const OVERSCAN = 10;

export class SheetBodyView<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> {

    public element: HTMLElement;

    private rowContainer: HTMLElement;
    private rowElements: Map<number, HTMLElement> = new Map();
    // private rowHeight: number | null = null;
    private rowHeight = 18.5;
    private textMeasurer: TextMeasurer | null = null;
    private columnWidths: number[] = [];
    private lastRange?: RowRange;

    public constructor(private model: ITableModel<K, R, V>) {
        this.element = document.createElement("div");
        applyStyles(this.element, ELEMENT_STYLES);
        this.element.addEventListener("scroll", this.handleScroll, false);

        this.rowContainer = document.createElement("div");
        applyStyles(this.rowContainer, ROW_CONTAINER_STYLES);
        this.element.appendChild(this.rowContainer);
    }

    public initialize() {
        this.updateContainerHeight();
        this.updateColumnWidths();
        this.updateVisibleRows();

        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSortListener(this.handleSortChanged);
        this.element.addEventListener("scroll", this.handleScroll, { passive: true });
    }

    public destroy() {
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSortListener(this.handleSortChanged);
        this.element.removeEventListener("scroll", this.handleScroll);
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

    private handleScroll = () => {
        this.updateVisibleRows();
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

        const [lastStart, lastEnd] = this.lastRange || [Infinity, -Infinity];

        // Add newly-visible rows
        for (let k = currentStart; k <= currentEnd; k++) {
            if (k < lastStart || k > lastEnd) {
                const el = this.createRowElement(k);
                this.rowElements.set(k, el);
                this.rowContainer.appendChild(el);
            }
        }

        // Remove newly-hidden rows
        for (let k = lastStart; k <= lastEnd; k++) {
            if (k < currentStart || k > currentEnd) {
                const el = this.rowElements.get(k);
                if (el) {
                    this.rowElements.delete(k);
                    this.rowContainer.removeChild(el);
                }
            }
        }

        this.lastRange = currentRange;
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

    private createRowElement(rowIndex: number) {
        const { sortedRows, columns } = this.model;
        const rowEl = document.createElement("div");
        rowEl.classList.add("tpp-sheet-row");
        rowEl.style.position = "absolute";
        rowEl.style.display = "flex";
        rowEl.style.top = `${rowIndex * this.rowHeight}px`;

        let totalWidth = 0;
        for (let k = 0; k < columns.length; k++) {
            const column = columns[k];
            const cellEl = document.createElement("div");
            cellEl.setAttribute("data-column-key", column.key);
            cellEl.style.flex = `0 1 ${this.columnWidths[k]}px`;
            cellEl.style.overflow = "hidden";
            cellEl.style.whiteSpace = "nowrap";
            cellEl.appendChild(renderCellContent(sortedRows[rowIndex], column));
            rowEl.appendChild(cellEl);
            totalWidth += this.columnWidths[k];
        }

        rowEl.style.width = `${totalWidth}px`;
        return rowEl;
    }

    private getFirstVisibleRowIndex() {
        return Math.floor(this.element.scrollTop / this.rowHeight);
    }

    private getNumVisibleRows() {
        return Math.ceil(this.element.clientHeight / this.rowHeight) + 1;
    }

    private updateColumnWidths() {
        // this.columnWidths = this.getColumnWidths();
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
