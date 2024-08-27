"use server";

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { AddFriendSchema } from '@/schema/AddFriendSchema';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { fetchRedis } from '../../../../../helper/redis';
import { db } from '@/lib/dbConnect';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { Send } from 'lucide-react';

export const addFriend = async (email: string) => {
  try {
    const { email: emailToAdd } = AddFriendSchema.parse({ email });
    
    const idToAdd = (await fetchRedis('get',`user:email:${emailToAdd}`) as string)

    if (!idToAdd) {
      throw new Error("This person does not exist");
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('Unauthorized Request');
    }

    if (idToAdd === session.user.id) {
      throw new Error('You cannot send a friend request to yourself');
    }

    const isAlreadyAdded = (await fetchRedis('sismember',`user:${idToAdd}:incoming_friend_requests`,session.user.id)) as 0 | 1;
    if(isAlreadyAdded) {
      throw new Error('Request Already Sent')
    }

    const isAlreadyFriends = (await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)) as 0 | 1;

    if(isAlreadyFriends) {
      throw new Error('Already added this user isAlreadyFriends');
    }

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    )
    db.sadd(`user:${idToAdd}:incoming_friend_requests`,session.user.id);


    return {
      success: true,
      message: 'Friend request sent',
      idToAdd
    };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid email format',
      };
    }
    return {
      success: false,
      message: error.message || 'Something went wrong',
    };
  }
};
