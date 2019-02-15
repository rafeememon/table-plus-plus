import { IColumn } from "../..";
import { IGeoJsonFeatureProperties } from "./types";

export const COLUMNS: Array<IColumn<IGeoJsonFeatureProperties>> = [
    {
        key: "selected"
    },
    {
        key: "time",
        label: "Time",
        getText({ time }) {
            return new Date(time).toLocaleString();
        }
    },
    {
        key: "mag",
        label: "Magnitude",
        getText({ mag }) {
            return mag.toFixed(1);
        }
    },
    {
        key: "place",
        label: "Location"
    },
    {
        key: "url",
        label: "Details",
        getText() {
            return "Details";
        },
        getHref({ url }) {
            return url;
        }
    }
];
