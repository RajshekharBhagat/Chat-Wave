"use client";
import { chatHrefConstructor, cn, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import { pusherClient } from "@/lib/pusher";
import { useToast } from "./ui/use-toast";

interface SideBarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string,
  senderName: string,
}

const SideBarChatList = ({ friends, sessionId }: SideBarChatListProps) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const {toast} = useToast();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newMessageHandler = (message: ExtendedMessage) => {
      const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId,message.senderId)}`;
      if(!shouldNotify) return 
        toast({
          title: message.senderName,
          description: message.text,
          onClick:() => router.push(`/dashboard/chat/${chatHrefConstructor(sessionId,message.senderId)}`)
        });
        setUnseenMessages((prev) => [...prev,message])
    }

    const newFriendHandler = () => {
        router.refresh();
    }

    pusherClient.bind('newMessage',newMessageHandler);
    pusherClient.bind('newFriend',newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
    }
  },[pathname,router, sessionId, toast]);

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className={cn(
                buttonVariants({ variant: "ghost", class: "w-full text-sm text-gray-700 hover:text-primary border-b border-orange-200" })
              )}
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="bg-primary ml-1.5 font-medium text-xs w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarChatList;
