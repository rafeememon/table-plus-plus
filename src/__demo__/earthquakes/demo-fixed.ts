import { FixedTableView, MultiSelectionAdapter, SortAdapter, TableModel } from "../..";
import { COLUMNS } from "./columns";
import { fetchEarthquakes } from "./data";

import "../styles-fixed.css";

const model = new TableModel({
    keyField: "code",
    rows: [],
    columns: COLUMNS,
    selection: new Set<string>()
});

const selectionAdapter = new MultiSelectionAdapter(model, newSelection => {
    model.setSelection(newSelection);
});

const sortAdapter = new SortAdapter(model, newSort => {
    model.setSort(newSort);
});

const view = new FixedTableView({
    model,
    onClickRow: selectionAdapter.handleRowClick,
    onClickHeader: sortAdapter.handleHeaderClick
});

const container = document.createElement("div");
container.classList.add("demo-fixed-page-container");

const header = document.createElement("div");
header.classList.add("demo-fixed-page-header");
const headerText = document.createElement("h1");
headerText.appendChild(document.createTextNode("All earthquakes in the past day"));
header.appendChild(headerText);
container.appendChild(header);

const content = document.createElement("div");
content.classList.add("demo-fixed-page-content");
content.appendChild(view.element);
container.appendChild(content);

document.body.appendChild(container);
view.initialize();

fetchEarthquakes().then(response => {
    const features = response.features.map(f => f.properties);
    model.setRows(features);
});
