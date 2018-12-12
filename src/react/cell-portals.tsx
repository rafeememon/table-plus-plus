import * as React from "react";
import { ITableModel, ITableView, ObjectWithKey } from "../types";
import { Portal } from "./portal";
import { IReactColumn } from "./types";

export interface ICellPortalsProps<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> {
    model: ITableModel<Key, Row, KeyType>;
    view: ITableView;
}

export class CellPortals<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
> extends React.PureComponent<ICellPortalsProps<Key, Row, KeyType>> {

    public componentDidMount() {
        this.props.model.addRowListener(this.handleModelChanged);
    }

    public componentWillUnmount() {
        this.props.model.removeRowListener(this.handleModelChanged);
    }

    public render() {
        const { rows, columns, keyField } = this.props.model;
        const rowElements = this.getRowElements();
        if (rows.length !== rowElements.length) {
            throw new Error("invariant violated: row and element lengths differ");
        }
        const portals = [];
        // tslint:disable-next-line:prefer-for-of
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const rowElement = rowElements[rowIndex];
            // tslint:disable-next-line:prefer-for-of
            for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                const column: IReactColumn<Row> = columns[columnIndex];
                if (column.renderData) {
                    const key = `${row[keyField]}:${column.key}`;
                    const content = column.renderData(row);
                    const container = rowElement.childNodes[columnIndex] as Element;
                    portals.push(<Portal key={key} content={content} container={container} />);
                }
            }
        }
        return portals;
    }

    private getRowElements() {
        const tbody = this.props.view.element.querySelector("tbody");
        if (!tbody) {
            throw new Error("tbody not found");
        }
        return tbody.childNodes as NodeListOf<Element>;
    }

    private handleModelChanged = () => {
        this.forceUpdate();
    }

}
