import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const bodyReceived = await request.json();

    const message = bodyReceived.message;
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const body = {
      app_name: "travelife_agent",
      user_id: bodyReceived.userId,
      session_id: bodyReceived.userId,
      new_message: {
        role: "user",
        parts: [{ text: message }],
      },
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GOOGLE_ADK}/run`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    const functionResponseDestination = data.find(
      (entry: any) =>
        entry.content?.parts?.[0]?.functionResponse?.name === "suggest_destinations"
    );

    const functionResponseTourDetail = data.find(
      (entry: any) =>
        entry.content?.parts?.[0]?.functionResponse?.name === "give_tour_detail_infomation"
    );

    const suggestions = functionResponseDestination?.content?.parts?.[0]?.functionResponse?.response?.result?.data?.destinations?.suggestions || [];

    const detailInformation = functionResponseTourDetail?.content?.parts?.[0]?.functionResponse?.response?.result?.data.tour_infomation

    const textReply = data
      .filter(
        (entry: any) =>
          entry.content?.role === "model" &&
          entry.content?.parts?.[0]?.text
      )
      .map((entry: any) => entry.content.parts[0].text.replace(/^```html\s*|\s*```$/g, ''))
      .join('\n');

    return NextResponse.json({
      reply: textReply,
      suggestions,
      detailInformation
    });
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message || JSON.stringify(error);
    return NextResponse.json({ error: errorMessage || "Unknown error" }, { status: 500 });
  }
}
