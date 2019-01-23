import * as React from "react";
import * as ReactDOM from "react-dom";
import { IReactColumn, Table } from "../../react";
import { ISort } from "../../types";
// import { COLUMNS_REACT } from "./columns-react";
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

    private columns: Array<IReactColumn<IGeoJsonFeatureProperties>> = this.getColumns();

    public componentDidMount() {
        fetchEarthquakes().then((response) => {
            const rows = response.features.map((feature) => feature.properties);
            this.setState({ rows: rows.slice(0, 1) });
        });
    }

    public render() {
        return (
            <>
                <h1>All earthquakes in the past day</h1>
                <Table
                    keyField="code"
                    rows={this.state.rows}
                    columns={this.columns}
                    selection={this.state.selection}
                    selectionMode="multi"
                    sort={this.state.sort}
                    // onSelect={this.handleSelect}
                    onSort={this.handleSort}
                />
            </>
        );
    }

    private getColumns(): Array<IReactColumn<IGeoJsonFeatureProperties>> {
        const obj = this;
        return [
            {
                key: "code",
                label: "",
                reactRenderData({code}) {
                    alert("RENDER");
                    return (
                        <input
                            type="checkbox"
                            data-code={code}
                            checked={obj.state.selection.has(code)}
                            onChange={obj.handleChangeCheck}
                        />
                    );
                },
            },
            {
                key: "time",
                label: "Time",
                renderData({time}) {
                    return new Date(time).toLocaleString();
                },
            },
            {
                key: "mag",
                label: "Magnitude",
                reactRenderData({mag}) {
                    const magFixed = mag.toFixed(1);
                    return mag >= 5 ? <strong>{magFixed}</strong> : magFixed;
                },
            },
            {
                key: "place",
                label: "Location",
            },
            {
                key: "url",
                label: "Details",
                reactRenderData({url}) {
                    return <a href={url} target="_blank">Details</a>;
                },
            },
        ];
    }

    private handleSelect = (selection: Set<string>) => {
        this.setState({ selection });
    }

    private handleSort = (sort: ISort<IGeoJsonFeatureProperties>) => {
        this.setState({ sort });
    }

    private handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        alert("change");
        const code = event.target.getAttribute("data-code");
        if (code != null) {
            const newSelection = new Set(this.state.selection);
            if (newSelection.has(code)) {
                newSelection.delete(code);
            } else {
                newSelection.add(code);
            }
            this.setState({ selection: newSelection }, () => {
                this.forceUpdate();
            });
        }
    }

}

const fixture = document.createElement("div");
document.body.appendChild(fixture);
ReactDOM.render(<Demo />, fixture);
