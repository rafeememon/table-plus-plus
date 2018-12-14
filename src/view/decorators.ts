import { HeaderDecorator, ITableModel, ObjectWithKey, RowDecorator } from "../types";

const SORT_ARROW_CLASSNAME = "sort-arrow";
const SELECTED_ATTRIBUTE = "data-selected";

export function sortDecorator<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
>(model: ITableModel<Key, Row, KeyType>): HeaderDecorator<Row> {
    return (column, th) => {
        const { sort } = model;
        const oldArrow = th.getElementsByClassName(SORT_ARROW_CLASSNAME).item(0);
        if (sort && sort.key === column.key) {
            const arrow = document.createElement("span");
            arrow.classList.add(SORT_ARROW_CLASSNAME);
            arrow.appendChild(document.createTextNode(sort.ascending ? " ↑" : " ↓"));
            if (oldArrow) {
                th.replaceChild(arrow, oldArrow);
            } else {
                th.appendChild(arrow);
            }
        } else if (oldArrow) {
            oldArrow.remove();
        }
    };
}

export function selectionDecorator<
    Key extends keyof Row,
    Row extends ObjectWithKey<Key, KeyType>,
    KeyType = Row[Key],
>(model: ITableModel<Key, Row, KeyType>): RowDecorator<Row> {
    return (row, tr) => {
        if (model.isSelected(row)) {
            tr.setAttribute(SELECTED_ATTRIBUTE, "true");
        } else {
            tr.removeAttribute(SELECTED_ATTRIBUTE);
        }
    };
}
