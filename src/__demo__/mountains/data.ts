import { IMountain } from "./types";

const MOUNTAINS: IMountain[] = [
    {
        name: "Mount Whitney",
        elevationFt: 14498,
        prominenceFt: 10078,
        climbed: true,
    },
    {
        name: "Mount Williamson",
        elevationFt: 14373,
        prominenceFt: 1643,
        climbed: true,
    },
    {
        name: "White Mountain Peak",
        elevationFt: 14246,
        prominenceFt: 7196,
        climbed: true,
    },
    {
        name: "North Palisade",
        elevationFt: 14242,
        prominenceFt: 2894,
        climbed: false,
    },
    {
        name: "Mount Shasta",
        elevationFt: 14162,
        prominenceFt: 9762,
        climbed: false,
    },
    {
        name: "Mount Sill",
        elevationFt: 14153,
        prominenceFt: 353,
        climbed: false,
    },
    {
        name: "Mount Russell",
        elevationFt: 14088,
        prominenceFt: 1096,
        climbed: false,
    },
    {
        name: "Split Mountain",
        elevationFt: 14058,
        prominenceFt: 1525,
        climbed: true,
    },
    {
        name: "Mount Langley",
        elevationFt: 14026,
        prominenceFt: 1165,
        climbed: true,
    },
    {
        name: "Mount Tyndall",
        elevationFt: 14019,
        prominenceFt: 1092,
        climbed: false,
    },
    {
        name: "Middle Palisade",
        elevationFt: 14012,
        prominenceFt: 1085,
        climbed: false,
    },
    {
        name: "San Gorgonio Mountain",
        elevationFt: 11499,
        prominenceFt: 8294,
        climbed: true,
    },
    {
        name: "Telescope Peak",
        elevationFt: 11048,
        prominenceFt: 6168,
        climbed: false,
    },
    {
        name: "San Jacinto Peak",
        elevationFt: 10839,
        prominenceFt: 8319,
        climbed: true,
    },
    {
        name: "Lassen Peak",
        elevationFt: 10457,
        prominenceFt: 5229,
        climbed: false,
    },
    {
        name: "Mount San Antonio",
        elevationFt: 10064,
        prominenceFt: 6224,
        climbed: true,
    },
    {
        name: "Mount Eddy",
        elevationFt: 9025,
        prominenceFt: 5105,
        climbed: false,
    },
];

export const FOURTEENERS = MOUNTAINS.filter((m) => m.elevationFt >= 14000);
export const ULTRAS = MOUNTAINS.filter((m) => m.prominenceFt >= 5000);
