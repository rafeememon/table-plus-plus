import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "../../react";
import { REACT_COLUMNS } from "./columns-react";
import { FOURTEENERS } from "./data";
import { IMountain } from "./types";

import "./styles.css";

interface IState {
    rows: IMountain[];
    selection: Set<string>;
}

class Demo extends React.PureComponent<{}, IState> {

    public state: IState = {
        rows: FOURTEENERS,
        selection: new Set(),
    };

    public componentDidMount() {
        setTimeout(() => {
            this.setState({ rows: FOURTEENERS.slice(0, 5) });
        }, 2000);
    }

    public render() {
        return (
            <>
                <h1>California Fourteeners</h1>
                <Table
                    keyField="name"
                    rows={this.state.rows}
                    columns={REACT_COLUMNS}
                    selection={this.state.selection}
                    selectionMode="multi"
                    onSelect={this.handleSelect}
                />
            </>
        );
    }

    private handleSelect = (selection: Set<string>) => {
        this.setState({ selection });
    }

}

const fixture = document.createElement("div");
document.body.appendChild(fixture);
ReactDOM.render(<Demo />, fixture);
