import { useState } from "react";
import {
	FaThLarge,
	FaRobot,
	FaFolder,
	FaDatabase,
	FaCog,
	FaSearch,
	FaComments,
	FaChartLine,
	FaStar,
} from "react-icons/fa";

const items = [
	{ id: "studio", label: "Studio", icon: FaThLarge },
	{ id: "agents", label: "Agents", icon: FaRobot },
	{ id: "projects", label: "Projects", icon: FaFolder },
	{ id: "memory", label: "Memory", icon: FaDatabase },
	{ id: "runs", label: "Runs", icon: FaChartLine },
	{ id: "search", label: "Search", icon: FaSearch },
	{ id: "chat", label: "Chat", icon: FaComments },
	{ id: "settings", label: "Settings", icon: FaCog },
];

export default function Left() {
	const [active, setActive] = useState("studio");

	return (
		<aside className="h-full w-[76px] border-r border-white/10 bg-slate-950/60 backdrop-blur">
			<div className="h-full flex flex-col items-center py-4 gap-3">
				<div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
					<FaStar className="text-white/80 text-lg" />
				</div>
				<div className="mt-3 flex flex-col gap-2">
				{items.map((it) => {
					const Icon = it.icon;
					const is = active === it.id;
					return (
						<button
							key={it.id}
							onClick={() => setActive(it.id)}
							title={it.label}
							className={[
							"w-11 h-11 rounded-2xl flex items-center justify-center border transition",
							is
								? "bg-white/10 border-white/15 text-white"
								: "bg-transparent border-transparent text-white/60 hover:bg-white/5 hover:text-white/85",
							].join(" ")}
						>
							<Icon className="text-lg" />
						</button>
					);
				})}
				</div>
				
				<div className="flex-1" />
				<div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
					<span className="text-sm font-semibold">A</span>
				</div>
			</div>
		</aside>
	);
}
