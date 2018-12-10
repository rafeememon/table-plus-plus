import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "../../react";
import { COLUMNS } from "./columns";
import { FOURTEENERS } from "./data";

import "./styles.css";

interface IState {
    selection: Set<string>;
}

class Demo extends React.PureComponent<{}, IState> {

    public state: IState = {
        selection: new Set(),
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
