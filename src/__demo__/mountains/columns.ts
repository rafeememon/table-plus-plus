import { IColumn } from "../..";
import { IMountain } from "./types";

export const MOUNTAIN_COLUMNS: Array<IColumn<IMountain>> = [
    {
        key: "name",
        label: "Name",
    },
    {
        key: "elevationFt",
        label: "Elevation",
        renderData({elevationFt}) {
            return formatFeet(elevationFt);
        },
    },
    {
        key: "prominenceFt",
        label: "Prominence",
        renderData({prominenceFt}) {
            return formatFeet(prominenceFt);
        },
    },
    {
        key: "climbed",
        label: "Climbed",
        getData({climbed}) {
            return climbed ? "Yes" : "No";
        },
    },
];

function formatFeet(value: number) {
    return `${value.toLocaleString()}'`;
}
