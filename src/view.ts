import { renderChildNodes } from "./dom";
import {
    HeaderClickHandler,
    IColumn,
    ISort,
    ITableModel,
    ITableView,
    IViewConfig,
    ObjectWithKey,
    RowClickHandler,
} from "./types";

const SELECTED_ATTRIBUTE = "data-selected";
const SORT_ARROW_CLASSNAME = "sort-arrow";

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

function getClickedHeaderIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const th = findParentElementOfType(event.target, "TH");
        if (th) {
            return getChildIndex(th);
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
    private headerClickHandler: HeaderClickHandler;

    private theadTrElement: HTMLTableRowElement;
    private tbodyElement: HTMLTableSectionElement;
    private headerElements: Map<IColumn<Row>, HTMLTableHeaderCellElement> = new Map();
    private rowElements: Map<Row, HTMLTableRowElement> = new Map();

    public constructor(config: IViewConfig<Key, Row, KeyType>) {
        this.model = config.model;
        this.rowClickHandler = config.onClickRow;
        this.headerClickHandler = config.onClickHeader;

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
        this.model.addSortListener(this.handleSortChanged);
        this.element.addEventListener("click", this.handleClick);

        this.renderThead();
        this.renderTbody();
    }

    public destroy() {
        this.model.removeRowListener(this.handleRowsChanged);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSelectionListener(this.handleSelectionChanged);
        this.model.removeSortListener(this.handleSortChanged);
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
        const { keyField, sortedRows } = this.model;
        const keysToUpdate = union(newSelection, oldSelection);
        for (const row of sortedRows) {
            if (keysToUpdate.has(row[keyField])) {
                this.decorateRowElement(row);
            }
        }
    }

    private handleSortChanged = (newSort: ISort<Row> | undefined, oldSort: ISort<Row> | undefined) => {
        const keys = new Set<keyof Row>();
        if (newSort) {
            keys.add(newSort.key);
        }
        if (oldSort) {
            keys.add(oldSort.key);
        }
        keys.forEach((key) => {
            const column = this.model.columns.find((c) => c.key === key);
            if (column) {
                this.decorateHeaderElement(column);
            }
        });

        this.renderTbody();
    }

    private handleClick = (event: MouseEvent) => {
        const rowIndex = getClickedRowIndex(event);
        if (rowIndex != null) {
            this.rowClickHandler(event, rowIndex);
            return;
        }

        const headerIndex = getClickedHeaderIndex(event);
        if (headerIndex != null) {
            this.headerClickHandler(event, headerIndex);
            return;
        }
    }

    private renderThead() {
        const removedColumns = new Set(this.headerElements.keys());
        const headerElementList = [];

        for (const column of this.model.columns) {
            let headerElement = this.headerElements.get(column);
            if (!headerElement) {
                headerElement = this.createHeaderElement(column);
                this.headerElements.set(column, headerElement);
            }
            this.decorateHeaderElement(column, headerElement);
            headerElementList.push(headerElement);
            removedColumns.delete(column);
        }

        removedColumns.forEach((removedColumn) => {
            this.headerElements.delete(removedColumn);
        });

        renderChildNodes(this.theadTrElement, headerElementList);
    }

    private createHeaderElement(column: IColumn<Row>) {
        const th = document.createElement("th");
        th.appendChild(document.createTextNode(column.label));
        return th;
    }

    private renderTbody() {
        const removedRows = new Set(this.rowElements.keys());
        const rowElementList = [];

        for (const row of this.model.sortedRows) {
            let rowElement = this.rowElements.get(row);
            if (!rowElement) {
                rowElement = this.createRowElement(row);
                this.rowElements.set(row, rowElement);
            }
            this.decorateRowElement(row, rowElement);
            rowElementList.push(rowElement);
            removedRows.delete(row);
        }

        removedRows.forEach((removedRow) => {
            this.rowElements.delete(removedRow);
        });

        renderChildNodes(this.tbodyElement, rowElementList);
    }

    private createRowElement(row: Row) {
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

    private decorateHeaderElement(column: IColumn<Row>, th = this.headerElements.get(column)) {
        if (!th) {
            return;
        }

        const { sort } = this.model;
        const oldArrow = th.getElementsByClassName(SORT_ARROW_CLASSNAME).item(0);
        if (sort && sort.key === column.key) {
            const arrow = document.createElement("span");
            arrow.classList.add(SORT_ARROW_CLASSNAME);
            arrow.appendChild(document.createTextNode(sort.ascending ? " ↑" : " ↓"));
            if (oldArrow) {
                th.replaceChild(arrow, oldArrow);
            } else {
                th.appendChild(arrow);
            }
        } else if (oldArrow) {
            oldArrow.remove();
        }
    }

}
