import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "../../react";
import { REACT_COLUMNS } from "./columns-react";
import { fetchEarthquakes } from "./data";
import { IGeoJsonFeatureProperties } from "./types";

import "./styles.css";

interface IState {
    rows: IGeoJsonFeatureProperties[];
    selection: Set<string>;
}

class Demo extends React.PureComponent<{}, IState> {

    public state: IState = {
        rows: [],
        selection: new Set(),
    };

    public componentDidMount() {
        fetchEarthquakes().then((response) => {
            const rows = response.features.map((f) => f.properties);
            this.setState({ rows });
        });
    }

    public render() {
        return (
            <>
                <h1>All earthquakes in the past day</h1>
                <Table
                    keyField="code"
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
