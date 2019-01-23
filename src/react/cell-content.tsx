import * as React from "react";
import * as ReactDOM from "react-dom";
import { ITableModel, ITableView, ObjectWithKey } from "../..";
import { removeAllChildren } from "../view/dom";
import { IReactColumn } from "./types";

interface ICellContentProps<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    model: ITableModel<Key, Row, KeyType>;
    view: ITableView;
}

interface ICellContentState {
    portals: React.ReactPortal[];
}

export class CellContent<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> extends React.PureComponent<ICellContentProps<Key, Row, KeyType>, ICellContentState> {

    public state: ICellContentState = {
        portals: [],
    };

    private domObserver?: MutationObserver;
    private tbodyElement: HTMLElement | null = null;

    public componentDidMount() {
        this.domObserver = new MutationObserver(this.handleMutation);
        this.domObserver.observe(this.props.view.element, { childList: true });
    }

    public componentWillUnmount() {
        if (this.domObserver) {
            this.domObserver.disconnect();
        }
    }

    public render() {
        return this.state.portals;
    }

    private handleMutation = () => {
        const newTbodyElement = this.props.view.element.querySelector("tbody");
        if (newTbodyElement !== this.tbodyElement) {
            this.createPortals();
            this.tbodyElement = newTbodyElement;
        }
    }

    private createPortals() {
        const { columns, sortedRows, keyField } = this.props.model;

        const rowElements = this.props.view.element.querySelectorAll("tbody tr");
        if (rowElements.length !== sortedRows.length) {
            throw new Error("invariant violated, lengths differ");
        }

        const portals = [];

        for (let rowIndex = 0; rowIndex < rowElements.length; rowIndex++) {
            const row = sortedRows[rowIndex];
            const rowKey = row[keyField];
            const rowElement = rowElements[rowIndex];
            for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                const column: IReactColumn<Row> = columns[columnIndex];
                if (!column.reactRenderData) {
                    continue;
                }
                const child = column.reactRenderData(row);
                const container = rowElement.childNodes[columnIndex] as Element;
                const portalKey = `${JSON.stringify(rowKey)}:${column.key}`;
                removeAllChildren(container);
                // FIXME: Content is recreated, not remounted, and component state is lost.
                // See: https://github.com/facebook/react/issues/13044
                portals.push(ReactDOM.createPortal(child, container, portalKey));
            }
        }

        this.setState({ portals });
    }

}
