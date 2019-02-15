export function expandWidths(widths: number[], containerWidth: number) {
    const widthSum = sum(widths);
    if (widthSum >= containerWidth) {
        return widths;
    }

    const scale = containerWidth / widthSum;
    const scaledWidths = [];
    let scaledSum = 0;
    for (let index = 0; index < widths.length; index++) {
        let scaledWidth;
        if (index === widths.length - 1) {
            scaledWidth = containerWidth - scaledSum;
        } else {
            const width = widths[index];
            scaledWidth = Math.max(Math.floor(scale * width), width);
        }
        scaledWidths.push(scaledWidth);
        scaledSum += scaledWidth;
    }
    return scaledWidths;
}

export function sum(nums: number[]) {
    let result = 0;
    for (const num of nums) {
        result += num;
    }
    return result;
}

export function union<T>(set1: Set<T>, set2: Set<T>) {
    const all = new Set(set1);
    set2.forEach(el => all.add(el));
    return all;
}
