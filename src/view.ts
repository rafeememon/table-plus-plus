import { renderChildNodes } from "./dom";
import { IColumn, ITableModel, ITableView, IViewConfig, ObjectWithKey, RowClickHandler } from "./types";

const SELECTED_ATTRIBUTE = "data-selected";

function union<T>(set1: Set<T>, set2: Set<T>) {
    const all = new Set(set1);
    set2.forEach((el) => all.add(el));
    return all;
}

function findParentElementOfType(element: Element | null, tagName: string) {
    let e: Element | null = element;
    while (e && e.tagName !== tagName) {
        e = e.parentElement;
    }
    return e;
}

function getChildIndex(element: Node) {
    let e: Node | null = element;
    let count = 0;
    while (e && e.previousSibling) {
        e = e.previousSibling;
        count++;
    }
    return count;
}

function getClickedRowIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const tr = findParentElementOfType(event.target, "TR");
        const tbody = findParentElementOfType(tr, "TBODY");
        if (tbody && tr) {
            return getChildIndex(tr);
        }
    }
    return null;
}

export class TableView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableView {

    public element: HTMLTableElement;

    private model: ITableModel<Key, Row, KeyType>;
    private rowClickHandler: RowClickHandler;

    private theadTrElement: HTMLTableRowElement;
    private tbodyElement: HTMLTableSectionElement;
    private headerElements: Map<IColumn<Row>, HTMLTableHeaderCellElement> = new Map();
    private rowElements: Map<Row, HTMLTableRowElement> = new Map();

    public constructor(config: IViewConfig<Key, Row, KeyType>) {
        this.model = config.model;
        this.rowClickHandler = config.onClickRow;

        this.element = document.createElement("table");
        const theadElement = document.createElement("thead");
        this.theadTrElement = document.createElement("tr");
        this.tbodyElement = document.createElement("tbody");
        theadElement.appendChild(this.theadTrElement);
        this.element.appendChild(theadElement);
        this.element.appendChild(this.tbodyElement);

        this.model.addRowListener(this.handleRowsChanged);
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSelectionListener(this.handleSelectionChanged);
        this.element.addEventListener("click", this.handleClick);

        this.renderThead();
        this.renderTbody();
    }

    public setRowClickHandler(handler: RowClickHandler) {
        this.rowClickHandler = handler;
    }

    public destroy() {
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.element.removeEventListener("click", this.handleClick);
    }

    private handleRowsChanged = () => {
        this.renderTbody();
    }

    private handleColumnsChanged = () => {
        this.rowElements.clear();
        this.renderThead();
        this.renderTbody();
    }

    private handleSelectionChanged = (newSelection: Set<KeyType>, oldSelection: Set<KeyType>) => {
        const { keyField, rows } = this.model;
        const keysToUpdate = union(newSelection, oldSelection);
        for (const row of rows) {
            if (keysToUpdate.has(row[keyField])) {
                this.decorateRowElement(row);
            }
        }
    }

    private handleClick = (event: MouseEvent) => {
        const rowIndex = getClickedRowIndex(event);
        if (rowIndex != null) {
            this.rowClickHandler(event, rowIndex);
        }
    }

    private renderThead() {
        const headerElements = this.model.columns.map(this.getOrCreateHeaderElement);
        renderChildNodes(this.theadTrElement, headerElements);
    }

    private getOrCreateHeaderElement = (column: IColumn<Row>) => {
        const existingTh = this.headerElements.get(column);
        if (existingTh) {
            return existingTh;
        }

        const th = document.createElement("th");
        th.appendChild(document.createTextNode(column.label));
        this.headerElements.set(column, th);
        return th;
    }

    private renderTbody() {
        const rowElements = this.model.rows.map(this.getOrCreateRowElement);
        renderChildNodes(this.tbodyElement, rowElements);
    }

    private getOrCreateRowElement = (row: Row) => {
        const existingTr = this.rowElements.get(row);
        if (existingTr) {
            this.decorateRowElement(row, existingTr);
            return existingTr;
        }

        const tr = document.createElement("tr");
        for (const column of this.model.columns) {
            const td = document.createElement("td");
            const content = column.displayData ? column.displayData(row) :
                column.getData ? column.getData(row) : String(row[column.key]);
            const contentNode = typeof content === "string" ? document.createTextNode(content) : content;
            td.appendChild(contentNode);
            tr.appendChild(td);
        }
        this.decorateRowElement(row, tr);
        this.rowElements.set(row, tr);
        return tr;
    }

    private decorateRowElement(row: Row, tr = this.rowElements.get(row)) {
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
