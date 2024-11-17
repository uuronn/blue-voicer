import { useEffect, useState } from "react";

export const useWave = (location: { lat: number; lng: number } | null) => {
	const [waveHeight, setWaveHeight] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!location) return;

		const fetchWaveData = async () => {
			setIsLoading(true);

			try {
				const params = {
					latitude: location.lat.toString(),
					longitude: location.lng.toString(),
					hourly: "wave_height",
					timezone: "GMT",
				};
				const url = "https://marine-api.open-meteo.com/v1/marine";
				const response = await fetch(`${url}?${new URLSearchParams(params)}`);
				if (!response.ok) {
					throw new Error(`HTTPエラー: ステータスコード ${response.status}`);
				}
				const data = await response.json();

				const now = new Date();
				const currentUTCHour = now.getUTCHours();
				const currentUTCDate = now.toISOString().split("T")[0];

				const index = data.hourly.time.findIndex(
					(time: string) =>
						time.startsWith(currentUTCDate) &&
						time.includes(`T${String(currentUTCHour).padStart(2, "0")}:`),
				);

				if (index !== -1) {
					setWaveHeight(data.hourly.wave_height[index]);
				} else {
					setError("現在のUTC時刻に対応する波の高さのデータが見つかりません。");
				}
			} catch (err) {
				setError("波のデータの取得に失敗しました。");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWaveData();
	}, [location]);

	return { waveHeight, isLoading, error };
};
