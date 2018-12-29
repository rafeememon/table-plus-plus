import { ITableSectionView, ITableView, IViewConfig, ObjectWithKey } from "../types";
import { TableBodyView } from "./body";
import { createTableDiv } from "./dom";
import { TableHeaderView } from "./header";

const TABLE_CLASSNAME = "tpp-table";

export class TableView<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> implements ITableView {

    public element: HTMLElement;
    private headerView: ITableSectionView;
    private bodyView: ITableSectionView;

    public constructor(config: IViewConfig<Key, Row, KeyType>) {
        this.headerView = new TableHeaderView(config.model, config.onClickHeader);
        this.bodyView = new TableBodyView(config.model, config.onClickRow);

        this.element = createTableDiv("table");
        this.element.classList.add(TABLE_CLASSNAME);
        this.element.appendChild(this.headerView.element);
        this.element.appendChild(this.bodyView.element);
    }

    public destroy() {
        this.headerView.destroy();
        this.bodyView.destroy();
    }

}
