import { HeaderClickHandler, IColumn, ISort, ITableModel, ITableSectionView, ObjectWithKey } from "../types";
import { findParentElementOfType, getChildIndex, replaceWith } from "./dom";

export const SORT_ARROW_CLASSNAME = "tpp-sort-arrow";

function getClickedHeaderIndex(event: MouseEvent) {
    if (event.target instanceof Element) {
        const th = findParentElementOfType(event.target, "TH");
        return th && getChildIndex(th);
    } else {
        return null;
    }
}

export class TableHeaderView<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> implements ITableSectionView {

    public element: HTMLTableSectionElement;
    private thElements: Map<IColumn<R>, HTMLTableHeaderCellElement> = new Map();

    public constructor(
        private model: ITableModel<K, R, V>,
        private clickHandler: HeaderClickHandler,
    ) {
        this.element = this.createTheadElement();
        this.model.addColumnListener(this.handleColumnsChanged);
        this.model.addSortListener(this.handleSortChanged);
    }

    public destroy() {
        this.destroyTheadElement(this.element);
        this.model.removeColumnListener(this.handleColumnsChanged);
        this.model.removeSortListener(this.handleSortChanged);
    }

    private handleColumnsChanged = () => {
        this.rerender();
    }

    private handleSortChanged = (newSort: ISort | undefined, oldSort: ISort | undefined) => {
        const keys = new Set<string>();
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

    private rerender() {
        const newElement = this.createTheadElement();
        this.destroyTheadElement(this.element);
        replaceWith(this.element, newElement);
        this.element = newElement;
    }

    private createTheadElement() {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        const newThElements = new Map<IColumn<R>, HTMLTableHeaderCellElement>();

        for (const column of this.model.columns) {
            const oldTh = this.thElements.get(column);
            const newTh = oldTh ? oldTh.cloneNode(true) as HTMLTableHeaderCellElement : this.createThElement(column);
            this.decorateThElement(column, newTh);
            tr.appendChild(newTh);
            newThElements.set(column, newTh);
        }

        this.thElements = newThElements;
        thead.appendChild(tr);
        thead.addEventListener("click", this.handleClick);
        return thead;
    }

    private destroyTheadElement(thead: HTMLTableSectionElement) {
        thead.removeEventListener("click", this.handleClick);
    }

    private createThElement(column: IColumn<R>) {
        const th = document.createElement("th");
        th.style.boxSizing = "border-box";
        th.setAttribute("data-column-key", column.key);
        th.appendChild(document.createTextNode(column.label || ""));
        return th;
    }

    private decorateThElement(column: IColumn<R>, th = this.thElements.get(column)) {
        if (!th) {
            return;
        }

        const { sort } = this.model;
        const oldArrow = th.getElementsByClassName(SORT_ARROW_CLASSNAME).item(0);

        const ascending = sort != null && sort.key === column.key && sort.ascending;
        const visible = sort != null && sort.key === column.key;

        const arrow = document.createElement("span");
        arrow.classList.add(SORT_ARROW_CLASSNAME);
        arrow.appendChild(document.createTextNode(ascending ? " ↑" : " ↓"));
        if (!visible) {
            arrow.style.visibility = "hidden";
        }

        if (oldArrow) {
            th.replaceChild(arrow, oldArrow);
        } else {
            th.appendChild(arrow);
        }
    }

}
