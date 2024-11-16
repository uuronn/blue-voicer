"use client";

import React, { useRef, useEffect } from "react";
import p5 from "p5";

export const P5Component = () => {
	const sketchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sketch = (p5: p5) => {
			let x = 0; // 円の初期位置

			// p5.jsのセットアップ処理
			p5.setup = () => {
				if (sketchRef.current === null) return;

				p5.createCanvas(400, 400).parent(sketchRef.current); // キャンバスを指定したDOMに紐付け
			};

			// p5.jsの描画処理
			p5.draw = () => {
				p5.background(200);
				p5.fill(100, 150, 255);

				// 円を描画
				p5.ellipse(x, p5.height / 2, 100, 100);

				// 円を右方向に移動
				x += 2;

				// 画面外に出たら戻す
				if (x > p5.width) {
					x = 0;
				}
			};
		};

		// p5.jsインスタンスを作成
		const p5Instance = new p5(sketch);

		// コンポーネントがアンマウントされたときにインスタンスを削除
		return () => {
			p5Instance.remove();
		};
	}, []);

	return (
		<div>
			<h1>p5.js Animation</h1>
			<div ref={sketchRef} /> {/* ここにp5.jsのキャンバスが描画される */}
		</div>
	);
};

export const WaveComponent = () => {
	const sketchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sketch = (p5: p5) => {
			let t = 0; // 時間変数

			p5.setup = () => {
				if (sketchRef.current === null) return;

				p5.createCanvas(600, 400).parent(sketchRef.current);
			};

			p5.draw = () => {
				p5.background(30, 144, 255); // 背景色
				p5.noFill();
				p5.stroke(255); // 波の色
				p5.strokeWeight(2);

				p5.beginShape();
				for (let x = 0; x <= p5.width; x += 10) {
					// サイン波の計算
					const angle = (x + t) * 0.02;
					const y = p5.height / 2 + p5.sin(angle) * 50;
					p5.vertex(x, y);
				}
				p5.endShape();

				t += 1; // 時間を進める
			};
		};

		const p5Instance = new p5(sketch);

		return () => {
			p5Instance.remove();
		};
	}, []);

	return (
		<div>
			<h1>Wave Animation</h1>
			<div ref={sketchRef} />
		</div>
	);
};

// 危険度と色分けの情報
const dangerLevels = [
	{ max: 0.5, label: "安全", color: [0, 0, 255] }, // 青
	{ max: 1.5, label: "注意", color: [0, 255, 0] }, // 緑
	{ max: 2.5, label: "警戒", color: [255, 255, 0] }, // 黄
	{ max: 4.0, label: "危険", color: [255, 165, 0] }, // オレンジ
	{ max: Infinity, label: "非常に危険", color: [255, 0, 0] }, // 赤
];

// 波の高さに基づいて危険度を取得
const getDangerLevel = (waveHeight: number) => {
	return (
		dangerLevels.find((level) => waveHeight <= level.max) || dangerLevels[0]
	);
};

// P5.jsコンポーネント
export const TestWaveComponent = ({ waveHeight }: { waveHeight: number }) => {
	const sketchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sketch = (p5: p5) => {
			let t = 0;

			p5.setup = () => {
				if (sketchRef.current === null) return;

				p5.createCanvas(600, 400).parent(sketchRef.current);
			};

			p5.draw = () => {
				// 波の高さに応じた危険度を取得
				const dangerLevel = getDangerLevel(waveHeight);
				const [r, g, b] = dangerLevel.color; // 背景色と波の色

				// 背景色を更新
				p5.background(r, g, b);

				p5.noFill();
				p5.stroke(255); // 波は常に白色
				p5.strokeWeight(2);

				// 波の描画
				p5.beginShape();
				for (let x = 0; x <= p5.width; x += 10) {
					const angle = (x + t) * 0.02;
					const y = p5.height / 2 + p5.sin(angle) * waveHeight;
					p5.vertex(x, y);
				}
				p5.endShape();

				t += 1; // 時間を進める
			};
		};

		const p5Instance = new p5(sketch);

		return () => {
			p5Instance.remove();
		};
	}, [waveHeight]); // waveHeightが変わったら再描画

	return <div ref={sketchRef} />;
};
