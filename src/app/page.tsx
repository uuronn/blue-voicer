"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const P5Component = dynamic(
	() => import("./components/P5Component").then((mod) => mod.P5Component),
	{ ssr: false },
);

export default function Page() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		setIsClient(true);
	}, []);

	return (
		<div>
			test
			{isClient && <P5Component />}
		</div>
	);
}
