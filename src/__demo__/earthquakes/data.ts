import { IGeoJsonResponse } from "./types";

const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export function fetchEarthquakes(): Promise<IGeoJsonResponse> {
    return fetch(URL).then(res => res.json());
}
