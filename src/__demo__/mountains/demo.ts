import { MultiSelectionAdapter, SortAdapter, TableModel, TableView } from "../..";
import { MOUNTAIN_COLUMNS } from "./columns";
import { FOURTEENERS, ULTRAS } from "./data";
import { IMountain } from "./types";

import "../styles.css";

const model = new TableModel({
    keyField: "name",
    rows: FOURTEENERS,
    columns: MOUNTAIN_COLUMNS,
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

function createToggle(text: string, mountains: IMountain[]) {
    const link = document.createElement("a");
    link.href = "#";
    link.addEventListener("click", (event) => {
        event.preventDefault();
        model.setRows(mountains);
    });
    link.appendChild(document.createTextNode(text));
    return link;
}

const header = document.createElement("h1");
header.appendChild(document.createTextNode("California Mountains"));
document.body.appendChild(header);

const subheader = document.createElement("h3");
subheader.appendChild(document.createTextNode("Toggle: "));
subheader.appendChild(createToggle("Fourteeners", FOURTEENERS));
subheader.appendChild(document.createTextNode(" | "));
subheader.appendChild(createToggle("Ultras", ULTRAS));
document.body.appendChild(subheader);

document.body.appendChild(view.element);
view.initialize();
