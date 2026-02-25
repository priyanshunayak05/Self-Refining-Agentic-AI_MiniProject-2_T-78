import { useState } from "react";
import Header from "./header";
import Output from "./output";
import Box from "./box";

export default function Agent() {
	const [prompt, setPrompt] = useState("");

	function send(e) {
		e?.preventDefault();
		const t = prompt.trim();
		if (!t) return;
		setPrompt("");
	}

	return (
		<main className="w-full h-full flex flex-col">
			<div className="h-full w-full flex">

				<div className="relative h-full w-full flex flex-col bg-slate-950/20">
					<div className="absolute inset-0 opacity-[0.35]">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_90%_40%,rgba(168,85,247,0.10),transparent_35%),radial-gradient(circle_at_40%_90%,rgba(34,197,94,0.07),transparent_40%)]" />
						<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
					</div>


					<div className="w-full h-full">
						<Box/>
					</div>

					<form
						onSubmit={send}
						className="p-3 z-20 h-fit"
					>
						<div className="w-full h-full flex flex-row gap-3 items-center">
							<div className="w-full h-full">
								<textarea
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									className="w-full min-h-[80px] max-h-[200px] overflow-y-auto custom-scroll resize-none bg-slate-800/40 rounded-xl focus:shadow-slate-700 shadow-sm border border-white/10 px-3 py-2 text-sm text-white/80 outline-none focus:border-white/20"
									placeholder="Ask your agent to do something..."
								/>
							</div>

							<button
								type="submit"
								className="mt-auto mb-2 p-2 px-4 rounded-2xl bg-violet-500/40 hover:bg-violet-500/25 border border-violet-400/30 text-white text-sm font-semibold"
							>
								Submit
							</button>
						</div>
					</form>

				</div>


			</div>
		</main>
	);
}
