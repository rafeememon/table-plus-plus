import { ITableSectionView, ITableView, IViewConfig } from "../types";
import { TableBodyView } from "./body";
import { applyStyles } from "./dom";
import { TableHeaderView } from "./header";
import { expandWidths } from "./math";

const HEADER_ELEMENT_CLASSNAME = "tpp-fixed-table-header";
const BODY_ELEMENT_CLASSNAME = "tpp-fixed-table-body";

const ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    display: "flex",
    flexDirection: "column"
};

const HEADER_ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    flexShrink: "0",
    overflowX: "hidden",
    width: "100%"
};

const BODY_ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    flexGrow: "1",
    overflowY: "auto",
    width: "100%"
};

export class FixedTableView<K extends keyof R, R extends Record<K, V>, V = R[K]> implements ITableView {
    public element: HTMLElement;
    private headerElement: HTMLElement;
    private headerTable: HTMLElement;
    private bodyElement: HTMLElement;
    private headerView: ITableSectionView;
    private bodyView: ITableSectionView;
    private domObserver: MutationObserver;

    public constructor(config: IViewConfig<K, R, V>) {
        this.element = document.createElement("div");
        applyStyles(this.element, ELEMENT_STYLES);

        this.headerView = new TableHeaderView(config.model, config.onClickHeader);
        this.headerElement = document.createElement("div");
        this.headerElement.classList.add(HEADER_ELEMENT_CLASSNAME);
        applyStyles(this.headerElement, HEADER_ELEMENT_STYLES);
        this.headerTable = document.createElement("table");
        this.headerTable.appendChild(this.headerView.element);
        this.headerElement.appendChild(this.headerTable);
        this.element.appendChild(this.headerElement);

        this.bodyView = new TableBodyView(config.model, config.onClickRow);
        this.bodyElement = document.createElement("div");
        this.bodyElement.classList.add(BODY_ELEMENT_CLASSNAME);
        applyStyles(this.bodyElement, BODY_ELEMENT_STYLES);
        const bodyTable = document.createElement("table");
        bodyTable.appendChild(this.bodyView.element);
        this.bodyElement.appendChild(bodyTable);
        this.element.appendChild(this.bodyElement);

        this.domObserver = new MutationObserver(this.handleMutation);
        this.domObserver.observe(this.element, { childList: true, subtree: true });
        this.bodyElement.addEventListener("scroll", this.updateScroll);
        window.addEventListener("resize", this.handleResize);

        this.updateWidths();
        this.updateScroll();
    }

    public initialize() {
        this.updateWidths();
        this.updateScroll();
        this.scrollSelectedIntoView();
    }

    public destroy() {
        this.headerView.destroy();
        this.bodyView.destroy();
        this.domObserver.disconnect();
        this.bodyElement.removeEventListener("scroll", this.updateScroll);
        window.removeEventListener("resize", this.handleResize);
    }

    private handleMutation = () => {
        this.updateWidths();
        this.updateScroll();
    };

    private handleResize = () => {
        this.updateWidths();
    };

    private updateWidths() {
        const headerCells = this.headerView.element.querySelectorAll("tr:first-child th") as NodeListOf<
            HTMLTableHeaderCellElement
        >;
        const bodyCells = this.bodyView.element.querySelectorAll("tr:first-child td") as NodeListOf<
            HTMLTableCellElement
        >;
        const numCells = Math.min(headerCells.length, bodyCells.length);
        const widths = [];

        for (let index = 0; index < numCells; index++) {
            headerCells[index].style.minWidth = null;
            bodyCells[index].style.minWidth = null;
            const headerCellWidth = headerCells[index].getBoundingClientRect().width;
            const bodyCellWidth = bodyCells[index].getBoundingClientRect().width;
            widths.push(Math.max(headerCellWidth, bodyCellWidth));
        }

        const expandedWidths = expandWidths(widths, this.bodyElement.clientWidth);

        for (let index = 0; index < numCells; index++) {
            const width = `${expandedWidths[index]}px`;
            headerCells[index].style.minWidth = width;
            bodyCells[index].style.minWidth = width;
        }

        this.headerTable.style.paddingRight = `${this.getScrollbarWidth()}px`;
    }

    private getScrollbarWidth() {
        const { clientWidth, offsetWidth } = this.bodyElement;
        return offsetWidth - clientWidth;
    }

    private updateScroll = () => {
        this.headerElement.scrollLeft = this.bodyElement.scrollLeft;
    };

    private scrollSelectedIntoView() {
        const element = this.bodyView.element.querySelector("tr[data-selected]");
        if (element) {
            element.scrollIntoView({
                block: "center",
                inline: "start"
            });
        }
    }
}
