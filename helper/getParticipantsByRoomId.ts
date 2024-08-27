import { fetchRedis } from "./redis";

export const getParticipantsByRoomId = async (roomId: string): Promise<User[]> => {
    try {
      const participantIds = await fetchRedis('smembers',`room:${roomId}:participants`) as string[];
        const participants = await Promise.all(
        participantIds.map(async (participantId) => {
          const participant = await fetchRedis('get', `user:${participantId}`) as string;
          const parsedParticipant = JSON.parse(participant) as User;
          return parsedParticipant;
        })
      );
      return participants;
    } catch (error: any) {
      console.error('Failed to get participants:', error.message);
      throw new Error('Failed to get participants');
    }
  };