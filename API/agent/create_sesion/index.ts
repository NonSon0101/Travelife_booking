
export async function createChatSession(): Promise<any> {
  try {
    const userId = localStorage.getItem("websiteUserId"); 

    if (!userId) {
      throw new Error("No userId found in localStorage");
    }

    const response = await fetch("/api/create_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create session");
    }

    return await response.json();
    
  } catch (error: any) {
    console.error("createChatSessionClient error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || "Unknown error");
  }
}
