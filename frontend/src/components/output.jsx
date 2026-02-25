// output.jsx
import { useMemo, useState } from "react";
import { FaClipboardList, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";

export default function Output() {
  const [tab, setTab] = useState("trace");

  const data = useMemo(
    () => [
      {
        title: "TURN 1",
        score: "0.52",
        items: [
          {
            type: "tool",
            label: "web.search",
            meta: "query: ai trends 2025",
          },
          {
            type: "url",
            label: "https://example.com/ai-trends",
            meta: "content: AI trends",
          },
        ],
      },
      {
        title: "TURN 2",
        score: "0.78",
        items: [
          {
            type: "tool",
            label: "vector.search",
            meta: "topK: 5",
          },
          {
            type: "note",
            label: "Selected context chunks",
            meta: "2 chunks",
          },
        ],
      },
    ],
    []
  );

	return (
		<aside className="w-full h-full border-l border-white/10 bg-slate-950/40 backdrop-blur flex flex-col">
			<div className="p-3 border-b border-white/10 flex items-center justify-between">
				<div className="flex items-center gap-2 text-white/80">
					<FaClipboardList className="text-sm" />
					<span className="text-sm font-semibold">Output</span>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setTab("trace")}
						className={[
						"px-3 py-1.5 rounded-xl text-xs border",
						tab === "trace"
							? "bg-white/10 border-white/15 text-white"
							: "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
						].join(" ")}
					>
						Trace
					</button>
					<button
						onClick={() => setTab("result")}
						className={[
						"px-3 py-1.5 rounded-xl text-xs border",
						tab === "result"
							? "bg-white/10 border-white/15 text-white"
							: "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
						].join(" ")}
					>
						Result
					</button>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-3">
				{tab === "result" ? (
				<div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/75">
					<div className="font-semibold text-white/85">Final Output</div>
					<div className="mt-2 leading-relaxed">
						Agent finished successfully. Tools called: 2. Context chunks: 2.
						Response generated.
					</div>
				</div>
				) : (
				<div className="space-y-3">
					{data.map((block, i) => (
					<div
						key={i}
						className="rounded-2xl border border-white/10 bg-white/5"
					>
						<div className="px-3 py-2 flex items-center justify-between border-b border-white/10">
							<div className="flex items-center gap-2">
								<span className="text-xs font-semibold text-white/85">
									{block.title}
								</span>
								<span className="text-xs text-white/50">
									Score {block.score}
								</span>
							</div>
							<FaChevronDown className="text-xs text-white/50" />
						</div>

						<div className="p-3 space-y-2">
							{block.items.map((it, idx) => (
								<div
									key={idx}
									className="rounded-xl border border-white/10 bg-slate-950/40 p-2"
								>
									<div className="flex items-center justify-between gap-2">
										<div className="text-xs text-white/80 truncate">
											{it.label}
										</div>
										{it.type === "url" ? (
											<FaExternalLinkAlt className="text-xs text-white/50" />
										) : null}
									</div>
									<div className="mt-1 text-[11px] text-white/50">
										{it.meta}
									</div>
								</div>
							))}
						</div>
					</div>
					))}
				</div>
				)}
			</div>

			<div className="p-3 border-t border-white/10 text-[11px] text-white/50">
				OUTPUT
			</div>
		</aside>
	);
}
