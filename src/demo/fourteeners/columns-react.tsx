import * as React from "react";
import { IReactColumn } from "../../react";
import { IMountain } from "./types";

export const REACT_COLUMNS: Array<IReactColumn<IMountain>> = [
    {
        key: "name",
        label: "Name",
    },
    {
        key: "elevationFt",
        label: "Elevation",
        displayData({elevationFt}) {
            return formatFeet(elevationFt);
        },
    },
    {
        key: "prominenceFt",
        label: "Prominence",
        displayData({prominenceFt}) {
            return formatFeet(prominenceFt);
        },
    },
    {
        key: "climbed",
        label: "Climbed",
        renderData({climbed}) {
            return climbed ? <b>Yes</b> : <i>No</i>;
        },
    },
];

function formatFeet(value: number) {
    return `${value.toLocaleString()}'`;
}
