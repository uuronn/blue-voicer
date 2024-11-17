"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getDangerLevel } from "./functions/getDangerLevel";
import { DangerLevelLegend } from "./components/DangerLevelLegend";

// p5.jsコンポーネントの動的インポート
const WaveAnimation = dynamic(
	() => import("./components/WaveAnimation").then((mod) => mod.WaveAnimation),
	{ ssr: false },
);

export default function Page() {
	const [waveHeight, setWaveHeight] = useState<number>(0); // 波の高さ
	const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null); // エラー
	const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態

	// ユーザーの位置情報取得
	useEffect(() => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by this browser.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setLocation({ lat: latitude, lng: longitude });
			},
			(err) => {
				setError(err.message);
			},
		);
	}, []);

	// Open-Meteoから波データを取得
	useEffect(() => {
		if (!location) return;

		const fetchWaveData = async () => {
			setIsLoading(true);

			try {
				// Open-Meteo APIのパラメータ
				const params = {
					latitude: location.lat.toString(),
					longitude: location.lng.toString(),
					hourly: "wave_height",
					timezone: "GMT", // APIのデフォルトタイムゾーン
				};
				const url = "https://marine-api.open-meteo.com/v1/marine";
				const response = await fetch(`${url}?${new URLSearchParams(params)}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				// 現在のUTC時刻を取得
				const now = new Date();

				// 日付と時刻を分解
				const currentUTCHour = now.getUTCHours();
				const currentUTCDate = now.toISOString().split("T")[0]; // UTCの日付

				console.info(
					"currentUTCDate:",
					currentUTCDate,
					"currentUTCHour:",
					currentUTCHour,
				);

				// UTCに基づいてインデックスを検索
				const index = data.hourly.time.findIndex(
					(time: string) =>
						time.startsWith(currentUTCDate) && // 日付が一致
						time.includes(`T${String(currentUTCHour).padStart(2, "0")}:`), // 時間が一致
				);

				// 波の高さをセット
				if (index !== -1) {
					setWaveHeight(data.hourly.wave_height[index]);
				} else {
					setError("No wave height data available for the current UTC time.");
				}
			} catch (err) {
				setError("Failed to fetch wave data.");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWaveData();
	}, [location]);

	const dangerLevel = getDangerLevel(waveHeight);

	return (
		<div>
			<h1>波の高さ確認アプリ</h1>
			{location ? (
				<p>
					緯度: {location.lat}, 経度: {location.lng}
				</p>
			) : (
				<p>{error || "読み込み中..."}</p>
			)}

			{isLoading ? (
				<p>読み込み中...</p>
			) : error ? (
				<p>Error: {error}</p>
			) : (
				<div>
					<p>
						波の高さ：{waveHeight} m -{" "}
						<span
							style={{
								color: `rgb(${dangerLevel.color[0]}, ${dangerLevel.color[1]}, ${dangerLevel.color[2]})`,
							}}
						>
							{dangerLevel.label}
						</span>
					</p>
				</div>
			)}

			{/* 波アニメーション */}
			<WaveAnimation waveHeight={waveHeight} />

			<DangerLevelLegend />
		</div>
	);
}
