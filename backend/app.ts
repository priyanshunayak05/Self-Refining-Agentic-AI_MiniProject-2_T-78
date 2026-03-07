import express, { Request, Response } from "express";

const app = express();
const PORT: number = 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Server is running");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});