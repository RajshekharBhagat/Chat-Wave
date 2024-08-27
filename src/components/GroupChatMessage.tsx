'use client';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { User } from "lucide-react";
import { useRef, useState } from "react";

interface GroupChatMessageProps {
  initialMessages: Message[];
  userId: string,
}

const GroupChatMessage = ({ initialMessages,userId }: GroupChatMessageProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const formatTimeStamp = (timeStamp: number) => {
    return format(timeStamp, "hh:mm");
  };
  return (
    <div
      id="messages"
      className="flex border h-full w-full flex-1 flex-col-reverse gap-1 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === userId;
        const hasNextMessageFromSameUser =
          index > 0 &&
          messages[index - 1].senderId === messages[index].senderId;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timeStamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex  flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    "px-4 py-2 text-zinc-900 rounded-lg inline-block",
                    {
                      "bg-orange-400": isCurrentUser,
                      "bg-gray-200": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    }
                  )}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-600">
                    {formatTimeStamp(message.timeStamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <User className="w-full h-full text-orange-500" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupChatMessage;
