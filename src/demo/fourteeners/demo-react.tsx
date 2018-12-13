import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "../../react";
import { ISort } from "../../types";
import { COLUMNS } from "./columns";
import { FOURTEENERS } from "./data";
import { IMountain } from "./types";

import "./styles.css";

interface IState {
    selection: Set<string>;
    sort: ISort<IMountain> | undefined;
}

class Demo extends React.PureComponent<{}, IState> {

    public state: IState = {
        selection: new Set(),
        sort: undefined,
    };

    public render() {
        return (
            <>
                <h1>California Fourteeners</h1>
                <Table
                    keyField="name"
                    rows={FOURTEENERS}
                    columns={COLUMNS}
                    selection={this.state.selection}
                    selectionMode="multi"
                    sort={this.state.sort}
                    onSelect={this.handleSelect}
                    onSort={this.handleSort}
                />
            </>
        );
    }

    private handleSelect = (selection: Set<string>) => {
        this.setState({ selection });
    }

    private handleSort = (sort: ISort<IMountain>) => {
        this.setState({ sort });
    }

}

const fixture = document.createElement("div");
document.body.appendChild(fixture);
ReactDOM.render(<Demo />, fixture);
