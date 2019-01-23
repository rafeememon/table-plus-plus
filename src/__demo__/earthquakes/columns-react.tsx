import * as React from "react";
import { IReactColumn } from "../../react";
import { IGeoJsonFeatureProperties } from "./types";

export const COLUMNS_REACT: Array<IReactColumn<IGeoJsonFeatureProperties>> = [
    {
        key: "code",
        label: "",
        reactRenderData() {
            return <input type="checkbox" onChange={() => alert("hi")} />; //tslint:disable-line
        },
    },
    {
        key: "time",
        label: "Time",
        renderData({time}) {
            return new Date(time).toLocaleString();
        },
    },
    {
        key: "mag",
        label: "Magnitude",
        reactRenderData({mag}) {
            const magFixed = mag.toFixed(1);
            return mag >= 5 ? <strong>{magFixed}</strong> : magFixed;
        },
    },
    {
        key: "place",
        label: "Location",
    },
    {
        key: "url",
        label: "Details",
        reactRenderData({url}) {
            return <a href={url} target="_blank">Details</a>;
        },
    },
];
