import { ISelectionAdapter } from "../types";

export const NOOP_SELECTION_ADAPTER: ISelectionAdapter = {
    handleRowClick() {
        // no-op
    },
};
