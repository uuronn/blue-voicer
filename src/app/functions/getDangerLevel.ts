import { DANGER_LEVELS } from "../constants/DANGER_LEVELS";

// 波の高さに応じた危険度と色を判定
export const getDangerLevel = (waveHeight: number) => {
	return (
		DANGER_LEVELS.find((level) => waveHeight <= level.max) || DANGER_LEVELS[0]
	);
};
