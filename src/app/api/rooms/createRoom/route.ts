import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../../../../../types/ApiResponse";
import { nanoid } from "nanoid";
import { fetchRedis } from "../../../../../helper/redis";
import { db } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { hostId } = await req.json();
    const user = (await fetchRedis("get", `user:${hostId}`)) as User;
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unauthorized Request",
        }),
        { status: 400 }
      );
    }
    const roomId = nanoid();
    await db.sadd(`user:${hostId}:rooms`, roomId);
    await db.sadd(`room:${roomId}:participants`,hostId)
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Room Created",
        data: roomId,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to Create Room: ", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to create Room",
      }),
      { status: 500 }
    );
  }
}
