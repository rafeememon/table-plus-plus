import { ITableSectionView, ITableView, IViewConfig, ObjectWithKey } from "../types";
import { TableBodyView } from "./body";
import { TableHeaderView } from "./header";

export class TableView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableView {

    public element: HTMLTableElement;
    public headerView: ITableSectionView;
    public bodyView: ITableSectionView;

    public constructor(config: IViewConfig<Key, Row, KeyType>) {
        this.headerView = new TableHeaderView(config.model, config.onClickHeader);
        this.bodyView = new TableBodyView(config.model, config.onClickRow);

        this.element = document.createElement("table");
        this.element.appendChild(this.headerView.element);
        this.element.appendChild(this.bodyView.element);
    }

    public initialize() {
        // no-op
    }

    public destroy() {
        this.headerView.destroy();
        this.bodyView.destroy();
    }

}
