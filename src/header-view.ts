import { renderChildNodes } from "./dom";
import { getClickedHeaderIndex } from "./events";
import { HeaderClickHandler, IColumn, ISort, ITableModel, ITableSectionView, ObjectWithKey } from "./types";

const SORT_ARROW_CLASSNAME = "sort-arrow";

export class TableHeaderView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableSectionView {

    public element: HTMLTableSectionElement;
    private trElement: HTMLTableRowElement;
    private thElements: Map<IColumn<Row>, HTMLTableHeaderCellElement> = new Map();

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private clickHandler: HeaderClickHandler,
    ) {
        this.element = document.createElement("thead");
        this.trElement = document.createElement("tr");
        this.element.appendChild(this.trElement);

        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSortListener(this.handleSortChanged);
        this.element.addEventListener("click", this.handleClick);

        this.render();
    }

    public destroy() {
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSortListener(this.handleSortChanged);
        this.element.removeEventListener("click", this.handleClick);
    }

    private handleColumnsChanged = () => {
        this.render();
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
                this.decorateThElement(column);
            }
        });
    }

    private handleClick = (event: MouseEvent) => {
        const headerIndex = getClickedHeaderIndex(event);
        if (headerIndex != null) {
            this.clickHandler(event, headerIndex);
        }
    }

    private render() {
        const removedColumns = new Set(this.thElements.keys());
        const thElementList = [];

        for (const column of this.model.columns) {
            let headerElement = this.thElements.get(column);
            if (!headerElement) {
                headerElement = this.createThElement(column);
                this.thElements.set(column, headerElement);
            }
            this.decorateThElement(column, headerElement);
            thElementList.push(headerElement);
            removedColumns.delete(column);
        }

        removedColumns.forEach((removedColumn) => {
            this.thElements.delete(removedColumn);
        });

        renderChildNodes(this.trElement, thElementList);
    }

    private createThElement(column: IColumn<Row>) {
        const th = document.createElement("th");
        th.appendChild(document.createTextNode(column.label));
        return th;
    }

    private decorateThElement(column: IColumn<Row>, th = this.thElements.get(column)) {
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
