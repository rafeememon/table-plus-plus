import { MultiSelectionAdapter, SheetView, SortAdapter, TableModel } from "../..";
import { COLUMNS } from "./columns";
import { fetchEarthquakesFromPastMonth } from "./data";

import "../styles-sheet.css";

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

const view = new SheetView({
    model,
    onClickRow: selectionAdapter.handleRowClick,
    onClickHeader: sortAdapter.handleHeaderClick,
});

const container = document.createElement("div");
container.classList.add("demo-sheet-container");

const header = document.createElement("div");
header.classList.add("demo-sheet-header");
const headerText = document.createElement("h1");
headerText.appendChild(document.createTextNode("All earthquakes in the past month"));
header.appendChild(headerText);
container.appendChild(header);

const content = document.createElement("div");
content.classList.add("demo-sheet-content");
content.appendChild(view.element);
container.appendChild(content);

document.body.appendChild(container);
view.initialize();

fetchEarthquakesFromPastMonth().then((response) => {
    const features = response.features.map((f) => f.properties);
    model.setRows(features);
    setTimeout(() => model.setSort({key: "mag", ascending: false}), 2000);
});
