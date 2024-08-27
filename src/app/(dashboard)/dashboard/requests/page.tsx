import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "../../../../../helper/redis";
import FriendRequest from "@/components/FriendRequest";


const Page = async () => {
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return notFound();
    }
    
    const incomingSenderIds = (await fetchRedis(
        "smembers",
        `user:${session.user.id}:incoming_friend_requests`
      )) as string[];  
      const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
          const sender = await fetchRedis('get',`user:${senderId}`) as string;
          const senderParsed = JSON.parse(sender) as User;
          return {
            senderId,
            senderEmail: senderParsed.email
          };
        })
      );
    if(!incomingFriendRequests) {
        return <div>
            No Friend Request Found
        </div>
    }  
    return (
        <div className="mt-10">
            <FriendRequest incomingFriendRequest={incomingFriendRequests} sessionId={session.user.id} />
        </div>
    )
};

export default Page;