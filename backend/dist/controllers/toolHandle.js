"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToolAction = handleToolAction;
const tools_1 = require("./tools");
async function handleToolAction(action) {
    if (!action || !action.type) {
        return null;
    }
    console.log("🛠 Tool Handler Triggered:", action.type);
    try {
        switch (action.type) {
            case "generate_image": {
                const res = await (0, tools_1.sendRequest)("generate-image", "POST", {
                    prompt: action.input,
                });
                if (res.error) {
                    return `Image generation failed: ${res.error}`;
                }
                return res.image_url || res.path || "Image generated";
            }
            // 👉 future tools can go here directly
            // case "search_web":
            //   return await sendRequest("search", "POST", { query: action.input });
            default:
                throw new Error(`Unknown tool: ${action.type}`);
        }
    }
    catch (err) {
        console.error("❌ Tool Handler Error:", err.message);
        return { error: err.message };
    }
}
//# sourceMappingURL=toolHandle.js.map