import { NextResponse } from "next/server";
import axios from "axios";
import { createCollection } from "utils/firestoreChat";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_GOOGLE_ADK}/apps/travelife_agent/users/${userId}/sessions/${userId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Axios error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: error?.response?.data || "Unknown error" },
      { status: 500 }
    );
  }
}
