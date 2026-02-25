import { FaChevronDown, FaSlidersH, FaPlay, FaPlus } from "react-icons/fa";

export default function Header() {
	return (
		<div className="w-full px-4 py-3 border-b border-white/10 bg-slate-950/40 backdrop-blur flex items-center justify-between">
			<div className="flex items-center gap-3">
				<button className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/85 text-sm flex items-center gap-2">
					agent <FaChevronDown className="text-xs opacity-80" />
				</button>

				<div className="flex items-center gap-2 text-xs text-white/60">
					<span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
						Memory
					</span>
					<span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
						Interrupts: 3
					</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm flex items-center gap-2">
					<FaPlus className="text-xs" />
					New
				</button>

				<button className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm flex items-center gap-2">
					<FaPlay className="text-xs" />
					Run
				</button>

				<button className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm flex items-center gap-2">
					<FaSlidersH className="text-xs" />
					Pretty
				</button>
			</div>
		</div>
	);
}
