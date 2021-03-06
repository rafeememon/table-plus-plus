import { IColumn } from "../..";
import { IMountain } from "./types";

export const MOUNTAIN_COLUMNS: Array<IColumn<IMountain>> = [
    {
        key: "name",
        label: "Name",
        getSortValue({ name }) {
            return name.startsWith("Mount ") ? name.substr(6) : name;
        }
    },
    {
        key: "elevationFt",
        label: "Elevation",
        getText({ elevationFt }) {
            return formatFeet(elevationFt);
        }
    },
    {
        key: "prominenceFt",
        label: "Prominence",
        getText({ prominenceFt }) {
            return formatFeet(prominenceFt);
        }
    },
    {
        key: "climbed",
        label: "Climbed",
        getText({ climbed }) {
            return climbed ? "Yes" : "No";
        },
        getSortValue({ climbed }) {
            return climbed ? 0 : 1;
        }
    }
];

function formatFeet(value: number) {
    return `${value.toLocaleString()}'`;
}
