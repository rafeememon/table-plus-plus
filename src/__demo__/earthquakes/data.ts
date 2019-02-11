import { IGeoJsonResponse } from "./types";

import * as ALL_DAY from "./all_day.json";

// const DAY_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const WEEK_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

export function fetchEarthquakes(): Promise<IGeoJsonResponse> {
    // return fetch(DAY_URL).then((res) => res.json());
    return Promise.resolve(ALL_DAY as any);
}

export function fetchEarthquakesFromPastMonth(): Promise<IGeoJsonResponse> {
    return fetch(WEEK_URL).then((res) => res.json());
}

export function fetchEarthquakes2(): Promise<IGeoJsonResponse> {
    return Promise.resolve(ALL_DAY as any);
}
