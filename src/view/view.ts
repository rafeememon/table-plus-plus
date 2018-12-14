import {
    HeaderClickHandler,
    HeaderDecorator,
    IColumn,
    ISort,
    ITableModel,
    ITableView,
    IViewConfig,
    ObjectWithKey,
    RowClickHandler,
    RowDecorator,
} from "../types";
import { selectionDecorator, sortDecorator } from "./decorators";
import { renderChildNodes } from "./dom";
import { getClickedHeaderIndex, getClickedRowIndex } from "./events";

function union<T>(set1: Set<T>, set2: Set<T>) {
    const all = new Set(set1);
    set2.forEach((el) => all.add(el));
    return all;
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
    private headerDecorators: Array<HeaderDecorator<Row>>;
    private rowDecorators: Array<RowDecorator<Row>>;
    private headerElements: Map<IColumn<Row>, HTMLTableHeaderCellElement> = new Map();
    private rowElements: Map<Row, HTMLTableRowElement> = new Map();

    public constructor(config: IViewConfig<Key, Row, KeyType>) {
        this.model = config.model;
        this.rowClickHandler = config.onClickRow;
        this.headerClickHandler = config.onClickHeader;

        this.headerDecorators = [
            sortDecorator(this.model),
        ];
        this.rowDecorators = [
            selectionDecorator(this.model),
        ];

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
        const headerElements = this.model.columns.map(this.getOrCreateHeaderElement);
        renderChildNodes(this.theadTrElement, headerElements);
    }

    private getOrCreateHeaderElement = (column: IColumn<Row>) => {
        const existingTh = this.headerElements.get(column);
        if (existingTh) {
            this.decorateHeaderElement(column, existingTh);
            return existingTh;
        }

        const th = document.createElement("th");
        th.appendChild(document.createTextNode(column.label));
        this.decorateHeaderElement(column, th);
        this.headerElements.set(column, th);
        return th;
    }

    private decorateHeaderElement(column: IColumn<Row>, th = this.headerElements.get(column)) {
        if (!th) {
            return;
        }
        for (const headerDecorator of this.headerDecorators) {
            headerDecorator(column, th);
        }
    }

    private renderTbody() {
        const rowElements = this.model.sortedRows.map(this.getOrCreateRowElement);
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
            const content = column.renderData ? column.renderData(row) :
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
        for (const rowDecorator of this.rowDecorators) {
            rowDecorator(row, tr);
        }
    }

}
