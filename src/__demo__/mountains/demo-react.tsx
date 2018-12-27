import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "../../react";
import { ISort } from "../../types";
import { MOUNTAIN_COLUMNS } from "./columns";
import { FOURTEENERS, ULTRAS } from "./data";
import { IMountain } from "./types";

import "../styles.css";

type Toggle = "FOURTEENERS" | "ULTRAS";

interface IState {
    toggle: Toggle;
    selection: Set<string>;
    sort: ISort<IMountain> | undefined;
}

class Demo extends React.PureComponent<{}, IState> {

    public state: IState = {
        toggle: "FOURTEENERS",
        selection: new Set(),
        sort: undefined,
    };

    public render() {
        const { toggle, selection, sort } = this.state;
        return (
            <>
                <h1>California Mountains</h1>
                <h3>
                    {"Toggle: "}
                    {this.renderToggle("FOURTEENERS", "Fourteeners")}
                    {" | "}
                    {this.renderToggle("ULTRAS", "Ultras")}
                </h3>
                <Table
                    keyField="name"
                    rows={toggle === "FOURTEENERS" ? FOURTEENERS : ULTRAS}
                    columns={MOUNTAIN_COLUMNS}
                    selection={selection}
                    selectionMode="multi"
                    sort={sort}
                    onSelect={this.handleSelect}
                    onSort={this.handleSort}
                />
            </>
        );
    }

    private renderToggle(toggle: Toggle, text: string) {
        if (toggle !== this.state.toggle) {
            return (
                <a href="#" onClick={this.handleClickToggle}>
                    {text}
                </a>
            );
        } else {
            return text;
        }
    }

    private handleClickToggle = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        this.setState({ toggle: this.state.toggle === "FOURTEENERS" ? "ULTRAS" : "FOURTEENERS" });
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
