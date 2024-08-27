'use server';
import { getServerSession } from "next-auth";
import { ApiResponse } from "../../../../../../types/ApiResponse";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { fetchRedis } from "../../../../../../helper/redis";
import { db } from "@/lib/dbConnect";
import {nanoid} from 'nanoid';
import { messageSchema } from "@/schema/Message";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export const sendMessage = async ({text,chatId}: {text: string, chatId: string}): Promise<ApiResponse> => {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
            return {
                success: false,
                message: 'Unauthorized Request',
            }
        }
        const [userId1,userId2] = chatId.split('--');
        if(session.user.id !== userId1 && session.user.id !== userId2) {
            return {
                success: false,
                message: 'Unauthorized',
            }
        }
        const friendId = session.user.id === userId1 ? userId2 : userId1;
        const friendList = (await fetchRedis('smembers',`user:${session.user.id}:friends`)) as string[];
        const isFriend = friendList.includes(friendId);
        if(!isFriend) {
            return {
                success: false,
                message: 'Unauthorized'
            }
        }
        const rawSender = await fetchRedis('get',`user:${session.user.id}`) as string;
        const sender = JSON.parse(rawSender) as User;
        const timeStamp = Date.now();
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timeStamp,
        };
        const message = messageSchema.parse(messageData);
        pusherServer.trigger(toPusherKey(`chat:${chatId}:messages`),'incomingMessages',message);
        pusherServer.trigger(toPusherKey(`user:${friendId}:chats`),'newMessage',{
            ...message,
            senderId: sender.id,
            senderName: sender.name,
        });
        await db.zadd(`chat:${chatId}:messages`, {
            score: timeStamp,
            member: JSON.stringify(message)
        })
        return {
            success: true,
            message: 'Message Sent',
            data: message
        }
    } catch (error: any) {
        if(error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid MessageSchema Error'
            }
        }
        console.error('Failed to send messages: ',error.message);
        return{
            success: false,
            message: error.message || 'Something went wrong',
        }
    }
}
