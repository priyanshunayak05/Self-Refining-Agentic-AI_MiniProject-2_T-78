import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const Box = function () {
	const wrapRef = useRef(null);
	const dragRef = useRef({ id: null, dx: 0, dy: 0 });
	const colors = ["red", "green", "blue", "yellow", "violet", "purple", "orange"];

	const [task, setTask] = useState("");
	
	const randomColor = function(){
		const r = Math.floor(Math.random()*colors.length);
		return colors[r];
	}
	const [items, setItems] = useState([{id: 1, text:"Agent Canvas Area", color: randomColor(), x: 180, y: 250}, {id: 2, text:"Agent Thinking", color: randomColor(), x: 400, y: 250}]);

	const addTask = () => {
		const t = task.trim();
		if (!t) return;

		const el = wrapRef.current;
		const rect = el ? el.getBoundingClientRect() : { width: 800, height: 500 };

		const w = 220;
		const h = 64;

		const x = clamp(Math.floor(Math.random() * (rect.width - w)), 0, Math.max(0, rect.width - w));
		const y = clamp(Math.floor(Math.random() * (rect.height - h)), 0, Math.max(0, rect.height - h));

		setItems((p) => [...p, { id: Date.now(), color: randomColor(),  text: t, x, y }]);
		setTask("");
	};

	const onBoxDown = (e, id) => {
		const el = wrapRef.current;
		if (!el) return;

		const r = el.getBoundingClientRect();
		const mx = e.clientX - r.left;
		const my = e.clientY - r.top;

		const it = items.find((i) => i.id === id);
		if (!it) return;

		dragRef.current = { id, dx: mx - it.x, dy: my - it.y };
	};

	useEffect(() => {
		const move = (e) => {
			const id = dragRef.current.id;
			if (!id) return;

			const el = wrapRef.current;
			if (!el) return;

			const r = el.getBoundingClientRect();
			const mx = e.clientX - r.left;
			const my = e.clientY - r.top;

			const w = 140;
			const h = 40;

			const nx = clamp(mx - dragRef.current.dx, 0, Math.max(0, r.width - w));
			const ny = clamp(my - dragRef.current.dy, 0, Math.max(0, r.height - h));

			setItems((p) => p.map((it) => (it.id === id ? { ...it, x: nx, y: ny } : it)));
		};

		const up = () => {
			dragRef.current.id = null;
		};

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
		window.addEventListener("mouseleave", up);

		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
			window.removeEventListener("mouseleave", up);
		};
	}, [items]);

	return (
		<div ref={wrapRef} className="h-full relative overflow-hidden">
			<div className="absolute z-50 top-3 left-3 w-[280px] rounded-2xl border border-white/10 backdrop-blur-[1px] p-3">
				<div className="text-xs text-white/60 mb-2">Tasks</div>
				<div className="flex gap-2">
					<input
						type="text"
						value={task}
						onChange={(e) => setTask(e.target.value)}
						onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), addTask()) : null)}
						className="w-full px-2 py-1 text-xs bg-slate-700/20 outline-none rounded-xl text-white border border-slate-500/50 focus:border-slate-300/50"
						placeholder="Add task . . ."
					/>
					<button
						type="button"
						onClick={addTask}
						className="px-2 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/25 border border-violet-400/30 text-white"
					>
						<FaPlus />
					</button>
				</div>
			</div>

			{items.map((it) => {
				const color = it.color;
				return(
					<div key={it.id} style={{ left: it.x, top: it.y }} className="absolute group flex flex-row items-center">
						<div className={`mr-2 p-1 opacity-0 group-hover:opacity-100 rounded-full bg-${color}-500/80`}></div>
						<div
							onMouseDown={(e) => onBoxDown(e, it.id)}
							className={`min-w-25 z-50 text-white/80 hover:text-white text-sm text-center
								hover:shadow-${color}-700 shadow-${color}-800 shadow-sm select-none cursor-move border 
								border-white/10 bg-${color}-500/30 hover:bg-${color}-500/40 px-4 py-2 rounded-2xl`}		
						>
							
							{it.text}
						</div>
						<div className={`ml-2 p-1 opacity-0 group-hover:opacity-100 rounded-full bg-${color}-500/80`}></div>
					</div>
				)
			})}
		</div>
	);
};

export default Box;
