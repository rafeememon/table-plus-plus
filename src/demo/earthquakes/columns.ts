import { IColumn } from "../..";
import { IGeoJsonFeatureProperties } from "./types";

export const COLUMNS: Array<IColumn<IGeoJsonFeatureProperties>> = [
    {
        key: "time",
        label: "Time",
        getData({time}) {
            return new Date(time).toLocaleString();
        },
    },
    {
        key: "mag",
        label: "Magnitude",
    },
    {
        key: "place",
        label: "Location",
    },
    {
        key: "url",
        label: "Info",
        renderData({url}) {
            const link = document.createElement("a");
            link.appendChild(document.createTextNode("View"));
            link.href = url;
            link.target = "_blank";
            return link;
        },
    },
];
