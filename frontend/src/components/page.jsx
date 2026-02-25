import { useState } from "react";
import Header from "./header";
import Output from "./output";
import Agent from "./agent";

export default function Page() {
	const [prompt, setPrompt] = useState("");

	function send(e) {
		e?.preventDefault();
		const t = prompt.trim();
		if (!t) return;
		setPrompt("");
	}

	return (
		<div className="w-full h-full flex flex-col">
			<Header />
			<div className="h-full w-full flex flex-row">
				<Agent/>
				<div>
					<Output/>
				</div>
			</div>
		</div>
	);
}
