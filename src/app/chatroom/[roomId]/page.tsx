"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { messageArrayValidator } from "@/schema/Message";
import { fetchRedis } from "../../../../helper/redis";
import ParticipantsList from "@/components/ParticipantsList";
import { useParams } from "next/navigation";
import { House } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GroupChatMessage from "@/components/GroupChatMessage";
import ChatInput from "@/components/ChatInput";
import GroupChatInput from "@/components/GroupChatInput";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const params = useParams<{
    roomId: string;
  }>();
  const { toast } = useToast();
  // async function getRoomChatMessages(roomId: string) {
  //   try {
  //     const result: string[] = await fetchRedis(
  //       "zrange",
  //       `room:${roomId}:messages`,
  //       0,
  //       -1
  //     );
  //     const dbMessages = result.map(
  //       (message) => JSON.parse(message) as RoomMessage
  //     );
  //     const messages = dbMessages.reverse();
  //     const messages = messageArrayValidator.parse(reverseDbMessages);
  //     return messages as RoomMessage
  //   } catch (error) {
  //     console.error('No message found');
  //   }
  // }
  const joinLink = `${process.env.NEXT_BASE_URL}/join/${params.roomId}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinLink);
  };

  return (
    <div className="flex flex-col h-full flex-1 justify-between gap-1">
      <div className="relative flex items-center space-x-4">
        <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-gray-100">
          <House className="h-1/2 w-1/2 text-orange-500" />
        </div>
        <div className="flex items-center gap-2">
          <Input value={joinLink} disabled />
          <Button onClick={() => copyToClipboard}>Copy invite link</Button>
        </div>
      </div>
      <GroupChatMessage userId="nothing" initialMessages={[]} />
      <GroupChatInput roomId={params.roomId} />
    </div>
  );
};

export default Page;
