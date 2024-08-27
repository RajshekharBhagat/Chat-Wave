"use client";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestSideBarOptionProps {
  initialUnseenRequestCount: number;
  sessionId: string;
}

const FriendRequestSideBarOption = ({
  initialUnseenRequestCount,
  sessionId,
}: FriendRequestSideBarOptionProps) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
    const friendRequestHandler = () => {
      setUnseenRequestCount(unseenRequestCount + 1)
    }
    pusherClient.bind('incoming_friend_requests', friendRequestHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
    }
  }, [sessionId, unseenRequestCount]);
  return (
    <Link
      href={"/dashboard/requests"}
      className={buttonVariants({
        variant: "ghost",
        class:
          "w-full group flex items-center justify-center border border-gray-300 hover:translate-x-0.5 transition-transform duration-300 gap-2 p-2 rounded-lg shadow-sm hover:shadow-md",
      })}
    >
      <User className="w-5 h-5 text-slate-900 mr-2 group-hover:text-orange-500 transition-colors ease-in-out duration-300" />
      <span className="truncate text-slate-900 group-hover:text-orange-500 transition-colors ease-in-out duration-300">
        Friend requests
      </span>
      {unseenRequestCount > 0 && (
        <div className="ml-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
          {unseenRequestCount}
        </div>
      )}
    </Link>
  );
};

export default FriendRequestSideBarOption;
