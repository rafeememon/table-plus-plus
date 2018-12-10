import { MultiSelectionAdapter, TableModel, TableView } from "../..";
import { COLUMNS } from "./columns";
import { FOURTEENERS } from "./data";

import "./styles.css";

const model = new TableModel({
    keyField: "name",
    rows: FOURTEENERS,
    columns: COLUMNS,
    selection: new Set<string>(),
});

const selectionAdapter = new MultiSelectionAdapter(model, (newSelection) => {
    model.setSelection(newSelection);
});

const view = new TableView({
    model,
    onClickRow: selectionAdapter.handleRowClick,
});

const header = document.createElement("h1");
header.appendChild(document.createTextNode("California Fourteeners"));
document.body.appendChild(header);
document.body.appendChild(view.getElement());
