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
        timeout: 30000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const detail = error?.response?.data?.detail;

    if (typeof detail === "string" && detail.includes("Session already exists:")) {
      return NextResponse.json({ message: detail }, { status: 200 });
    }

    console.error("Axios error:", detail || error.message);
    return NextResponse.json(
      { error: detail || "Unknown error" },
      { status: 500 }
    );
  }
}

