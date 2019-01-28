export class TextMeasurer {

    private cache: Map<string, number> = new Map();
    private context: CanvasRenderingContext2D;

    public constructor(font: string) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("no context");
        }
        context.font = font;
        this.context = context;
    }

    public measureWidth(text: string) {
        let width = this.cache.get(text);
        if (width == null) {
            width = this.context.measureText(text).width;
            this.cache.set(text, width);
        }
        return width;
    }

}

// This is a workaround for when style.font is empty in IE11 and Edge.
export function getDerivedFont(el: Element) {
    const style = window.getComputedStyle(el);
    if (style.font) {
        return style.font;
    }
    // FIXME: Including fontStretch makes measureWidth() calculations incorrect.
    const { fontStyle, fontVariant, fontWeight, fontSize, fontFamily } = style;
    return [fontStyle, fontVariant, fontWeight, fontSize, fontFamily].filter((v) => v).join(" ");
}
