import { DANGER_LEVELS } from "../constants/DANGER_LEVELS";

// 見本カラーコンポーネント
export const DangerLevelLegend = () => {
	return (
		<div style={{ marginTop: "20px" }}>
			<h2>危険度の色分け</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				{DANGER_LEVELS.map((level) => (
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
								backgroundColor: `rgb(${level.color[0]}, ${level.color[1]}, ${level.color[2]})`,
								borderRadius: "50%",
							}}
						/>
						<span>
							{level.label} ({level.max === 2.5 ? "2.5以上" : `〜${level.max}m`}
							)
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
