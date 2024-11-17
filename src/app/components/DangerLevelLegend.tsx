import { DANGER_LEVELS } from "../constants/DANGER_LEVELS";

export const DangerLevelLegend = () => {
	return (
		<div className="flex flex-col gap-2">
			{DANGER_LEVELS.map((level) => (
				<div key={level.label} className="flex items-center gap-2">
					<div
						className="w-6 h-6 rounded-full"
						style={{
							backgroundColor: `rgb(${level.color[0]}, ${level.color[1]}, ${level.color[2]})`,
						}}
					/>
					<span className="text-gray-800">
						{level.label} ({level.max === 2.5 ? "2.5以上" : `〜${level.max}m`})
					</span>
				</div>
			))}
		</div>
	);
};
