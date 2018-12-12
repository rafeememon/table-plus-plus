import { ReactElement } from "react";
import { IColumn } from "..";

export interface IReactColumn<Row> extends IColumn<Row> {
    // Render data with no impact on sort ordering.
    renderData?(row: Row): ReactElement<any>;
}
