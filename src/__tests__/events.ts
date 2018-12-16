export function createMouseEvent(modifier?: "SHIFT" | "CONTROL") {
    return {
        getModifierState(keyArg: string) {
            switch (keyArg) {
                case "Shift":
                    return modifier === "SHIFT";
                case "Control":
                    return modifier === "CONTROL";
                default:
                    return false;
            }
        },
    } as MouseEvent;
}
