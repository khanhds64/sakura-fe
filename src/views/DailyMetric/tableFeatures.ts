import {
    tableFeatures,
    rowPaginationFeature,
} from "@tanstack/react-table";

export const features = tableFeatures({
    rowPaginationFeature,
});

export type AppTableFeatures = typeof features;