import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { notFound } from "next/navigation";
import { getFriendsByUserId } from "../../../../helper/getFriendsByUserId";
import { fetchRedis } from "../../../../helper/redis";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);
  const friendsLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1, 
        -1,
      )) as string[];
      const lastMessage = JSON.parse(lastMessageRaw) as Message;
      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <div className="px-2 md:px-4">
      <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8">
        Recent Chats
      </h1>
      {friendsLastMessage.length === 0 ? (
        <p>Nothing to show</p>
      ) : (
        friendsLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md mb-2"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400 hidden xl:block" />
            </div>
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt="Profile Picture"
                    src={friend.image}
                    fill
                  />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === session.user.id ? 'You: ' : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
