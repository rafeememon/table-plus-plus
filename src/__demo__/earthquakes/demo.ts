import { MultiSelectionAdapter, SortAdapter, TableModel, TableView } from "../..";
import { COLUMNS } from "./columns";
import { fetchEarthquakes } from "./data";

import "./styles.css";

const model = new TableModel({
    keyField: "code",
    rows: [],
    columns: COLUMNS,
    selection: new Set<string>(),
});

const selectionAdapter = new MultiSelectionAdapter(model, (newSelection) => {
    model.setSelection(newSelection);
});

const sortAdapter = new SortAdapter(model, (newSort) => {
    model.setSort(newSort);
});

const view = new TableView({
    model,
    onClickRow: selectionAdapter.handleRowClick,
    onClickHeader: sortAdapter.handleHeaderClick,
});

const header = document.createElement("h1");
header.appendChild(document.createTextNode("All earthquakes in the past day"));
document.body.appendChild(header);
document.body.appendChild(view.element);

fetchEarthquakes().then((response) => {
    const features = response.features.map((f) => f.properties);
    model.setRows(features);
});
