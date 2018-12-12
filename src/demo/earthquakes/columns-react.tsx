import * as React from "react";
import { IReactColumn } from "../../react";
import { IGeoJsonFeatureProperties } from "./types";

export const REACT_COLUMNS: Array<IReactColumn<IGeoJsonFeatureProperties>> = [
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
            return <a href={url} target="blank">View</a>;
        },
    },
];
