"use client";

import dynamic from "next/dynamic";
import { getDangerLevel } from "./functions/getDangerLevel";
import { DangerLevelLegend } from "./components/DangerLevelLegend";
import { useLocation } from "./hooks/useLocation";
import { useWave } from "./hooks/useWave";

// p5.jsコンポーネントの動的インポート
const WaveAnimation = dynamic(
	() => import("./components/WaveAnimation").then((mod) => mod.WaveAnimation),
	{ ssr: false },
);

export default function Page() {
	const { location, error: locationError } = useLocation();
	const { waveHeight, isLoading, error: waveDataError } = useWave(location);

	const dangerLevel = getDangerLevel(waveHeight);

	if (isLoading) {
		return (
			<main className="flex items-center justify-center min-h-screen bg-blue-100">
				<p className="text-xl font-semibold text-blue-500">読み込み中...</p>
			</main>
		);
	}

	return (
		<main className="p-4 sm:p-8 bg-gray-50 min-h-screen relative">
			<header className="mb-6">
				<h1 className="text-2xl sm:text-4xl font-bold text-blue-700 text-center">
					波の高さ確認アプリ
				</h1>
				<p className="text-center text-gray-600 mt-2">
					現在地の波の高さと危険度を確認できます
				</p>
			</header>

			<section className="mb-8">
				{location ? (
					<p className="text-lg text-gray-800">
						<strong>現在地</strong>: 緯度 {location.lat.toFixed(2)}, 経度{" "}
						{location.lng.toFixed(2)}
					</p>
				) : (
					<p className="text-red-500">
						{locationError || "位置情報を取得しています..."}
					</p>
				)}
			</section>

			<section className="mb-8">
				{waveDataError ? (
					<p className="text-red-500">エラー: {waveDataError}</p>
				) : (
					<div>
						<p className="text-lg text-gray-800">
							波の高さ：{" "}
							<span className="font-bold text-blue-700">
								{waveHeight.toFixed(1)} m
							</span>{" "}
							-{" "}
							<span
								className="font-bold"
								style={{
									color: `rgb(${dangerLevel.color[0]}, ${dangerLevel.color[1]}, ${dangerLevel.color[2]})`,
								}}
							>
								{dangerLevel.label}
							</span>
						</p>
					</div>
				)}
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold text-gray-700 mb-4">
					波のイメージ
				</h2>
				<div className="rounded-lg overflow-hidden shadow-lg bg-white p-4">
					<WaveAnimation waveHeight={waveHeight} />
				</div>
			</section>

			<section>
				<h2 className="text-xl font-semibold text-gray-700 mb-4">
					危険度の色分け
				</h2>
				<div className="rounded-lg overflow-hidden shadow-lg bg-white p-4">
					<DangerLevelLegend />
				</div>
			</section>

			{/* クレジット */}
			<footer className="absolute bottom-2 right-4 text-xs text-gray-500">
				Developed by Issei
			</footer>
		</main>
	);
}
