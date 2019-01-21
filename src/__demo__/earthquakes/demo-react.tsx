import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "../../react";
import { ISort } from "../../types";
import { COLUMNS_REACT } from "./columns-react";
import { fetchEarthquakes } from "./data";
import { IGeoJsonFeatureProperties } from "./types";

import "../styles.css";

interface IState {
    rows: IGeoJsonFeatureProperties[];
    selection: Set<string>;
    sort: ISort<IGeoJsonFeatureProperties> | undefined;
}

class Demo extends React.PureComponent<{}, IState> {

    public state: IState = {
        rows: [],
        selection: new Set(),
        sort: undefined,
    };

    public componentDidMount() {
        fetchEarthquakes().then((response) => {
            const rows = response.features.map((feature) => feature.properties);
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
                    columns={COLUMNS_REACT}
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

    private handleSort = (sort: ISort<IGeoJsonFeatureProperties>) => {
        this.setState({ sort });
    }

}

const fixture = document.createElement("div");
document.body.appendChild(fixture);
ReactDOM.render(<Demo />, fixture);
