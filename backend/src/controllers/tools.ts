const BASE_URL = process.env.FLASK_URL;

export const sendRequest = async function(endpoint: string, method: string = "POST", body: any = {}): Promise<any> {
	try {
		const url = `${BASE_URL}/${endpoint}`;
		const res = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			throw new Error(`Request failed: ${res.status}`);
		}

		return await res.json();
	} catch (err: any) {
		console.error("❌ Request Error:", err.message);
		return { error: err.message };
	}
}

