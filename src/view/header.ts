import { HeaderClickHandler, IColumn, ISort, ITableModel, ITableSectionView, ObjectWithKey } from "../types";
import { createTableDiv, findParentElementWithClassName, getChildIndex, replaceWith } from "./dom";

const HEADER_CELL_CLASSNAME = "tpp-header-cell";
const SORT_ARROW_CLASSNAME = "tpp-sort-arrow";

function getClickedHeaderIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const th = findParentElementWithClassName(event.target, HEADER_CELL_CLASSNAME);
        return th && getChildIndex(th);
    } else {
        return null;
    }
}

export class TableHeaderView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableSectionView {

    public element: HTMLElement;
    private cellElements: Map<IColumn<Row>, HTMLElement> = new Map();

    public constructor(
        private model: ITableModel<Key, Row, KeyType>,
        private clickHandler: HeaderClickHandler,
    ) {
        this.element = this.createHeaderGroup();
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSortListener(this.handleSortChanged);
    }

    public destroy() {
        this.destroyHeaderGroup(this.element);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSortListener(this.handleSortChanged);
    }

    private handleColumnsChanged = () => {
        this.rerender();
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
                this.decorateCellElement(column);
            }
        });
    }

    private handleClick = (event: MouseEvent) => {
        const headerIndex = getClickedHeaderIndex(event);
        if (headerIndex != null) {
            this.clickHandler(event, headerIndex);
        }
    }

    private rerender() {
        const newElement = this.createHeaderGroup();
        this.destroyHeaderGroup(this.element);
        replaceWith(this.element, newElement);
        this.element = newElement;
    }

    private createHeaderGroup() {
        const group = createTableDiv("table-header-group");
        const row = createTableDiv("table-row");
        const newCellElements = new Map<IColumn<Row>, HTMLElement>();

        for (const column of this.model.columns) {
            const oldCell = this.cellElements.get(column);
            const newCell = oldCell ? oldCell.cloneNode(true) as HTMLElement : this.createCellElement(column);
            this.decorateCellElement(column, newCell);
            row.appendChild(newCell);
            newCellElements.set(column, newCell);
        }

        this.cellElements = newCellElements;
        group.appendChild(row);
        group.addEventListener("click", this.handleClick);
        return group;
    }

    private destroyHeaderGroup(group: HTMLElement) {
        group.removeEventListener("click", this.handleClick);
    }

    private createCellElement(column: IColumn<Row>) {
        const cell = createTableDiv("table-cell");
        cell.classList.add(HEADER_CELL_CLASSNAME);
        cell.appendChild(document.createTextNode(column.label));
        return cell;
    }

    private decorateCellElement(column: IColumn<Row>, cellElement = this.cellElements.get(column)) {
        if (!cellElement) {
            return;
        }

        const { sort } = this.model;
        const oldArrow = cellElement.getElementsByClassName(SORT_ARROW_CLASSNAME).item(0);
        if (sort && sort.key === column.key) {
            const arrow = document.createElement("span");
            arrow.classList.add(SORT_ARROW_CLASSNAME);
            arrow.appendChild(document.createTextNode(sort.ascending ? " ↑" : " ↓"));
            if (oldArrow) {
                cellElement.replaceChild(arrow, oldArrow);
            } else {
                cellElement.appendChild(arrow);
            }
        } else if (oldArrow) {
            cellElement.removeChild(oldArrow);
        }
    }

}
