import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { getDangerLevel } from "../functions/getDangerLevel";

export const WaveAnimation = ({ waveHeight }: { waveHeight: number }) => {
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
	}, [waveHeight]);

	return <div ref={sketchRef} />;
};
