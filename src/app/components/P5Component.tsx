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
