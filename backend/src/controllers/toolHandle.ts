import { sendRequest } from "./tools";

type ToolAction = {
  type: string;
  input: any;
};

export async function handleToolAction(action?: ToolAction): Promise<any> {
  if (!action || !action.type) {
    return null;
  }

  console.log("🛠 Tool Handler Triggered:", action.type);

  try {
    switch (action.type) {
      case "generate_image": {
        const res = await sendRequest("generate-image", "POST", {
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
  } catch (err: any) {
    console.error("❌ Tool Handler Error:", err.message);
    return { error: err.message };
  }
}