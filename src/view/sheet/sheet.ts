import { ITableView, IViewConfig, ObjectWithKey } from "../../types";
import { applyStyles } from "../dom";
import { SheetBodyView } from "./body";

const ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    display: "flex",
    flexDirection: "column",
};

const BODY_ELEMENT_STYLES: Partial<CSSStyleDeclaration> = {
    flexGrow: "1",
    width: "100%",
};

export class SheetView<
    K extends keyof R,
    R extends ObjectWithKey<K, V>,
    V = R[K],
> implements ITableView {

    public element: HTMLElement;
    private bodyView: SheetBodyView<K, R, V>;

    public constructor(config: IViewConfig<K, R, V>) {
        this.bodyView = new SheetBodyView(config.model);

        this.element = document.createElement("div");
        applyStyles(this.element, ELEMENT_STYLES);

        const bodyElement = document.createElement("div");
        applyStyles(bodyElement, BODY_ELEMENT_STYLES);
        bodyElement.appendChild(this.bodyView.element);
        this.element.appendChild(bodyElement);
    }

    public initialize() {
        this.bodyView.initialize();
    }

    public destroy() {
        this.bodyView.destroy();
    }

}
