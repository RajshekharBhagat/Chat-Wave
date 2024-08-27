"use client";

import { Check, Heart, UserPlus, X } from "lucide-react";
import { Button } from "./ui/button";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { acceptFriendRequest, rejectFriendRequests } from "@/app/(dashboard)/dashboard/requests/actions";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiResponse } from "../../types/ApiResponse";
import { cn, toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";

interface FriendRequestProps {
  incomingFriendRequest: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequest = ({
  incomingFriendRequest,
  sessionId,
}: FriendRequestProps) => {
    const {toast} = useToast();
    const router = useRouter();
    const [FriendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequest);
    useEffect(() => {
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      const friendRequestHandler = ({senderId,senderEmail}:IncomingFriendRequest) => {
          setFriendRequests((prev) => [...prev, {senderId, senderEmail}])
      }
      pusherClient.bind('incoming_friend_requests',friendRequestHandler);
      return () => {
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
        pusherClient.unbind('incoming_friend_requests',friendRequestHandler)
      }
    }, [sessionId])
    const {mutate: accept, isPending: acceptPending} = useMutation({
        mutationKey: ['accept-friend-request'],
        mutationFn: async(id: string) => await acceptFriendRequest(id),
        onSuccess: (response: ApiResponse) => {
            if(response.message) {
                toast({
                    title: "Accepted",
                    description: response.message,
                })
                setFriendRequests((prev) => prev.filter((request) => request.senderId !== response.data));
                router.refresh();
            } else {
                toast({
                    title: 'Failed',
                    description: response.message,
                })
            }
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Something went wrong',
                variant: 'destructive',
            })
        }
    });

    const {mutate: reject,isPending:rejectPending} = useMutation({
      mutationKey: ['reject-friend-request'],
      mutationFn: async (id: string) => await rejectFriendRequests(id),
      onSuccess: (response: ApiResponse) => {
        if(response.success) {
          toast({
            title: 'Rejected',
            description: response.message,
          });
          setFriendRequests((prev) => prev.filter((request) => request.senderId !== response.data));
          router.refresh();
        } else {
          toast({
            title: 'Failed',
            description: response.message,
            variant: 'destructive',
          })
        }
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    })

  return (
    <>
      {incomingFriendRequest.length === 0 ? (
        <div className="flex flex-col  overflow-hidden ">
          <div className="flex flex-col items-center py-5">
            <Heart className=" h-10 w-10 text-zinc-500 animate-bounce" />
            <h1 className="text-sm mt-2 text-zinc-500">No friend Request Available </h1>
          </div>
        </div>
      ) : (
        incomingFriendRequest.map((request) => (
          <div
            key={request.senderId}
            className="flex px-1.5 py-2 bg-neutral-100 shadow-md rounded-lg gap-5 items-center justify-evenly"
          >
            <UserPlus className="text-black ml-2" />
            <p className="font-medium text-sm">{request.senderEmail}</p>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-transparent rounded-md hover:bg-green-500 group"
                      variant={"ghost"}
                      aria-label="accept friend"
                      onClick={() => accept(request.senderId)}
                      isLoading={acceptPending}
                      spinner={true}
                    >
                      <Check className={cn('font-bold text-green-500 group-hover:text-white w-4 h-4', acceptPending ? 'hidden' : null)} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-transparent">
                    <p className="text-xs font-semibold text-zinc-900">
                      Accept request
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button
                      className="bg-transparent rounded-md hover:bg-red-500 group"
                      variant={"ghost"}
                      aria-label="accept friend"
                      onClick={() => reject(request.senderId)}
                      isLoading={rejectPending}
                      spinner={true}
                    >
                      <X className={cn('font-bold text-red-500 group-hover:text-white w-4 h-4', rejectPending ? 'hidden' : null)} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-transparent">
                    <p className="text-xs font-semibold text-zinc-900">
                      Reject request
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequest;
