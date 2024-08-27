"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { AddFriendSchema } from "@/schema/AddFriendSchema";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { fetchRedis } from "../../../../../helper/redis";
import { ApiResponse } from "../../../../../types/ApiResponse";
import { db } from "@/lib/dbConnect";

export const acceptFriendRequest = async (id: string): Promise<ApiResponse> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized Request");
    }
    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      id
    );
    if (isAlreadyFriend) {
      await db.srem(`user:${session?.user.id}:incoming_friend_requests`,id);
      throw new Error("Already Friends");
    }
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      id
    );
    if(!hasFriendRequest) {
      throw new Error('No fried request found for the user');
    }
    await db.sadd(`user:${session.user.id}:friends`,id)
    await db.sadd(`user:${id}:friends`,session.user.id);
    // await db.sadd(`user:${id}:friends`,session.user.id);
    await db.srem(`user:${session.user.id}:incoming_friend_requests`,id)
    return {
      success: true,
      message: "Friend Request accepted",
      data: id,
    };
  } catch (error: any) {
    if(error instanceof z.ZodError) {
      return {
        success: false,
        message: error.message
      }
    }
    console.error("Failed to accept friend request: ", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const rejectFriendRequests = async (id: string): Promise<ApiResponse> => {
  try {

    const session = await getServerSession(authOptions);
    if(!session) {
      throw new Error('Unauthorized Request');
    }

    await db.srem(`user:${session.user.id}:incoming_friend_requests`,id);
    return {
      success: true,
      message: "Request rejected"
    }
  } catch (error: any) {
    console.error('Failed to reject friend Request: ',error.message);
    return {
      success: false,
      message: error.message || 'Something went wrong'
    }
  }
}
