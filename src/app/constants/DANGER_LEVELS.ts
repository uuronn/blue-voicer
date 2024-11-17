// 危険度と色分けの情報
export const DANGER_LEVELS = [
	{ max: 1.0, label: "安全", color: [0, 0, 255] }, // 青
	{ max: 1.5, label: "注意", color: [0, 255, 0] }, // 緑
	{ max: 1.7, label: "警戒", color: [255, 255, 0] }, // 黄
	{ max: 2.0, label: "危険", color: [255, 165, 0] }, // オレンジ
	{ max: 2.5, label: "非常に危険", color: [255, 0, 0] }, // 赤
];
