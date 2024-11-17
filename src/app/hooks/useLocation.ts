import { useEffect, useState } from "react";

export const useLocation = () => {
	const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

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

	return { location, error };
};
