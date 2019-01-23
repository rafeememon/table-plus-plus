import { ReactNode } from "react";
import { IColumn } from "../types";

export interface IReactColumn<Row> extends IColumn<Row> {
    reactRenderData?(row: Row): ReactNode;
}
