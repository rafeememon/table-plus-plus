export function createMouseEvent(modifier?: "SHIFT" | "CONTROL" | "META") {
    return {
        getModifierState(keyArg: string) {
            switch (keyArg) {
                case "Shift":
                    return modifier === "SHIFT";
                case "Control":
                    return modifier === "CONTROL";
                case "Meta":
                    return modifier === "META";
                default:
                    return false;
            }
        }
    } as MouseEvent;
}
