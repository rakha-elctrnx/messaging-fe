import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(JSON.stringify({ message: "Hello, Next.js API!" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}