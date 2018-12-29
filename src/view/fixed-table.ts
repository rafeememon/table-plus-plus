import { ITableSectionView, ITableView, IViewConfig, ObjectWithKey } from "../types";
import { TableBodyView } from "./body";
import { applyStyles, createTableDiv } from "./dom";
import { TableHeaderView } from "./header";

export const FIXED_TABLE_HEADER_CLASSNAME = "tpp-fixed-table-header";
export const FIXED_TABLE_BODY_CLASSNAME = "tpp-fixed-table-body";

// const SCROLLBAR_ALLOWANCE_PX = 20;

const ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
};

const HEADER_ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    flexShrink: "0",
    overflowX: "hidden",
    width: "100%",
};

const BODY_ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    flexGrow: "1",
    overflowY: "auto",
    width: "100%",
};

export class FixedTableView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableView {

    public element: HTMLElement;
    private headerElement: HTMLElement;
    private bodyElement: HTMLElement;
    private headerView: ITableSectionView;
    private bodyView: ITableSectionView;
    private observer: MutationObserver;

    public constructor(config: IViewConfig<Key, Row, KeyType>) {
        this.element = document.createElement("div");
        applyStyles(this.element, ELEMENT_STYLES);

        this.headerView = new TableHeaderView(config.model, config.onClickHeader);
        this.headerElement = document.createElement("div");
        // this.headerElement.classList.add(FIXED_TABLE_HEADER_CLASSNAME);
        applyStyles(this.headerElement, HEADER_ELEMENT_STYLES);
        const headerTable = createTableDiv("table");
        applyStyles(headerTable, { width: "100%" });
        headerTable.appendChild(this.headerView.element);
        this.headerElement.appendChild(headerTable);
        // this.headerElement.appendChild(this.headerView.element);
        this.element.appendChild(this.headerElement);

        this.bodyView = new TableBodyView(config.model, config.onClickRow);
        this.bodyElement = document.createElement("div");
        // this.bodyElement.classList.add(FIXED_TABLE_BODY_CLASSNAME);
        applyStyles(this.bodyElement, BODY_ELEMENT_STYLES);
        const bodyTable = createTableDiv("table");
        applyStyles(bodyTable, { width: "100%" });
        bodyTable.appendChild(this.bodyView.element);
        this.bodyElement.appendChild(bodyTable);
        // this.bodyElement.appendChild(this.bodyView.element);
        this.element.appendChild(this.bodyElement);

        this.observer = new MutationObserver(this.handleMutation);
        this.observer.observe(this.element, { childList: true, subtree: true });

        this.bodyElement.addEventListener("scroll", this.updateScroll);

        this.updateWidths();
        this.updateScroll();
    }

    public destroy() {
        this.headerView.destroy();
        this.bodyView.destroy();
        this.observer.disconnect();
        this.bodyElement.removeEventListener("scroll", this.updateScroll);
    }

    private handleMutation = () => {
        this.updateWidths();
        this.updateScroll();
    }

    private updateWidths() {
        const headerCells = this.headerView.element.querySelectorAll(".tpp-header-cell") as
            NodeListOf<HTMLElement>;
        const bodyCells = this.bodyView.element.querySelectorAll(".tpp-body-row:first-child .tpp-body-cell") as
            NodeListOf<HTMLElement>;
        const numCells = Math.min(headerCells.length, bodyCells.length);

        for (let index = 0; index < numCells; index++) {
            const headerCell = headerCells[index];
            const bodyCell = bodyCells[index];

            const scrollbarAllowanceWidth = 0; // index === numCells - 1 ? SCROLLBAR_ALLOWANCE_PX : 0;
            const headerCellWidth = headerCell.clientWidth - scrollbarAllowanceWidth;
            const bodyCellWidth = bodyCell.clientWidth;
            const maxWidth = Math.max(headerCellWidth, bodyCellWidth);

            applyStyles(headerCell, { minWidth: `${maxWidth + scrollbarAllowanceWidth}px` });
            applyStyles(bodyCell, { minWidth: `${maxWidth}px` });
        }
    }

    private updateScroll = () => {
        this.headerElement.scrollLeft = this.bodyElement.scrollLeft;
    }

}
