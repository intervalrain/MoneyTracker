export function generateColor(n: number): string[] {
    const colors: string[] = [];
    const saturation = 70; // 固定飽和度
    const lightness = 50;  // 固定明度

    for (let i = 0; i < n; i++) {
        // 讓每個顏色的色相在 360 度均勻分布，並調整跨度
        const hue = (i * (360 / n)) % 360;
        
        // HSL 到 HEX 轉換
        colors.push(hslToHex(hue, saturation, lightness));
    }

    return colors;
}

// 將 HSL 轉換為 HEX 的輔助函數
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(255 * color).toString(16).padStart(2, '0'); // 轉為 16 進制
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
