import { handleError } from "API";
import get from "lodash/get";

export async function fetchBotReply(message: string): Promise<{
  reply: string;
  suggestions?: {
    _id: string;
    title: string;
    description?: string;
    image?: string;
  }[];
}> {
  try {
    const userId = localStorage.getItem("websiteUserId");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, userId: userId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Unknown error");

    return data || "No response.";
  } catch (error) {
    handleError(error as Error, 'API/tour', 'getActiveTours')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}