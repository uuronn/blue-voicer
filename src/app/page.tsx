"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// P5.jsコンポーネントの動的インポート
const TestWaveComponent = dynamic(
	() => import("./components/P5Component").then((mod) => mod.TestWaveComponent),
	{ ssr: false },
);
// import React from "react";
// 危険度と色分けの情報を定義
const dangerLevels = [
	{ max: 0.5, label: "安全", color: "blue" },
	{ max: 1.5, label: "注意", color: "green" },
	{ max: 2.5, label: "警戒", color: "yellow" },
	{ max: 4.0, label: "危険", color: "orange" },
	{ max: Infinity, label: "非常に危険", color: "red" },
];

// 波の高さに応じた危険度と色を判定
const getDangerLevel = (waveHeight: number) => {
	return (
		dangerLevels.find((level) => waveHeight <= level.max) || dangerLevels[0]
	);
};

// 見本カラーコンポーネント
const DangerLevelLegend = () => {
	return (
		<div style={{ marginTop: "20px" }}>
			<h2>危険度の色分け</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				{dangerLevels.map((level) => (
					<div
						key={level.label}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<div
							style={{
								width: "24px",
								height: "24px",
								backgroundColor: level.color,
								borderRadius: "50%",
							}}
						/>
						<span>
							{level.label} (
							{level.max === Infinity ? "4.0以上" : `〜${level.max}m`})
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

// メインページコンポーネント
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
					latitude: location.lat,
					longitude: location.lng,
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
			<h1>Wave Data Viewer</h1>
			{location ? (
				<p>
					Latitude: {location.lat}, Longitude: {location.lng}
				</p>
			) : (
				<p>{error || "Fetching location..."}</p>
			)}

			{isLoading ? (
				<p>Loading wave data...</p>
			) : error ? (
				<p>Error: {error}</p>
			) : (
				<div>
					<p>
						Wave Height: {waveHeight} m -{" "}
						<span style={{ color: dangerLevel.color }}>
							{dangerLevel.label}
						</span>
					</p>
				</div>
			)}

			{/* 波アニメーション */}
			<TestWaveComponent waveHeight={waveHeight} />

			{/* 危険度の色分け説明 */}
			<DangerLevelLegend />
		</div>
	);
}
