"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = void 0;
const BASE_URL = process.env.FLASK_URL;
const sendRequest = async function (endpoint, method = "POST", body = {}) {
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
    }
    catch (err) {
        console.error("❌ Request Error:", err.message);
        return { error: err.message };
    }
};
exports.sendRequest = sendRequest;
//# sourceMappingURL=tools.js.map